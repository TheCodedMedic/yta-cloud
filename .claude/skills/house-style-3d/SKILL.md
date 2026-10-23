---
name: house-style-3d
description: Our own 3D look ("house style"). Everyone has natural skin tones and dark face marks; only the protagonist has the black head with light face marks. 20 varied matte characters with live hands, designed coverage, lots of VFX, 2D/2.5D inserts, story-first scripts, and renders split across several cloud machines. Use when the user asks for a video "in our style", "the new style", "house style", or with "our main character / the black-head hero", or for any test video not tied to a named channel.
---

# House style 3D

**Which style am I making?** See `.claude/skills/README.md`. This skill is the **house style**: our own characters, not a copy of another channel. It sits on top of `story-video-3d` (the engine: Three.js in Remotion, voice, timing, sound) and replaces that skill's character look.

Read first, in order:
1. `notes/19_studio_rules.md`: the user's standing rules.
2. `notes/18_otherwise_why_it_resonates.md`: story. The power stands for a universal feeling, there is one tiny memory, and the video ends with something to do today.
3. `.claude/skills/story-video-3d/SKILL.md` §6a and `notes/3d_episode_handbook.md`: anatomy, hands, props, seats, facing.

## 1. The look
| Who | Head | Face marks | Code |
|---|---|---|---|
| **Protagonist** | black ink (`#20181E`) | light (`#F4EFE6`) | `asHero(look)` |
| Everyone else | natural skin tone | dark (`#1E1418`) | `CAST_SKIN[i]` |

- **Default protagonist: Kai.** Round head, a tuft of hair, oval eyes, thick brows, blue hoodie (`castWithHero(0)`).
- **Heads are matte.** Use a satin finish at roughness 0.62, with no clearcoat and no glossy highlights. Light the face, and add a rim light for shape.
- **20 people** live in `video/src/cast/Cast.tsx`. Each has a head shape, a face (eyes, brows, mouth, nose, freckles, blush, beard), hair or hat, headphones or glasses, an outfit and a build.
- **Never give two people in one shot the same face or outfit.** Recolour tops (`topColor`) when you need extras.
- **The rig** is `video/src/cast/Actor.tsx`. Use `<Actor look pose expr t seed>` for bodies and `<ActorHead>` for close inserts.
- **Idle life is on by default** (`alive=1`): breathing, weight shift, head drift, blinks and drifting fingers. Give every actor its own `seed`.
- **Expressions** use `Expr {smile, open, brow, blink, eyesBig, lookX, lookY, talk}`. Mouths move only when that person speaks: drive `talk` from word timings.
- **Review sheet:** after any rig change, render the `CastSheet` composition (5 panels) and look at every panel.

## 2. Story
- **Tell a story; never use a "Rule 1, 2, 3" structure.** One person, one want, one turn, one feeling.
- **Use the 1-minute shape:**

  | Time | Beat |
  |---|---|
  | 0–5 s | Hook: the image that makes them stay |
  | 5–20 s | The power or situation, and the fun of it |
  | 20–40 s | The cost, plus one small specific memory |
  | 40–55 s | The turn: what it really means |
  | 55–60 s | One thing to do today |

- **Narrator voice plus at most two character lines.** Fish Audio, per-speaker voices from `config/voices.json`. Apply the pace check: no clip more than 25% faster than its speaker's median.

## 3. Picture
- **Design every scene before coding it:** what happens, who is where, and what the camera sees.
- **Cover each scene like a film:**
  - a wide from afar;
  - a push in to a face;
  - over the shoulder, offset at least 0.9 m sideways;
  - a POV;
  - a top view.
- **Every shot moves:** use `Camera` keyframes with handheld shake. Fast moves get a whoosh.
- **VFX tell the story; they are never decoration.** Use the kit's frozen rain, speed streaks, rings, time tunnels, glows and particles, and add new effects to the kit.
- **Use 2D or 2.5D inserts** for memories, diagrams, comedy beats and montages. Flat paper layers with parallax are fine.
- **Mostly daylight.** Do not put coloured point lights near heads.

## 4. Sound
- Music sits about 9–13 dB under the voice while someone speaks and swells to 5–7 dB under in the gaps. Change the cue on every story turn.
- Whooshes go on camera moves, and every on-screen action gets a foley hit. Leave a moment of silence before the biggest beat.

## 5. Make it (cloud workflow)
1. **Create the project:**
   - project folders: `episodes/test_<name>/` (voice, cues, mix) and `video/src/test_<name>/` (shots);
   - compositions: `Test<Name>Picture` and `Test<Name>Strips`;
   - naming: use "test", not an episode number, until the user names a channel.
2. **Push everything the picture needs** before rendering: code, `timing.json` and assets.
3. **Review loop:** render a `Strips` composition, tile it, and inspect it frame by frame. Fix mistakes in the rig or kit, and add a row to `notes/animation_lessons.md`.
4. **Render on the farm** (`pipeline/render_farm.md`). Use 600 frames per worker, so a 1-minute video takes 3 workers and about 7 minutes.
5. **Mix and finish:** mix at −14 LUFS, mux, check, and deliver.
6. **Watch long jobs on a timer** so a finished file never sits unnoticed.
