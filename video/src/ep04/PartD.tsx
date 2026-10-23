// Episode 04, part D (beats 51–69): home, the perfect morning, the car park where the café was, the friend who doesn't know you,
// the butterfly effect and Lorenz, fixing it and making it worse (the tower, the strangers, the photo wall), the cracked sky,
// Novikov vs many timelines, the glitches, Jamie's déjà vu.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Look3, LOOKS, Person3D, run3, SIT, STAND, walk3 } from "../cam3d/Person3D";
import { Bowl, eatPose, faceTo, HeldSpoon, kerbSit, sitOn, talkHands, wavePose } from "../cam3d/Props3D";
import { World3D } from "../cam3d/World3D";
import { at, ex, hand, io, L3, orbit, P, PE, PS, rnd, RUN_Y, seg, Shot, shakeC } from "./core";
import { LorenzGraph, TimelinesGraph } from "./Dom";
import { Env } from "./Sets";
import { Pigeon, RiverRoad } from "./Sets2";
import { CarPark, Kitchen, PhotoWall } from "./Sets3";
import { C, Chip, Flash, Rise, Slam } from "./Text";
import { BodyArcs, ClockFace, SkyCracks, Streaks, Tunnel, V3 } from "./Vfx";

const HOOD = LOOKS.hoodie;
const JAMIE_HOME: Look3 = { ...LOOKS.jamie, hoodUp: false, earphones: false };
const FRIEND = LOOKS.ex8;
const MEMORY = "sepia(0.45) saturate(0.55) brightness(0.92)";
// Jamie at the kitchen table: on the chair at (0, 1.08) facing the table, his bowl in front of him; you stand by the fridge facing him
const JSEAT: [number, number, number] = [0, 0, 1.08];
export const JamieEating: React.FC<{ t: number; eating?: boolean; face?: object; nod?: number }> = ({ t, eating = true, face = {}, nod }) => (
  <><Bowl p={[0, 0.8, 0.6]} full={0.7} /><Person3D pos={JSEAT} yaw={Math.PI} look={JAMIE_HOME} pose={eating ? eatPose(t, sitOn(0.46)) : sitOn(0.46, { armR: [42, 8, 70], handR: "pinch", armL: [30, 10, 70], headNod: nod ?? 2 })} face={{ smile: 0.4, ...face }} propR={<HeldSpoon />} /></>
);
const YOU_K: [number, number] = [1.6, -1.2], YOU_K_YAW = faceTo(YOU_K, [JSEAT[0], JSEAT[2]]);

const DayStreet: React.FC<{ cafe?: boolean; mood?: "day" | "golden" | "dusk" }> = ({ cafe = true, mood = "day" }) => (
  <>
    <Env mood={mood} />
    <World3D bare lamps={false} nearTrees={false} glow={0.25} cafe={cafe} />
    {!cafe && <CarPark />}
  </>
);

/** A butterfly with two wing pairs; flap in radians. */
const Butterfly: React.FC<{ p: V3; flap: number; s?: number }> = ({ p, flap, s = 1 }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 256; c.height = 256; const g = c.getContext("2d")!;
    const gr = g.createRadialGradient(40, 128, 10, 40, 128, 220); gr.addColorStop(0, "#F2B84B"); gr.addColorStop(0.55, "#D9472B"); gr.addColorStop(1, "#1B2A4E");
    g.fillStyle = gr; g.beginPath(); g.moveTo(0, 128); g.bezierCurveTo(60, -20, 250, 0, 230, 110); g.bezierCurveTo(220, 150, 120, 150, 0, 128); g.fill();
    g.beginPath(); g.moveTo(0, 128); g.bezierCurveTo(80, 160, 200, 250, 150, 240); g.bezierCurveTo(100, 240, 40, 200, 0, 128); g.fill();
    g.fillStyle = "#F6F1E6"; [[150, 70], [180, 95], [120, 200]].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 9, 0, 7); g.fill(); });
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  const w = 0.2 + 0.9 * Math.abs(Math.sin(flap));
  return (
    <group position={p} scale={s}>
      <mesh rotation={[0, 0, Math.PI / 2]}><capsuleGeometry args={[0.03, 0.24, 4, 8]} /><meshToonMaterial color="#0E070D" /></mesh>
      {[-1, 1].map((k) => (
        <group key={k} rotation={[0, k * w, 0]}>
          <mesh position={[0, 0, k * 0.28]} rotation={[-Math.PI / 2, 0, k > 0 ? -Math.PI / 2 : Math.PI / 2]}><planeGeometry args={[0.56, 0.56]} /><meshBasicMaterial map={tex} transparent side={THREE.DoubleSide} toneMapped={false} /></mesh>
        </group>
      ))}
    </group>
  );
};

/** Cracked windscreen over the sky (DOM SVG), grow 0..1. */
const Windscreen: React.FC<{ grow: number }> = ({ grow }) => {
  if (grow <= 0) return null;
  const cx = 1180, cy = 260;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: 22 }, (_, i) => {
        const a = (i / 22) * Math.PI * 2 + rnd(i) * 0.2, L = (300 + rnd(i + 3) * 700) * grow;
        let x = cx, y = cy; const pts = [`${x},${y}`];
        for (let k = 1; k <= 6; k++) { x = cx + Math.cos(a + (rnd(i * 7 + k) - 0.5) * 0.3) * L * (k / 6); y = cy + Math.sin(a + (rnd(i * 9 + k) - 0.5) * 0.3) * L * (k / 6) * 0.7; pts.push(`${x},${y}`); }
        return <polyline key={i} points={pts.join(" ")} fill="none" stroke="#EAF6FF" strokeWidth={2.5} opacity={0.85} />;
      })}
      {[60, 140, 240].map((r, i) => <circle key={r} cx={cx} cy={cy} r={r * grow} fill="none" stroke="#EAF6FF" strokeWidth={1.5} opacity={0.5 - i * 0.1} strokeDasharray="40 30 12 30" />)}
    </svg>
  );
};

const STRANGERS = Array.from({ length: 9 }, (_, i) => ({ x: -7 + i * 1.7 + rnd(i) * 0.5, z: -2.2 + rnd(i + 3) * 3.2, look: ["ex1", "ex2", "ex3", "ex4", "ex5", "ex6", "ex7", "ex8", "teacher"][i] }));

export const D_SHOTS: Shot[] = [
  // 51 · run home, forward this time
  { id: "forward", t0: P(51), t1: P(52), scene: (t) => <><Tunnel center={[30, 1.2, 0.4]} t={t} speed={5} /><Person3D pos={[2.6, 0, 0.4]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.8)} face={{ smile: 0.6 }} /><BodyArcs c={[2.6, 1.15, 0.4]} t={t} n={4} amt={0.8} /><ambientLight intensity={0.5} /></>,
    cam: (t) => shakeC({ pos: [-1.6, 1.25, 0.45], target: [8, 1.2, 0.4], fov: 62 }, t, 0.02), grade: "sepia(0.25) saturate(1.3)" },
  // 52–53 · one perfect morning; Jamie eating your cereal
  { id: "morning", t0: P(52), t1: at(52, "Jamie"), scene: (t) => <><Kitchen sky="#FFE0A8" /><JamieEating t={t} /><directionalLight position={[2, 4, -4]} intensity={1.5} color="#FFD9A0" /></>,
    cam: (t) => { const u = io(seg(t, P(52), at(52, "Jamie"))); return { pos: L3([2.8, 2.0, 3.0], [2.0, 1.7, 2.4], u), target: [0, 1.0, 0.5], fov: 42 }; } },
  { id: "cereal", t0: at(52, "Jamie"), t1: P(53), scene: (t) => <><Kitchen sky="#FFE0A8" /><JamieEating t={t} /></>,
    cam: () => ({ pos: [0.3, 1.45, -1.3], target: [0, 1.25, 0.8], fov: 34 }) },
  { id: "staring", t0: P(53), t1: P(54), scene: (t) => <><Kitchen sky="#FFE0A8" /><JamieEating t={t} eating={false} face={{ smile: 0.3, brow: 0.5, open: Math.max(0, Math.sin(t * 14)) * 0.4 }} /><Person3D pos={[YOU_K[0], 0, YOU_K[1]]} yaw={YOU_K_YAW} look={HOOD} pose={STAND} face={{ smile: 0.7, brow: 0.6 }} /></>,
    cam: (t) => ({ pos: L3([-0.6, 1.4, -1.0], [-0.4, 1.4, -0.6], io(seg(t, P(53), P(54)))), target: [0.05, 1.2, 0.8], fov: 32 }) },
  // 54–55 · step outside: the café is a car park
  { id: "outside", t0: P(54), t1: P(55), scene: (t) => <><DayStreet cafe={false} /><Person3D pos={[-6 + seg(t, P(54), P(55)) * 1.5, 0, 1.25]} yaw={RUN_Y} look={HOOD} pose={walk3(t)} face={{ smile: 0.6 }} /></>,
    cam: (t) => ({ pos: [-3.2, 1.5, 4.0], target: [-5.6, 1.3, 1.2], fov: 40 }), grade: "brightness(1.08)" },
  { id: "car-park", t0: P(55), t1: P(56), scene: (t) => <><DayStreet cafe={false} /><Person3D pos={[-3.2, 0, 1.25]} yaw={Math.PI * 0.95} look={HOOD} pose={{ ...STAND }} face={{ open: 0.4, eyesBig: 1 }} /></>,
    cam: (t) => { const u = io(seg(t, P(55), P(56))); return { pos: L3([-2.2, 1.7, 4.2], [-2.7, 2.4, 6.0], u), target: L3([-3.2, 1.4, 1.25], [-2.6, 1.0, -6], u), fov: 42 }; } },
  // 56 · your best friend walks straight past
  { id: "friend", t0: P(56), t1: at(56, "You"), scene: (t) => { const u = t - P(56); return <><DayStreet cafe={false} /><Person3D pos={[-3.6, 0, 1.25]} yaw={RUN_Y} look={HOOD} pose={wavePose(t)} face={{ smile: 0.8 }} /><Person3D pos={[0.4 - u * 1.2, 0, 0.9]} yaw={-RUN_Y} look={FRIEND} pose={walk3(u)} face={{ smile: 0 }} /></>; },
    cam: (t) => ({ pos: [-2.4, 1.5, 3.4], target: [-2.6, 1.3, 0.3], fov: 40 }) },
  { id: "met-him", t0: at(56, "You"), t1: P(57), grade: MEMORY, scene: (t) => <><Env mood="night" /><World3D bare night nearTrees={false} lamps cafe={false} /><Person3D pos={[-0.6, 0, 1.58]} yaw={0} look={HOOD} pose={kerbSit({ headNod: 30, armL: [70, 10, 80], armR: [70, 10, 80] })} face={{ brow: 0.9 }} /><Person3D pos={[0.15, 0, 1.58]} yaw={-0.35} look={FRIEND} pose={kerbSit({ headNod: 12, armR: [40, 40, 30], handR: "open", armL: [60, 8, 70] })} face={{ smile: 0.2, brow: 0.6 }} /><pointLight position={[0, 3, 1]} color="#FFC777" intensity={5} distance={8} /></>,
    cam: (t) => ({ pos: L3([0.9, 1.05, 4.3], [0.6, 0.98, 3.7], io(seg(t, at(56, "You"), P(57)))), target: [-0.2, 0.62, 1.6], fov: 38 }) },
  // 57 · the butterfly effect
  { id: "butterfly", t0: P(57), t1: P(58), scene: (t) => <><color attach="background" args={["#0B1226"]} /><Butterfly p={[0, 0, 0]} flap={t * 7} s={1.6} /><ambientLight intensity={1} /></>,
    cam: (t) => ({ pos: orbit([0, 0, 0], 30 + 60 * seg(t, P(57), P(58)), 2.6, 0.9), target: [0, 0, 0], fov: 36 }) },
  // 58–59 · Lorenz, 1961
  { id: "lorenz", t0: P(58), t1: P(60), no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }),
    dom: (t) => <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #1B2A4E, #0B1226 75%)" }}><LorenzGraph draw={seg(t, at(58, "reran"), PE(59))} numbers={seg(t, at(58, "typed"), at(58, "six") + 0.4)} /></div> },
  // 60 · tiny change, totally different world; you changed a whole life
  { id: "ripple", t0: P(60), t1: at(60, "And"), scene: (t) => { const step = Math.floor(t / 0.14); return <><World3D night rewrite={(i) => { const on = rnd(i * 7 + step) > 0.7; return { k: on ? 0.4 + 1.4 * rnd(i + step * 3) : 1, flash: on ? 1 : 0 }; }} /><Butterfly p={[8, 12, 10]} flap={t * 7} s={3} /></>; },
    cam: (t) => { const u = io(seg(t, P(60), at(60, "And"))); return { pos: L3([10, 12, 14], [18, 18, 24], u), target: [0, 4, -6], fov: 44 }; } },
  { id: "whole-life", t0: at(60, "And"), t1: P(61), scene: (t) => <><Kitchen sky="#FFE0A8" /><Person3D pos={[YOU_K[0], 0, YOU_K[1]]} yaw={YOU_K_YAW} look={HOOD} pose={STAND} face={{ smile: 0, brow: 0.8 }} /></>,
    cam: (t) => ({ pos: L3([0.4, 1.6, 0.4], [0.7, 1.6, 0.0], io(seg(t, at(60, "And"), P(61)))), target: [1.6, 1.5, -1.2], fov: 30 }) },
  // 61–62 · so you try to fix it: back a week, meet him again... the tower was never built
  { id: "fix", t0: P(61), t1: P(62), scene: (t) => { const x = -6 + (t - P(61)) * 6; return <><DayStreet cafe={false} /><Person3D pos={[x, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.6)} face={{ brow: -0.7 }} /><BodyArcs c={[x, 1.15, 1.2]} t={t} n={5} amt={1} /><Streaks center={[x, 1.1, 1.2]} t={t} amt={0.7} /></>; },
    cam: (t) => { const x = -6 + (t - P(61)) * 6; return hand({ pos: [x + 0.5, 1.0, 4.8], target: [x + 1, 1.0, 1.2], fov: 38 }, t, 0.02); } },
  { id: "meet-again", t0: P(62), t1: at(62, "But"), scene: (t) => { const h = seg(t, at(62, "You", 2), at(62, "You", 2) + 0.3); return <><DayStreet cafe /><Person3D pos={[-1.1, 0, 0.5]} yaw={RUN_Y} look={HOOD} pose={{ ...STAND, armR: [62 + 14 * Math.sin(h * Math.PI), 10, 22], handR: "fist", wristR: [0, 0] }} face={{ smile: 0.9 }} /><Person3D pos={[0.1, 0, 0.5]} yaw={-RUN_Y} look={FRIEND} pose={{ ...STAND, armR: [62 + 14 * Math.sin(h * Math.PI), 10, 22], handR: "fist", wristR: [0, 0] }} face={{ smile: 0.8 }} /></>; },
    cam: () => ({ pos: [-0.5, 1.5, 3.4], target: [-0.5, 1.3, 0.5], fov: 38 }) },
  { id: "no-tower", t0: at(62, "But"), t1: P(63), scene: (t) => <><Env mood="dusk" /><RiverRoad t={t} tower={1 - ex(seg(t, at(62, "never"), at(62, "built") + 0.3))} /><Person3D pos={[3, 0, 4.6]} yaw={0} look={HOOD} pose={STAND} /></>,
    cam: (t) => ({ pos: L3([4.2, 1.3, 2.6], [3.6, 1.2, 1.9], io(seg(t, at(62, "But"), P(63)))), target: [24, 30, 125], fov: 40 }) },
  // 63 · back again... half the faces are strangers; the photo wall
  { id: "again", t0: P(63), t1: at(63, "When"), scene: (t) => <><Tunnel center={[30, 1.2, 0.4]} t={t} speed={5} /><Person3D pos={[2.6, 0, 0.4]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.8)} /><BodyArcs c={[2.6, 1.15, 0.4]} t={t} n={5} amt={1} /><ambientLight intensity={0.5} /></>,
    cam: (t) => shakeC({ pos: [-1.6, 1.25, 0.45], target: [8, 1.2, 0.4], fov: 64 }, t, 0.03) },
  { id: "strangers", t0: at(63, "When"), t1: at(63, "Your"), scene: (t) => <><DayStreet cafe mood="golden" />{STRANGERS.map((s, i) => <Person3D key={i} pos={[s.x, 0, s.z]} yaw={Math.atan2(-1 - s.x, 1.4 - s.z)} look={(LOOKS as any)[s.look]} pose={STAND} face={{ smile: 0, brow: 0.2 }} />)}<Person3D pos={[-1, 0, 1.4]} yaw={Math.PI} look={HOOD} pose={{ ...STAND, headTurn: 30 * Math.sin((t - at(63, "When")) * 2) }} face={{ open: 0.3, eyesBig: 0.7 }} /></>,
    cam: (t) => ({ pos: orbit([-1, 1.4, 1.4], 140 + 50 * seg(t, at(63, "When"), at(63, "Your")), 3.6, 1.7), target: [-1, 1.3, 0.6], fov: 44 }) },
  { id: "photo-wall", t0: at(63, "Your"), t1: P(64), scene: (t) => <PhotoWall holiday={t > at(63, "holiday")} glitch={seg(t, at(63, "holiday") - 0.2, at(63, "holiday") + 0.4) * (1 - seg(t, at(63, "holiday") + 0.4, at(63, "holiday") + 0.8))} />,
    cam: (t) => { const u = io(seg(t, at(63, "Your"), P(64))); return { pos: L3([0.2, 1.7, 3.2], [-0.4, 2.0, 1.4], u), target: L3([0, 1.6, 0], [-0.5, 2.1, 0], u), fov: 40 }; } },
  // 64 · every fix, two new problems; another scar; a cracked windscreen
  { id: "windscreen", t0: P(64), t1: P(65), scene: (t) => <><DayStreet cafe mood="day" /><SkyCracks t={t - at(64, "Every", 2)} n={40} stagger={0.03} center={[0, 45, -80]} spread={180} /><Person3D pos={[0, 0, 0.6]} yaw={Math.PI} look={HOOD} pose={{ ...STAND, headNod: -20 }} face={{ open: 0.3, eyesBig: 1 }} /></>,
    cam: (t) => { const u = io(seg(t, P(64), P(65))); return { pos: L3([0.6, 0.6, 3.6], [1.0, 0.4, 4.6], u), target: L3([0, 3, -10], [0, 14, -40], u), fov: 54 }; } },
  // 65 · which present do you come back to?
  { id: "which", t0: P(65), t1: P(66), scene: (t) => <><Env mood="dusk" /><RiverRoad t={t} tower={0} /><SkyCracks t={4} n={30} center={[0, 50, 100]} spread={200} /><Person3D pos={[0, 0, 1.2]} yaw={0.4} look={HOOD} pose={STAND} face={{ brow: 0.8 }} /></>,
    cam: (t) => ({ pos: orbit([0, 1.3, 1.2], 160 + 50 * seg(t, P(65), P(66)), 3.0, 1.5), target: [0, 1.3, 1.2], fov: 40 }) },
  // 66 · Novikov vs many timelines
  { id: "timelines", t0: P(66), t1: at(66, "Nobody"), no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }),
    dom: (t) => <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #1B2A4E, #0B1226 75%)" }}><TimelinesGraph a={seg(t, at(66, "Novikov"), at(66, "happen"))} b={seg(t, at(66, "Another"), at(66, "timeline") + 0.5)} /></div> },
  { id: "hard-way", t0: at(66, "Nobody"), t1: P(67), scene: (t) => <><Env mood="dusk" /><RiverRoad t={t} tower={0} /><Person3D pos={[0, 0, 1.2]} yaw={-0.6} look={HOOD} pose={STAND} face={{ brow: 0.9 }} /></>,
    cam: () => ({ pos: [-1.1, 1.6, 2.5], target: [0, 1.5, 1.2], fov: 32 }) },
  // 67 · the glitches: cracks spread, clocks skip, a bird freezes, people stop mid-sentence
  { id: "cracks-spread", t0: P(67), t1: at(67, "Clocks"), scene: (t) => <><DayStreet cafe mood="day" /><SkyCracks t={t - P(67) + 1} n={70} stagger={0.02} center={[0, 45, -80]} spread={220} /></>,
    cam: () => ({ pos: [2, 1.5, 7], target: [0, 12, -30], fov: 56 }) },
  { id: "skip", t0: at(67, "Clocks"), t1: at(67, "A"), scene: (t) => <><Env mood="day" /><ClockFace pos={[0, 0.3, -5]} r={2.4} t={Math.floor(t * 3) % 2 ? t : t - 2.7 * (Math.floor(t * 3) % 3)} rate={1} /></>,
    cam: (t) => shakeC({ pos: [0, 0.3, 2], target: [0, 0.3, -5], fov: 40 }, t, Math.floor(t * 6) % 3 === 0 ? 0.04 : 0) },
  { id: "bird", t0: at(67, "A"), t1: at(67, "People"), scene: (t) => { const f = t > at(67, "freezes") && t < at(67, "then") + 0.1; const tt = f ? at(67, "freezes") : t; const u = tt - at(67, "A"); return <><DayStreet cafe mood="day" /><Pigeon p={[-1 + u * 1.8, 2.4 + u * 0.4, 0]} flap={f ? 1.2 : tt * 26} yaw={RUN_Y} s={1.4} /></>; },
    cam: () => ({ pos: [0.6, 1.9, 4.0], target: [0.4, 2.6, 0], fov: 40 }), grade: undefined },
  { id: "mid-sentence", t0: at(67, "People"), t1: P(68), scene: (t) => { const f = t > at(67, "stop"); return <><DayStreet cafe mood="day" /><Person3D pos={[-3.4, 0, 0.4]} yaw={RUN_Y} look={LOOKS.ex5} pose={f ? { ...STAND, armR: [55, 20, 70], handR: "open" } : talkHands(t, STAND)} face={{ smile: 0.6, open: f ? 0.4 : Math.max(0, Math.sin(t * 14)) * 0.5 }} /><Person3D pos={[-2.4, 0, 0.4]} yaw={-RUN_Y} look={LOOKS.ex3} pose={STAND} face={{ smile: 0.5, open: f ? 0.2 : 0 }} /></>; },
    cam: () => ({ pos: [-2.9, 1.5, 2.6], target: [-2.9, 1.35, 0.4], fov: 36 }) },
  // 68–69 · Jamie: why does today feel like it already happened? ...nobody should remember
  { id: "deja-vu", t0: P(68), t1: P(69), scene: (t) => { const ghost = Math.floor(t * 12) % 5 === 0; return <><Kitchen sky="#FFE0A8" /><JamieEating t={t} eating={false} nod={-4} face={{ smile: 0, brow: 0.7, open: Math.max(0, Math.sin(t * 13)) * 0.4 }} />{ghost && <Person3D pos={[0.08, 0, 1.06]} yaw={Math.PI + 0.1} look={JAMIE_HOME} pose={sitOn(0.46, { headNod: 10 })} face={{ smile: 0 }} />}</>; },
    cam: () => ({ pos: [-0.3, 1.4, -1.0], target: [0, 1.3, 0.8], fov: 32 }), grade: "saturate(0.85)" },
  { id: "nobody", t0: P(69), t1: P(70), scene: (t) => <><Kitchen sky="#9A8AB8" /><Person3D pos={[YOU_K[0], 0, YOU_K[1]]} yaw={YOU_K_YAW} look={HOOD} pose={STAND} face={{ smile: 0, open: 0.2, eyesBig: 0.8 }} /></>,
    cam: (t) => ({ pos: L3([0.6, 1.6, 0.2], [0.9, 1.6, -0.3], io(seg(t, P(69), P(70)))), target: [1.6, 1.55, -1.2], fov: 30 }), grade: "saturate(0.7) brightness(0.9)" },
];

export const DType: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} at={at(52, "perfect")} out={at(52, "Jamie")} text="NOW" y={110} bg={C.amber} />
    <Slam t={t} at={at(55, "car")} out={P(56) - 0.05} text="CAR PARK." size={150} y={160} color={C.red} />
    <Slam t={t} at={at(57, "butterfly")} out={P(58) - 0.05} text="THE BUTTERFLY EFFECT" size={110} y={140} color={C.amber} glow={C.amber} />
    <Chip t={t} at={at(58, "1961")} out={P(60) - 0.1} text="1961 · EDWARD LORENZ" y={110} bg={C.cool} />
    <Rise t={t} at={at(59, "completely")} out={P(60) - 0.1} text="Completely different weather." size={64} y={880} color={C.amber} />
    <Slam t={t} at={at(60, "chaos")} out={at(60, "And") - 0.05} text="CHAOS THEORY" size={150} y={160} color={C.cream} />
    <Chip t={t} at={at(62, "week")} out={at(62, "But") - 0.1} text="−1 WEEK" y={110} bg={C.amber} />
    <Slam t={t} at={at(62, "never")} out={P(63) - 0.05} text="NEVER BUILT." size={140} y={160} color={C.red} />
    <Rise t={t} at={at(64, "Every")} out={at(64, "Every", 2) - 0.1} text="Every fix makes two new problems." size={64} y={150} />
    <Rise t={t} at={at(65, "which")} out={P(66) - 0.1} text="Which present do you come back to?" size={68} y={150} w={1300} />
    <Chip t={t} at={at(66, "Novikov")} out={at(66, "Nobody") - 0.1} text="IGOR NOVIKOV" y={110} bg={C.cool} />
    <Rise t={t} at={at(66, "Nobody")} out={P(67) - 0.1} text="Nobody knows which is true." size={64} y={880} />
    <Flash t={t} at={P(51)} max={0.8} len={0.3} />
    <Flash t={t} at={P(61) + 0.4} max={0.7} len={0.3} />
    <Flash t={t} at={at(62, "But")} max={0.8} len={0.3} />
    <Flash t={t} at={at(63, "When")} max={0.8} len={0.3} />
    {t > at(64, "cracked") - 0.1 && t < P(65) && <Windscreen grow={ex(seg(t, at(64, "cracked") - 0.1, at(64, "windscreen") + 0.3))} />}
  </>
);
