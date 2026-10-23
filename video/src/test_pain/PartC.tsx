// Episode 05, part C (beats 37–58): grandad's line, a life with no warnings, Friday night, Theo sees it, the hospital, the lesson.
import React from "react";
import { mix3, Person3D, Pose3, run3, STAND, walk3 } from "../cam3d/Person3D";
import { Chair, faceTo, HeldBox, HeldSpoon, sitOn, talkHands } from "../cam3d/Props3D";
import { World3D } from "../cam3d/World3D";
import { ex, hand, io, L3, orbit, rnd, RUN_Y, seg, Shot, shakeC } from "../ep04/core";
import { Env, Park } from "../ep04/Sets";
import { Car, Pitch, RiverRoad } from "../ep04/Sets2";
import { Bedroom, Kitchen } from "../ep04/Sets3";
import { C, Chip, Flash, Rise, Slam } from "../ep04/Text";
import { CAST, Damage } from "../epx/Kit";
import { AlarmBell, BED, Corridor, Glow, Hospital, Steam } from "../epx/Sets5";
import { at, AT_HOB, DarkStage, P, PE, PS, SEAT_E, SEAT_N, SEAT_S, XRayHero, yawTo } from "./common";

const HERO = CAST.hero, THEO = CAST.theo, GD = CAST.grandad;
const TABLE_SIT = sitOn(0.46, { armL: [48, 8, 70], armR: [48, 8, 70] });
const gdSeat = (pose: Pose3, face: object = {}) => <><Person3D pos={SEAT_E} yaw={-Math.PI / 2} look={GD} pose={pose} face={face} /></>;
const LIMP = (t: number): Pose3 => { const w = walk3(t * 0.8, 0.8); return { ...w, lean: 8, bob: (w.bob ?? 0) - 0.03 * Math.max(0, Math.sin(t * 0.8 * Math.PI * 2)) }; };
const heroLimp = (t: number, t0: number) => { const u = seg(t, t0, t0 + 3.2); return [2.6 - 2.0 * u, 0, 2.6 - 1.4 * u] as [number, number, number]; };
// Friday dinner: hero south, Theo north
const dinnerHero = (t: number, face: object = {}, pose?: Pose3) => <Person3D pos={SEAT_S} yaw={Math.PI} look={HERO} pose={pose ?? TABLE_SIT} face={face} />;
const dinnerTheo = (pose: Pose3, face: object = {}) => <Person3D pos={SEAT_N} yaw={0} look={THEO} pose={pose} face={face} />;
const Plates: React.FC<{ t: number }> = ({ t }) => <>{[[0, 0.62], [0, -0.02]].map(([x, z], i) => <group key={i} position={[x, 0.79, z]}><mesh><cylinderGeometry args={[0.14, 0.12, 0.02, 24]} /><meshToonMaterial color="#F6F1E6" /></mesh><mesh position={[0, 0.03, 0]}><sphereGeometry args={[0.07, 12, 8]} /><meshToonMaterial color={i ? "#C98A3A" : "#D9A050"} /></mesh></group>)}<Steam t={t} amt={0.5} p={[0, 0.85, 0.62]} /></>;
const NIGHT_K = "#16224A";
const doctorAt: [number, number, number] = [0.9, 0, 0.6];

export const C_SHOTS: Shot[] = [
  // 37 · grandad, forty years a nurse; he watches you limp in
  { id: "grandad", t0: P(37), t1: at(37, "He"), scene: (t) => <><Kitchen sky="#FFE0A8" />{gdSeat({ ...TABLE_SIT, armR: [48, 8, 80], handR: "grip" }, { smile: 0.3 })}<Glow p={[1.0, 0.86, 0.32]} s={[0.08, 0.1, 0.08]} c="#F6F1E6" i={0.2} /></>,
    cam: (t) => ({ pos: L3([0.2, 1.4, 0.8], [0.35, 1.4, 0.55], io(seg(t, P(37), at(37, "He")))), target: [SEAT_E[0], 1.25, SEAT_E[2]], fov: 34 }) },
  { id: "limp-in", t0: at(37, "He"), t1: P(38), scene: (t) => { const p = heroLimp(t, at(37, "He")); return <><Kitchen sky="#FFE0A8" />{gdSeat({ ...TABLE_SIT, headTurn: 30 }, { smile: 0, brow: 0.5 })}<Person3D pos={p} yaw={faceTo([2.6, 2.6], [0.6, 1.2])} look={HERO} pose={LIMP(t)} face={{ smile: 0.7 }} /><Damage p={[p[0] - 0.1, 0.1, p[2]]} t={t} amt={0.9} s={0.09} /></>; },
    cam: (t) => hand({ pos: [-1.6, 1.5, 2.8], target: L3([2.2, 1.0, 2.2], [1.0, 1.0, 1.4], io(seg(t, at(37, "He"), P(38)))), fov: 42 }, t, 0.012) },
  // 38 · "Pain's not your enemy, son."
  { id: "gd-line", t0: P(38), t1: P(39), scene: (t) => <><Kitchen sky="#FFE0A8" />{gdSeat(talkHands(t, { ...TABLE_SIT, headTurn: 30 }, 0.6), { smile: 0.2, brow: 0.3, open: Math.max(0, Math.sin(t * 12)) * 0.35 })}<Person3D pos={[0.6, 0, 1.4]} yaw={faceTo([0.6, 1.4], [1.25, 0.3])} look={HERO} pose={STAND} /></>,
    cam: (t) => ({ pos: L3([1.05, 1.5, 2.4], [1.0, 1.48, 2.2], io(seg(t, P(38), P(39)))), target: [SEAT_E[0], 1.2, SEAT_E[2]], fov: 32 }) },
  // 39 · "then I've got one less liar to worry about."
  { id: "liar", t0: P(39), t1: P(40), scene: (t) => <><Kitchen sky="#FFE0A8" /><Person3D pos={[0.6, 0, 1.4]} yaw={faceTo([0.6, 1.4], [1.25, 0.3])} look={HERO} pose={{ ...STAND, armR: [20, 14, 30], armL: [20, 14, 30], handR: "open", handL: "open" }} face={{ smile: 0.9, open: Math.max(0, Math.sin(t * 13)) * 0.3 }} />{gdSeat({ ...TABLE_SIT, headTurn: 30 })}</>,
    cam: () => ({ pos: [2.0, 1.45, -0.05], target: [0.6, 1.45, 1.4], fov: 32 }) },
  // 40 · you'll remember that line (slow push on grandad, warm memory grade)
  { id: "remember", t0: P(40), t1: P(41), grade: "sepia(0.25) saturate(0.9)", scene: () => <><Kitchen sky="#FFE0A8" />{gdSeat({ ...TABLE_SIT, headNod: 6 }, { smile: 0.1, brow: 0.5 })}</>,
    cam: (t) => ({ pos: L3([-0.3, 1.45, 1.1], [0.1, 1.4, 0.8], io(seg(t, P(40), P(41)))), target: [SEAT_E[0], 1.2, SEAT_E[2]], fov: 32 }) },
  // 41 · a life with no warnings: the alarm hangs dead on the wall; crane over the night city
  { id: "no-warnings", t0: P(41), t1: P(42), scene: (t) => <><World3D night /><SkyGlow /></>,
    cam: (t) => { const u = io(seg(t, P(41), P(42))); return { pos: L3([18, 9, 22], [12, 6, 16], u), target: [-6, 3, -6], fov: 44 }; } },
  // 42 · you skip the doctor / sleep on your arm / food too hot
  { id: "sleep-arm", t0: P(42), t1: at(42, "You", 3), scene: (t) => <><Bedroom windowMood={t < at(42, "noon.") ? "night" : "day"} /><ambientLight intensity={0.4} /><Person3D pos={[-1.4, 0.82, -0.3]} yaw={0} rotX={-Math.PI / 2} rotZ={0.6} look={HERO} pose={{ ...STAND, armR: [150, 20, 90] }} face={{ blink: t < at(42, "wake") }} /><Damage p={[-1.62, 0.9, -1.25]} t={t} amt={seg(t, at(42, "sleep"), at(42, "wake"))} s={0.1} /></>,
    cam: (t) => ({ pos: L3([0.6, 2.4, 0.6], [0.2, 2.1, 0.2], io(seg(t, P(42), at(42, "You", 3)))), target: [-1.4, 0.8, -1.2], fov: 44 }) },
  { id: "too-hot", t0: at(42, "You", 3), t1: P(43), scene: (t) => <><Kitchen sky="#FFE0A8" /><Plates t={t} />{dinnerHero(t, { smile: 0.6, open: 0.25 }, { ...TABLE_SIT, armR: [72, 8, 120], handR: "pinch" })}<Damage p={[0, 1.12, 0.87]} t={t} amt={seg(t, at(42, "map"), at(42, "map") + 0.4)} s={0.06} /><Damage p={[0.04, 1.1, 0.86]} t={t + 0.5} amt={seg(t, at(42, "burns"), at(42, "burns") + 0.4)} s={0.04} /></>,
    cam: (t) => ({ pos: L3([0.35, 1.4, -0.3], [0.25, 1.38, -0.1], io(seg(t, at(42, "You", 3), P(43)))), target: [0, 1.18, 1.08], fov: 34 }) },
  // 43 · Theo brings a first-aid kit to football. For you.
  { id: "first-aid", t0: P(43), t1: P(44), scene: (t) => { const x = 2 + (t - P(43)) * 0.8; return <><Env mood="day" /><Pitch /><Person3D pos={[x, 0, 1]} yaw={RUN_Y} look={THEO} pose={{ ...walk3(t), armR: [10, 10, 20], handR: "grip", wristR: [0, 80] }} face={{ smile: 0.2, brow: 0.5 }} propR={<HeldBox col="#F2F4F8" />} /><mesh position={[x + 0.05, 0.62, 1.2]}><boxGeometry args={[0.03, 0.1, 0.03]} /><meshBasicMaterial color="#D9472B" /></mesh><Person3D pos={[x + 1.8, 0, 0.2]} yaw={-2.4} look={HERO} pose={STAND} face={{ smile: 0.8 }} /></>; },
    cam: (t) => { const x = 2 + (t - P(43)) * 0.8; return hand({ pos: [x + 3.6, 1.4, 3.6], target: [x + 0.8, 1.0, 0.6], fov: 38 }, t, 0.015); } },
  // 44 · Friday, around dinner: the stomach goes wrong (x-ray glow over the table)
  { id: "friday", t0: P(44), t1: at(44, "You"), scene: (t) => <><Kitchen sky={NIGHT_K} /><ambientLight intensity={-0.15} /><Plates t={t} />{dinnerHero(t, { smile: 0.5 })}{dinnerTheo(TABLE_SIT, { smile: 0.5, open: Math.max(0, Math.sin(t * 11)) * 0.3 })}</>,
    cam: (t) => { const u = io(seg(t, P(44), at(44, "You"))); return { pos: L3([2.6, 2.2, 2.6], [1.8, 1.8, 2.0], u), target: [0, 1.0, 0.3], fov: 42 }; } },
  { id: "stomach", t0: at(44, "You"), t1: P(45), scene: (t) => <><DarkStage tint="#FF8A6A" /><XRayHero t={t} pose={sitOn(0.46, { armL: [48, 8, 70], armR: [48, 8, 70] })} belly={seg(t, at(44, "You") - 0.2, at(44, "know.", 2))} face={{ smile: 0.5 }} /><Chair p={[0, 0, 0]} yaw={0} /></>,
    cam: (t) => ({ pos: orbit([0, 0.95, 0], 30 - 40 * io(seg(t, at(44, "You"), P(45))), 1.7, 1.1), target: [0, 0.9, 0], fov: 40 }) },
  // 45 · not hungry / cold / nothing: the colour drains on each "notice"
  { id: "drain", t0: P(45), t1: P(46), grade: "", scene: (t) => <><Kitchen sky={NIGHT_K} /><ambientLight intensity={-0.15} /><Plates t={t} />{dinnerHero(t, { smile: 0.2, brow: 0.2, blink: Math.floor(t * 3) % 7 === 0 }, { ...TABLE_SIT, bob: -0.34 + 0.004 * Math.sin(t * 40) * seg(t, at(45, "cold.") - 0.3, PE(45)) })}</>,
    cam: (t) => ({ pos: L3([0.5, 1.4, -0.45], [0.3, 1.38, -0.2], io(seg(t, P(45), P(46)))), target: [0, 1.18, 1.08], fov: 32 }) },
  // 46 · rule three comes back: nobody can tell; you look fine (wide)
  { id: "rule3-back", t0: P(46), t1: P(47), scene: (t) => <><Kitchen sky={NIGHT_K} /><ambientLight intensity={-0.15} /><Plates t={t} />{dinnerHero(t, { smile: 0.6 })}{dinnerTheo(TABLE_SIT, { smile: 0.4 })}</>,
    cam: (t) => ({ pos: L3([-2.6, 1.9, 2.4], [-2.2, 1.7, 2.0], io(seg(t, P(46), P(47)))), target: [0, 1.0, 0.3], fov: 40 }) },
  // 47 · except one person. Theo. He looks across the table
  { id: "theo-sees", t0: P(47), t1: P(48), scene: (t) => <><Kitchen sky={NIGHT_K} /><ambientLight intensity={-0.15} /><Plates t={t} />{dinnerTheo({ ...TABLE_SIT, headNod: -3 }, { smile: 0, brow: 0.6 * seg(t, at(47, "looks"), at(47, "looks") + 0.5) })}{dinnerHero(t, { smile: 0.5 })}</>,
    cam: (t) => ({ pos: L3([1.0, 1.5, 1.9], [0.9, 1.45, 1.6], io(seg(t, P(47), P(48)))), target: [0, 1.18, -0.48], fov: 32 }) },
  // 48 · "You've gone grey."
  { id: "gone-grey", t0: P(48), t1: P(49), scene: (t) => <><Kitchen sky={NIGHT_K} /><ambientLight intensity={-0.15} /><Plates t={t} />{dinnerTheo(talkHands(t, TABLE_SIT, 0.7), { smile: 0, brow: 0.8, open: Math.max(0, Math.sin(t * 14)) * 0.4 })}{dinnerHero(t, { smile: 0.3 })}</>,
    cam: () => ({ pos: [-0.95, 1.45, 1.9], target: [0, 1.18, -0.48], fov: 32 }) },
  // 49 · "I'm fine. Nothing hurts."
  { id: "im-fine", t0: P(49), t1: P(50), grade: "saturate(0.6)", scene: (t) => <><Kitchen sky={NIGHT_K} /><ambientLight intensity={-0.15} /><Plates t={t} />{dinnerHero(t, { smile: 0.5, open: Math.max(0, Math.sin(t * 13)) * 0.3 })}{dinnerTheo(TABLE_SIT)}</>,
    cam: () => ({ pos: [0.95, 1.45, -1.3], target: [0, 1.18, 1.08], fov: 32 }) },
  // 50 · "Yeah. That's what scares me." (tight on Theo)
  { id: "scares-me", t0: P(50), t1: P(51), scene: (t) => <><Kitchen sky={NIGHT_K} /><ambientLight intensity={-0.15} />{dinnerTheo({ ...TABLE_SIT, headNod: 5 }, { smile: 0, brow: 1, open: Math.max(0, Math.sin(t * 12)) * 0.3 })}</>,
    cam: (t) => ({ pos: L3([0.25, 1.3, 0.75], [0.15, 1.28, 0.5], io(seg(t, P(50), P(51)))), target: [0, 1.2, -0.48], fov: 32 }) },
  // 51 · the appendix burst two hours ago (x-ray orbit; the belly glow is huge)
  { id: "appendix", t0: P(51), t1: P(52), scene: (t) => <><DarkStage tint="#FF6A4A" /><XRayHero t={t} pose={STAND} belly={1} face={{ smile: 0.4 }} /><Damage p={[0.06, 0.95, 0.15]} t={t} amt={1} s={0.3} /></>,
    cam: (t) => { const u = io(seg(t, P(51), P(52))); return { pos: orbit([0, 1.0, 0], -20 + 70 * u, 2.2 - 0.5 * u, 1.1), target: [0.05, 0.95, 0.1], fov: 38 }; } },
  // 52 · Theo drives (the car along the river road, night); the doctor at the scan
  { id: "drive", t0: P(52), t1: at(52, "At"), scene: (t) => { const x = (t - P(52)) * 14; return <><Env mood="night" center={[x, 0, 0]} /><RiverRoad t={t} /><Car p={[x, 0, 1.0]} col="#E07A2E" yaw={0} /><spotLight position={[x + 2.2, 0.8, 1.0]} target-position={[x + 14, 0, 1.0]} angle={0.4} penumbra={0.6} intensity={40} distance={30} color="#FFF4D8" /></>; },
    cam: (t) => { const x = (t - P(52)) * 14; return hand({ pos: [x - 5, 2.0, 9.5], target: [x + 1.5, 0.9, 1.0], fov: 38 }, t, 0.02); } },
  { id: "corridor", t0: at(52, "At"), t1: at(52, "looks"), scene: (t) => { const u = seg(t, at(52, "At"), at(52, "looks")); return <><Corridor /><Person3D pos={[0.3, 0, 6 - 5 * u]} yaw={Math.PI} look={THEO} pose={walk3(t * 1.4)} face={{ brow: 0.8 }} /><Person3D pos={[-0.3, 0, 6.3 - 5 * u]} yaw={Math.PI} look={HERO} pose={walk3(t * 1.2)} face={{ smile: 0.4 }} /></>; },
    cam: (t) => { const u = seg(t, at(52, "At"), at(52, "looks")); return { pos: [0, 1.6, 9.5 - 5 * u], target: [0, 1.2, 2 - 5 * u], fov: 42 }; } },
  { id: "scan", t0: at(52, "looks"), t1: P(53), scene: (t) => <><Hospital t={t} /><group position={[-2.0, 1.7, -2.95]}><Glow p={[0, 0, 0]} s={[1.0, 0.75, 0.02]} c="#DDEEFF" i={1.4} /><mesh position={[0, 0, 0.02]}><circleGeometry args={[0.1, 20]} /><meshBasicMaterial color="#FF4A2A" toneMapped={false} /></mesh></group><Person3D pos={[-2.0, 0, -2.0]} yaw={Math.PI} look={CAST.doctor} pose={{ ...STAND, armR: [30, 10, 60], handR: "relaxed" }} face={{ smile: 0 }} /></>,
    cam: (t) => ({ pos: L3([-0.5, 1.6, -1.2], [-0.7, 1.6, -1.5], io(seg(t, at(52, "looks"), P(53)))), target: [-2.3, 1.6, -2.7], fov: 40 }) },
  // 53 · the doctor: "Most people walk in here screaming…"
  { id: "doctor", t0: P(53), t1: P(54), scene: (t) => <><Hospital t={t} /><Person3D pos={doctorAt} yaw={faceTo([doctorAt[0], doctorAt[2]], [0, -0.3])} look={CAST.doctor} pose={talkHands(t, STAND, 0.5)} face={{ smile: 0.2, brow: 0.4, open: Math.max(0, Math.sin(t * 12)) * 0.35 }} /><Person3D pos={[0, 0.82, 0.26]} yaw={0} rotX={-Math.PI / 2} look={HERO} pose={STAND} face={{ smile: 0.2 }} /></>,
    cam: (t) => ({ pos: L3([-0.6, 1.55, -0.5], [-0.45, 1.52, -0.3], io(seg(t, P(53), P(54)))), target: [doctorAt[0], 1.45, doctorAt[2]], fov: 34 }) },
  // 54 · surgery takes an hour, recovery three weeks: window night → day (time-lapse)
  { id: "recovery", t0: P(54), t1: P(55), scene: (t) => <><Hospital t={t} night={t < at(54, "Recovery")} beat={64} /><Person3D pos={[0, 0.82, 0.26]} yaw={0} rotX={-Math.PI / 2} look={HERO} pose={STAND} face={{ blink: t < at(54, "Recovery") }} /></>,
    cam: (t) => { const u = io(seg(t, P(54), P(55))); return { pos: L3([-2.4, 2.5, 2.4], [-1.9, 2.2, 1.9], u), target: [0, 0.8, -0.6], fov: 44 }; } },
  // 55 · but you feel this: grandad in the chair beside the bed
  { id: "bedside", t0: P(55), t1: P(56), scene: (t) => <><Hospital t={t} night={false} beat={64} /><Person3D pos={[0, 0.82, 0.26]} yaw={0} rotX={-Math.PI / 2} look={HERO} pose={STAND} face={{ smile: 0.1, brow: 0.6 }} /><Person3D pos={[-1.2, 0, 0.6]} yaw={1.22} look={GD} pose={sitOn(0.46, { headNod: 10 })} face={{ smile: 0.4 }} /></>,
    cam: (t) => ({ pos: L3([1.3, 1.65, 1.7], [1.1, 1.6, 1.45], io(seg(t, P(55), P(56)))), target: [-0.5, 0.95, -0.2], fov: 40 }) },
  // 56 · pain was the alarm; somebody watching for the smoke (the bell back on the wall; Theo at the door)
  { id: "alarm-back", t0: P(56), t1: at(56, "And"), scene: (t) => <><AlarmBell t={t} ring={t > at(56, "alarm.") ? 0.6 : 0} p={[0, 1.6, -1]} /><ambientLight intensity={0.8} /><directionalLight position={[2, 3, 3]} intensity={1.4} /></>,
    cam: (t) => ({ pos: L3([0.9, 1.3, 1.6], [0.5, 1.45, 0.9], io(seg(t, P(56), at(56, "And")))), target: [0, 1.6, -1], fov: 40 }) },
  { id: "watching", t0: at(56, "And"), t1: P(57), scene: (t) => <><Hospital t={t} night={false} beat={64} /><Person3D pos={[0, 0.82, 0.26]} yaw={0} rotX={-Math.PI / 2} look={HERO} pose={STAND} face={{ smile: 0.5 }} /><Person3D pos={[1.0, 0, 1.4]} yaw={faceTo([1.0, 1.4], [0, -0.6])} look={THEO} pose={{ ...STAND, armL: [20, 10, 80] }} face={{ smile: 0.6 }} /></>,
    cam: (t) => ({ pos: L3([-2.0, 1.7, 2.8], [-1.7, 1.65, 2.5], io(seg(t, at(56, "And"), P(57)))), target: [0.2, 1.0, -0.2], fov: 42 }) },
  // 57 · so you change. Not the power. You. (dawn, out of the hospital, crane up)
  { id: "change", t0: P(57), t1: P(58), scene: (t) => { const x = (t - P(57)) * 1.0 - 1; return <><Env mood="dawn" /><World3D bare lamps={false} nearTrees={false} glow={0.3} /><Person3D pos={[x, 0, 0.6]} yaw={RUN_Y} look={HERO} pose={walk3(t * 0.9, 0.8)} face={{ smile: 0.6 }} /></>; },
    cam: (t) => { const u = io(seg(t, P(57), P(58))); const x = (t - P(57)) * 1.0 - 1; return { pos: [x + 1.8, 0.6 + 3.4 * u, 4.4 + 2 * u], target: [x, 1.0, 0.6], fov: 40 }; } },
  // 58 · you check your hands every night; a doctor every month; you let Theo look at you
  { id: "check-hands", t0: P(58), t1: at(58, "You", 2), scene: (t) => <><Bedroom windowMood="night" /><ambientLight intensity={0.25} /><Person3D pos={[-1.25, 0, -0.42]} yaw={0.25} look={HERO} pose={sitOn(0.7, { armR: [55, 12, 105], armL: [55, 12, 105], handR: "open", handL: "open", wristR: [-30, 20], wristL: [-30, -20], headNod: 35 })} face={{ smile: 0.3 }} /><pointLight position={[-0.6, 1.5, 0.3]} color="#FFC877" intensity={3} distance={3} /></>,
    cam: (t) => ({ pos: L3([0.6, 1.7, 1.4], [0.3, 1.65, 1.1], io(seg(t, P(58), at(58, "You", 2)))), target: [-1.2, 1.1, -0.3], fov: 38 }) },
  { id: "checkup", t0: at(58, "You", 2), t1: at(58, "You", 3), scene: (t) => <><Hospital t={t} night={false} /><Person3D pos={[0.4, 0, 1.0]} yaw={faceTo([0.4, 1.0], [-0.6, 0.2])} look={HERO} pose={STAND} face={{ smile: 0.5 }} /><Person3D pos={[-0.6, 0, 0.2]} yaw={faceTo([-0.6, 0.2], [0.4, 1.0])} look={CAST.doctor} pose={talkHands(t, STAND, 0.4)} face={{ smile: 0.6 }} /></>,
    cam: (t) => ({ pos: L3([1.8, 1.6, -0.8], [1.6, 1.6, -0.5], io(seg(t, at(58, "You", 2), at(58, "You", 3)))), target: [-0.1, 1.3, 0.6], fov: 40 }) },
  { id: "theo-looks", t0: at(58, "You", 3), t1: P(59), scene: (t) => <><Env mood="golden" /><Park /><Person3D pos={[0, 0, 0.2]} yaw={faceTo([0, 0.2], [1.1, 0.9])} look={HERO} pose={STAND} face={{ smile: 0.8, open: t > at(58, "believe") ? 0.25 : 0 }} /><Person3D pos={[1.1, 0, 0.9]} yaw={faceTo([1.1, 0.9], [0, 0.2])} look={THEO} pose={talkHands(t, STAND, 0.6)} face={{ smile: 0.3, brow: 0.4, open: Math.max(0, Math.sin(t * 12)) * 0.3 }} /></>,
    cam: (t) => ({ pos: orbit([0.55, 1.4, 0.55], 120 + 30 * io(seg(t, at(58, "You", 3), P(59))), 2.8, 1.5), target: [0.55, 1.35, 0.55], fov: 38 }) },
];

const SkyGlow: React.FC = () => <pointLight position={[0, 20, -20]} color="#3A4A8A" intensity={2} distance={80} />;

export const CType: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} at={at(37, "forty")} out={at(37, "He")} text="NURSE · 40 YEARS" y={110} bg={C.cool} />
    <Rise t={t} at={at(38, "Pain's", 2)} out={P(39) - 0.05} text="“The only friend who never lies to you.”" size={60} y={880} align="center" w={1600} color={C.amber} />
    <Rise t={t} at={at(41, "A")} out={P(42) - 0.1} text="A life with no warnings." size={84} y={460} align="center" w={1600} />
    <Chip t={t} at={at(42, "skip")} out={at(42, "sleep")} text="NO CHECK-UPS" y={110} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(42, "noon.")} out={at(42, "You", 3)} text="DEAD ARM · UNTIL NOON" y={110} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(42, "map")} out={P(43) - 0.1} text="A MAP OF BURNS" y={110} bg={C.red} color={C.cream} />
    <Rise t={t} at={at(43, "For")} out={P(44) - 0.1} text="For you." size={84} y={880} align="center" w={1200} color={C.amber} />
    <Chip t={t} at={at(44, "Friday,")} out={at(44, "You")} text="FRIDAY · 19:30" y={110} />
    <Slam t={t} at={at(45, "hungry.")} out={at(45, "Then")} text="NOT HUNGRY" size={100} y={150} x={110} align="left" color={C.cream} />
    <Slam t={t} at={at(45, "cold.")} out={at(45, "Then", 2)} text="COLD" size={120} y={150} x={110} align="left" color={C.cool} />
    <Slam t={t} at={at(45, "nothing,")} out={at(45, "It")} text="NOTHING" size={130} y={150} x={110} align="left" color="#8090B0" />
    <Chip t={t} at={at(46, "rule")} out={P(47) - 0.1} text="RULE 3 · NOBODY CAN TELL" y={110} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(47, "eleven")} out={at(47, "He", 2)} text="11 YEARS" y={110} bg={C.cream} />
    <Chip t={t} at={at(51, "appendix")} out={P(52) - 0.1} text="APPENDIX · BURST 2 HOURS AGO" y={110} bg={C.red} color={C.cream} />
    <Slam t={t} at={at(51, "Friday.")} out={P(52) - 0.05} text="“A FRIDAY.”" size={110} y={170} x={110} align="left" color={C.amber} />
    <Chip t={t} at={at(54, "Surgery")} out={at(54, "Recovery")} text="SURGERY · 1 HOUR" y={110} bg={C.cool} />
    <Chip t={t} at={at(54, "Recovery")} out={P(55) - 0.1} text="RECOVERY · 3 WEEKS" y={110} bg={C.cool} />
    <Rise t={t} at={at(56, "Pain")} out={at(56, "Pain", 2) - 0.05} text="Pain was never the enemy." size={80} y={150} />
    <Slam t={t} at={at(56, "alarm.")} out={at(56, "And")} text="PAIN WAS THE ALARM." size={100} y={150} x={110} align="left" color={C.red} />
    <Rise t={t} at={at(56, "somebody")} out={P(57) - 0.1} text="Somebody watching for the smoke." size={64} y={880} align="center" w={1500} color={C.amber} />
    <Rise t={t} at={at(57, "You.")} out={P(58) - 0.1} text="Not the power. You." size={84} y={150} />
    <Flash t={t} at={at(54, "Recovery")} color="#FFFFFF" max={0.6} len={0.25} />
  </>
);
export { mix3, run3, ex, shakeC, rnd, HeldSpoon, AT_HOB, PS, PE, BED, yawTo, Park };
