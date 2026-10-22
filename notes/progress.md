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
