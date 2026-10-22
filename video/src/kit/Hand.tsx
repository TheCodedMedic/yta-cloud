import React from "react";
import { C } from "../theme";

// The macro "insert" hand: black with a warm rim, red hoodie sleeve running
// off-screen. `curl` 0 = open, 1 = closed fist. The hand points along +x;
// rotate the group to aim it. (x, y) = centre of the palm.
const Finger: React.FC<{ x: number; y: number; len: number; curl: number; spread: number; paint: string }> = ({
  x, y, len, curl, spread, paint,
}) => {
  const a1 = spread * (1 - curl) + curl * 70;
  const a2 = curl * 95;
  const r = (d: number) => (d * Math.PI) / 180;
  const l1 = len * 0.55, l2 = len * 0.45 * (1 - curl * 0.2);
  const mx = x + Math.cos(r(a1)) * l1, my = y + Math.sin(r(a1)) * l1;
  const ex = mx + Math.cos(r(a1 + a2)) * l2, ey = my + Math.sin(r(a1 + a2)) * l2;
  return <path d={`M${x},${y} L${mx},${my} L${ex},${ey}`} stroke={paint} strokeWidth={38} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
};

const HandShape: React.FC<{ curl: number; paint?: string; sleeve: string }> = ({ curl, paint, sleeve }) => {
  const ink = paint ?? C.ink;
  return (
    <g>
      {/* sleeve to the left edge */}
      <path d="M-900,-58 L-150,-64 Q-128,0 -150,64 L-900,58 Z" fill={paint ?? sleeve} />
      <rect x={-162} y={-66} width={34} height={132} rx={12} fill={paint ?? sleeve} />
      {!paint && <path d="M-900,-58 L-150,-64 L-148,-40 L-900,-36 Z" fill="white" opacity={0.12} />}
      <rect x={-140} y={-46} width={70} height={92} rx={24} fill={ink} />
      <rect x={-96} y={-70} width={140} height={140} rx={56} fill={ink} />
      {[[-44, 1.0, -9], [-14, 1.08, -3], [16, 1.02, 3], [44, 0.84, 9]].map(([fy, k, sp], i) => (
        <Finger key={i} x={34} y={fy} len={118 * k} curl={curl} spread={sp} paint={ink} />
      ))}
      {/* thumb */}
      <Finger x={-40} y={-50} len={100} curl={curl * 0.7} spread={-50} paint={ink} />
    </g>
  );
};

export const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number; curl?: number; sleeve?: string; rim?: string }> = ({
  x, y, s = 1, rot = 0, curl = 0, sleeve = C.hoodie, rim = C.rim,
}) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <g transform="translate(-6,-7)">
      <HandShape curl={curl} paint={rim} sleeve={sleeve} />
    </g>
    <HandShape curl={curl} sleeve={sleeve} />
  </g>
);
