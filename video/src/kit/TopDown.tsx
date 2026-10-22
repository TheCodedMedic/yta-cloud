// Top-down view: characters and the café terrace seen from above.
import React from "react";
import { random } from "remotion";
import { C, H, W } from "../theme";

const OUT: Record<string, { top: string; dark: string; hat?: string }> = {
  hero: { top: C.hoodie, dark: C.hoodieDark },
  friend: { top: C.friendTop, dark: "#1d1c2a", hat: C.cap },
  sister: { top: "#c56aa8", dark: "#93487c" },
  extra: { top: "#5b5470", dark: "#433d55" },
  scientist: { top: C.coat, dark: "#c6c3ba" },
};

/**
 * A character from above. `heading` is the direction they face (degrees, 0 = up the
 * screen, 90 = right). `walk` is a phase (radians) for a walking swing, or undefined.
 */
export const TopChar: React.FC<{ x: number; y: number; s?: number; outfit?: string; heading?: number; walk?: number; t?: number; light?: [number, number] }> = ({
  x, y, s = 1, outfit = "hero", heading = 0, walk, t = 0, light = [-1, -1],
}) => {
  const o = OUT[outfit] ?? OUT.extra;
  const sw = walk === undefined ? 0 : Math.sin(walk);
  const breathe = Math.sin(t * 1.6) * 1.5;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* long soft shadow away from the light */}
      <ellipse cx={-light[0] * 60} cy={-light[1] * 60} rx={70} ry={48} fill="#0a0610" opacity={0.25} style={{ filter: "blur(6px)" }} />
      <g transform={`rotate(${heading})`}>
        {/* feet (behind) */}
        <ellipse cx={-16} cy={10 - sw * 26} rx={9} ry={16} fill={C.ink} />
        <ellipse cx={16} cy={10 + sw * 26} rx={9} ry={16} fill={C.ink} />
        {/* shoulders */}
        <ellipse cx={0} cy={6} rx={46 + breathe * 0.4} ry={30} fill={o.top} />
        <ellipse cx={0} cy={6} rx={46} ry={30} fill="url(#topShade)" />
        {/* arms swing forward/back */}
        <path d={`M-40,8 L${-52 + sw * 10},${-30 * sw + 24}`} stroke={o.top} strokeWidth={14} strokeLinecap="round" />
        <path d={`M40,8 L${52 - sw * 10},${30 * sw + 24}`} stroke={o.top} strokeWidth={14} strokeLinecap="round" />
        <circle cx={-52 + sw * 10} cy={-30 * sw + 24} r={9} fill={C.ink} />
        <circle cx={52 - sw * 10} cy={30 * sw + 24} r={9} fill={C.ink} />
        {/* hood */}
        <ellipse cx={0} cy={22} rx={26} ry={16} fill={o.dark} />
        {/* head on top, lit edge toward the light */}
        <circle cx={0} cy={0} r={34} fill={C.ink} />
        <path d="M-30,-16 A34,34 0 0 1 10,-32" stroke={C.rim} strokeWidth={4} fill="none" strokeLinecap="round" />
        {o.hat && <path d="M-34,-4 A34,34 0 0 1 34,-4 L30,-30 L-30,-30 Z" fill={o.hat} />}
        {outfit === "sister" && (<><circle cx={-28} cy={-24} r={11} fill={C.ink} /><circle cx={28} cy={-24} r={11} fill={C.ink} /></>)}
      </g>
    </g>
  );
};

/** Terrace from above: pavement, hedge line, tables with chairs, lamp pools, the awning strip. */
export const TopCafe: React.FC<{ t: number; children?: React.ReactNode }> = ({ t, children }) => (
  <svg width={W} height={H} style={{ position: "absolute" }}>
    <defs>
      <radialGradient id="topShade" cx="35%" cy="35%" r="70%"><stop offset="0" stopColor="white" stopOpacity={0.18} /><stop offset="1" stopColor="black" stopOpacity={0.25} /></radialGradient>
      <radialGradient id="lampPool"><stop offset="0" stopColor={C.windowHot} stopOpacity={0.45} /><stop offset="1" stopColor={C.windowHot} stopOpacity={0} /></radialGradient>
      <pattern id="pave" width={90} height={90} patternUnits="userSpaceOnUse">
        <rect width={90} height={90} fill="#4a3f5a" />
        <path d="M0,45 H90 M45,0 V90" stroke="#3b3149" strokeWidth={3} />
      </pattern>
    </defs>
    <rect width={W} height={H} fill="url(#pave)" />
    {/* awning strip along the top edge (the café wall is above the frame) */}
    {Array.from({ length: 22 }, (_, i) => (
      <rect key={i} x={i * (W / 22)} y={0} width={W / 22} height={130 + Math.sin(t * 3 + i) * 3} fill={i % 2 ? C.awningCream : C.awningRed} opacity={0.95} />
    ))}
    <rect x={0} y={128} width={W} height={14} fill="#2a2033" />
    {/* lamp pools */}
    {[300, 960, 1620].map((x) => <circle key={x} cx={x} cy={100} r={420} fill="url(#lampPool)" />)}
    {/* hedge along the bottom */}
    {Array.from({ length: 34 }, (_, i) => <circle key={i} cx={i * 58 + 20} cy={1020 + Math.sin(t * 1.5 + i) * 3} r={34 + random(`hg${i}`) * 10} fill="#24352a" />)}
    {/* tables with cups and chairs */}
    {[[520, 560], [960, 600], [1400, 560]].map(([x, y], i) => (
      <g key={i}>
        <ellipse cx={x + 18} cy={y + 18} rx={122} ry={122} fill="#0a0610" opacity={0.25} style={{ filter: "blur(6px)" }} />
        <circle cx={x} cy={y} r={118} fill={C.tableTop} />
        <circle cx={x} cy={y} r={118} fill="url(#topShade)" />
        <circle cx={x} cy={y} r={118} fill="none" stroke={C.table} strokeWidth={8} />
        {/* chairs: two arcs */}
        <path d={`M${x - 165},${y - 50} A60,60 0 0 0 ${x - 165},${y + 50}`} stroke={C.ink} strokeWidth={10} fill="none" />
        <path d={`M${x + 165},${y - 50} A60,60 0 0 1 ${x + 165},${y + 50}`} stroke={C.ink} strokeWidth={10} fill="none" />
        <circle cx={x - 40} cy={y - 30} r={22} fill="#f1ede6" />
        <circle cx={x - 40} cy={y - 30} r={16} fill="#5a3522" />
        <path d={`M${x - 18},${y - 30} a10,10 0 0 1 0,2`} stroke="#e9e4dc" strokeWidth={5} fill="none" />
      </g>
    ))}
    {children}
  </svg>
);
