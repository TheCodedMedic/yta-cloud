# Progress

Pipeline: Remotion (React/TypeScript) for picture, Python for analysis, voice, timing and sound. No Blender.

- [x] Cloud rendering test: Remotion ~0.35 s/frame at 1080p on a 4-core cloud session (`ifverse-test/`)
- [x] Blender EEVEE checked in the cloud: ~9 s/frame (no GPU) — dropped
- [x] Skill loaded (`.claude/skills/nexus-what-if/SKILL.md`); `workspace/` bundle not available — rebuild in Remotion
- [x] Fish Audio key works (stored in `.env`, git-ignored, as `FISH_API_KEY`)
- [x] Narrator voice: **Channel_Master_Voice** (id in `.env` as `FISH_NARRATOR_VOICE_ID`), model `s2.1-pro-free`
- [ ] Reference video: first 1-2 min into Drive "1 - Reference videos" (<10 MB), then analysis
- [ ] Story / topic for the first video
- [ ] First minute
- [ ] Full video

Drive folder: "Claude Video Studio" (1 - Reference videos, 2 - Skills, 3 - Finished renders)
