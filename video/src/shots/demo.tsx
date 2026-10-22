// 20-second cinematic demo: wind, rain, a sprint, a top-down, a whip pan, a rack focus.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Clouds, Fog, GodRays, Leaves, LensBeads, Rain, Splashes, WetReflection, wind } from "../kit/Atmos";
import { Stage } from "../kit/Camera";
import { blinkAt, Character, headPos, Pose, POSES, seatLayout, walkPose } from "../kit/Character";
import { Camera, GroundShadow, LensStreak, MotionBlur, TileX, whip } from "../kit/Cinema";
import { Bokeh, clamp01, Dust, lerp, sstep, Streaks } from "../kit/Fx";
import { DustKicks, footfalls, idle, lookAt, RadialLines, runPose, Trail } from "../kit/Motion";
import { Chair, Cup, Fly, Table } from "../kit/Props";
import { CafeFront, Sky } from "../kit/Sets";
import { TopCafe, TopChar } from "../kit/TopDown";
import { C, H, W } from "../theme";
import { Shot } from "./types";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const L = { hip: 760, ...seatLayout(760, 1) };

const CUTS = { wind: 0, whip: 3.5, top: 6.6, rain: 9.6, sprint: 13.6, rack: 17.4, end: 20.5 };

export const DEMO: Shot[] = [
  // 1. Windy terrace: parallax dolly, awning and tree in the wind, leaves, clouds.
  {
    id: "wind", t0: CUTS.wind, t1: CUTS.whip,
    render: (t, u, f) => {
      const w = wind(t, 0.55);
      const hero = idle({ ...POSES.sitTable, head: 2 }, t, 1);
      const friend = idle({ ...POSES.sitTable, armN: [70, 50 + Math.sin(t * 5) * 12] }, t, 4);
      return (
        <AbsoluteFill>
          <Camera t={t} hand={0.8} keys={[{ at: 0, x: 900, y: 600, zoom: 1.08 }, { at: 3.5, x: 1020, y: 590, zoom: 1.16 }]}
            layers={[
              { depth: 0.35, children: <><Sky t={t} sunY={170} /><Clouds t={t} y={120} speed={40 + w * 60} /></> },
              { depth: 0.8, children: <CafeFront t={t} wind={w} /> },
              { depth: 1, children: (
                <Stage>
                  <Chair x={740} y={L.seatY} s={0.9} legs={L.chairLegs / 0.9} />
                  <Chair x={1180} y={L.seatY} s={0.9} facing={-1} legs={L.chairLegs / 0.9} />
                  <GroundShadow x={750} y={L.floorY + 4} /><GroundShadow x={1170} y={L.floorY + 4} />
                  <Character x={750} y={L.hip} s={1.0} pose={hero} expr="smile" look={[0.4, 0.2]} blink={blinkAt(f, 7)} />
                  <Character x={1170} y={L.hip} s={1.0} facing={-1} outfit="friend" pose={friend} expr="laugh" blink={blinkAt(f, 40)} />
                  <Table x={960} y={L.tableTopY} s={0.9} h={L.tableH / 0.9} />
                  <Cup x={895} y={L.tableTopY - 2} s={0.42} t={t} />
                </Stage>
              ) },
              { depth: 1, children: <Leaves t={t} n={14} strength={w} area={[0, 300, W, 600]} /> },
              { depth: 1.6, blur: 3, children: <Leaves t={t} n={6} strength={w} seed="near" scale={1.8} area={[0, 500, W, 500]} /> },
            ]} />
          <Streaks t={t} n={10} speed={900 + w * 900} opacity={0.12 * w} seed="wnd" />
        </AbsoluteFill>
      );
    },
  },
  // 2. Whip pan from the hero's close-up to the friend's.
  {
    id: "whip", t0: CUTS.whip, t1: CUTS.top,
    render: (t, u, f) => {
      const tt = t - CUTS.whip;
      const cut = 1.5;
      const wp = whip(tt, cut, 0.26, 1);
      const heroHead = headPos(960, 990, 2.7, 1, POSES.stand);
      const look = lookAt(heroHead, [2400, 500]);
      const bg = <><Sky t={t} sunY={170} /><CafeFront t={t} wind={0.4} /><Bokeh t={t} n={12} seed="wb" opacity={0.3} /></>;
      const heroShot = (
        <Camera t={tt} hand={1} keys={[{ at: 0, x: 960, y: 540, zoom: 1 }, { at: 1.5, x: 980, y: 530, zoom: 1.06 }]}
          layers={[{ depth: 0.4, blur: 12, children: bg }, { depth: 1, children: (
            <Stage><Character x={960} y={990} s={2.7} pose={idle({ lean: 4, armN: [14, 18], armF: [6, 16] }, tt, 2, 1.2)} expr={tt > 0.9 ? "smug" : "smile"} look={tt > 0.6 ? look : [0.2, 0.1]} blink={blinkAt(f, 11)} /></Stage>
          ) }]} />
      );
      const friendShot = (
        <Camera t={tt} hand={1} keys={[{ at: 1.5, x: 940, y: 540, zoom: 1.06 }, { at: 3.1, x: 960, y: 540, zoom: 1 }]}
          layers={[{ depth: 0.4, blur: 12, children: bg }, { depth: 1, children: (
            <Stage><Character x={980} y={990} s={2.7} facing={-1} outfit="friend" pose={idle({ lean: 2, armN: [30, 50 + Math.sin(tt * 6) * 8], armF: [10, 16] }, tt, 5, 1.2)} expr="laugh" look={[0.5, 0.1]} blink={blinkAt(f, 30)} /></Stage>
          ) }]} />
      );
      return (
        <AbsoluteFill>
          <MotionBlur amount={wp.blur}>
            {(wp.active || !wp.after) && <AbsoluteFill style={{ transform: `translateX(${-wp.slide}px)` }}>{heroShot}</AbsoluteFill>}
            {(wp.active || wp.after) && <AbsoluteFill style={{ transform: `translateX(${W - wp.slide}px)` }}>{friendShot}</AbsoluteFill>}
          </MotionBlur>
        </AbsoluteFill>
      );
    },
  },
  // 3. Top-down of the terrace, slow orbit + push, the fly circling the cup.
  {
    id: "top", t0: CUTS.top, t1: CUTS.rain,
    render: (t, u) => {
      const tt = t - CUTS.top;
      const rot = -6 + tt * 2.5;
      return (
        <AbsoluteFill>
          <Camera t={tt} hand={0.6} roll={rot} keys={[{ at: 0, x: 960, y: 600, zoom: 1.18 }, { at: 3, x: 960, y: 590, zoom: 1.4 }]}
            layers={[
              { depth: 1, children: (
                <TopCafe t={t}>
                  <TopChar x={760} y={600} s={1} outfit="hero" heading={90} t={t} light={[-0.6, -1]} />
                  <TopChar x={1160} y={600} s={1} outfit="friend" heading={-90} t={t} light={[-0.6, -1]} />
                  <TopChar x={300 + tt * 70} y={860} s={0.95} outfit="extra" heading={90} walk={tt * 9} t={t} light={[-0.6, -1]} />
                  <Fly x={930 + Math.cos(tt * 4) * 70} y={575 + Math.sin(tt * 4) * 40} s={0.8} t={t} rot={(tt * 4 * 180) / Math.PI + 90} />
                </TopCafe>
              ) },
              { depth: 1.5, blur: 4, children: <Leaves t={t} n={5} strength={0.5} seed="tl" scale={1.6} /> },
            ]} />
        </AbsoluteFill>
      );
    },
  },
  // 4. Night rain: two rain depths, splashes, wet reflections, fog, lens beads; the hero walks past.
  {
    id: "rain", t0: CUTS.rain, t1: CUTS.sprint, cool: 0.45,
    render: (t, u, f) => {
      const tt = t - CUTS.rain;
      const x = 300 + tt * 150;
      return (
        <AbsoluteFill>
          <Camera t={tt} hand={1.2} keys={[{ at: 0, x: 900, y: 620, zoom: 1.2 }, { at: 4, x: 1000, y: 600, zoom: 1.12 }]}
            layers={[
              { depth: 0.5, blur: 2, children: <><AbsoluteFill style={{ background: "#141126" }} /><CafeFront t={t} wind={0.3} /><Rain t={t} n={110} near={false} seed="rf" opacity={0.45} /></> },
              { depth: 0.9, children: <Fog t={t} y={840} opacity={0.22} color="#8f86b8" /> },
              { depth: 1, children: (
                <>
                  <AbsoluteFill>
                    {[520, 820, 1120, 1420].map((lx) => <WetReflection key={lx} x={lx} y={830} t={t} color="#ffd59a" opacity={0.28} />)}
                  </AbsoluteFill>
                  <Stage>
                    <GroundShadow x={x} y={L.floorY + 236} w={180} opacity={0.3} />
                    <Character x={x} y={990} s={0.95} pose={walkPose(tt * 7)} expr="neutral" look={[0.8, 0]} blink={blinkAt(f, 3)} rim={C.rimCold} rimDir={[1, -0.4]} />
                    {/* puddle reflection */}
                    <g transform={`translate(0,${2 * (990 + 116 * 0.95) + 8}) scale(1,-1)`} opacity={0.22} style={{ filter: "blur(2px)" }}>
                      <Character x={x} y={990} s={0.95} pose={walkPose(tt * 7)} expr="neutral" rim={C.rimCold} />
                    </g>
                  </Stage>
                  <Splashes t={t} y={L.floorY + 236} n={30} />
                </>
              ) },
              { depth: 1.4, children: <Rain t={t} n={90} near seed="rn2" opacity={0.65} /> },
            ]} />
          {[520, 820, 1120, 1420].map((lx) => <LensStreak key={lx} x={lx * 0.9 + 100} y={520} color="#ffd59a" opacity={0.18} />)}
          <LensBeads t={t} n={12} />
        </AbsoluteFill>
      );
    },
  },
  // 5. Sprint: run cycle, ghost trails, dust kicks, speed lines, camera chasing with lag and a punch-in.
  {
    id: "sprint", t0: CUTS.sprint, t1: CUTS.rack,
    render: (t, u, f) => {
      const tt = t - CUTS.sprint;
      const speed = 900;
      const x = 200 + tt * speed;
      const camX = x - 120 + Math.sin(tt * 2) * 30; // lag behind
      const burst = seg(tt, 2.2, 2.5);
      const kicks = footfalls(0, 3.8, 0.34).map((at) => ({ at, x: 200 + at * speed - 20, y: L.floorY + 236 }));
      const draw = (ttt: number) => (
        <Character x={200 + ttt * speed} y={990} s={0.95} pose={runPose(ttt * 18.5)} expr="determined" look={[0.9, 0]} blink={false} />
      );
      return (
        <AbsoluteFill>
          <Camera t={tt} hand={1.5} seed={3} keys={[{ at: 0, x: camX, y: 760, zoom: 1.05 + burst * 0.22 }]}
            layers={[
              { depth: 0.3, children: <><Sky t={t} sunY={200} /><Clouds t={t} y={120} speed={60} /></> },
              { depth: 0.75, blur: 1, overscan: 1, children: <TileX from={-1} to={3}><CafeFront t={t} wind={0.7} /></TileX> },
              { depth: 1, children: (
                <Stage>
                  <GroundShadow x={x} y={L.floorY + 236} w={200} opacity={0.3} />
                  <Trail t={tt} n={5} dt={0.04} draw={draw} opacity={0.3} />
                  <DustKicks t={tt} kicks={kicks} size={1.2} />
                </Stage>
              ) },
              { depth: 1.6, blur: 5, children: <Leaves t={t} n={6} strength={1} seed="sl" scale={2} /> },
            ]} />
          <Streaks t={t} n={30} speed={-3000} opacity={0.25 + burst * 0.3} seed="sp" />
          <RadialLines cx={1300} cy={540} t={t} opacity={burst * 0.5} inner={420} />
        </AbsoluteFill>
      );
    },
  },
  // 6. Rack focus: from blurred foreground leaves to the hero's face in the wind, god rays, slow push.
  {
    id: "rack", t0: CUTS.rack, t1: CUTS.end,
    render: (t, u, f) => {
      const tt = t - CUTS.rack;
      const focus = lerp(1.6, 1, sstep(seg(tt, 0.4, 1.6)));
      const w = wind(t, 0.7);
      const base: Pose = { lean: 2, armN: [14, 18], armF: [6, 16], head: -2 };
      return (
        <AbsoluteFill>
          <Camera t={tt} hand={0.7} focus={focus} dof={14} keys={[{ at: 0, x: 960, y: 560, zoom: 1 }, { at: 3.1, x: 960, y: 530, zoom: 1.12 }]}
            layers={[
              { depth: 0.4, children: <><Sky t={t} sunY={420} /><Clouds t={t} y={200} speed={50} /><CafeFront t={t} wind={w} y={400} /></> },
              { depth: 1, children: (
                <Stage>
                  <Character x={960} y={990} s={2.7} pose={idle(base, tt, 7, 1.3)} expr={tt > 2 ? "happy" : "smile"} look={[0.3, -0.2]} blink={blinkAt(f, 11)} rimDir={[-1, -0.6]} />
                  {/* hood strings catching the wind */}
                  <path d={`M948,720 q${-30 * w},${40 + Math.sin(t * 9) * 10 * w} ${-60 * w},${80}`} stroke={C.cream} strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.9} />
                </Stage>
              ) },
              { depth: 1.6, children: <Leaves t={t} n={8} strength={w} seed="rk" scale={2.2} colors={["#d9a03a", "#c8742f"]} /> },
            ]} />
          <GodRays x={1700} y={-100} t={t} angle={120} spread={26} opacity={0.14} />
          <Dust t={t} n={30} seed="rkd" />
          <Leaves t={t} n={10} strength={w} seed="rk2" area={[0, 0, W, 700]} />
        </AbsoluteFill>
      );
    },
  },
];
export const DEMO_END = CUTS.end;
