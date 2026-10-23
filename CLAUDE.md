# yta-cloud: animated "What If" videos

**Pick the video style first: `.claude/skills/README.md`** (default: `house-style-3d`). **Then read `notes/19_studio_rules.md`** (the user's standing rules: work from GitHub on several cloud machines, tests are not episodes, story first, our own varied characters, designed scenes). For 3D work follow `.claude/skills/story-video-3d/SKILL.md`. Then read `.claude/skills/nexus-remotion/SKILL.md`: it is the complete record of how videos are made here (Remotion for the picture, Python for voice, timing and sound; no Blender). The older `nexus-what-if` skill supplies the story rules and sound principles.

- Picture: Remotion project in `video/`. Kit in `video/src/kit/`, shots in `video/src/shots/`. `shots/demo.tsx` is the reference for the cinematic style.
- Voice, timing, sound: `pipeline/` and `episodes/<name>/`. Keys in the git-ignored `.env` (`FISH_API_KEY`, `FISH_NARRATOR_VOICE_ID`, `FREESOUND_API_KEY`); read in code, never print.
- Notes: `notes/progress.md` (state), `notes/findings*.md` (reference studies), `notes/animation_lessons.md` (rules).

## Before writing or changing any shot
Read `notes/animation_lessons.md` and follow it, including the camera and world-motion rules C1–C8: every shot has a moving camera (`Camera` with keyframes and handheld), parallax layers, atmosphere, and idle life on characters. Run the review loop (`KitTest`, a `Strips` composition, tiled and inspected frame by frame) before every long render. When a review finds a new mistake, fix it in the rig or kit so it cannot recur, then add a row to the lessons file.

## Rendering in a cloud session
- Pass `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` (Remotion cannot download its own browser here).
- Fonts are bundled in `video/public/fonts`; do not switch to Google Fonts loading.
- Long renders run in the background; if the code changes afterwards, stop and restart them.
