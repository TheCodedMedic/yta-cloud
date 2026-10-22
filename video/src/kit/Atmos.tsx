// Atmosphere: wind, leaves, rain, fog, clouds, light shafts. Everything is a pure
// function of time so any frame can be rendered on its own.
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { C, H, W } from "../theme";
import { clamp01 } from "./Fx";

/** Wind strength 0..1 with gusts; `base` sets the average. */
export const wind = (t: number, base = 0.5) =>
  clamp01(base + 0.25 * Math.sin(t * 0.6) + 0.15 * Math.sin(t * 1.7 + 1) + 0.08 * Math.sin(t * 4.3));

/** Leaves carried by the wind: two sizes (far small, near big), spinning and dipping. */
export const Leaves: React.FC<{ t: number; n?: number; seed?: string; strength?: number; colors?: string[]; area?: [number, number, number, number]; scale?: number }> = ({
  t, n = 18, seed = "lf", strength = 0.6, colors = ["#c8742f", "#d9a03a", "#8c4b22", "#b05a2a"], area = [0, 0, W, H], scale = 1,
}) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const r = (k: string) => random(`${seed}${k}${i}`);
      const near = r("n") > 0.6;
      const speed = (260 + r("v") * 300) * (near ? 1.4 : 0.8) * (0.4 + strength);
      const span = W + 600;
      const x = area[0] + (((r("x") * span + t * speed) % span) - 300);
      const y = area[1] + r("y") * area[3] + Math.sin(t * (1.2 + r("f")) + r("p") * 6) * 60 * (0.5 + strength) + t * 12 * r("g");
      const s = (near ? 1.3 : 0.7) * (0.8 + r("s") * 0.6) * scale;
      const rot = t * (120 + r("w") * 240) * (r("d") > 0.5 ? 1 : -1);
      const col = colors[Math.floor(r("c") * colors.length)];
      return (
        <g key={i} transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={near ? 0.95 : 0.7}>
          <path d="M-12,0 Q0,-12 12,0 Q0,12 -12,0 Z" fill={col} />
          <path d="M-10,0 L10,0" stroke="#5a2e12" strokeWidth={1.5} opacity={0.6} />
        </g>
      );
    })}
  </svg>
);

/** Rain streaks at a given depth. `near` rain is longer, faster, brighter. */
export const Rain: React.FC<{ t: number; n?: number; near?: boolean; angle?: number; seed?: string; opacity?: number; color?: string }> = ({
  t, n = 90, near = false, angle = 12, seed = "rn", opacity, color = "#cfe3ff",
}) => {
  const len = near ? 70 : 34, speed = near ? 2600 : 1500, w = near ? 2.2 : 1.2;
  const op = opacity ?? (near ? 0.5 : 0.3);
  const dx = Math.tan((angle * Math.PI) / 180);
  return (
    <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
      {Array.from({ length: n }, (_, i) => {
        const r = (k: string) => random(`${seed}${k}${i}`);
        const cycle = (H + 200) / speed;
        const ph = ((t + r("p") * cycle) % cycle) / cycle;
        const y = -100 + ph * (H + 200);
        const x = ((r("x") * (W + 400) - 200) - y * dx + W * 2) % (W + 400) - 200;
        return <line key={i} x1={x} y1={y} x2={x - dx * len} y2={y - len} stroke={color} strokeWidth={w * (0.7 + r("w") * 0.6)} opacity={op * (0.6 + r("o") * 0.4)} strokeLinecap="round" />;
      })}
    </svg>
  );
};

/** Rain splashes on a ground line: small rings and droplets popping at random spots. */
export const Splashes: React.FC<{ t: number; y: number; n?: number; seed?: string; spread?: number }> = ({ t, y, n = 24, seed = "sp", spread = 40 }) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const r = (k: string) => random(`${seed}${k}${i}`);
      const period = 0.5 + r("d") * 0.6;
      const ph = ((t + r("p") * period) % period) / period;
      const x = r("x") * W, yy = y + r("y") * spread;
      const rad = 4 + ph * 16;
      return (
        <g key={i} opacity={(1 - ph) * 0.6}>
          <ellipse cx={x} cy={yy} rx={rad} ry={rad * 0.35} fill="none" stroke="#dfeeff" strokeWidth={1.5} />
          <circle cx={x - rad * 0.6} cy={yy - ph * 14} r={1.5} fill="#dfeeff" />
          <circle cx={x + rad * 0.5} cy={yy - ph * 18} r={1.2} fill="#dfeeff" />
        </g>
      );
    })}
  </svg>
);

/** Droplets on the lens: dark discs with a white glint, slowly sliding down. */
export const LensBeads: React.FC<{ t: number; n?: number; seed?: string }> = ({ t, n = 14, seed = "lb" }) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const r = (k: string) => random(`${seed}${k}${i}`);
      const x = r("x") * W, y = (r("y") * H + t * (6 + r("v") * 14)) % (H + 60) - 30;
      const rad = 6 + r("r") * 14;
      return (
        <g key={i} opacity={0.75}>
          <circle cx={x} cy={y} r={rad} fill="#0b0712" opacity={0.55} />
          <circle cx={x} cy={y} r={rad} fill="none" stroke="#ffffff" strokeWidth={1} opacity={0.25} />
          <circle cx={x - rad * 0.35} cy={y - rad * 0.4} r={rad * 0.22} fill="white" opacity={0.8} />
        </g>
      );
    })}
  </svg>
);

/** Low fog: big soft blobs drifting sideways. */
export const Fog: React.FC<{ t: number; y?: number; opacity?: number; speed?: number; seed?: string; color?: string; n?: number }> = ({
  t, y = 820, opacity = 0.25, speed = 30, seed = "fg", color = "#cbbbe0", n = 9,
}) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    <defs>
      <radialGradient id={`fog${seed}`}><stop offset="0" stopColor={color} stopOpacity={0.9} /><stop offset="1" stopColor={color} stopOpacity={0} /></radialGradient>
    </defs>
    {Array.from({ length: n }, (_, i) => {
      const r = (k: string) => random(`${seed}${k}${i}`);
      const x = ((r("x") * (W + 1200) + t * speed * (0.6 + r("v"))) % (W + 1200)) - 600;
      return <ellipse key={i} cx={x} cy={y + r("y") * 120} rx={380 + r("r") * 300} ry={70 + r("h") * 60} fill={`url(#fog${seed})`} opacity={opacity * (0.6 + r("o") * 0.4)} />;
    })}
  </svg>
);

/** Soft clouds drifting across the sky band. */
export const Clouds: React.FC<{ t: number; y?: number; speed?: number; n?: number; seed?: string; color?: string; opacity?: number }> = ({
  t, y = 160, speed = 18, n = 6, seed = "cl", color = "#ffe2bd", opacity = 0.28,
}) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const r = (k: string) => random(`${seed}${k}${i}`);
      const x = ((r("x") * (W + 900) + t * speed * (0.5 + r("v"))) % (W + 900)) - 450;
      const yy = y + r("y") * 140;
      const s = 0.7 + r("s") * 0.8;
      return (
        <g key={i} transform={`translate(${x},${yy}) scale(${s})`} opacity={opacity}>
          <ellipse cx={0} cy={0} rx={220} ry={26} fill={color} />
          <ellipse cx={-60} cy={-14} rx={110} ry={22} fill={color} />
          <ellipse cx={70} cy={-10} rx={90} ry={18} fill={color} />
        </g>
      );
    })}
  </svg>
);

/** Light shafts (god rays) from a point, slowly breathing. */
export const GodRays: React.FC<{ x: number; y: number; t: number; angle?: number; spread?: number; n?: number; opacity?: number; color?: string; len?: number }> = ({
  x, y, t, angle = 60, spread = 30, n = 7, opacity = 0.18, color = "#ffe3b0", len = 1700,
}) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none", mixBlendMode: "screen" }}>
    <defs>
      <linearGradient id="gr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor={color} stopOpacity={0.9} /><stop offset="1" stopColor={color} stopOpacity={0} /></linearGradient>
    </defs>
    {Array.from({ length: n }, (_, i) => {
      const a = angle - spread / 2 + (spread * i) / (n - 1) + Math.sin(t * 0.4 + i) * 1.2;
      const w = 0.015 + random(`gr${i}`) * 0.02;
      const o = opacity * (0.6 + 0.4 * Math.sin(t * 0.9 + i * 1.3));
      const rad = (d: number) => (d * Math.PI) / 180;
      return (
        <polygon key={i} fill="url(#gr)" opacity={o} transform={`rotate(${a} ${x} ${y})`}
          points={`${x},${y} ${x + len},${y - len * w} ${x + len},${y + len * w}`} />
      );
    })}
  </svg>
);

/** Wet-ground reflection of a bright light: a vertical smear below (x, y). */
export const WetReflection: React.FC<{ x: number; y: number; h?: number; w?: number; color?: string; opacity?: number; t?: number }> = ({
  x, y, h = 260, w = 60, color = C.windowHot, opacity = 0.35, t = 0,
}) => (
  <div style={{
    position: "absolute", left: x - w / 2, top: y, width: w, height: h,
    background: `linear-gradient(180deg, ${color}, transparent)`, opacity: opacity * (0.85 + Math.sin(t * 9 + x) * 0.15),
    filter: "blur(6px)", transform: `scaleX(${1 + Math.sin(t * 5 + x * 0.1) * 0.15})`,
  }} />
);
