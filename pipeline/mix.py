"""Mix voice + ambience beds + effects from a cue sheet -> 48 kHz stereo WAV.

Usage: python3 -I pipeline/mix.py <cues.py> <out.wav>

The cue sheet is a Python file defining:
  VOICE = "path/to/master_voiceover.wav"
  LENGTH = seconds                               # total length of the mix
  BEDS = [(name, start, end, rel_db, fade_in, fade_out), ...]
  SFX  = [(name, time, rel_db), ...]
Names resolve to sfx/library/<name>.wav (or a path). rel_db is the level of the
sound's loudest 0.3 s relative to the voice's speech level (negative = quieter),
so effects never jump out over the narration. Beds loop to fill their span and
duck under the voice (up to -45 %).
"""
import importlib.util
import pathlib
import subprocess
import sys

import numpy as np

SR = 48000
ROOT = pathlib.Path(__file__).resolve().parent.parent
LIB = ROOT / "sfx" / "library"


def load(path):
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "2", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).reshape(-1, 2).copy()


def resolve(name):
    p = pathlib.Path(name)
    if p.suffix and p.exists():
        return p
    for ext in (".ogg", ".wav"):
        if (LIB / f"{name}{ext}").exists():
            return LIB / f"{name}{ext}"
    raise FileNotFoundError(f"no sound named {name} in {LIB}")


def resolve_ok(name):
    try:
        resolve(name)
        return True
    except FileNotFoundError:
        return False


def loudest(x, win=0.3):
    n = int(win * SR)
    mono = x.mean(axis=1)
    if len(mono) <= n:
        return float(np.sqrt(np.mean(mono ** 2)) + 1e-9)
    c = np.cumsum(np.concatenate([[0], mono ** 2]))
    return float(np.sqrt((c[n:] - c[:-n]).max() / n) + 1e-9)


def speech_level(v):
    n = int(0.3 * SR)
    mono = v.mean(axis=1)
    r = np.array([np.sqrt(np.mean(mono[i:i + n] ** 2)) for i in range(0, len(mono) - n, n)])
    return float(np.median(r[r > 0.02]))


def main(cue_path, out_path):
    spec = importlib.util.spec_from_file_location("cues", cue_path)
    cues = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(cues)

    missing = sorted({n for n in [b[0] for b in cues.BEDS] + [x[0] for x in cues.SFX] if not resolve_ok(n)})
    if missing:
        sys.exit(f"cue sheet names sounds that are not in the library: {missing}")
    total = int(cues.LENGTH * SR)
    voice = load(cues.VOICE)[:total]
    voice = np.pad(voice, ((0, total - len(voice)), (0, 0)))
    vref = speech_level(voice)

    # voice envelope for ducking (0.25 s window)
    n = int(0.25 * SR)
    c = np.cumsum(np.concatenate([[0.0], np.abs(voice.mean(axis=1)).astype(np.float64)]))
    idx = np.arange(total); h = n // 2
    e = (c[np.clip(idx + (n - h), 0, total)] - c[np.clip(idx - h, 0, total)]) / n  # moving average (same as the convolution, much faster)
    duck = 1 - 0.45 * np.clip(e / (vref * 0.6), 0, 1)

    beds = np.zeros((total, 2), np.float32)
    cache = {}

    def get(name):
        if name not in cache:
            cache[name] = load(resolve(name))
        return cache[name]

    for name, start, stop, rel, fi, fo in cues.BEDS:
        clip = get(name)
        a, b = int(start * SR), min(total, int(stop * SR))
        if b <= a:
            continue
        reps = int(np.ceil((b - a) / len(clip)))
        seg = np.tile(clip, (reps, 1))[: b - a]
        gain = vref * 10 ** (rel / 20) / loudest(clip, 3.0)
        env = np.ones(b - a, np.float32)
        nfi, nfo = int(fi * SR), int(fo * SR)
        if nfi:
            env[:nfi] = np.linspace(0, 1, min(nfi, b - a))
        if nfo:
            env[-nfo:] = np.minimum(env[-nfo:], np.linspace(1, 0, min(nfo, b - a)))
        beds[a:b] += seg * gain * env[:, None]
    beds *= duck[:, None]

    fx = np.zeros((total, 2), np.float32)
    for name, at, rel in cues.SFX:
        clip = get(name)
        a = int(at * SR)
        if a >= total or a < 0:
            continue
        gain = vref * 10 ** (rel / 20) / loudest(clip)
        seg = clip[: total - a] * gain
        fx[a:a + len(seg)] += seg

    mix = voice + beds + fx
    peak = np.abs(mix).max()
    if peak > 0.98:
        mix *= 0.98 / peak
    pcm = (mix * 32767).astype(np.int16).tobytes()
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "2", "-i", "-", out_path],
                   input=pcm, check=True)
    print(f"mixed {cues.LENGTH:.1f} s: {len(cues.BEDS)} beds, {len(cues.SFX)} effects -> {out_path}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
