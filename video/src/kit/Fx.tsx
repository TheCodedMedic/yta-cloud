import React from "react";
import { AbsoluteFill, random, staticFile } from "remotion";
import { C, H, W } from "../theme";

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
export const sstep = (x: number) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
export const easeOut = (x: number, p = 2.4) => 1 - Math.pow(1 - clamp01(x), p);
export const lerp = (a: number, b: number, u: number) => a + (b - a) * u;

/** Black bars top and bottom; h = bar height in px at 1080p. */
export const Letterbox: React.FC<{ h: number }> = ({ h }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    <div style={{ position: "absolute", top: 0, left: 0, width: W, height: h, background: "#000" }} />
    <div style={{ position: "absolute", bottom: 0, left: 0, width: W, height: h, background: "#000" }} />
  </AbsoluteFill>
);

const DECAY = [1.0, 0.62, 0.42, 0.27, 0.15, 0.07];

/** Near-white frame with black radial speed lines, decaying over 6 frames. */
export const SpeedFlash: React.FC<{ age: number; cx?: number; cy?: number; strength?: number; seed?: number }> = ({
  age, cx = W / 2, cy = H / 2, strength = 1, seed = 1,
}) => {
  if (age < 0 || age >= DECAY.length) return null;
  const a = DECAY[age] * strength;
  const lines = Array.from({ length: 64 }, (_, i) => {
    const ang = (i / 64) * Math.PI * 2 + random(`a${seed}${i}`) * 0.08;
    const r0 = 180 + random(`r${seed}${i}`) * 260;
    const w = 0.004 + random(`w${seed}${i}`) * 0.012;
    const R = 2200;
    return `M${cx + Math.cos(ang) * r0},${cy + Math.sin(ang) * r0} L${cx + Math.cos(ang - w) * R},${cy + Math.sin(ang - w) * R} L${cx + Math.cos(ang + w) * R},${cy + Math.sin(ang + w) * R} Z`;
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill style={{ background: "#f4efe8", opacity: a * 0.82 }} />
      <svg width={W} height={H} style={{ position: "absolute", opacity: Math.min(1, a * 1.3) }}>
        {lines.map((d, i) => <path key={i} d={d} fill="#1a1418" />)}
      </svg>
    </AbsoluteFill>
  );
};

/** Two concentric rings expanding from a point. `t` = seconds since the pulse. */
export const Rings: React.FC<{ t: number; cx: number; cy: number; scale?: number; color?: string }> = ({
  t, cx, cy, scale = 1, color = "#ffffff",
}) => {
  const ring = (tt: number, k: number) => {
    if (tt < 0 || tt > 0.7) return null;
    const u = tt / 0.7;
    const r = (40 + 380 * (1 - Math.pow(1 - u, 2.4))) * scale * k;
    return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={4 * (1 - u) + 1} opacity={(1 - u) * 0.85} />;
  };
  return (
    <g style={{ pointerEvents: "none" }}>
      {ring(t, 1)}
      {ring(t - 0.1, 0.55)}
    </g>
  );
};

/** Soft out-of-focus light discs. */
export const Bokeh: React.FC<{ n?: number; seed?: string; color?: string; opacity?: number; t?: number; area?: [number, number, number, number] }> = ({
  n = 14, seed = "b", color = C.windowHot, opacity = 0.35, t = 0, area = [0, 0, W, H],
}) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    <defs>
      <radialGradient id={`bk${seed}`}>
        <stop offset="0" stopColor={color} stopOpacity={0.9} />
        <stop offset="0.7" stopColor={color} stopOpacity={0.55} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    {Array.from({ length: n }, (_, i) => {
      const x = area[0] + random(`${seed}x${i}`) * area[2] + Math.sin(t * 0.3 + i) * 6;
      const y = area[1] + random(`${seed}y${i}`) * area[3];
      const r = 18 + random(`${seed}r${i}`) * 46;
      return <circle key={i} cx={x} cy={y} r={r} fill={`url(#bk${seed})`} opacity={opacity * (0.5 + random(`${seed}o${i}`) * 0.5)} />;
    })}
  </svg>
);

/** Floating dust specks catching the light. */
export const Dust: React.FC<{ t: number; n?: number; seed?: string }> = ({ t, n = 26, seed = "d" }) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const x = (random(`${seed}x${i}`) * W + t * (8 + random(`${seed}v${i}`) * 14)) % W;
      const y = (random(`${seed}y${i}`) * H - t * (4 + random(`${seed}u${i}`) * 8) + H * 4) % H;
      return <circle key={i} cx={x} cy={y} r={1.2 + random(`${seed}r${i}`) * 2.2} fill={C.windowHot} opacity={0.25 + random(`${seed}o${i}`) * 0.35} />;
    })}
  </svg>
);

/** Final grade: contrast, vignette (stronger when bars are tight) and film grain. */
export const Grade: React.FC<{ frame: number; vignette?: number; cool?: number }> = ({ frame, vignette = 0.42, cool = 0 }) => (
  <AbsoluteFill style={{ pointerEvents: "none" }}>
    {cool > 0 && <AbsoluteFill style={{ background: "#3a5aa8", mixBlendMode: "soft-light", opacity: cool }} />}
    <AbsoluteFill
      style={{ background: `radial-gradient(ellipse at 50% 46%, transparent 42%, rgba(12,6,18,${vignette}) 100%)` }}
    />
    <div
      style={{
        position: "absolute", left: -((frame * 137) % 512), top: -((frame * 71) % 512),
        width: W + 1024, height: H + 1024, backgroundImage: `url(${staticFile("grain.png")})`,
        backgroundRepeat: "repeat", opacity: 0.07, mixBlendMode: "overlay",
      }}
    />
  </AbsoluteFill>
);

/** Thin cream streaks sweeping across (wind / speed). */
export const Streaks: React.FC<{ t: number; n?: number; speed?: number; seed?: string; opacity?: number }> = ({
  t, n = 22, speed = 2000, seed = "s", opacity = 0.35,
}) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const len = 120 + random(`${seed}l${i}`) * 260;
      const v = speed * (0.75 + random(`${seed}v${i}`) * 0.5);
      const x = ((random(`${seed}x${i}`) * (W + 800) + t * v) % (W + 800)) - 400;
      const y = random(`${seed}y${i}`) * H;
      return <line key={i} x1={x} y1={y} x2={x - len} y2={y} stroke={C.cream} strokeWidth={2} opacity={opacity * random(`${seed}o${i}`)} strokeLinecap="round" />;
    })}
  </svg>
);
