# yta-cloud: animated "What If" videos

- Picture: Remotion project in `video/` (React/TypeScript). Kit in `video/src/kit/`, shots in `video/src/shots/`.
- Voice, timing and sound: Python in `pipeline/` and `episodes/<name>/`. Keys live in the git-ignored `.env` (`FISH_API_KEY`, `FISH_NARRATOR_VOICE_ID`, `FREESOUND_API_KEY`); read them in code, never print them.
- Style and process: `.claude/skills/nexus-what-if/SKILL.md` (written for Blender; we use Remotion for the picture, everything else applies).
- Progress: `notes/progress.md`. Reference findings: `notes/findings.md`.

## Before writing or changing any shot
Read `notes/animation_lessons.md` and follow it. Run its review checklist (`video/review.sh`, `Strips1`) before every long render. When a review finds a new mistake, fix it in the rig or kit when possible (so it cannot recur), then add a row to that file.

## Rendering in a cloud session
- Pass `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` (Remotion can't download its own browser here).
- Fonts are bundled in `video/public/fonts`; don't switch to Google Fonts loading (the proxy breaks it).
