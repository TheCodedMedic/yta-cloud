"""Episode 04, first minute: synthesised sound effects, a temporary score timed to the words, and the trimmed voice.
Writes sfx_gen/*.wav, score_m1.wav and m1_voice.wav next to this file. Every time comes from timing (no typed seconds).
Run: python3 -I m1_audio.py"""
import json
import pathlib
import re
import subprocess

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
SR = 48000
T = json.load(open(HERE.parent.parent / "tools/yta-cloud/video/src/ep04/timing.json"))
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())


def at(b, w, n=1):
    hits = [x["s"] for x in T["words"] if x["b"] == b and norm(x["w"]) == norm(w)]
    return hits[n - 1]


PS = lambda b: T["beats"][b - 1]["s"]
PE = lambda b: T["beats"][b - 1]["e"]
END = PS(10) - 0.12 + 1.6
rng = np.random.default_rng(7)


# ─── tools ────────────────────────────────────────────────────────────────────
def lp(x, fc):
    a = np.exp(-2 * np.pi * np.asarray(fc) / SR) if np.ndim(fc) == 0 else np.exp(-2 * np.pi * fc / SR)
    y = np.zeros_like(x); s = 0.0
    if np.ndim(a) == 0:
        for i in range(len(x)): s = a * s + (1 - a) * x[i]; y[i] = s
    else:
        for i in range(len(x)): s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    return y


def lp_fast(x, fc):
    """One-pole low-pass via FFT-free vectorised scipy-less trick: repeated moving averages (good enough for beds)."""
    n = max(1, int(SR / (2 * np.pi * fc)))
    k = np.ones(n) / n
    return np.convolve(np.convolve(x, k, "same"), k, "same")


def hp_fast(x, fc):
    return x - lp_fast(x, fc)


def env(n, a, r, sus=1.0):
    e = np.ones(n) * sus
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, sus, na)
    if nr: e[-nr:] = e[-nr:] * np.linspace(1, 0, nr) ** 2
    return e


def reverb(x, secs=2.2, mix=0.3):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lp_fast(ir, 6000); ir /= np.abs(ir).sum() ** 0.5 * 4
    y = np.fft.irfft(np.fft.rfft(x, len(x) + n) * np.fft.rfft(ir, len(x) + n))[: len(x)]
    return x * (1 - mix) + y * mix


def saw(f, n, ph=0.0):
    t = np.arange(n) / SR
    return 2 * ((f * t + ph) % 1.0) - 1


def sine(f, n):
    if np.ndim(f) == 0: return np.sin(2 * np.pi * f * np.arange(n) / SR)
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def save(name, x, st=True):
    x = np.asarray(x, np.float32)
    x = x / (np.abs(x).max() + 1e-9) * 0.89
    stereo = np.stack([x, x], 1) if x.ndim == 1 else x
    path = HERE / name
    path.parent.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", str(path)], input=stereo.astype(np.float32).tobytes(), check=True)
    return path


# ─── sound effects ───────────────────────────────────────────────────────────
def crackle(secs=1.2):
    n = int(secs * SR); x = np.zeros(n)
    for _ in range(int(140 * secs)):
        i = rng.integers(0, n - 2000); L = rng.integers(80, 1800)
        x[i:i + L] += rng.standard_normal(L) * np.exp(-np.linspace(0, 6, L)) * rng.uniform(0.3, 1)
    buzz = saw(110, n) * 0.15 * (rng.random(n) > 0.6)
    return hp_fast(x + buzz, 900) * env(n, 0.01, 0.2)


def thunder(secs=5.0):
    n = int(secs * SR); x = rng.standard_normal(n)
    crack = hp_fast(x[: int(0.25 * SR)], 1500) * np.exp(-np.linspace(0, 5, int(0.25 * SR)))
    roll = lp_fast(x, 140) * env(n, 0.05, 3.5) * (1 + 0.5 * np.sin(np.arange(n) / SR * 9))
    roll[: len(crack)] += crack * 3
    return reverb(roll, 3, 0.35)


def freeze_whoosh(secs=1.6):
    n = int(secs * SR); f = np.linspace(2200, 120, n)
    x = rng.standard_normal(n); y = np.zeros(n); s = 0.0
    a = np.exp(-2 * np.pi * f / SR)
    for i in range(n): s = a[i] * s + (1 - a[i]) * x[i]; y[i] = s
    tone = sine(np.linspace(880, 220, n), n) * 0.2
    return reverb((y * 3 + tone) * env(n, 0.02, 0.9), 2.5, 0.45)


def tear(secs=3.0):
    n = int(secs * SR)
    rise_n = int(0.6 * SR)
    rise = hp_fast(rng.standard_normal(rise_n), 2000) * np.linspace(0, 1, rise_n) ** 3
    boom = sine(np.linspace(90, 28, n), n) * np.exp(-np.linspace(0, 4, n)) * 1.6
    burst = rng.standard_normal(n) * np.exp(-np.linspace(0, 12, n)) * 0.8
    x = np.zeros(n + rise_n); x[:rise_n] += rise; x[rise_n:] += boom + burst
    return reverb(np.tanh(x * 1.4), 2.8, 0.35)


def tunnel_roar(secs=9.0):
    n = int(secs * SR); x = rng.standard_normal(n)
    y = lp_fast(x, 400) * 2 + hp_fast(lp_fast(x, 3000), 900) * 0.4
    wob = 1 + 0.3 * np.sin(np.arange(n) / SR * 2 * np.pi * 0.7)
    return y * wob * env(n, 0.3, 1.0)


def zap(secs=0.6):
    n = int(secs * SR)
    return (saw(np.linspace(1800, 200, n).mean(), n) * 0.3 + hp_fast(rng.standard_normal(n), 3000)) * np.exp(-np.linspace(0, 8, n))


def hit(secs=3.5):
    n = int(secs * SR)
    sub = sine(np.linspace(60, 34, n), n) * np.exp(-np.linspace(0, 3, n))
    body = lp_fast(rng.standard_normal(n), 900) * np.exp(-np.linspace(0, 9, n)) * 2
    return reverb(np.tanh((sub * 1.8 + body) * 1.3), 3.0, 0.3)


def tick():
    n = int(0.05 * SR)
    return hp_fast(rng.standard_normal(n), 3000) * np.exp(-np.linspace(0, 30, n))


GEN = {"crackle": crackle(), "crackle_long": crackle(3.5), "thunder": thunder(), "freeze": freeze_whoosh(), "tear": tear(),
       "tunnel": tunnel_roar(), "zap": zap(), "hit": hit()}
for k, v in GEN.items(): save(f"sfx_gen/{k}.wav", v)


# ─── temporary score (stereo), events on the story beats ─────────────────────
N = int((END + 1.0) * SR)
L = np.zeros(N); R = np.zeros(N)


def put(x, t, gain=1.0, pan=0.0):
    i = int(t * SR); x = x[: max(0, N - i)]
    L[i:i + len(x)] += x * gain * (1 - pan) ** 0.5 * 1.0
    R[i:i + len(x)] += x * gain * (1 + pan) ** 0.5 * 1.0


def pad(freqs, t0, t1, gain=0.2, cut=1200, a=0.8, r=1.2, det=0.004):
    n = int((t1 - t0) * SR)
    x = sum(saw(f * (1 + d), n, ph=k * 0.13) for k, f in enumerate(freqs) for d in (-det, det))
    put(lp_fast(x / (2 * len(freqs)), cut) * env(n, a, r), t0, gain)


def pulse(t0, t1, bpm, gain=0.5, f=46):
    beat = 60 / bpm; t = t0
    while t < t1:
        n = int(0.4 * SR)
        k = sine(np.linspace(f * 2.2, f, n), n) * np.exp(-np.linspace(0, 7, n))
        put(np.tanh(k * 2), t, gain); t += beat


def ticks(t0, t1, bpm, gain=0.25):
    beat = 60 / bpm; t = t0; s = 0
    while t < t1:
        put(tick(), t, gain, pan=0.4 if s % 2 else -0.4); t += beat; s += 1


def riser(t_end, secs, gain=0.5):
    n = int(secs * SR)
    x = hp_fast(rng.standard_normal(n), 1500) * np.linspace(0, 1, n) ** 2.5 + sine(np.linspace(200, 900, n), n) * 0.15 * np.linspace(0, 1, n)
    put(x, t_end - secs, gain)


Am, F, C, G, Dm, E = [110, 130.8, 164.8], [87.3, 110, 130.8], [130.8, 164.8, 196], [98, 123.5, 146.8], [146.8, 174.6, 220], [82.4, 103.8, 123.5]
t_stop, t_lit, t_go, t_world = at(1, "stops"), at(3, "Lightning"), at(3, "street"), at(3, "world")
# cold open: tension pulse + clock, cut on the freeze
pad(Am, 0, t_stop + 0.2, 0.22, 900, 0.3, 0.25)
pulse(0.0, t_stop, 112, 0.55); ticks(0.0, t_stop, 224, 0.2)
# frozen time: thin high shimmer only
pad([440, 659, 880], t_stop + 0.1, t_lit + 0.3, 0.07, 3000, 1.2, 0.8, det=0.002)
# lightning build -> burst -> tear
pad(E, t_lit, t_world, 0.2, 700, 1.0, 0.1); riser(t_world, 2.2, 0.5)
pulse(t_go, t_world, 140, 0.6)
# tunnel and face: driving
pulse(t_world + 0.05, PE(4) + 0.3, 140, 0.55); ticks(t_world, PE(4), 280, 0.15)
pad(Am, t_world, PE(4) + 0.6, 0.24, 1100, 0.2, 0.5)
# rewrite -> title hit
riser(PS(5), 2.4, 0.6); pad(F, PS(5), at(5, "On"), 0.3, 1500, 0.05, 1.0)
# on foot / park: warm and moving
pad(C, at(5, "On"), PS(6), 0.2, 1600, 0.5, 0.4); pulse(at(5, "By"), PS(6), 120, 0.35); ticks(at(5, "By"), PS(6), 240, 0.12)
# plaza: hopeful, then it turns
pad(G, PS(6), at(6, "Right") + 0.3, 0.22, 2000, 0.4, 0.6)
pad([92.5, 116.5, 138.6], at(6, "Right"), PS(7) + 0.4, 0.2, 800, 0.6, 0.6)
# rules: low pulse and clock, a hit on "year", the bedroom jump, the scars
pad(Dm, PS(7), END, 0.16, 800, 1.0, 1.5)
ticks(PS(7), END - 1.0, 120, 0.18); pulse(at(7, "jog"), PS(8) - 0.1, 120, 0.35)
riser(at(7, "year"), 1.2, 0.4)
riser(at(9, "hundred"), 1.6, 0.55)
mix = np.stack([L, R], 1); mix = np.tanh(mix * 1.2)
mix = np.stack([reverb(mix[:, 0], 2.2, 0.25), reverb(mix[:, 1], 2.4, 0.25)], 1)
save("score_m1.wav", mix)

# ─── voice for this cut: master up to the start of beat 10 ───────────────────
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(HERE / "master_voiceover.wav"), "-t", f"{PS(10) - 0.05:.3f}",
                "-af", f"afade=t=out:st={PS(10) - 0.25:.3f}:d=0.2,apad=whole_dur={END:.3f}", str(HERE / "m1_voice.wav")], check=True)
json.dump({"END": END}, open(HERE / "m1_meta.json", "w"))
print("ok", round(END, 2))
