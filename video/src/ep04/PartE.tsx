// Episode 04, part E (beats 70–87): the deal, the last run, morning, Jamie, the message from your own number,
// every clock stops and the sky cracks, the frozen city, the Part 2 teaser, the question, IN THEORY.
import React from "react";
import { Look3, LOOKS, Person3D, run3, SIT, STAND, walk3 } from "../cam3d/Person3D";
import { World3D } from "../cam3d/World3D";
import { at, atE, ex, FILM_END, hand, io, L3, orbit, P, PE, PS, rnd, RUN_Y, seg, Shot, shakeC } from "./core";
import { Phone2D, TextScreen } from "./Dom";
import { Bedroom, Env, makeCrowd, Crowd } from "./Sets";
import { Kitchen, Pigeon, RiverRoad } from "./Sets2";
import { BODY, C, Chip, expo, Flash, HEAD, Rise, Slam } from "./Text";
import { BodyArcs, Bolt, ClockFace, SkyCracks, Streaks, Tunnel, V3 } from "./Vfx";

const HOOD = LOOKS.hoodie;
const JAMIE_HOME: Look3 = { ...LOOKS.jamie, hoodUp: false, earphones: false };
const COLD = "saturate(0.3) contrast(1.25) brightness(0.85)";
const tStop = PE(83) + 0.3, tCrack = PE(83) + 1.4, tCrane = PE(83) + 2.9, tBlack = P(84) - 0.4;

const DayStreet: React.FC<{ mood?: "day" | "golden" | "dawn" }> = ({ mood = "golden" }) => (
  <><Env mood={mood} /><World3D bare lamps={false} nearTrees={false} glow={0.25} /></>
);
const FROZEN_CROWD = makeCrowd(91, 10, -8, 10, -2.6, 1.2);
const FrozenStreet: React.FC<{ t: number }> = ({ t }) => {
  const f = Math.min(t, tStop);
  return (
    <>
      <DayStreet mood="dawn" />
      <Crowd list={FROZEN_CROWD} walk={(i) => ({ dx: (f - PS(83)) * (0.8 + rnd(i) * 0.4), pose: walk3(f * 0.9 + rnd(i)) })} />
      {[0, 1, 2, 3].map((k) => <Pigeon key={k} p={[-3 + k * 2.2 + (f - PS(83)) * 1.5, 3 + k * 0.4, -1 + k * 0.6]} flap={t < tStop ? t * 26 + k : 1.1 + k * 0.4} yaw={RUN_Y} s={1.2} />)}
      {t > tCrack && <SkyCracks t={t - tCrack} n={1} center={[-60, 50, -90]} />}
      {t > tCrack && <Bolt a={[-70, 52, -100]} b={[80, 46, -100]} t={0} seed={808} width={12} grow={ex(seg(t, tCrack, tCrack + 1.2))} branches={8} />}
    </>
  );
};

// a teaser flash: one image for a fraction of a second
type Flashy = { at: number; len: number; scene: (t: number) => React.ReactNode; cam: (t: number) => { pos: V3; target: V3; fov: number } };
const T0 = tBlack + 0.45;
const FLASHES: Flashy[] = [
  { at: T0, len: 0.55, scene: () => <><Env mood="night" /><RiverRoad t={0} /><Person3D pos={[0, 0, 1.2]} yaw={0.3} look={LOOKS.older} pose={{ ...STAND, armR: [10, 10, 20] }} /><pointLight position={[0.8, 2.2, -0.6]} color="#BFE6FF" intensity={8} distance={6} /><Bolt a={[-20, 40, 80]} b={[5, 0, 30]} t={0} seed={901} width={8} /></>, cam: () => ({ pos: [-1.2, 1.3, -2.6], target: [0, 1.3, 1.2], fov: 38 }) },
  { at: T0 + 0.75, len: 0.5, scene: (t) => <><Env mood="night" /><RiverRoad t={t} />{[0, 1].map((k) => <group key={k}><Person3D pos={[t * 4 + k * 0.4, 0, 0.4 + k * 1.6]} yaw={RUN_Y} look={k ? LOOKS.older : HOOD} pose={run3(t * 2 + k * 0.5)} /><BodyArcs c={[t * 4 + k * 0.4, 1.15, 0.4 + k * 1.6]} t={t + k} n={6} amt={1} /><Streaks center={[t * 4 + k * 0.4, 1.1, 0.4 + k * 1.6]} t={t} amt={1} /></group>)}</>, cam: (t) => ({ pos: [t * 4 - 3, 1.0, 6], target: [t * 4 + 1, 1.0, 1.2], fov: 46 }) },
];
const FLASHES2: Flashy[] = [
  { at: PE(84) + 0.15, len: 0.45, scene: (t) => { const step = Math.floor(t / 0.08); return <World3D night rewrite={(i) => (i % 2 ? { k: 0.3 + 1.6 * rnd(i + step), flash: 1 } : { k: 1, flash: 0 })} />; }, cam: () => ({ pos: [20, 16, 34], target: [-10, 6, -10], fov: 44 }) },
  { at: PE(84) + 0.8, len: 0.45, scene: (t) => <><Env mood="night" /><ClockFace pos={[0, 0, -5]} r={2.6} t={t * 6} rate={40} /></>, cam: () => ({ pos: [0, 0, 2.2], target: [0, 0, -5], fov: 40 }) },
];

export const E_SHOTS: Shot[] = [
  // 70 · the deal
  { id: "deal", t0: P(70), t1: at(70, "You"), scene: (t) => <><Env mood="dusk" /><RiverRoad t={t} /><SkyCracks t={5} n={40} center={[0, 50, 100]} spread={220} /><Person3D pos={[0, 0, 1.2]} yaw={0.2} look={HOOD} pose={STAND} face={{ brow: 0.8 }} /></>,
    cam: (t) => ({ pos: L3([0.9, 1.5, -1.6], [0.6, 1.5, -1.0], io(seg(t, P(70), at(70, "You")))), target: [0, 1.5, 1.2], fov: 34 }) },
  { id: "deal-brother", t0: at(70, "You"), t1: at(70, "Or"), grade: "sepia(0.3) saturate(1.2) brightness(1.05)", scene: (t) => <><Kitchen bowls={1} sky="#FFE0A8" /><Person3D pos={[0, 0, 0.9]} yaw={Math.PI} look={JAMIE_HOME} pose={{ ...SIT, armR: [60, 6, 100] }} face={{ smile: 0.8 }} /></>,
    cam: (t) => ({ pos: L3([0.6, 1.4, -1.0], [0.4, 1.35, -0.6], io(seg(t, at(70, "You"), at(70, "Or")))), target: [0, 1.25, 0.8], fov: 32 }) },
  { id: "deal-world", t0: at(70, "Or"), t1: P(71), scene: (t) => { const step = Math.floor(t / 0.12); return <><World3D night rewrite={(i) => { const on = rnd(i * 3 + step) > 0.75; return { k: on ? 0.5 + rnd(i + step) : 1, flash: on ? 1 : 0 }; }} /><SkyCracks t={5} n={60} stagger={0} center={[0, 40, -70]} spread={200} /></>; },
    cam: (t) => ({ pos: L3([16, 10, 24], [20, 14, 30], io(seg(t, at(70, "Or"), P(71)))), target: [-6, 8, -20], fov: 46 }) },
  // 71–72 · the end of the long road; "I'm sorry"
  { id: "road-end", t0: P(71), t1: P(72), scene: (t) => <><Env mood="night" /><RiverRoad t={t} /><SkyCracks t={5} n={30} center={[40, 50, 100]} spread={200} /><Person3D pos={[0, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={STAND} /></>,
    cam: (t) => { const u = io(seg(t, P(71), P(72))); return { pos: L3([-40, 1.4, 1.0], [-36, 1.6, 1.4], u), target: [0, 1.0, 1.2], fov: 12 }; } },
  { id: "sorry", t0: P(72), t1: P(73), scene: (t) => <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[0, 0, 1.2]} yaw={RUN_Y + 0.6} look={HOOD} pose={{ ...STAND, headNod: 10 }} face={{ brow: 1, open: Math.max(0, Math.sin(t * 12)) * 0.25 }} /><BodyArcs c={[0, 1.15, 1.2]} t={t} n={3} amt={0.4 + 0.4 * seg(t, P(72), P(73))} /></>,
    cam: (t) => ({ pos: L3([1.35, 1.6, 0.3], [1.0, 1.6, 0.5], io(seg(t, P(72), P(73)))), target: [0, 1.55, 1.2], fov: 30 }) },
  // 73 · you run. lightning. streaks. silence.
  { id: "last-run", t0: P(73), t1: at(73, "Lightning"), scene: (t) => { const d = t - at(73, "run"), x = Math.max(0, d) * Math.max(0, d) * 5; return <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[x, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.8)} face={{ brow: -0.9 }} /><BodyArcs c={[x, 1.15, 1.2]} t={t} n={7} amt={1} /></>; },
    cam: (t) => { const d = t - at(73, "run"), x = Math.max(0, d) * Math.max(0, d) * 5; return shakeC({ pos: [x - 3, 0.6, 2.4], target: [x + 3, 1.1, 1.2], fov: 54 }, t, 0.02); } },
  { id: "lightning", t0: at(73, "Lightning"), t1: at(73, "Streaks"), noBlur: true, scene: (t) => <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[0, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(at(73, "Lightning") * 1.8)} /><BodyArcs c={[0, 1.15, 1.2]} t={t} n={10} amt={1} />{[0, 1, 2, 3].map((k) => <Bolt key={k} a={[(rnd(k) - 0.5) * 20, 30, -10 + k * 10]} b={[0, 1.2, 1.2]} t={t + k * 0.03} seed={700 + k} width={5} light={k === 0 ? 60 : 0} />)}</>,
    cam: (t) => ({ pos: orbit([0, 1.1, 1.2], 30 + 80 * seg(t, at(73, "Lightning"), at(73, "Streaks")), 3.2, 1.0), target: [0, 1.4, 1.2], fov: 46 }) },
  { id: "streaks", t0: at(73, "Streaks"), t1: at(73, "Silence"), scene: (t) => <><Tunnel center={[30, 1.2, 0.4]} t={t} speed={8} /><Person3D pos={[2.6, 0, 0.4]} yaw={RUN_Y} look={HOOD} pose={run3(t * 2)} /><BodyArcs c={[2.6, 1.15, 0.4]} t={t} n={6} amt={1} /><ambientLight intensity={0.5} /></>,
    cam: (t) => shakeC({ pos: [-1.6, 1.25, 0.45], target: [8, 1.2, 0.4], fov: 64 + 20 * seg(t, at(73, "Streaks"), at(73, "Silence")) }, t, 0.05) },
  { id: "silence", t0: at(73, "Silence"), t1: P(75), no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }),
    dom: (t) => { const w = 1 - seg(t, at(73, "Silence"), at(73, "Silence") + 0.6); return <div style={{ position: "absolute", inset: 0, background: `rgb(${255 * w},${255 * w},${255 * w})` }} />; } },
  // 75 · morning; birds; toast
  { id: "wake", t0: P(75), t1: at(75, "Birds"), scene: () => <><Bedroom windowMood="day" /><ambientLight intensity={0.7} /><Person3D pos={[-1.4, 0.82, -0.3]} yaw={0} rotX={-Math.PI / 2} look={HOOD} pose={STAND} face={{ blink: true }} /></>,
    cam: (t) => ({ pos: L3([0.4, 2.0, 1.4], [0.0, 1.8, 0.6], io(seg(t, P(75), at(75, "Birds")))), target: [-1.4, 0.9, -1.5], fov: 40 }), grade: "brightness(1.1)" },
  { id: "birds", t0: at(75, "Birds"), t1: at(75, "The"), scene: (t) => <><DayStreet mood="dawn" />{[0, 1, 2].map((k) => <Pigeon key={k} p={[-2 + (t - at(75, "Birds")) * 2 + k, 3 + k * 0.3, -1 + k]} flap={t * 24 + k} yaw={RUN_Y} s={1.3} />)}</>,
    cam: () => ({ pos: [0, 2.2, 5], target: [0, 3.2, -1], fov: 44 }) },
  { id: "toast", t0: at(75, "The"), t1: P(76), scene: (t) => { const pop = ex(seg(t, at(75, "toast") - 0.1, at(75, "toast") + 0.2)); return <><Kitchen bowls={0} sky="#FFE0A8" />{[-0.05, 0.05].map((x) => <mesh key={x} position={[-2.6 + x, 1.1 + 0.18 * pop, -2.6]}><boxGeometry args={[0.02, 0.18, 0.16]} /><meshToonMaterial color="#D9A050" /></mesh>)}</>; },
    cam: () => ({ pos: [-2.2, 1.35, -1.6], target: [-2.6, 1.15, -2.6], fov: 34 }) },
  // 76 · eyes open; the café is back; the tower is back; the sky is clean
  { id: "eyes", t0: P(76), t1: at(76, "The"), scene: (t) => <><Bedroom windowMood="day" /><ambientLight intensity={0.7} /><Person3D pos={[-1.4, 0.82, -0.3]} yaw={0} rotX={-Math.PI / 2} look={HOOD} pose={STAND} face={{ blink: t < at(76, "open"), eyesBig: 0.6 }} /></>,
    cam: () => ({ pos: [-1.3, 1.95, -1.35], target: [-1.4, 0.95, -1.95], fov: 34 }) },
  { id: "cafe-back", t0: at(76, "The"), t1: at(76, "The", 2), scene: () => <><DayStreet mood="golden" /><Person3D pos={[-3.2, 0, 1.25]} yaw={Math.PI * 0.95} look={HOOD} pose={STAND} face={{ smile: 0.8 }} /></>,
    cam: (t) => ({ pos: L3([-2.2, 1.7, 4.2], [-2.6, 2.2, 5.6], io(seg(t, at(76, "The"), at(76, "The", 2)))), target: [-2.6, 1.6, -3], fov: 44 }) },
  { id: "tower-back", t0: at(76, "The", 2), t1: at(76, "The", 3), scene: (t) => <><Env mood="golden" /><RiverRoad t={t} tower={1} /></>,
    cam: () => ({ pos: [4.2, 1.3, 2.6], target: [24, 30, 125], fov: 40 }) },
  { id: "sky-clean", t0: at(76, "The", 3), t1: P(77), scene: () => <DayStreet mood="day" />,
    cam: (t) => ({ pos: [0, 1.2, 6], target: L3([0, 6, -10], [0, 20, -30], io(seg(t, at(76, "The", 3), P(77)))), fov: 54 }) },
  // 77–79 · a voice from the kitchen; "Oi!"; he's here
  { id: "voice", t0: P(77), t1: P(78), scene: (t) => <><Bedroom windowMood="day" /><ambientLight intensity={0.7} /><Person3D pos={[0.3, 0, 0.2]} yaw={0.35 + 0.8 * io(seg(t, at(77, "kitchen"), at(77, "voice")))} look={HOOD} pose={STAND} face={{ eyesBig: 0.5 }} /></>,
    cam: () => ({ pos: [1.6, 1.5, 2.6], target: [0.3, 1.4, 0.2], fov: 36 }) },
  { id: "oi", t0: P(78), t1: P(79), scene: (t) => <><Kitchen bowls={1} sky="#FFE0A8" /><Person3D pos={[0.4, 0, -1.4]} yaw={0.4} look={JAMIE_HOME} pose={{ ...STAND, armR: [70, 10, 60] }} face={{ smile: 0.4, brow: -0.5, open: Math.max(0, Math.sin(t * 14)) * 0.5 }} propR={<mesh position={[0, -0.12, 0.05]}><boxGeometry args={[0.16, 0.24, 0.06]} /><meshToonMaterial color="#F2B84B" /></mesh>} /></>,
    cam: () => ({ pos: [1.2, 1.5, 0.8], target: [0.4, 1.4, -1.4], fov: 34 }) },
  { id: "here", t0: P(79), t1: P(80), scene: (t) => <><Kitchen bowls={1} sky="#FFE0A8" /><Person3D pos={[0.4, 0, -1.4]} yaw={0.4} look={JAMIE_HOME} pose={STAND} face={{ smile: 0.2, brow: 0.6 }} /><Person3D pos={[1.4, 0, -0.4]} yaw={-2.4} look={HOOD} pose={{ ...STAND, armR: [40, 20, 60], armL: [40, 20, 60] }} face={{ smile: 1, open: 0.3 }} /></>,
    cam: (t) => ({ pos: orbit([0.9, 1.3, -0.9], 20 + 50 * seg(t, P(79), P(80)), 2.6, 1.5), target: [0.9, 1.3, -0.9], fov: 40 }), grade: "sepia(0.15) saturate(1.15)" },
  // 80–82 · the phone buzzes: from your own number, sent tomorrow
  { id: "buzz", t0: P(80), t1: P(84) - 0.05, scene: (t) => <><Kitchen bowls={1} sky="#FFE0A8" /><Person3D pos={[1.4, 0, -0.4]} yaw={-2.4} look={HOOD} pose={{ ...STAND, armR: [45, 4, 95], headNod: 20 }} face={{ smile: t < at(81, "Sent") ? 0.5 : 0, eyesBig: t > at(81, "Sent") ? 1 : 0 }} /></>,
    cam: (t) => ({ pos: [2.5, 1.6, 0.6], target: [1.3, 1.3, -0.5], fov: 36 }), grade: "blur(4px) brightness(0.75)",
    dom: (t) => <Phone2D x={960} y={560} s={1.0} enter={seg(t, P(80), P(80) + 0.4)} buzz={t < at(80, "One") ? 1 - seg(t, at(80, "buzzes"), at(80, "One")) : 0}><TextScreen typed={seg(t, at(82, "Don't"), atE(82, "do"))} stamp={seg(t, at(81, "Sent"), at(81, "Sent") + 0.3)} /></Phone2D> },
];
// 83 · "you didn't write that. not yet." + the stopped clocks, the crack, the frozen city (cinematic hold), then the teaser
E_SHOTS.push(
  { id: "not-yet", t0: P(83), t1: tStop, scene: (t) => <><Kitchen bowls={1} sky="#FFE0A8" /><Person3D pos={[1.4, 0, -0.4]} yaw={-2.4} look={HOOD} pose={{ ...STAND, armR: [45, 4, 95], headNod: 6 }} face={{ smile: 0, open: 0.2, eyesBig: 1 }} /><ClockFace pos={[-3.48, 2.3, 0]} r={0.35} t={Math.min(t, tStop)} rate={-6} rotY={Math.PI / 2} /></>,
    cam: (t) => ({ pos: L3([0.4, 1.6, -1.5], [0.7, 1.6, -1.2], io(seg(t, P(83), tStop))), target: [1.4, 1.55, -0.4], fov: 30 }) },
  { id: "clocks-stop", t0: tStop, t1: tCrack, scene: (t) => <><Kitchen bowls={1} sky="#FFE0A8" /><ClockFace pos={[-3.48, 2.3, 0]} r={0.35} t={tStop} rate={-6} rotY={Math.PI / 2} /></>,
    cam: () => ({ pos: [-2.6, 2.3, 0], target: [-3.48, 2.3, 0], fov: 36 }) },
  { id: "frozen-street", t0: tCrack, t1: tCrane, noBlur: true, scene: (t) => <FrozenStreet t={t} />,
    cam: (t) => ({ pos: L3([0, 1.4, 6], [1, 1.6, 6.5], io(seg(t, tCrack, tCrane))), target: L3([0, 4, -10], [0, 14, -40], io(seg(t, tCrack, tCrane))), fov: 52 }) },
  { id: "frozen-city", t0: tCrane, t1: tBlack, noBlur: true, scene: (t) => <FrozenStreet t={t} />,
    cam: (t) => { const u = io(seg(t, tCrane, tBlack)); return { pos: L3([2, 3, 7], [6, 38, 9], u), target: L3([0, 1, 0], [-10, 0, -30], u), fov: 50 }; } },
  { id: "black", t0: tBlack, t1: T0, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }) },
);
// 84–85 · the teaser: Jamie's line (cold close-up), four fast flashes out of order, "I already did"
const teaserShots: Shot[] = [];
const J0 = T0, J1 = PE(84) + 0.15;
teaserShots.push({ id: "jamie-line", t0: J0, t1: J1, grade: COLD, scene: (t) => <><Env mood="night" /><World3D bare night nearTrees={false} lamps={false} cafe={false} /><Person3D pos={[0, 0, 0]} yaw={0} look={LOOKS.jamie} pose={STAND} face={{ smile: 0, brow: 0.4, open: Math.max(0, Math.sin(t * 13)) * 0.4 }} /><pointLight position={[0.6, 1.8, 1.2]} color="#BFE6F0" intensity={3} distance={4} /></>,
  cam: (t) => ({ pos: [0.12 * Math.sin(t * 40) * (Math.floor(t * 9) % 4 === 0 ? 1 : 0), 1.5, 1.6], target: [0, 1.45, 0], fov: 30 }) });
const ALLF = [...FLASHES, ...FLASHES2];
const slot = (PS(85) - 0.05 - J1) / ALLF.length;
ALLF.forEach((f, i) => {
  const a = J1 + i * slot;
  teaserShots.push({ id: `flash${i}`, t0: a, t1: a + slot * 0.8, grade: COLD, scene: (t) => f.scene(t - a + f.at), cam: (t) => f.cam(t - a + f.at) });
  teaserShots.push({ id: `gap${i}`, t0: a + slot * 0.8, t1: a + slot, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }) });
});
teaserShots.push({ id: "already", t0: PS(85) - 0.05, t1: PE(85) + 0.25, grade: COLD + " brightness(0.7)", scene: (t) => <><color attach="background" args={["#020306"]} /><Person3D pos={[0, 0, 0]} yaw={0.3} look={HOOD} pose={STAND} face={{ smile: 0, brow: 0.6, open: 0.15 }} />{Math.floor(t * 7) % 3 === 0 && <pointLight position={[1, 2, 1.5]} color="#BFE6FF" intensity={6} distance={5} />}<ambientLight intensity={0.05} /></>,
  cam: () => ({ pos: [0.5, 1.55, 1.2], target: [0, 1.52, 0], fov: 30 }) });
teaserShots.push({ id: "part2", t0: PE(85) + 0.25, t1: FILM_END, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }),
  dom: () => <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #141B3A, #05070F 70%)" }} /> });
E_SHOTS.push(...teaserShots);

const Bars: React.FC<{ t: number }> = ({ t }) => {
  const on = t > T0 - 0.1 && t < PE(85) + 0.25;
  if (!on) return null;
  return <><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "#000" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "#000" }} /></>;
};

export const EType: React.FC<{ t: number }> = ({ t }) => {
  const sig = ex(seg(t, at(87, "In"), at(87, "In") + 0.6));
  const g = t > PE(85) + 0.25 && t < PE(85) + 0.9 ? Math.floor(t * 30) % 2 : 0;
  return (
    <>
      <Rise t={t} at={at(70, "brother")} out={at(70, "Or")} text="Your brother." size={80} y={150} color={C.amber} />
      <Rise t={t} at={at(70, "world")} out={P(71) - 0.1} text="Or the world you broke." size={80} y={150} color={C.red} />
      <Slam t={t} at={at(73, "Lightning")} out={at(73, "Streaks") - 0.05} text="LIGHTNING." size={150} y={150} color={C.cool} glow="#7FB8FF" />
      <Slam t={t} at={at(73, "Streaks")} out={at(73, "Silence") - 0.05} text="STREAKS." size={150} y={150} />
      <Rise t={t} at={at(74, "And")} out={P(75) - 0.2} text="And we don't get to see what you chose." size={56} y={500} align="center" w={1600} color="#8090B0" />
      <Chip t={t} at={at(80, "One")} out={at(80, "From")} text="1 NEW MESSAGE" y={110} bg={C.cool} />
      <Slam t={t} at={at(81, "tomorrow")} out={at(82, "Don't") - 0.05} text="SENT: TOMORROW" size={90} y={120} x={110} align="left" color={C.red} />
      <Bars t={t} />
      {/* PART 2 card, the question, the sign-off */}
      <div style={{ position: "absolute", inset: 0, transform: g ? "translateX(12px)" : undefined }}>
        <Slam t={t} at={PE(85) + 0.25} out={at(86, "Would") - 0.05} text="PART 2" size={260} y={360} color={C.cream} glow="#7FB8FF" />
        <Rise t={t} at={PE(85) + 0.8} out={at(86, "Would") - 0.05} text="Coming soon." size={60} y={660} align="center" w={1200} color={C.cool} />
      </div>
      <Rise t={t} at={at(86, "Would")} out={at(87, "In") - 0.1} text="Would you have gone back?" size={100} y={330} align="center" w={1700} hi={{ "back?": C.amber }} />
      <Chip t={t} at={at(86, "Tell")} out={at(87, "In") - 0.1} text="TELL US IN THE COMMENTS" x={960 - 280} y={520} bg={C.cream} color={C.ink} />
      <Rise t={t} at={at(86, "Part")} out={at(87, "In") - 0.1} text="Part two is coming." size={60} y={640} align="center" w={1200} color={C.cool} />
      {t > at(87, "In") - 0.05 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 430, textAlign: "center", fontFamily: "CutieMolly", fontSize: 200, color: C.cream, letterSpacing: "0.04em", transform: `scale(${0.7 + 0.3 * sig})`, opacity: sig, textShadow: "0 0 30px rgb(127,180,230), 0 0 80px rgba(127,180,230,0.6)" }}>IN THEORY.</div>
      )}
      <Flash t={t} at={at(73, "Lightning")} color="#DDEBFF" max={0.9} len={0.3} />
      <Flash t={t} at={at(73, "Silence")} max={1} len={0.05} />
      <Flash t={t} at={tCrack} color="#EAF6FF" max={0.5} len={0.3} />
      <Flash t={t} at={PE(85) + 0.25} color="#BFE6F0" max={0.6} len={0.25} />
      {t > FILM_END - 0.6 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: seg(t, FILM_END - 0.6, FILM_END) }} />}
    </>
  );
};
