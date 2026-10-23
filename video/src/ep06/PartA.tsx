// Episode 06, part A (beats 1–30): the bus and the wig, the title, the rules, Wegner's white bear, 6,200 thoughts,
// the teacher, the boss, mum, the tests (garden, poker, tinfoil), the pluses and minuses, the girl at the bus stop.
import React from "react";
import { mix3, Person3D, Pose3, STAND, walk3 } from "../cam3d/Person3D";
import { Chair, faceTo, HeldCup, HeldPhone, PHONE_LOOK, sitOn, talkHands, CUP_HOLD } from "../cam3d/Props3D";
import { World3D } from "../cam3d/World3D";
import { ex, hand, io, L3, orbit, RUN_Y, seg, Shot, shakeC } from "../ep04/core";
import { Crowd, Env, makeCrowd, Plaza } from "../ep04/Sets";
import { Bus, BusStop } from "../ep04/Sets2";
import { Bedroom, Classroom, Kitchen, PhotoWall } from "../ep04/Sets3";
import { Rain } from "../ep04/Vfx";
import { C, Chip, Flash, Rise, Slam, Strike } from "../ep04/Text";
import { CAST, GlowBall, Kid, Ripples, ThoughtCard } from "../epx/Kit";
import { Box } from "../epx/Sets5";
import { CafeInterior, Chips, Garden, HeldBook, HeldCards, WhiteBear } from "../epx/Sets6";
import { at, Bus42, HERO_SEAT, headOf, P, PE, PS, rnd6, Thought, WIG_SEAT } from "./common";
import { DarkStage } from "../ep05/common";

const HERO = CAST.hero;
const HH = headOf(HERO_SEAT), WH = headOf(WIG_SEAT);
const tTurn = at(3, "turns");
const turnU = (t: number) => ex(seg(t, tTurn - 0.1, tTurn + 0.5));
const STREET_CROWD = makeCrowd(81, 14, -8, 14, -2.6, 3.4);
const RING_CROWD = Array.from({ length: 12 }, (_, i) => ({ pos: [Math.sin(i / 12 * Math.PI * 2) * 3.4, 0, Math.cos(i / 12 * Math.PI * 2) * 3.4] as [number, number, number], look: (CAST as any)[["ivw1", "mum", "boss", "girl", "theo", "ivw2", "wig", "ivw3", "teacher", "jo", "doctor", "nurse"][i]] }));
const randomThoughts = ["Need coffee.", "Is my fly down?", "That dog is so cute.", "Did I lock the door?", "Why is he humming?", "I love this song."];
const MUSTARD = { ...CAST.hero, coat: "#D9A82A", coatDark: "#B0861A", hoodie: false, button: true };
const TABLE_SIT = sitOn(0.46, { armL: [48, 8, 70], armR: [48, 8, 70] });
const tinfoil = (t: number) => ({ ...HERO, earphones: t > at(25, "Headphones.") && t < at(25, "A"), beanie: t > at(25, "Tinfoil,") ? "#D5D9E2" : t > at(25, "hat.") ? "#5A5A66" : undefined });
const GARDEN_HERO = (t: number): [number, number, number] => [-9.9 + 0.55 * io(seg(t, at(22, "One"), at(22, "step"))), 0, 0.2];
const GIRL_STOP: [number, number, number] = [6.6, 0, 0.7];

export const A6_SHOTS: Shot[] = [
  // 1 · the number 42, Monday 8:15: outside, then inside, the wig
  { id: "bus-out", t0: 0, t1: at(1, "The"), scene: (t) => <><Env mood="day" /><World3D bare lamps={false} nearTrees glow={0.3} /><Bus p={[-6 + t * 3.2, 0, 4.2]} yaw={0} /></>,
    cam: (t) => hand({ pos: [6 + t * 1.2, 1.4, 9.5], target: [-1 + t * 3.0, 1.6, 4.2], fov: 42 }, t, 0.02) },
  { id: "bus-in", t0: at(1, "The"), t1: P(2), scene: (t) => <Bus42 t={t} />,
    cam: (t) => { const u = io(seg(t, at(1, "The"), P(2))); return { pos: L3([HERO_SEAT[0] - 0.9, 1.55, 0.95], [HERO_SEAT[0] + 0.2, 1.5, 0.8], u), target: L3([WIG_SEAT[0] + 1, 1.3, 0.3], [WH[0], WH[1] + 0.05, WH[2]], u), fov: 40 - 8 * u }; } },
  // 2 · you think it: the card pops on "That wig is on backwards"
  { id: "think", t0: P(2), t1: P(3), scene: (t) => <><Bus42 t={t} heroFace={{ smile: 0.5, brow: -0.2 }} /><Thought head={HH} text="That wig is on backwards." t={t} t0={at(2, "That")} /></>,
    cam: (t) => ({ pos: L3([HERO_SEAT[0] + 1.1, 1.45, 1.0], [HERO_SEAT[0] + 0.95, 1.5, 0.85], io(seg(t, P(2), P(3)))), target: [HH[0], HH[1] + 0.2, HH[2]], fov: 40 }) },
  // 3 · and the whole bus turns round (from the front, looking back down the aisle)
  { id: "turns", t0: P(3), t1: P(4), noBlur: true, scene: (t) => <><Bus42 t={t} turn={turnU(t)} heroFace={{ smile: 0.4 }} /><Thought head={HH} text="That wig is on backwards." t={t} t0={P(3) - 2} rings={false} /></>,
    cam: (t) => ({ pos: [5.3, 1.85, 0.1], target: [-2, 1.1, 0.2], fov: 46 }) },
  // 4 · forty people, looking at you (POV push down the aisle; then the wig man)
  { id: "forty", t0: P(4), t1: at(4, "The"), scene: (t) => <Bus42 t={t} turn={1} />,
    cam: (t) => { const u = io(seg(t, P(4), at(4, "The"))); return { pos: L3([HH[0] + 0.1, 1.42, 0.1], [HH[0] + 0.6, 1.42, 0.05], u), target: [5, 1.25, 0], fov: 50 }; } },
  { id: "wig-stare", t0: at(4, "The"), t1: P(5), scene: (t) => <Bus42 t={t} turn={1} />,
    cam: (t) => ({ pos: L3([WH[0] - 1.3, 1.5, 0.05], [WH[0] - 1.1, 1.48, 0.1], io(seg(t, at(4, "The"), P(5)))), target: [WH[0], WH[1], WH[2]], fov: 42 }) },
  // 5 · "I didn't say that out loud."
  { id: "out-loud", t0: P(5), t1: P(6), scene: (t) => <Bus42 t={t} turn={1} heroFace={{ smile: 0, brow: 0.8, open: Math.max(0, Math.sin(t * 14)) * 0.35, eyesBig: 0.6 }} hero={{ ...talkHands(t, sitOn(0.45), 0.6) }} />,
    cam: () => ({ pos: [HH[0] + 0.85, 1.4, 0.0], target: HH, fov: 34 }) },
  // 6 · No. You didn't. You didn't have to. (orbit, the rings spreading through the bus)
  { id: "didnt-have-to", t0: P(6), t1: P(7), noBlur: true, scene: (t) => <><Bus42 t={t} turn={1} heroFace={{ smile: 0, brow: 0.6 }} /><Ripples c={HH} age={t - P(6)} max={10} n={4} period={1.8} opacity={0.7} /></>,
    cam: (t) => { const u = io(seg(t, P(6), P(7))); return { pos: [HH[0] + 1.6 - 0.8 * u, 2.1, -0.9 + 0.6 * u], target: [HH[0], 1.0, 0.4], fov: 44 }; } },
  // 7 · title: the hero in a ring of people, all facing him
  { id: "title", t0: P(7), t1: P(8), scene: (t) => <><DarkStage /><Person3D pos={[0, 0, 0]} yaw={0.2} look={HERO} pose={STAND} face={{ smile: 0, eyesBig: 0.6 }} />{RING_CROWD.map((c, i) => <Person3D key={i} pos={c.pos} yaw={faceTo([c.pos[0], c.pos[2]], [0, 0])} look={c.look} pose={STAND} face={{ smile: 0, eyesBig: 0.4 }} />)}<Ripples c={[0, 0, 0]} age={t - P(7)} max={6} n={3} period={2} opacity={0.6} /><ThoughtCard p={[0, 2.1, 0]} text="…" pop={seg(t, P(7) + 0.3, P(7) + 0.7)} h={0.2} /></>,
    cam: (t) => { const u = io(seg(t, P(7), P(8))); return { pos: orbit([0, 1, 0], 20 + 50 * u, 7.5 - 1.5 * u, 3.4 - 1 * u), target: [0, 1.0, 0], fov: 40 }; } },
  // 8 · every thought, out loud, to everyone near you (street walk; cards pop and people turn)
  { id: "every-thought", t0: P(8), t1: P(9), scene: (t) => { const x = (t - P(8)) * 1.2 - 4, k = Math.floor((t - P(8)) / 1.15); return <><Env mood="day" center={[x, 0, 0]} /><World3D bare lamps={false} nearTrees glow={0.3} /><Person3D pos={[x, 0, 0.4]} yaw={RUN_Y} look={HERO} pose={walk3(t * 1.1)} face={{ smile: 0.4 }} /><Thought head={[x, 1.56, 0.4]} text={randomThoughts[k % randomThoughts.length]} t={t} t0={P(8) + k * 1.15} t1={P(8) + k * 1.15 + 1.0} h={0.34} /><Crowd list={STREET_CROWD} walk={(i) => ({ dx: (t - P(8)) * (0.5 + rnd6(i) * 0.4), pose: { ...walk3(t * 0.9 + rnd6(i)), headTurn: 50 * Math.sign(rnd6(i) - 0.5) } })} /></>; },
    cam: (t) => { const x = (t - P(8)) * 1.2 - 4; return hand({ pos: [x + 3.2, 1.8, 5.4], target: [x + 0.6, 1.4, 0.4], fov: 40 }, t, 0.02); } },
  // 9 · rule one: ten metres (top shot over the plaza; the ring, people inside it turn)
  { id: "rule1", t0: P(9), t1: P(10), scene: (t) => { const u = seg(t, at(9, "ten"), at(9, "ten") + 0.8); return <><Env mood="golden" /><Plaza /><Person3D pos={[0, 0, 0.5]} yaw={0} look={HERO} pose={STAND} face={{ smile: 0.3 }} /><GlowBall p={[0, 0.01, 0.5]} r={10 * u} opacity={0.08} /><mesh position={[0, 0.03, 0.5]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[10 * u - 0.12, 10 * u, 96]} /><meshBasicMaterial color="#9FD8FF" toneMapped={false} /></mesh>{RING_CROWD.map((c, i) => { const r = 4 + (i % 4) * 3.2, a = i * 2.1; const p: [number, number] = [Math.sin(a) * r, 0.5 + Math.cos(a) * r]; const inside = r < 10 * u; return <Person3D key={i} pos={[p[0], 0, p[1]]} yaw={inside ? faceTo(p, [0, 0.5]) : a} look={c.look} pose={STAND} face={{ eyesBig: inside ? 0.6 : 0 }} />; })}<Thought head={[0, 1.56, 0.5]} text="Is this thing working?" t={t} t0={at(9, "hears")} rings={false} /></>; },
    cam: (t) => { const u = io(seg(t, P(9), P(10))); return { pos: L3([0.5, 9, 12], [0.4, 26, 6], u), target: [0, 0, 0.5], fov: 50 }; } },
  // 10 · rule two: one way (you and Theo; your card shows, his is empty)
  { id: "rule2", t0: P(10), t1: P(11), scene: (t) => <><Env mood="day" /><World3D bare lamps={false} nearTrees={false} glow={0.3} /><Person3D pos={[-0.6, 0, 0.4]} yaw={faceTo([-0.6, 0.4], [0.6, 0.6])} look={HERO} pose={STAND} face={{ smile: 0.2, brow: 0.4 }} /><Person3D pos={[0.6, 0, 0.6]} yaw={faceTo([0.6, 0.6], [-0.6, 0.4])} look={CAST.theo} pose={STAND} face={{ smile: 0.5 }} /><Thought head={[-0.6, 1.56, 0.4]} text="What's he thinking?" t={t} t0={at(10, "Rule")} rings={false} h={0.18} /><ThoughtCard p={[0.6, 2.05, 0.6]} text="?" pop={seg(t, at(10, "nothing"), at(10, "nothing") + 0.3)} h={0.18} color="#5A6070" ink="#AAB0C0" glow={false} /></>,
    cam: (t) => ({ pos: L3([0.2, 1.7, 3.6], [0.1, 1.75, 3.0], io(seg(t, P(10), P(11)))), target: [0, 1.6, 0.5], fov: 40 }) },
  // 11 · rule three: the harder you try, the louder it gets (bedroom, hands on head, cards multiply and grow)
  { id: "rule3", t0: P(11), t1: P(12), scene: (t) => { const n = Math.min(7, Math.floor(seg(t, at(11, "harder"), at(11, "louder") + 0.6) * 8)); return <><Bedroom windowMood="day" /><ambientLight intensity={0.5} /><Person3D pos={[0.3, 0, 0.2]} yaw={0.3} look={HERO} pose={{ ...STAND, armL: [8, 12, 40], armR: [8, 12, 40], handL: "fist", handR: "fist", headNod: 14 }} face={{ smile: 0, brow: 0.8, blink: true }} />{Array.from({ length: n }, (_, k) => <ThoughtCard key={k} p={[0.3 + Math.sin(k * 2.3) * (0.4 + k * 0.08), 1.9 + (k % 3) * 0.22, 0.2 + Math.cos(k * 2.3) * 0.3]} text={k % 2 ? "DON'T THINK IT" : "don't think it"} pop={1} h={0.07 + k * 0.025} glow={false} />)}</>; },
    cam: (t) => ({ pos: L3([1.6, 1.7, 3.2], [1.2, 1.75, 2.4], io(seg(t, P(11), P(12)))), target: [0.3, 1.7, 0.2], fov: 44 }) },
  // 12 · Wegner, 1987: a person at a table told not to think about a white bear
  { id: "wegner", t0: P(12), t1: P(13), scene: (t) => <><DarkStage /><Box p={[0, 0.74, 0.6]} s={[1.2, 0.05, 0.7]} c="#C9B8A0" /><Chair p={[0, 0, 0]} yaw={0} col="#5A6A8A" /><Person3D pos={[0, 0, 0.02]} yaw={0} look={CAST.ivw3} pose={sitOn(0.46, { armL: [48, 8, 70], armR: [48, 8, 70] })} face={{ smile: 0.1, brow: 0.3 }} /><mesh position={[0.35, 0.82, 0.6]}><sphereGeometry args={[0.06, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#F2B84B" metalness={0.6} roughness={0.3} /></mesh>{t > at(12, "white") && <WhiteBear p={[-1.6 + 0.5 * seg(t, at(12, "white"), PE(12)), 0, -1.6]} yaw={0.9} s={0.9} t={t} />}</>,
    cam: (t) => ({ pos: L3([2.4, 1.6, 3.2], [1.8, 1.5, 2.6], io(seg(t, P(12), P(13)))), target: [-0.3, 0.9, -0.2], fov: 42 }) },
  { id: "bell", t0: P(13), t1: P(14), scene: (t) => { const ring = Math.max(0, Math.sin(t * 5)); return <><DarkStage /><Box p={[0, 0.74, 0.6]} s={[1.2, 0.05, 0.7]} c="#C9B8A0" /><Chair p={[0, 0, 0]} yaw={0} col="#5A6A8A" /><Person3D pos={[0, 0, 0.02]} yaw={0} look={CAST.ivw3} pose={sitOn(0.46, { armL: [48, 8, 70], armR: [60 + 15 * ring, 10, 60], handR: "flat", headNod: 15 })} face={{ smile: 0, brow: 0.8, open: 0.2 }} /><mesh position={[0.35, 0.82, 0.6]}><sphereGeometry args={[0.06, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#F2B84B" metalness={0.6} roughness={0.3} /></mesh>{[0, 1, 2].map((k) => <WhiteBear key={k} p={[-2.2 + k * 1.4, 0, -2.2 - (k % 2) * 0.8]} yaw={0.6 + k * 0.5} s={0.6 + 0.15 * k} t={t + k} />)}</>; },
    cam: (t) => ({ pos: orbit([0, 0.9, -0.4], -30 + 40 * io(seg(t, P(13), P(14))), 3.8, 1.6), target: [0, 0.9, -0.6], fov: 44 }) },
  // 14 · 6,200 a day: the hero walks through a sea of floating cards
  { id: "thoughts-6200", t0: P(14), t1: P(15), scene: (t) => <><DarkStage tint="#BFE6FF" /><Person3D pos={[0, 0, 0]} yaw={0.4} look={HERO} pose={walk3(t * 0.9, 0.7)} face={{ smile: 0.2, eyesBig: 0.4 }} />{Array.from({ length: Math.floor(seg(t, at(14, "counted"), PE(14)) * 34) }, (_, k) => <ThoughtCard key={k} p={[Math.sin(k * 2.39) * (1 + k * 0.1), 0.3 + (k % 6) * 0.4, Math.cos(k * 2.39) * (1 + k * 0.1) - 0.5]} text={randomThoughts[k % randomThoughts.length]} pop={1} h={0.12} glow={false} />)}</>,
    cam: (t) => ({ pos: orbit([0, 1.2, 0], 10 + 40 * io(seg(t, P(14), P(15))), 5.4, 2.2), target: [0, 1.2, 0], fov: 46 }) },
  // 15 · out loud, to everybody (crane up over the crowd)
  { id: "everybody", t0: P(15), t1: P(16), scene: (t) => <><Env mood="golden" /><Plaza /><Person3D pos={[0, 0, 0.5]} yaw={0} look={HERO} pose={STAND} face={{ smile: 0, brow: 0.5 }} /><Ripples c={[0, 0, 0.5]} age={t - P(15)} max={10} n={4} period={1.6} />{RING_CROWD.map((c, i) => { const r = 2.5 + (i % 4) * 1.8, a = i * 2.1; const p: [number, number] = [Math.sin(a) * r, 0.5 + Math.cos(a) * r]; return <Person3D key={i} pos={[p[0], 0, p[1]]} yaw={faceTo(p, [0, 0.5])} look={c.look} pose={STAND} face={{ eyesBig: 0.6 }} />; })}</>,
    cam: (t) => { const u = io(seg(t, P(15), P(16))); return { pos: L3([2.0, 1.8, 4.0], [3.0, 14, 9], u), target: [0, 1.0, 0.5], fov: 44 }; } },
  // 16–17 · school: the teacher hears question seven, then "she looks tired"
  { id: "worse", t0: P(16), t1: P(17), scene: (t) => <Classroom t={t} answer={0} />,
    cam: (t) => ({ pos: L3([5.4, 2.6, 7.2], [4.6, 2.3, 5.6], io(seg(t, P(16), P(17)))), target: [0, 1.0, 0], fov: 44 }) },
  { id: "teacher", t0: P(17), t1: P(18), scene: (t) => <><Classroom t={t} answer={1} /><Thought head={[3.8, 1.18, 3.0]} text={t < at(17, "Then") ? "3x = 15… x = 5." : "She looks really tired."} t={t} t0={P(17) + 0.3} h={0.16} dy={0.42} /></>,
    cam: (t) => ({ pos: L3([5.6, 2.3, 6.0], [5.3, 2.2, 5.6], io(seg(t, P(17), P(18)))), target: [2.4, 1.4, 1.2], fov: 46 }) },
  // 18–19 · the café: the mustard uniform; "Mustard, is it."
  { id: "uniform", t0: P(18), t1: P(19), scene: (t) => <><CafeInterior /><Person3D pos={[0.2, 0, -1.9]} yaw={0} look={MUSTARD} pose={STAND} face={{ smile: 0.2, brow: -0.3 }} /><Person3D pos={[1.6, 0, -0.2]} yaw={faceTo([1.6, -0.2], [0.2, -1.9])} look={CAST.boss} pose={STAND} face={{ smile: 0 }} /><Thought head={[0.2, 1.56, -1.9]} text="This uniform is the colour of mustard." t={t} t0={at(18, "exactly")} h={0.16} /></>,
    cam: (t) => ({ pos: L3([-1.6, 1.7, 2.2], [-1.2, 1.7, 1.6], io(seg(t, P(18), P(19)))), target: [0.6, 1.5, -1.2], fov: 42 }) },
  { id: "mustard", t0: P(19), t1: P(20), scene: (t) => <><CafeInterior /><Person3D pos={[1.6, 0, -0.2]} yaw={faceTo([1.6, -0.2], [0.2, -1.9])} look={CAST.boss} pose={STAND} face={{ smile: 0, brow: -0.4, open: Math.max(0, Math.sin(t * 13)) * 0.3 }} /></>,
    cam: () => ({ pos: [0.9, 1.6, -1.4], target: [1.6, 1.52, -0.2], fov: 32 }) },
  // 20 · mum hears "I love you" mid-argument; she cries; you lose anyway
  { id: "mum", t0: P(20), t1: P(21), scene: (t) => { const m: [number, number] = [-0.7, -1.95], h: [number, number] = [0.6, -0.6]; return <><Kitchen sky="#FFE0A8" /><Person3D pos={[m[0], 0, m[1]]} yaw={faceTo(m, h)} look={CAST.mum} pose={t > at(20, "cries.") ? { ...STAND, armR: [70, 20, 120], handR: "open" } : talkHands(t, STAND, 0.8)} face={{ smile: t > at(20, "cries.") ? 0.3 : 0, brow: 0.9, blink: t > at(20, "cries.") }} /><Person3D pos={[h[0], 0, h[1]]} yaw={faceTo(h, m)} look={HERO} pose={talkHands(t + 1, STAND, 0.8)} face={{ smile: 0, brow: -0.4, open: Math.max(0, Math.sin(t * 12)) * 0.3 }} /><Thought head={[h[0], 1.56, h[1]]} text="I love you." t={t} t0={at(20, "I")} t1={at(20, "She")} h={0.16} /></>; },
    cam: (t) => ({ pos: orbit([0, 1.4, -1.25], 80 + 25 * io(seg(t, P(20), P(21))), 2.6, 1.6), target: [0, 1.35, -1.25], fov: 40 }) },
  // 21 · so you test the edges
  { id: "edges", t0: P(21), t1: P(22), scene: (t) => <><Garden /><Person3D pos={[-1, 0, 1.2]} yaw={-0.6} look={HERO} pose={{ ...STAND, armR: [30, 10, 100], handR: "fist" }} face={{ smile: 0.9, brow: -0.4 }} /></>,
    cam: (t) => ({ pos: L3([-2.6, 1.5, 3.0], [-2.2, 1.55, 2.5], io(seg(t, P(21), P(22)))), target: [-1, 1.4, 1.2], fov: 36 }) },
  // 22 · test one: ten metres in the garden; one step closer, he flinches
  { id: "garden-far", t0: P(22), t1: at(22, "Theo"), scene: (t) => { const h = GARDEN_HERO(t); return <><Garden /><Person3D pos={h} yaw={RUN_Y} look={HERO} pose={STAND} face={{ smile: 0.8 }} /><Person3D pos={[0.6, 0, 0.3]} yaw={Math.PI} look={CAST.theo} pose={sitOn(0.46, { ...PHONE_LOOK, legL: [88, 90], legR: [84, 90], bob: -0.26 })} propR={<HeldPhone />} /><Thought head={[h[0], 1.56, h[2]]} text="#@!%&!" t={t} t0={at(22, "rudest")} h={0.22} /></>; },
    cam: (t) => { const u = io(seg(t, P(22), at(22, "Theo"))); return { pos: L3([-5, 12, 8], [-5, 7, 9], u), target: [-4.6, 0, 0.2], fov: 50 }; } },
  { id: "garden-step", t0: at(22, "Theo"), t1: P(23), scene: (t) => { const h = GARDEN_HERO(t); const fl = ex(seg(t, at(22, "flinches."), at(22, "flinches.") + 0.15)) * (1 - seg(t, at(22, "flinches.") + 0.4, at(22, "flinches.") + 0.9)); return <><Garden /><Person3D pos={h} yaw={RUN_Y} look={HERO} pose={t > at(22, "One") ? walk3(t, 0.6) : STAND} face={{ smile: 0.8 }} /><Person3D pos={[0.6, 0, 0.3]} yaw={Math.PI} look={CAST.theo} pose={sitOn(0.46, { ...PHONE_LOOK, legL: [88, 90], legR: [84, 90], bob: -0.26, headNod: 24 - 40 * fl, lean: -10 * fl })} face={{ eyesBig: fl, open: 0.4 * fl }} propR={<HeldPhone />} /><Thought head={[h[0], 1.56, h[2]]} text="#@!%&!" t={t} t0={at(22, "rudest")} rings /></>; },
    cam: (t) => ({ pos: L3([1.6, 1.7, -1.9], [1.5, 1.65, -1.7], io(seg(t, at(22, "Theo"), P(23)))), target: [-3.5, 1.1, 0.4], fov: 50 }) },
  // 23 · "Bro."
  { id: "bro", t0: P(23), t1: P(24), scene: (t) => <><Garden /><Person3D pos={[0.6, 0, 0.3]} yaw={Math.PI} look={CAST.theo} pose={sitOn(0.46, { legL: [88, 90], legR: [84, 90], bob: -0.26, armR: [40, 20, 60], handR: "open", headTurn: 20 })} face={{ smile: 0, brow: 0.9, open: Math.max(0, Math.sin(t * 15)) * 0.4 }} /></>,
    cam: () => ({ pos: [-0.6, 1.25, -0.5], target: [0.6, 1.22, 0.3], fov: 34 }) },
  // 24 · test two: poker night (kitchen, night); "I've got nothing"; chips slide away
  { id: "poker", t0: P(24), t1: P(25), scene: (t) => { const u = seg(t, at(24, "lose"), PE(24)); return <><Kitchen sky="#16224A" /><ambientLight intensity={-0.1} /><Person3D pos={[0, 0, 1.08]} yaw={Math.PI} look={HERO} pose={{ ...TABLE_SIT, armR: [60, 10, 100], handR: "grip" }} face={{ smile: 0.1, brow: 0.5 }} propR={<HeldCards />} /><Person3D pos={[0, 0, -0.48]} yaw={0} look={CAST.theo} pose={{ ...TABLE_SIT, armR: [60, 10, 100], handR: "grip" }} face={{ smile: 0.8 }} propR={<HeldCards />} /><Person3D pos={[1.25, 0, 0.3]} yaw={-Math.PI / 2} look={CAST.ivw3} pose={{ ...TABLE_SIT, armR: [60, 10, 100], handR: "grip" }} face={{ smile: 0.6 }} propR={<HeldCards />} /><Person3D pos={[-1.25, 0, 0.3]} yaw={Math.PI / 2} look={CAST.boss} pose={TABLE_SIT} face={{ smile: 0.7 }} /><Chips p={[0.1 - 0.4 * u, 0.79, 0.5 - 1.0 * u]} n={10} /><Chips p={[-0.4, 0.79, 0.1]} n={6} /><Thought head={[0, 1.22, 1.08]} text="I've got nothing." t={t} t0={at(24, "everyone")} h={0.16} rings={false} dy={0.42} /></>; },
    cam: (t) => ({ pos: L3([-1.8, 2.0, 2.4], [-1.4, 1.9, 2.0], io(seg(t, P(24), P(25)))), target: [0, 0.95, 0.3], fov: 42 }) },
  // 25 · test three: headphones, a hat, tinfoil (the card still appears)
  { id: "tinfoil", t0: P(25), t1: P(26), scene: (t) => <><Bedroom windowMood="day" /><ambientLight intensity={0.6} /><Person3D pos={[0.3, 0, 0.2]} yaw={0.3} look={tinfoil(t)} pose={STAND} face={{ smile: 0.4, brow: 0.3 }} /><Thought head={[0.3, 1.6, 0.2]} text="Can you hear this?" t={t} t0={at(25, "Tinfoil,") + 0.2} h={0.15} /></>,
    cam: (t) => ({ pos: L3([1.3, 1.75, 2.4], [1.1, 1.72, 2.1], io(seg(t, P(25), P(26)))), target: [0.3, 1.75, 0.2], fov: 42 }) },
  // 26 · plus: nobody misunderstands you; your sister knows you're sorry
  { id: "sorry", t0: P(26), t1: P(27), scene: (t) => { const h: [number, number] = [0.4, 1.0], m: [number, number] = [-0.4, 1.1]; return <><PhotoWall holiday={false} /><Person3D pos={[h[0], 0, h[1]]} yaw={faceTo(h, m)} look={HERO} pose={{ ...STAND, headNod: 15 }} face={{ smile: 0.1, brow: 0.7 }} /><Kid s={0.82} pos={[m[0], 0, m[1]]} yaw={faceTo(m, h)} look={CAST.mia} pose={t > at(26, "sorry") ? { ...STAND, armL: [60, 30, 30], armR: [60, 30, 30] } : STAND} face={{ smile: t > at(26, "sorry") ? 0.9 : 0.2 }} /><Thought head={[h[0], 1.56, h[1]]} text="I'm sorry." t={t} t0={at(26, "sister")} h={0.15} rings={false} /></>; },
    cam: (t) => ({ pos: L3([0.4, 1.6, 4.0], [0.3, 1.6, 3.5], io(seg(t, P(26), P(27)))), target: [0, 1.55, 1.0], fov: 40 }) },
  // 27 · plus: you can't lie, so people trust you fast (café till)
  { id: "trust", t0: P(27), t1: P(28), scene: (t) => <><CafeInterior /><Person3D pos={[0.2, 0, -1.9]} yaw={0} look={MUSTARD} pose={STAND} face={{ smile: 0.7 }} /><Person3D pos={[0.4, 0, -0.3]} yaw={Math.PI} look={CAST.ivw2} pose={CUP_HOLD} propR={<HeldCup />} face={{ smile: 0.9 }} /><Thought head={[0.2, 1.56, -1.9]} text="Honestly? Get the toastie." t={t} t0={at(27, "lie.")} h={0.15} rings={false} /></>,
    cam: (t) => ({ pos: L3([2.3, 1.7, -0.3], [2.1, 1.7, -0.45], io(seg(t, P(27), P(28)))), target: [0.3, 1.65, -1.1], fov: 40 }) },
  // 28 · minus: you can't lie — "I'm fine", "Love it", "Nearly there" (each card cracks)
  { id: "no-lies", t0: P(28), t1: P(29), scene: (t) => { const words: [string, string][] = [["I'm", "I'm fine."], ["Love", "Love it."], ["Nearly", "Nearly there."]]; return <><DarkStage /><Person3D pos={[0, 0, 0]} yaw={0.2} look={HERO} pose={STAND} face={{ smile: 0.3, brow: 0.4 }} />{words.map(([w, s], k) => { const a = at(28, w); return t > a ? <ThoughtCard key={k} p={[-0.9 + k * 0.9, 2.1 + (k % 2) * 0.25, 0]} text={t > a + 0.6 ? "(not true)" : s} pop={seg(t, a, a + 0.3)} h={0.16} color={t > a + 0.6 ? "#5A6070" : "#F6F1E6"} ink={t > a + 0.6 ? "#AAB0C0" : "#0B1226"} /> : null; })}</>; },
    cam: (t) => ({ pos: L3([0.4, 1.7, 4.6], [0.3, 1.8, 3.8], io(seg(t, P(28), P(29)))), target: [0, 1.6, 0], fov: 42 }) },
  // 29 · minus: the girl at the bus stop with the book
  { id: "girl-stop", t0: P(29), t1: P(30), scene: (t) => { const g: [number, number] = [GIRL_STOP[0], GIRL_STOP[2]], h: [number, number] = [5.2, 0.9]; return <><Env mood="dawn" /><World3D bare lamps={false} nearTrees={false} glow={0.3} /><BusStop p={[7, 0, 0.9]} /><Person3D pos={GIRL_STOP} yaw={0.3} look={CAST.girl} pose={{ ...PHONE_LOOK, headNod: 26 + (t > at(29, "hear") ? -26 : 0) }} face={{ smile: 0.3, eyesBig: t > at(29, "hear") ? 0.5 : 0 }} propR={<HeldBook />} /><Person3D pos={[h[0], 0, h[1]]} yaw={faceTo(h, g)} look={HERO} pose={STAND} face={{ smile: 0.5 }} /><Thought head={[h[0], 1.56, h[1]]} text="I really hope she talks to me today." t={t} t0={at(29, "Every")} h={0.15} rings={false} /></>; },
    cam: (t) => ({ pos: L3([4.2, 1.6, 4.2], [4.6, 1.6, 3.6], io(seg(t, P(29), P(30)))), target: [6.0, 1.45, 0.8], fov: 40 }) },
  // 30 · you stop getting the bus (rain; the bus leaves without you)
  { id: "stop-bus", t0: P(30), t1: P(31), scene: (t) => <><Env mood="dusk" /><World3D bare lamps={false} nearTrees={false} glow={0.4} /><Bus p={[8 + (t - P(30)) * 3, 0, 3.4]} yaw={0} doors={1} /><Person3D pos={[2 - (t - P(30)) * 1.1, 0, 0.2]} yaw={-RUN_Y} look={HERO} pose={walk3(t * 0.9)} face={{ smile: 0, brow: 0.4 }} /><Rain center={[3, 0, 1]} rt={t} motion={1} n={2400} size={[16, 8, 8]} /></>,
    cam: (t) => ({ pos: [-1 - (t - P(30)) * 0.8, 1.2, 4.6], target: [3, 1.2, 0.8], fov: 44 }) },
];

export const A6Type: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} at={0.4} out={at(1, "The") - 0.1} text="BUS 42 · MONDAY 08:15" y={110} />
    {/* title */}
    <Rise t={t} at={at(7, "So,")} out={P(8) - 0.1} text="WHAT IF EVERYONE" size={70} y={720} align="center" w={1700} color={C.cool} />
    <Slam t={t} at={at(7, "read")} out={P(8) - 0.1} text="COULD READ YOUR MIND?" size={130} y={810} glow="#7FB8FF" />
    <Rise t={t} at={at(8, "Them")} out={at(8, "Every") - 0.05} text="Them reading yours." size={80} y={150} />
    <Slam t={t} at={at(8, "Out")} out={P(9) - 0.05} text="OUT LOUD." size={140} y={150} color={C.amber} />
    {/* rules */}
    <Chip t={t} at={at(9, "Rule")} out={P(10) - 0.1} text="RULE 1" y={110} />
    <Slam t={t} at={at(9, "ten")} out={P(10) - 0.1} text="10 METRES" size={130} y={160} x={110} align="left" color={C.cool} glow="#5A8AFF" />
    <Chip t={t} at={at(10, "Rule")} out={P(11) - 0.1} text="RULE 2" y={110} />
    <Rise t={t} at={at(10, "It")} out={P(11) - 0.1} text="It only goes one way." size={72} y={880} align="center" w={1400} />
    <Chip t={t} at={at(11, "Rule")} out={P(12) - 0.1} text="RULE 3" y={110} bg={C.red} color={C.cream} />
    <Rise t={t} at={at(11, "harder")} out={at(11, "Remember") - 0.05} text="The harder you try, the louder it gets." size={64} y={880} align="center" w={1500} />
    <Slam t={t} at={at(11, "Remember")} out={P(12) - 0.1} text="REMEMBER THIS ONE." size={90} y={160} x={110} align="left" color={C.amber} />
    {/* science */}
    <Chip t={t} at={at(12, "Rule")} out={P(13) - 0.1} text="THIS PART IS REAL" y={110} bg={C.cool} />
    <Chip t={t} at={at(12, "Daniel")} out={P(14) - 0.1} text="WEGNER ET AL. · 1987" y={180} bg={C.cream} />
    <Slam t={t} at={at(13, "more")} out={at(13, "Pushing") - 0.05} text="> 1 / MINUTE" size={120} y={240} x={110} align="left" color={C.cool} />
    <Rise t={t} at={at(13, "Pushing")} out={P(14) - 0.1} text="Pushing a thought away pins it down." size={64} y={880} align="center" w={1500} color={C.amber} />
    <Chip t={t} at={at(14, "Queen's")} out={P(15) - 0.1} text="TSENG & POPPENK · 2020" y={110} bg={C.cool} />
    <Slam t={t} at={at(14, "six")} out={P(15) - 0.05} text={Math.round(6200 * expo2(t - at(14, "six"))).toLocaleString("en-GB") + " / DAY"} size={130} y={150} x={110} align="left" color={C.cream} />
    <Slam t={t} at={at(15, "To")} out={P(16) - 0.05} text="TO EVERYBODY." size={120} y={150} color={C.amber} />
    {/* the tests */}
    <Chip t={t} at={at(17, "maths")} out={P(18) - 0.1} text="MATHS · PERIOD 2" y={110} />
    <Chip t={t} at={at(21, "So")} out={P(22) - 0.1} text="TESTING THE EDGES" y={110} />
    <Chip t={t} at={at(22, "Test")} out={P(23) - 0.1} text="TEST 1 · 10 METRES" y={110} />
    <Chip t={t} at={at(24, "Test")} out={P(25) - 0.1} text="TEST 2 · POKER NIGHT" y={110} />
    <Slam t={t} at={at(24, "forty")} out={P(25) - 0.05} text="−£40 · 11 MIN" size={110} y={160} x={110} align="left" color={C.red} />
    <Chip t={t} at={at(25, "Test")} out={P(26) - 0.1} text="TEST 3 · BLOCK IT" y={110} />
    <Strike t={t} at={at(25, "Tinfoil,")} strikeAt={at(25, "not")} out={P(26) - 0.1} text="Tinfoil" size={90} x={110} y={180} />
    <Chip t={t} at={at(26, "Plus.")} out={P(27) - 0.1} text="+ PLUS" y={110} bg="#3DD68C" />
    <Chip t={t} at={at(27, "Plus.")} out={P(28) - 0.1} text="+ PLUS" y={110} bg="#3DD68C" />
    <Chip t={t} at={at(28, "Minus.")} out={P(29) - 0.1} text="− MINUS" y={110} bg={C.red} color={C.cream} />
    <Chip t={t} at={at(28, "one")} out={at(28, "I'm") - 0.1} text="1–2 LIES A DAY · DEPAULO 1996" y={180} bg={C.cream} />
    <Chip t={t} at={at(29, "Minus.")} out={P(30) - 0.1} text="− MINUS" y={110} bg={C.red} color={C.cream} />
    <Rise t={t} at={at(30, "You")} out={P(31) - 0.1} text="You stop getting the bus." size={72} y={880} align="center" w={1400} />
    <Flash t={t} at={tTurn} color="#FFFFFF" max={0.2} len={0.2} />
  </>
);
function expo2(x: number) { return x <= 0 ? 0 : x >= 1.2 ? 1 : 1 - Math.pow(2, -10 * x / 1.2); }
export { shakeC, mix3, PS };
