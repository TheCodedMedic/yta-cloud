"""Narrate an episode with Fish Audio: one request per paragraph of script.txt.

Usage: python3 pipeline/fish_tts.py episodes/<name> [VOICE_ENV_KEY]
Reads FISH_API_KEY and the voice id from the repo's .env. Existing clips are
kept, so delete audio/para_NNN.mp3 to regenerate a single beat.
"""
import json
import pathlib
import sys
import urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
ENV = dict(
    line.strip().split("=", 1)
    for line in (ROOT / ".env").read_text().splitlines()
    if "=" in line
)

ep = pathlib.Path(sys.argv[1])
voice_key = sys.argv[2] if len(sys.argv) > 2 else "FISH_NARRATOR_VOICE_ID"
paras = [p.strip() for p in (ep / "script.txt").read_text().split("\n\n") if p.strip()]
(ep / "audio").mkdir(exist_ok=True)

for i, text in enumerate(paras):
    out = ep / "audio" / f"para_{i:03d}.mp3"
    if out.exists():
        continue
    body = {"text": text, "reference_id": ENV[voice_key], "format": "mp3", "latency": "normal"}
    req = urllib.request.Request(
        "https://api.fish.audio/v1/tts",
        data=json.dumps(body).encode(),
        headers={
            "Authorization": f"Bearer {ENV['FISH_API_KEY']}",
            "Content-Type": "application/json",
            "model": "s2.1-pro-free",
        },
    )
    with urllib.request.urlopen(req, timeout=180) as r:
        out.write_bytes(r.read())
    print(f"para {i:03d} ok", flush=True)
