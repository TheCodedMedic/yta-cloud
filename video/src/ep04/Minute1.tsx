// Episode 04 "What If You Could Go Back in Time?": the first minute (beats 1–9), built in three.js.
// Every cut, freeze, flash and line of type is anchored to a measured word (timing.json). Full frame, no letterbox.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { LOOKS, mix3, Person3D, Pose3, run3, STAND, walk3 } from "../cam3d/Person3D";
import { World3D } from "../cam3d/World3D";
import { useEpFonts } from "./AssetSheet";
import { Bedroom, Crowd, Env, Garage, makeCrowd, Park, Plaza, Rooftop } from "./Sets";
import { C, Chip, Flash, Rise, Slam, Strike } from "./Text";
import { BodyArcs, Bolt, ClockFace, Rain, SkyCracks, Streaks, Tunnel, V3 } from "./Vfx";
import { at, c01, CamS, ex, FPS4, hand, io, L3, nz, PE, PS, rnd, RUN_Y, seg, Shot, shakeC, ShotFrame } from "./core";


export const M1_END = PS(10) - 0.12;

// ─── the cold-open clock: the hero's run, the freeze, the restart ────────────
const T_STOP = at(1, "stops"), T_GO = at(3, "street");
const runClock = (t: number) => (t < T_STOP ? t : t < T_GO ? T_STOP : T_STOP + (t - T_GO));
const heroX = (t: number) => (t < T_STOP ? -8 + 6.2 * t : t < T_GO ? -8 + 6.2 * T_STOP : -8 + 6.2 * T_STOP + 12 * (t - T_GO));
const rainMotion = (t: number) => (t < T_STOP ? 1 : t < T_GO ? 1 - ex(seg(t, T_STOP, T_STOP + 0.35)) : 1);
const STREET_CROWD = makeCrowd(11, 11, -6, 30, -2.7, -1.9, true);
const streetCrowdWalk = (t: number) => (i: number) => {
  const c = runClock(t); return { dx: c * (0.8 + rnd(i) * 0.5), pose: walk3(c * 0.9 + rnd(i)) };
};

const NightStreet: React.FC<{ t: number; arcs?: number; streak?: number; strike?: boolean }> = ({ t, arcs = 0, streak = 0, strike }) => {
  const hx = heroX(t), rc = runClock(t);
  const frozen = t >= T_STOP && t < T_GO;
  const pose: Pose3 = run3(rc * 1.45);
  return (
    <>
      <World3D night nearTrees={false} lamps={false} />
      {[-14, -2, 10, 22, 34].map((x) => <pointLight key={x} position={[x, 3.2, -1.2]} color="#FFC777" intensity={7} distance={10} decay={1.6} />)}
      <Person3D pos={[hx, 0, 0.6]} yaw={RUN_Y} look={LOOKS.hoodie} pose={pose} face={{ smile: 0, brow: -0.6, open: frozen ? 0 : 0.25, eyesBig: frozen ? 0.3 : 0 }} />
      <Crowd list={STREET_CROWD} walk={streetCrowdWalk(t)} />
      <Rain center={[hx + 2, 0, 0.9]} rt={rc} motion={rainMotion(t)} size={[18, 8, 6]} n={3200} />
      {arcs > 0 && <BodyArcs c={[hx, 1.15, 0.6]} t={t} n={7} amt={arcs} />}
      {streak > 0 && <Streaks center={[hx, 1.1, 0.6]} t={t} amt={streak} />}
      {strike && t < 0.5 && <Bolt a={[hx + 30, 40, -60]} b={[hx + 22, 0, -30]} t={t} seed={7} width={10} branches={6} light={0} />}
    </>
  );
};

// ─── shots ───────────────────────────────────────────────────────────────────
const HEAD_Y = 1.58;

const SHOTS: Shot[] = [
  // 1a · cold open: lightning, then the hero sprints at us (low lead shot)
  { id: "lead", t0: 0, t1: at(1, "You're"), scene: (t) => <NightStreet t={t} strike />,
    cam: (t) => { const hx = heroX(t); return hand({ pos: [hx + 3.4 - 0.6 * t, 0.45, 1.0], target: [hx, 1.15, 0.6], fov: 42 }, t, 0.02); } },
  // 1b · side tracking through the rain
  { id: "track", t0: at(1, "You're"), t1: at(1, "And", 1, -0.15), scene: (t) => <NightStreet t={t} />,
    cam: (t) => { const hx = heroX(t); return hand({ pos: [hx + 0.4, 1.0, 4.4], target: [hx + 0.7, 1.0, 0.6], fov: 34 }, t, 0.02); } },
  // 2 · "and then the rain stops": three-quarter, everything freezes on the word
  { id: "freeze", t0: at(1, "And", 1, -0.15), t1: at(2, "Not"), scene: (t) => <NightStreet t={t} />,
    cam: (t) => { const hx = heroX(t), u = io(seg(t, at(1, "And", 1, -0.15), at(2, "Not"))); return { pos: L3([hx + 2.8, 1.25, 2.9], [hx + 2.0, 1.35, 2.0], u), target: [hx, 1.15, 0.6], fov: 36 }; } },
  // 3 · bullet-time orbit through the frozen drops
  { id: "orbit", t0: at(2, "Not"), t1: at(3, "Lightning"), noBlur: true, scene: (t) => <NightStreet t={t} />,
    cam: (t) => {
      const hx = heroX(t), u = io(seg(t, at(2, "Not"), at(3, "Lightning")));
      const a = (70 + 200 * u) * Math.PI / 180, r = 2.2 - 0.8 * seg(t, at(2, "like"), at(3, "Lightning"));
      return { pos: [hx + Math.sin(a) * r, 1.2 + 0.25 * Math.sin(u * Math.PI), 0.6 + Math.cos(a) * r], target: [hx, 1.12, 0.6], fov: 38 };
    } },
  // 4 · lightning crawls off his shoulders (close, crash-in)
  { id: "arcs", t0: at(3, "Lightning"), t1: at(3, "street"), scene: (t) => <NightStreet t={t} arcs={ex(seg(t, at(3, "Lightning"), at(3, "Lightning") + 0.8))} />,
    cam: (t) => { const hx = heroX(t), z = ex(seg(t, at(3, "Lightning"), at(3, "Lightning") + 0.25)); return shakeC({ pos: [hx + 1.0, 1.55, 1.75], target: [hx + 0.05, 1.32, 0.6], fov: 48 - 16 * z }, t, 0.01); } },
  // 5 · he explodes forward: chase cam, streaks, the street stretches
  { id: "burst", t0: at(3, "street"), t1: at(3, "world", 1, -0.12), scene: (t) => <NightStreet t={t} arcs={0.8} streak={ex(seg(t, at(3, "street"), at(3, "street") + 0.6))} />,
    cam: (t) => { const hx = heroX(t), u = ex(seg(t, at(3, "street"), at(3, "world"))); return shakeC({ pos: [hx - 2.4 + 0.8 * u, 0.75, 1.0], target: [hx + 3, 1.05, 0.6], fov: 50 + 32 * u }, t, 0.02); } },
  // 6 · the world tears open: inside the time tunnel
  { id: "tunnel", t0: at(3, "world", 1, -0.12), t1: at(4, "Tonight"), scene: (t) => (
      <>
        <Tunnel center={[30, 1.2, 0.4]} t={t} speed={4} />
        <Person3D pos={[2.6, 0, 0.4]} yaw={RUN_Y} look={LOOKS.hoodie} pose={run3(t * 1.6)} face={{ smile: 0, brow: -0.6, open: 0.3 }} />
        <BodyArcs c={[2.6, 1.15, 0.4]} t={t} n={5} amt={1} />
        <ambientLight intensity={0.5} />
      </>
    ),
    cam: (t) => shakeC({ pos: [-1.6, 1.25, 0.45], target: [8, 1.2, 0.4], fov: 62 }, t, 0.03) },
  // 7 · his face, determined, the tunnel behind him
  { id: "face", t0: at(4, "Tonight"), t1: PE(4) + 0.25, scene: (t) => (
      <>
        <Tunnel center={[-30, 1.2, 0.4]} t={t} speed={-3} opacity={0.9} />
        <Person3D pos={[0, 0, 0.4]} yaw={RUN_Y} look={LOOKS.hoodie} pose={{ ...run3(t * 1.6), lean: 10 }} face={{ smile: 0, brow: -0.8, open: 0, blink: false }} />
        <BodyArcs c={[0, 1.2, 0.4]} t={t} n={3} amt={0.6} />
        <ambientLight intensity={0.7} />
        <pointLight position={[1.2, 1.7, 0.6]} color="#BFE6F0" intensity={3} distance={4} />
      </>
    ),
    cam: (t) => { const u = io(seg(t, at(4, "Tonight"), PE(4) + 0.25)); return shakeC({ pos: [1.5 - 0.5 * u, 1.62, 0.55 + 0.15 * u], target: [0, 1.55, 0.42], fov: 34 }, t, 0.006); } },
  // 8 · aerial: the city rewrites itself (heights jump, windows flash), first scars, a strike
  { id: "rewrite", t0: PE(4) + 0.25, t1: PS(5) - 0.05, scene: (t) => {
      const step = Math.floor(t / 0.14);
      return (
        <>
          <World3D night rewrite={(i) => { const on = rnd(i * 7 + step) > 0.72; return { k: on ? 0.35 + 1.5 * rnd(i + step * 3) : 1, flash: on ? 1 : 0 }; }} />
          <SkyCracks t={t - (PE(4) + 0.6)} n={5} stagger={0.3} center={[-14, 34, -50]} spread={50} />
          {t > PS(5) - 1.0 && <Bolt a={[-6, 45, -40]} b={[-2, 0, -6]} t={t} seed={23} width={9} branches={6} />}
        </>
      );
    },
    cam: (t) => { const u = io(seg(t, PE(4) + 0.25, PS(5))); return { pos: L3([22, 16, 34], [14, 11, 24], u), target: [-10, 6, -10], fov: 44 }; } },
  // 9 · title: a giant clock rewinding in the dark, bolts around it
  { id: "title", t0: PS(5) - 0.05, t1: at(5, "Not"), scene: (t) => (
      <>
        <Env mood="night" />
        <ClockFace pos={[0, 1.15, -6]} r={2.5} t={t} rate={-14} />
        <Bolt a={[-7, 4, -5]} b={[-3, -3, -5]} t={t} seed={41} width={3} />
        <Bolt a={[7, -3, -5]} b={[3, 4, -5]} t={t + 0.03} seed={43} width={3} />
      </>
    ),
    cam: (t) => { const u = seg(t, PS(5), at(5, "Not")); return { pos: [0, 0, 6 - 1.4 * u], target: [0, 0, -6], fov: 40, roll: -0.04 + 0.08 * u }; } },
  // 10 · "not in a machine": the garage pod (crossed out)
  { id: "machine", t0: at(5, "Not"), t1: at(5, "On"), scene: (t) => <Garage glow={0.4 + 0.6 * Math.abs(Math.sin(t * 3))} t={t} />,
    cam: (t) => { const u = io(seg(t, at(5, "Not"), at(5, "On"))); return { pos: L3([3.6, 1.9, 4.2], [2.4, 1.6, 2.9], u), target: [0, 1.2, -1.5], fov: 40 }; } },
  // 11 · "on foot": dawn, ground level, a trainer pushes off the wet path
  { id: "foot", t0: at(5, "On"), t1: at(5, "By"), scene: (t) => {
      const u = seg(t, at(5, "On") + 0.2, at(5, "By"));
      return <><Env mood="dawn" /><Park /><Person3D pos={[0.4 * u * u, 0, 0.2]} yaw={RUN_Y} look={LOOKS.hoodie} pose={mix3(STAND, run3(0.1 + u * 0.5), ex(u * 2))} face={{ smile: 0, brow: -0.5 }} /></>;
    },
    cam: () => ({ pos: [1.0, 0.13, 1.3], target: [0.0, 0.2, 0.2], fov: 38 }) },
  // 12 · the run through the park: time jumps from dawn to day mid-stride
  { id: "park", t0: at(5, "By"), t1: PS(6) - 0.1, scene: (t) => {
      const mid = at(5, "time"), hx = (t - at(5, "By")) * 9;
      return <><Env mood={t < mid ? "dawn" : "day"} center={[hx, 0, 0]} /><Park /><Person3D pos={[hx, 0, 0.2]} yaw={RUN_Y} look={LOOKS.hoodie} pose={run3(t * 1.5)} face={{ smile: 0.1, brow: -0.4, open: 0.2 }} />
        <Streaks center={[hx, 1.1, 0.2]} t={t} amt={0.55} /><BodyArcs c={[hx, 1.15, 0.2]} t={t} n={3} amt={0.5} /></>;
    },
    cam: (t) => { const hx = (t - at(5, "By")) * 9; return hand({ pos: [hx + 0.6, 1.1, 4.6], target: [hx + 1.0, 1.0, 0.2], fov: 36 }, t, 0.025); } },
  // 13 · golden plaza: he stops, grins; people pass (crane up)
  { id: "plaza", t0: PS(6) - 0.1, t1: at(6, "Right"), scene: (t) => <PlazaScene t={t} />,
    cam: (t) => { const u = io(seg(t, PS(6) - 0.1, at(6, "Right"))); return { pos: L3([2.6, 1.3, 4.6], [3.6, 3.0, 6.6], u), target: [0, 1.25, 0.5], fov: 34 }; } },
  // 14 · "until the world starts to change": pull back, buildings flicker, people freeze, a crack in the gold sky
  { id: "change", t0: at(6, "Right"), t1: PS(7) - 0.15, scene: (t) => <PlazaScene t={t} change />,
    cam: (t) => { const u = io(seg(t, at(6, "Right"), PS(7))); return { pos: L3([4, 3.0, 7], [10, 7, 17], u), target: [0, 2.5, -2], fov: 40 }; } },
  // 15 · rule 1: jog, sprint, flat out (day park, side tracking)
  { id: "rule1", t0: PS(7) - 0.15, t1: PS(8) - 0.1, scene: (t) => {
      const { hx, pose, amt } = rule1(t);
      return <><Env mood="day" center={[hx, 0, 0]} /><Park /><Person3D pos={[hx, 0, 0.2]} yaw={RUN_Y} look={LOOKS.hoodie} pose={pose} face={{ smile: amt > 0.9 ? 0 : 0.4, brow: amt > 0.9 ? -0.7 : 0 }} />
        {amt > 0.5 && <Streaks center={[hx, 1.1, 0.2]} t={t} amt={amt} />}{amt > 0.9 && <BodyArcs c={[hx, 1.15, 0.2]} t={t} n={6} amt={1} />}</>;
    },
    cam: (t) => { const { hx, amt } = rule1(t); return shakeC(hand({ pos: [hx + 0.5, 1.75, 5.2], target: [hx + 0.9, 1.55, 0.2], fov: 36 + 10 * Math.max(0, amt - 0.9) * 10 }, t, 0.02), t, amt > 0.9 ? 0.02 : 0); } },
  // 16 · rule 2: the bedroom. He vanishes and lands on the same spot; outside, night becomes morning
  { id: "rule2", t0: PS(8) - 0.1, t1: PS(9) - 0.1, scene: (t) => {
      const jump = at(8, "arrive"), gone = t > jump - 0.12 && t < jump + 0.3;
      return (
        <>
          <Bedroom windowMood={t < jump ? "night" : "day"} />
          <ambientLight intensity={t < jump ? 0.35 : 0.8} />
          {!gone && <Person3D pos={[0.3, 0, 0.2]} yaw={0.35} look={LOOKS.hoodie} pose={{ ...STAND, headTurn: t > jump ? 12 * Math.sin((t - jump) * 2) : 0 }} face={{ smile: t > at(8, "Same") ? 0.6 : 0.2, blink: ((t * 10) | 0) % 37 === 0 }} />}
          {t > jump - 0.15 && t < jump + 0.35 && <BodyArcs c={[0.3, 1.15, 0.2]} t={t} n={6} amt={1} />}
        </>
      );
    },
    cam: (t) => { const u = io(seg(t, PS(8), PS(9))); const a = (25 - 30 * u) * Math.PI / 180; return { pos: [0.3 + Math.sin(a) * 3.2, 1.45, 0.2 + Math.cos(a) * 3.2], target: [0.1, 1.05, -0.4], fov: 46 }; } },
  // 17 · rule 3: rooftop at dusk. One scar opens in the sky... then a hundred
  { id: "rule3", t0: PS(9) - 0.1, t1: M1_END + 2, scene: (t) => {
      const one = at(9, "scar"), many = at(9, "hundred");
      return (
        <>
          <Env mood="dusk" />
          <Rooftop />
          <Person3D pos={[0, 0, 2]} yaw={Math.PI} look={LOOKS.hoodie} pose={{ ...STAND, headNod: -18 }} face={{ smile: 0, open: 0.3, eyesBig: 1 }} />
          <SkyCracks t={t - one} n={1} center={[-8, 52, -95]} />
          {t > many - 0.25 && <SkyCracks t={t - many + 0.25} n={100} stagger={0.009} center={[0, 62, -125]} spread={260} />}
        </>
      );
    },
    cam: (t) => { const u = io(seg(t, at(9, "hundred") - 0.3, M1_END + 1.4)); return { pos: L3([1.2, 0.5, 5.6], [3.5, 4.5, 11], u), target: L3([0, 8, -12], [0, 30, -70], u), fov: 50 + 14 * u }; } },
];

function rule1(t: number) {
  const t0 = PS(7) - 0.15, jog = at(7, "jog"), spr = at(7, "sprint"), flat = at(7, "Flat");
  // distance integrates a speed that steps up on each word
  const sp = (x: number) => (x < jog ? 0 : x < spr ? 2.2 : x < flat ? 6.5 : 13);
  let hx = 0; for (let x = t0; x < t; x += 1 / 60) hx += sp(x) / 60;
  const ready: Pose3 = { lean: 22, armL: [-30, 6, 60], armR: [35, 6, 70], legL: [30, 60], legR: [-18, 10], bob: -0.12, headNod: -8 };
  const pose = t < jog ? mix3(STAND, ready, io(seg(t, at(7, "faster") - 0.2, at(7, "faster") + 0.4))) : t < spr ? walk3((t - jog) * 1.6, 1.2) : run3(t * (t < flat ? 1.4 : 1.8));
  return { hx, pose, amt: t < spr ? 0 : t < flat ? 0.6 : 1 };
}

const PLAZA_CROWD = makeCrowd(71, 12, -9, 9, -7, 6);
const PlazaScene: React.FC<{ t: number; change?: boolean }> = ({ t, change }) => {
  const freezeAt = change ? at(6, "change") : 1e9;
  const tc = Math.min(t, freezeAt);
  const step = Math.floor(t / 0.16);
  return (
    <>
      <Env mood="golden" />
      <Plaza rewrite={change && t > at(6, "starts") ? (i) => { const on = rnd(i * 5 + step) > 0.6; return { k: on ? 0.5 + 1.2 * rnd(i + step) : 1, flash: on ? 1 : 0 }; } : undefined} />
      <Person3D pos={[0, 0, 0.5]} yaw={0.5} look={LOOKS.hoodie} pose={{ ...STAND, armR: [4, 7, 10], headTurn: change ? -20 * seg(t, at(6, "Right"), at(6, "Right") + 0.6) : 0 }} face={{ smile: change ? 0 : 0.9, open: change ? 0.25 : 0, eyesBig: change ? 0.6 : 0 }} />
      <Crowd list={PLAZA_CROWD} walk={(i) => ({ dx: (tc - PS(6)) * (0.7 + rnd(i) * 0.6), pose: walk3(tc * 0.9 + rnd(i)) })} />
      {change && <SkyCracks t={t - at(6, "change")} n={1} center={[6, 32, -60]} />}
    </>
  );
};

// ─── on-screen type ──────────────────────────────────────────────────────────
const Type: React.FC<{ t: number }> = ({ t }) => (
  <>
    {/* title */}
    <Rise t={t} at={PS(5) + 0.05} out={at(5, "Not") - 0.1} text="WHAT IF YOU COULD" size={64} y={730} align="center" w={1600} color={C.cool} />
    <Slam t={t} at={at(5, "go")} out={at(5, "Not") - 0.1} text="GO BACK IN TIME?" size={150} y={820} glow="#7FB8FF" />
    {/* not in a machine */}
    <Strike t={t} at={at(5, "Not") + 0.05} strikeAt={at(5, "machine") + 0.1} out={at(5, "On") - 0.1} text="In a machine." size={92} x={120} y={130} />
    <Chip t={t} at={at(5, "On")} out={at(5, "By") - 0.1} text="ON FOOT" y={140} bg={C.amber} />
    {/* rules */}
    <Chip t={t} at={at(7, "Rule")} out={PS(8) - 0.2} text="RULE 1" y={110} />
    <Rise t={t} at={at(7, "The")} out={at(7, "jog") - 0.1} text="The faster you run, the further back you go." size={72} y={180} w={1200} />
    <Slam t={t} at={at(7, "second")} out={at(7, "sprint") - 0.05} text="−1 SECOND" size={120} y={180} x={110} align="left" color={C.cream} />
    <Slam t={t} at={at(7, "minute")} out={at(7, "Flat") - 0.05} text="−1 MINUTE" size={120} y={180} x={110} align="left" color={C.amber} />
    <Slam t={t} at={at(7, "year")} out={PS(8) - 0.2} text="−1 YEAR" size={150} y={170} x={110} align="left" color={C.amber} glow={C.amber} />
    <Chip t={t} at={at(8, "Rule")} out={PS(9) - 0.2} text="RULE 2" y={110} />
    <Rise t={t} at={at(8, "You")} out={at(8, "You", 2) - 0.1} text="You arrive where you were, as you were." size={72} y={180} w={1200} />
    <Rise t={t} at={at(8, "You", 2)} out={PS(9) - 0.2} text="You can't go back to a place you've never been." size={64} y={180} w={1200} />
    <Chip t={t} at={at(9, "Rule")} out={M1_END + 1} text="RULE 3" y={110} bg={C.red} color={C.cream} />
    <Rise t={t} at={at(9, "Every")} out={at(9, "One") - 0.1} text="Every jump leaves a scar." size={80} y={180} w={1200} />
    <Slam t={t} at={at(9, "hundred")} out={PS(10) - 0.15} text="×100" size={170} y={170} x={110} align="left" color={C.cool} glow="#7FB8FF" />
    {/* flashes */}
    <Flash t={t} at={0.05} color="#DDEBFF" max={0.9} len={0.35} />
    <Flash t={t} at={T_STOP} color="#BFE6F0" max={0.35} len={0.25} />
    <Flash t={t} at={at(3, "world", 1, -0.12)} max={1} len={0.4} />
    <Flash t={t} at={PS(5) - 1.0} color="#DDEBFF" max={0.7} len={0.3} />
    <Flash t={t} at={at(5, "time")} max={0.8} len={0.3} />
    <Flash t={t} at={at(7, "year")} color="#BFE6F0" max={0.5} len={0.3} />
    <Flash t={t} at={at(8, "arrive") - 0.12} max={0.9} len={0.35} />
  </>
);

// ─── first-minute compositions ──────────────────────────────────────────────
export const M1_SHOTS = SHOTS;
export const M1Type = Type;
/** The first-minute cut runs 1.6 s past beat 9 so the "hundred scars" payoff can land (voice is trimmed at beat 10). */
export const M1_FRAMES = Math.round((M1_END + 1.6) * FPS4);
export const Ep4Minute1: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const ready = useEpFonts();
  const t = useCurrentFrame() / FPS4;
  if (!ready) return <AbsoluteFill style={{ background: "#05070F" }} />;
  return <><ShotFrame shots={SHOTS} t={t} type={Type} />{voice && <Audio src={staticFile("ep04_vo.wav")} />}</>;
};
export const Ep4Minute1Picture: React.FC = () => <Ep4Minute1 voice={false} />;
