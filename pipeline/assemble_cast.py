"""Assemble a cast episode: trim each beat, level-match (per speaker gain from config/voices.json), place with designed gaps.

Usage: python3 pipeline/assemble_cast.py episodes/<name>
Gaps come from episodes/<name>/gaps.json ({"beat index (0-based)": seconds}); default 0.45 s, 0.3 s between quick dialogue.
Writes master_voiceover.wav (48 kHz), narrator_16k.wav, timeline_chunks.json.
"""
import json, pathlib, subprocess, sys
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
EP = pathlib.Path(sys.argv[1])
SR, LEAD, TAIL, DEFAULT_GAP = 48000, 0.3, 3.0, 0.45
VOICES = json.loads((ROOT / "config" / "voices.json").read_text())
paras = [p.strip() for p in (EP / "script.txt").read_text().split("\n\n") if p.strip()]
spk = json.loads((EP / "speakers.json").read_text())
gp = EP / "gaps.json"
GAP = {int(k): v for k, v in json.loads(gp.read_text()).items()} if gp.exists() else {}

def load(path):
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse,silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-af", trim, "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()

def speech_rms(x):
    win = int(0.3 * SR)
    r = np.array([np.sqrt(np.mean(x[i:i + win] ** 2)) for i in range(0, max(1, len(x) - win), win)])
    return float(np.median(r[r > 0.02])) if (r > 0.02).any() else float(r.max() + 1e-6)

clips = [load(EP / "audio" / f"para_{i:03d}.mp3") for i in range(len(paras))]
levels = [speech_rms(c) for c in clips]
target = float(np.median([l for l, s in zip(levels, spk) if s == "N"]))
fade = int(0.01 * SR)
out, chunks, t = [np.zeros(int(LEAD * SR), np.float32)], [], LEAD
for i, (c, lv) in enumerate(zip(clips, levels)):
    g = np.clip(target / lv, 10 ** (-6 / 20), 10 ** (6 / 20)) * 10 ** (VOICES[spk[i]].get("gain_db", 0) / 20)
    c = c * g; c[:fade] *= np.linspace(0, 1, fade); c[-fade:] *= np.linspace(1, 0, fade)
    if i == len(paras) - 1: gap = TAIL
    elif i in GAP: gap = GAP[i]
    elif spk[i] != "N" and spk[i + 1] != "N": gap = 0.3
    else: gap = DEFAULT_GAP
    chunks.append({"index": i, "speaker": spk[i], "start": round(t, 3), "end": round(t + len(c) / SR, 3), "gap_after": gap, "text": paras[i]})
    out += [c, np.zeros(int(gap * SR), np.float32)]
    t += len(c) / SR + gap
mix = np.concatenate(out); mix *= 0.93 / np.abs(mix).max()
pcm = (mix * 32767).astype(np.int16).tobytes()
for name, rate in (("master_voiceover.wav", SR), ("narrator_16k.wav", 16000)):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1", "-i", "-", "-ar", str(rate), str(EP / name)], input=pcm, check=True)
(EP / "timeline_chunks.json").write_text(json.dumps(chunks, indent=1))
print(f"{len(paras)} beats, total {t:.1f} s")
