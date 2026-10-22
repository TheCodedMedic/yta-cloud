// Camera layer for a moving, filmed look: parallax depth, keyframed moves,
// handheld drift, shake, rack focus and directional (whip) blur.
import React from "react";
import { AbsoluteFill, random } from "remotion";
import { H, W } from "../theme";
import { clamp01, lerp, sstep } from "./Fx";

export type CamKey = { at: number; x: number; y: number; zoom: number; ease?: "smooth" | "linear" | "in" | "out" };

/** Interpolate camera keyframes at time t (seconds, relative to the shot). */
export const camAt = (keys: CamKey[], t: number) => {
  if (t <= keys[0].at) return keys[0];
  const last = keys[keys.length - 1];
  if (t >= last.at) return last;
  let i = 0;
  while (keys[i + 1].at < t) i++;
  const a = keys[i], b = keys[i + 1];
  let u = clamp01((t - a.at) / (b.at - a.at));
  const e = b.ease ?? "smooth";
  u = e === "smooth" ? sstep(u) : e === "in" ? u * u : e === "out" ? 1 - (1 - u) * (1 - u) : u;
  return { at: t, x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), zoom: lerp(a.zoom, b.zoom, u) };
};

/** Handheld drift: slow, layered sines, scaled by `amp` (px). */
export const handheld = (t: number, amp = 1, seed = 0) => ({
  x: (Math.sin(t * 0.9 + seed) * 3 + Math.sin(t * 2.3 + seed * 2) * 1.5) * amp,
  y: (Math.cos(t * 0.7 + seed) * 2 + Math.sin(t * 1.9 + seed) * 1.2) * amp,
  rot: Math.sin(t * 0.5 + seed) * 0.15 * amp,
});

/** Impact shake: decays over `dur` seconds from `age` 0. */
export const shake = (age: number, amp = 18, dur = 0.5, seed = 1) => {
  if (age < 0 || age > dur) return { x: 0, y: 0, rot: 0 };
  const k = (1 - age / dur) ** 2 * amp;
  return {
    x: (random(`sx${seed}${Math.floor(age * 60)}`) - 0.5) * 2 * k,
    y: (random(`sy${seed}${Math.floor(age * 60)}`) - 0.5) * 2 * k,
    rot: (random(`sr${seed}${Math.floor(age * 60)}`) - 0.5) * k * 0.08,
  };
};

export type Layer = { depth: number; children: React.ReactNode; blur?: number; overscan?: number };

/**
 * A 2.5D camera. World space is 1920x1080 at depth 1 (the subject plane).
 * `depth` < 1 is further away: it moves and zooms less about the frame centre;
 * > 1 is closer and moves more. Far layers are overscanned so they never show
 * their edges. `focus` is the depth in focus; layers away from it blur by `dof` px/unit.
 */
export const Camera: React.FC<{
  t: number; keys: CamKey[]; layers: Layer[]; hand?: number; seed?: number;
  shakeAge?: number; shakeAmp?: number; focus?: number; dof?: number; roll?: number;
}> = ({ t, keys, layers, hand = 1, seed = 0, shakeAge = -1, shakeAmp = 18, focus = 1, dof = 0, roll = 0 }) => {
  const c = camAt(keys, t);
  const h = handheld(t, hand, seed);
  const s = shake(shakeAge, shakeAmp, 0.5, seed + 1);
  const cx = c.x + h.x + s.x, cy = c.y + h.y + s.y;
  const rot = h.rot + s.rot + roll;
  return (
    <AbsoluteFill style={{ transform: `rotate(${rot}deg)`, transformOrigin: "50% 50%" }}>
      {layers.map((L, i) => {
        const p = L.depth;
        const z = 1 + (c.zoom - 1) * p;
        const camX = W / 2 + (cx - W / 2) * p, camY = H / 2 + (cy - H / 2) * p;
        const blur = (L.blur ?? 0) + Math.abs(L.depth - focus) * dof;
        const k = L.overscan ?? (p < 1 ? 1 + (1 - p) * 1.6 : 1);
        return (
          <AbsoluteFill
            key={i}
            style={{ transformOrigin: "0 0", transform: `translate(${W / 2 - camX * z}px, ${H / 2 - camY * z}px) scale(${z})`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}
          >
            <AbsoluteFill style={{ transform: `scale(${k})`, transformOrigin: "50% 50%" }}>{L.children}</AbsoluteFill>
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

/** Repeat a 1920-wide layer sideways so a long camera move never runs off its end. */
export const TileX: React.FC<{ from?: number; to?: number; children: React.ReactNode }> = ({ from = -1, to = 3, children }) => (
  <>
    {Array.from({ length: to - from + 1 }, (_, i) => (
      <AbsoluteFill key={i} style={{ transform: `translateX(${(from + i) * W}px)` }}>{children}</AbsoluteFill>
    ))}
  </>
);

/** Directional motion blur (whip pans, fast moves). `amount` in px, `angle` degrees. */
export const MotionBlur: React.FC<{ amount: number; angle?: number; children: React.ReactNode }> = ({ amount, angle = 0, children }) => {
  if (amount < 0.5) return <>{children}</>;
  const id = `mb${Math.round(amount)}_${Math.round(angle)}`;
  return (
    <AbsoluteFill>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation={`${amount} 0`} />
        </filter>
      </svg>
      <AbsoluteFill style={{ transform: `rotate(${angle}deg)` }}>
        <AbsoluteFill style={{ filter: `url(#${id})`, transform: `rotate(${-angle}deg)` }}>{children}</AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/**
 * Whip-pan transition across a cut at `cut` lasting `dur`. Returns the blur amount and
 * `slide` (0..W): draw the outgoing shot at translateX(-slide) and the incoming at
 * translateX(W - slide) (mirror both for dir = -1). Outside the transition `slide` is 0 or W.
 */
export const whip = (t: number, cut: number, dur = 0.22, dir: 1 | -1 = 1) => {
  const u = (t - (cut - dur / 2)) / dur;
  const k = u <= 0 ? 0 : u >= 1 ? 1 : sstep(u);
  const blur = u <= 0 || u >= 1 ? 0 : 70 * Math.sin(u * Math.PI);
  return { blur, slide: k * W * dir, active: u > 0 && u < 1, after: u >= 0.5 } as const;
};

/** Anamorphic-style horizontal light streak on bright points. */
export const LensStreak: React.FC<{ x: number; y: number; w?: number; color?: string; opacity?: number }> = ({ x, y, w = 600, color = "#9fd6ff", opacity = 0.35 }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y - 2, width: w, height: 4, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity, filter: "blur(1px)" }} />
);

/** Soft contact shadow under a character or prop on the ground. */
export const GroundShadow: React.FC<{ x: number; y: number; w?: number; opacity?: number }> = ({ x, y, w = 140, opacity = 0.35 }) => (
  <ellipse cx={x} cy={y} rx={w / 2} ry={w / 9} fill="#0a0610" opacity={opacity} style={{ filter: "blur(4px)" }} />
);
