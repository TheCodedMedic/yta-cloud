"""Render farm through git: split a Remotion composition across cloud sessions, then join the chunks.

1. plan    python3 pipeline/render_farm.py plan <job> <Composition> <total_frames> <workers> [branch]
           -> prints one worker prompt per chunk (frame ranges), and writes renders/<job>/plan.json.
           Each worker clones <branch>, renders its range, and pushes ONLY its chunk to the orphan branch farm/<job>-<k>.
2. collect python3 pipeline/render_farm.py collect <job>
           -> fetches every farm/<job>-<k> branch, extracts the chunks, joins them losslessly (ffmpeg concat, -c copy)
              into renders/<job>/<job>.mp4, checks the frame count.
3. clean   python3 pipeline/render_farm.py clean <job>     -> deletes the farm/<job>-* branches on the remote.

The worker command is fixed (see WORKER below) so every chunk has identical encoder settings and concatenates cleanly.
"""
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
BROWSER = "/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell"
WORKER = """You are a render worker. Do exactly this, nothing else, and do not edit any source file.

```bash
set -e
cd ~ && rm -rf farm && git clone --depth 1 --branch {branch} {repo} farm && cd farm/video
npm ci --no-audit --no-fund
START=$(date +%s)
npx remotion render src/index.ts {comp} ../chunk_{k:02d}.mp4 --frames={a}-{b} --codec=h264 --crf=18 --muted \\
  --gl=swangle --concurrency=4 --browser-executable={browser} {props}
echo "render seconds: $(( $(date +%s) - START ))"
cd .. && git checkout --orphan farm/{job}-{k:02d} && git rm -rf -q . && git add -f chunk_{k:02d}.mp4
git -c user.name=farm -c user.email=farm@local commit -q -m "farm {job} chunk {k:02d} frames {a}-{b}"
git push -u origin farm/{job}-{k:02d}
```

If `npm ci` fails, run `npm install` instead. If the push fails for a network reason, retry up to 4 times (2 s, 4 s, 8 s, 16 s).
Finish by replying with one line: `chunk {k:02d} frames {a}-{b}: <render seconds> s, pushed farm/{job}-{k:02d}` (or the exact error)."""


def git(*a, check=True, capture=True):
    return subprocess.run(["git", "-C", str(ROOT), *a], check=check, capture_output=capture, text=True)


def plan(job, comp, total, workers, branch="ccr-02c1c28f-vt1fb7", props=""):
    total, workers = int(total), int(workers)
    repo = git("remote", "get-url", "origin").stdout.strip()
    size = -(-total // workers)
    chunks = [(k, k * size, min(total, (k + 1) * size) - 1) for k in range(workers) if k * size < total]
    out = ROOT / "renders" / job
    out.mkdir(parents=True, exist_ok=True)
    json.dump({"job": job, "comp": comp, "total": total, "branch": branch, "chunks": chunks}, open(out / "plan.json", "w"), indent=1)
    for k, a, b in chunks:
        p = f"--props='{props}'" if props else ""
        print(f"=== worker {k} ===\n" + WORKER.format(branch=branch, repo=repo, comp=comp, k=k, a=a, b=b, browser=BROWSER, job=job, props=p) + "\n")


def collect(job):
    out = ROOT / "renders" / job
    pl = json.load(open(out / "plan.json"))
    names = []
    for k, a, b in pl["chunks"]:
        br = f"farm/{job}-{k:02d}"
        git("fetch", "-q", "origin", f"{br}:{br}", check=False)
        f = out / f"chunk_{k:02d}.mp4"
        with open(f, "wb") as fh:
            r = subprocess.run(["git", "-C", str(ROOT), "show", f"{br}:chunk_{k:02d}.mp4"], stdout=fh)
        if r.returncode or f.stat().st_size < 1000:
            sys.exit(f"missing chunk {k:02d} (branch {br})")
        names.append(f.name)
    (out / "list.txt").write_text("".join(f"file '{n}'\n" for n in names))
    final = out / f"{job}.mp4"
    subprocess.run(["ffmpeg", "-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", str(out / "list.txt"), "-c", "copy", "-movflags", "+faststart", str(final)], check=True)
    n = subprocess.run(["ffprobe", "-v", "error", "-count_packets", "-select_streams", "v:0", "-show_entries", "stream=nb_read_packets", "-of", "csv=p=0", str(final)], capture_output=True, text=True).stdout.strip().strip(",")
    print(f"{final}: {n} frames (expected {pl['total']})" + ("" if int(n) == pl["total"] else "  <-- MISMATCH"))


def clean(job):
    pl = json.load(open(ROOT / "renders" / job / "plan.json"))
    for k, _, _ in pl["chunks"]:
        git("push", "-q", "origin", "--delete", f"farm/{job}-{k:02d}", check=False)
        git("branch", "-q", "-D", f"farm/{job}-{k:02d}", check=False)
    print("deleted farm branches for", job)


if __name__ == "__main__":
    cmd, *args = sys.argv[1:]
    {"plan": plan, "collect": collect, "clean": clean}[cmd](*args)
