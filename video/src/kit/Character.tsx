import React from "react";
import { C } from "../theme";

// ─── Conventions ───────────────────────────────────────────────────────────────
// Local space: hips at (0,0), y down, scale 1. Standing height ≈ 300 px.
// The body turns on a continuous YAW: 0 = facing the camera, 0.5 = three-quarter,
// 1 = true profile facing +x. Everything that depends on the angle (torso width,
// chest offset, where the shoulders and hips sit, which eye is visible, how much
// the mouth squashes, which way the cap brim points) interpolates on yaw, so a
// character can be drawn at any angle and can turn inside a shot (`yaw` prop).
// Named views:
//   "front"   – yaw 0. Limb angle 0 = hanging down, + swings OUTWARD (away from
//               the body's centre line), 180 = straight up.
//   "quarter" – yaw 0.5. Limb angle 0 = hanging down, + swings FORWARD (+x).
//   "side"    – yaw 1, a real profile: narrow torso, chest forward of the hips,
//               both shoulders at the back of the chest, the near arm hanging in
//               front of the torso and the far arm behind it, one eye visible.
//               Limb angle + swings FORWARD.
// Elbow / knee angles are RELATIVE to the upper limb and are clamped so that
// elbows only flex forward (side, quarter) / outward-up (front) and knees only
// flex backward. A wrong sign in a pose can therefore never hyper-extend a joint.

export type View = "side" | "quarter" | "front";
/** Yaw of each named view: 0 faces the camera, 1 is a profile facing +x. */
export const VIEW_YAW: Record<View, number> = { front: 0, quarter: 0.5, side: 1 };
const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

export type Pose = {
  lean?: number;   // torso tilt (deg), + leans forward (side) / to the right (front)
  head?: number;   // extra head tilt (deg)
  armN?: [number, number]; // near arm (screen-right in front view): shoulder, elbow
  armF?: [number, number]; // far arm (screen-left in front view)
  legN?: [number, number]; // near leg: hip, knee
  legF?: [number, number];
  shrug?: number;  // 0..1 shoulders up
  bob?: number;    // vertical offset of the whole body (px, − = up)
};

export type Expr =
  | "neutral" | "smile" | "happy" | "smug" | "shock" | "think"
  | "deadpan" | "laugh" | "worry" | "determined";

export type Outfit = "hero" | "friend" | "scientist" | "sister" | "extra" | "ivory" | "oldman";

// No outlines (they flatten the look). Depth comes from tone: the near sleeve is
// a step lighter than the torso, the far sleeve darker, plus the rim light on the
// lit edge and a soft shadow where a limb crosses the body.
const OUTFIT: Record<Outfit, { top: string; topDark: string; legs: string; long?: boolean; sleeve: string }> = {
  hero: { top: C.hoodie, topDark: C.hoodieDark, legs: C.ink, sleeve: "#e4503f" },
  friend: { top: C.friendTop, topDark: "#1d1c2a", legs: "#1a1622", sleeve: "#4a4866" },
  scientist: { top: C.coat, topDark: "#c6c3ba", legs: C.ink, long: true, sleeve: "#f8f6f1" },
  sister: { top: "#c56aa8", topDark: "#93487c", legs: C.ink, sleeve: "#d57dbb" },
  extra: { top: "#5b5470", topDark: "#433d55", legs: "#221c2c", sleeve: "#726b8d" },
  // What If in Theory: the channel hero (ivory jacket, ONE vermilion button, charcoal trousers) and the old man with the map (brown coat, grey cap)
  ivory: { top: "#e9e2d0", topDark: "#c9bfa6", legs: "#2b3042", sleeve: "#f3eee2" },
  oldman: { top: "#8a6a4a", topDark: "#634b33", legs: "#2f3442", sleeve: "#9d7c5a", long: true },
};

export const RIG = {
  neck: 96,      // hips → base of neck
  headR: 62,
  headGap: 68,   // base of neck → head centre (head bottom just overlaps the collar)
  upperArm: 54,
  foreArm: 50,
  thigh: 56,
  shin: 54,
  hipFront: 9,       // hip x offset facing the camera (legs apart)
  hipSide: 4,        // hip x offset in profile (the legs overlap)
  shoulderFront: 40, // shoulder x offset facing the camera (torso corners)
  shoulderBack: 1,   // in profile the near shoulder sits about on the torso centre line, the far one just behind it
  shoulderDrop: 12,  // shoulders sit this far below the neck base
  chestForward: 6,   // in profile the chest sits this far forward of the hips
  torsoFront: [44, 40] as [number, number], // half widths (shoulders, hips) facing the camera
  torsoSide: [22, 19] as [number, number],  // half widths in profile
};

const ELBOW_FRONT: [number, number] = [-150, 150];
const ELBOW_SIDE: [number, number] = [-4, 150];
const KNEE: [number, number] = [-150, 4];
const clamp = (v: number, [lo, hi]: [number, number]) => Math.max(lo, Math.min(hi, v));
/** Only the named front view uses the "outward" arm convention. */
const outward = (view: View) => view === "front";

export const POSES = {
  // side / quarter view (angles swing forward)
  stand: { lean: 0, armN: [10, 14], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] },
  sit: { lean: -4, armN: [30, 70], armF: [24, 64], legN: [88, -92], legF: [82, -88] },
  sitTable: { lean: 6, armN: [50, 32], armF: [44, 28], legN: [88, -92], legF: [82, -88] },
  point: { lean: 4, armN: [95, 6], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] },
  armUp: { lean: 0, armN: [160, 6], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] },
  fistsUp: { lean: 2, armN: [60, 100], armF: [50, 105], legN: [10, -6], legF: [-8, 0] },
  // front view (angles swing outward)
  front: { lean: 0, armN: [12, 8], armF: [12, 8], legN: [6, 0], legF: [6, 0] },
  hero: { lean: 0, armN: [18, 10], armF: [18, 10], legN: [12, 0], legF: [12, 0] },
  spread: { lean: 0, armN: [82, 14], armF: [82, 14], legN: [8, 0], legF: [8, 0] },
  shrug: { lean: 0, armN: [52, 108], armF: [52, 108], legN: [6, 0], legF: [6, 0], shrug: 1, head: 8 },
  frontFists: { lean: 0, armN: [40, 125], armF: [40, 125], legN: [8, 0], legF: [8, 0] },
} satisfies Record<string, Pose>;

export const mixPose = (a: Pose, b: Pose, u: number): Pose => {
  const m = (x = 0, y = 0) => x + (y - x) * u;
  const m2 = (x: [number, number] = [0, 0], y: [number, number] = [0, 0]): [number, number] => [m(x[0], y[0]), m(x[1], y[1])];
  return {
    lean: m(a.lean, b.lean), head: m(a.head, b.head), shrug: m(a.shrug, b.shrug), bob: m(a.bob, b.bob),
    armN: m2(a.armN, b.armN), armF: m2(a.armF, b.armF), legN: m2(a.legN, b.legN), legF: m2(a.legF, b.legF),
  };
};

/**
 * Side-view walk, phase in radians (one full cycle = 2π). Built on the
 * contact → down → passing → up cycle: the knee is straight at contact (leg
 * forward), bends most mid-swing, the arms swing opposite the same-side leg
 * with elbows flexed forward, and the body is lowest at contact.
 */
export const walkPose = (ph: number, amp = 1): Pose => {
  const leg = (p: number): [number, number] => [30 * amp * Math.sin(p), -(8 + 55 * amp * Math.max(0, Math.cos(p)))];
  const arm = (p: number): [number, number] => [-26 * amp * Math.sin(p), 18 + 16 * Math.max(0, Math.sin(p))];
  return {
    lean: 6, legN: leg(ph), legF: leg(ph + Math.PI), armN: arm(ph), armF: arm(ph + Math.PI),
    bob: -4 * Math.abs(Math.cos(ph)),
  };
};

const rad = (d: number) => (d * Math.PI) / 180;
const dir = (deg: number, len: number) => [Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len];

/** Joint positions in local space for a pose, a view and (optionally) an explicit yaw. */
export const joints = (pose: Pose, view: View = "side", yaw: number = VIEW_YAW[view]) => {
  const lean = pose.lean ?? 0;
  const shrug = (pose.shrug ?? 0) * 10;
  const bob = pose.bob ?? 0;
  const [nx0, ny0] = dir(180 - lean, RIG.neck);
  const nx = nx0 + RIG.chestForward * yaw;
  const ny = ny0 + bob;
  // facing the camera the shoulders are the torso corners; in profile both sit at the back of the chest
  const shN: [number, number] = [nx + lerp(RIG.shoulderFront, -RIG.shoulderBack, yaw), ny + RIG.shoulderDrop - shrug];
  const shF: [number, number] = [nx - lerp(RIG.shoulderFront, RIG.shoulderBack + 4, yaw), ny + RIG.shoulderDrop - shrug];
  const out = outward(view);
  // front view: the far arm's "outward" is −x
  const mir = (a: [number, number], far: boolean): [number, number] => (out && far ? [-a[0], -a[1]] : a);
  const limb = (root: [number, number], a: [number, number], l1: number, l2: number, lim: [number, number], far: boolean) => {
    const ang: [number, number] = [a[0], clamp(a[1], lim)];
    const [a0, a1] = mir(ang, far);
    const [ax, ay] = dir(a0, l1);
    const [bx, by] = dir(a0 + a1, l2);
    return { root, mid: [root[0] + ax, root[1] + ay] as [number, number], end: [root[0] + ax + bx, root[1] + ay + by] as [number, number], ang: [a0, a1] as [number, number] };
  };
  const hx = lerp(RIG.hipFront, RIG.hipSide, yaw);
  const hipN: [number, number] = [hx, bob];
  const hipF: [number, number] = [-hx, bob];
  const elbow = out ? ELBOW_FRONT : ELBOW_SIDE;
  return {
    neck: [nx, ny] as [number, number],
    head: [nx, ny - RIG.headGap - shrug * 0.4] as [number, number],
    shN, shF, bob, yaw,
    armN: limb(shN, pose.armN ?? [0, 0], RIG.upperArm, RIG.foreArm, elbow, false),
    armF: limb(shF, pose.armF ?? [0, 0], RIG.upperArm, RIG.foreArm, elbow, true),
    legN: limb(hipN, pose.legN ?? [0, 0], RIG.thigh, RIG.shin, KNEE, false),
    legF: limb(hipF, pose.legF ?? [0, 0], RIG.thigh, RIG.shin, KNEE, true),
  };
};

/** World position of a hand: attach held props here, never by guesswork. */
export const handPos = (x: number, y: number, s: number, facing: 1 | -1, pose: Pose, which: "N" | "F" = "N", view: View = "side", yaw?: number): [number, number] => {
  const h = joints(pose, view, yaw)[which === "N" ? "armN" : "armF"].end;
  return [x + h[0] * s * facing, y + h[1] * s];
};

/** World position of the head centre (speech bubbles, rings, glows, label clearance). */
export const headPos = (x: number, y: number, s: number, facing: 1 | -1, pose: Pose, view: View = "side", yaw?: number): [number, number] => {
  const h = joints(pose, view, yaw).head;
  return [x + h[0] * s * facing, y + h[1] * s];
};

/** Floor level under a standing character (feet bottom). */
export const floorY = (y: number, s: number) => y + (RIG.thigh + RIG.shin + 6) * s;

/** Seated layout derived from the leg lengths, so feet reach the floor and the table meets the hands. */
export const seatLayout = (hipY: number, s: number) => ({
  seatY: hipY + 8 * s,
  floorY: hipY + (RIG.shin + 8) * s,
  chairLegs: RIG.shin * s,
  tableTopY: hipY - 60 * s,
  tableH: (RIG.shin + 68) * s,
});

// ─── Drawing ───────────────────────────────────────────────────────────────────

const Limb: React.FC<{
  j: { root: [number, number]; mid: [number, number]; end: [number, number]; ang: [number, number] };
  w: number; color: string; end: "hand" | "foot"; paint?: string; shadow?: boolean; facing: 1 | -1;
}> = ({ j, w, color, end, paint, shadow, facing }) => {
  const d = `M${j.root[0]},${j.root[1]} L${j.mid[0]},${j.mid[1]} L${j.end[0]},${j.end[1]}`;
  const [ex, ey] = j.end;
  const fa = (Math.atan2(ey - j.mid[1], ex - j.mid[0]) * 180) / Math.PI; // forearm / shin direction
  return (
    <g strokeLinecap="round" strokeLinejoin="round" fill="none">
      {/* soft contact shadow under the limb, not an outline */}
      {shadow && !paint && <path d={d} stroke={C.ink} strokeWidth={w + 7} opacity={0.16} transform="translate(2,5)" />}
      <path d={d} stroke={paint ?? color} strokeWidth={w} />
      {end === "hand" ? (
        // mitten in line with the forearm, thumb toward the body
        <g transform={`translate(${ex},${ey}) rotate(${fa})`}>
          <ellipse cx={6} cy={0} rx={w * 0.8} ry={w * 0.62} fill={paint ?? C.ink} stroke="none" />
          <circle cx={1} cy={-w * 0.55 * facing} r={w * 0.3} fill={paint ?? C.ink} stroke="none" />
        </g>
      ) : (
        // shoe: toe forward; tilts toe-down when the leg trails behind
        <g transform={`translate(${ex},${ey}) rotate(${Math.max(-30, Math.min(30, -(j.ang[0] + j.ang[1]) * 0.45))})`}>
          <path d="M-10,-4 L12,-4 Q22,-2 22,5 L-10,5 Z" fill={paint ?? C.ink} stroke="none" />
        </g>
      )}
    </g>
  );
};

/**
 * The face marks turn with the head: at yaw 0 both eyes are centred; as yaw grows
 * the marks slide toward the leading edge, the far eye narrows and vanishes in
 * profile, and the mouth and brows squash toward the front of the head.
 */
export const Face: React.FC<{ expr: Expr; look?: [number, number]; blink?: boolean; glasses?: boolean; view?: View; yaw?: number }> = ({
  expr, look = [0, 0], blink, glasses, view = "side", yaw = VIEW_YAW[view],
}) => {
  const fx = 24 * yaw + look[0] * 10;
  const fy = -6 + look[1] * 8;
  const st = { stroke: C.face, strokeWidth: 4.5, strokeLinecap: "round" as const, fill: "none" };
  // index 0 = far eye, 1 = near eye
  const eyes: [number, number][] = [[fx - 15 * (1 - 0.5 * yaw), fy], [fx + 15 * (1 - 0.2 * yaw), fy]];
  const farScale = Math.max(0, 1 - yaw * 1.05);
  const eyeT = (i: number) => (i === 0 ? `translate(${eyes[0][0]},0) scale(${Math.max(farScale, 0.001)},1) translate(${-eyes[0][0]},0)` : undefined);
  const drawEye = ([x, y]: [number, number], i: number): React.ReactNode => {
    if (blink) return <line x1={x - 6} y1={y + 1} x2={x + 6} y2={y + 1} {...st} />;
    if (expr === "happy") return <path d={`M${x - 7},${y + 3} Q${x},${y - 7} ${x + 7},${y + 3}`} {...st} />;
    if (expr === "laugh") return <path d={i ? `M${x + 6},${y - 5} L${x - 4},${y} L${x + 6},${y + 5}` : `M${x - 6},${y - 5} L${x + 4},${y} L${x - 6},${y + 5}`} {...st} />;
    if (expr === "shock" || expr === "worry")
      return (
        <g>
          <circle cx={x} cy={y} r={8} {...st} strokeWidth={4} />
          {expr === "worry" && <circle cx={x + 2 + look[0] * 3} cy={y + 1} r={2.6} fill={C.face} />}
        </g>
      );
    if (expr === "smug" || expr === "deadpan")
      return (
        <g>
          <line x1={x - 7} y1={y - 1} x2={x + 7} y2={y - 1} {...st} />
          <circle cx={x + look[0] * 2} cy={y + 3.5} r={3} fill={C.face} />
        </g>
      );
    return <ellipse cx={x + look[0] * 2} cy={y} rx={4} ry={5.5} fill={C.face} />;
  };
  const eyeEls = eyes.map((e, i) => (i === 0 && farScale < 0.05 ? null : <g key={i} transform={eyeT(i)}>{drawEye(e, i)}</g>));

  const my = fy + 24;
  let mouth: React.ReactNode;
  switch (expr) {
    case "smile":
    case "happy":
      mouth = <path d={`M${fx - 12},${my - 2} Q${fx},${my + 10} ${fx + 12},${my - 2}`} {...st} />;
      break;
    case "smug":
      mouth = <path d={`M${fx - 4},${my} Q${fx + 6},${my + 6} ${fx + 14},${my - 4}`} {...st} />;
      break;
    case "shock":
      mouth = <ellipse cx={fx} cy={my + 2} rx={6.5} ry={9} {...st} strokeWidth={4} />;
      break;
    case "laugh":
      mouth = <path d={`M${fx - 13},${my - 3} L${fx + 13},${my - 3} Q${fx + 10},${my + 14} ${fx},${my + 14} Q${fx - 10},${my + 14} ${fx - 13},${my - 3} Z`} fill={C.face} />;
      break;
    case "worry":
      mouth = <path d={`M${fx - 11},${my + 2} q4,-5 7,0 q4,5 8,0 q4,-5 7,0`} {...st} strokeWidth={4} />;
      break;
    case "think":
      mouth = <line x1={fx + 2} y1={my + 1} x2={fx + 12} y2={my - 1} {...st} />;
      break;
    case "determined":
      mouth = <line x1={fx - 8} y1={my + 2} x2={fx + 8} y2={my + 2} {...st} />;
      break;
    default:
      mouth = <line x1={fx - 7} y1={my + 1} x2={fx + 7} y2={my + 1} {...st} />;
  }

  let brows: React.ReactNode = null;
  if (expr === "think") brows = <line x1={fx + 8} y1={fy - 16} x2={fx + 22} y2={fy - 20} {...st} strokeWidth={4} />;
  if (expr === "worry")
    brows = (
      <>
        {farScale >= 0.05 && <line x1={fx - 22} y1={fy - 14} x2={fx - 9} y2={fy - 18} {...st} strokeWidth={4} />}
        <line x1={fx + 9} y1={fy - 18} x2={fx + 22} y2={fy - 14} {...st} strokeWidth={4} />
      </>
    );
  if (expr === "determined")
    brows = (
      <>
        {farScale >= 0.05 && <line x1={fx - 22} y1={fy - 17} x2={fx - 9} y2={fy - 12} {...st} strokeWidth={4} />}
        <line x1={fx + 9} y1={fy - 12} x2={fx + 22} y2={fy - 17} {...st} strokeWidth={4} />
      </>
    );

  // mouth and brows squash toward the leading edge as the head turns
  const squash = `translate(${fx + 5 * yaw},0) scale(${1 - 0.42 * yaw},1) translate(${-fx},0)`;
  return (
    <g>
      {eyeEls}
      <g transform={squash}>{mouth}{brows}</g>
      {glasses &&
        eyes.map(([x, y], i) => (i === 0 && farScale < 0.05 ? null : (
          <g key={`g${i}`} transform={eyeT(i)}><circle cx={x} cy={y} r={11} fill="none" stroke={C.face} strokeWidth={3} /></g>
        )))}
      {glasses && farScale >= 0.05 && <line x1={fx - 4} y1={fy} x2={fx + 4} y2={fy} stroke={C.face} strokeWidth={3} />}
    </g>
  );
};

const Body: React.FC<{
  pose: Pose; outfit: Outfit; view: View; yaw: number; facing: 1 | -1; paint?: string; expr: Expr; look?: [number, number]; blink?: boolean;
  brainGlow?: number;
}> = ({ pose, outfit, view, yaw, facing, paint, expr, look, blink, brainGlow = 0 }) => {
  const o = OUTFIT[outfit];
  const lean = pose.lean ?? 0;
  const J = joints(pose, view, yaw);
  const [nx, ny] = J.neck;
  const fill = (c: string) => paint ?? c;
  const brimForward = yaw > 0.25;
  // torso narrows as the body turns; the chest moves forward of the hips and the back flattens
  const hw = lerp(RIG.torsoFront[0], RIG.torsoSide[0], yaw); // half width at the shoulders
  const hb = lerp(RIG.torsoFront[1], RIG.torsoSide[1], yaw); // half width at the hips
  const tx = RIG.chestForward * yaw;                          // chest offset (torso space)
  const fb = 4 + 8 * yaw;                                     // chest bulge (leading side)
  const bb = 4 - 2 * yaw;                                     // back bulge (trailing side)
  const sh = -RIG.neck + RIG.shoulderDrop - 6; // shoulder line y (torso space)
  const torso = `M${-hw},${sh + 10} Q${-hw},${sh - 10} ${-hw + 16},${sh - 12} L${hw - 16},${sh - 12} Q${hw},${sh - 10} ${hw},${sh + 10} Q${hw + fb},-40 ${hb},4 L${-hb},4 Q${-hw - bb},-40 ${-hw},${sh + 10} Z`;
  const near = { w: 18, color: o.sleeve, end: "hand" as const, paint, shadow: true, facing };
  const farA = { w: 17, color: o.topDark, end: "hand" as const, paint, facing };
  const leg = { w: 15, color: o.legs, end: "foot" as const, paint, facing };
  // clothing details sit on the centre line facing the camera and slide to the leading edge in profile
  const seamX = lerp(0, hw - 8, yaw);
  return (
    <g>
      <Limb j={J.armF} {...farA} />
      <Limb j={J.legF} {...leg} />
      <g transform={`translate(${tx},${J.bob}) rotate(${-lean})`}>
        <path d={torso} fill={fill(o.top)} />
        {o.long && <path d={`M${-hb - 1},-10 L${-hb - 7},54 L${hb + 3},54 L${hb + 1},-10 Z`} fill={fill(o.top)} />}
        {!paint && (
          <>
            {/* shade on the far side */}
            <path d={`M${-hw},${sh + 10} Q${-hw - bb},-40 ${-hb},4 L${-hb + 14},4 Q${-hw + 10},-40 ${-hw + 12},${sh - 8} Q${-hw},${sh - 6} ${-hw},${sh + 10} Z`} fill={o.topDark} opacity={0.5} />
            {outfit === "hero" && (
              <>
                <line x1={seamX - 10 * (1 - yaw) + 2 * yaw} y1={-94} x2={seamX - 9 * (1 - yaw) + 4 * yaw} y2={-66} stroke={C.cream} strokeWidth={3} strokeLinecap="round" />
                <line x1={seamX + 10 * (1 - yaw) + 6 * yaw} y1={-94} x2={seamX + 11 * (1 - yaw) + 8 * yaw} y2={-68} stroke={C.cream} strokeWidth={3} strokeLinecap="round" />
                <path d={`M${-hb + 12},-26 L${hb - 10},-26`} stroke={o.topDark} strokeWidth={3} />
              </>
            )}
            {outfit === "scientist" && <line x1={seamX} y1={-96} x2={seamX - 2 * yaw} y2={50} stroke="#bdbab2" strokeWidth={3} />}
            {outfit === "ivory" && (
              <>
                <line x1={seamX} y1={-92} x2={seamX + 2 * yaw} y2={0} stroke="#cfc6b0" strokeWidth={2.5} />
                <circle cx={seamX + 6 * (1 - yaw) + 2 * yaw} cy={-78} r={6.5} fill="#d9472b" />
                <circle cx={seamX + 4.5 * (1 - yaw) + 0.5 * yaw} cy={-79.5} r={2} fill="#ff9a7a" />
                {[-56, -34, -12].map((yy) => <circle key={yy} cx={seamX + 6 * (1 - yaw) + 2 * yaw} cy={yy} r={4.6} fill="#f6f1e6" />)}
              </>
            )}
            {outfit === "oldman" && <line x1={seamX} y1={-94} x2={seamX - 2 * yaw} y2={50} stroke="#4f3b28" strokeWidth={3} />}
            <path d={`M${hw - 14},-92 Q${hw - 2},-60 ${hw - 8},-24`} stroke="white" strokeOpacity={0.16} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
      <Limb j={J.legN} {...leg} />
      {/* short neck, then the hood collar over it */}
      <line x1={nx} y1={ny + 2} x2={J.head[0]} y2={J.head[1] + 30} stroke={fill(C.ink)} strokeWidth={22} strokeLinecap="round" />
      {(outfit === "hero" || outfit === "sister") && (
        <path d={`M${nx - 36 + 8 * yaw},${ny + 4} Q${nx - 32 + 8 * yaw},${ny - 14} ${nx - 6},${ny - 12} Q${nx + 20},${ny - 11} ${nx + 32 - 4 * yaw},${ny + 4} Q${nx},${ny + 16} ${nx - 36 + 8 * yaw},${ny + 4} Z`} fill={fill(o.topDark)} />
      )}
      {(outfit === "scientist" || outfit === "ivory" || outfit === "oldman") && (
        <path d={`M${nx - 26 + 6 * yaw},${ny + 6} L${nx - 10 + 4 * yaw},${ny - 8} L${nx + 2 * yaw},${ny + 4} L${nx + 10 + 2 * yaw},${ny - 8} L${nx + 26},${ny + 6} Z`} fill={fill(o.topDark)} />
      )}
      <g transform={`translate(${J.head[0]},${J.head[1]}) rotate(${-(pose.head ?? 0) - lean * 0.3})`}>
        <circle r={RIG.headR} fill={fill(C.ink)} />
        {!paint && (
          <>
            <path d="M-36,-42 A55,55 0 0 1 26,-52" stroke="white" strokeOpacity={0.13} strokeWidth={6} fill="none" strokeLinecap="round" />
            <circle cx={-32} cy={-36} r={3.5} fill="white" opacity={0.35} />
            {brainGlow > 0 && (
              <g opacity={brainGlow} transform={`translate(${-8 + 4 * yaw},-30) scale(0.72)`}>
                <circle cx={4} cy={-18} r={30} fill={C.gold} opacity={0.25} />
                <path d="M-10,-24 q0,-12 12,-12 q4,-6 12,-2 q10,0 10,10 q6,6 0,13 q-2,9 -12,8 q-6,6 -14,1 q-10,0 -9,-9 q-6,-5 1,-9 z"
                  fill="none" stroke={C.gold} strokeWidth={3.5} />
                <path d="M4,-34 q-4,8 2,14 q-6,6 0,12" fill="none" stroke={C.gold} strokeWidth={2.5} />
              </g>
            )}
            <g transform="scale(1.3)"><Face expr={expr} look={look} blink={blink} glasses={outfit === "scientist"} yaw={yaw} /></g>
          </>
        )}
        {outfit === "friend" && (
          <g>
            <path d="M-60,-14 A62,62 0 0 1 58,-24 L60,-14 Z" fill={fill(C.cap)} />
            {brimForward ? (
              <path d="M36,-22 Q84,-26 102,-12 Q72,-7 40,-10 Z" fill={fill(C.capDark)} />
            ) : (
              <path d="M-50,-20 Q0,-2 50,-20 Q0,-8 -50,-20 Z" fill={fill(C.capDark)} />
            )}
            {!paint && <path d="M-34,-36 Q-8,-52 22,-46" stroke="white" strokeOpacity={0.3} strokeWidth={5} fill="none" strokeLinecap="round" />}
          </g>
        )}
        {outfit === "oldman" && (
          <g>
            <path d="M-60,-16 A62,62 0 0 1 58,-26 L60,-16 Z" fill={fill("#6a6a72")} />
            {brimForward ? (
              <path d="M34,-24 Q80,-26 96,-16 Q70,-10 38,-12 Z" fill={fill("#55555c")} />
            ) : (
              <path d="M-52,-22 Q0,-6 52,-22 Q0,-12 -52,-22 Z" fill={fill("#55555c")} />
            )}
          </g>
        )}
        {outfit === "sister" && (
          <g fill={fill(C.ink)}>
            <circle cx={-52 + 10 * yaw} cy={-48} r={19} />
            <circle cx={42 - 30 * yaw} cy={-56} r={19} />
          </g>
        )}
      </g>
      <Limb j={J.armN} {...near} />
    </g>
  );
};

/** A full character. (x, y) is the hip point; standing height ≈ 300·s. `yaw` overrides the view's angle (0 front … 1 profile) for turns. */
export const Character: React.FC<{
  x: number; y: number; s?: number; facing?: 1 | -1; view?: View; yaw?: number; outfit?: Outfit; pose?: Pose;
  expr?: Expr; look?: [number, number]; blink?: boolean; rim?: string; rimDir?: [number, number];
  brainGlow?: number;
}> = ({ x, y, s = 1, facing = 1, view = "side", yaw, outfit = "hero", pose, expr = "neutral", look, blink, rim = C.rim, rimDir = [-1, -0.5], brainGlow }) => {
  const p = pose ?? (view === "front" ? POSES.front : POSES.stand);
  const yw = yaw ?? VIEW_YAW[view];
  return (
    <g transform={`translate(${x},${y}) scale(${s * facing},${s})`}>
      <g transform={`translate(${rimDir[0] * 5 * facing},${rimDir[1] * 5})`}>
        <Body pose={p} outfit={outfit} view={view} yaw={yw} facing={facing} paint={rim} expr={expr} />
      </g>
      <Body pose={p} outfit={outfit} view={view} yaw={yw} facing={facing} expr={expr} look={look} blink={blink} brainGlow={brainGlow} />
    </g>
  );
};

/** Blink every ~3.7 s (2 frames), phase per character. */
export const blinkAt = (frame: number, phase = 0) => (frame + phase) % 89 < 2;
