# Render farm: one video across several cloud machines

One machine renders about 0.35–0.65 s per frame (SwiftShader is already multithreaded, so `--concurrency` barely helps). Speed comes from **more machines**: each cloud session renders a frame range and pushes its chunk back through git.

## Measured (2026-10-23, `farmtest1`: TestPainPicture frames 0–1799, 3 workers)
| chunk | frames | render | session total (clone + npm ci + render + push) |
|---|---|---|---|
| 00 | 0–599 | 392 s | 430 s |
| 01 | 600–1199 | 367 s | 406 s |
| 02 | 1200–1799 | 209 s | 242 s |

- Overhead per worker is about 40 s. One minute of video took about 7.5 min of wall time on 3 machines.
- The joined file had exactly 1800 frames and 60.0 s, and the chunk joins (frames 599/600, 1199/1200) are seamless (lossless concat, `-c copy`).
- **Estimate for a 6-minute video (10 800 frames):** 10 workers of 1080 frames take about 8–12 min. 18 workers of 600 frames take about 5–7 min.

## Steps
1. **Push first.** Everything the picture needs (code, `timing.json`, assets in `video/public`) must be on the branch, because workers clone it.
2. **Plan:** `python3 pipeline/render_farm.py plan <job> <Composition> <total_frames> <workers> [branch]`. This prints one prompt per worker and writes `renders/<job>/plan.json`.
3. **Launch** one cloud session per prompt (`create_session` with `source_url` = the repo, `source_revision` = the branch, `outcome_branch` = `farm/<job>-<k>`, `prompt` = the printed prompt; do not set `permission_mode`).
4. **Watch** with `list_events(kinds=["result"])` per session. Each worker replies `chunk KK frames A-B: N s, pushed farm/<job>-KK`.
5. **Collect:** `python3 pipeline/render_farm.py collect <job>` fetches the chunks, joins them, and checks the frame count, giving `renders/<job>/<job>.mp4` (silent picture). Mux the mixed audio as before.
6. **Clean:** `python3 pipeline/render_farm.py clean <job>` deletes the `farm/<job>-*` branches.

## Notes
- Heavier shots (many shadow-casting point and spot lights, crowds) render slower. Split by frame count, but give the heavier half of the video one or two extra workers.
- Shadows off cut the render time by 38% in the benchmark. Use `--props='{"shadows":false}'` only for previews; finals keep shadows.
- If the code changes after a farm render starts, kill the workers and re-plan; never join chunks from different commits.
