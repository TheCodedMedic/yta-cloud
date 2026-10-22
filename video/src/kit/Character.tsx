import React from "react";
import { C } from "../theme";

// Angle convention (degrees): a limb hangs straight down at 0; +90 points forward
// (the way the character faces), -90 backward, 180 straight up. Forearm / shin
// angles are relative to the upper limb.
export type Pose = {
  lean?: number; // torso tilt, + leans forward
  head?: number; // head tilt
  armN?: [number, number]; // near arm: shoulder, elbow
  armF?: [number, number]; // far arm
  legN?: [number, number]; // near leg: hip, knee
  legF?: [number, number];
  shrug?: number; // 0..1 shoulders up
};

export type Expr =
  | "neutral" | "smile" | "happy" | "smug" | "shock" | "think"
  | "deadpan" | "laugh" | "worry" | "determined";

export type Outfit = "hero" | "friend" | "scientist" | "sister" | "extra";

const OUTFIT: Record<Outfit, { top: string; topDark: string; legs: string; long?: boolean }> = {
  hero: { top: C.hoodie, topDark: C.hoodieDark, legs: C.ink },
  friend: { top: C.friendTop, topDark: "#1d1c2a", legs: "#1a1622" },
  scientist: { top: C.coat, topDark: "#bdbab2", legs: C.ink, long: true },
  sister: { top: "#c56aa8", topDark: "#93487c", legs: C.ink },
  extra: { top: "#5b5470", topDark: "#433d55", legs: "#221c2c" },
};

export const POSES = {
  stand: { lean: 0, armN: [8, -6], armF: [-6, -4], legN: [4, 0], legF: [-4, 0] },
  sit: { lean: -4, armN: [30, -70], armF: [24, -64], legN: [88, -92], legF: [82, -88] },
  sitTable: { lean: 6, armN: [55, -10], armF: [48, -12], legN: [88, -92], legF: [82, -88] },
  shrug: { lean: 0, armN: [30, 95], armF: [-30, -95], legN: [4, 0], legF: [-4, 0], shrug: 1 },
  point: { lean: 4, armN: [100, -10], armF: [-6, -4], legN: [4, 0], legF: [-4, 0] },
  armUp: { lean: 0, armN: [165, 10], armF: [-6, -4], legN: [4, 0], legF: [-4, 0] },
  fistsUp: { lean: 2, armN: [60, 100], armF: [50, 105], legN: [10, -6], legF: [-8, 0] },
  hero: { lean: 0, armN: [20, -30], armF: [-20, 30], legN: [14, 0], legF: [-12, 0] },
} satisfies Record<string, Pose>;

export const mixPose = (a: Pose, b: Pose, u: number): Pose => {
  const m = (x = 0, y = 0) => x + (y - x) * u;
  const m2 = (x: [number, number] = [0, 0], y: [number, number] = [0, 0]): [number, number] => [m(x[0], y[0]), m(x[1], y[1])];
  return {
    lean: m(a.lean, b.lean), head: m(a.head, b.head), shrug: m(a.shrug, b.shrug),
    armN: m2(a.armN, b.armN), armF: m2(a.armF, b.armF), legN: m2(a.legN, b.legN), legF: m2(a.legF, b.legF),
  };
};

const rad = (d: number) => (d * Math.PI) / 180;
const dir = (deg: number, len: number) => [Math.sin(rad(deg)) * len, Math.cos(rad(deg)) * len];

const Limb: React.FC<{
  x: number; y: number; a: [number, number]; l1: number; l2: number;
  w1: number; w2: number; c1: string; c2: string; end: "hand" | "foot"; paint?: string; ink: string;
}> = ({ x, y, a, l1, l2, w1, w2, c1, c2, end, paint, ink }) => {
  const [dx1, dy1] = dir(a[0], l1);
  const [dx2, dy2] = dir(a[0] + a[1], l2);
  const ex = x + dx1, ey = y + dy1, hx = ex + dx2, hy = ey + dy2;
  return (
    <g strokeLinecap="round">
      <line x1={x} y1={y} x2={ex} y2={ey} stroke={paint ?? c1} strokeWidth={w1} />
      <line x1={ex} y1={ey} x2={hx} y2={hy} stroke={paint ?? c2} strokeWidth={w2} />
      {end === "hand" ? (
        <circle cx={hx} cy={hy} r={w2 * 0.62} fill={paint ?? ink} />
      ) : (
        <ellipse cx={hx + 7} cy={hy + 2} rx={12} ry={6} fill={paint ?? ink} />
      )}
    </g>
  );
};

export const Face: React.FC<{ expr: Expr; look?: [number, number]; blink?: boolean; glasses?: boolean }> = ({
  expr, look = [0, 0], blink, glasses,
}) => {
  const fx = 12 + look[0] * 10;
  const fy = -6 + look[1] * 8;
  const st = { stroke: C.face, strokeWidth: 4.5, strokeLinecap: "round" as const, fill: "none" };
  const eyes: [number, number][] = [[fx - 15, fy], [fx + 15, fy]];
  let eyeEls: React.ReactNode;
  if (blink) {
    eyeEls = eyes.map(([x, y], i) => <line key={i} x1={x - 6} y1={y + 1} x2={x + 6} y2={y + 1} {...st} />);
  } else if (expr === "happy" || expr === "laugh" && false) {
    eyeEls = eyes.map(([x, y], i) => <path key={i} d={`M${x - 7},${y + 3} Q${x},${y - 7} ${x + 7},${y + 3}`} {...st} />);
  } else if (expr === "laugh") {
    eyeEls = eyes.map(([x, y], i) => (
      <path key={i} d={i ? `M${x + 6},${y - 5} L${x - 4},${y} L${x + 6},${y + 5}` : `M${x - 6},${y - 5} L${x + 4},${y} L${x - 6},${y + 5}`} {...st} />
    ));
  } else if (expr === "shock" || expr === "worry") {
    eyeEls = eyes.map(([x, y], i) => (
      <g key={i}>
        <circle cx={x} cy={y} r={8} {...st} strokeWidth={4} />
        {expr === "worry" && <circle cx={x + 2 + look[0] * 3} cy={y + 1} r={2.6} fill={C.face} />}
      </g>
    ));
  } else if (expr === "smug" || expr === "deadpan") {
    eyeEls = eyes.map(([x, y], i) => (
      <g key={i}>
        <line x1={x - 7} y1={y - 1} x2={x + 7} y2={y - 1} {...st} />
        <circle cx={x + look[0] * 2} cy={y + 3.5} r={3} fill={C.face} />
      </g>
    ));
  } else {
    eyeEls = eyes.map(([x, y], i) => <ellipse key={i} cx={x + look[0] * 2} cy={y} rx={4} ry={5.5} fill={C.face} />);
  }

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
        <line x1={fx - 22} y1={fy - 14} x2={fx - 9} y2={fy - 18} {...st} strokeWidth={4} />
        <line x1={fx + 9} y1={fy - 18} x2={fx + 22} y2={fy - 14} {...st} strokeWidth={4} />
      </>
    );
  if (expr === "determined")
    brows = (
      <>
        <line x1={fx - 22} y1={fy - 17} x2={fx - 9} y2={fy - 12} {...st} strokeWidth={4} />
        <line x1={fx + 9} y1={fy - 12} x2={fx + 22} y2={fy - 17} {...st} strokeWidth={4} />
      </>
    );

  return (
    <g>
      {eyeEls}
      {mouth}
      {brows}
      {glasses &&
        eyes.map(([x, y], i) => <circle key={`g${i}`} cx={x} cy={y} r={11} fill="none" stroke={C.face} strokeWidth={3} />)}
      {glasses && <line x1={fx - 4} y1={fy} x2={fx + 4} y2={fy} stroke={C.face} strokeWidth={3} />}
    </g>
  );
};

const Body: React.FC<{
  pose: Pose; outfit: Outfit; paint?: string; expr: Expr; look?: [number, number]; blink?: boolean;
  brainGlow?: number;
}> = ({ pose, outfit, paint, expr, look, blink, brainGlow = 0 }) => {
  const o = OUTFIT[outfit];
  const lean = pose.lean ?? 0;
  const shrug = (pose.shrug ?? 0) * 10;
  const neck = dir(180 - lean, 100);
  const [nx, ny] = [neck[0], neck[1]];
  const sh = { x: nx - 2, y: ny + 16 - shrug };
  const armArgs = (a: [number, number], near: boolean) => ({
    x: sh.x + (near ? 6 : -6), y: sh.y, a, l1: 56, l2: 52, w1: 18, w2: 16,
    c1: near ? o.top : o.topDark, c2: near ? o.top : o.topDark, end: "hand" as const, paint, ink: C.ink,
  });
  const legArgs = (a: [number, number], near: boolean) => ({
    x: near ? 8 : -8, y: -2, a, l1: 58, l2: 56, w1: 15, w2: 13,
    c1: o.legs, c2: o.legs, end: "foot" as const, paint, ink: C.ink,
  });
  const fill = (c: string) => paint ?? c;
  const torsoLen = o.long ? 150 : 0;
  return (
    <g>
      <Limb {...armArgs(pose.armF ?? [0, 0], false)} />
      <Limb {...legArgs(pose.legF ?? [0, 0], false)} />
      <g transform={`rotate(${-lean})`}>
        <path
          d={`M-33,-102 Q-46,-55 -37,4 L35,4 Q44,-55 31,-102 Q0,-114 -33,-102 Z`}
          fill={fill(o.top)}
        />
        {o.long && <path d="M-37,-10 L-42,52 L38,52 L35,-10 Z" fill={fill(o.top)} />}
        {!paint && (
          <>
            <path d="M-33,-102 Q-46,-55 -37,4 L-22,4 Q-30,-55 -16,-106 Z" fill={o.topDark} opacity={0.55} />
            {outfit === "hero" && (
              <>
                <ellipse cx={-20} cy={-102} rx={20} ry={12} fill={o.topDark} />
                <line x1={12} y1={-98} x2={14} y2={-72} stroke={C.cream} strokeWidth={3} strokeLinecap="round" />
                <line x1={21} y1={-98} x2={23} y2={-74} stroke={C.cream} strokeWidth={3} strokeLinecap="round" />
                <path d="M-16,-26 L26,-26" stroke={o.topDark} strokeWidth={3} />
              </>
            )}
            {outfit === "scientist" && <line x1={4} y1={-100} x2={2} y2={50} stroke="#bdbab2" strokeWidth={3} />}
            {/* gloss streak */}
            <path d="M18,-94 Q32,-62 26,-24" stroke="white" strokeOpacity={0.16} strokeWidth={4} fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
      <Limb {...legArgs(pose.legN ?? [0, 0], true)} />
      <g transform={`translate(${nx},${ny - 8 - shrug * 0.4}) rotate(${-(pose.head ?? 0) - lean * 0.3}) translate(0,-58)`}>
        <circle r={62} fill={fill(C.ink)} />
        {!paint && (
          <>
            <path d="M-36,-42 A55,55 0 0 1 26,-52" stroke="white" strokeOpacity={0.13} strokeWidth={6} fill="none" strokeLinecap="round" />
            <circle cx={-32} cy={-36} r={3.5} fill="white" opacity={0.35} />
            {brainGlow > 0 && (
              <g opacity={brainGlow} transform="translate(-4,-22) scale(0.8)">
                <circle cx={4} cy={-18} r={30} fill={C.gold} opacity={0.25} />
                <path d="M-10,-24 q0,-12 12,-12 q4,-6 12,-2 q10,0 10,10 q6,6 0,13 q-2,9 -12,8 q-6,6 -14,1 q-10,0 -9,-9 q-6,-5 1,-9 z"
                  fill="none" stroke={C.gold} strokeWidth={3.5} />
                <path d="M4,-34 q-4,8 2,14 q-6,6 0,12" fill="none" stroke={C.gold} strokeWidth={2.5} />
              </g>
            )}
            <g transform="scale(1.3)"><Face expr={expr} look={look} blink={blink} glasses={outfit === "scientist"} /></g>
          </>
        )}
        {outfit === "friend" && (
          <g>
            <path d="M-60,-14 A62,62 0 0 1 58,-24 L60,-14 Z" fill={fill(C.cap)} />
            <path d="M36,-22 Q84,-26 102,-12 Q72,-7 40,-10 Z" fill={fill(C.capDark)} />
            {!paint && <path d="M-34,-36 Q-8,-52 22,-46" stroke="white" strokeOpacity={0.3} strokeWidth={5} fill="none" strokeLinecap="round" />}
          </g>
        )}
        {outfit === "sister" && (
          <g fill={fill(C.ink)}>
            <circle cx={-52} cy={-48} r={19} />
            <circle cx={42} cy={-56} r={19} />
          </g>
        )}
      </g>
      <Limb {...armArgs(pose.armN ?? [0, 0], true)} />
    </g>
  );
};

/** A full character. (x, y) is the hip point; height ≈ 380·s standing. */
export const Character: React.FC<{
  x: number; y: number; s?: number; facing?: 1 | -1; outfit?: Outfit; pose?: Pose;
  expr?: Expr; look?: [number, number]; blink?: boolean; rim?: string; rimDir?: [number, number];
  brainGlow?: number;
}> = ({ x, y, s = 1, facing = 1, outfit = "hero", pose = POSES.stand, expr = "neutral", look, blink, rim = C.rim, rimDir = [-1, -0.5], brainGlow }) => (
  <g transform={`translate(${x},${y}) scale(${s * facing},${s})`}>
    <g transform={`translate(${rimDir[0] * 5 * facing},${rimDir[1] * 5})`}>
      <Body pose={pose} outfit={outfit} paint={rim} expr={expr} />
    </g>
    <Body pose={pose} outfit={outfit} expr={expr} look={look} blink={blink} brainGlow={brainGlow} />
  </g>
);

/** Blink every ~3.7 s (2 frames), phase per character. */
export const blinkAt = (frame: number, phase = 0) => (frame + phase) % 89 < 2;
