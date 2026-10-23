// Episode 05, part D (beats 59–70): dinner, the scar, the punch, the laugh; 2 a.m., Theo's message; the hob in the dark; the teaser.
import React from "react";
import { Person3D, STAND } from "../cam3d/Person3D";
import { faceTo, HeldPhone, PHONE_LOOK, sitOn } from "../cam3d/Props3D";
import { World3D } from "../cam3d/World3D";
import { ex, io, L3, orbit, seg, Shot } from "../ep04/core";
import { Phone2D } from "../ep04/Dom";
import { Env } from "../ep04/Sets";
import { Bedroom, Kitchen } from "../ep04/Sets3";
import { BODY, C, Chip, Flash, HEAD, Rise, Slam } from "../ep04/Text";
import { CAST, Damage, Kid } from "../epx/Kit";
import { Corridor, Hob, PanOnHob } from "../epx/Sets5";
import { at, END5, MIA_S, P, PE, PS, SEAT_E, SEAT_S, TheoMsg, VideoScreen } from "./common";

const HERO = CAST.hero, THEO = CAST.theo;
const TABLE_SIT = sitOn(0.46, { armL: [48, 8, 70], armR: [48, 8, 70] });
const MIA_AT: [number, number, number] = [-0.62, 0, 1.18];
const MIA_YAW = faceTo([MIA_AT[0], MIA_AT[2]], [SEAT_S[0], SEAT_S[2]]);
const COLD = "saturate(0.3) contrast(1.25) brightness(0.85)";
const tPunch = at(63, "punches");
const Dinner: React.FC<{ t: number; mia?: object; hero?: object; heroPose?: object; miaPose?: object; laugh?: number }> = ({ t, mia = {}, hero = {}, heroPose = {}, miaPose = {}, laugh = 0 }) => (
  <>
    <Kitchen sky="#F2B87A" />
    <Person3D pos={SEAT_S} yaw={Math.PI} look={HERO} pose={{ ...TABLE_SIT, ...heroPose, bob: (TABLE_SIT.bob ?? 0) + laugh * 0.015 * Math.sin(t * 22) }} face={{ smile: 0.6, ...hero }} />
    <Kid s={MIA_S} pos={MIA_AT} yaw={MIA_YAW} look={CAST.mia} pose={{ ...STAND, ...miaPose }} face={{ smile: 0.5, ...mia }} />
    <Person3D pos={SEAT_E} yaw={-Math.PI / 2} look={CAST.grandad} pose={{ ...TABLE_SIT, bob: (TABLE_SIT.bob ?? 0) + laugh * 0.012 * Math.sin(t * 19) }} face={{ smile: 0.5 + 0.5 * laugh, open: laugh * 0.4 }} />
  </>
);
// teaser flashes
const T0 = PE(66) + 1.4;
type Flashy = { len: number; scene: (t: number) => React.ReactNode; cam: (t: number) => { pos: [number, number, number]; target: [number, number, number]; fov: number }; dom?: (t: number) => React.ReactNode };
const FLASHES: Flashy[] = [
  { len: 0.36, scene: (t) => <><Kitchen sky="#0A1028" /><Hob heat={1} /><Person3D pos={[-1.35, 0, -1.95]} yaw={Math.PI} look={THEO} pose={{ ...STAND, lean: 10, armR: [52, 4, 18], handR: "flat", wristR: [-30, 80] }} propR={<Damage p={[0, -0.06, 0.03]} t={t} amt={1} s={0.08} />} /></>, cam: () => ({ pos: [-0.3, 1.3, -2.2], target: [-1.2, 0.97, -2.45], fov: 38 }) },
  { len: 0.32, scene: (t) => <><Corridor /><Person3D pos={[0, 0, 2 - t * 3]} yaw={Math.PI} look={CAST.nurse} pose={STAND} /></>, cam: (t) => ({ pos: [0, 1.6, 6 - t * 3], target: [0, 1.2, -6], fov: 44 }) },
  { len: 0.32, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }), dom: (t) => <Phone2D x={960} y={560} s={0.9} ry={-8}><VideoScreen t={t} views={4000000 + t * 900000} /></Phone2D> },
  { len: 0.36, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }), dom: (t) => <MapDots t={t} /> },
];
const MapDots: React.FC<{ t: number }> = ({ t }) => (
  <div style={{ position: "absolute", inset: 0, background: "#0B1226" }}>
    <svg width={1920} height={1080}>
      {Array.from({ length: 30 }, (_, i) => <line key={i} x1={0} y1={i * 40} x2={1920} y2={i * 40 + 200 * Math.sin(i)} stroke="#1E2A4A" strokeWidth={i % 4 ? 3 : 10} />)}
      {Array.from({ length: 22 }, (_, i) => <line key={`v${i}`} x1={i * 92} y1={0} x2={i * 92 + 120 * Math.cos(i)} y2={1080} stroke="#1E2A4A" strokeWidth={i % 3 ? 3 : 9} />)}
      {Array.from({ length: 60 }, (_, i) => { const on = (i / 60) < t * 2.2; const x = 300 + ((i * 337) % 1300), y = 150 + ((i * 211) % 780); return on ? <circle key={`d${i}`} cx={x} cy={y} r={10} fill="#FF3A2A" opacity={0.9} /> : null; })}
    </svg>
  </div>
);

export const D_SHOTS: Shot[] = [
  // 59 · dinner; your sister pokes the scar
  { id: "dinner", t0: P(59), t1: at(59, "your"), scene: (t) => <Dinner t={t} />,
    cam: (t) => { const u = io(seg(t, P(59), at(59, "your"))); return { pos: L3([-2.2, 2.2, 3.4], [-1.5, 1.8, 2.8], u), target: [0, 1.0, 0.8], fov: 42 }; } },
  { id: "poke", t0: at(59, "your"), t1: P(60), scene: (t) => { const u = io(seg(t, at(59, "pokes") - 0.3, at(59, "pokes"))); return <Dinner t={t} miaPose={{ armR: [40 + 40 * u, 8, 40 - 30 * u], handR: "point", wristR: [0, 0] }} mia={{ smile: 0.3, eyesBig: 0.5 }} heroPose={{ armL: [30, 30, 40] }} />; },
    cam: () => ({ pos: [0.9, 1.25, 2.2], target: [-0.1, 0.95, 1.08], fov: 34 }) },
  // 60–62 · "Did that hurt?" "No." "Good. Then this won't."
  { id: "did-it-hurt", t0: P(60), t1: P(61), scene: (t) => <Dinner t={t} mia={{ smile: 0.2, brow: 0.4, open: Math.max(0, Math.sin(t * 15)) * 0.45 }} miaPose={{ headNod: -18 }} />,
    cam: () => ({ pos: [0.55, 1.35, 1.95], target: [MIA_AT[0], 1.2, MIA_AT[2]], fov: 34 }) },
  { id: "no", t0: P(61), t1: P(62), scene: (t) => <Dinner t={t} hero={{ smile: 0.8, open: 0.2 }} heroPose={{ headTurn: 35 }} />,
    cam: () => ({ pos: [-0.9, 1.35, 0.35], target: [0, 1.2, 1.08], fov: 34 }) },
  { id: "good", t0: P(62), t1: P(63), scene: (t) => <Dinner t={t} mia={{ smile: 0.9, brow: -0.6, open: Math.max(0, Math.sin(t * 15)) * 0.4 }} miaPose={{ headNod: -18, armR: [20, 10, 100], handR: "fist", wristR: [0, 0] }} />,
    cam: (t) => ({ pos: L3([0.6, 1.35, 2.0], [0.45, 1.3, 1.85], io(seg(t, P(62), P(63)))), target: [MIA_AT[0], 1.15, MIA_AT[2]], fov: 34 }) },
  // 63 · she punches your arm
  { id: "punch", t0: P(63), t1: P(64), noBlur: true, scene: (t) => { const u = ex(seg(t, tPunch - 0.1, tPunch + 0.1)); return <Dinner t={t} miaPose={{ lean: 10 * u, twist: -20 * u, armR: [20 + 65 * u, 10, 100 - 100 * u], handR: "fist", wristR: [0, 0], headNod: -14 }} mia={{ smile: 0.6, brow: -0.8 }} hero={{ smile: 0.8, eyesBig: u > 0.9 ? 0.4 : 0 }} />; },
    cam: (t) => ({ pos: orbit([-0.3, 1.0, 1.15], 175 + 25 * io(seg(t, P(63), P(64))), 1.8, 1.3), target: [-0.3, 1.05, 1.15], fov: 40 }) },
  // 64 · it doesn't hurt. You laugh until it should. (crane up and out of the kitchen)
  { id: "laugh", t0: P(64), t1: P(65), scene: (t) => <Dinner t={t} laugh={1} hero={{ smile: 1, open: 0.45 }} mia={{ smile: 1, open: 0.3 }} />,
    cam: (t) => { const u = io(seg(t, P(64), P(65) + 0.4)); return { pos: L3([0.6, 1.5, 2.4], [1.6, 2.9, 3.6], u), target: [0, 1.0, 0.8], fov: 42 }; } },
  // 65 · 2 a.m. the phone buzzes (bedroom, night)
  { id: "buzz", t0: P(65), t1: P(66), scene: (t) => <><Bedroom windowMood="night" /><ambientLight intensity={0.15} /><Person3D pos={[-1.4, 0.82, -0.3]} yaw={0} rotX={-Math.PI / 2} look={HERO} pose={STAND} face={{ blink: t < at(65, "Two") }} /><group position={[-0.4, 0.62, -2.05]}><mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.07, 0.15]} /><meshBasicMaterial color="#9FD8FF" toneMapped={false} /></mesh><pointLight color="#9FD8FF" intensity={1.5 + Math.sin(t * 30)} distance={2} /></group></>,
    cam: (t) => ({ pos: L3([0.4, 1.8, 0.8], [0.1, 1.6, 0.2], io(seg(t, P(65), P(66)))), target: [-0.9, 0.8, -1.6], fov: 42 }) },
  // 66 · the message, typed out
  { id: "message", t0: P(66), t1: PE(66) + 0.4, scene: () => <><Bedroom windowMood="night" /><ambientLight intensity={0.1} /></>, grade: "blur(6px) brightness(0.6)",
    cam: () => ({ pos: [0.6, 1.5, 1.4], target: [-1.2, 0.8, -1.4], fov: 42 }),
    dom: (t) => <Phone2D x={960} y={560} s={1} enter={seg(t, P(66), P(66) + 0.35)}><TheoMsg typed={seg(t, at(66, '"Mate.'), PE(66) - 0.2)} /></Phone2D> },
  // the hold: the hob in the dark kitchen, the ring glowing, the pan (3 s)
  { id: "hob-dark", t0: PE(66) + 0.4, t1: T0, noBlur: true, scene: (t) => <><Kitchen sky="#0A1028" /><ambientLight intensity={-0.35} /><Hob heat={0.6 + 0.4 * Math.sin(t * 2)} /><PanOnHob t={t} steam={0.3} /></>,
    cam: (t) => ({ pos: L3([-0.4, 1.35, -1.2], [-0.8, 1.2, -1.75], io(seg(t, PE(66) + 0.4, T0))), target: [-1.45, 0.98, -2.45], fov: 34 }) },
  { id: "black", t0: T0, t1: T0 + 0.15, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }) },
];
// teaser: flashes, Theo's line, "How many?", PART 2
const teaser: Shot[] = [];
let tt = T0 + 0.15;
FLASHES.forEach((f, i) => {
  const a = tt;
  teaser.push({ id: `flash${i}`, t0: a, t1: a + f.len, grade: COLD, scene: (t) => f.scene(t - a), cam: (t) => f.cam(t - a), dom: f.dom ? (t) => f.dom!(t - a) : undefined, no3d: !!f.dom });
  teaser.push({ id: `gap${i}`, t0: a + f.len, t1: a + f.len + 0.06, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }) });
  tt += f.len + 0.06;
});
const tFl = tt;
teaser.push({ id: "not-just-me", t0: Math.max(tFl, P(67)), t1: P(68), grade: COLD, scene: (t) => <><Env mood="night" /><World3D bare night nearTrees={false} lamps={false} cafe={false} /><Person3D pos={[0, 0, 0]} yaw={0} look={THEO} pose={STAND} face={{ smile: 0, brow: 0.6, open: Math.max(0, Math.sin(t * 13)) * 0.4 }} /><pointLight position={[0.6, 1.8, 1.2]} color="#BFE6F0" intensity={3} distance={4} /></>,
  cam: () => ({ pos: [0.1, 1.5, 1.5], target: [0, 1.45, 0], fov: 30 }) });
teaser.push({ id: "how-many", t0: P(68), t1: PE(68) + 0.3, grade: COLD + " brightness(0.7)", scene: () => <><color attach="background" args={["#020306"]} /><Person3D pos={[0, 0, 0]} yaw={0.3} look={HERO} pose={STAND} face={{ smile: 0, brow: 0.7, open: 0.2 }} /><pointLight position={[1, 2, 1.5]} color="#BFE6FF" intensity={6} distance={5} /><ambientLight intensity={0.05} /></>,
  cam: () => ({ pos: [0.5, 1.55, 1.2], target: [0, 1.52, 0], fov: 30 }) });
teaser.push({ id: "part2", t0: PE(68) + 0.3, t1: END5, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }),
  dom: () => <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #2A141E, #05070F 70%)" }} /> });
D_SHOTS.push(...teaser);

const Bars: React.FC<{ t: number }> = ({ t }) => (t > T0 && t < PE(68) + 0.3 ? <><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "#000" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "#000" }} /></> : null);

export const DType: React.FC<{ t: number }> = ({ t }) => {
  const sig = ex(seg(t, at(70, "In"), at(70, "In") + 0.6));
  const g = t > PE(68) + 0.3 && t < PE(68) + 0.9 ? Math.floor(t * 30) % 2 : 0;
  return (
    <>
      <Chip t={t} at={at(65, "Two")} out={P(66) - 0.05} text="02:00" y={110} bg={C.cool} />
      <Bars t={t} />
      <div style={{ position: "absolute", inset: 0, transform: g ? "translateX(12px)" : undefined }}>
        <Slam t={t} at={PE(68) + 0.3} out={at(69, "Would") - 0.05} text="PART 2" size={260} y={360} color={C.cream} glow="#FF7A5A" />
        <Rise t={t} at={PE(68) + 0.8} out={at(69, "Would") - 0.05} text="Coming soon." size={60} y={660} align="center" w={1200} color={C.cool} />
      </div>
      <Rise t={t} at={at(69, "Would")} out={at(70, "In") - 0.1} text="Would you take it?" size={100} y={300} align="center" w={1700} hi={{ "it?": C.amber }} />
      <Rise t={t} at={at(69, "No")} out={at(70, "In") - 0.1} text="No pain, ever. No warnings either." size={56} y={440} align="center" w={1600} color={C.cool} />
      <Chip t={t} at={at(69, "Tell")} out={at(70, "In") - 0.1} text="TELL US IN THE COMMENTS" x={960 - 280} y={560} bg={C.cream} color={C.ink} />
      {t > at(70, "In") - 0.05 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: C.cream, letterSpacing: "0.02em", transform: `scale(${0.7 + 0.3 * sig})`, opacity: sig, textShadow: "0 0 30px rgb(255,140,110), 0 0 80px rgba(255,140,110,0.6)" }}>IN THEORY.</div>
      )}
      <Flash t={t} at={tPunch} color="#FFFFFF" max={0.25} len={0.15} />
      <Flash t={t} at={PE(68) + 0.3} color="#FFB0A0" max={0.6} len={0.25} />
      {t > END5 - 0.6 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: seg(t, END5 - 0.6, END5) }} />}
      <span style={{ display: "none", fontFamily: BODY }}>{PS(1)}</span>
    </>
  );
};
export { HeldPhone, PHONE_LOOK, Env, orbit };
