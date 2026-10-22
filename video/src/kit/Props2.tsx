import React from "react";
import { C } from "../theme";

export const Plate: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={120} ry={26} fill="#e9e4dc" />
    <ellipse cx={0} cy={-3} rx={120} ry={26} fill="#f4f0ea" />
    <ellipse cx={0} cy={-3} rx={84} ry={16} fill="#e6e0d6" />
  </g>
);

/** Slice of toast; the buttered side is the top face (yellow). */
export const Toast: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-60,-40 Q-66,-62 -44,-62 Q-24,-74 0,-62 Q24,-74 44,-62 Q66,-62 60,-40 L60,50 Q60,60 50,60 L-50,60 Q-60,60 -60,50 Z" fill="#8a5a2b" />
    <path d="M-50,-34 Q-54,-50 -38,-50 Q-20,-60 0,-50 Q20,-60 38,-50 Q54,-50 50,-34 L50,44 Q50,50 44,50 L-44,50 Q-50,50 -50,44 Z" fill="#d9a55b" />
    <path d="M-40,-28 Q-20,-40 0,-30 Q22,-40 40,-28 L40,36 L-40,36 Z" fill="#f3d14a" opacity={0.9} />
    <ellipse cx={-8} cy={-6} rx={22} ry={12} fill="#fff1a0" opacity={0.7} />
  </g>
);

/** Waffle cone; the scoop is drawn separately so it can fall. */
export const Cone: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-34,0 L34,0 L4,120 Q0,126 -4,120 Z" fill="#d9a35a" />
    <path d="M-34,0 L34,0 L4,120 Q0,126 -4,120 Z" fill="url(#waffle)" />
    <defs>
      <pattern id="waffle" width={14} height={14} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0,0 L14,0 M0,0 L0,14" stroke="#b7813e" strokeWidth={2} />
      </pattern>
    </defs>
    <ellipse cx={0} cy={0} rx={36} ry={10} fill="#b7813e" />
  </g>
);

export const Scoop: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number }> = ({ x, y, s = 1, color = "#f5b7c8", rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle r={40} fill={color} />
    <path d="M-30,18 q10,14 22,6 q10,14 24,0" stroke={color} strokeWidth={10} fill="none" strokeLinecap="round" />
    <circle cx={-12} cy={-14} r={9} fill="white" opacity={0.5} />
    <circle cx={6} cy={-4} r={3} fill="#c9405e" />
    <circle cx={-18} cy={10} r={3} fill="#c9405e" />
  </g>
);

/** Red balloon with a string to `to` (world point); the string sags. */
export const Balloon: React.FC<{ x: number; y: number; s?: number; t: number; to?: [number, number]; sway?: number }> = ({ x, y, s = 1, t, to, sway = 1 }) => {
  const dx = Math.sin(t * 1.4) * 8 * sway;
  const bx = x + dx, by = y + Math.cos(t * 1.1) * 4 * sway;
  return (
    <g>
      {to && (
        <path d={`M${bx},${by + 62 * s} Q${(bx + to[0]) / 2 + 30 * s},${(by + to[1]) / 2 + 40 * s} ${to[0]},${to[1]}`} stroke="#f0e6d8" strokeWidth={2.5 * s} fill="none" />
      )}
      <g transform={`translate(${bx},${by}) scale(${s})`}>
        <ellipse cx={0} cy={0} rx={46} ry={56} fill="#d8232d" />
        <path d="M-8,52 L0,64 L8,52 Z" fill="#a51a22" />
        <ellipse cx={-16} cy={-20} rx={12} ry={18} fill="white" opacity={0.35} transform="rotate(-20 -16 -20)" />
        <path d="M-26,24 Q0,44 26,24" stroke="#ff8a90" strokeWidth={3} fill="none" opacity={0.5} />
      </g>
    </g>
  );
};

/** Dodgeball. */
export const Ball: React.FC<{ x: number; y: number; s?: number; color?: string; rot?: number }> = ({ x, y, s = 1, color = "#d8303a", rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <circle r={38} fill={color} />
    <path d="M-38,0 Q0,-18 38,0" stroke="white" strokeWidth={5} fill="none" opacity={0.75} />
    <path d="M-38,0 Q0,18 38,0" stroke="white" strokeWidth={5} fill="none" opacity={0.75} />
    <circle cx={-12} cy={-14} r={8} fill="white" opacity={0.4} />
  </g>
);

/** Desk monitor seen from behind-ish (side), glowing. */
export const Monitor: React.FC<{ x: number; y: number; s?: number; glow?: string }> = ({ x, y, s = 1, glow = "#4b7fe0" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-20} y={60} width={40} height={40} fill="#1b1622" />
    <rect x={-90} y={96} width={180} height={12} rx={6} fill="#1b1622" />
    <rect x={-150} y={-120} width={300} height={190} rx={10} fill="#11101a" />
    <rect x={-138} y={-108} width={276} height={166} rx={6} fill={glow} opacity={0.85} />
    <rect x={-138} y={-108} width={276} height={166} rx={6} fill="url(#monShine)" />
    <defs>
      <linearGradient id="monShine" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="white" stopOpacity={0.25} />
        <stop offset="0.5" stopColor="white" stopOpacity={0} />
      </linearGradient>
    </defs>
  </g>
);

/** Express train, side view, nose at the right end. `len` carriages. */
export const Train: React.FC<{ x: number; y: number; s?: number; len?: number; headlight?: number }> = ({ x, y, s = 1, len = 4, headlight = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {headlight > 0 && <ellipse cx={120} cy={-40} rx={420} ry={90} fill="#ffe9a8" opacity={0.18 * headlight} />}
    {Array.from({ length: len }, (_, i) => (
      <g key={i} transform={`translate(${-i * 420},0)`}>
        <rect x={-410} y={-120} width={400} height={130} rx={14} fill="#2b3550" />
        <rect x={-410} y={-120} width={400} height={44} rx={14} fill="#36425f" />
        <rect x={-410} y={-40} width={400} height={8} fill="#e0b140" />
        {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={-392 + k * 78} y={-106} width={56} height={40} rx={6} fill="#9fc3ff" opacity={0.75} />)}
        <rect x={-380} y={10} width={360} height={14} fill="#1a2030" />
      </g>
    ))}
    <path d="M-10,-120 Q90,-120 130,-60 L130,10 L-10,10 Z" fill="#36425f" />
    <path d="M-10,-120 Q90,-120 130,-60 L130,-50 L-10,-50 Z" fill="#46557a" />
    <circle cx={118} cy={-30} r={11} fill="#fff6d0" />
    {headlight > 0 && <circle cx={118} cy={-30} r={32} fill="#fff1b8" opacity={0.45 * headlight} />}
    <rect x={-10} y={-40} width={140} height={8} fill="#e0b140" />
  </g>
);

export const Bench: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill="#3a2d44">
    <rect x={-150} y={0} width={300} height={16} rx={6} />
    <rect x={-150} y={-70} width={300} height={16} rx={6} />
    <rect x={-150} y={-40} width={300} height={16} rx={6} />
    <rect x={-130} y={-80} width={12} height={150} />
    <rect x={118} y={-80} width={12} height={150} />
  </g>
);
