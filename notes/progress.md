# Progress

Pipeline: Remotion (React/TypeScript) for picture, Python for analysis, voice, timing and sound. No Blender.

- [x] Cloud rendering test: Remotion ~0.35 s/frame at 1080p on a 4-core cloud session (`ifverse-test/`)
- [x] Blender EEVEE checked in the cloud: ~9 s/frame (no GPU) — dropped
- [x] Skill loaded (`.claude/skills/nexus-what-if/SKILL.md`); `workspace/` bundle not available — rebuild in Remotion
- [x] Fish Audio key works (stored in `.env`, git-ignored, as `FISH_API_KEY`)
- [x] Narrator voice: **Channel_Master_Voice** (id in `.env` as `FISH_NARRATOR_VOICE_ID`), model `s2.1-pro-free`
- [x] Reference video downloaded from Drive (link-shared folder) to `source/` (git-ignored)
- [x] First-minute analysis: `notes/findings.md`
- [x] Episode "head_start": original script on the reaction-time premise, voiceover 4:12 (Channel_Master_Voice), words verified with Whisper
- [x] Sound library: `sfx/` (177 sounds, credits.json, library_index.md, levels.json)
- [x] First minute v1: `episodes/head_start/head_start_minute1.mp4` (72 s, -14 LUFS), cue sheet `cues_min1.py` — awaiting review
- [x] Full episode v1: `episodes/head_start/head_start_full.mp4` (4:13, 1080p, -14 LUFS); render 54 min on one 4-core session; 47 beds + 319 effects — awaiting review
- [x] Feedback: next videos must feel like a filmed animation (camera moves, wind, rain, speed, angle changes)
- [x] Cinematic kit built (`Cinema`, `Atmos`, `Motion`, `TopDown`) + 20 s demo reel `video/out/demo_cinematic.mp4`
- [ ] Head Start v2 with the cinematic kit, or next episode script
- [ ] Parallel rendering across sessions for the next episode (see chat notes: workers need no voice file; segments return via Drive)

Drive folder: "Claude Video Studio" (1 - Reference videos, 2 - Skills, 3 - Finished renders)

## 2026-10-23 · Episodes 05 and 06 (3D, built overnight in one cloud session)
- [x] Topic research: YouTube autocomplete + view counts of the niche (Ifverse, IFOLOGY, Minute Zero, Oddly Elsewhere…). User picked **"What If You Couldn't Feel Pain?"** and **"What If Everyone Could Read Your Mind?"**.
- [x] Screenplays with sourced science (`episodes/05_no_pain/screenplay.md`, `episodes/06_read_your_mind/screenplay.md`); cast voices in `config/voices.json` (narrator What_If_In_Theory_Narrator).
- [x] Voices: `pipeline/fish_cast.py` (one request per beat, voice per speaker), `pipeline/assemble_cast.py` (per-episode `gaps.json`), `pipeline/whisper_words.py`, `pipeline/align_words.py`, `pipeline/timing_json.py` → `video/src/ep05|ep06/timing.json`. Ep05 5:57, Ep06 5:32.
- [x] Picture: shared kit `video/src/epx/` (Kit: timing, cast, ThoughtCard, Ripples, Damage, film assembly; Sets5; Sets6), shots `video/src/ep05/`, `video/src/ep06/`. Compositions `Ep5Picture`, `Ep5Strips`, `Ep6Picture`, `Ep6Strips`. Reviewed strips at 15/50/85 % twice per episode.
- [x] Music: 34 Mixkit tracks by mood in `music/library/` (git-ignored; `music/credits.json`, `music/README.md`). Freesound is blocked from cloud IPs (403).
- [x] Sound: `pipeline/synth.py` (sizzle, drill, bell, buzz, monitor, thought pops/whoomps…), `pipeline/cuekit.py`, cue sheets `episodes/05_no_pain/cues.py`, `episodes/06_read_your_mind/cues.py`. Mixer duck envelope now a running sum (was a 30-minute convolution).
- Render: `--gl=swangle`, 30 fps; two renders in parallel share the CPU (~47 frames/min combined, ~0.9 s/frame alone).
