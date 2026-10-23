"""Voice an episode with a cast: one Fish Audio request per beat, voice chosen by speakers.json + config/voices.json.

Usage: python3 pipeline/fish_cast.py episodes/<name> [workers]
Existing audio/para_NNN.mp3 clips are kept (delete one to re-voice that beat). Reads FISH_API_KEY from .env; never prints it.
"""
import json, pathlib, sys, time, urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENV = dict(l.strip().split("=", 1) for l in (ROOT / ".env").read_text().splitlines() if "=" in l)
VOICES = json.loads((ROOT / "config" / "voices.json").read_text())
ep = pathlib.Path(sys.argv[1]); workers = int(sys.argv[2]) if len(sys.argv) > 2 else 4
paras = [p.strip() for p in (ep / "script.txt").read_text().split("\n\n") if p.strip()]
spk = json.loads((ep / "speakers.json").read_text())
assert len(paras) == len(spk), (len(paras), len(spk))
(ep / "audio").mkdir(exist_ok=True)

def job(i):
    out = ep / "audio" / f"para_{i:03d}.mp3"
    if out.exists() and out.stat().st_size > 2000:
        return f"{i:03d} cached"
    body = {"text": paras[i], "reference_id": VOICES[spk[i]]["id"], "format": "mp3", "latency": "normal"}
    for attempt in range(4):
        try:
            req = urllib.request.Request("https://api.fish.audio/v1/tts", data=json.dumps(body).encode(),
                headers={"Authorization": f"Bearer {ENV['FISH_API_KEY']}", "Content-Type": "application/json", "model": "s2.1-pro-free"})
            with urllib.request.urlopen(req, timeout=180) as r:
                data = r.read()
            if len(data) < 2000:
                raise RuntimeError(f"short reply {len(data)} bytes")
            out.write_bytes(data)
            return f"{i:03d} {spk[i]} ok"
        except Exception as e:
            err = str(e)[:120]; time.sleep(3 * (attempt + 1))
    return f"{i:03d} FAILED {err}"

with ThreadPoolExecutor(workers) as ex:
    for msg in ex.map(job, range(len(paras))):
        print(msg, flush=True)
