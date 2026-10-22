# yta-cloud

Animated "What If" story videos (black-head stick characters, Ifverse style) made entirely in code and rendered in a cloud session. No Blender.

- Repo: https://github.com/TheCodedMedic/yta-cloud
- Branch with everything: `ccr-02c1c28f-vt1fb7` (the only branch)

## Start here

1. `CLAUDE.md` is read automatically by Claude Code and points to the pipeline record.
2. `.claude/skills/nexus-remotion/SKILL.md` is the complete, step-by-step record of how a video is made here: reference study, script, Fish Audio narration, Whisper word timing, the Remotion rig and kit, the cinematic camera layer, the review loop, rendering, the sound library, mixing, finishing and delivery.
3. `.claude/skills/nexus-what-if/SKILL.md` holds the story rules and sound-design principles (its Blender picture section is superseded).
4. `notes/animation_lessons.md` holds the anatomy rules R1–R10 and camera rules C1–C8 that every shot must follow.

## What is in the repo

| Part | Where |
|---|---|
| Picture (Remotion, React/TypeScript) | `video/` — kit in `video/src/kit/`, shots in `video/src/shots/`, bundled fonts in `video/public/fonts` |
| Voice, timing, mix, finish (Python) | `pipeline/` |
| Finished episode "Head Start" | `episodes/head_start/`: script, per-beat narration MP3s, word timings, cue sheets |
| Sound library (177 CC0 effects, credits) | `sfx/library/`, `sfx/credits.json`, `sfx/library_index.md` |
| Reference-study notes and progress | `notes/` |
| Cinematic demo reel shots | `video/src/shots/demo.tsx` |

## What is not in the repo (and how to get it)

- **API keys.** Create a `.env` file at the repo root (git-ignored):
  ```
  FISH_API_KEY=...            # Fish Audio, for the cloned narrator voice
  FISH_NARRATOR_VOICE_ID=...  # the Fish Audio voice id to narrate with
  FREESOUND_API_KEY=...       # only needed to add new sounds to the library
  ```
  Without Fish Audio keys the existing Head Start narration still works, because its per-beat MP3s and word timings are committed.
- **Rendered videos (MP4) and WAV mixes.** Too large for git. Rebuild them with the steps in the skill, or ask the author for the files.
- **Reference videos.** Not redistributed. The findings written from them are in `notes/findings*.md`.

## Setup on a fresh clone

```
cd video && npm i && cd ..
pip install -r pipeline/requirements.txt
# ffmpeg and a Chromium build must be on the machine; in Claude cloud sessions pass
# --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell to Remotion
```

Quick check that the picture side works:

```
cd video && npx remotion still src/index.ts KitTest out/kittest.png --frame=0 \
  --browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
```
