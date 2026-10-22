// Character motion helpers: run cycle, idle life, look-at, ghost trails, dust.
import React from "react";
import { random } from "remotion";
import { C, H, W } from "../theme";
import { Pose } from "./Character";
import { clamp01 } from "./Fx";

/**
 * Side-view run cycle. Bigger stride than the walk, forward lean, elbows pumped at
 * ~90°, knees high in the swing, and an airborne moment (bob up) between contacts.
 */
export const runPose = (ph: number, amp = 1): Pose => {
  const leg = (p: number): [number, number] => [48 * amp * Math.sin(p), -(14 + 85 * amp * Math.max(0, Math.cos(p)))];
  const arm = (p: number): [number, number] => [-50 * amp * Math.sin(p) + 10, 85 + 10 * Math.sin(p)];
  return {
    lean: 18, legN: leg(ph), legF: leg(ph + Math.PI), armN: arm(ph), armF: arm(ph + Math.PI),
    bob: -10 * Math.abs(Math.sin(ph)) - 2,
  };
};

/** Breathing, weight shifts and a tiny head tilt layered over a base pose. */
export const idle = (base: Pose, t: number, seed = 0, amp = 1): Pose => {
  const br = Math.sin(t * 1.6 + seed) * amp;
  return {
    ...base,
    bob: (base.bob ?? 0) + br * 2.2,
    lean: (base.lean ?? 0) + Math.sin(t * 0.7 + seed) * 1.2 * amp,
    head: (base.head ?? 0) + Math.sin(t * 0.5 + seed * 2) * 2.5 * amp,
    armN: base.armN ? [base.armN[0] + br * 1.5, base.armN[1] + br * 2] : base.armN,
    armF: base.armF ? [base.armF[0] - br * 1.2, base.armF[1] + br * 1.5] : base.armF,
    shrug: (base.shrug ?? 0) + Math.max(0, br) * 0.06,
  };
};

/** Face look vector toward a world target, from a head position. */
export const lookAt = (head: [number, number], target: [number, number], facing: 1 | -1 = 1): [number, number] => {
  const dx = target[0] - head[0], dy = target[1] - head[1];
  const d = Math.hypot(dx, dy) || 1;
  return [clamp01((dx / d) * facing * 0.5 + 0.5) * 2 - 1, Math.max(-1, Math.min(1, dy / d))];
};

/** Ghost trail: renders `draw(t - k·dt)` for k = n..1 at fading opacity, then the live frame. */
export const Trail: React.FC<{ t: number; n?: number; dt?: number; draw: (tt: number) => React.ReactNode; opacity?: number; tint?: string }> = ({
  t, n = 4, dt = 0.045, draw, opacity = 0.35, tint,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const k = n - i;
      return (
        <g key={k} opacity={opacity * (1 - k / (n + 1))} style={tint ? { filter: `drop-shadow(0 0 2px ${tint})` } : undefined}>
          {draw(t - k * dt)}
        </g>
      );
    })}
    {draw(t)}
  </g>
);

/** Dust puffs: each `kicks[i]` is a time (s) at which a puff starts at (x, y). */
export const DustKicks: React.FC<{ t: number; kicks: { at: number; x: number; y: number }[]; seed?: string; color?: string; dir?: 1 | -1; size?: number }> = ({
  t, kicks, seed = "dk", color = "#d8c9b0", dir = -1, size = 1,
}) => (
  <g>
    {kicks.map((k, i) => {
      const age = t - k.at;
      if (age < 0 || age > 0.7) return null;
      const u = age / 0.7;
      return (
        <g key={i} opacity={(1 - u) * 0.6}>
          {[0, 1, 2, 3].map((j) => {
            const r = random(`${seed}${i}${j}`);
            const rad = (10 + r * 18) * (0.4 + u) * size;
            return <circle key={j} cx={k.x + dir * (20 + j * 22) * u * 3 + (r - 0.5) * 20} cy={k.y - 6 - j * 6 * u - r * 14 * u} r={rad} fill={color} />;
          })}
        </g>
      );
    })}
  </g>
);

/** Footfall times for a run/walk cycle with a given phase function and stride period. */
export const footfalls = (t0: number, t1: number, period: number) => {
  const out: number[] = [];
  for (let s = t0; s < t1; s += period / 2) out.push(s);
  return out;
};

/** Radial speed lines centred on a point (keeps the subject sharp). */
export const RadialLines: React.FC<{ cx: number; cy: number; t: number; n?: number; opacity?: number; inner?: number; color?: string }> = ({
  cx, cy, t, n = 40, opacity = 0.35, inner = 300, color = "#ffffff",
}) => (
  <svg width={W} height={H} style={{ position: "absolute", pointerEvents: "none" }}>
    {Array.from({ length: n }, (_, i) => {
      const a = (i / n) * Math.PI * 2 + random(`rl${i}`) * 0.1;
      const flick = 0.5 + 0.5 * Math.sin(t * 40 + i * 2.1);
      const r0 = inner + random(`rr${i}`) * 200, r1 = 2200;
      return <line key={i} x1={cx + Math.cos(a) * r0} y1={cy + Math.sin(a) * r0} x2={cx + Math.cos(a) * r1} y2={cy + Math.sin(a) * r1} stroke={color} strokeWidth={2 + random(`rw${i}`) * 3} opacity={opacity * flick} strokeLinecap="round" />;
    })}
  </svg>
);

/** Squash-and-stretch factor for a landing at `at`: [sx, sy]. */
export const squash = (t: number, at: number, amount = 0.18): [number, number] => {
  const age = t - at;
  if (age < 0 || age > 0.3) return [1, 1];
  const k = Math.sin((age / 0.3) * Math.PI) * amount;
  return [1 + k, 1 - k];
};

export const INK = C.ink;
