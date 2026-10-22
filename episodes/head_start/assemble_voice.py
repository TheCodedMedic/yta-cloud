"""Build master_voiceover.wav and timeline_chunks.json from audio/para_NNN.mp3.

Each clip is trimmed, loudness-matched to the median clip, and placed with the
designed silence from GAP after it (picture beats: title card, the train).
"""
import json
import pathlib
import subprocess

import numpy as np

EP = pathlib.Path(__file__).resolve().parent
SR = 48000
DEFAULT_GAP = 0.45
# seconds of silence after beat i
GAP = {4: 0.6, 5: 2.2, 7: 0.6, 8: 1.0, 13: 0.9, 18: 1.5, 19: 1.2, 21: 0.3,
       22: 0.8, 25: 0.3, 26: 3.0, 28: 1.0, 30: 1.5}
LEAD, TAIL = 0.3, 3.5

paras = [p.strip() for p in (EP / "script.txt").read_text().split("\n\n") if p.strip()]


def load(path):
    trim = "silenceremove=start_periods=1:start_threshold=-45dB,areverse," \
           "silenceremove=start_periods=1:start_threshold=-45dB,areverse"
    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-af", trim,
         "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def speech_rms(x):
    win = int(0.3 * SR)
    r = np.array([np.sqrt(np.mean(x[i:i + win] ** 2)) for i in range(0, len(x) - win, win)])
    return float(np.median(r[r > 0.02])) if (r > 0.02).any() else float(r.max())


clips = [load(EP / "audio" / f"para_{i:03d}.mp3") for i in range(len(paras))]
levels = [speech_rms(c) for c in clips]
target = float(np.median(levels))
fade = int(0.01 * SR)

out, chunks, t = [np.zeros(int(LEAD * SR), np.float32)], [], LEAD
for i, (c, lv) in enumerate(zip(clips, levels)):
    gain = np.clip(target / lv, 10 ** (-3 / 20), 10 ** (3 / 20))
    c = c * gain
    c[:fade] *= np.linspace(0, 1, fade)
    c[-fade:] *= np.linspace(1, 0, fade)
    gap = GAP.get(i, DEFAULT_GAP) if i < len(paras) - 1 else TAIL
    chunks.append({"index": i, "speaker": "N", "start": round(t, 3),
                   "end": round(t + len(c) / SR, 3), "gap_after": gap, "text": paras[i]})
    out += [c, np.zeros(int(gap * SR), np.float32)]
    t += len(c) / SR + gap

mix = np.concatenate(out)
mix *= 0.93 / np.abs(mix).max()
pcm = (mix * 32767).astype(np.int16).tobytes()
for name, rate in (("master_voiceover.wav", SR), ("narrator_16k.wav", 16000)):
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "s16le", "-ar", str(SR), "-ac", "1",
                    "-i", "-", "-ar", str(rate), str(EP / name)], input=pcm, check=True)
(EP / "timeline_chunks.json").write_text(json.dumps(chunks, indent=1))
print(f"{len(paras)} beats, total {t:.1f} s")
