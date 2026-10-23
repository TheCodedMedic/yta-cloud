// Episode 06, part B (beats 31–64): the spotlight effect, leaving, the launderette, grandad across the garden, the trap,
// the interview, the job, back on the 42, the girl with the book, the thought that isn't yours, the teaser.
import React from "react";
import { Person3D, STAND, walk3 } from "../cam3d/Person3D";
import { faceTo, HeldBag, HeldPhone, PHONE_LOOK, sitOn, talkHands } from "../cam3d/Props3D";
import { World3D } from "../cam3d/World3D";
import { ex, hand, io, L3, orbit, RUN_Y, seg, Shot } from "../ep04/core";
import { Crowd, Env, makeCrowd } from "../ep04/Sets";
import { Bus, RiverRoad } from "../ep04/Sets2";
import { Bedroom, Classroom } from "../ep04/Sets3";
import { BODY, C, Chip, Flash, HEAD, Rise, Slam } from "../ep04/Text";
import { CAST, ThoughtCard } from "../epx/Kit";
import { ShopAisle } from "../epx/Sets5";
import { BUS_SIT, CAND, Garden, HeldBook, InterviewRoom, Launderette, PANEL, Spotlight } from "../epx/Sets6";
import { DarkStage } from "../test_pain/common";
import { at, Bus42, END6, GIRL_SEAT, HERO_SEAT, headOf, P, PE, PS, rnd6, Thought } from "./common";

const HERO = CAST.hero;
const HH = headOf(HERO_SEAT), GH = headOf(GIRL_SEAT);
const PHONE_CROWD = makeCrowd(91, 12, -8, 10, -2.6, 3.2);
const SEAT_SIT = sitOn(0.46, { armL: [48, 8, 70], armR: [48, 8, 70] });
const GD_FAR: [number, number, number] = [-10.4, 0, 0.4];
const COLD = "saturate(0.3) contrast(1.25) brightness(0.85)";
const panel = (t: number, focus = 0) => PANEL.map((p, i) => <Person3D key={i} pos={p} yaw={0} look={[CAST.ivw1, CAST.ivw2, CAST.ivw3][i]} pose={i === 1 && t > at(49, "pen") ? { ...SEAT_SIT, armR: [40, 8, 60], handR: "open" } : SEAT_SIT} face={{ smile: i === 1 ? 0.2 + focus * 0.5 : 0.1, eyesBig: focus * 0.4 }} />);
const cand = (pose: object = SEAT_SIT, face: object = {}) => <Person3D pos={CAND} yaw={Math.PI} look={HERO} pose={pose as any} face={{ smile: 0.2, ...face }} />;
const CH = [CAND[0], 1.22, CAND[2]] as [number, number, number];
// the girl on the bus, across the aisle, turned toward you
const girlBus = (t: number, open = 1, face: object = {}) => <Person3D pos={GIRL_SEAT} yaw={t > at(54, "closes") - 0.2 ? 0.25 : Math.PI / 2} look={CAST.girl} pose={sitOn(0.45, { ...PHONE_LOOK, legL: [88, 90], legR: [84, 90], bob: -0.27, headNod: open > 0.5 ? 26 : 0 })} face={{ smile: 0.4, ...face }} propR={<HeldBook open={open} />} />;
const T_HOLD = PE(60) + 0.3, T_FL = PE(60) + 1.9;

export const B6_SHOTS: Shot[] = [
  // 31 · most people aren't listening (everyone on their phone)
  { id: "phones", t0: P(31), t1: P(32), scene: (t) => <><Env mood="day" /><World3D bare lamps={false} nearTrees glow={0.3} /><Person3D pos={[0, 0, 0.4]} yaw={0.3} look={HERO} pose={STAND} face={{ smile: 0.3 }} /><Crowd list={PHONE_CROWD} walk={(i) => ({ dx: (t - P(31)) * (0.4 + rnd6(i) * 0.3), pose: { ...walk3(t * 0.8 + rnd6(i), 0.7), armR: [38, 10, 98], handR: "cradle", wristR: [10, 55], headNod: 24 } })} /></>,
    cam: (t) => ({ pos: L3([3.4, 1.8, 5.4], [2.6, 1.7, 4.6], io(seg(t, P(31), P(32)))), target: [0, 1.3, 0.4], fov: 42 }) },
  // 32 · Cornell, 2000: the embarrassing T-shirt; the room mostly doesn't notice
  { id: "tshirt", t0: P(32), t1: P(33), scene: (t) => { const u = seg(t, P(32), at(32, "The", 2)); return <><Classroom t={t} answer={0} /><Person3D pos={[-4.5 + 3 * u, 0, 3.6]} yaw={RUN_Y} look={{ ...CAST.theo, coat: "#F2E84A", coatDark: "#C8BE2A", hoodie: false }} pose={u < 1 ? walk3(t) : STAND} face={{ smile: 0, brow: 0.8 }} /></>; },
    cam: (t) => ({ pos: L3([-5.2, 2.0, 6.4], [-4.4, 1.9, 5.8], io(seg(t, P(32), P(33)))), target: [-1, 1.0, 1.5], fov: 46 }),
    dom: (t) => <SpotlightBars t={t} /> },
  // 33 · the spotlight effect: on stage, then the light widens on empty seats
  { id: "spotlight", t0: P(33), t1: P(34), scene: (t) => { const w = seg(t, at(33, "Mostly,"), PE(33)); return <><DarkStage /><Spotlight p={[0, 0, 0]} r={1.2 + 2 * w} /><Person3D pos={[0, 0, 0]} yaw={0} look={HERO} pose={STAND} face={{ smile: 0, eyesBig: 0.5 }} />{Array.from({ length: 12 }, (_, i) => <group key={i} position={[-2.75 + (i % 6) * 1.1, 0, 3 + Math.floor(i / 6) * 1.1]}><mesh position={[0, 0.45, 0]}><boxGeometry args={[0.5, 0.06, 0.45]} /><meshToonMaterial color="#8A2A2A" /></mesh><mesh position={[0, 0.75, 0.22]}><boxGeometry args={[0.5, 0.6, 0.06]} /><meshToonMaterial color="#8A2A2A" /></mesh></group>)}</>; },
    cam: (t) => { const u = io(seg(t, P(33), P(34))); return { pos: L3([0.3, 1.7, 2.4], [0.4, 3.2, 7.8], u), target: [0, 1.1, 0.6], fov: 44 }; } },
  // 34 · you are on stage; you leave (suitcase, dusk street)
  { id: "leave", t0: P(34), t1: P(35), scene: (t) => { const x = -(t - P(34)) * 1.1; return <><Env mood="dusk" /><World3D bare lamps nearTrees={false} glow={0.6} /><Person3D pos={[x, 0, 0.4]} yaw={-RUN_Y} look={HERO} pose={{ ...walk3(t * 0.9), armR: [4, 8, 10], handR: "grip", wristR: [0, 80] }} face={{ smile: 0, brow: 0.5 }} propR={<HeldBag col="#3A4A6A" />} /></>; },
    cam: (t) => { const x = -(t - P(34)) * 1.1; return hand({ pos: [x + 3.4, 1.2, 4.0], target: [x, 1.0, 0.4], fov: 40 }, t, 0.015); } },
  // 35 · the flat above the launderette; nights; shopping at 4 a.m.
  { id: "launderette", t0: P(35), t1: at(35, "You"), scene: (t) => <><Env mood="night" /><World3D bare night lamps nearTrees={false} cafe={false} /><Launderette t={t} /></>,
    cam: (t) => ({ pos: L3([3.0, 1.4, 6.5], [2.8, 2.6, 5.8], io(seg(t, P(35), at(35, "You")))), target: [2.6, 3.2, -3.3], fov: 44 }) },
  { id: "nights", t0: at(35, "You"), t1: P(36), scene: (t) => <><ShopAisle /><Person3D pos={[0.6 + (t - at(35, "You")) * 0.6, 0, -0.5]} yaw={RUN_Y} look={HERO} pose={walk3(t, 0.8)} face={{ smile: 0.1 }} /></>, grade: "brightness(0.75) saturate(0.8)",
    cam: (t) => ({ pos: [-2.5 + (t - at(35, "You")) * 0.5, 1.6, 1.0], target: [1.5 + (t - at(35, "You")) * 0.5, 1.1, -0.6], fov: 40 }) },
  // 36 · grandad visits; he sits ten metres away, on purpose, and shouts (garden at dusk)
  { id: "gd-far", t0: P(36), t1: P(37), scene: (t) => <><Garden mood="dusk" /><Person3D pos={GD_FAR} yaw={RUN_Y} look={CAST.grandad} pose={sitOn(0.46)} face={{ smile: 0.5 }} /><mesh position={[GD_FAR[0], 0.44, GD_FAR[2]]}><boxGeometry args={[0.44, 0.04, 0.42]} /><meshToonMaterial color="#F6F1E6" /></mesh><Person3D pos={[0.4, 0, 0.4]} yaw={-RUN_Y} look={HERO} pose={STAND} face={{ smile: 0.6 }} /><mesh position={[0.4, 0.03, 0.4]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[9.88, 10, 96]} /><meshBasicMaterial color="#9FD8FF" toneMapped={false} /></mesh></>,
    cam: (t) => { const u = io(seg(t, P(36), P(37))); return { pos: L3([-5, 6, 8], [-5, 4.5, 7], u), target: [-5, 0.5, 0.4], fov: 52 }; } },
  // 37 · "Everyone's thinking it, lad."
  { id: "gd-shout", t0: P(37), t1: P(38), scene: (t) => <><Garden mood="dusk" /><Person3D pos={GD_FAR} yaw={RUN_Y} look={CAST.grandad} pose={sitOn(0.46, { armL: [80, 30, 110], armR: [80, 30, 110], handL: "open", handR: "open", lean: 10 })} face={{ smile: 0.3, open: 0.35 + Math.max(0, Math.sin(t * 13)) * 0.3 }} /></>,
    cam: (t) => ({ pos: L3([GD_FAR[0] + 1.6, 1.35, 1.2], [GD_FAR[0] + 1.4, 1.32, 1.0], io(seg(t, P(37), P(38)))), target: [GD_FAR[0], 1.2, GD_FAR[2]], fov: 34 }) },
  // 38 · "That's not comforting."
  { id: "not-comforting", t0: P(38), t1: P(39), scene: (t) => <><Garden mood="dusk" /><Person3D pos={[0.4, 0, 0.4]} yaw={-RUN_Y} look={HERO} pose={{ ...STAND, armR: [20, 14, 30], armL: [20, 14, 30], handL: "open", handR: "open" }} face={{ smile: 0.2, brow: 0.5, open: Math.max(0, Math.sin(t * 13)) * 0.3 }} /></>,
    cam: () => ({ pos: [-1.0, 1.55, 1.1], target: [0.4, 1.5, 0.4], fov: 32 }) },
  // 39 · "The thought's not the crime. It's what you do after."
  { id: "gd-crime", t0: P(39), t1: P(40), scene: (t) => <><Garden mood="dusk" /><Person3D pos={GD_FAR} yaw={RUN_Y} look={CAST.grandad} pose={talkHands(t, sitOn(0.46), 0.7)} face={{ smile: 0.1, brow: 0.3, open: Math.max(0, Math.sin(t * 12)) * 0.35 }} /></>,
    cam: (t) => ({ pos: L3([GD_FAR[0] + 2.2, 1.5, -1.0], [GD_FAR[0] + 1.9, 1.45, -0.8], io(seg(t, P(39), P(40)))), target: [GD_FAR[0], 1.2, GD_FAR[2]], fov: 34 }) },
  // 40 · you'll remember that (wide, warm memory grade)
  { id: "gd-remember", t0: P(40), t1: P(41), grade: "sepia(0.25) saturate(0.9)", scene: (t) => <><Garden mood="dusk" /><Person3D pos={GD_FAR} yaw={RUN_Y} look={CAST.grandad} pose={sitOn(0.46)} face={{ smile: 0.4 }} /><Person3D pos={[0.4, 0, 0.4]} yaw={-RUN_Y} look={HERO} pose={STAND} /></>,
    cam: (t) => ({ pos: L3([1.9, 3.6, 2.4], [1.7, 3.2, 1.9], io(seg(t, P(40), P(41)))), target: [-5, 0.6, 0.4], fov: 56 }) },
  // 41 · the trap you built: the quieter you try, the louder it gets (night street, cards grow)
  { id: "trap", t0: P(41), t1: P(42), scene: (t) => { const u = seg(t, P(41), PE(41)); return <><Env mood="night" /><World3D bare night lamps nearTrees={false} cafe={false} /><Person3D pos={[0, 0, 0.4]} yaw={0.2} look={HERO} pose={{ ...STAND, armL: [8, 12, 40], armR: [8, 12, 40], handL: "fist", handR: "fist", headNod: 12 }} face={{ brow: 0.9, blink: true }} /><ThoughtCard p={[0, 1.95, 0.4]} text="be quiet be quiet be quiet" pop={1} h={0.1 + 0.12 * u} /></>; },
    cam: (t) => ({ pos: L3([0.6, 1.4, 4.0], [0.4, 1.6, 3.0], io(seg(t, P(41), P(42)))), target: [0, 1.7, 0.4], fov: 44 }) },
  // 42 · the girl with the book, again and again; the whole street hears "they can hear me"
  { id: "repeat", t0: P(42), t1: P(43), scene: (t) => { const n = Math.floor(seg(t, P(42), PE(42)) * 14); const half = t > at(42, "Every", 2); return <><Env mood="night" /><World3D bare night lamps nearTrees={false} cafe={false} /><Person3D pos={[0, 0, 0.4]} yaw={0.2} look={HERO} pose={STAND} face={{ brow: 0.9 }} />{Array.from({ length: n }, (_, k) => <ThoughtCard key={k} p={[Math.sin(k * 2.39) * (0.8 + k * 0.25), 1.2 + (k % 5) * 0.4, 0.4 + Math.cos(k * 2.39) * (0.6 + k * 0.2)]} text={half && k % 2 ? "they can hear me" : "the girl with the book"} pop={1} h={0.16} glow={false} />)}<Crowd list={PHONE_CROWD} walk={(i) => ({ dx: 0, pose: { ...STAND, headTurn: half ? (PHONE_CROWD[i].pos[0] > 0 ? -60 : 60) : 0 } })} /></>; },
    cam: (t) => ({ pos: orbit([0, 1.4, 0.4], 20 + 70 * io(seg(t, P(42), P(43))), 6, 2.4), target: [0, 1.4, 0.4], fov: 46 }) },
  // 43 · the interview: a room, three people, two metres away
  { id: "interview", t0: P(43), t1: P(44), scene: (t) => <><InterviewRoom />{panel(t)}{cand()}</>,
    cam: (t) => ({ pos: L3([3.4, 2.0, 3.6], [2.6, 1.8, 3.0], io(seg(t, P(43), P(44)))), target: [0, 1.0, 0], fov: 42 }) },
  // 44–45 · don't think about the sweating / the money
  { id: "sweating", t0: P(44), t1: P(45), scene: (t) => <><InterviewRoom />{panel(t)}{cand(SEAT_SIT, { brow: 0.8 })}<Thought head={CH} text="Don't think about the sweating." t={t} t0={at(44, "don't")} t1={at(44, "Three") - 0.1} h={0.15} rings={false} dy={0.42} /><Thought head={CH} text="THE SWEATING." t={t} t0={at(44, "Three")} h={0.2} rings={false} dy={0.45} color="#F2B84B" /></>,
    cam: () => ({ pos: [-0.45, 1.95, -2.1], target: [CAND[0], 1.45, CAND[2]], fov: 40 }) },
  { id: "money", t0: P(45), t1: P(46), scene: (t) => <><InterviewRoom />{panel(t, 0.5)}{cand(SEAT_SIT, { brow: 0.9, open: 0.2 })}<Thought head={CH} text="Don't think about the money." t={t} t0={at(45, "don't")} t1={at(45, "Three") - 0.1} h={0.15} rings={false} dy={0.42} /><Thought head={CH} text="THE MONEY." t={t} t0={at(45, "Three")} h={0.2} rings={false} dy={0.45} color="#F2B84B" /></>,
    cam: () => ({ pos: [1.6, 1.45, 2.4], target: [0, 1.25, 0.2], fov: 40 }) },
  // 46 · you nearly walk out; then you remember an old man shouting across a room
  { id: "nearly", t0: P(46), t1: at(46, "Then"), scene: (t) => { const u = io(seg(t, at(46, "nearly"), at(46, "walk"))); return <><InterviewRoom />{panel(t)}<Person3D pos={[CAND[0], 0, CAND[2] + 0.1 * u]} yaw={Math.PI} look={HERO} pose={{ ...SEAT_SIT, bob: (SEAT_SIT.bob ?? 0) * (1 - 0.6 * u), legL: [88 - 50 * u, 90 - 50 * u], legR: [84 - 50 * u, 90 - 50 * u], lean: 4 + 20 * u }} face={{ brow: 0.8 }} /></>; },
    cam: () => ({ pos: [-2.2, 1.5, 1.6], target: [0, 1.2, 0.6], fov: 40 }) },
  { id: "memory-gd", t0: at(46, "Then"), t1: P(47), grade: "sepia(0.5) saturate(0.7)", scene: (t) => <><Garden mood="dusk" /><Person3D pos={GD_FAR} yaw={RUN_Y} look={CAST.grandad} pose={sitOn(0.46, { armL: [80, 30, 110], armR: [80, 30, 110], handL: "open", handR: "open", lean: 10 })} face={{ smile: 0.3, open: 0.4 }} /></>,
    cam: (t) => ({ pos: L3([GD_FAR[0] + 2.4, 1.4, 1.6], [GD_FAR[0] + 1.8, 1.35, 1.2], io(seg(t, at(46, "Then"), P(47)))), target: [GD_FAR[0], 1.2, GD_FAR[2]], fov: 36 }) },
  // 47 · so you stop pushing (slow push on the candidate)
  { id: "stop-pushing", t0: P(47), t1: P(48), scene: (t) => <><InterviewRoom />{panel(t)}{cand(SEAT_SIT, { brow: 0.2, blink: t > at(47, "stop") && t < at(47, "You") })}</>,
    cam: (t) => ({ pos: L3([-0.45, 1.95, -2.2], [-0.42, 1.85, -1.7], io(seg(t, P(47), P(48)))), target: [CAND[0], 1.3, CAND[2]], fov: 36 }) },
  // 48 · the speech: everything, out loud
  { id: "speech", t0: P(48), t1: at(48, "I'll"), scene: (t) => <><InterviewRoom />{panel(t, 0.3)}{cand(talkHands(t, SEAT_SIT, 0.9), { smile: 0.1, brow: 0.6, open: Math.max(0, Math.sin(t * 13)) * 0.35 })}</>,
    cam: (t) => ({ pos: L3([0.45, 1.9, -2.0], [0.42, 1.82, -1.6], io(seg(t, P(48), at(48, "I'll")))), target: [CAND[0], 1.3, CAND[2]], fov: 34 }) },
  { id: "speech-panel", t0: at(48, "I'll"), t1: at(48, "And"), scene: (t) => <><InterviewRoom />{panel(t, 0.6)}{cand(talkHands(t, SEAT_SIT, 0.9))}</>,
    cam: (t) => ({ pos: L3([1.2, 1.45, 2.2], [1.0, 1.42, 1.9], io(seg(t, at(48, "I'll"), at(48, "And")))), target: [0, 1.2, -0.78], fov: 38 }) },
  { id: "speech-end", t0: at(48, "And"), t1: P(49), scene: (t) => <><InterviewRoom />{panel(t, 0.6)}{cand(talkHands(t, SEAT_SIT, 0.5), { smile: 0, brow: 0.9, open: Math.max(0, Math.sin(t * 12)) * 0.3 })}</>,
    cam: (t) => ({ pos: orbit(CH, 160 + 25 * io(seg(t, at(48, "And"), P(49))), 1.4, 1.35), target: CH, fov: 34 }) },
  // 49 · silence; the pen goes down; "We can hear that you mean it."
  { id: "pen-down", t0: P(49), t1: P(50), scene: (t) => <><InterviewRoom />{panel(t, 0.8)}{cand()}</>,
    cam: (t) => ({ pos: L3([1.5, 1.5, 2.0], [1.3, 1.48, 1.75], io(seg(t, P(49), P(50)))), target: [0, 1.2, -0.78], fov: 34 }) },
  // 50 · you get the job (both stand; a handshake across the table)
  { id: "hired", t0: P(50), t1: P(51), scene: (t) => <><InterviewRoom /><Person3D pos={[0, 0, -0.62]} yaw={0} look={CAST.ivw2} pose={{ ...STAND, armR: [72, 6, 20], handR: "grip", wristR: [0, 80] }} face={{ smile: 0.9 }} /><Person3D pos={[0, 0, 0.82]} yaw={Math.PI} look={HERO} pose={{ ...STAND, armR: [72, 6, 20], handR: "grip", wristR: [0, 80] }} face={{ smile: 1 }} /></>,
    cam: (t) => ({ pos: L3([2.0, 1.6, 0.4], [1.8, 1.6, 0.2], io(seg(t, P(50), P(51)))), target: [0, 1.3, 0.1], fov: 40 }) },
  // 51 · the thoughts were never the problem (golden street, crane)
  { id: "never-problem", t0: P(51), t1: P(52), scene: (t) => { const x = (t - P(51)) * 1.1 - 1.5; return <><Env mood="golden" /><World3D bare lamps={false} nearTrees glow={0.3} /><Person3D pos={[x, 0, 0.4]} yaw={RUN_Y} look={HERO} pose={walk3(t, 0.9)} face={{ smile: 0.9 }} /></>; },
    cam: (t) => { const u = io(seg(t, P(51), P(52))); const x = (t - P(51)) * 1.1 - 1.5; return { pos: [x + 2, 1.0 + 3 * u, 4.4 + 2 * u], target: [x, 1.2, 0.4], fov: 42 }; } },
  // 52 · back on the 42, Monday 8:15
  { id: "bus-again", t0: P(52), t1: at(52, "You", 2), scene: (t) => <><Env mood="dawn" /><World3D bare lamps={false} nearTrees glow={0.3} /><Bus p={[-6 + (t - P(52)) * 3.2, 0, 4.2]} yaw={0} /></>,
    cam: (t) => hand({ pos: [4 + (t - P(52)) * 1.0, 1.0, 9], target: [-2 + (t - P(52)) * 3, 1.8, 4.2], fov: 42 }, t, 0.02) },
  { id: "relaxed", t0: at(52, "You", 2), t1: P(53), scene: (t) => <Bus42 t={t} mood="dawn" heroFace={{ smile: 0.6 }} girl={girlBus(t)} />,
    cam: (t) => ({ pos: L3([HH[0] + 1.0, 1.45, 1.0], [HH[0] + 0.85, 1.45, 0.85], io(seg(t, at(52, "You", 2), P(53)))), target: HH, fov: 36 }) },
  // 53 · the girl with the book is there; you think what you always think; the whole bus hears it
  { id: "girl-there", t0: P(53), t1: at(53, "The", 2), scene: (t) => <><Bus42 t={t} mood="dawn" turn={0} heroFace={{ smile: 0.5 }} girl={girlBus(t)} /><Thought head={HH} text="I really hope she talks to me today." t={t} t0={at(53, "You")} h={0.14} rings dy={0.42} /></>,
    cam: (t) => ({ pos: L3([HH[0] + 1.5, 1.6, 0.0], [HH[0] + 1.3, 1.6, 0.0], io(seg(t, P(53), at(53, "The", 2)))), target: [HH[0], 1.35, 0], fov: 42 }) },
  { id: "bus-hears", t0: at(53, "The", 2), t1: P(54), noBlur: true, scene: (t) => <><Bus42 t={t} mood="dawn" turn={ex(seg(t, at(53, "The", 2), at(53, "The", 2) + 0.6))} heroFace={{ smile: 0.4 }} girl={girlBus(t)} /></>,
    cam: () => ({ pos: [5.3, 1.85, 0.1], target: [-2, 1.1, 0.2], fov: 46 }) },
  // 54 · she closes the book
  { id: "closes", t0: P(54), t1: P(55), noBlur: true, scene: (t) => <Bus42 t={t} mood="dawn" turn={1} girl={girlBus(t, 1 - ex(seg(t, at(54, "closes"), at(54, "closes") + 0.4)))} />,
    cam: () => ({ pos: [GH[0] + 0.8, 1.5, GH[2] + 0.75], target: [GH[0] + 0.1, 1.1, GH[2] + 0.1], fov: 38 }) },
  // 55 · "I know. I've heard it every morning since February."
  { id: "girl-line", t0: P(55), t1: P(56), scene: (t) => <Bus42 t={t} mood="dawn" turn={1} girl={girlBus(t, 0, { smile: 0.6, open: Math.max(0, Math.sin(t * 14)) * 0.35 })} />,
    cam: (t) => ({ pos: L3([HH[0] + 0.9, 1.4, 0.85], [HH[0] + 0.8, 1.38, 0.75], io(seg(t, P(55), P(56)))), target: GH, fov: 32 }) },
  // 56 · "Sorry."
  { id: "sorry-bus", t0: P(56), t1: P(57), scene: (t) => <Bus42 t={t} mood="dawn" turn={1} hero={{ ...BUS_SIT, headTurn: 70 }} heroFace={{ smile: 0.2, brow: 0.7, open: 0.25 }} girl={girlBus(t, 0)} />,
    cam: () => ({ pos: [HH[0] + 1.0, 1.45, 0.05], target: HH, fov: 36 }) },
  // 57 · "Don't be. You never heard me."
  { id: "never-heard", t0: P(57), t1: P(58), scene: (t) => <Bus42 t={t} mood="dawn" turn={1} hero={{ ...BUS_SIT, headTurn: 70 }} girl={girlBus(t, 0, { smile: 0.7, open: Math.max(0, Math.sin(t * 14)) * 0.3 })} />,
    cam: () => ({ pos: [HH[0] + 0.9, 1.4, 0.95], target: GH, fov: 32 }) },
  // 58 · and then she thinks something; only you can hear it (slow push between them)
  { id: "she-thinks", t0: P(58), t1: P(59), scene: (t) => <Bus42 t={t} mood="dawn" turn={1} hero={{ ...BUS_SIT, headTurn: 70 }} heroFace={{ eyesBig: seg(t, at(58, "hear"), PE(58)) }} girl={girlBus(t, 0, { smile: 0.4 })} />,
    cam: (t) => ({ pos: L3([HH[0] + 2.2, 1.6, 0.0], [HH[0] + 1.1, 1.45, 0.0], io(seg(t, P(58), P(59)))), target: [HH[0], 1.3, 0], fov: 40 }) },
  // 59 · "Finally." — her thought, amber, small, only near you
  { id: "finally", t0: P(59), t1: P(60), noBlur: true, scene: (t) => <><Bus42 t={t} mood="dawn" turn={1} hero={{ ...BUS_SIT, headTurn: 70 }} heroFace={{ eyesBig: 1, open: 0.2 }} girl={girlBus(t, 0, { smile: 0.8 })} /><ThoughtCard p={[GH[0], GH[1] + 0.42, GH[2]]} text="Finally." pop={seg(t, P(59), P(59) + 0.4)} h={0.15} color="#F2B84B" /></>,
    cam: () => ({ pos: [HH[0] + 1.2, 1.5, 0.0], target: [HH[0], 1.4, 0], fov: 40 }) },
  // 60 · rule two just broke: the whole bus staring; crane up through the roof (hold)
  { id: "rule-broke", t0: P(60), t1: T_HOLD + 1.5, noBlur: true, scene: (t) => <Bus42 t={t} mood="dawn" turn={1} hero={{ ...BUS_SIT, headTurn: 70 }} girl={girlBus(t, 0, { smile: 0.5 })} />,
    cam: (t) => { const u = io(seg(t, P(60), T_HOLD + 1.5)); return { pos: L3([4.5, 1.9, 0.0], [0.0, 2.25, 0.0], u), target: L3([-1.5, 1.1, 0], [-1.7, 0.6, 0], u), fov: 46 + 14 * u }; } },
];
// the teaser: a square of turned heads, the tower, a street lighting up, a hand on a book; Theo, "Everyone on the bus.", PART 2
type Fl = { len: number; scene: (t: number) => React.ReactNode; cam: (t: number) => { pos: [number, number, number]; target: [number, number, number]; fov: number } };
const SQUARE = Array.from({ length: 30 }, (_, i) => ({ p: [(i % 6) * 1.3 - 3.2, 0, Math.floor(i / 6) * 1.3 - 2.6] as [number, number, number], look: (CAST as any)[["ivw1", "mum", "boss", "girl", "theo", "ivw2", "wig", "ivw3"][i % 8]] }));
const FLASHES: Fl[] = [
  { len: 0.42, scene: () => <><Env mood="dusk" /><mesh rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[60, 60]} /><meshToonMaterial color="#5A5A6A" /></mesh>{SQUARE.map((s, i) => <Person3D key={i} pos={s.p} yaw={faceTo([s.p[0], s.p[2]], [5, 5])} look={s.look} pose={STAND} />)}</>, cam: () => ({ pos: [5, 1.8, 5], target: [0, 1.2, 0], fov: 44 }) },
  { len: 0.38, scene: () => <><Env mood="night" /><World3D bare night lamps nearTrees={false} cafe={false} />{SQUARE.slice(0, 10).map((s, i) => <Person3D key={i} pos={[s.p[0] * 1.6, 0, 0.2 + (i % 2) * 1.2]} yaw={faceTo([s.p[0] * 1.6, 0.2], [0, 6])} look={s.look} pose={{ ...STAND, headNod: -25 }} />)}</>, cam: () => ({ pos: [0, 1.6, 6], target: [0, 2.2, 0], fov: 50 }) },
  { len: 0.38, scene: () => <World3D night rewrite={() => ({ k: 1, flash: 1 })} />, cam: () => ({ pos: [12, 6, 16], target: [-6, 4, -4], fov: 44 }) },
  { len: 0.4, scene: () => <><DarkStage /><Person3D pos={[0, 0, 0]} yaw={0} look={CAST.girl} pose={{ ...PHONE_LOOK }} propR={<HeldBook open={0} />} /></>, cam: () => ({ pos: [0.3, 1.25, 0.7], target: [-0.05, 1.05, 0.3], fov: 34 }) },
];
const tea: Shot[] = [];
let tt = T_HOLD + 1.5;
FLASHES.forEach((f, i) => {
  const a = tt;
  tea.push({ id: `flash${i}`, t0: a, t1: a + f.len, grade: COLD, scene: (t) => f.scene(t - a), cam: (t) => f.cam(t - a) });
  tea.push({ id: `gap${i}`, t0: a + f.len, t1: a + f.len + 0.06, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }) });
  tt += f.len + 0.06;
});
tea.push({ id: "how-many-there", t0: Math.max(tt, P(61)), t1: P(62), grade: COLD, scene: (t) => <><Env mood="night" /><World3D bare night nearTrees={false} lamps={false} cafe={false} /><Person3D pos={[0, 0, 0]} yaw={0} look={CAST.theo} pose={STAND} face={{ smile: 0, brow: 0.6, open: Math.max(0, Math.sin(t * 13)) * 0.4 }} /><pointLight position={[0.6, 1.8, 1.2]} color="#BFE6F0" intensity={3} distance={4} /></>,
  cam: () => ({ pos: [0.1, 1.5, 1.5], target: [0, 1.45, 0], fov: 30 }) });
tea.push({ id: "everyone-bus", t0: P(62), t1: PE(62) + 0.3, grade: COLD + " brightness(0.7)", scene: () => <><color attach="background" args={["#020306"]} /><Person3D pos={[0, 0, 0]} yaw={0.3} look={HERO} pose={STAND} face={{ smile: 0, brow: 0.7, open: 0.2 }} /><pointLight position={[1, 2, 1.5]} color="#BFE6FF" intensity={6} distance={5} /><ambientLight intensity={0.05} /></>,
  cam: () => ({ pos: [0.5, 1.55, 1.2], target: [0, 1.52, 0], fov: 30 }) });
tea.push({ id: "part2", t0: PE(62) + 0.3, t1: END6, no3d: true, scene: () => null, cam: () => ({ pos: [0, 0, 5], target: [0, 0, 0], fov: 40 }),
  dom: () => <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #141B3A, #05070F 70%)" }} /> });
B6_SHOTS.push(...tea);

/** Cornell 2000 bars: guessed ~50 % would notice, actually ~23 %. */
const SpotlightBars: React.FC<{ t: number }> = ({ t }) => {
  const a = ex(seg(t, at(32, "guessed"), at(32, "guessed") + 0.6)), b = ex(seg(t, at(32, "Fewer"), at(32, "Fewer") + 0.6));
  if (a <= 0) return null;
  const bar = (label: string, v: number, k: number, col: string) => (
    <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 18 }}>
      <div style={{ width: 230, fontFamily: BODY, fontWeight: 700, fontSize: 30, color: C.cream, textAlign: "right" }}>{label}</div>
      <div style={{ width: 700 * v * k, height: 54, borderRadius: 12, background: col }} />
      <div style={{ fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: col, opacity: k }}>{Math.round(v * 100 * k)}%</div>
    </div>
  );
  return <div style={{ position: "absolute", left: 110, top: 760, padding: "26px 30px", borderRadius: 22, background: "rgba(11,18,38,0.82)" }}>{bar("guessed", 0.5, a, C.amber)}{b > 0 && bar("noticed", 0.23, b, C.cool)}</div>;
};

const Bars: React.FC<{ t: number }> = ({ t }) => (t > T_HOLD + 1.5 && t < PE(62) + 0.3 ? <><div style={{ position: "absolute", left: 0, right: 0, top: 0, height: 110, background: "#000" }} /><div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 110, background: "#000" }} /></> : null);

export const B6Type: React.FC<{ t: number }> = ({ t }) => {
  const sig = ex(seg(t, at(64, "In"), at(64, "In") + 0.6));
  const g = t > PE(62) + 0.3 && t < PE(62) + 0.9 ? Math.floor(t * 30) % 2 : 0;
  return (
    <>
      <Chip t={t} at={at(32, "2000,")} out={P(33) - 0.1} text="GILOVICH ET AL. · CORNELL · 2000" y={110} bg={C.cool} />
      <Chip t={t} at={at(33, "spotlight")} out={P(34) - 0.1} text="THE SPOTLIGHT EFFECT" y={110} bg={C.amber} />
      <Rise t={t} at={at(33, "Mostly,")} out={P(34) - 0.1} text="Mostly, nobody is watching." size={72} y={880} align="center" w={1500} />
      <Chip t={t} at={at(35, "four")} out={P(36) - 0.1} text="04:00" y={110} bg={C.cool} />
      <Chip t={t} at={at(36, "ten")} out={P(37) - 0.1} text="10 METRES · ON PURPOSE" y={110} />
      <Rise t={t} at={at(39, "The")} out={P(40) - 0.05} text="“The thought's not the crime. It's what you do after.”" size={56} y={880} align="center" w={1700} color={C.amber} />
      <Chip t={t} at={at(41, "Rule")} out={P(42) - 0.1} text="RULE 3" y={110} bg={C.red} color={C.cream} />
      <Chip t={t} at={at(43, "interview,")} out={P(44) - 0.1} text="THE INTERVIEW · 2 METRES" y={110} />
      <Rise t={t} at={at(47, "So")} out={P(48) - 0.1} text="You let them hear all of it." size={72} y={880} align="center" w={1500} />
      <Rise t={t} at={at(49, '"We')} out={P(50) - 0.05} text="“We can hear that you mean it.”" size={72} y={860} align="center" w={1700} color={C.amber} />
      <Slam t={t} at={at(50, "job.")} out={P(51) - 0.05} text="HIRED." size={170} y={150} color="#3DD68C" />
      <Rise t={t} at={at(51, "The", 2)} out={P(52) - 0.1} text="The hiding was." size={84} y={880} align="center" w={1500} color={C.amber} />
      <Chip t={t} at={at(52, "Monday,")} out={at(52, "You", 2)} text="BUS 42 · MONDAY 08:15" y={110} />
      <Chip t={t} at={at(55, "February.")} out={P(56)} text="SINCE FEBRUARY" y={110} bg={C.cream} />
      <Slam t={t} at={at(60, "Rule")} out={T_HOLD + 1.4} text="RULE 2 · BROKEN." size={100} y={150} x={110} align="left" color={C.amber} glow={C.amber} />
      <Bars t={t} />
      <div style={{ position: "absolute", inset: 0, transform: g ? "translateX(12px)" : undefined }}>
        <Slam t={t} at={PE(62) + 0.3} out={at(63, "Would") - 0.05} text="PART 2" size={260} y={360} color={C.cream} glow="#7FB8FF" />
        <Rise t={t} at={PE(62) + 0.8} out={at(63, "Would") - 0.05} text="Coming soon." size={60} y={660} align="center" w={1200} color={C.cool} />
      </div>
      <Rise t={t} at={at(63, "Would")} out={at(64, "In") - 0.1} text="Would you want everyone to hear you?" size={84} y={330} align="center" w={1700} hi={{ "you?": C.amber }} />
      <Chip t={t} at={at(63, "Tell")} out={at(64, "In") - 0.1} text="TELL US IN THE COMMENTS" x={960 - 280} y={520} bg={C.cream} color={C.ink} />
      {t > at(64, "In") - 0.05 && <div style={{ position: "absolute", left: 0, right: 0, top: 440, textAlign: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 150, color: C.cream, transform: `scale(${0.7 + 0.3 * sig})`, opacity: sig, textShadow: "0 0 30px rgb(127,180,230), 0 0 80px rgba(127,180,230,0.6)" }}>IN THEORY.</div>}
      <Flash t={t} at={P(59) + 0.05} color="#F2B84B" max={0.25} len={0.3} />
      <Flash t={t} at={PE(62) + 0.3} color="#BFE6F0" max={0.6} len={0.25} />
      {t > END6 - 0.6 && <div style={{ position: "absolute", inset: 0, background: "#000", opacity: seg(t, END6 - 0.6, END6) }} />}
    </>
  );
};
export { HeldPhone, Bedroom, hand, PS };
