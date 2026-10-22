---
name: nexus-remotion
description: How this repo makes animated "What If" story videos without Blender — Remotion (React/TypeScript) for the picture, Python for voice, timing and sound. Read this first in any session on yta-cloud. It covers the environment, the reference study, script, Fish Audio narration, word-anchored timing, the character rig and its anatomy rules, the cinematic camera/atmosphere layer (mandatory on every shot), the review loop, cloud rendering, the CC0 sound library, mixing, finishing and delivery. Use when asked to make, extend or fix a video in this repo, or to learn the pipeline.
---

# Nexus Remotion: the video pipeline (no Blender)

This is the record of how `episodes/head_start` was made end to end, written so a fresh session can repeat it. The older `nexus-what-if` skill holds the story-writing rules, the sound-design principles and the original Blender process; its **picture** part is replaced by this file. Everything else there still applies.

## 0. The idea in one paragraph

The whole film is **code that is a pure function of time**. The script is split into beats, the narrator reads each beat (Fish Audio), the words are timed (Whisper), and every cut, pose, graphic and sound is anchored to a **measured word**, never a typed second. The picture is a Remotion project: React components draw the sets, characters, effects and graphics as SVG/CSS for any frame number; Remotion renders the frames in headless Chromium and encodes them with ffmpeg. A Python mixer places sounds on the same word times, ducks them under the voice and sets every effect relative to the narrator's level. A finishing script muxes picture and mix at −14 LUFS and verifies the result.

## 1. Environment (cloud session)

- Node 22, ffmpeg, Python 3 (numpy, faster-whisper) are present. Chromium is pre-installed: **always** pass `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` to Remotion (it cannot download its own).
- Fonts are bundled in `video/public/fonts` and registered in `video/src/theme.ts`; do not use `@remotion/google-fonts` (the proxy breaks it).
- Keys live in the git-ignored `.env`: `FISH_API_KEY`, `FISH_NARRATOR_VOICE_ID`, `FREESOUND_API_KEY`. Read them in code; never print them. A new session needs them pasted again or set in the environment settings.
- YouTube downloads are blocked (bot check). Reference videos come from the user's Drive folder **"Claude Video Studio / 1 - Reference videos"** (link-shared). The Drive connector downloads ≤ 10 MB; larger files: `curl "https://drive.usercontent.google.com/download?id=<FILE_ID>&export=download&confirm=t"`.
- Large outputs (MP4s) are git-ignored. Deliver with the file-send tool; keep code, notes, cue sheets and the sound library in git.
- `npm i` in `video/` (≈30 s) on a fresh clone.

## 2. Study the reference (`analysis/`, `notes/findings*.md`)

```
ffmpeg -i ref.mp4 -vf "fps=1,scale=384:-1,drawtext=text='%{pts\:hms}':x=6:y=6:fontsize=18:fontcolor=white:box=1:boxcolor=black@0.6,tile=5x6" -q:v 4 sheet_%d.jpg
ffmpeg -i ref.mp4 -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep -o "pts_time:[0-9.]*"      # cuts
ffmpeg -i ref.mp4 -af ebur128 -f null - 2>&1 | grep "I:"                                                     # loudness
python3 -I scratch/transcribe.py voice16k.wav transcript.json                                               # faster-whisper, word times
```
Look at the sheets yourself; write what you see (shot types, cut rate, palette, effects, graphics, story structure) into `notes/findings.md`. Full-resolution single frames for details (`-ss T -frames:v 1`).

## 3. Script (`episodes/<name>/script.txt`)

One beat per paragraph, blank line between. Second person, present tense, one number per beat, proof before explanation, a named idea, plant-and-payoff, an ending that returns to the first line. Numbers written as words. (Rules: `nexus-what-if` §8.) Target ≈ 100–110 words per minute of final video.

## 4. Voice and timing (`pipeline/`)

1. `python3 pipeline/fish_tts.py episodes/<name>` — one Fish Audio request per paragraph (`model: s2.1-pro-free`, `reference_id` = narrator voice id), cached as `audio/para_NNN.mp3`. Delete one file to regenerate one beat.
2. `python3 episodes/<name>/assemble_voice.py` — trims silence, loudness-matches clips, places them with the **GAP** table (designed silences: title card, slow motion, the climax), writes `master_voiceover.wav`, `narrator_16k.wav`, `timeline_chunks.json`.
3. Whisper the master (`scratch/transcribe.py narrator_16k.wav whisper_words.json`), then `python3 pipeline/align_words.py episodes/<name>` → `words.json` (script spelling, measured times; beat edges clamped to the assembled timeline).
4. **Verify every word was spoken**: diff the transcript against the script (`difflib`; expect ratio > 0.99, differences only spelling like "40"/"forty").
5. Copy `words.json` and `timeline_chunks.json` into `video/src/`, and `master_voiceover.wav` to `video/public/vo.wav`.

Timing helpers: `video/src/timing.ts` (TypeScript) and `pipeline/timing.py` (Python): `at(beat, word, nth)`, `end(...)`, `PS/PE/PG(beat)`. **Repeated words are counted by occurrence after lower-casing** — `at(9, "You")` matches "you," earlier in the beat; print the beat's words before anchoring (`python3 -c` over `words.json`).

## 5. Picture (`video/`)

### Layout
```
video/src/theme.ts          palette C, FPS 24, 1920x1080, bundled fonts
video/src/timing.ts         word anchors
video/src/kit/Character.tsx the rig: side + front views, joint clamps, walkPose, joints/handPos/headPos/seatLayout
video/src/kit/Hand.tsx      the macro close-up hand (open → fist)
video/src/kit/Props*.tsx    fly, cup, phone, table, chair, toast, cone/scoop, balloon, ball, monitor, train, bench
video/src/kit/Sets*.tsx     sky, sun rays, café front (wind), gym, dark room, bus, platform, crowd row
video/src/kit/Fx.tsx        letterbox, speed-line flash, rings, bokeh, dust, grain/vignette grade, streaks, easing
video/src/kit/Graphics*.tsx stopwatch, chips, labels, stamps, title text, bubbles, thought stack, twin dials, captions, counters, cards, end card
video/src/kit/Cinema.tsx    2.5D Camera (parallax, keyframes, handheld, shake, rack focus), MotionBlur, whip(), TileX, GroundShadow, LensStreak
video/src/kit/Atmos.tsx     wind(), Leaves, Rain, Splashes, LensBeads, Fog, Clouds, GodRays, WetReflection
video/src/kit/Motion.tsx    runPose, idle(), lookAt(), Trail (ghosts), DustKicks, footfalls, RadialLines, squash
video/src/kit/TopDown.tsx   TopChar, TopCafe (top-down view)
video/src/shots/*.tsx       the shot lists per section; demo.tsx is the cinematic reference implementation
video/src/Episode.tsx       makeEpisode(shots, flashes, voice): picks the shot for the frame, eases letterbox bars, fires flashes, grade, audio
video/src/Mids.tsx          review compositions: one frame per shot (Mids), start/mid/end per shot (Strips)
video/src/Root.tsx          compositions: Full, Minute1, Demo, Strips*, KitTest
video/review.sh             render a review composition and tile it
```

### A shot
```ts
{ id: "catchfly", t0: at(1, "You", 2), t1: at(1, "Gotcha"), bars: "slow", cool: 0.2,
  render: (t, u, frame) => <AbsoluteFill>…</AbsoluteFill> }
```
`t` is film time (s), `u` 0..1 within the shot. Everything inside is computed from `t`. Boundaries come from words. `bars` = letterbox height (normal 62 / tight 96 / slow 126 px, eased over 9 frames by the player); `cool` = cold grade amount.

### The rig (read `notes/animation_lessons.md` before touching any shot)
- `<Character x y s facing view outfit pose expr look blink rim brainGlow />`. `(x, y)` is the hip; standing height ≈ 300·s; close-ups use s ≈ 2.7 with hips at y ≈ 990.
- `view="side"` (3/4) for walking, reaching, sitting, pointing; `view="front"` for anything symmetric or facing camera. Angles: 0 = hanging, + = forward (side) / outward (front); elbows and knees are **clamped** so they cannot bend the wrong way.
- Outfits: hero (red hoodie), friend (yellow cap), scientist, sister, extra. Expressions: neutral, smile, happy, smug, shock, think, deadpan, laugh, worry, determined. `blinkAt(frame, phase)`.
- Held props at `handPos(...)`; seated furniture from `seatLayout(hipY, s)`; labels clear of `headPos(...)`. No stroke outlines on characters: depth is tone + rim + soft shadow.
- `walkPose(phase)` and `runPose(phase)` are the only walks/runs; `idle(pose, t, seed)` for life; `lookAt(head, target)` for eyes.

### The cinematic layer (mandatory on every shot of every video)
Rules C1–C8 in `notes/animation_lessons.md`. In practice each shot is built as:
```tsx
<Camera t={tt} hand={1} keys={[{ at: 0, x: 900, y: 600, zoom: 1.08 }, { at: 3.5, x: 1020, y: 590, zoom: 1.16 }]}
  focus={1} dof={0}
  layers={[
    { depth: 0.35, children: <><Sky t={t} /><Clouds t={t} /></> },        // far: moves/zooms least, overscanned
    { depth: 0.8,  children: <CafeFront t={t} wind={wind(t)} /> },        // mid
    { depth: 1,    children: <Stage>{characters, props, GroundShadow}</Stage> },  // subject plane
    { depth: 1.6, blur: 3, children: <Leaves t={t} scale={1.8} /> },      // foreground, soft
  ]} />
```
- Always two or more camera keyframes (push, drift, pan) and `hand` ≥ 0.6; `shakeAge` on impacts; `roll` only with zoom ≥ 1.15; `TileX` around sets for travelling shots.
- Coverage: cut between wide, close, over-the-shoulder, top-down (`TopCafe`/`TopChar`), and use `whip()` + `MotionBlur` to pan between people (render both shots, slide outgoing to −slide and incoming to W−slide).
- Atmosphere in every scene: `wind` on sets, plus at least one of `Leaves`, `Clouds`, `Dust`, `Rain` (two depths + `Splashes` + `WetReflection` + `LensBeads` at night), `Fog`, `GodRays`.
- Speed: `runPose` + `Trail` + `DustKicks(footfalls)` + `Streaks`/`RadialLines` + camera lag and a zoom punch.
- `shots/demo.tsx` shows all of it in six shots; copy from it.

### Review loop (before every long render)
1. `KitTest` still (expressions in both views, walk keys, poses, seated pair) after any rig change.
2. A `Strips` composition for the section (start/mid/end — or four points — of every shot), rendered at 0.4 scale and tiled with ffmpeg; **look at every frame**. Check anatomy (arms readable, neck, head on shoulders, mittens, feet on the floor, joints bending the right way), props in hands, reaches pointing at targets, overlays clear of faces, framing, and that far layers fill the frame.
3. Fix, delete the strips folder, re-render, look again. Add any new mistake to `notes/animation_lessons.md`, fixing the rig/kit so it cannot recur.
4. Pull a few frames from the **final** MP4 too.
5. If code changes after a render starts, stop the render and restart it.

### Render
```
cd video && npx remotion render src/index.ts Full out/full_picture.mp4 --codec=h264 --crf=16 --concurrency=4 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell --log=error
```
≈ 0.5 s per 1080p frame on a 4-core session (a 4-minute episode ≈ 55 min). Run it in the background. Blur-heavy close-ups are the slow part. For speed, split by shot ranges across sessions and join segments (each session is its own machine; segments come back via Drive).

## 6. Sound (`sfx/`, `episodes/<name>/cues_*.py`, `pipeline/mix.py`)

- Library: 177 sounds, 48 kHz OGG in `sfx/library/`, every file with a verified licence in `sfx/credits.json` (CC0, Mixkit free, one CC BY with attribution text); `sfx/library_index.md` describes each; `sfx/levels.json` has measured levels. Built by `sfx/tools/manifest.py` + `build_library.py` (Kenney zips, Freesound API previews with licence from the API, Mixkit). Add sounds the same way and record credits.
- Cue sheet: `BEDS = [(name, start, end, rel_dB, fade_in, fade_out)]`, `SFX = [(name, time, rel_dB)]`; every time is `a(beat, word)` / `PS/PE/PG`. Levels are dB relative to the narrator's speech level (effects −11…−24, beds −20…−30); beds loop and duck under the voice. One whoosh+pop per graphic, an impact on every speed-line flash, rings get a sparkle, footsteps on footfalls, a horn/rumble/pass for a train, silence only where designed.
- `python3 -I pipeline/mix.py episodes/<name>/cues_full.py episodes/<name>/mix_full.wav` (validates names first; ≈ 90 s for 4 min).

## 7. Finish and verify (`pipeline/finish.py`)

`python3 -I pipeline/finish.py video/out/full_picture.mp4 episodes/<name>/mix_full.wav episodes/<name>/<name>.mp4 episodes/<name>/<name>_web.mp4` — two-pass loudnorm to −14 LUFS, limiter for −1.5 dBTP, audio padded/trimmed to the picture, then checks durations, loudness, true peak and a non-silent opening; writes a web copy (crf 23). Also run `silencedetect` and pull frames from the final file. State plainly what was not verified (we cannot listen).

## 8. Deliver and record

Send the web copy with the file tool (masters are too big for Drive's connector). Update `notes/progress.md`. Commit code, notes and cue sheets; never commit `.env`, WAVs, MP4s or downloads.

## 9. Honest limits

- We cannot hear the mix; levels are set by rule and the user judges tone.
- One cloud session renders slower than a laptop; parallel sessions or Remotion Lambda are the way to real speed.
- The run cycle and top-down figures are first versions; the anatomy rules apply to them too.
