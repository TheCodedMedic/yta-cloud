# Ifverse-style test

A 12-second recreation of the look of Ifverse's "What If Your Reaction Time Was 10x Faster?" (first minute), built in Remotion.

- `npm i`, then `npm run studio` to preview, `npm run render` to make `out/intro.mp4`
- In a Claude Code cloud session, add `--browser-executable=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell` to the render command (Remotion can't download its own browser there)

## Style notes (from the original's storyboard)

- Flat 2D vector, sunset palette: dusky purple shadows, warm window glow, sun with soft bloom
- Characters: solid black round heads with a warm rim light, arc "happy" eyes, coloured hoodies or caps
- Shots: wide establishing shot, then character close-ups over a blurred background (depth of field), then a title card with sun rays
- Info graphics: small HUD gauges ("0.25 s"), labels like "EYES → BRAIN", measurement callouts ("NORMAL 30 cm / YOU 3 mm")
- Finish: vignette + light film grain, slow camera push-ins, soft crossfades

## Files

- `src/theme.ts` holds the palette
- `src/Backdrop.tsx` has the sky, sun rays, café set, grading
- `src/Character.tsx` has the close-up and tiny figures
- `src/Intro.tsx` has the three scenes and their timing
