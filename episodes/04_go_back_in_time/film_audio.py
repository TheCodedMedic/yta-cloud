"""Episode 04 full film: extra synthesised sound effects and the temporary score for the whole episode, timed to the words.
Writes sfx_gen/*.wav (adds to the first-minute set), score_full.wav and film_voice.wav. Run: python3 -I film_audio.py"""
import json
import os
import pathlib
import re
import subprocess

import numpy as np

HERE = pathlib.Path(__file__).resolve().parent
SR = 48000
T = json.load(open(HERE.parent.parent / "tools/yta-cloud/video/src/ep04/timing.json"))
norm = lambda s: re.sub(r"[^a-z0-9']", "", s.lower())


def at(b, w, n=1):
    return [x["s"] for x in T["words"] if x["b"] == b and norm(x["w"]) == norm(w)][n - 1]


PS = lambda b: T["beats"][b - 1]["s"]
PE = lambda b: T["beats"][b - 1]["e"]
END = PE(87) + 2.4
rng = np.random.default_rng(11)


def lp(x, fc):
    n = max(1, int(SR / (2 * np.pi * fc))); k = np.ones(n) / n
    return np.convolve(np.convolve(x, k, "same"), k, "same")


hp = lambda x, fc: x - lp(x, fc)


def env(n, a, r, sus=1.0):
    e = np.ones(n) * sus
    na, nr = int(a * SR), int(r * SR)
    if na: e[:na] = np.linspace(0, sus, na)
    if nr and nr < n: e[-nr:] = e[-nr:] * np.linspace(1, 0, nr) ** 2
    return e


def reverb(x, secs=2.2, mix=0.3):
    n = int(secs * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n)); ir = lp(ir, 6000); ir /= np.abs(ir).sum() ** 0.5 * 4
    y = np.fft.irfft(np.fft.rfft(x, len(x) + n) * np.fft.rfft(ir, len(x) + n))[: len(x)]
    return x * (1 - mix) + y * mix


saw = lambda f, n, ph=0.0: 2 * ((f * np.arange(n) / SR + ph) % 1.0) - 1


def sine(f, n):
    return np.sin(2 * np.pi * f * np.arange(n) / SR) if np.ndim(f) == 0 else np.sin(2 * np.pi * np.cumsum(f) / SR)


def save(name, x):
    x = np.asarray(x, np.float32); x = x / (np.abs(x).max() + 1e-9) * 0.89
    st = np.stack([x, x], 1) if x.ndim == 1 else x
    p = HERE / name; p.parent.mkdir(exist_ok=True)
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", "-", str(p)], input=st.astype(np.float32).tobytes(), check=True)


# ─── extra effects ───────────────────────────────────────────────────────────
def screech(secs=1.6):
    n = int(secs * SR); f = np.linspace(2600, 1400, n)
    x = sine(f, n) * 0.4 + sine(f * 1.51, n) * 0.25 + hp(rng.standard_normal(n), 2500) * 0.35
    return x * env(n, 0.05, 0.5) * (1 + 0.3 * np.sin(np.arange(n) / SR * 2 * np.pi * 23))


def passby(secs=2.6):
    n = int(secs * SR); u = np.linspace(-1, 1, n)
    amp = 1 / (1 + 12 * u * u); f = 70 + 30 * np.tanh(-u * 3)
    x = (saw(80, n) * 0.4 + lp(rng.standard_normal(n), 600)) * amp + sine(f, n) * amp * 0.3
    return x


def whistle(secs=0.7):
    n = int(secs * SR)
    return (sine(2900, n) + 0.3 * sine(2950, n)) * (1 + 0.5 * np.sin(np.arange(n) / SR * 2 * np.pi * 40)) * env(n, 0.01, 0.15)


def piano_note(f, secs=2.5):
    n = int(secs * SR)
    x = sum(sine(f * k, n) * a for k, a in [(1, 1), (2, 0.45), (3, 0.2), (4, 0.1)])
    return x * np.exp(-np.linspace(0, 4.5, n)) * env(n, 0.005, 0.2)


def bell(f=392, secs=4.0):
    n = int(secs * SR)
    return sum(sine(f * k, n) * a for k, a in [(1, 1), (2.76, 0.5), (5.4, 0.25)]) * np.exp(-np.linspace(0, 5, n))


def tick():
    n = int(0.05 * SR)
    return hp(rng.standard_normal(n), 3000) * np.exp(-np.linspace(0, 30, n))


def hit(secs=3.5):
    n = int(secs * SR)
    sub = sine(np.linspace(60, 34, n), n) * np.exp(-np.linspace(0, 3, n))
    body = lp(rng.standard_normal(n), 900) * np.exp(-np.linspace(0, 9, n)) * 2
    return reverb(np.tanh((sub * 1.8 + body) * 1.3), 3.0, 0.3)


for k, v in {"screech": screech(), "passby": passby(), "whistle": whistle(), "bell": reverb(bell(), 3, 0.4), "tick": tick()}.items():
    save(f"sfx_gen/{k}.wav", v)

# ─── the score ───────────────────────────────────────────────────────────────
N = int((END + 1.0) * SR)
L = np.zeros(N); R = np.zeros(N)


def put(x, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    x = x[: N - i]
    L[i:i + len(x)] += x * gain * (1 - pan) ** 0.5
    R[i:i + len(x)] += x * gain * (1 + pan) ** 0.5


def pad(freqs, t0, t1, gain=0.2, cut=1200, a=0.8, r=1.2, det=0.004):
    n = int((t1 - t0) * SR)
    if n <= 0: return
    x = sum(saw(f * (1 + d), n, ph=k * 0.13) for k, f in enumerate(freqs) for d in (-det, det))
    put(lp(x / (2 * len(freqs)), cut) * env(n, a, min(r, (t1 - t0) / 2)), t0, gain)


def pulse(t0, t1, bpm, gain=0.5, f=46):
    t = t0
    while t < t1:
        n = int(0.4 * SR); k = sine(np.linspace(f * 2.2, f, n), n) * np.exp(-np.linspace(0, 7, n))
        put(np.tanh(k * 2), t, gain); t += 60 / bpm


def ticks(t0, t1, bpm, gain=0.25):
    t, s = t0, 0
    while t < t1: put(tick(), t, gain, 0.4 if s % 2 else -0.4); t += 60 / bpm; s += 1


def riser(t_end, secs, gain=0.5):
    n = int(secs * SR)
    x = hp(rng.standard_normal(n), 1500) * np.linspace(0, 1, n) ** 2.5 + sine(np.linspace(200, 900, n), n) * 0.15 * np.linspace(0, 1, n)
    put(x, t_end - secs, gain)


def plucks(t0, t1, bpm, notes, gain=0.25):
    t, k = t0, 0
    while t < t1:
        f = notes[k % len(notes)]; n = int(0.35 * SR)
        put(sine(f, n) * np.exp(-np.linspace(0, 10, n)), t, gain, 0.3 if k % 2 else -0.3); t += 60 / bpm; k += 1


def piano(t0, t1, chords, every=2.4, gain=0.35):
    t, k = t0, 0
    while t < t1:
        for j, f in enumerate(chords[k % len(chords)]): put(piano_note(f, min(every + 1, 4)), t + j * 0.04, gain / 3)
        t += every; k += 1


def heartbeat(t0, t1, bpm=70, gain=0.6):
    t = t0
    while t < t1:
        for d, g in [(0, 1), (0.22, 0.7)]:
            n = int(0.25 * SR); put(np.tanh(sine(np.linspace(80, 40, n), n) * np.exp(-np.linspace(0, 9, n)) * 2) * g, t + d, gain)
        t += 60 / bpm


# STINGS=1 keeps only the hits, risers, heartbeats and the clock ticks; the music under the voice comes from licensed tracks (cues_full.py)
STINGS = os.environ.get("STINGS") == "1"
if STINGS:
    pad = plucks = piano = pulse = lambda *a, **k: None
    _ticks = ticks
    ticks = lambda t0, t1, bpm, gain=0.25: _ticks(t0, t1, bpm, gain) if gain >= 0.4 else None

Am, F, C, G, Dm, E = [110, 130.8, 164.8], [87.3, 110, 130.8], [130.8, 164.8, 196], [98, 123.5, 146.8], [146.8, 174.6, 220], [82.4, 103.8, 123.5]
P_Am, P_F, P_C, P_G = [220, 261.6, 329.6], [174.6, 220, 261.6], [261.6, 329.6, 392], [196, 246.9, 293.7]
P = lambda b: PS(b) - 0.12

# 0–63 · cold open and rules (as approved in the first minute)
t_stop, t_lit, t_go, t_world = at(1, "stops"), at(3, "Lightning"), at(3, "street"), at(3, "world")
pad(Am, 0, t_stop + 0.2, 0.22, 900, 0.3, 0.25); pulse(0.0, t_stop, 112, 0.55); ticks(0.0, t_stop, 224, 0.2)
pad([440, 659, 880], t_stop + 0.1, t_lit + 0.3, 0.07, 3000, 1.2, 0.8, det=0.002)
pad(E, t_lit, t_world, 0.2, 700, 1.0, 0.1); riser(t_world, 2.2, 0.5); pulse(t_go, t_world, 140, 0.6)
pulse(t_world + 0.05, PE(4) + 0.3, 140, 0.55); ticks(t_world, PE(4), 280, 0.15); pad(Am, t_world, PE(4) + 0.6, 0.24, 1100, 0.2, 0.5)
riser(PS(5), 2.4, 0.6); put(hit(), at(5, "go"), 0.7); pad(F, PS(5), at(5, "On"), 0.3, 1500, 0.05, 1.0)
pad(C, at(5, "On"), PS(6), 0.2, 1600, 0.5, 0.4); pulse(at(5, "By"), PS(6), 120, 0.35); ticks(at(5, "By"), PS(6), 240, 0.12)
pad(G, PS(6), at(6, "Right") + 0.3, 0.22, 2000, 0.4, 0.6); pad([92.5, 116.5, 138.6], at(6, "Right"), PS(7) + 0.4, 0.2, 800, 0.6, 0.6)
pad(Dm, PS(7), P(10), 0.16, 800, 1.0, 1.0); ticks(PS(7), P(10) - 0.5, 120, 0.18); pulse(at(7, "jog"), PS(8) - 0.1, 120, 0.35)
riser(at(7, "year"), 1.2, 0.4); riser(at(9, "hundred"), 1.6, 0.55); put(hit(), at(9, "hundred"), 0.5)
# 63–88 · space and GPS: airy
pad([261.6, 329.6, 392, 493.9], P(10), P(13), 0.13, 2500, 1.5, 1.5, det=0.002); plucks(P(11), P(12), 90, [523, 659, 784, 988], 0.12)
pad([92.5, 138.6], at(12, "Going", 2), P(13), 0.2, 600, 0.3, 0.8)
# 88–98 · Tuesday: light, bouncy
plucks(P(13), P(15), 124, [392, 494, 587, 494], 0.18); pulse(P(14), P(15), 124, 0.3)
# 98–110 · slow motion: a held breath, reversed swell
pad([220, 330, 440], P(15), P(16), 0.1, 2500, 1.5, 0.3, det=0.001); riser(at(16, "flash"), 1.8, 0.35)
# 110–138 · the tests: upbeat montage
plucks(P(17), P(25), 124, [392, 523, 659, 523, 587, 494], 0.2); pulse(P(19), P(25), 124, 0.42); ticks(P(19), P(25), 248, 0.1)
pad(C, P(19), P(25), 0.14, 1500, 0.5, 0.8)
# 138–160 · the cost, then the turn to Jamie
pad(G, P(25), P(27), 0.14, 1400, 0.5, 0.8); plucks(P(26), P(27), 110, [392, 494, 587], 0.12)
piano(at(27, "Then"), P(28), [P_Am, P_F], 2.4, 0.35)
# 160–203 · memory, voice note, the decision
piano(P(28), P(33), [P_Am, P_F, P_C, P_G], 2.6, 0.35); pad(Am, P(28), P(33), 0.12, 900, 2.0, 1.5)
pad(E, P(33), P(36), 0.18, 800, 1.0, 0.5); pulse(P(34), P(36), 96, 0.35); heartbeat(P(35), at(36, "run"), 84, 0.4)
# 203–229 · the run and the year rewinding
riser(at(36, "run") + 0.3, 2.0, 0.6); put(hit(), at(36, "run") + 0.3, 0.6)
pulse(at(36, "run") + 0.5, P(40), 140, 0.5); ticks(P(37), P(40), 280, 0.12); pad(Am, at(36, "run"), P(40), 0.2, 1200, 0.5, 0.5)
pad([440, 523, 659], P(38), P(40), 0.1, 2400, 0.5, 0.5)
# 229–257 · Mill Road: dread, the run, slow motion, then silence on the pull
pad([82.4, 87.3, 123.5], P(40), at(43, "run"), 0.22, 600, 0.5, 0.2); heartbeat(P(41), at(43, "run"), 96, 0.5)
pulse(at(43, "run"), P(44), 150, 0.6); riser(P(44), 1.4, 0.5)
pad([55, 82.4, 110], P(44), at(45, "pull"), 0.22, 400, 0.4, 0.2); heartbeat(P(44), at(45, "pull") - 0.2, 40, 0.6)
# 257–275 · alive: warm relief
piano(PS(46), P(51), [P_C, P_G, P_Am, P_F], 2.2, 0.38); pad(C, PS(47), P(51), 0.14, 1600, 1.0, 1.0)
# 275–304 · forward, the perfect morning... the car park, the friend
pulse(P(51), P(52), 130, 0.3); piano(P(52), P(55), [P_C, P_F, P_G, P_C], 2.0, 0.3)
put(hit(1.5), at(55, "car"), 0.35); pad([92.5, 116.5, 138.6], at(55, "car"), P(57), 0.16, 700, 0.4, 0.8)
# 304–333 · butterfly, Lorenz, chaos: curious minor arpeggio, building
plucks(P(57), P(61), 100, [440, 523, 659, 784, 659, 523], 0.15); pad(Am, P(58), P(61), 0.12, 1000, 1.0, 0.5)
put(hit(2), at(60, "chaos"), 0.35)
# 333–360 · fixing it, making it worse: driving, escalating
pulse(P(61), P(65), 132, 0.45); ticks(P(61), P(65), 264, 0.14); pad([110, 116.5, 164.8], P(61), P(65), 0.18, 900, 0.4, 0.5)
riser(at(62, "But"), 1.0, 0.35); riser(at(63, "When"), 1.0, 0.35); riser(at(64, "cracked"), 1.5, 0.4)
# 360–396 · Novikov, the glitches, déjà vu: eerie
pad([220, 233, 330], P(65), P(70), 0.13, 1800, 1.0, 1.0, det=0.006)
for k in range(10): pulse(P(67) + k * 0.8, P(67) + k * 0.8 + 0.3, 200, 0.25)
# 396–415 · the deal and the last run
piano(P(70), P(73), [P_Am, P_F, P_C, P_G], 2.3, 0.4); pad(Am, P(70), P(73), 0.18, 1400, 1.0, 0.3)
riser(at(73, "Lightning"), 1.4, 0.7); put(hit(), at(73, "Lightning"), 0.8); pulse(at(73, "Lightning"), at(73, "Silence") - 0.05, 160, 0.6)
# 413.8–419.8 · total silence. 420–448 · morning, relief, then the message
piano(P(75), P(80), [P_C, P_G, P_F, P_C], 2.4, 0.33); pad(C, PS(76), P(80), 0.12, 1800, 1.0, 1.0)
pad([82.4, 87.3], at(80, "buzzes"), PE(83), 0.2, 500, 0.3, 0.5); heartbeat(at(82, "Don't") - 0.5, PE(83), 72, 0.5)
put(hit(2), at(81, "Sent"), 0.35)
# 448–457 · clocks stop, the crack, the frozen city
ticks(PS(83), PE(83) + 0.3, 60, 0.4); put(hit(), PE(83) + 1.4, 0.6); pad([55, 82.4, 110, 164.8], PE(83) + 1.4, PS(84) - 0.45, 0.24, 1200, 0.6, 0.3)
# 457–461 · teaser: a hit on every flash, then PART 2
for k, tt in enumerate([PS(84) - 0.15, PE(84) + 0.15, PE(84) + 0.45, PE(84) + 0.75, PE(84) + 1.05]): put(hit(1.2), tt, 0.45)
heartbeat(PS(84), PE(85), 110, 0.35); put(hit(4), PE(85) + 0.25, 0.9)
pad(Am, PE(85) + 0.3, END, 0.14, 1200, 0.8, 1.5); put(reverb(bell(), 3, 0.4), at(87, "In"), 0.5)

mix = np.stack([L, R], 1); mix = np.tanh(mix * 1.2)
mix = np.stack([reverb(mix[:, 0], 2.2, 0.25), reverb(mix[:, 1], 2.4, 0.25)], 1)
save("score_stings.wav" if STINGS else "score_full.wav", mix)
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(HERE / "master_voiceover.wav"), "-af", f"apad=whole_dur={END:.3f}", "-t", f"{END:.3f}", str(HERE / "film_voice.wav")], check=True)
json.dump({"END": END}, open(HERE / "film_meta.json", "w"))
print("ok", round(END, 2))
