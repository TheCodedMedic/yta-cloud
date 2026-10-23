// Episode 06 shared: timing, the bus cast, thoughts in the world.
import React from "react";
import { Look3, Person3D, Pose3 } from "../cam3d/Person3D";
import { V3 } from "../ep04/Vfx";
import { CAST, makeT, Ripples, ThoughtCard, Timing } from "../epx/Kit";
import { BUS_SIT, BusInterior, Passenger, seatPos, Wig } from "../epx/Sets6";
import TIMING from "./timing.json";

export const T6 = makeT(TIMING as Timing);
export const { at, atE, PS, PE, P } = T6;
export const END6 = T6.END;
export const rnd6 = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// the bus: hero at row 3 aisle-right, the wig man in front (row 4 aisle-right), the girl across the aisle (row 3 aisle-left)
export const HERO_SEAT = seatPos(3, 2), WIG_SEAT = seatPos(4, 2), GIRL_SEAT = seatPos(3, 1);
export const SEATED_HEAD_Y = 1.31;
export const headOf = (p: V3): V3 => [p[0], SEATED_HEAD_Y, p[2]];
const EXTRAS = ["ex1", "ex2", "ex3", "ex4", "ex5", "ex6", "ex7", "ex8", "ivw1", "ivw2", "ivw3", "mum", "boss"];
type Pax = { r: number; p: number; look: Look3 };
export const PAX: Pax[] = [];
for (let r = 0; r < 10; r++) for (let p = 0; p < 4; p++) {
  if ((r === 3 && (p === 1 || p === 2)) || (r === 4 && p === 2)) continue;
  if (rnd6(r * 7 + p * 3 + 1) < 0.62) PAX.push({ r, p, look: (CAST as any)[EXTRAS[Math.floor(rnd6(r * 13 + p * 5) * EXTRAS.length)]] ?? CAST.ivw1 });
}
/** The whole bus: interior, passengers (turn 0..1 makes those in front swivel round to stare), the wig man, the hero (and optionally the girl). */
export const Bus42: React.FC<{ t: number; turn?: number; hero?: Pose3; heroFace?: object; wigTurn?: number; girl?: React.ReactNode; mood?: "day" | "golden" | "dawn" }> = ({ t, turn = 0, hero, heroFace = {}, wigTurn, girl, mood = "day" }) => {
  const wt = wigTurn ?? turn;
  const wigYaw = Math.PI / 2 + wt * 2.3;
  return (
    <>
      <BusInterior t={t} mood={mood} />
      {PAX.map((x, i) => <Passenger key={i} r={x.r} p={x.p} look={x.look} turn={turn} tx={HERO_SEAT[0]} face={{ eyesBig: turn > 0.5 ? 0.6 : 0, smile: turn > 0.5 ? 0 : 0.2 }} />)}
      <Person3D pos={WIG_SEAT} yaw={wigYaw} look={CAST.wig} pose={{ ...BUS_SIT, headTurn: -wt * 20 }} face={{ smile: 0, eyesBig: wt > 0.5 ? 1 : 0, brow: wt > 0.5 ? 0.5 : 0 }} />
      <Wig p={[WIG_SEAT[0], SEATED_HEAD_Y, WIG_SEAT[2]]} yaw={wigYaw} />
      <Person3D pos={HERO_SEAT} yaw={Math.PI / 2} look={CAST.hero} pose={hero ?? BUS_SIT} face={{ smile: 0.3, ...heroFace }} />
      {girl}
    </>
  );
};
/** The hero's thought, out loud: a card over the head plus rings on the ground spreading to ten metres. */
export const Thought: React.FC<{ head: V3; text: string; t: number; t0: number; t1?: number; rings?: boolean; h?: number; color?: string; dy?: number; w?: number }> = ({ head, text, t, t0, t1 = 1e9, rings = true, h = 0.22, color, dy = 0.3, w }) => {
  if (t < t0 || t > t1 + 0.25) return null;
  const pop = Math.min((t - t0) / 0.35, 1) * (t > t1 ? Math.max(0, 1 - (t - t1) / 0.25) : 1);
  return (
    <>
      <ThoughtCard p={[head[0], head[1] + dy, head[2]]} text={text} pop={pop} h={h} color={color} w={w} />
      {rings && <Ripples c={head} age={t - t0} max={10} n={3} period={2.2} opacity={0.55} />}
    </>
  );
};
