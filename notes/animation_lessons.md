# Animation lessons: character anatomy and staging

Every rule here came from a real mistake found in a frame review. Read this before writing or changing any shot, and run the checklist at the bottom before every long render. When a review finds a new mistake, fix it **in the rig** when possible (so it cannot recur), then add a row here.

References used for the rules: the contact → down → passing → up walk cycle with arms swinging opposite the legs (Richard Williams, *The Animator's Survival Kit*; [UW CSE 459 walk-cycle assignment](https://courses.cs.washington.edu/courses/cse459/19au/assignments/assignment_5)); the shrug as raised shoulders, forearms out, palms up, head tilted ([Shrug](https://en.wikipedia.org/wiki/Shrug), [Darwin's antithesis breakdown](https://allthingslinguistic.com/post/176385950859/origins-of-the-shrug)).

## The rig (`video/src/kit/Character.tsx`) and what it enforces

| Rule | Why | How the rig enforces it |
|---|---|---|
| **R1. One view per shot: `view="side"` (3/4, facing +x) or `view="front"` (facing camera).** | The first rig was side-view only and was used facing the camera, so both arms sprouted from the sternum. | In front view the shoulders sit at the torso corners (±40), the face is centred, and arm angles mean "outward". In side view the shoulders sit at the top of the torso (±9) and angles mean "forward". |
| **R2. Elbows only flex forward (side) / outward-up (front); knees only flex backward.** | Several poses had forearms bending behind the upper arm (hyperextension) and the walk had the knee bending the wrong way. | `joints()` clamps every elbow and knee angle (`ELBOW`, `KNEE`). A wrong sign in a pose can no longer hyperextend a joint. |
| **R3. Arms attach to shoulders below the neck base, never to the neck or chest.** | Shrug arms came out of the chest. | `RIG.shoulderDrop` (12 px below the neck base); all limb roots come from `joints()`. |
| **R4. A short visible neck; the head overlaps the collar.** | A long black neck stump made the head look stuck on; no neck made it look like a ball on a box. | `RIG.headGap` 68 with `headR` 62: the head bottom sits just over the hood collar. |
| **R5. No outlines on limbs. Depth comes from tone.** | A dark outline around the arms made the figures look flat and cartoon-banded; the reference separates the arm from the body with shade. | Near sleeve a step lighter than the torso (`OUTFIT.sleeve`, required for every outfit), far sleeve darker (`topDark`), the rim light on the lit edge, and a soft translucent contact shadow under the near arm (`shadow` in `Limb`). Never add stroke outlines to character shapes. |
| **R6. Hands are mittens aligned with the forearm, thumb toward the body; feet are shoes pointing forward, toe tilting down when the leg trails.** | Dot hands and flat ellipses for feet read as sticks. | `Limb` draws them from the forearm/shin direction. |
| **R7. The walk is the four-pose cycle.** | The first walk bent knees mid-stance and elbows backward, with no body bob. | `walkPose(phase)`: knee straight at contact, most bent mid-swing; arms opposite the same-side leg with elbows flexed forward; body lowest at contact. Use it, don't hand-write walks. |
| **R8. Furniture is sized from the legs.** | Seated feet dangled; the table was at chest height. | `seatLayout(hipY, s)` gives seat, floor, chair-leg and table heights. |
| **R9. Held props sit in a hand.** | The cup floated beside the face. | Place from `handPos(x, y, s, facing, pose, which, view)` plus a fixed grip offset. |
| **R11. The body turns on a continuous yaw (0 front, 0.5 three-quarter, 1 profile); `view="side"` is a TRUE profile.** | The old "side" view was a front-width torso with both shoulders 9 px from the centre line and the face shifted 12 px: a body facing the camera with the arms rooted at the sternum, while the head and feet said "walking right". The user spotted it at once. | `joints()`/`Body`/`Face` interpolate on `yaw`: torso half-width 44→22, chest forward of the hips, shoulders from the torso corners (±40) to the back of the chest, hips 9→4, far eye squashed and gone in profile, mouth and brows squash to the leading edge, cap brims turn. Use `view="quarter"` when the expression must read (both eyes), `view="side"` for walks and silhouettes, and the `yaw` prop to turn a character inside a shot. Check `RigTest` after any rig change. |
| **R10. Overlays never cover a face or a hand.** | The brain icon covered the eyes; a label sat on a runner's head; a foreground phone overlapped the friend's hand. | Brain icon is high on the forehead; labels use `headPos()` clearance or live in the top/bottom third; check the first, middle and last frame of a shot for overlaps. |

## Staging rules for every shot

- A reaching arm must end outside the head circle and point at its target: check where `handPos()` lands, not just the angle numbers.
- Close-ups: hips at y ≈ 990 for s = 2.7, so the head centre lands near y ≈ 430 and the shoulders are in frame.
- Front view for anything symmetric (shrug, spread arms, fists up, hero stance, reaction to camera). Side view for walking, reaching, sitting at a table, pointing.
- Never start the long render until the checklist passes; if the code changes, stop the render and restart it (a running render keeps the old code).

## Review checklist (before every long render)

1. Render `KitTest` (expressions in both views, the 8 walk keys, the named poses, the seated pair) and `Strips1` (start, middle and end frame of every character shot). Look at every frame; do not rely on the middle frame alone.
2. For each character: both arms readable against the torso; a short neck; head centred on the shoulders; mitten hands; feet on the floor or on a chair rung.
3. No joint bends the wrong way (if one does, the clamp is wrong: fix the rig, not the pose).
4. Every held prop is in a hand; every reach points at its target; no hand passes through the head.
5. No overlay covers a face, an eye or a hand.
6. Framing: head in the upper half of a close-up; nothing important under the letterbox bars.
7. Fix, delete `out/strips`, re-render, look again. Only then render the minute.

## Camera and world motion (`video/src/kit/Cinema.tsx`, `Atmos.tsx`, `Motion.tsx`, `TopDown.tsx`)

| Rule | Why | How the kit enforces it |
|---|---|---|
| **C1. Every shot has a moving camera and a moving world.** A locked frame with a static background reads as a slideshow. | v1 of Head Start felt like slides with characters. | Use `Camera` with at least two keyframes (push, drift or pan) and `handheld` on; give sets `wind`, and add at least one atmosphere layer (`Leaves`, `Clouds`, `Dust`, `Rain`, `Fog`) per scene. |
| **C2. Parallax layers pivot on the frame centre and overscan.** | The first parallax maths shifted far layers off-centre, leaving black bands at the edges. | `Camera` moves a layer by `(cam − centre) × depth` and scales far layers up (`overscan`) so edges never show. |
| **C3. A long camera move needs a set wider than the move.** | The sprint ran off the end of a single café. | Wrap the set in `TileX` for travelling shots. |
| **C4. A rolled (tilted) camera needs zoom ≥ 1.15.** | Black corners at 0° … 6° roll at zoom 1. | Keep `zoom ≥ 1.15` whenever `roll ≠ 0`. |
| **C5. Cut between angles like coverage: wide → close → top-down → over-the-shoulder; whip-pan between people.** | Same angle for 10 s is dead. | `TopChar`/`TopCafe` for top-downs, `whip()` + `MotionBlur` for whip pans, `focus`/`dof` for rack focus. |
| **C6. Idle characters breathe and look at things.** | Frozen poses between actions. | Wrap poses in `idle()`; drive `look` with `lookAt()` toward whatever matters in the shot. |
| **C7. Speed is shown, not stated.** | A fast runner at normal frame reads slow. | `runPose` + `Trail` ghosts + `DustKicks` at `footfalls` + `Streaks`/`RadialLines` + camera lag and a punch-in on the burst. |
| **C8. Weather has depth.** | Flat rain looks like a screen filter. | Two `Rain` depths (far behind the subject, near in front), `Splashes` on the ground line, `WetReflection` under lights, `LensBeads` only on night/rain shots, `Fog` low. |
| **C9. 3D episodes (Three.js in Remotion): read `notes/3d_episode_handbook.md`.** | Episode 04 review found hands piercing phones, a wave hidden behind the head, sitting on air, wrong facing, empty sets, and cameras inside heads or vehicles. | Use `Props3D` (cradle grip, `wavePose`, `sitOn`/`kerbSit`, `faceTo`); dress every set; offset over-the-shoulder cameras about 1 m sideways; read test sheets at full size and strips frame by frame. |
| **C10. Music sits low under the voice.** | A synth score fought the narration. | Licensed tracks per scene mood (`MUSIC` list in `cues_full.py`) at about 9–13 dB under the voice while someone speaks, swelling to 5–7 dB under in gaps, with a new cue every 30–90 s (the user found −22 dB too quiet; `notes/19_studio_rules.md` §6); keep the synth only for stings and keep silence on the biggest beat. |
| **3D-11. No coloured point lights near glossy heads; on-body effects ride the hand/body as props; over-the-shoulder offset ≥ 0.9 m.** | Ep05 review: red "clown nose" from the hob light; burn glows floating off the hand; heads filling the frame. | `Hob light` off by default; `Damage` as `propR`; see `notes/3d_episode_handbook.md` §10. |
| **3D-12. Cast v2: use `cast/Actor` and `cast/Cast`; hair and hats are pieces of the head's own deformed surface.** | Cast sheet v1: hats sank into square and long heads (a beanie read as a headband, a cap vanished); hips poked out of shirts as a dark oval; glasses vanished on dark heads; tiny faces. | `Cap` builds from `headGeo(shape, part)`; beanie stops at 0.33 so eyes stay clear; hips sit inside the shirt; glasses take the ink colour on dark skin; face marks are scaled 2.3×. Check `CastSheet` after any rig change. |
