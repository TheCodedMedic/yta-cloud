// "7 Days Offline": 20 shots, every cut on a measured word (beats 0-8 of episodes/offline_short). Landscape world, centre band.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Fog, GodRays, Leaves, Rain, Splashes, WetReflection, wind } from "../kit/Atmos";
import { Stage } from "../kit/Camera";
import { blinkAt, Character, handPos, POSES, walkPose } from "../kit/Character";
import { Camera, GroundShadow, TileX } from "../kit/Cinema";
import { Bokeh, clamp01, Dust, Rings, sstep, Streaks } from "../kit/Fx";
import { idle, RadialLines } from "../kit/Motion";
import { CrowdRow, DarkRoom } from "../kit/Sets2";
import { CafeFront, Sky, SunRays } from "../kit/Sets";
import { Flash, Shot } from "../shots/types";
import { at, CardReader, City, Coin, END, Envelope, Lamppost, MapSheet, P, PhoneBig, seg, Shelves, Truck } from "./ShortKit";

const bgWarm = (t: number) => <><Sky t={t} sunY={260} /><CafeFront t={t} wind={0.3} /></>;
const S = (id: string, t0: number, t1: number, render: Shot["render"], cool = 0): Shot => ({ id, t0, t1, cool, render });

export const SHORT_FLASHES: Flash[] = [
  { t: at(0, "disappears"), strength: 0.55 },
  { t: at(1, "won't"), strength: 0.8 },
];

export const SHORT: Shot[] = [
  // 1. HOOK: the phone in your hand loses the internet (feed -> spinner -> NO CONNECTION), rings, a shake
  S("hook", 0, at(0, "For", 1, -0.05), (t) => {
    const st = t < at(0, "internet") ? "feed" : t < at(0, "disappears") ? "spin" : "nocon";
    return (
      <Camera t={t} hand={1} shakeAge={t - at(0, "disappears")} shakeAmp={22}
        keys={[{ at: 0, x: 960, y: 560, zoom: 1.0 }, { at: 1.9, x: 960, y: 540, zoom: 1.14 }]}
        layers={[
          { depth: 0.3, blur: 10, children: <><AbsoluteFill style={{ background: "#141126" }} /><Stage><City lit={0.8 - 0.6 * seg(t, at(0, "disappears"), 1.9)} t={t} /></Stage><Bokeh t={t} n={14} seed="hk" opacity={0.35} /></> },
          { depth: 1, children: (
            <Stage>
              <PhoneBig x={960} y={560} s={1.55} rot={-4} state={st} t={t} />
              <Rings t={t - at(0, "disappears")} cx={960} cy={560} scale={1.4} color="#ff6b55" />
            </Stage>
          ) },
        ]} />
    );
  }),
  // 2. the whole city goes dark, window by window; "7 DAYS" (vertical text, see Short.tsx)
  S("city", at(0, "For", 1, -0.05), P(1), (t) => {
    const tt = t - at(0, "For");
    return (
      <Camera t={tt} hand={0.8} keys={[{ at: 0, x: 960, y: 520, zoom: 1.2 }, { at: 2.2, x: 960, y: 600, zoom: 1.08 }]}
        layers={[
          { depth: 0.4, children: <AbsoluteFill style={{ background: "linear-gradient(#0b1226,#2a2048)" }} /> },
          { depth: 0.8, children: <Stage><City lit={0.75 * (1 - seg(t, at(0, "For"), at(0, "days")))} t={t} /></Stage> },
          { depth: 1.4, blur: 4, children: <Dust t={t} n={18} seed="ct" /> },
        ]} />
    );
  }, 0.3),
  // 3. "You think you'll be fine": a smug close-up in warm daylight
  S("fine", P(1), at(1, "You", 2, -0.06), (t, u, f) => (
    <Camera t={t} hand={1} keys={[{ at: 0, x: 960, y: 520, zoom: 1.0 }, { at: 1.3, x: 960, y: 500, zoom: 1.08 }]}
      layers={[
        { depth: 0.4, blur: 10, children: bgWarm(t) },
        { depth: 1, children: <Stage><Character x={960} y={1000} s={2.7} view="front" outfit="ivory" pose={idle({ ...POSES.front, armN: [26, 40], armF: [26, 40], shrug: 0.4 }, t, 3)} expr="smug" look={[0.15, 0]} blink={blinkAt(f, 9)} /></Stage> },
      ]} />
  )),
  // 4. "You won't": smash to shock, white burst, cold grade, a zoom punch
  S("wont", at(1, "You", 2, -0.06), P(2), (t, u, f) => {
    const tt = t - at(1, "won't");
    return (
      <Camera t={t} hand={1.4} shakeAge={tt} shakeAmp={26} keys={[{ at: at(1, "You", 2), x: 960, y: 480, zoom: 1.12 }, { at: at(1, "won't") + 0.25, x: 960, y: 470, zoom: 1.28, ease: "out" }]}
        layers={[
          { depth: 0.4, blur: 12, children: <><Sky t={t} sunY={260} tint="#3b4a80" /><CafeFront t={t} wind={0.3} /></> },
          { depth: 1, children: <Stage><RadialLines cx={960} cy={430} t={tt} n={36} opacity={0.5} /><Character x={960} y={1000} s={2.7} view="front" outfit="ivory" pose={{ ...POSES.front, shrug: 0.8 }} expr="shock" look={[0, 0]} blink={false} /></Stage> },
        ]} />
    );
  }, 0.35),
  // 5. "The lights still work": a dark room, the lamp comes on, warm
  S("lights", P(2), at(2, "But", 1, -0.06), (t, u, f) => {
    const on = sstep(seg(t, at(2, "lights"), at(2, "lights") + 0.3));
    return (
      <Camera t={t} hand={0.8} keys={[{ at: P(2), x: 1000, y: 560, zoom: 1.15 }, { at: at(2, "But"), x: 1040, y: 540, zoom: 1.24 }]}
        layers={[
          { depth: 1, children: <AbsoluteFill style={{ filter: `brightness(${0.45 + 0.6 * on})` }}><DarkRoom t={t} glow={on > 0.5 ? "#f2b84b" : "#334"}>
            <Character x={1060} y={600} s={1.25} view="front" outfit="ivory" pose={idle(POSES.front, t, 2)} expr={on > 0.5 ? "smile" : "neutral"} look={[0.3, -0.2]} blink={blinkAt(f, 4)} />
          </DarkRoom></AbsoluteFill> },
        ]} />
    );
  }),
  // 6. "your card is useless": the reader says DECLINED, a small shake
  S("card", at(2, "But", 1, -0.06), at(2, "your", 2, -0.06), (t) => (
    <Camera t={t} hand={1} shakeAge={t - at(2, "useless")} shakeAmp={10} keys={[{ at: at(2, "But"), x: 960, y: 540, zoom: 1.05 }, { at: at(2, "your", 2), x: 960, y: 520, zoom: 1.18 }]}
      layers={[
        { depth: 0.4, blur: 10, children: <><AbsoluteFill style={{ background: "#2b2433" }} /><Bokeh t={t} n={10} seed="cd" opacity={0.3} /></> },
        { depth: 1, children: <Stage><CardReader x={960} y={560} s={1.7} declined={seg(t, at(2, "useless") - 0.1, at(2, "useless"))} /></Stage> },
      ]} />
  )),
  // 7. "your map is blank": the blue dot alone on a grey nothing
  S("map", at(2, "your", 2, -0.06), at(2, "and", 1, -0.06), (t) => (
    <Camera t={t} hand={0.8} keys={[{ at: at(2, "your", 2), x: 960, y: 540, zoom: 1.05 }, { at: at(2, "and"), x: 960, y: 540, zoom: 1.2 }]}
      layers={[
        { depth: 0.4, blur: 10, children: <AbsoluteFill style={{ background: "linear-gradient(#1b2a4e,#0b1226)" }} /> },
        { depth: 1, children: <Stage><PhoneBig x={960} y={540} s={1.7} state="mapgone" t={t} gone={seg(t, at(2, "blank") - 0.3, at(2, "blank") + 0.4)} /></Stage> },
      ]} />
  )),
  // 8. "you never learned your mum's number": worry, the contact with no digits
  S("mum", at(2, "and", 1, -0.06), P(3), (t, u, f) => (
    <Camera t={t} hand={1} keys={[{ at: at(2, "and"), x: 980, y: 520, zoom: 1.02 }, { at: P(3), x: 960, y: 520, zoom: 1.12 }]}
      layers={[
        { depth: 0.4, blur: 12, children: <><AbsoluteFill style={{ background: "#151a2e" }} /><Bokeh t={t} n={12} seed="mm" opacity={0.3} /></> },
        { depth: 1, children: <Stage><Character x={1060} y={1010} s={2.6} view="front" outfit="ivory" pose={idle(POSES.front, t, 5)} expr="worry" look={[-0.4, 0.2]} blink={blinkAt(f, 14)} /></Stage> },
        { depth: 1.2, children: <Stage><PhoneBig x={790} y={780} s={1.0} rot={-10} state="mum" t={t} /></Stage> },
      ]} />
  )),
  // 9. "So you learn a trick": a smug look, the folded paper map in hand
  S("trick", P(3), at(3, "Don't", 1, -0.06), (t, u, f) => {
    const pose = idle({ ...POSES.front, armN: [40, 120], armF: [14, 12] }, t, 7);
    const [hx, hy] = handPos(960, 1000, 2.6, 1, pose, "N", "front");
    return (
      <Camera t={t} hand={1} keys={[{ at: P(3), x: 960, y: 540, zoom: 1.02 }, { at: at(3, "Don't"), x: 960, y: 520, zoom: 1.1 }]}
        layers={[
          { depth: 0.4, blur: 10, children: bgWarm(t) },
          { depth: 1, children: <Stage><Character x={960} y={1000} s={2.6} view="front" outfit="ivory" pose={pose} expr="smug" look={[0.2, 0.1]} blink={blinkAt(f, 3)} /><MapSheet x={hx + 10} y={hy - 70} s={0.42} open={0} route={0} t={t} /></Stage> },
        ]} />
    );
  }),
  // 10. "Don't trust the dot": the phone is tossed away in an arc (side view)
  S("dot", at(3, "Don't", 1, -0.06), at(3, "Trust", 2, -0.06), (t, u, f) => {
    const k = seg(t, at(3, "dot") - 0.2, at(3, "Trust", 2));
    const pose = { ...POSES.stand, armN: [40 + 70 * sstep(k), 10] as [number, number] };
    const [hx, hy] = handPos(860, 760, 1.6, 1, pose, "N", "quarter");
    const px = hx + 700 * k, py = hy - 260 * k + 700 * k * k;
    return (
      <Camera t={t} hand={1} keys={[{ at: at(3, "Don't"), x: 960, y: 520, zoom: 1.1 }, { at: at(3, "Trust", 2), x: 1000, y: 500, zoom: 1.16 }]}
        layers={[
          { depth: 0.4, blur: 8, children: bgWarm(t) },
          { depth: 1, children: <Stage><GroundShadow x={860} y={760 + 176} w={160} /><Character x={860} y={760} s={1.6} view="quarter" outfit="ivory" pose={pose} expr="determined" look={[0.6, -0.3]} blink={blinkAt(f, 20)} />
            <PhoneBig x={px} y={py} s={0.45} rot={-20 + 540 * k} state="dark" t={t} /></Stage> },
        ]} />
    );
  }),
  // 11. "Trust the paper": the map opens full frame, the route draws to the star
  S("paper", at(3, "Trust", 2, -0.06), P(4), (t) => {
    const open = sstep(seg(t, at(3, "Trust", 2), at(3, "paper") + 0.1));
    const route = sstep(seg(t, at(3, "paper"), P(4) - 0.1));
    return (
      <Camera t={t} hand={0.8} keys={[{ at: at(3, "Trust", 2), x: 960, y: 540, zoom: 1.0 }, { at: P(4), x: 1040, y: 470, zoom: 1.25 }]}
        layers={[
          { depth: 0.4, children: <><AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%,#5a4030,#1a1220)" }} /><Stage><GodRays x={1300} y={-40} t={t} opacity={0.18} /></Stage></> },
          { depth: 1, children: <Stage><MapSheet x={960} y={560} s={1.6} open={open} route={route} t={t} /><Rings t={t - (P(4) - 0.15)} cx={960 + 250 * 1.6} cy={560 - 130 * 1.6} color="#f2b84b" /></Stage> },
        ]} />
    );
  }),
  // 12. "It works on everything": a confident walk down the street (side, planted walk cycle)
  S("walk", P(4), at(4, "Cash", 1, -0.06), (t, u, f) => {
    const tt = t - P(4); const x = 760 + tt * 150;
    return (
      <Camera t={tt} hand={1} keys={[{ at: 0, x: 860, y: 560, zoom: 1.15 }, { at: 1.6, x: 1060, y: 560, zoom: 1.18 }]}
        layers={[
          { depth: 0.35, children: <><Sky t={t} sunY={240} /></> },
          { depth: 0.8, children: <TileX><CafeFront t={t} wind={wind(t, 0.4)} /></TileX> },
          { depth: 1, children: <Stage><GroundShadow x={x} y={760 + 176} w={150} /><Character x={x} y={760} s={1.6} view="side" outfit="ivory" pose={walkPose(tt * 9)} expr="smile" look={[0.2, 0]} blink={blinkAt(f, 5)} /></Stage> },
          { depth: 1.6, blur: 3, children: <Leaves t={t} n={6} strength={0.5} seed="wk" scale={1.6} /> },
        ]} />
    );
  }),
  // 13. Cash: coins spin up and out
  S("cash", at(4, "Cash", 1, -0.06), at(4, "Maps", 1, -0.06), (t) => {
    const tt = t - at(4, "Cash");
    return (
      <Camera t={tt} hand={1} keys={[{ at: 0, x: 960, y: 540, zoom: 1.0 }, { at: 0.7, x: 960, y: 540, zoom: 1.15 }]}
        layers={[
          { depth: 0.4, children: <AbsoluteFill style={{ background: "radial-gradient(circle,#4a3a20,#160f0a)" }} /> },
          { depth: 1, children: <Stage><Rings t={tt} cx={960} cy={540} color="#f2b84b" />
            {Array.from({ length: 7 }, (_, i) => { const a = i * 0.9 - 2.7; const r = 60 + 260 * clamp01(tt / 0.5); return <Coin key={i} x={960 + Math.cos(a) * r} y={560 + Math.sin(a) * r * 0.8 - 80 * clamp01(tt / 0.5)} s={0.9} rot={tt * 400 + i * 40} />; })}</Stage> },
        ]} />
    );
  }),
  // 14. Maps: the star on the map pulses
  S("maps", at(4, "Maps", 1, -0.06), at(4, "Letters", 1, -0.06), (t) => (
    <Camera t={t} hand={1} keys={[{ at: at(4, "Maps"), x: 1220, y: 420, zoom: 1.3 }, { at: at(4, "Letters"), x: 1290, y: 380, zoom: 1.5 }]}
      layers={[{ depth: 1, children: <><AbsoluteFill style={{ background: "#1a1220" }} /><Stage><MapSheet x={960} y={560} s={1.6} open={1} route={1} t={t} /><Rings t={t - at(4, "Maps")} cx={1360} cy={352} color="#d9472b" /></Stage></> }]} />
  )),
  // 15. Letters: an envelope drops into a red postbox
  S("letters", at(4, "Letters", 1, -0.06), P(5), (t) => {
    const k = sstep(seg(t, at(4, "Letters"), at(4, "Letters") + 0.6));
    return (
      <Camera t={t} hand={1} keys={[{ at: at(4, "Letters"), x: 960, y: 520, zoom: 1.1 }, { at: P(5), x: 960, y: 560, zoom: 1.2 }]}
        layers={[
          { depth: 0.4, blur: 8, children: bgWarm(t) },
          { depth: 1, children: <Stage>
            <rect x={860} y={560} width={200} height={420} rx={30} fill="#c8322c" /><rect x={880} y={620} width={160} height={22} rx={8} fill="#2a0d10" />
            <Envelope x={960} y={300 + 320 * k} s={0.6} rot={-10 + 10 * k} />
            <rect x={850} y={630} width={220} height={20} fill="#c8322c" />
          </Stage> },
        ]} />
    );
  }),
  // 16. "Until day three, when the shelves start to empty": the aisle empties as you walk past
  S("shelves", P(5), P(6), (t, u, f) => {
    const tt = t - P(5); const full = 1 - 0.8 * sstep(seg(t, at(5, "shelves"), at(5, "empty") + 0.4));
    return (
      <Camera t={tt} hand={1} keys={[{ at: 0, x: 960, y: 520, zoom: 1.15 }, { at: 3.0, x: 1090, y: 540, zoom: 1.1 }]}
        layers={[
          { depth: 0.6, children: <><AbsoluteFill style={{ background: "#d8dbe2" }} /><Stage><Shelves x={200} y={260} w={1520} full={full} /></Stage></> },
          { depth: 1, children: <Stage><GroundShadow x={820 + tt * 55} y={940} w={150} />
            <Character x={820 + tt * 55} y={760} s={1.6} view="quarter" outfit="ivory" pose={walkPose(tt * 6, 0.6)} expr="worry" look={[0.4, -0.3]} blink={blinkAt(f, 25)} />
            <CrowdRow x={1330} y={790} s={1.25} n={2} mood="shock" t={t} frame={f} seed="sh" gap={230} /></Stage> },
        ]} />
    );
  }, 0.15),
  // 17. "Every day it gets worse. Day four. Day five.": a dark street in rain (the day counter is vertical text)
  S("days", P(6), at(6, "And", 1, -0.06), (t, u, f) => (
    <Camera t={t} hand={1.1} keys={[{ at: P(6), x: 960, y: 560, zoom: 1.2 }, { at: at(6, "And"), x: 960, y: 600, zoom: 1.08 }]}
      layers={[
        { depth: 0.5, blur: 2, children: <><AbsoluteFill style={{ background: "#0e0c1a" }} /><Stage><City lit={0.08} t={t} dark={1} /></Stage><Rain t={t} n={110} near={false} seed="dr" opacity={0.45} /></> },
        { depth: 1, children: <Stage><WetReflection x={960} y={940} w={900} color="#ffd27a" opacity={0.18} t={t} /><GroundShadow x={960} y={940} w={160} />
          <Character x={960} y={760} s={1.6} view="front" outfit="ivory" pose={idle({ ...POSES.front, shrug: 0.5 }, t, 9)} expr="worry" look={[0, -0.3]} rim="#a9cdff" blink={blinkAt(f, 31)} />
          <Splashes t={t} y={940} n={20} /></Stage> },
        { depth: 1.5, children: <Rain t={t} n={40} near seed="dn" opacity={0.7} /> },
      ]} />
  ), 0.4),
  // 18. "the rumours move faster than the trucks": notes multiply on a lamp-post; a truck sits still
  S("rumours", at(6, "And", 1, -0.06), P(7), (t, u, f) => {
    const notes = 1 + 13 * seg(t, at(6, "rumours"), at(6, "trucks") + 0.3);
    return (
      <Camera t={t} hand={1} keys={[{ at: at(6, "And"), x: 960, y: 540, zoom: 1.12 }, { at: P(7), x: 920, y: 520, zoom: 1.22 }]}
        layers={[
          { depth: 0.5, blur: 4, children: <><AbsoluteFill style={{ background: "#141126" }} /><Stage><City lit={0.05} t={t} dark={1} /><Truck x={560} y={940} s={1.1} /></Stage></> },
          { depth: 1, children: <Stage><Lamppost x={1000} y={980} notes={notes} t={t} /><CrowdRow x={760} y={820} s={1.1} n={2} mood="shock" t={t} frame={f} seed="rm" gap={150} /></Stage> },
          { depth: 1.4, blur: 3, children: <Streaks t={t} n={8} speed={1600} opacity={0.12} seed="rs" /> },
        ]} />
    );
  }, 0.3),
  // 19. "But one old man still knows the way home": fog, a streetlamp, the old man opens his huge map
  S("oldman", P(7), P(8), (t, u, f) => {
    const open = sstep(seg(t, at(7, "old"), at(7, "knows")));
    const pose = idle({ ...POSES.front, armN: [34, 70], armF: [34, 70] }, t, 11);
    const [, hy] = handPos(960, 770, 1.65, 1, pose, "N", "front");
    return (
      <Camera t={t} hand={0.6} keys={[{ at: P(7), x: 960, y: 600, zoom: 1.05 }, { at: P(8), x: 960, y: 560, zoom: 1.22 }]}
        layers={[
          { depth: 0.4, children: <><AbsoluteFill style={{ background: "linear-gradient(#0b1226,#1b2a4e)" }} /><Stage><GodRays x={1160} y={60} t={t} opacity={0.25} color="#ffd27a" /></Stage></> },
          { depth: 1, children: <Stage><GroundShadow x={960} y={950} w={200} />
            <Character x={960} y={770} s={1.65} view="front" outfit="oldman" pose={pose} expr={t > at(7, "home") ? "smile" : "think"} look={[0, 0.2]} rim="#ffd27a" blink={blinkAt(f, 17)} />
            <MapSheet x={960} y={hy + 10} s={0.55} open={open} route={seg(t, at(7, "knows"), at(7, "home") + 0.4)} t={t} /></Stage> },
          { depth: 1.3, children: <Fog t={t} y={900} opacity={0.35} /> },
        ]} />
    );
  }, 0.25),
  // 20. "Watch the full story now": the finished route on the map, the star glowing (text in Short.tsx)
  S("end", P(8), END + 0.1, (t) => (
    <Camera t={t} hand={0.6} keys={[{ at: P(8), x: 960, y: 600, zoom: 1.0 }, { at: END, x: 1000, y: 580, zoom: 1.12 }]}
      layers={[
        { depth: 0.4, children: <><AbsoluteFill style={{ background: "radial-gradient(circle at 50% 55%,#4a3a28,#0b1226)" }} /><Stage><SunRays cx={1360} cy={352} t={t} opacity={0.12} /></Stage></> },
        { depth: 1, children: <Stage><MapSheet x={960} y={620} s={1.4} open={1} route={1} t={t} /></Stage> },
      ]} />
  )),
];
