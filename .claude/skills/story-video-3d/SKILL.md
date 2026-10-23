---
name: story-video-3d
description: Make a cinematic animated story video (a YouTube episode or Short) as real 3D in code. Three.js runs inside Remotion for the picture, Fish Audio supplies the voices, Whisper gives word timings, and a Python mixer plus a synthesised score handle the sound. No Blender. It walks a new user from nothing to a finished MP4. It covers setup (local Mac or cloud container), designing THEIR character and getting it approved, choosing or cloning a narrator, optional character voices, script, word-timed shots with real camera moves, VFX (lightning, frozen rain, speed streaks, time tunnels, sky cracks), review loops, sound, finishing and delivery. Use when someone asks to make, continue or fix a story video with this repo, or says "start", "set me up", "make an episode" or "build the first minute".
---

# Story video in 3D code (Three.js + Remotion)

The whole film is **code that is a pure function of time**. A script is split into beats. Fish Audio reads each beat. Whisper times every word. Every cut, camera move, pose, effect, line of on-screen text and sound is anchored to a **measured word**, never a typed second. The picture is a Remotion project that renders real 3D scenes (Three.js via `@remotion/three`) for any frame number. On a laptop this renders a minute of 1080p in about 2–3 minutes, roughly 70× faster than Blender, with true camera angles (orbit, crane, top shot, dolly zoom).

**Ground rules (always):**
- **The user owns the creative.** Their character, their story, their voices. Never reuse another channel's characters, scripts, voices or branding.
- **Ask before** installing anything big, spending paid API credits on long jobs, cloning a voice, publishing, or pushing to git. State what, from where and the size, then wait for a clear yes.
- **Keys** live in a git-ignored `.env` and are never printed or echoed.
- **Approval gates:** (1) the character look, (2) the narrator voice, (3) script and voice, (4) the first minute, (5) the final video. Show finished pictures and videos, not code or timing tables, unless asked.
- **No black bars** by default (full frame). No grain or vignette on 3D renders unless the user asks.

---

## 1. Setup

### 1a. Where are we?
Run `uname -a` and check for a display.
- **Local Mac (or PC):** the user's files are here. Render with `--gl=angle`.
- **Cloud container (Linux, no GPU):** the work lives in the GitHub repo. Render with `--gl=swangle` (software WebGL; slower, about 3–6× real time, so render in background chunks). If Remotion can't download Chromium, find a preinstalled headless shell (`ls /opt/pw-browsers` or `npx playwright install --dry-run`) and pass `--browser-executable=<path>`.
- **Either way:** if port 3000 is taken, pass `--port=<free port>` to every `npx remotion` command.

### 1b. Tools
| Need | Install | Check |
|---|---|---|
| Node 18+ | system | `node -v` |
| Remotion + Three | in `video/`: `npm install` (the deps `remotion`, `@remotion/cli`, `@remotion/three`, `three@0.169`, `@react-three/fiber@8` for React 18) | `npx remotion --version` |
| ffmpeg / ffprobe | `brew install ffmpeg` or `apt-get install -y ffmpeg` | `ffmpeg -version` |
| Python 3.10+ with numpy, requests | `pip install numpy requests` | |
| Whisper (word times) | `pip install openai-whisper` (or `faster-whisper`) | `whisper --help` |
| yt-dlp (only for voice cloning from a link) | `pip install yt-dlp` | |

If npm blocks a package's install script (esbuild), run `npm install-scripts approve esbuild && npm rebuild esbuild`.

### 1c. Fonts
Bundle fonts as files in `video/public/fonts/` and load them with `FontFace` behind `delayRender` (never rely on network font loading at render time). The default type system is **Plus Jakarta Sans 800** for headlines and **Manrope** for UI, both OFL and free. The user may supply a display font for the sign-off.

### 1d. Keys
Create `.env` (git-ignored) with:
```
FISH_API_KEY=...
```
Ask the user for their Fish Audio API key (fish.audio → API). Read it in code; never print it.

---

## 2. The character (approval gate 1)

Never assume a look. Interview the user briefly, offering choices with examples:
1. **Head and face style.** For example: a glossy black sphere head with white line face marks; a skin-tone sphere with drawn eyes; animal; robot.
2. **Body proportions.** About 4 heads tall (default), chibi (3 heads) or realistic (6 heads).
3. **Signature outfit and colours.** For example: a hoodie in one strong colour, a jacket with one accent button, a cap. One signature colour the audience will remember.
4. **Supporting cast**, if any: a sibling, a friend, an elder, extras. Each gets its own look so they never get confused on screen.

Then **build it** as a rig of simple 3D shapes, so it reads correctly from every angle (`video/src/cam3d/Person3D.tsx`):
- **Head:** a sphere with a clear-coat (glossy) material. Face marks are geometry lying **on** the sphere (torus rings for eyes, tube curves for brows and mouth), so they wrap correctly when the head turns.
- **Torso:** a lathe profile scaled to an oval (depth about 0.66 of width), with the chest, waist and hem.
- **Limbs:** tapered cylinders with joint spheres. The shoulder is outward then forward, the elbow bends forward only, the knee bends backward only, and every joint angle is clamped.
- **Hands:** a palm with four fingers that curl (0 open, 1 fist) and a thumb. **Shoes:** a rounded toe with a sole.
- **Outfit details** as small meshes: hood (down, or up as a shell around the head), drawstrings, pocket, ribbed hem, cuffs, buttons, caps, beanies, scarves, earphones.
- **Toon materials** (a 3-step gradient ramp) for cloth, giving a clean flat-shaded look; contact shadows from the key light.
- **Pose system:** named poses (stand, sit, ready crouch), `walk(phase)` and `run(phase)` cycles, and `mix(a, b, u)` to blend; a body roll and pitch for lying, diving and falling.

**Approval:** render an **asset sheet**. It is a still per panel: front, three-quarter, profile, back, sprint, a close-up, and each supporting character. Tile the panels into one image with ffmpeg and send it. Iterate until the user says yes. Record the approved look in the project notes so every later episode uses it.

---

## 3. Voices (approval gate 2)

### 3a. The narrator
1. **List the user's Fish voices:** `GET https://api.fish.audio/model?self=true&page_size=50` with `Authorization: Bearer $FISH_API_KEY`. Show title and id.
2. **Preview:** for each candidate, generate the same 2-sentence line from the user's story (`POST https://api.fish.audio/v1/tts` with JSON `{"text", "reference_id": <voice id>, "format": "mp3"}` and header `model: <the model name the account uses, e.g. s1>`). Send the clips and ask which one is the narrator.
3. **No voices yet?** Offer to clone one:
   - **From a link** (YouTube or any URL): ask for the link and **confirm the user owns the voice or has the speaker's permission**. Download the audio only (`yt-dlp -x --audio-format wav -o source/voice.%(ext)s <url>`), cut 30–90 s of clean solo speech (no music) with ffmpeg, and normalise it.
   - **From a file** the user uploads: the same cleanup.
   - **Create the model:** `POST https://api.fish.audio/model` (multipart) with `type=tts`, `title=<name>`, `train_mode=fast`, `visibility=private`, and `voices=@clip.wav` (you can attach several clips). Save the returned id.
   - Preview the clone with a story line and get approval.
   - If an endpoint or field has changed, check docs.fish.audio before retrying. Never guess repeatedly against a paid API.

### 3b. Character voices (optional)
Ask: "Will other people talk in this video?" If yes, suggest a small, varied cast and let the user skip any of it. For example:
- a younger man (casual, quick);
- an older man (gravelly, slow, warm);
- a young woman (bright);
- an older woman (calm);
- a teenager or child, which can reuse a young voice.

Preview each on its own line from the script.

### 3c. The voice map
Store the map as `config/voices.json`, holding speaker tag → voice id, gain in dB and notes. Reuse voices across characters by type to keep the cast small.

---

## 4. Story and script (approval gate 3)

1. **Research demand** before writing: YouTube autocomplete (`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=<prefix>`) and the view counts of recent videos in the niche. Prefer premises people type ("what if you could…"), told in the second person, with a number or a power. Avoid copying an existing video's twist: search for it first.
2. **Pick the spine with the user:** the power or event and its rules, the want (someone to save, money, one mistake), the escalation, and the cliffhanger. Offer 3–4 options each with examples (a clickable question if the client supports it).
3. **Structure for retention:**
   - **Cold open:** the most spectacular moment first (5–20 s), then the title.
   - **Rules:** 2–3 rules on screen, plus "some of this is real" science with true numbers.
   - **Discovery and tests:** three escalating tests, each paid off with a gag.
   - **The want**, the big attempt, the cost.
   - **Escalation:** each fix makes it worse.
   - **The choice**, the ending, a cliffhanger.
   - **An optional unclear "Part 2" teaser:** 4–6 flashes out of order, a cold grade, one line of dialogue.
   - **A question to the audience** and the sign-off.
4. **Format:** `screenplay.md` with `N:` / `YOU:` / `<NAME>:` lines (each line is one beat) and `[picture notes]`. Derive `script.txt` (beats separated by blank lines) and `speakers.json` (one tag per beat). Aim for 1,200–2,000 words for 8–12 minutes.
5. **Facts:** only claims you can source. Keep numbers honest (for example, "about thirty-eight millionths of a second a day").

---

## 5. Voice, assembly and timing

1. **Generate** one clip per beat (cache by `audio/para_NNN.mp3`; never regenerate an approved clip).
2. **Assemble** the master: a 0.3 s lead, a designed gap after each beat (0.4–0.6 s normally; 1–3 s for action holds, title cards and silences; up to 6 s for a big cinematic hold), and character voices level-matched to the narrator. Write `master_voiceover.wav` and `timeline_chunks.json` (index, speaker, start, end, gap).
3. **Pauses are never dead air:** every long gap is planned for action, effects or music.
4. **Word timing:** `whisper narrator_16k.wav --model small --word_timestamps True --output_format json`, then align the words to the script tokens one-to-one. Check the counts match; a mismatch means a clipped or garbled word, so re-voice that beat.
5. **Timing file:** export `video/src/<ep>/timing.json` as `{words: [{b, w, s, e}], beats: [{b, s, e, gap}]}` in master time (add the lead if Whisper ran on the trimmed file).

Share the script plus a voiceover MP3 and get approval.

---

## 6. The picture: shots in code

**Project layout** (`video/src/`):
| File | Role |
|---|---|
| `cam3d/Person3D.tsx` | the rig, looks, poses, walk and run |
| `cam3d/World3D.tsx` | a street set (buildings with canvas window textures, road, pavement, lamps, trees, café; night/day; a `rewrite(i)` hook for a city rewriting itself) |
| `<ep>/core.tsx` | `at(beat, word, nth, off)`, `PS`/`PE`/`P(b)` (beat start/end; a cut lands 0.12 s before a line), easing (`io`, `ex`), `L3`, `orbit`, `hand` (handheld drift), `shakeC`, the `Shot` type and `ShotFrame` (renders the shot active at time t, adds motion blur from camera angular speed, a per-shot CSS `grade`, a DOM overlay layer) |
| `<ep>/Vfx.tsx` | lightning `Bolt` (midpoint-displacement path, white core plus additive glow tubes and branches, re-seeded every ~2 frames for flicker), `BodyArcs` (lightning crawling over a body), `Rain` (instanced; a rain clock you can freeze, so falling streaks turn into hanging beads), `Streaks` (speed lines), `Tunnel` (scrolling streak texture on a cylinder), `SkyCracks` (bolts that grow in, many at once), `ClockFace` (hands rewind or skip) |
| `<ep>/Sets*.tsx` | `Env(mood)` sky dome, fog and light rig for night/dawn/day/golden/dusk; a park, plaza, bedroom, kitchen, classroom, pitch, rooftop, river road, crossing, car park, space and Earth with satellites, vehicles, props, crowds of extras with varied outfits and umbrellas |
| `<ep>/Text.tsx` | on-screen type: Rise (masked per-word slide), Slam (scale and blur in), Chip (pill), Strike (bar across a phrase), Flash |
| `<ep>/Dom.tsx` | 2D overlays: phone screens (map, voice note, message), graphs, a calendar flip, tickets |
| `<ep>/Minute1.tsx`, `Part*.tsx`, `Film.tsx` | shot lists per part, and the film assembly (each shot ends where the next starts) |

**A shot** is `{ id, t0, t1, scene(t), cam(t) → {pos, target, fov, roll}, noBlur?, grade?, dom?(t) }`, with `t0` and `t1` from `at()`.

**Camera vocabulary** (use a variety; no two neighbouring shots with the same move):
- **Angles:** front, three-quarter, profile, from behind, over the shoulder, low, high, top shot.
- **Moves:** pan, whip pan (fast turn with motion blur), crash zoom (fov drop in 0.2 s), conversation swing, shot/reverse shot over shoulders, pull back to a wide, long-lens follow (fov 4–12 from far away), push in, tracking alongside, orbit (bullet time; turn the blur off), crane up, dolly zoom (distance × tan(fov/2) held constant), handheld drift on everything.

**Cinematic devices:**
- Freeze time: stop the rain clock and every walker's clock, then orbit.
- Slow motion: scale the scene clock, not the camera.
- Flash cuts for time jumps.
- Memory scenes in a sepia/low-saturation grade.
- A cold grade with black bars only for a teaser.
- Weather and mood changes to mark time passing (dawn to day mid-run).
- Text on screen only for rules, numbers, dates and payoffs, kept clear of faces, never more than one idea at once.

**Variety:** move through places (interiors and exteriors, day and night, crowds with varied clothing, trees, vehicles), and give every scene its own mood and light.

---

## 7. Review loop (before every long render)

1. **Asset sheet** for new sets and characters.
2. **Strips:** render each shot at 15/50/85 % of its length as stills (`npx remotion render … <StripsComp> out/strips --sequence --image-format=jpeg --scale=0.4`), tile them 3 across with ffmpeg, and **look at every frame**.
3. **Common faults** (each one has bitten this pipeline):
   - the camera inside a mesh (a head, a van, a building row, behind a room's open wall);
   - foreground poles, trees, benches or extras blocking the subject;
   - text over a face;
   - a character walking through props;
   - a lying body rotated from the feet (rotate around the hips);
   - a far building row between the camera and the subject;
   - an overlay that never leaves (always give `out`);
   - shot start times that don't accumulate;
   - the wrong facing (the bus doors on the far side);
   - a phone covering a face;
   - too-dark flashes.
4. Fix, re-render only the affected strips, then render the whole thing.

---

## 8. Sound

- **Effects:** use CC0 libraries (keep `credits.json` with source and licence). Synthesise what's missing in numpy: lightning crackle (sparse noise bursts plus a buzz), thunder (crack plus low roll plus reverb), the freeze whoosh (falling filter sweep), the time tear (riser into a sub boom), tunnel roar, tyre screech, pass-by, whistle, bells, ticks.
- **Music:**
  - **Temporary score:** synthesise it in Python to the beat times. Pads, pulses at the scene's BPM, ticks, risers into hits, piano chords for emotion, and **true silence** on the biggest beat (the save, the cut to white).
  - **Ask the user** whether they want to supply tracks (for example from a music generator). Give them prompts per section, such as "tense cinematic pulse 110 bpm, builds to a hit, then silence" or "soft piano, hopeful but sad". Cut what they send to the beats.
  - Never download commercial music.
- **Cue sheet:** a Python file with `VOICE`, `LENGTH`, `BEDS` (name, start, end, rel_dB, fade_in, fade_out) and `SFX` (name, time, rel_dB), all from `at()`.
- **Levels** relative to the narrator: effects −8 to −20 dB, beds −20 to −30 dB, score about −12 dB. Beds duck under the voice.
- **Finish:** two-pass loudnorm to −14 LUFS, true peak −1.5 dBTP, audio padded to the picture. Verify durations, loudness and a non-silent opening.

---

## 9. Render and deliver

- **Picture:**
  ```bash
  npx remotion render src/index.ts <PictureComp> out/picture.mp4 --codec=h264 --crf=17 --gl=angle --concurrency=4 --muted --port=<free>
  ```
  On cloud use `--gl=swangle`, and render in background chunks with `--frames=a-b` if needed.
- **Mux and finish**, then sample a frame grid from the final file (`ffmpeg -vf "fps=1/10,scale=384:-1,tile=6x8"`) to catch glitches. Send the MP4.
- **Gate:** render the first minute first and get approval, then the rest. Skip the gate only if the user is away and says to finish everything.
- **After final approval:** delete render caches and intermediate pictures, keep the master, the mix, the scripts and the code, and report the space freed.

## 10. Repo hygiene (cloud)
- **Never commit** `.env`, renders (`out/`), downloaded media (`source/`) or voice clips you don't have rights to share.
- **Commit** code, `screenplay.md`, `script.txt`, `speakers.json`, `timing.json`, cue sheets and notes, on a feature branch.
- **Ask before pushing.**
