// Episode 04, part B (beats 10–27): GPS and time dilation, the late Tuesday, the slow-motion pigeon and coffee,
// the catch, the three tests (bus, maths, five-a-side), the cost (four breakfasts, eleven hours), the lottery, the photo.
import React, { useMemo } from "react";
import * as THREE from "three";
import { LOOKS, mix3, Person3D, Pose3, run3, SIT, STAND, toon, walk3 } from "../cam3d/Person3D";
import { World3D } from "../cam3d/World3D";
import { at, CamS, ex, hand, io, L3, orbit, P, PE, PS, rnd, RUN_Y, seg, Shot, shakeC } from "./core";
import { Lottery, MapScreen, Phone2D } from "./Dom";
import { Bedroom, Env } from "./Sets";
import { Bus, BusStop, Classroom, Coffee, Kitchen, Pigeon, Pitch, Space } from "./Sets2";
import { C, Chip, Flash, Rise, Slam } from "./Text";
import { BodyArcs, ClockFace, SkyCracks, Streaks, V3 } from "./Vfx";

const DayStreet: React.FC<{ t: number; bus?: { x: number; doors: number } }> = ({ bus }) => (
  <>
    <Env mood="day" />
    <World3D bare lamps={false} nearTrees={false} glow={0.25} />
    <BusStop p={[7, 0, 0.9]} />
    {bus && <Bus p={[bus.x, 0, 3.4]} doors={bus.doors} />}
  </>
);
const HOOD = LOOKS.hoodie;
const satPos = (t: number, k = 0): V3 => { const inc = (20 + k * 25) * Math.PI / 180, a = t * 0.25 + k * 1.05, r = 6.2; return [Math.cos(a) * r, Math.sin(a) * r * Math.sin(inc), Math.sin(a) * r * Math.cos(inc)]; };

// the Tuesday: hero runs from x = −4 toward the bus stop
const tRun = at(14, "You"), tSlow = P(15), tFlash = at(16, "flash");
const tueX = (t: number) => (t < tRun ? -4 : t < tSlow ? -4 + (t - tRun) * 1.9 : -4 + (tSlow - tRun) * 1.9 + (t - tSlow) * 0.1);
const PIGEON: V3 = [2.6, 1.9, 0.0], MAN: V3 = [4.2, 0, -0.9], CUP: V3 = [3.95, 1.18, -0.75];

// five-a-side: the run-up and the shot
const tKick = at(22, "shoot");
const ball = (t: number, right: boolean): V3 => {
  if (t < tKick) return [11.4, 0.18, 0.2];
  const u = Math.min(1, (t - tKick) / 0.55);
  return [11.4 + 3.4 * u, 0.18 + Math.sin(u * Math.PI) * 0.7 + u * 0.4, 0.2 + (right ? 1.1 : -1.1) * u];
};

const Photo: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 256; c.height = 320; const g = c.getContext("2d")!;
    g.fillStyle = "#F2B87A"; g.fillRect(0, 0, 256, 320); g.fillStyle = "#5E8A4E"; g.fillRect(0, 220, 256, 100);
    [[90, "#2E5FD0"], [170, "#A0303C"]].forEach(([x, col]) => { g.fillStyle = "#0E070D"; g.beginPath(); g.arc(x as number, 140, 30, 0, 7); g.fill(); g.fillStyle = col as string; g.fillRect((x as number) - 28, 170, 56, 80); });
    g.strokeStyle = "#F4EFE6"; g.lineWidth = 4; g.beginPath(); g.arc(160, 150, 10, 0.2, 2.9); g.stroke(); g.beginPath(); g.arc(80, 150, 10, 0.2, 2.9); g.stroke();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, []);
  return (
    <group position={p} rotation={[0, ry, 0]}>
      <mesh material={toon("#3A2A22")}><boxGeometry args={[0.36, 0.44, 0.03]} /></mesh>
      <mesh position={[0, 0, 0.017]}><planeGeometry args={[0.3, 0.38]} /><meshBasicMaterial map={tex} /></mesh>
    </group>
  );
};

export const B_SHOTS: Shot[] = [
  // 10 · "some of this is real": Earth from space
  { id: "earth", t0: P(10), t1: at(10, "Time"), scene: (t) => <Space t={t} />,
    cam: (t) => { const u = io(seg(t, P(10), at(10, "Time"))); return { pos: L3([0, 3, 18], [-2, 2, 14], u), target: [0, 0, 0], fov: 40 }; } },
  { id: "orbit-earth", t0: at(10, "Time"), t1: P(11), scene: (t) => <Space t={t} />,
    cam: (t) => { const u = seg(t, at(10, "Time"), P(11)); return { pos: orbit([0, 0, 0], 30 + 40 * u, 11, 3 - u), target: [0, 0, 0], fov: 42 }; } },
  // 11 · GPS clocks run fast: follow a satellite
  { id: "satellite", t0: P(11), t1: at(11, "Engineers"), scene: (t) => <Space t={t} />,
    cam: (t) => { const s = satPos(t); return { pos: [s[0] * 1.18 + 0.4, s[1] * 1.18 + 0.5, s[2] * 1.18 + 0.9], target: L3(s, [0, 0, 0], 0.15), fov: 50 }; } },
  { id: "limb", t0: at(11, "Engineers"), t1: at(11, "If"), scene: (t) => <Space t={t} sats={8} />,
    cam: (t) => { const u = io(seg(t, at(11, "Engineers"), at(11, "If"))); return { pos: L3([0, 5.6, 6], [3, 5.2, 5], u), target: [0, 2.8, 0], fov: 46 }; } },
  // "the map on your phone would drift": a phone over the day street
  { id: "map", t0: at(11, "If"), t1: P(12), scene: (t) => <><DayStreet t={t} /><Person3D pos={[0, 0, 0.4]} yaw={-0.4} look={HOOD} pose={{ ...STAND, armR: [40, 4, 92], headNod: 22 }} face={{ smile: 0.1 }} /></>,
    cam: (t) => hand({ pos: [1.4, 1.5, 3.4], target: [0, 1.2, 0.4], fov: 40 }, t, 0.01),
    dom: (t) => <Phone2D x={1240} y={560} s={0.95} enter={seg(t, at(11, "If"), at(11, "If") + 0.5)}><MapScreen drift={io(seg(t, at(11, "drift") - 0.2, P(12)))} /></Phone2D> },
  // 12 · forward is physics, back is an argument
  { id: "clock", t0: P(12), t1: P(13), scene: (t) => {
      const rev = t > at(12, "Going", 2);
      return <><Env mood="night" /><ClockFace pos={[0, 0.4, -5]} r={2.7} t={rev ? 2 * at(12, "Going", 2) - t : t} rate={rev ? -18 : 6} />{rev && <SkyCracks t={t - at(12, "arguing")} n={6} stagger={0.12} center={[0, 3, -9]} spread={12} />}</>;
    },
    cam: (t) => { const u = io(seg(t, P(12), P(13))); return shakeC({ pos: [0.5 - u, 0.3, 4.5 - u], target: [0, 0.4, -5], fov: 40, roll: t > at(12, "Going", 2) ? -0.05 : 0 }, t, t > at(12, "arguing") ? 0.03 : 0); } },
  // 13 · Tuesday: late
  { id: "tuesday", t0: P(13), t1: at(13, "You're"), scene: (t) => <><DayStreet t={t} bus={{ x: 12, doors: 0 }} /><Person3D pos={[-4, 0, 0.3]} yaw={RUN_Y} look={HOOD} pose={walk3(t * 1.2)} face={{ smile: 0 }} /></>,
    cam: (t) => { const u = io(seg(t, P(13), at(13, "You're"))); return { pos: L3([-1, 6, 9], [-1, 2.4, 6.5], u), target: [-2, 1, 0], fov: 42 }; } },
  { id: "late", t0: at(13, "You're"), t1: P(14), scene: (t) => <><DayStreet t={t} bus={{ x: 12, doors: 0 }} /><Person3D pos={[-4, 0, 0.3]} yaw={1.2} look={HOOD} pose={{ ...STAND, armR: [42, 4, 95], headNod: 20 }} face={{ smile: 0, open: 0.3, eyesBig: 1 }} /></>,
    cam: (t) => hand({ pos: [-2.6, 1.6, 1.6], target: [-4, 1.45, 0.3], fov: 38 }, t, 0.012) },
  // 14 · the bus doors close; you run; your legs keep going
  { id: "doors", t0: P(14), t1: at(14, "You"), scene: (t) => <DayStreet t={t} bus={{ x: 10, doors: io(seg(t, at(14, "doors"), at(14, "You"))) }} />,
    cam: () => ({ pos: [5.2, 1.5, 0.4], target: [6.4, 1.4, 2.15], fov: 40 }) },
  { id: "run-bus", t0: at(14, "You"), t1: at(14, "something"), scene: (t) => <><DayStreet t={t} bus={{ x: 10 - (t - at(14, "You")) * 2, doors: 1 }} /><Person3D pos={[tueX(t), 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.5)} face={{ smile: 0, brow: -0.5, open: 0.3 }} /></>,
    cam: (t) => hand({ pos: [tueX(t) + 0.3, 1.0, 4.6], target: [tueX(t) + 0.8, 1.0, 1.2], fov: 38 }, t, 0.02) },
  { id: "legs", t0: at(14, "something"), t1: P(15), scene: (t) => <><DayStreet t={t} /><Person3D pos={[tueX(t), 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.5)} /><BodyArcs c={[tueX(t), 0.5, 1.2]} t={t} n={4} amt={seg(t, at(14, "legs"), P(15))} /><Streaks center={[tueX(t), 0.6, 1.2]} t={t} amt={seg(t, at(14, "going"), P(15)) * 0.6} /></>,
    cam: (t) => ({ pos: [tueX(t) + 1.4, 0.35, 2.4], target: [tueX(t), 0.45, 1.2], fov: 40 }) },
  // 15 · the world slows down: pigeon mid-flap, coffee ribbon
  { id: "slow", t0: P(15), t1: at(15, "A"), noBlur: true, grade: "saturate(0.75) contrast(1.05)", scene: (t) => (
      <><DayStreet t={t} /><Person3D pos={[tueX(t), 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(at(15, "The") * 1.5 + (t - P(15)) * 0.05)} /><Pigeon p={PIGEON} flap={1.2} yaw={0.6} /><Person3D pos={MAN} yaw={0.3} look={LOOKS.ex4} pose={{ ...STAND, armR: [60, 6, 70] }} /><Coffee p={CUP} spill={0.15} /></>
    ),
    cam: (t) => { const u = seg(t, P(15), at(15, "A")); return { pos: orbit([tueX(t), 1.1, 1.2], 60 + 50 * u, 3.4, 1.4), target: [tueX(t) + 1, 1.1, 1.2], fov: 42 }; } },
  { id: "pigeon", t0: at(15, "A"), t1: at(15, "A", 2), noBlur: true, grade: "saturate(0.75)", scene: (t) => <><DayStreet t={t} /><Pigeon p={PIGEON} flap={1.2 + (t - at(15, "A")) * 0.3} yaw={0.6} /></>,
    cam: (t) => { const u = io(seg(t, at(15, "A"), at(15, "A", 2))); return { pos: orbit(PIGEON, 20 + 60 * u, 0.9 - 0.2 * u, 2.0), target: PIGEON, fov: 34 }; } },
  { id: "coffee", t0: at(15, "A", 2), t1: P(16), noBlur: true, grade: "saturate(0.75)", scene: (t) => <><DayStreet t={t} /><Person3D pos={MAN} yaw={0.3} look={LOOKS.ex4} pose={{ ...STAND, armR: [60, 6, 70], headNod: 18 }} face={{ open: 0.4, eyesBig: 1 }} /><Coffee p={CUP} spill={0.15 + 0.75 * seg(t, at(15, "floats"), P(16))} tilt={-0.5} /></>,
    cam: (t) => { const u = io(seg(t, at(15, "A", 2), P(16))); return { pos: L3([4.6, 1.35, 0.6], [4.5, 1.3, 0.1], u), target: [CUP[0] + 0.2, CUP[1] + 0.1, CUP[2]], fov: 36 }; } },
  // 16 · a flash: back at the corner, ten seconds ago
  { id: "corner", t0: P(16), t1: at(16, "Ten"), scene: (t) => <><DayStreet t={t} bus={{ x: 12, doors: 0 }} /><Person3D pos={[-4, 0, 0.3]} yaw={0.9} look={HOOD} pose={{ ...STAND, headTurn: 25 * Math.sin((t - P(16)) * 2) }} face={{ open: 0.3, eyesBig: 1 }} />{t < at(16, "And") && <BodyArcs c={[-4, 1.15, 0.3]} t={t} n={6} amt={1} />}</>,
    cam: (t) => hand({ pos: [-1.6, 1.5, 3], target: [-4, 1.2, 0.3], fov: 38 }, t, 0.012) },
  { id: "tensec", t0: at(16, "Ten"), t1: P(17), scene: (t) => <><Env mood="day" /><ClockFace pos={[0, 0.2, -5]} r={2.4} t={t} rate={-30} /></>,
    cam: (t) => ({ pos: [0, 0.2, 3 - seg(t, at(16, "Ten"), P(17))], target: [0, 0.2, -5], fov: 40 }) },
  // 17 · the same pigeon, the same coffee... you catch the cup
  { id: "takeoff", t0: P(17), t1: at(17, "The"), scene: (t) => { const u = seg(t, at(17, "take"), P(17) + 2); return <><DayStreet t={t} /><Pigeon p={[PIGEON[0] + u * 3, PIGEON[1] - 1 + u * 3 + (1 - Math.min(1, u * 4)), PIGEON[2]]} flap={t * 30} yaw={0.6} /></>; },
    cam: () => ({ pos: [1.6, 1.3, 2.6], target: [3, 1.6, 0], fov: 40 }) },
  { id: "spill", t0: at(17, "The"), t1: at(17, "This"), scene: (t) => <><DayStreet t={t} /><Person3D pos={MAN} yaw={0.3} look={LOOKS.ex4} pose={{ ...STAND, armR: [60, 6, 70] }} face={{ open: 0.4, eyesBig: 1 }} /><Coffee p={[CUP[0], CUP[1] - 1.5 * Math.max(0, seg(t, at(17, "spill"), at(17, "This")) ** 2), CUP[2]]} spill={seg(t, at(17, "spill"), at(17, "spill") + 0.4) * 0.8} tilt={-1.2 * seg(t, at(17, "spill"), at(17, "This"))} /></>,
    cam: () => ({ pos: [5.6, 1.3, 1.6], target: [4.0, 1.0, -0.7], fov: 38 }) },
  { id: "catch", t0: at(17, "This"), t1: P(18), scene: (t) => {
      const u = seg(t, at(17, "This"), at(17, "catch") + 0.1);
      return <><DayStreet t={t} /><Person3D pos={MAN} yaw={0.3} look={LOOKS.ex4} pose={{ ...STAND, armR: [60, 6, 70] }} face={{ open: 0.5, eyesBig: 1 }} />
        <Person3D pos={[L3([-1, 0, -0.2], [3.3, 0, -0.35], ex(u * 1.4))[0], 0, -0.35]} yaw={RUN_Y} look={HOOD} pose={mix3(run3(t * 1.6), { ...STAND, armR: [80, 6, 20], lean: 18 }, seg(t, at(17, "catch") - 0.3, at(17, "catch")))} face={{ brow: -0.5, eyesBig: 0.5 }} />
        <Coffee p={[3.95, Math.max(0.65, 1.18 - 2.6 * u * u), -0.62]} spill={0.3} tilt={-0.6} /><BodyArcs c={[3.3, 1.15, -0.35]} t={t} n={4} amt={u < 0.9 ? 1 : 0.2} /></>;
    },
    cam: (t) => { const z = ex(seg(t, at(17, "catch") - 0.1, at(17, "catch") + 0.15)); return shakeC({ pos: [5.2, 1.0, 1.8], target: [3.8, 0.9, -0.6], fov: 44 - 16 * z }, t, z > 0.5 && z < 0.99 ? 0.02 : 0); } },
  // 18 · "okay, okay, okay"
  { id: "okay", t0: P(18), t1: P(19), scene: (t) => <><DayStreet t={t} /><Person3D pos={[3.3, 0, -0.35]} yaw={1.1} look={HOOD} pose={{ ...STAND, armR: [65, 6, 85], headNod: 12 }} face={{ smile: 0.3, open: 0.3 * Math.max(0, Math.sin(t * 14)), eyesBig: 1 }} propR={<mesh position={[0, -0.12, 0.04]}><cylinderGeometry args={[0.045, 0.035, 0.13, 14]} /><meshToonMaterial color="#F1E8D6" /></mesh>} /></>,
    cam: (t) => { const u = io(seg(t, P(18), P(19))); return { pos: L3([4.9, 1.6, 1.3], [4.4, 1.6, 0.8], u), target: [3.3, 1.5, -0.35], fov: 34 }; } },
  // 19 · "so you test it"
  { id: "grin", t0: P(19), t1: P(20), scene: (t) => <><DayStreet t={t} /><Person3D pos={[3.3, 0, -0.35]} yaw={1.3} look={HOOD} pose={{ ...STAND, lean: 4 }} face={{ smile: 1 }} /></>,
    cam: (t) => ({ pos: L3([5.6, 1.5, 0.6], [4.6, 1.55, 0.0], io(seg(t, P(19), P(20)))), target: [3.3, 1.5, -0.35], fov: 32 }) },
  // 20 · the bus: missed it / caught it
  { id: "missed", t0: P(20), t1: at(20, "Run"), scene: (t) => <><DayStreet t={t} bus={{ x: 9 - Math.max(0, t - at(20, "Missed")) * 3.5, doors: 1 }} /><Person3D pos={[4.4, 0, 0.6]} yaw={RUN_Y} look={HOOD} pose={{ ...STAND, armL: [60, 20, 10] }} face={{ open: 0.4 }} /></>,
    cam: () => ({ pos: [9, 1.5, -1.2], target: [5, 1.3, 1.6], fov: 44 }) },
  { id: "caught", t0: at(20, "Run"), t1: P(21), scene: (t) => { const u = seg(t, at(20, "Caught") - 0.4, at(20, "Caught") + 0.3); return <><DayStreet t={t} bus={{ x: 10, doors: 1 - seg(t, at(20, "Run"), at(20, "Run") + 0.4) }} /><Person3D pos={[5.4 + u * 1.0, 0.0 + u * 0.3, 1.0 + u * 1.2]} yaw={0.6} look={HOOD} pose={walk3(t * 1.4)} face={{ smile: 0.9 }} /></>; },
    cam: () => ({ pos: [9.5, 1.5, -0.6], target: [6.2, 1.3, 1.8], fov: 44 }) },
  // 21 · the maths test: wrong / right
  { id: "maths-wrong", t0: P(21), t1: at(21, "Run"), scene: (t) => <Classroom t={t} answer={0} />,
    cam: (t) => { const u = io(seg(t, P(21), at(21, "Run"))); return { pos: L3([5.6, 2.4, 6.8], [4.7, 2.15, 4.7], u), target: [3.8, 0.8, 2.4], fov: 40 }; } },
  { id: "maths-right", t0: at(21, "Run"), t1: P(22), scene: (t) => <Classroom t={t} answer={1} />,
    cam: () => ({ pos: [3.85, 1.65, 2.75], target: [3.8, 0.79, 2.4], fov: 40 }) },
  // 22 · five-a-side: the keeper dives left; run; you shoot right
  { id: "pitch-left", t0: P(22), t1: at(22, "Run"), scene: (t) => {
      const d = seg(t, at(22, "dives"), at(22, "dives") + 0.45);
      return <><Env mood="dusk" /><Pitch /><Person3D pos={[10.6, 0, 0.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.4)} /><Person3D pos={[13.8, 0.1 + 0.4 * Math.sin(d * Math.PI), -1.2 * d]} yaw={-Math.PI / 2} rotX={-1.2 * d} look={LOOKS.keeper} pose={{ ...STAND, armL: [10, 150, 10], armR: [10, 150, 10] }} face={{ open: 0.3 }} /><mesh position={ball(t, false)}><sphereGeometry args={[0.13, 16, 12]} /><meshToonMaterial color="#F4F4F4" /></mesh></>;
    },
    cam: (t) => hand({ pos: [7.6, 1.4, 1.2], target: [13.5, 1.0, 0], fov: 40 }, t, 0.015) },
  { id: "pitch-right", t0: at(22, "Run"), t1: P(23), noBlur: true, scene: (t) => {
      const d = seg(t, at(22, "Run") + 0.1, at(22, "Run") + 0.55);
      return <><Env mood="dusk" /><Pitch /><Person3D pos={[11.0, 0, 0.2]} yaw={RUN_Y} look={HOOD} pose={t > tKick ? { ...run3(0.25), legR: [70, 10], legL: [-20, 20] } : run3(t * 1.4)} face={{ brow: -0.6 }} /><Person3D pos={[13.8, 0.1 + 0.4 * Math.sin(d * Math.PI), -1.2 * d]} yaw={-Math.PI / 2} rotX={-1.2 * d} look={LOOKS.keeper} pose={{ ...STAND, armL: [10, 150, 10], armR: [10, 150, 10] }} />
        <mesh position={ball(t, true)}><sphereGeometry args={[0.13, 16, 12]} /><meshToonMaterial color="#F4F4F4" /></mesh>{t > tKick && <Streaks center={ball(t, true)} t={t} amt={0.3} n={60} />}</>;
    },
    cam: (t) => { const s = t > tKick ? 0.25 : 1; return { pos: L3([9.6, 0.6, 2.6], [12.4, 0.9, 3.4], io(seg(t, tKick, P(23)))), target: L3([12, 0.6, 0.4], [14.6, 1.0, 1.0], io(seg(t, tKick - 0.2, P(23)))), fov: 40 + 0 * s }; } },
  // 23–24 · the coach; "lucky guess"
  { id: "coach", t0: P(23), t1: P(24), scene: (t) => <><Env mood="dusk" /><Pitch /><Person3D pos={[8, 0, -6.5]} yaw={0.3} look={LOOKS.coach} pose={{ ...STAND, armR: [40, 20, 80] }} face={{ open: Math.max(0, Math.sin(t * 15)) * 0.5, eyesBig: 0.6 }} /></>,
    cam: () => ({ pos: [8.9, 1.6, -4.4], target: [8, 1.5, -6.5], fov: 34 }) },
  { id: "lucky", t0: P(24), t1: P(25), scene: (t) => <><Env mood="dusk" /><Pitch /><Person3D pos={[12, 0, 1.2]} yaw={-2.6} look={HOOD} pose={{ ...STAND, armL: [30, 50, 60], armR: [30, 50, 60] }} face={{ smile: 0.8 }} /></>,
    cam: () => ({ pos: [11.0, 1.6, -0.6], target: [12, 1.5, 1.2], fov: 34 }) },
  // 25 · three tests, three wins, breathing like a marathon
  { id: "panting", t0: P(25), t1: P(26), scene: (t) => <><Env mood="dusk" /><Pitch /><Person3D pos={[12, 0, 1.2]} yaw={-2.2} look={HOOD} pose={{ ...STAND, lean: 38, armL: [40, 4, 10], armR: [40, 4, 10], bob: -0.05 + 0.02 * Math.sin(t * 9) }} face={{ open: 0.4 + 0.3 * Math.sin(t * 9), eyesBig: 0.3 }} /></>,
    cam: (t) => { const u = io(seg(t, P(25), P(26))); return { pos: orbit([12, 1, 1.2], 210 - 40 * u, 2.6, 1.3), target: [12, 1.0, 1.2], fov: 38 }; } },
  // 26 · the cost: furnace, four breakfasts, eleven hours, hungry
  { id: "furnace", t0: P(26), t1: at(26, "You"), scene: (t) => <><Kitchen bowls={1} /><Person3D pos={[0.9, 0, 0.9]} yaw={-0.6} look={HOOD} pose={{ ...STAND, armR: [60, 6, 100] }} face={{ smile: 0.2 }} /><pointLight position={[0.9, 0.7, 1.5]} color="#FF8A4A" intensity={2 + Math.sin(t * 20)} distance={2.2} /></>,
    cam: (t) => ({ pos: L3([2.6, 1.7, 3.2], [2.0, 1.6, 2.4], io(seg(t, P(26), at(26, "You")))), target: [0.6, 1.2, 0.6], fov: 40 }) },
  { id: "breakfasts", t0: at(26, "You"), t1: at(26, "You", 2), scene: (t) => <><Kitchen bowls={Math.min(4, 1 + Math.floor((t - at(26, "four")) * 6) + (t > at(26, "four") ? 0 : -1) + 1)} /><Person3D pos={[0, 0, 1.0]} yaw={Math.PI} look={HOOD} pose={{ ...SIT, armR: [60, 6, 100], headNod: 20 }} face={{ smile: 0.5, open: Math.max(0, Math.sin(t * 10)) * 0.3 }} /></>,
    cam: () => ({ pos: [0.2, 2.3, -1.4], target: [0, 0.8, 0.3], fov: 44 }) },
  { id: "sleep", t0: at(26, "You", 2), t1: at(26, "You", 3), scene: (t) => <><Bedroom windowMood={t < at(26, "hours") ? "night" : "day"} /><ambientLight intensity={0.4} /><Person3D pos={[-1.4, 0.82, -0.3]} yaw={0} rotX={-Math.PI / 2} look={HOOD} pose={STAND} face={{ blink: true }} /></>,
    cam: (t) => ({ pos: L3([0.6, 2.6, 1.2], [0.2, 2.2, 0.6], io(seg(t, at(26, "You", 2), at(26, "You", 3)))), target: [-1.4, 0.7, -1.5], fov: 44 }) },
  { id: "hungry", t0: at(26, "You", 3), t1: P(27), scene: (t) => <><Kitchen bowls={4} /><Person3D pos={[2.2, 0, -1.6]} yaw={Math.PI * 0.9} look={HOOD} pose={{ ...STAND, lean: 20, armR: [80, 10, 40] }} face={{ open: 0.3 }} /></>,
    cam: () => ({ pos: [0.4, 1.5, 1.5], target: [2.3, 1.2, -2.0], fov: 40 }) },
  // 27 · the lottery... then the only thing you've wanted for a year
  { id: "lottery", t0: P(27), t1: at(27, "Then"), scene: (t) => <><Bedroom windowMood="night" /><ambientLight intensity={0.3} /><Person3D pos={[0.4, 0, 0]} yaw={0.4} look={HOOD} pose={STAND} face={{ smile: 0.3 }} /></>,
    cam: () => ({ pos: [1.2, 1.5, 2.6], target: [0.3, 1.3, 0], fov: 40 }), grade: "blur(6px) brightness(0.7)",
    dom: (t) => <Lottery show={seg(t, at(27, "lottery") - 0.2, at(27, "lottery") + 0.2)} burn={seg(t, at(27, "second") - 0.1, at(27, "Then"))} /> },
  { id: "photo", t0: at(27, "Then"), t1: P(28), scene: (t) => <><Bedroom windowMood="night" /><ambientLight intensity={0.25} /><Person3D pos={[-1.1, 0, -0.4]} yaw={0.6} look={HOOD} pose={{ ...SIT, armR: [60, 4, 100], armL: [60, 4, 100], headNod: 25 }} face={{ smile: 0 }} /><Photo p={[-0.55, 0.98, 0.0]} ry={-2.6} /><pointLight position={[0.2, 1.6, 0.8]} color="#FFC877" intensity={3} distance={4} /></>,
    cam: (t) => { const u = io(seg(t, at(27, "Then"), P(28))); return { pos: L3([0.4, 1.4, 1.6], [-0.3, 1.1, 0.5], u), target: L3([-0.9, 1.1, -0.3], [-0.55, 0.98, 0.0], u), fov: 36 }; } },
];

export const BType: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} at={at(10, "Some")} out={P(11) - 0.1} text="THIS PART IS REAL" y={110} bg={C.cool} />
    <Rise t={t} at={at(10, "Time")} out={P(11) - 0.1} text="Time runs at different speeds in different places." size={64} y={180} w={1200} />
    <Slam t={t} at={at(11, "thirty-eight")} out={at(11, "Engineers") - 0.1} text="+38 μs" size={150} y={170} x={110} align="left" color={C.amber} glow={C.amber} />
    <Rise t={t} at={at(11, "day")} out={at(11, "Engineers") - 0.1} text="faster, every day, up there" size={48} y={340} />
    <Chip t={t} at={at(11, "correct")} out={at(11, "If") - 0.1} text="CORRECTED EVERY DAY" y={110} />
    <Slam t={t} at={at(11, "kilometres")} out={P(12)} text="~10 km / day" size={90} y={130} x={110} align="left" color={C.red} />
    <Rise t={t} at={at(12, "Going")} out={P(13) - 0.1} text="Forward → just physics." size={70} y={150} color={C.cool} />
    <Rise t={t} at={at(12, "Going", 2)} out={P(13) - 0.1} text="Back ← an argument." size={70} y={250} color={C.red} />
    <Chip t={t} at={at(13, "Tuesday")} out={P(14) - 0.1} text="TUESDAY · 08:59" y={110} />
    <Slam t={t} at={at(15, "slows")} out={at(15, "A") - 0.1} text="SLOW." size={160} y={140} color={C.cool} />
    <Slam t={t} at={at(16, "Ten")} out={P(17) - 0.05} text="−10 SECONDS" size={150} y={160} color={C.amber} glow={C.amber} />
    <Chip t={t} at={at(20, "bus")} out={P(21) - 0.1} text="TEST 1 · THE BUS" y={110} />
    <Chip t={t} at={at(20, "Missed")} out={at(20, "Run")} text="MISSED" y={180} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(20, "Caught")} out={P(21) - 0.1} text="CAUGHT" y={180} bg="#3DD68C" />
    <Chip t={t} at={at(21, "maths")} out={P(22) - 0.1} text="TEST 2 · THE MATHS TEST" y={110} />
    <Chip t={t} at={at(22, "Thursday")} out={P(23) - 0.1} text="TEST 3 · FIVE-A-SIDE" y={110} />
    <Slam t={t} at={tKick + 0.5} out={P(23) - 0.05} text="GOAL." size={170} y={140} color={C.amber} glow={C.amber} />
    <Slam t={t} at={at(25, "Three")} out={at(25, "Three", 2) - 0.05} text="3 TESTS" size={130} y={150} />
    <Slam t={t} at={at(25, "Three", 2)} out={at(25, "And")} text="3 WINS" size={130} y={150} color={C.amber} />
    <Rise t={t} at={at(26, "Moving")} out={at(26, "You") - 0.1} text="Moving that fast burns energy like a furnace." size={64} y={150} w={1200} />
    <Slam t={t} at={at(26, "four")} out={at(26, "You", 2) - 0.05} text="×4 BREAKFASTS" size={110} y={140} x={110} align="left" color={C.amber} />
    <Slam t={t} at={at(26, "eleven")} out={at(26, "You", 3) - 0.05} text="11 HOURS" size={130} y={140} x={110} align="left" color={C.cool} />
    <Rise t={t} at={at(27, "only")} out={P(28) + 0.5} text="the only thing you've wanted for a year" size={56} y={880} color={C.amber} />
    {/* flashes: every rewind */}
    <Flash t={t} at={tFlash} max={1} len={0.35} />
    <Flash t={t} at={at(20, "Run")} max={0.85} len={0.3} />
    <Flash t={t} at={at(21, "Run")} max={0.85} len={0.3} />
    <Flash t={t} at={at(22, "Run")} max={0.85} len={0.3} />
  </>
);
