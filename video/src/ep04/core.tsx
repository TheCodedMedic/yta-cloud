// Episode 04 core: word timing, easing and camera helpers, the Shot type, and the frame renderer shared by every part.
import React from "react";
import { AbsoluteFill } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { Cam } from "./AssetSheet";
import { V3 } from "./Vfx";
import TIMING from "./timing.json";

export const FPS4 = 30;
type W = { b: number; w: string; s: number; e: number };
const WORDS = TIMING.words as W[];
const BEATS = TIMING.beats as { b: number; s: number; e: number; gap: number }[];
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");
/** Start time (s, master) of the nth `word` in beat b (1-based beats). */
export const at = (b: number, word: string, nth = 1, off = 0) => {
  const hits = WORDS.filter((w) => w.b === b && norm(w.w) === norm(word));
  if (!hits[nth - 1]) throw new Error(`word ${word}#${nth} not in beat ${b}`);
  return hits[nth - 1].s + off;
};
/** End time of the nth `word` in beat b. */
export const atE = (b: number, word: string, nth = 1, off = 0) => {
  const hits = WORDS.filter((w) => w.b === b && norm(w.w) === norm(word));
  if (!hits[nth - 1]) throw new Error(`word ${word}#${nth} not in beat ${b}`);
  return hits[nth - 1].e + off;
};
export const PS = (b: number) => BEATS[b - 1].s;
export const PE = (b: number) => BEATS[b - 1].e;
/** A cut lands just before a line starts. */
export const P = (b: number) => PS(b) - 0.12;
export const FILM_END = PE(87) + 2.4;

export const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const seg = (t: number, a: number, b: number) => c01((t - a) / (b - a));
export const io = (x: number) => { x = c01(x); return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
export const ex = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * c01(x)));
export const L3 = (a: V3, b: V3, u: number): V3 => [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
export const nz = (t: number, s: number) => Math.sin(t * 1.3 + s) * 0.6 + Math.sin(t * 2.9 + s * 2) * 0.3 + Math.sin(t * 6.1 + s * 3) * 0.1;
export const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export type CamS = { pos: V3; target: V3; fov: number; roll?: number };
export const hand = (c: CamS, t: number, a = 0.012): CamS => ({ ...c, pos: [c.pos[0] + nz(t, 1) * a, c.pos[1] + nz(t, 2) * a, c.pos[2]], target: [c.target[0] + nz(t, 3) * a * 0.6, c.target[1] + nz(t, 4) * a * 0.6, c.target[2]] });
export const shakeC = (c: CamS, t: number, amt: number): CamS => (amt > 0 ? { ...c, target: [c.target[0] + nz(t * 9, 5) * amt, c.target[1] + nz(t * 9, 6) * amt, c.target[2]] } : c);
export const RUN_Y = Math.PI / 2;
/** Orbit helper: camera on a circle around `c` at angle a (deg), radius r, height y. */
export const orbit = (c: V3, a: number, r: number, y: number): V3 => [c[0] + Math.sin((a * Math.PI) / 180) * r, y, c[2] + Math.cos((a * Math.PI) / 180) * r];

/** grade: optional CSS filter on the 3D layer (e.g. the cold Part 2 teaser). dom: 2D layer drawn over the 3D (phones, graphs). */
export type Shot = { id: string; t0: number; t1: number; scene: (t: number) => React.ReactNode; cam: (t: number) => CamS; noBlur?: boolean; grade?: string; dom?: (t: number) => React.ReactNode; no3d?: boolean };

export const pickShot = (shots: Shot[], t: number) => shots.find((s) => t >= s.t0 && t < s.t1) ?? shots[shots.length - 1];
const blurOf = (s: Shot, t: number) => {
  const d = (c: CamS) => new THREE.Vector3(c.target[0] - c.pos[0], c.target[1] - c.pos[1], c.target[2] - c.pos[2]).normalize();
  const a = s.cam(t - 1 / 60), b = s.cam(t + 1 / 60);
  const ang = (d(a).angleTo(d(b)) * 180) / Math.PI;
  return Math.min(40, Math.max(0, (ang - 0.9) * (900 / a.fov) * 0.18));
};

export const ShotFrame: React.FC<{ shots: Shot[]; t: number; type?: React.FC<{ t: number }>; label?: string }> = ({ shots, t, type: Type, label }) => {
  const s = pickShot(shots, t), cam = s.cam(t), bl = s.noBlur ? 0 : blurOf(s, t);
  return (
    <AbsoluteFill style={{ background: "#05070F" }}>
      {!s.no3d && (
        <>
          <svg width={0} height={0} style={{ position: "absolute" }}><filter id="mb4" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation={`${bl} 0`} /></filter></svg>
          <AbsoluteFill style={{ filter: [bl > 0.3 ? "url(#mb4)" : "", s.grade ?? ""].join(" ").trim() || undefined }}>
            <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 35, position: [0, 2, 6] }}>
              <Cam pos={cam.pos} target={cam.target} fov={cam.fov} roll={cam.roll} />
              {s.scene(t)}
            </ThreeCanvas>
          </AbsoluteFill>
        </>
      )}
      {s.dom?.(t)}
      {Type && <Type t={t} />}
      {label && <div style={{ position: "absolute", right: 20, bottom: 14, color: "#fff", font: "700 30px sans-serif", textShadow: "0 0 6px #000" }}>{label}</div>}
    </AbsoluteFill>
  );
};
