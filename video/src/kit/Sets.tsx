import React from "react";
import { AbsoluteFill, random } from "remotion";
import { C, H, W } from "../theme";

/** Dusk sky gradient with a blooming sun disc. */
export const Sky: React.FC<{ sunX?: number; sunY?: number; t?: number; tint?: string }> = ({ sunX = 960, sunY = 300, t = 0, tint }) => {
  const pulse = 1 + Math.sin(t * 1.3) * 0.025;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: `linear-gradient(180deg, ${C.skyTop} 0%, ${C.skyMid} 52%, ${C.skyLow} 78%, #f7c389 100%)` }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${sunX}px ${sunY}px, ${C.sun} 0px, ${C.sun} 62px, rgba(255,222,160,0.8) ${86 * pulse}px, rgba(246,170,100,0.32) ${300 * pulse}px, transparent ${640 * pulse}px)`,
        }}
      />
      {/* thin cloud streaks */}
      <svg width={W} height={H} style={{ position: "absolute" }}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} cx={(260 + i * 470 + t * 6) % (W + 400) - 200} cy={sunY - 120 + i * 46} rx={220 + i * 30} ry={7} fill="#ffe2bd" opacity={0.22} />
        ))}
      </svg>
      {tint && <AbsoluteFill style={{ background: tint, mixBlendMode: "soft-light" }} />}
    </AbsoluteFill>
  );
};

export const SunRays: React.FC<{ cx: number; cy: number; t: number; opacity?: number; n?: number }> = ({ cx, cy, t, opacity = 0.2, n = 30 }) => (
  <svg width={W} height={H} style={{ position: "absolute", mixBlendMode: "screen" }}>
    <defs>
      <radialGradient id="rayfade" cx={cx} cy={cy} r={1300} gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor={C.windowHot} stopOpacity={1} />
        <stop offset="1" stopColor={C.windowHot} stopOpacity={0} />
      </radialGradient>
    </defs>
    <g transform={`rotate(${t * 2.2} ${cx} ${cy})`} opacity={opacity}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2;
        const w = 0.03 + (i % 3) * 0.008;
        const r = 2200;
        return (
          <polygon key={i} fill="url(#rayfade)"
            points={`${cx},${cy} ${cx + Math.cos(a - w) * r},${cy + Math.sin(a - w) * r} ${cx + Math.cos(a + w) * r},${cy + Math.sin(a + w) * r}`} />
        );
      })}
    </g>
  </svg>
);

/** Café front at sunset. Drawn in 1920x1080 space; wrap in a camera to frame it. */
export const CafeFront: React.FC<{ t: number; y?: number; patrons?: React.ReactNode }> = ({ t, y = 140, patrons }) => {
  const x = 330, w = 1260;
  const stripes = 18, sw = w / stripes;
  const awningY = y + 430, winY = awningY + 112, winH = 300;
  const flick = (i: number) => 0.9 + Math.sin(t * 3 + i * 1.7) * 0.03 + Math.sin(t * 7.3 + i) * 0.015;
  return (
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="cfWin" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.windowHot} />
          <stop offset="1" stopColor={C.window} />
        </linearGradient>
        <filter id="cfGlow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="22" /></filter>
      </defs>
      {/* neighbouring buildings */}
      <rect x={-20} y={y - 70} width={x + 20} height={H} fill={C.wallDark} />
      <rect x={x + w} y={y - 120} width={W - x - w + 20} height={H} fill={C.wallDark} />
      {[0, 1, 2, 3].map((r) => [0, 1].map((c) => {
        const lit = random(`nb${r}${c}`) > 0.72;
        return (
          <g key={`n${r}${c}`}>
            <rect x={54 + c * 140} y={y - 20 + r * 150} width={70} height={96} fill={lit ? C.window : C.shadow} opacity={lit ? 0.75 : 1} />
            <rect x={1660 + c * 130} y={y - 60 + r * 150} width={64} height={92} fill={random(`nr${r}${c}`) > 0.75 ? C.window : C.shadow} opacity={0.8} />
          </g>
        );
      }))}
      {/* facade */}
      <rect x={x} y={y} width={w} height={H} fill={C.wall} />
      <rect x={x - 10} y={y - 14} width={w + 20} height={20} fill={C.wallLight} />
      {[0, 1].map((r) => Array.from({ length: 7 }, (_, c) => {
        const lit = random(`fw${r}${c}`) > 0.68;
        const wx = x + 80 + c * ((w - 160) / 7);
        return (
          <g key={`f${r}${c}`}>
            <rect x={wx} y={y + 50 + r * 175} width={96} height={124} fill={lit ? C.window : C.shadow} opacity={lit ? 0.85 : 1} />
            {lit && <rect x={wx} y={y + 50 + r * 175} width={96} height={124} fill={C.window} filter="url(#cfGlow)" opacity={0.4} />}
            <rect x={wx + 46} y={y + 50 + r * 175} width={4} height={124} fill={C.wall} />
            <rect x={wx - 10} y={y + 172 + r * 175} width={116} height={10} fill={C.wallLight} />
          </g>
        );
      }))}
      {/* sign */}
      <rect x={x + w / 2 - 120} y={awningY - 74} width={240} height={46} rx={8} fill={C.shadow} />
      <text x={x + w / 2} y={awningY - 42} textAnchor="middle" fontSize={26} fontWeight={800} letterSpacing={8} fill={C.windowHot} fontFamily="sans-serif">CAFÉ</text>
      {/* awning */}
      {Array.from({ length: stripes }, (_, i) => (
        <path key={i} d={`M${x + i * sw},${awningY} h${sw} v64 q${-sw / 2},20 ${-sw},0 z`} fill={i % 2 ? C.awningCream : C.awningRed} />
      ))}
      <rect x={x - 12} y={awningY - 12} width={w + 24} height={14} fill={C.shadow} />
      {/* window glow + panes */}
      <rect x={x + 40} y={winY} width={w - 80} height={winH} fill={C.window} filter="url(#cfGlow)" opacity={0.6} />
      {Array.from({ length: 6 }, (_, i) => {
        const pw = (w - 80) / 6;
        const wx = x + 40 + i * pw;
        return (
          <g key={i} opacity={flick(i)}>
            <rect x={wx + 8} y={winY} width={pw - 16} height={winH} fill="url(#cfWin)" />
            {/* interior silhouettes */}
            {random(`in${i}`) > 0.4 && <circle cx={wx + pw * (0.3 + random(`ix${i}`) * 0.4)} cy={winY + 150} r={20} fill={C.wall} opacity={0.5} />}
            <rect x={wx + 8} y={winY + 120} width={pw - 16} height={6} fill={C.wall} />
            <rect x={wx + pw / 2 - 3} y={winY} width={6} height={winH} fill={C.wall} />
          </g>
        );
      })}
      {[0.22, 0.5, 0.78].map((p) => (
        <g key={p}>
          <line x1={x + w * p} y1={awningY + 64} x2={x + w * p} y2={winY - 22} stroke={C.ink} strokeWidth={3} />
          <circle cx={x + w * p} cy={winY - 16} r={9} fill={C.windowHot} />
          <circle cx={x + w * p} cy={winY - 16} r={46} fill={C.windowHot} opacity={0.16} />
        </g>
      ))}
      {/* terrace hedge + pavement */}
      <rect x={0} y={winY + winH} width={W} height={H} fill={C.night} />
      <rect x={0} y={winY + winH} width={W} height={6} fill={C.shadow} />
      {patrons}
      {Array.from({ length: 30 }, (_, i) => (
        <circle key={i} cx={x + 20 + i * ((w - 40) / 29)} cy={winY + winH - 4} r={30} fill="#2a2033" />
      ))}
      <rect x={x} y={winY + winH - 4} width={w} height={40} fill="#2a2033" />
      {/* street lamp + tree */}
      <rect x={1700} y={540} width={10} height={560} fill={C.ink} />
      <circle cx={1705} cy={532} r={14} fill={C.windowHot} />
      <circle cx={1705} cy={532} r={70} fill={C.windowHot} opacity={0.14} />
      <circle cx={180} cy={650} r={84} fill="#1a1420" />
      <circle cx={130} cy={700} r={60} fill="#1a1420" />
      <rect x={172} y={680} width={14} height={420} fill="#1a1420" />
    </svg>
  );
};
