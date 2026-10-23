// Episode 05, part B (beats 17–36): the hot sauce, the dentist, five-a-side, plus/minus, the reflex and the alarm, Jo Cameron.
import React from "react";
import { mix3, Person3D, Pose3, run3, STAND, walk3 } from "../cam3d/Person3D";
import { Chair, CUP_HOLD, faceTo, HeldBox, HeldPhone, PHONE_LOOK, sitOn, talkHands } from "../cam3d/Props3D";
import { ex, hand, io, L3, orbit, rnd, RUN_Y, seg, Shot, shakeC } from "../ep04/core";
import { Phone2D } from "../ep04/Dom";
import { Crowd, Env, makeCrowd, Park } from "../ep04/Sets";
import { Pitch } from "../ep04/Sets2";
import { Bedroom, Classroom, Kitchen } from "../ep04/Sets3";
import { C, Chip, Flash, Rise, Slam } from "../ep04/Text";
import { CAST, Damage, ThoughtCard } from "../epx/Kit";
import { AlarmBell, DENT_HEAD, Dentist, Gym, HeldSauce, Hob, Sauce, ShopAisle } from "../epx/Sets5";
import { at, DarkStage, P, PE, PS, ReflexArc, SEAT_N, SEAT_S, VideoScreen, XRayHero, yawTo } from "./common";

const HERO = CAST.hero, THEO = CAST.theo;
const SAUCE_X = -6.8 + 21 * 0.34;
// lunch table: hero south, Theo north
const heroS = (pose: Pose3, face: object = {}, prop?: React.ReactNode) => <Person3D pos={SEAT_S} yaw={Math.PI} look={HERO} pose={pose} face={face} propR={prop} />;
const theoN = (pose: Pose3, face: object = {}, prop?: React.ReactNode) => <Person3D pos={SEAT_N} yaw={0} look={THEO} pose={pose} face={face} propR={prop} />;
const TABLE_SIT = sitOn(0.46, { armL: [48, 8, 70], armR: [48, 8, 70] });
const SauceTable: React.FC = () => <><Sauce p={[0.25, 0.78, 0.4]} /><mesh position={[-0.2, 0.8, 0.55]}><cylinderGeometry args={[0.13, 0.11, 0.03, 20]} /><meshToonMaterial color="#F6F1E6" /></mesh><mesh position={[-0.2, 0.82, 0.55]}><sphereGeometry args={[0.06, 12, 8]} /><meshToonMaterial color="#D9A050" /></mesh></>;

// five-a-side: the tackle at x ≈ 9, the hero goes down, gets up, fetches the ball from the net (x 14.6), walks to the centre
const tTackle = at(22, "tackle"), tUp = at(22, "get"), tNet = at(22, "net,"), tWalk = at(22, "walk");
const pitchHero = (t: number) => {
  if (t < tTackle + 0.2) return { pos: [8.4 + (t - PS(22)) * 1.2, 0, 0.2] as [number, number, number], yaw: RUN_Y, pose: run3(t * 1.4), rotZ: 0 };
  if (t < tUp) return { pos: [9.6, 0.25, 0.2] as [number, number, number], yaw: RUN_Y, pose: { ...STAND, legL: [20, 30], armL: [40, 60, 30], armR: [30, 40, 20] } as Pose3, rotZ: -1.45 * ex(seg(t, tTackle + 0.2, tTackle + 0.5)) };
  if (t < tWalk) { const u = seg(t, tUp + 0.4, tNet + 0.4); return { pos: [9.6 + 4.6 * u, 0, 0.2] as [number, number, number], yaw: RUN_Y, pose: walk3(t * 1.1), rotZ: 0 }; }
  const u = seg(t, tWalk, PE(22) + 1); return { pos: [14.2 - 6 * u, 0, 0.2] as [number, number, number], yaw: -RUN_Y, pose: { ...walk3(t * 0.9), armR: [30, 10, 80], handR: "grip" } as Pose3, rotZ: 0 };
};
const DEFENDER = { ...CAST.theo, coat: "#2E2E36", coatDark: "#1E1E24", hoodie: false };
const CROWD_PARK = makeCrowd(63, 9, -12, 12, -2.6, 3);

export const B_SHOTS: Shot[] = [
  // 17 · test one: the skull sauce. Dolly down the aisle; he takes it off the shelf
  { id: "aisle", t0: P(17), t1: at(17, "The", 2), scene: (t) => <><ShopAisle /><Person3D pos={[SAUCE_X - 2.4 + 1.4 * io(seg(t, P(17), at(17, "shop"))), 0, -0.7]} yaw={RUN_Y} look={HERO} pose={walk3(t * 1.1)} face={{ smile: 0.6 }} /></>,
    cam: (t) => { const u = io(seg(t, P(17), at(17, "The", 2))); return hand({ pos: L3([SAUCE_X - 5.5, 1.6, 0.9], [SAUCE_X - 2.6, 1.55, 1.0], u), target: [SAUCE_X, 1.2, -1.3], fov: 40 }, t, 0.012); } },
  { id: "skull", t0: at(17, "The", 2), t1: at(17, "Theo"), noBlur: true, scene: () => <><ShopAisle /></>,
    cam: (t) => { const u = io(seg(t, at(17, "The", 2), at(17, "Theo"))); return { pos: L3([SAUCE_X + 0.5, 1.35, -0.6], [SAUCE_X + 0.15, 1.3, -1.05], u), target: [SAUCE_X, 1.31, -1.48], fov: 34 }; } },
  { id: "theo-cries", t0: at(17, "Theo"), t1: P(18), scene: (t) => <><Kitchen /><SauceTable />{heroS(TABLE_SIT, { smile: 0.4 })}{theoN({ ...TABLE_SIT, armR: [70, 20, 120], handR: "open", headNod: -10 }, { smile: 0, open: 0.6 + 0.3 * Math.sin(t * 9), brow: 0.9, blink: true })}{[0, 1].map((k) => <mesh key={k} position={[k ? 0.09 : -0.09, 1.45 - ((t * 1.3 + k * 0.4) % 0.5), -0.3]}><sphereGeometry args={[0.018, 8, 6]} /><meshBasicMaterial color="#9FD8FF" toneMapped={false} /></mesh>)}</>,
    cam: () => ({ pos: [0.45, 1.35, 0.55], target: [0, 1.3, -0.48], fov: 34 }) },
  // 18 · Theo: "Your face isn't even red"
  { id: "theo-red", t0: P(18), t1: P(19), scene: (t) => <><Kitchen /><SauceTable />{heroS(TABLE_SIT, { smile: 0.6 })}{theoN(talkHands(t, TABLE_SIT), { smile: 0.1, brow: 0.6, open: Math.max(0, Math.sin(t * 14)) * 0.45 })}</>,
    cam: (t) => ({ pos: L3([0.95, 1.45, 1.75], [0.85, 1.42, 1.55], io(seg(t, P(18), P(19)))), target: [0, 1.2, -0.48], fov: 32 }) },
  // 19 · "tastes like ketchup"
  { id: "ketchup", t0: P(19), t1: P(20), scene: (t) => <><Kitchen /><SauceTable />{heroS({ ...TABLE_SIT, armR: [58, 10, 100], handR: "grip", wristR: [5, 80] }, { smile: 0.5, open: Math.max(0, Math.sin(t * 14)) * 0.3 }, <HeldSauce />)}</>,
    cam: () => ({ pos: [-0.65, 1.4, -0.35], target: [0, 1.15, 1.08], fov: 36 }) },
  // 20 · test two: the dentist
  { id: "dentist-door", t0: P(20), t1: at(20, "The", 2), scene: (t) => <><Dentist lamp={false} /><Person3D pos={[2.4 - 1.4 * io(seg(t, P(20), at(20, "The", 2))), 0, 1.6]} yaw={-2.2} look={HERO} pose={walk3(t)} face={{ smile: 0.3 }} /><Person3D pos={[-1.0, 0, -1.6]} yaw={0.7} look={CAST.dentist} pose={{ ...STAND, armR: [20, 10, 40], handR: "open" }} face={{ smile: 0.7 }} /></>,
    cam: (t) => ({ pos: L3([-2.8, 1.8, 2.8], [-2.6, 1.7, 2.4], io(seg(t, P(20), at(20, "The", 2)))), target: [0.5, 1.0, 0], fov: 46 }) },
  { id: "three-years", t0: at(20, "The", 2), t1: P(21), scene: (t) => <><Dentist lamp={false} /><Person3D pos={[1.0, 0, 1.0]} yaw={-2.6} look={HERO} pose={{ ...STAND, headNod: 8 }} face={{ smile: 0.2, brow: 0.5 }} /></>,
    cam: (t) => ({ pos: L3([0.1, 1.55, -0.2], [0.25, 1.55, 0.05], io(seg(t, at(20, "The", 2), P(21)))), target: [1.0, 1.5, 1.0], fov: 32 }) },
  // 21 · no injection, no gas: he lies back and thinks about lunch
  { id: "chair", t0: P(21), t1: at(21, "You"), scene: (t) => <><Dentist drill={0} /><Person3D pos={[0, 0, 0.2]} yaw={0} look={HERO} pose={sitOn(0.61, { lean: -32, legL: [62, 24], legR: [60, 24], armL: [30, 14, 40], armR: [30, 14, 40] })} face={{ smile: 0.3 }} /><Person3D pos={[-0.85, 0, 0.35]} yaw={faceTo([-0.85, 0.35], [0, -0.1])} look={CAST.dentist} pose={{ ...STAND, lean: 20, armR: [60, 10, 40], handR: "pinch" }} /></>,
    cam: (t) => ({ pos: L3([1.7, 1.7, 1.9], [1.4, 1.6, 1.5], io(seg(t, P(21), at(21, "You")))), target: [0, 0.95, -0.1], fov: 42 }) },
  { id: "drill", t0: at(21, "You"), t1: P(22), noBlur: true, scene: (t) => <><Dentist drill={seg(t, at(21, "drill") - 0.2, at(21, "go"))} /><Person3D pos={[0, 0, 0.2]} yaw={0} look={HERO} pose={sitOn(0.61, { lean: -32, legL: [62, 24], legR: [60, 24], armL: [30, 14, 40], armR: [30, 14, 40] })} face={{ smile: 0.2, open: 0.3 }} /><ThoughtCard p={[0.45, 1.6, -0.45]} text="…chips? or a wrap?" pop={seg(t, at(21, "think"), at(21, "think") + 0.4)} h={0.16} /></>,
    cam: (t) => ({ pos: L3([0.9, 1.5, 1.2], [0.75, 1.45, 0.95], io(seg(t, at(21, "You"), P(22)))), target: [0.15, 1.35, -0.3], fov: 44 }) },
  // 22 · test three: the tackle, up again, the ball out of the net, the walk back
  { id: "tackle", t0: P(22), t1: tUp, scene: (t) => { const h = pitchHero(t); const d = seg(t, tTackle - 0.4, tTackle + 0.2); return <><Env mood="dusk" /><Pitch /><Person3D pos={h.pos} yaw={h.yaw} rotZ={h.rotZ} look={HERO} pose={h.pose} face={{ brow: -0.5 }} /><Person3D pos={[11.4 - 1.6 * d, d > 0.5 ? 0.2 : 0, 1.2 - 0.9 * d]} yaw={-2.4} rotX={d > 0.5 ? -1.1 : 0} look={DEFENDER} pose={d > 0.5 ? { ...STAND, legR: [80, 10], legL: [10, 20] } : run3(t * 1.4)} /></>; },
    cam: (t) => { const h = pitchHero(t); const s = t > tTackle && t < tTackle + 0.4 ? 0.03 : 0; return shakeC(hand({ pos: [h.pos[0] - 0.8, 1.0, 4.4], target: [h.pos[0] + 0.6, 0.8, 0.4], fov: 40 }, t, 0.02), t, s); } },
  { id: "net", t0: tUp, t1: P(23), scene: (t) => { const h = pitchHero(t); return <><Env mood="dusk" /><Pitch /><Person3D pos={h.pos} yaw={h.yaw} look={HERO} pose={h.pose} face={{ smile: 0.4 }} /><Damage p={[h.pos[0] + 0.1, 0.1, h.pos[2] + 0.06]} t={t} amt={0.9} s={0.09} /><mesh position={t < tWalk ? [15.1, 0.13, 0.2] : [h.pos[0], 0.95, h.pos[2] + 0.35]}><sphereGeometry args={[0.13, 16, 12]} /><meshToonMaterial color="#F4F4F4" /></mesh></>; },
    cam: (t) => { const h = pitchHero(t); return hand({ pos: [h.pos[0] + (t < tWalk ? -2.6 : -3.4), 1.3, 3.2], target: [h.pos[0], 0.9, 0.2], fov: 40 }, t, 0.015); } },
  // 23 · Theo: "Bro. Your ankle is the wrong shape."
  { id: "ankle", t0: P(23), t1: P(24), scene: (t) => <><Env mood="dusk" /><Pitch /><Person3D pos={[8.2, 0, 0.2]} yaw={-RUN_Y} look={HERO} pose={{ ...STAND, armR: [30, 10, 80], handR: "grip" }} face={{ smile: 0.4 }} /><Damage p={[8.2, 0.08, 0.32]} t={t} amt={1} s={0.1} /><Person3D pos={[6.6, 0, 1.2]} yaw={faceTo([6.6, 1.2], [8.2, 0.2])} look={THEO} pose={{ ...STAND, armR: [50, 20, 10], handR: "point", wristR: [0, 0], headNod: 25 }} face={{ smile: 0, brow: 0.8, open: Math.max(0, Math.sin(t * 15)) * 0.4, eyesBig: 0.8 }} /></>,
    cam: (t) => ({ pos: L3([7.0, 1.2, -2.4], [7.2, 1.05, -2.0], io(seg(t, P(23), P(24)))), target: [7.6, 0.55, 0.6], fov: 42 }) },
  // 24 · "feels fine" — thumbs up
  { id: "feels-fine", t0: P(24), t1: P(25), scene: (t) => <><Env mood="dusk" /><Pitch /><Person3D pos={[8.2, 0, 0.2]} yaw={-2.2} look={HERO} pose={{ ...STAND, armR: [62, 18, 95], handR: "thumbsUp", wristR: [0, 90] }} face={{ smile: 1 }} /></>,
    cam: () => ({ pos: [6.9, 1.55, -0.3], target: [8.2, 1.45, 0.2], fov: 32 }) },
  // 25 · and it does. That's the problem. (slow push on the walking ankle)
  { id: "problem", t0: P(25), t1: P(26), scene: (t) => { const x = 8 - (t - P(25)) * 0.9; return <><Env mood="dusk" /><Pitch /><Person3D pos={[x, 0, 0.2]} yaw={-RUN_Y} look={HERO} pose={walk3(t * 0.9)} face={{ smile: 0.6 }} /><Damage p={[x, 0.08, 0.32]} t={t} amt={1} s={0.1} /></>; },
    cam: (t) => { const x = 8 - (t - P(25)) * 0.9; return { pos: [x - 1.5, 0.3, 1.8], target: [x, 0.2, 0.2], fov: 40 }; } },
  // 26 · plus: the gym, a hundred press-ups
  { id: "gym", t0: P(26), t1: P(27), scene: (t) => { const c = 0.5 + 0.5 * Math.sin(t * 6); return <><Gym /><Person3D pos={[0.15, 0.1 + 0.2 * c, 0.9]} yaw={RUN_Y} rotX={Math.PI / 2 - 0.12 - 0.12 * c} look={HERO} pose={{ ...STAND, armL: [92, 8, 60 * (1 - c)], armR: [92, 8, 60 * (1 - c)], handL: "flat", handR: "flat", headNod: -30 }} face={{ smile: 0.8 }} /></>; },
    cam: (t) => { const u = io(seg(t, P(26), P(27))); return { pos: orbit([0.8, 0.4, 0.9], -25 + 40 * u, 2.8, 1.0), target: [0.8, 0.35, 0.9], fov: 42 }; } },
  // 27 · minus: the tongue (canteen = classroom table), Theo points at the blood
  { id: "tongue", t0: P(27), t1: P(28), scene: (t) => <><Kitchen />{heroS({ ...TABLE_SIT, armR: [48, 8, 100], handR: "grip" }, { smile: 0.5, open: 0.2 })}<Damage p={[0, 1.12, 0.87]} t={t} amt={seg(t, at(27, "bite"), at(27, "bite") + 0.3)} s={0.05} />{theoN(t > at(27, "points") ? { ...TABLE_SIT, armR: [80, 10, 10], handR: "point", wristR: [0, 0] } : TABLE_SIT, { smile: 0, eyesBig: t > at(27, "points") ? 1 : 0, open: t > at(27, "points") ? 0.4 : 0 })}</>,
    cam: (t) => ({ pos: L3([-1.9, 1.45, 0.4], [-1.7, 1.42, 0.35], io(seg(t, P(27), P(28)))), target: [0, 1.15, 0.3], fov: 38 }) },
  // 28 · plus: a legend; the video counter climbs
  { id: "legend", t0: P(28), t1: P(29), scene: (t) => <><Env mood="golden" /><Park /><Person3D pos={[0, 0, 0.2]} yaw={0.4} look={HERO} pose={{ ...STAND, armL: [10, 20, 20], armR: [10, 20, 20] }} face={{ smile: 1 }} />{[0, 1, 2, 3].map((k) => { const p: [number, number] = [[-2.4, -1.3, 1.3, 2.4][k], 1.7 + (k % 2) * 0.4]; return <Person3D key={k} pos={[p[0], 0, p[1]]} yaw={faceTo(p, [0, 0.2])} look={(CAST as any)[["theo", "girl", "mia", "ivw3"][k]]} pose={PHONE_LOOK} propR={<HeldPhone />} face={{ smile: 0.6 }} />; })}</>,
    cam: (t) => ({ pos: L3([0.6, 2.5, 5.0], [0.3, 2.3, 4.2], io(seg(t, P(28), P(29)))), target: [-0.4, 1.1, 0.4], fov: 42 }), grade: "brightness(0.8)",
    dom: (t) => <Phone2D x={1400} y={560} s={0.85} ry={-14} enter={seg(t, at(28, "There's") - 0.3, at(28, "There's") + 0.3)}><VideoScreen t={t} views={400000 * ex(seg(t, at(28, "It"), at(28, "views") + 0.3))} /></Phone2D> },
  // 29 · minus: the blister becomes a hole (days pass; walking in the park)
  { id: "blister", t0: P(29), t1: P(30), scene: (t) => { const x = (t - P(29)) * 1.2 - 3; const u = seg(t, at(29, "turns"), at(29, "week")); return <><Env mood={u > 0.5 ? "day" : "dawn"} center={[x, 0, 0]} /><Park /><Person3D pos={[x, 0, 0.2]} yaw={RUN_Y} look={HERO} pose={walk3(t * 1.0)} face={{ smile: 0.6 }} /><Damage p={[x - 0.08, 0.06, 0.12]} t={t} amt={0.4 + 0.6 * u} s={0.05 + 0.07 * u} /><Crowd list={CROWD_PARK} walk={(i) => ({ dx: (t - P(29)) * (0.6 + rnd(i) * 0.4), pose: walk3(t + rnd(i)) })} /></>; },
    cam: (t) => { const x = (t - P(29)) * 1.2 - 3; return hand({ pos: [x - 1.2, 0.25, 1.4], target: [x - 0.05, 0.15, 0.15], fov: 40 }, t, 0.01); } },
  // 30 · the part the movies skip: the hand rests next to the glowing ring
  { id: "movies-skip", t0: P(30), t1: at(30, "Pain"), scene: (t) => <><Kitchen sky="#BFE0FF" /><Hob heat={1} /><Person3D pos={[-1.35, 0, -1.95]} yaw={Math.PI} look={HERO} pose={{ ...STAND, lean: 6, armR: [48, 4, 20], handR: "flat", wristR: [-30, 80], headNod: 20 }} face={{ smile: 0.2 }} /></>,
    cam: (t) => ({ pos: L3([-0.25, 1.3, -2.15], [-0.35, 1.22, -2.3], io(seg(t, P(30), at(30, "Pain")))), target: [-1.2, 0.97, -2.45], fov: 38 }) },
  { id: "only-reason", t0: at(30, "Pain"), t1: P(31), scene: (t) => <><DarkStage tint="#FF9A6A" /><XRayHero t={t} pose={{ ...STAND, armR: [62, 6, 20], handR: "open" }} hand={0.4} /><mesh position={[-0.3, 0.86, 0.6]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.12, 32]} /><meshBasicMaterial color="#FF5A1E" toneMapped={false} /></mesh></>,
    cam: (t) => { const u = io(seg(t, at(30, "Pain"), P(31))); return { pos: L3([1.8, 1.3, 2.6], [1.4, 1.25, 2.1], u), target: [-0.75, 1.05, 0.25], fov: 40 }; } },
  // 31 · the reflex: the pulse runs hand → spine → arm; the arm jerks back in a tenth of a second
  { id: "reflex", t0: P(31), t1: P(32), scene: (t) => { const u = seg(t, at(31, "spine") - 0.1, at(31, "back") + 0.15); const jerk = ex(seg(t, at(31, "back"), at(31, "back") + 0.12)); return <><DarkStage /><XRayHero t={t} pose={mix3({ ...STAND, armR: [62, 6, 20], handR: "open" }, { ...STAND, armR: [10, 20, 110], handR: "open", lean: -4 }, jerk)} /><ReflexArc u={u} /><mesh position={[-0.3, 0.86, 0.6]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[0.06, 0.12, 32]} /><meshBasicMaterial color="#FF5A1E" toneMapped={false} /></mesh></>; },
    cam: (t) => { const u = io(seg(t, P(31), P(32))); return { pos: orbit([-0.15, 1.1, 0.2], -60 - 50 * u, 1.9, 1.35), target: [-0.15, 1.1, 0.2], fov: 40 }; } },
  // 32 · you just ripped the alarm out of the wall
  { id: "alarm", t0: P(32), t1: P(33), noBlur: true, scene: (t) => <><AlarmBell t={t} ripped={ex(seg(t, at(32, "ripped") - 0.05, at(32, "ripped") + 0.35))} ring={t < at(32, "ripped") ? 1 : 0} p={[0, 1.6, -1]} /><ambientLight intensity={0.8} /><directionalLight position={[2, 3, 3]} intensity={1.4} /></>,
    cam: (t) => { const s = t > at(32, "ripped") && t < at(32, "ripped") + 0.3 ? 0.02 : 0; return shakeC({ pos: [0.5, 1.4, 0.6], target: [0, 1.4, -1], fov: 42 }, t, s); } },
  // 33 · Jo Cameron, Scotland: hills, a cottage, a walk with her dog… (park at dawn, misty)
  { id: "jo", t0: P(33), t1: at(33, "A"), scene: (t) => { const x = (t - P(33)) * 0.9 - 2; return <><Env mood="dawn" center={[x, 0, 0]} /><Park /><Person3D pos={[x, 0, 0.2]} yaw={RUN_Y} look={CAST.jo} pose={walk3(t * 0.8, 0.8)} face={{ smile: 0.6 }} /></>; },
    cam: (t) => { const x = (t - P(33)) * 0.9 - 2; return { pos: [x + 3, 1.6, 4.4], target: [x, 1.2, 0.2], fov: 38 }; } },
  { id: "jo-gene", t0: at(33, "A"), t1: P(34), scene: (t) => <><DarkStage tint="#C9A0FF" /><Person3D pos={[0, 0, 0]} yaw={0.3} look={CAST.jo} pose={STAND} face={{ smile: 0.5 }} /></>,
    cam: (t) => ({ pos: orbit([0, 1.2, 0], 20 + 30 * io(seg(t, at(33, "A"), P(34))), 3, 1.4), target: [0, 1.1, 0], fov: 38 }) },
  // 34 · she burns her arm on the oven; she checks her hands every night
  { id: "jo-oven", t0: P(34), t1: at(34, "So"), scene: (t) => <><Kitchen sky="#C9D6E6" /><Hob heat={1} /><Person3D pos={[-1.35, 0, -1.9]} yaw={Math.PI} look={CAST.jo} pose={{ ...STAND, armL: [58, 6, 30], handL: "flat", headNod: 15 }} face={{ smile: 0.3 }} /><Damage p={[-1.12, 1.0, -2.25]} t={t} amt={seg(t, at(34, "burns"), at(34, "burns") + 0.4)} s={0.07} /></>,
    cam: (t) => ({ pos: L3([0.1, 1.5, -2.0], [-0.05, 1.45, -2.15], io(seg(t, P(34), at(34, "So")))), target: [-1.35, 1.15, -2.2], fov: 40 }) },
  { id: "jo-checks", t0: at(34, "So"), t1: P(35), scene: (t) => <><Bedroom windowMood="night" /><ambientLight intensity={0.25} /><Person3D pos={[-1.25, 0, -0.42]} yaw={0.25} look={CAST.jo} pose={sitOn(0.7, { armR: [55, 12, 105], armL: [55, 12, 105], handR: "open", handL: "open", wristR: [-30, 20], wristL: [-30, -20], headNod: 35 })} face={{ smile: 0, brow: 0.3 }} /><pointLight position={[-0.6, 1.5, 0.3]} color="#FFC877" intensity={3} distance={3} /></>,
    cam: (t) => ({ pos: L3([0.2, 1.6, 0.9], [-0.1, 1.55, 0.6], io(seg(t, at(34, "So"), P(35)))), target: [-1.2, 1.1, -0.3], fov: 36 }) },
  // 35 · you have to go looking for it (close on the hands, a small glow found)
  { id: "looking", t0: P(35), t1: P(36), scene: (t) => <><Bedroom windowMood="night" /><ambientLight intensity={0.25} /><Person3D pos={[-1.25, 0, -0.42]} yaw={0.25} look={CAST.jo} pose={sitOn(0.7, { armR: [55, 12, 105], armL: [55, 12, 105], handR: "open", handL: "open", wristR: [-30, 20], wristL: [-30, -20], headNod: 35 })} /><Damage p={[-1.33, 1.08, -0.02]} t={t} amt={seg(t, at(35, "looking") - 0.3, at(35, "looking"))} s={0.04} /><pointLight position={[-0.6, 1.5, 0.3]} color="#FFC877" intensity={3} distance={3} /></>,
    cam: (t) => { const u = io(seg(t, P(35), P(36))); return { pos: L3([-0.2, 1.6, 1.0], [-0.4, 1.5, 0.8], u), target: [-1.25, 1.1, -0.15], fov: 36 }; } },
  // 36 · you stop looking: bed, phone, the glows quietly multiply
  { id: "stop-looking", t0: P(36), t1: P(37), scene: (t) => { const u = seg(t, P(36), P(37)); return <><Bedroom windowMood="day" /><ambientLight intensity={0.6} /><Person3D pos={[-1.25, 0, -0.42]} yaw={0.25} look={HERO} pose={sitOn(0.7, { ...PHONE_LOOK, legL: [88, 70], legR: [84, 70], bob: -0.02 })} face={{ smile: 0.8 }} propR={<HeldPhone />} /><Damage p={[-1.15, 0.1, -0.05]} t={t} amt={u} s={0.06} /><Damage p={[-1.45, 0.55, -0.1]} t={t + 1} amt={u * 0.8} s={0.06} /><Damage p={[-1.0, 1.15, -0.3]} t={t + 2} amt={u * 0.6} s={0.06} /></>; },
    cam: (t) => ({ pos: L3([0.6, 1.4, 1.6], [0.2, 1.5, 1.0], io(seg(t, P(36), P(37)))), target: [-1.2, 1.0, -0.4], fov: 40 }) },
];

export const BType: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} at={at(17, "Test")} out={P(18) - 0.1} text="TEST 1 · THE HOTTEST SAUCE" y={110} />
    <Chip t={t} at={at(20, "Test")} out={P(22) - 0.1} text="TEST 2 · THE DENTIST" y={110} />
    <Chip t={t} at={at(20, "three")} out={P(21) - 0.1} text="3 YEARS AVOIDED" y={180} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(21, "No")} out={at(21, "No", 2)} text="NO INJECTION" y={180} bg={C.cream} />
    <Chip t={t} at={at(21, "No", 2)} out={at(21, "You")} text="NO GAS" y={180} bg={C.cream} />
    <Chip t={t} at={at(22, "Test")} out={P(23) - 0.1} text="TEST 3 · FIVE-A-SIDE" y={110} />
    <Rise t={t} at={at(25, "That's")} out={P(26) - 0.1} text="That's the problem." size={72} y={880} align="center" w={1400} color={C.amber} />
    <Chip t={t} at={at(26, "Plus.")} out={P(27) - 0.1} text="+ PLUS" y={110} bg="#3DD68C" />
    <Slam t={t} at={at(26, "hundred")} out={P(27) - 0.05} text="×100" size={150} y={150} x={110} align="left" color={C.amber} />
    <Chip t={t} at={at(27, "Minus.")} out={P(28) - 0.1} text="− MINUS" y={110} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(28, "Plus.")} out={P(29) - 0.1} text="+ PLUS" y={110} bg="#3DD68C" />
    <Chip t={t} at={at(29, "Minus.")} out={P(30) - 0.1} text="− MINUS" y={110} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(29, "for")} out={P(30) - 0.1} text="7 DAYS" y={180} bg={C.cream} />
    <Rise t={t} at={at(30, "Pain")} out={P(31) - 0.1} text="Pain is the only reason you ever moved your hand." size={60} y={150} w={1300} />
    <Chip t={t} at={at(31, "Touch")} out={P(32) - 0.1} text="THE WITHDRAWAL REFLEX" y={110} bg={C.cool} />
    <Slam t={t} at={at(31, "tenth")} out={at(31, "It's") - 0.05} text="0.1 s" size={170} y={150} x={110} align="left" color={C.cool} glow="#5A8AFF" />
    <Rise t={t} at={at(31, "runs")} out={P(32) - 0.1} text="It runs on the same alarm." size={64} y={880} w={1300} />
    <Chip t={t} at={at(33, "Jo")} out={P(34) - 0.1} text="JO CAMERON · SCOTLAND" y={110} bg={C.cool} />
    <Chip t={t} at={at(33, "2019.")} out={P(34) - 0.1} text="HABIB ET AL. · BJA · 2019" y={180} bg={C.cream} />
    <Rise t={t} at={at(35, "you")} out={P(36) - 0.1} text="You have to go looking for it." size={72} y={880} align="center" w={1500} color={C.amber} />
    <Flash t={t} at={at(32, "ripped")} color="#FF8A6A" max={0.4} len={0.25} />
  </>
);
export { CUP_HOLD, Chair, Classroom, HeldBox, yawTo, PS, ShopAisle };
