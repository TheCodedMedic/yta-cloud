# Reference findings: Ifverse, "What If Your Reaction Time Was 10x Faster?"

Source: the full 7:13 video (720p, 24 fps) from the Drive folder. For study only: we copy the style, never the script, characters or audio.
Evidence: 1 frame/second contact sheets of 0:00-1:00, full-res frames at 0:04.5, 0:12.2, 0:37.5, 0:48.5, ffmpeg scene cuts (threshold 0.3), EBU R128 loudness, Whisper `small` transcript.

## Structure of the first minute

| Time | Beat | Picture |
|---|---|---|
| 0:00-0:03 | Establishing | Wide café front at sunset, two tiny figures at a table, static |
| 0:03-0:10 | Hook: the fly | Macro of a fly over bokeh, close-up hero smiling, slow-motion fist catching it with **two rings** |
| 0:10-0:19 | Proof 2: the cup | Wide side view of the terrace, **speed-line flash** (0:12), cup falling in blur, macro hand slides under the cup, hero smug |
| 0:20-0:26 | Reaction | **Top-down** shot of the table, friend in yellow cap points, shocked face |
| 0:27-0:34 | The number | Friend at the table, **stopwatch HUD** top right "0.25 s"; hero in a sunburst close-up, HUD turns gold "0.025 s" |
| 0:34-0:39 | Title card | Pan up from the sky to the café; "WHAT IF YOUR REACTION TIME / WAS 10x FASTER?" + "A STICKMAN WHAT-IF" under a thin line |
| 0:40-0:51 | How it works | Lab set: scientist with pointer, labels **EYES → BRAIN → MUSCLES** appear word by word, glowing brain icon on the head, "x10" vs "x1" tags |
| 0:52-0:56 | Diagram | Dark blueprint/chalkboard panel, two running figures in lanes, "=" sign, arrows |
| 0:56-1:00 | Ruler test | Scientist and hero, then macro hand over a ruler (grey cool grade) |

## Numbers
- Cuts: 24 in the first minute, then 18, 15, 11, 10, 8 ... (pace slows as the video goes on). Median shot 2.0 s.
- Loudness: first minute about **-14.8 LUFS** integrated.
- Narration: short second-person sentences ("You don't even think. You just catch it."), one number per beat, proof before the premise, title card at ~0:35.

## Look
- Flat 2D vector, **letterboxed** (black bars top and bottom, ≈2:1).
- Heads: solid black circles, **warm peach rim light** on one side, cream face marks (arc eyes, smile, ring eyes for shock, glasses on the scientist).
- Bodies: thin black limbs, coloured hoodie (red) / cap (yellow) / lab coat (white) for identity. Hands appear only in macro shots, as big hands with fingers.
- Palette: violet dusk sky, warm orange window glow, deep purple-brown walls, red/cream striped awning.
- Depth: strong background blur on close-ups, bokeh discs, foreground blur (flasks in the lab), vignette.
- Effects: speed-line burst flash, concentric rings, sunburst behind the hero, glowing brain icon, small HUD stopwatch.
- Text: heavy rounded sans, all caps, cream with a warm glow; title has a gold gradient. Labels are small and sit high in the frame.

## For our Remotion build
All of the above is doable as SVG/React layers: blur via CSS filter on background layers, rings and flashes as SVG overlays, letterbox as two animated bars, HUD and labels as components. The hardest parts are character posing (arms/hands) and the macro hand shots.
