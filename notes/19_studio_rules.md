# 19 · Studio rules from the user (2026-10-23, after the two overnight tests)

These come from the user's review of the two test videos ("What If You Couldn't Feel Pain?", "What If Everyone Could Read Your Mind?"). Read them before starting any project. They sit on top of the skills (`story-video-3d` §6a for anatomy, `notes/18_otherwise_why_it_resonates.md` for story and music).

## 1. Work in the cloud, from GitHub
- **Before any work starts,** create the project's working branch and push everything the work needs: code, scripts, `timing.json`, cue sheets, and any assets the picture needs. Anything that lives only on one machine blocks every other machine.
- **Render on several cloud machines at once.** Split each video into chunks; each machine renders its own frame range and pushes its chunk back through git; the main session joins the chunks. See `pipeline/render_farm.md`.
- **Check long jobs on a timer.** A finished file must never sit unnoticed.

## 2. Tests are not episodes
- Until the user names a channel, projects are **tests** (`episodes/test_*`, `video/src/test_*`), not episode numbers.
- Once a channel is named, adopt its branding: its characters and how they look, its intro and outro, its title and type style, its music feel, its sign-off.

## 3. Story first
- **No "Rule 1, Rule 2, Rule 3" template.** Tell a story; give the viewer something (feeling, a memory, a thing to do today).
- Study the reference channel the user supplies (via Google Drive) the same way as before: frames, captions, structure, music, and *why* it lands. Then write.

## 4. Characters must be our own and varied
- **Too similar to other channels today:** the same eyes, the same everything. Design our own look.
- **House look (decided 2026-10-23):** everyone has a natural skin tone with dark face marks; **only the protagonist** has the black head with light face marks, so they stand out in every crowd. Use `castWithHero(i)` / `asHero(look)` from `video/src/cast/Cast.tsx`.
- **Less shine on the heads** (matte or satin), while keeping faces readable: light the face, give the face marks contrast, use a rim light for shape.
- **About 20 face variations:** eye shapes, brows, mouths, lids, lashes, freckles, glasses.
- **Head shapes, builds and outfits vary:** taller, shorter, broader, slimmer; headphones, beanies, caps, hair, hoods, scarves; different clothes per person.
- **Hands are alive:** fingers move with the action and settle when idle; never one stiff mitten. Study game-style body mechanics (GTA): weight shifts, follow-through, hands that reach, grab and let go.
- **No rigid crowds:** people who talk to each other gesture, listen, react, shift weight and look around, each on their own timing.

## 5. Visuals and scene design
- **Lots of visual effects,** used to tell the story, not as decoration.
- **Use 2D or 2.5D where it fits** (memories, diagrams, comedy beats, montages); not everything has to be 3D.
- **Design each scene:** what happens, who is where, what the camera sees. Cover it like a film: a wide from afar, a push in to someone, a shot over a shoulder, a point of view, a top view. Cut and move with purpose; add whooshes on fast moves. No blurred, undesigned shots.

## 6. Sound
- Music sits about 9–13 dB under the voice while someone speaks and swells in the gaps, with a new cue on every story turn (note 18). The two tests sat about 22 dB under, which is too quiet.
