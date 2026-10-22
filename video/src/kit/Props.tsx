import React from "react";
import { C } from "../theme";

/** House fly, side-ish view. Size ≈ 60·s px. `t` (seconds) drives the wing flutter. */
export const Fly: React.FC<{ x: number; y: number; s?: number; t: number; flap?: number; rot?: number; rub?: number }> = ({
  x, y, s = 1, t, flap = 1, rot = 0, rub = 0,
}) => {
  const w = Math.sin(t * 160) * 28 * flap;
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      {/* wings */}
      <ellipse cx={-6} cy={-16} rx={22} ry={9} fill="#dfe8f5" opacity={0.55} transform={`rotate(${-25 + w} 4 -6)`} />
      <ellipse cx={-2} cy={-18} rx={22} ry={9} fill="#ffffff" opacity={0.4} transform={`rotate(${-40 - w * 0.8} 4 -6)`} />
      {/* legs */}
      {[-10, 0, 10].map((lx, i) => (
        <path key={i} d={`M${lx},6 q${-4 + i * 2},10 ${-8 + i * 4},16`} stroke={C.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      ))}
      <path d={`M14,4 q8,${6 - rub * 6} ${4 + rub * 6},14`} stroke={C.ink} strokeWidth={2.5} fill="none" strokeLinecap="round" />
      {/* body */}
      <ellipse cx={-10} cy={2} rx={20} ry={11} fill="#1b1418" />
      <ellipse cx={-14} cy={-2} rx={10} ry={4} fill="white" opacity={0.18} />
      <circle cx={12} cy={-2} r={11} fill="#120c10" />
      {/* big red compound eyes */}
      <circle cx={17} cy={-6} r={7.5} fill="#b2222a" />
      <circle cx={19} cy={-8} r={2.4} fill="white" opacity={0.8} />
    </g>
  );
};

/** White mug, ~120·s wide. */
export const Cup: React.FC<{ x: number; y: number; s?: number; steam?: number; t?: number }> = ({ x, y, s = 1, steam = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {steam > 0 &&
      [0, 1].map((i) => (
        <path
          key={i}
          d={`M${-14 + i * 24},-70 q${-10 + Math.sin(t * 2 + i) * 6},-30 0,-60 q10,-30 0,-60`}
          stroke="white" strokeOpacity={0.18 * steam} strokeWidth={8} fill="none" strokeLinecap="round"
        />
      ))}
    <path d="M44,-50 q34,0 32,28 q-2,26 -36,24" stroke="#e9e4dc" strokeWidth={11} fill="none" />
    <path d="M-50,-66 L50,-66 L44,0 Q0,12 -44,0 Z" fill="#f1ede6" />
    <path d="M-50,-66 L-30,-66 L-26,4 Q-36,2 -44,0 Z" fill="#cfc8bd" />
    <ellipse cx={0} cy={-66} rx={50} ry={11} fill="#e8e2d8" />
    <ellipse cx={0} cy={-64} rx={42} ry={8} fill="#5a3522" />
    <path d="M30,-56 Q36,-30 32,-8" stroke="white" strokeOpacity={0.6} strokeWidth={5} fill="none" strokeLinecap="round" />
  </g>
);

/** Smartphone lying flat-ish (side tilt via rot). ~150·s long. */
export const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; glow?: number }> = ({ x, y, s = 1, rot = 0, glow = 0.8 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-40} width={160} height={80} rx={16} fill={C.rim} />
    <rect x={-78} y={-42} width={156} height={78} rx={15} fill="#121019" />
    <rect x={-68} y={-34} width={136} height={62} rx={8} fill="#2a5fa8" opacity={glow} />
    <rect x={-68} y={-34} width={136} height={62} rx={8} fill="url(#phoneShine)" />
    <defs>
      <linearGradient id="phoneShine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="white" stopOpacity={0.35} />
        <stop offset="0.45" stopColor="white" stopOpacity={0} />
      </linearGradient>
    </defs>
  </g>
);

/** Café table, side view. (x, y) = centre of the tabletop. */
export const Table: React.FC<{ x: number; y: number; s?: number; h?: number }> = ({ x, y, s = 1, h = 190 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-8} y={0} width={16} height={h} fill={C.ink} />
    <ellipse cx={0} cy={h} rx={60} ry={10} fill={C.ink} />
    <ellipse cx={0} cy={0} rx={150} ry={22} fill={C.tableTop} />
    <path d="M-150,0 Q0,30 150,0 L150,10 Q0,42 -150,10 Z" fill={C.table} />
    <ellipse cx={-40} cy={-6} rx={70} ry={8} fill="white" opacity={0.08} />
  </g>
);

/** Bistro chair, side view facing right. (x, y) = seat centre. */
export const Chair: React.FC<{ x: number; y: number; s?: number; facing?: 1 | -1; legs?: number }> = ({ x, y, s = 1, facing = 1, legs = 150 }) => (
  <g transform={`translate(${x},${y}) scale(${s * facing},${s})`} stroke={C.ink} strokeWidth={7} fill="none" strokeLinecap="round">
    <line x1={-40} y1={0} x2={40} y2={0} strokeWidth={10} />
    <line x1={-36} y1={0} x2={-44} y2={legs} />
    <line x1={36} y1={0} x2={44} y2={legs} />
    <path d="M-40,0 Q-52,-80 -40,-140" />
    <path d="M-40,-140 Q-20,-150 -16,-130" />
  </g>
);
