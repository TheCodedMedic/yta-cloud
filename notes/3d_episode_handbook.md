# The 3D episode handbook (Three.js inside Remotion)

This is how "What If in Theory" Episode 04 ("What If You Could Go Back in Time?") is built. Read it before building or fixing any 3D episode or Short. It complements the skill at `.claude/skills/story-video-3d/SKILL.md` (setup, voices, gates) with the exact code layout and every lesson learned. Last updated 2026-10-23.

## 1. Where everything lives
| Path | What |
|---|---|
| `episodes/<ep>/screenplay.md` | Beats as `N:` / `YOU:` / `<NAME>:` lines, plus `[picture notes]` (example: `What If in Theory/episodes/04_go_back_in_time/`) |
| `episodes/<ep>/script.txt`, `speakers.json`, `audio/para_NNN.mp3`, `master_voiceover.wav`, `timeline_chunks.json`, `words.json` | Voice and timing |
| `video/src/<ep>/timing.json` | `{words: [{b, w, s, e}], beats: [{b, s, e, gap}]}` in master seconds. Built from words.json plus the 0.3 s lead. |
| `video/src/cam3d/Person3D.tsx` | The character rig (see §3) |
| `video/src/cam3d/Props3D.tsx` | Held props and holding poses, `sitOn`, `kerbSit`, `faceTo`, `Chair`, `talkHands`, `wavePose`, `eatPose` |
| `video/src/cam3d/World3D.tsx` | Street set; options `night`, `bare` (no sky or lights, so `Env` supplies them), `cafe`, `lamps`, `nearTrees`, `glow`, `rewrite(i)` |
| `video/src/ep04/core.tsx` | `at(beat, word, nth, off)`, `atE`, `PS`, `PE`, `P(b)` (a cut 0.12 s before a beat), easings, `L3`, `orbit`, `hand` (handheld drift), `shakeC`, the `Shot` type and `ShotFrame` |
| `video/src/ep04/Minute1.tsx`, `PartB..E.tsx` | Shot lists per part, each with a `*Type` component for on-screen text |
| `video/src/ep04/Film.tsx` | Joins the parts (each shot ends where the next begins); `Ep4Film`, `Ep4FilmPicture`, review strips `Ep4Part<k>` |
| `video/src/ep04/Vfx.tsx` | `Bolt`, `BodyArcs`, `Rain` (freezable), `Streaks`, `Tunnel`, `SkyCracks`, `ClockFace` |
| `video/src/ep04/Sets.tsx` | `Env(mood)` (sky, fog and lights for night/dawn/day/golden/dusk), `Park`, `Plaza`, `Garage`, `Rooftop`, crowds |
| `video/src/ep04/Sets2.tsx` | `Space` (Earth and satellites), `Bus`, `Van`, `Car`, `Pigeon`, `Coffee`, `Pitch`, `Crossing`, `RiverRoad` (with the tower) |
| `video/src/ep04/Sets3.tsx` | Detailed interiors: `Kitchen` (cabinets, sink, kettle, fridge that opens, chairs), `Bedroom` (wardrobe, shelf, desk, laptop, posters), `Classroom` (chairs, windows), `CarPark`, `PhotoWall`, painted photos `Framed` |
| `video/src/ep04/Text.tsx`, `Dom.tsx` | On-screen type (Rise, Slam, Chip, Strike, Flash in Plus Jakarta Sans), phone screens, graphs, calendar |
| `video/src/ep04/AssetSheet.tsx`, `HandTest.tsx` | Review sheets: characters and effects; hands, props and seats |
| `episodes/<ep>/film_audio.py`, `cues_full.py` | Synthesised effects and stingers; the sound cue sheet |
| `pipeline/mix.py`, `pipeline/finish.py` | Mixer (beds duck under the voice), and finishing at −14 LUFS |
| `What If in Theory/music/pixabay/` | Licensed music tracks by mood, plus `credits.json` |

## 2. A shot
```ts
{ id: "kerb", t0: P(50), t1: P(51), noBlur?, grade?: "css filter", no3d?, dom?: (t) => <2D overlay/>,
  scene: (t) => <>…3D…</>,
  cam: (t) => ({ pos: [x, y, z], target: [x, y, z], fov, roll? }) }
```
- **Times come only from `at()`, `PS`, `PE`, `P`.** Never type seconds.
- **Every shot moves:** a push, orbit, crane, track or handheld drift.
- **Vary the moves:** never the same move twice in a row.
- **`noBlur`** for bullet-time orbits. Motion blur is otherwise automatic from the camera's turning speed.
- **`grade`** for memories (`sepia(0.45) saturate(0.55)`) and the cold teaser. No grain or vignette.

## 3. Characters: rules that came from the user's notes
- **Angles:** the rig is real 3D, so every angle works.
- **Arms:** `[forward, out, elbow, roll]`. The **roll** (upper-arm rotation) is what puts a forearm upright beside the head. A wave is `wavePose(t)` = arm out with roll +90 and the palm turned forward. Never raise an arm straight up: the hand goes behind the head.
- **Hands are flexible.** Pick a shape per pose: `relaxed`, `open`, `fist`, `point`, `grip`, `pinch`, `wave`, `thumbsUp`, `flat`, `cradle`. Set `wristL/R: [bend, twist]`. Talkers use `talkHands(t)` (open palms on the beat). Runners make fists.
- **Every object in a hand is a prop on that hand** (`propR` / `propL`), never floating in the world:
  - `HeldPhone`: always held with the `cradle` shape and `PHONE_LOOK`, so the phone rests on the palm, the fingers stay behind it and the thumb sits on the edge. Fingers must never cross the screen.
  - `HeldCup` with `CUP_HOLD`;
  - `HeldSpoon` with `eatPose(t, sitOn(h))` (spoon goes bowl → mouth), plus a `Bowl` on the table in reach;
  - `HeldToast`, `HeldBox`, `HeldBag`; a `Framed` photo held in both hands.
- **Nobody sits on air:**
  - Chairs: `sitOn(0.46)` with a `Chair` at the same position and yaw.
  - Bed edge: `sitOn(0.7)`.
  - Kerb: `kerbSit()`, with the pelvis on the kerb edge, knees up and feet on the road.
  - Lying down: rotate around the hips; put the feet near the bed's foot so the head lands on the pillow.
- **Two people face each other.** Compute yaw with `faceTo(from, to)` for both; never hand-type yaws in a two-person scene. Single close-ups still face the off-screen partner, with the camera over that partner's shoulder.
- **Looks:** the hero is `LOOKS.hoodie` (blue hoodie, the channel's signature). The cast is per story (Jamie, coach, keeper, teacher, older self), and extras `ex1..ex8` vary in clothes, hats and scarves.

## 4. Sets: the user wants detail
- **No empty spaces.** Every interior gets furniture, small props and wall decoration, plus a window with a frame and curtains.
- **Every exterior gets life:** extras, vehicles, signs, lamps, trees, puddles, litter.
- **Photos are painted pictures** (sky, places, people with faces), in frames with mats; never coloured blocks.
- **Replacing a place** (the café becoming a car park) must fill the same footprint with a fully dressed new place: cars, bays, a barrier, a booth, a P sign, walls, a billboard.
- **Variety across the film:** night rain, dawn park, golden plaza, interiors, rooftop at dusk, space, a pitch under lights, a river road. Weather and time of day mark time passing.

## 5. VFX in use
- **Lightning:** a white core with additive glow tubes, re-seeded every 2 frames.
- **Frozen rain:** stop the rain clock; the drops turn into beads.
- **Speed:** streaks plus a wide fov.
- **Time tunnel:** a scrolling streak cylinder.
- **Sky cracks:** bolts that grow in.
- **City rewrite:** `rewrite(i)` changes building heights and flashes the windows.
- **Others:** clocks rewind or skip; flashes on every time jump; a cold teaser with black bars only there.

## 6. Sound
- **Effects:** CC0 libraries plus numpy synthesis (crackle, thunder, the time tear, freeze whoosh, tunnel roar, screech, pass-by, ticks, bells).
- **Music:** licensed library tracks per scene mood (`music/pixabay`), ducked under the voice. Episode 04 sat about 20+ dB under, which reads as almost no music. From Part 2 on, aim for about 9–13 dB RMS under the voice while someone speaks, swelling in the gaps, with a new cue on every story turn (measured from a 78k-view reference, `notes/18_otherwise_why_it_resonates.md`). Use synthesised stingers and risers only for hits. Keep true silence on the biggest beat.
- **How the music is wired (Episode 04):**
  - `cues_full.py` has a `MUSIC` list of `(track, offset, start, end, rel_db)`, one entry per scene mood. Each entry is cut once into `music_beds/` and added as a bed. The mixer ducks beds under the voice.
  - `film_audio.py` run with `STINGS=1` writes `score_stings.wav`: only the hits, risers, heartbeats and clock ticks, so the synth never fights the music.
  - Never use `01_tense` (the user dislikes it).
- **Track choice:** when the user is present, offer 3–4 playable options per mood from several libraries and let them choose.

## 6b. Anatomy and acting
The full list of rules (true angles, hands, phone grip, waving, held props, sitting, facing, mouths, matte look, face variety) is in the skill, section 6a.

## 7. Review loop (non-negotiable)
1. **Test sheets** for any new rig feature or prop (`HandTest`, `AssetSheet`), read at **full size**. Small contact sheets hide fingers piercing phones and hands behind heads.
2. **Strips:** every shot at 15/50/85 %, rendered with `npx remotion render src/index.ts Ep4Part<k> out/p<k> --sequence --image-format=jpeg --gl=angle --scale=0.4 --port=3301` and tiled 3 across.
3. **Read every frame for:**
   - the camera inside meshes, or blocked by poles, trees or extras;
   - hands through tables or props;
   - floating sits;
   - props missing from hands;
   - wrong facing;
   - empty sets;
   - text over faces;
   - overlays that never leave.
   - Also check for:
     - **over-the-shoulder shots** where the near head fills the frame: offset the camera sideways (about 1 m perpendicular to the line between the two people);
     - **arms raised over the head** (use a fist bump or `wavePose` instead);
     - **framed photos held edge-on** (rest them on the lap, tilted up, with the hands on the sides, and shoot over the shoulder);
     - **cameras so close to a vehicle** that it reads as blocks.
4. **Fix, then re-render** only the changed parts. Then render the full film.

## 8. Rendering
- **Locally (Mac):** `--gl=angle --concurrency=4 --port=3301` (port 3000 is taken). The full 7:51 picture takes about 25 minutes.
- **Disk:** check `df -h ~` first. A full render needs about 3 GB free.
- **Finish:**
  ```bash
  python3 -I pipeline/finish.py picture.mp4 mix.wav out.mp4
  ```
  This gives −14 LUFS and checks durations.

## 9. Storytelling references
- **Our study notes:** `notes/16_otherwise_reference_study.md` and `notes/17_otherwise_storytelling_study.md`. Their template: open inside a small moment; numbered rules with one planted to break; real studies landed on "you"; a plus/minus middle; a climax solved by character; a warm landing; a mystery hook.
- **Episode 04 plan and fix audit:** `episodes/04_go_back_in_time/fix_audit_v1.md` (with the screenplay and the sound scripts `film_audio.py`, `cues_full.py` in the same folder; the audio files themselves are not in git).

## 10. Lessons from Episodes 05–06 (cloud, overnight)
| Mistake found in review | Rule / fix (in the kit where possible) |
|---|---|
| A red dot on every glossy head near the hob | Point lights near faces show as specular dots on the clear-coat head. `Hob` has no light unless `light` is set; keep coloured point lights out of close-ups. |
| Glows (burns, bruises) floating beside the hand | Anything on a hand is a hand prop: pass `Damage` as `propR`. `XRayHero` adds the seated `bob` to upper-body glow points. |
| A hand glow placed on the wrong side | A character at yaw π has their right hand on world **+x**. Compute hand positions; don't guess. |
| Over-the-shoulder shots filled by the near head (again) | Offset ≥ 0.9 m sideways, or shoot over seated heads from above (y ≈ 1.9). Seated head centre ≈ y 1.22 (`sitOn(0.46)`), bus seat ≈ 1.31. |
| Arms raised to the head cross the face | "Stressed" = fists at the sides + head down + blink. No hands-on-head poses. |
| Thought cards unreadable in wide shots | `ThoughtCard` `h` is the height of one text line; cards wrap at 560 px and sit on their tail above the head. Use h ≈ 0.22 at 2–4 m, 0.34 at 5–6 m. |
| A camera behind a fence or inside a tree | Check wide shots against the set footprint (garden fences at z ±4); pick a high shot from inside the set. |
| `at()` anchor that doesn't exist (beat had one "The") | Run `python3 pipeline/check_anchors.py video/src/<ep>/timing.json video/src/<ep>/*.tsx` before every strip render. |
| Silent title holds | Many library tracks start quietly: cut music with an offset (8–20 s) and put a pad under title holds. |
