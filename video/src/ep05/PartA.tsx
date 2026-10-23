// Episode 05, part A (beats 1–16): the frying pan, the title, the rules, SCN9A and the boy on the coals, back to the kitchen.
import React from "react";
import { mix3, Person3D, run3, STAND, walk3 } from "../cam3d/Person3D";
import { CUP_HOLD } from "../cam3d/Props3D";
import { hand, io, ex, L3, orbit, rnd, RUN_Y, seg, Shot, shakeC } from "../ep04/core";
import { Crowd, Env, makeCrowd, Park, Plaza, Rooftop } from "../ep04/Sets";
import { Space, Pigeon } from "../ep04/Sets2";
import { Bedroom } from "../ep04/Sets3";
import { C, Chip, Flash, Rise, Slam, Strike } from "../ep04/Text";
import { CAST, Damage, Kid, Ripples } from "../epx/Kit";
import { AlarmBell, Coals, HeldPan, HOB, OldStreet, Steam } from "../epx/Sets5";
import { at, AT_HOB, DarkStage, HOLD_PAN, Kitchen5, Mia, MIA_S, Nerve, P, PE, PS, REACH, SEAT_W, XRayHero, yawTo } from "./common";

const HERO = CAST.hero;
const tPick = at(1, "pick");
const heroK = (t: number, face: object = {}) => {
  const lifted = t > tPick;
  const pose = t < at(1, "You") ? STAND : !lifted ? mix3(STAND, REACH, io(seg(t, at(1, "You"), tPick))) : mix3(REACH, HOLD_PAN, io(seg(t, tPick, tPick + 0.6)));
  return <Person3D pos={AT_HOB} yaw={Math.PI} look={HERO} pose={pose} face={{ smile: 0.3, ...face }} propR={lifted ? <HeldPan /> : undefined} />;
};
const HAND_W: [number, number, number] = [AT_HOB[0] + 0.3, 1.18, AT_HOB[2] - 0.57]; // where the right hand holds the pan (approx.)
const PARK_CROWD = makeCrowd(51, 10, -10, 14, -2.6, 3.2);
const STREET_CROWD = makeCrowd(57, 12, -6, 6, -3.6, -1.6);

export const A_SHOTS: Shot[] = [
  // 1 · Saturday kitchen: crane down past the pendant lamp to the hob
  { id: "kitchen", t0: 0, t1: at(1, "You"), scene: (t) => <><Kitchen5 t={t} pan={t < tPick} /><Mia t={t} />{heroK(t)}</>,
    cam: (t) => { const u = io(seg(t, 0, at(1, "You"))); return hand({ pos: L3([2.6, 2.7, 3.2], [0.6, 1.8, 0.8], u), target: L3([-0.6, 1.0, -1.2], [-1.3, 1.1, -2.2], u), fov: 44 }, t, 0.01); } },
  { id: "reach", t0: at(1, "You"), t1: P(2), scene: (t) => <><Kitchen5 t={t} pan={t < tPick} />{heroK(t)}</>,
    cam: (t) => { const u = io(seg(t, at(1, "You"), P(2))); return { pos: L3([-0.15, 1.45, -1.9], [-0.25, 1.38, -2.2], u), target: [-1.2, 1.0, -2.5], fov: 38 }; } },
  // 2 · the metal handle, straight off the flame: macro, crash in on "flame"
  { id: "handle", t0: P(2), t1: P(3), scene: (t) => <><Kitchen5 t={t} pan={false} />{heroK(t, { smile: 0.2 })}<Steam t={t} amt={0.8} p={[HAND_W[0], HAND_W[1] + 0.05, HAND_W[2] - 0.3]} /></>,
    cam: (t) => { const z = ex(seg(t, at(2, "flame") - 0.1, at(2, "flame") + 0.2)); return shakeC({ pos: [-0.2, 1.4, -2.0], target: [HAND_W[0] - 0.05, HAND_W[1] - 0.05, HAND_W[2] - 0.25], fov: 36 - 12 * z }, t, z > 0.1 && z < 0.95 ? 0.006 : 0); } },
  // 3 · Mia stops chewing / you look down / the skin goes red / you feel nothing
  { id: "mia-stops", t0: P(3), t1: at(3, "You"), scene: (t) => <><Kitchen5 t={t} pan={false} /><Mia t={t} eating={t < at(3, "stops")} face={{ smile: 0, open: 0.25, eyesBig: 1 }} />{heroK(t)}</>,
    cam: (t) => ({ pos: L3([-0.2, 1.15, 0.9], [-0.35, 1.12, 0.7], io(seg(t, P(3), at(3, "You")))), target: [SEAT_W[0], 1.08, SEAT_W[2]], fov: 32 }) },
  { id: "look-down", t0: at(3, "You"), t1: at(3, "The"), scene: (t) => <><Kitchen5 t={t} pan={false} /><Person3D pos={AT_HOB} yaw={Math.PI} look={HERO} pose={{ ...HOLD_PAN, headNod: 32 }} face={{ smile: 0 }} propR={<HeldPan />} /></>,
    cam: (t) => hand({ pos: [-2.2, 1.5, -2.25], target: [-1.4, 1.25, -2.0], fov: 36 }, t, 0.008) },
  { id: "red-hand", t0: at(3, "The"), t1: at(3, "And"), noBlur: true, scene: (t) => <><Kitchen5 t={t} pan={false} /><Person3D pos={AT_HOB} yaw={Math.PI} look={HERO} pose={{ ...HOLD_PAN, headNod: 32 }} propR={<><HeldPan /><Damage p={[0, -0.06, 0.03]} t={t} amt={ex(seg(t, at(3, "red") - 0.2, at(3, "red") + 0.5))} s={0.08} /></>} /></>,
    cam: (t) => { const u = io(seg(t, at(3, "The"), at(3, "And"))); return { pos: orbit(HAND_W, 60 + 50 * u, 0.75, 1.45), target: HAND_W, fov: 34 }; } },
  { id: "nothing", t0: at(3, "And"), t1: P(4), scene: (t) => <><Kitchen5 t={t} pan={false} /><Person3D pos={AT_HOB} yaw={Math.PI} look={HERO} pose={{ ...HOLD_PAN, headNod: 10 }} face={{ smile: 0, brow: 0.2 }} propR={<HeldPan />} /></>,
    cam: (t) => { const u = io(seg(t, at(3, "And"), P(4))); return { pos: L3([-1.15, 1.6, -2.85], [-1.2, 1.58, -2.65], u), target: [-1.35, 1.55, -1.88], fov: 30 }; } },
  // 4 · Mia: "Why aren't you screaming?"
  { id: "mia-line", t0: P(4), t1: P(5), scene: (t) => <><Kitchen5 t={t} pan={false} /><Mia t={t} eating={false} yaw={yawTo(SEAT_W, AT_HOB)} face={{ smile: 0, brow: 0.6, open: Math.max(0, Math.sin(t * 15)) * 0.45, eyesBig: 0.7 }} /><Person3D pos={AT_HOB} yaw={Math.PI} look={HERO} pose={HOLD_PAN} propR={<HeldPan />} /></>,
    cam: () => ({ pos: [-1.6, 1.25, -1.0], target: [SEAT_W[0], 1.08, SEAT_W[2]], fov: 30 }) },
  // 5 · "that's the question": the kitchen freezes, steam hangs, slow orbit
  { id: "question", t0: P(5), t1: at(5, "So"), noBlur: true, scene: (t) => <><Kitchen5 t={PS(5)} pan={false} /><Mia t={PS(5)} eating={false} face={{ smile: 0, open: 0.2, eyesBig: 1 }} /><Person3D pos={AT_HOB} yaw={Math.PI} look={HERO} pose={HOLD_PAN} propR={<><HeldPan /><Damage p={[0, -0.06, 0.03]} t={t} amt={1} s={0.08} /></>} /><Steam t={PS(5)} amt={1} p={[HAND_W[0], HAND_W[1] + 0.05, HAND_W[2] - 0.3]} /></>,
    cam: (t) => { const u = io(seg(t, P(5), at(5, "So"))); return { pos: orbit([-1.1, 1.2, -1.4], 200 - 70 * u, 2.4, 1.6), target: [-1.1, 1.15, -1.6], fov: 40 }; } },
  // title: the hero alone on the dark stage, red glows pulsing where he's hurt, ripples of a silent alarm
  { id: "title", t0: at(5, "So"), t1: P(6), scene: (t) => <><DarkStage tint="#FF8A6A" /><XRayHero t={t} pose={{ ...STAND, headNod: -4 }} face={{ smile: 0 }} hand={1} shin={0.8} mouth={0.5} heel={0.6} belly={0.4} arm={0.6} /><Ripples c={[0, 0, 0]} age={t - at(5, "So")} color="#FF5A3A" max={4} n={3} period={2} opacity={0.5} /></>,
    cam: (t) => { const u = io(seg(t, at(5, "So"), P(6))); return { pos: L3([0.2, 1.0, 5.2], [0.1, 1.2, 3.4], u), target: [0, 1.0, 0], fov: 36, roll: -0.03 + 0.05 * u }; } },
  // 6 · not less pain. none: the park, tracking a carefree walk; each "no" a chip
  { id: "none", t0: P(6), t1: P(7), scene: (t) => { const x = (t - P(6)) * 1.3 - 4; return <><Env mood="day" center={[x, 0, 0]} /><Park /><Person3D pos={[x, 0, 0.2]} yaw={RUN_Y} look={HERO} pose={walk3(t * 1.1)} face={{ smile: 0.8 }} /><Crowd list={PARK_CROWD} walk={(i) => ({ dx: (t - P(6)) * (0.6 + rnd(i) * 0.4), pose: walk3(t * 0.9 + rnd(i)) })} /></>; },
    cam: (t) => { const x = (t - P(6)) * 1.3 - 4; return hand({ pos: [x + 2.4, 1.4, 4.2], target: [x + 0.2, 1.2, 0.2], fov: 38 }, t, 0.02); } },
  // 7 · it sounds like a superpower: rooftop, golden hour, low heroic crane
  { id: "superpower", t0: P(7), t1: P(8), scene: () => <><Env mood="golden" /><Rooftop /><Person3D pos={[0, 0, 2]} yaw={0.3} look={HERO} pose={{ ...STAND, armL: [8, 18, 20], armR: [8, 18, 20], headNod: -10 }} face={{ smile: 0.9 }} /></>,
    cam: (t) => { const u = io(seg(t, P(7), P(8))); return { pos: L3([1.0, 0.4, 4.4], [2.4, 2.4, 6.2], u), target: [0, 1.4, 2], fov: 40 }; } },
  // 8 · rule one: nothing hurts (bedroom; a paper cut glows on the finger)
  { id: "rule1", t0: P(8), t1: at(8, "Not"), scene: (t) => <><Bedroom windowMood="day" /><ambientLight intensity={0.6} /><Person3D pos={[0.3, 0, 0.2]} yaw={0.4} look={HERO} pose={{ ...STAND, armR: [30, 10, 50], handR: "open" }} face={{ smile: 0.6 }} /></>,
    cam: (t) => { const u = io(seg(t, P(8), at(8, "Not"))); return { pos: L3([1.6, 1.5, 3.0], [1.2, 1.5, 2.2], u), target: [-0.35, 1.25, 0.2], fov: 40 }; } },
  { id: "paper-cut", t0: at(8, "Not"), t1: P(9), noBlur: true, scene: (t) => <><DarkStage /><XRayHero t={t} pose={{ ...STAND, armR: [40, 10, 70], handR: "open" }} hand={seg(t, at(8, "paper"), at(8, "paper") + 0.3)} arm={seg(t, at(8, "broken"), at(8, "broken") + 0.3)} mouth={seg(t, at(8, "dentist's"), at(8, "dentist's") + 0.3)} /></>,
    cam: (t) => { const u = io(seg(t, at(8, "Not"), P(9))); return { pos: orbit([0, 1.1, 0], -30 + 60 * u, 2.8, 1.4), target: [-0.55, 1.1, 0], fov: 38 }; } },
  // 9 · rule two: you still get hurt (glows light up on the words), the message never arrives
  { id: "rule2", t0: P(9), t1: P(10), scene: (t) => <><DarkStage tint="#FF9A7A" /><XRayHero t={t} pose={STAND} face={{ smile: 0.5 }} hand={seg(t, at(9, "burn"), at(9, "burn") + 0.3)} shin={seg(t, at(9, "bone"), at(9, "bone") + 0.3)} /></>,
    cam: (t) => { const u = io(seg(t, P(9), P(10))); return { pos: L3([-1.4, 1.1, 3.4], [1.2, 1.3, 3.2], u), target: [-0.6, 0.95, 0], fov: 40 }; } },
  // 10 · rule three: nobody can tell. Golden plaza, people pass; he smiles
  { id: "rule3", t0: P(10), t1: P(11), scene: (t) => <><Env mood="golden" /><Plaza /><Person3D pos={[0, 0, 0.5]} yaw={0.2} look={HERO} pose={{ ...STAND, headTurn: 10 * Math.sin(t) }} face={{ smile: 0.9 }} /><Damage p={[0.12, 0.3, 0.58]} t={t} amt={0.6} s={0.08} /><Crowd list={STREET_CROWD} walk={(i) => ({ dx: (t - P(10)) * (0.7 + rnd(i) * 0.5), pose: walk3(t * 0.9 + rnd(i)) })} /></>,
    cam: (t) => { const u = io(seg(t, P(10), P(11))); return { pos: L3([3.4, 1.5, 5.4], [1.4, 1.55, 3.0], u), target: [0, 1.3, 0.5], fov: 36 }; } },
  // 11 · this is real: Earth
  { id: "real", t0: P(11), t1: P(12), scene: (t) => <Space t={t} sats={0} />,
    cam: (t) => { const u = io(seg(t, P(11), P(12))); return { pos: L3([3, 2, 16], [1.5, 1.2, 9.5], u), target: [0, 0, 0], fov: 40 }; } },
  // 12 · SCN9A: along the nerve; the pulses die at the switch
  { id: "nerve", t0: P(12), t1: at(12, "One"), scene: (t) => <Nerve t={t} />,
    cam: (t) => { const u = io(seg(t, P(12), at(12, "One"))); return { pos: L3([-9, 1.2, 3.4], [-3, 0.9, 2.6], u), target: L3([-5, 0, 0], [0.5, 0, 0], u), fov: 44 }; } },
  { id: "switch", t0: at(12, "One"), t1: P(13), scene: (t) => <Nerve t={t} sw={0.6 + 0.4 * Math.sin(t * 6)} />,
    cam: (t) => { const u = io(seg(t, at(12, "One"), P(13))); return { pos: orbit([0.5, 0, 0.3], 40 + 50 * u, 2.2 - 0.6 * u, 0.6), target: [0.5, 0, 0.3], fov: 40 }; } },
  // 13 · the boy on the coals (golden old street, crowd)
  { id: "coals", t0: P(13), t1: at(13, "He"), scene: (t) => { const x = -1.4 + 2.8 * seg(t, P(13) + 0.4, at(13, "He")); return <><Env mood="golden" /><OldStreet /><Coals t={t} /><Kid s={0.86} pos={[x, 0.08, 0]} yaw={RUN_Y} look={CAST.performer} pose={walk3(t * 0.7, 0.8)} face={{ smile: 0.3 }} /><Crowd list={STREET_CROWD.map((e, i) => ({ ...e, pos: [-4 + i * 0.75, 0, i % 2 ? -1.7 : -2.6], yaw: 0 }))} /></>; },
    cam: (t) => { const u = io(seg(t, P(13), at(13, "He"))); return { pos: L3([-3.2, 0.35, 1.6], [-1.6, 0.5, 1.9], u), target: [0, 0.6, 0], fov: 40 }; } },
  { id: "never-felt", t0: at(13, "He"), t1: P(14), scene: (t) => <><Env mood="golden" /><OldStreet /><Coals t={t} /><Kid s={0.86} pos={[1.6, 0, 0.1]} yaw={0.3} look={CAST.performer} pose={{ ...STAND, armL: [10, 30, 20], armR: [10, 30, 20] }} face={{ smile: 0.7 }} /></>,
    cam: (t) => ({ pos: L3([3.0, 1.0, 2.2], [2.6, 1.05, 1.7], io(seg(t, at(13, "He"), P(14)))), target: [1.6, 1.0, 0.1], fov: 34 }) },
  // 14 · he died at fourteen: an empty rooftop at dusk, a pigeon leaves; cold, quiet
  { id: "roof-empty", t0: P(14), t1: P(15), grade: "saturate(0.55) brightness(0.9)", scene: (t) => <><Env mood="dusk" /><Rooftop /><Pigeon p={[2 + seg(t, at(14, "jumped"), PE(14)) * 4, 1.0 + seg(t, at(14, "jumped"), PE(14)) * 4, -5.9]} flap={t * 20} yaw={RUN_Y} s={1.3} /></>,
    cam: (t) => { const u = io(seg(t, P(14), P(15) + 1)); return { pos: L3([0, 1.5, 3], [0, 1.6, 0.5], u), target: [0, 0.8, -8], fov: 42 }; } },
  // 15 · back in the kitchen: he grins at his hand; Saturday got interesting
  { id: "grin-hand", t0: P(15), t1: at(15, "and"), scene: (t) => <><Kitchen5 t={t} /><Mia t={t} eating={false} face={{ smile: 0, eyesBig: 0.5 }} /><Person3D pos={[-0.9, 0, -1.4]} yaw={0.6} look={HERO} pose={{ ...STAND, armR: [62, 10, 92], handR: "open", wristR: [-20, 0], headNod: 20 }} face={{ smile: 0.5 }} propR={<Damage p={[0, -0.06, 0.03]} t={t} amt={0.7} s={0.07} />} /></>,
    cam: (t) => { const u = io(seg(t, P(15), at(15, "and"))); return { pos: L3([0.4, 1.6, 0.6], [0.0, 1.55, 0.1], u), target: [-0.9, 1.35, -1.3], fov: 36 }; } },
  { id: "interesting", t0: at(15, "and"), t1: P(16), scene: (t) => <><Kitchen5 t={t} /><Person3D pos={[-0.9, 0, -1.4]} yaw={0.6} look={HERO} pose={{ ...STAND, headNod: -4 }} face={{ smile: 1, brow: -0.2 }} /></>,
    cam: (t) => { const z = ex(seg(t, at(15, "interesting") - 0.15, at(15, "interesting") + 0.2)); return { pos: [-0.2, 1.62, -0.6], target: [-0.9, 1.57, -1.4], fov: 40 - 14 * z }; } },
  // 16 · so you test it
  { id: "test-it", t0: P(16), t1: P(17), scene: (t) => <><Kitchen5 t={t} /><Person3D pos={[-0.9, 0, -1.4]} yaw={0.9} look={HERO} pose={{ ...STAND, armR: [40, 12, 100], handR: "fist", wristR: [0, 0] }} face={{ smile: 0.9, brow: -0.4 }} /></>,
    cam: (t) => ({ pos: orbit([-0.9, 1.4, -1.4], 70 - 30 * io(seg(t, P(16), P(17))), 1.6, 1.5), target: [-0.9, 1.4, -1.4], fov: 36 }) },
];

export const AType: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} at={0.4} out={at(1, "You") - 0.1} text="SATURDAY · 09:00" y={110} />
    <Slam t={t} at={at(3, "nothing")} out={P(4)} text="NOTHING." size={150} y={150} />
    {/* title */}
    <Rise t={t} at={at(5, "So")} out={P(6) - 0.1} text="WHAT IF YOU" size={70} y={720} align="center" w={1600} color={C.cool} />
    <Slam t={t} at={at(5, "couldn't")} out={P(6) - 0.1} text="COULDN'T FEEL PAIN?" size={140} y={810} glow="#FF7A5A" />
    {/* none */}
    <Chip t={t} at={at(6, "stings")} out={at(6, "aches")} text="NO STINGS" y={110} bg={C.cream} />
    <Chip t={t} at={at(6, "aches")} out={at(6, "headaches")} text="NO ACHES" y={110} bg={C.cream} />
    <Chip t={t} at={at(6, "headaches")} out={at(6, "hot")} text="NO HEADACHES" y={110} bg={C.cream} />
    <Chip t={t} at={at(6, "hot")} out={at(6, "Ever")} text="NO HOT HANDLE" y={110} bg={C.red} color={C.cream} />
    <Slam t={t} at={at(6, "Ever")} out={P(7) - 0.05} text="EVER AGAIN." size={130} y={150} color={C.amber} />
    <Rise t={t} at={at(7, "For")} out={P(8) - 0.1} text="For about a week, it is." size={64} y={880} align="center" w={1400} />
    {/* rules */}
    <Chip t={t} at={at(8, "Rule")} out={P(9) - 0.1} text="RULE 1" y={110} />
    <Rise t={t} at={at(8, "Nothing")} out={P(9) - 0.1} text="Nothing hurts." size={84} y={180} />
    <Chip t={t} at={at(9, "Rule")} out={P(10) - 0.1} text="RULE 2" y={110} />
    <Rise t={t} at={at(9, "You")} out={at(9, "You", 2) - 0.1} text="You still get hurt." size={84} y={180} />
    <Strike t={t} at={at(9, "You", 2)} strikeAt={at(9, "message") + 0.05} out={P(10) - 0.1} text="Message received." size={72} y={180} />
    <Chip t={t} at={at(10, "Rule")} out={P(11) - 0.1} text="RULE 3" y={110} bg={C.red} color={C.cream} />
    <Rise t={t} at={at(10, "Nobody")} out={at(10, "Remember") - 0.1} text="Nobody can tell." size={84} y={180} />
    <Slam t={t} at={at(10, "Remember")} out={P(11) - 0.1} text="REMEMBER THIS ONE." size={90} y={180} x={110} align="left" color={C.amber} />
    {/* science */}
    <Chip t={t} at={at(11, "This")} out={P(12) - 0.1} text="THIS PART IS REAL" y={110} bg={C.cool} />
    <Chip t={t} at={at(12, "2006,")} out={at(12, "One") - 0.1} text="COX ET AL. · NATURE · 2006" y={110} bg={C.cool} />
    <Slam t={t} at={at(12, "SCN9A.")} out={at(12, "One") - 0.05} text="SCN9A" size={160} y={150} color={C.cool} glow="#5A8AFF" />
    <Rise t={t} at={at(12, "stuck")} out={P(13) - 0.1} text="One switch in the nerves. Stuck off." size={64} y={880} w={1400} />
    <Slam t={t} at={at(14, "fourteen.")} out={P(15) - 0.2} text="14" size={220} y={130} color={C.cream} />
    <Chip t={t} at={at(15, "six")} out={P(16) - 0.1} text="6 SECONDS" y={110} bg={C.red} color={C.cream} />
    <Flash t={t} at={at(5, "So")} color="#FF8A6A" max={0.6} len={0.3} />
  </>
);
export { HOB, CUP_HOLD, run3, AlarmBell, Strike, Kid, MIA_S };
