// Actor v2: our own character rig (2026-10-23, after the user's review of the overnight tests).
// - Matte heads (no clear-coat shine); faces painted on a canvas texture, so every face can differ and every expression animates.
// - Head shapes (round, egg, wide, square, bean, long), hair and headwear (beanie, cap, bucket hat, headphones, hood), glasses, ears.
// - Builds: height, width, leg length. Skin tones for head and hands.
// - Hands are alive: each finger drifts a little on its own clock; `idle()` adds breathing, weight shifts, head drift and blinks per actor seed.
// Same pose system as Person3D (Pose3: arms [fwd, out, elbow, roll], legs [fwd, knee], hands, wrists) so walk3 / run3 / props still work.
import React, { useMemo } from "react";
import * as THREE from "three";
import { HandShape, HANDS, Pose3 } from "../cam3d/Person3D";

const D = THREE.MathUtils.degToRad;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ─── types ───────────────────────────────────────────────────────────────────
export type Eyes = "dot" | "oval" | "tall" | "round" | "sleepy" | "lash" | "wide" | "small" | "almond" | "button";
export type Brows = "none" | "thin" | "thick" | "angled" | "bushy" | "arched" | "flat";
export type Mouth = "line" | "smile" | "small" | "wide" | "smirk" | "soft";
export type FaceStyle = { eyes: Eyes; brows: Brows; mouth: Mouth; nose?: "none" | "dot" | "line" | "button"; freckles?: boolean; blush?: boolean; beard?: "none" | "stubble" | "full" | "mustache"; spacing?: number; eyeY?: number };
export type HeadShape = "round" | "egg" | "wide" | "square" | "bean" | "long";
export type Hair = "none" | "tuft" | "crop" | "bun" | "ponytail" | "afro" | "curls" | "sidepart" | "long" | "buzz";
export type Top = "hoodie" | "jacket" | "tee" | "coat" | "sweater" | "vest";
export type ActorLook = {
  name?: string;
  skin: string; ink: string;                 // head/hand colour; face-mark colour
  shape: HeadShape; face: FaceStyle;
  hair?: Hair; hairColor?: string;
  hat?: "beanie" | "cap" | "bucket"; hatColor?: string;
  headphones?: string; glasses?: "round" | "square"; ears?: boolean;
  top: Top; topColor: string; topDark?: string; trousers: string; shoes: string; scarf?: string; hoodUp?: boolean;
  build?: { h?: number; w?: number; legs?: number; belly?: number };
};
export type Expr = { smile?: number; open?: number; brow?: number; blink?: boolean; eyesBig?: number; lookX?: number; lookY?: number; talk?: number };

// ─── materials (matte) ───────────────────────────────────────────────────────
const matCache = new Map<string, THREE.Material>();
/** Matte cloth / skin: soft three-step toon ramp plus a little roughness, no clear-coat. */
const ramp = (() => {
  const data = new Uint8Array([105, 105, 105, 255, 185, 185, 185, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat); t.minFilter = t.magFilter = THREE.NearestFilter; t.needsUpdate = true; return t;
})();
export const matte = (c: string) => {
  if (!matCache.has(c)) matCache.set(c, new THREE.MeshToonMaterial({ color: c, gradientMap: ramp }));
  return matCache.get(c)!;
};
/** Satin head: a soft broad highlight instead of a hard glossy dot. */
const satin = (c: string) => {
  const k = "satin" + c;
  if (!matCache.has(k)) matCache.set(k, new THREE.MeshStandardMaterial({ color: c, roughness: 0.62, metalness: 0 }));
  return matCache.get(k)!;
};

// ─── face texture ────────────────────────────────────────────────────────────
// The head sphere's UV: u = 0.25 faces +z (the front). 1024 × 512 canvas, ~0.35° per pixel both ways; the face is drawn around (256, 256).
const faceTex = (L: ActorLook, e: Expr) => {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 512;
  const g = c.getContext("2d")!;
  g.fillStyle = L.skin; g.fillRect(0, 0, 1024, 512);
  const F = L.face, ink = L.ink;
  // drawn at 1/2.3 size around (256, 250) then scaled up so the face fills the front of the head
  g.save(); g.translate(256, 250); g.scale(2.3, 2.3); g.translate(-256, -250);
  const cx = 256, ey = 238 - (F.eyeY ?? 0) * 30, sp = 48 * (F.spacing ?? 1);
  const big = 1 + 0.35 * (e.eyesBig ?? 0), lx = (e.lookX ?? 0) * 7, ly = (e.lookY ?? 0) * 6;
  g.fillStyle = ink; g.strokeStyle = ink; g.lineCap = "round"; g.lineJoin = "round";
  // eyes
  for (const s of [-1, 1]) {
    const x = cx + s * sp, y = ey;
    g.save(); g.translate(x, y);
    if (e.blink) { g.lineWidth = 6; g.beginPath(); g.arc(0, -4, 14, 0.2, Math.PI - 0.2); g.stroke(); g.restore(); continue; }
    const pupil = (r: number, ox = 0, oy = 0) => { g.fillStyle = ink; g.beginPath(); g.arc(ox + lx, oy + ly, r, 0, 7); g.fill(); g.fillStyle = L.skin; g.beginPath(); g.arc(ox + lx - r * 0.35, oy + ly - r * 0.4, r * 0.28, 0, 7); g.fill(); g.fillStyle = ink; };
    switch (F.eyes) {
      case "dot": pupil(9 * big); break;
      case "small": pupil(6.5 * big); break;
      case "button": pupil(12 * big); break;
      case "oval": g.beginPath(); g.ellipse(lx, ly, 9 * big, 14 * big, 0, 0, 7); g.fill(); g.fillStyle = L.skin; g.beginPath(); g.arc(lx - 3, ly - 5, 3, 0, 7); g.fill(); break;
      case "tall": g.beginPath(); g.ellipse(lx, ly, 7 * big, 18 * big, 0, 0, 7); g.fill(); g.fillStyle = L.skin; g.beginPath(); g.arc(lx - 2, ly - 7, 2.6, 0, 7); g.fill(); break;
      case "round": g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 17 * big, 0, 7); g.stroke(); pupil(7 * big); break;
      case "wide": g.lineWidth = 5; g.beginPath(); g.ellipse(0, 0, 21 * big, 14 * big, 0, 0, 7); g.stroke(); pupil(7 * big); break;
      case "almond": g.beginPath(); g.moveTo(-20, 0); g.quadraticCurveTo(0, -16 * big, 20, 0); g.quadraticCurveTo(0, 12 * big, -20, 0); g.lineWidth = 4.5; g.stroke(); pupil(7 * big); break;
      case "sleepy": pupil(9 * big); g.fillStyle = L.skin; g.fillRect(-16, -20, 32, 16); g.fillStyle = ink; g.lineWidth = 5; g.beginPath(); g.moveTo(-15, -4); g.lineTo(15, -4); g.stroke(); break;
      case "lash": pupil(10 * big); g.lineWidth = 4; for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(s * 8 + k * 6, -12); g.lineTo(s * 12 + k * 9, -22); g.stroke(); } break;
    }
    g.restore();
  }
  // brows (+ brow = worried: inner ends up; − = angry)
  const b = e.brow ?? 0;
  if (F.brows !== "none") {
    const bw = { thin: 4, thick: 9, angled: 6, bushy: 12, arched: 5, flat: 7 }[F.brows];
    g.lineWidth = bw;
    for (const s of [-1, 1]) {
      const x0 = cx + s * (sp - 22), x1 = cx + s * (sp + 20), y = ey - 34;
      const inner = y - b * 9 + (F.brows === "angled" ? 6 : 0), outer = y + b * 4 - (F.brows === "angled" ? 4 : 0);
      g.beginPath(); g.moveTo(x0, inner);
      if (F.brows === "arched") g.quadraticCurveTo((x0 + x1) / 2, y - 12, x1, outer); else g.lineTo(x1, outer);
      g.stroke();
    }
  }
  // nose
  if (F.nose === "dot") { g.beginPath(); g.arc(cx, ey + 34, 4, 0, 7); g.fill(); }
  if (F.nose === "line") { g.lineWidth = 4; g.beginPath(); g.moveTo(cx + 3, ey + 18); g.quadraticCurveTo(cx + 9, ey + 36, cx - 2, ey + 40); g.stroke(); }
  if (F.nose === "button") { g.globalAlpha = 0.35; g.beginPath(); g.ellipse(cx, ey + 36, 10, 7, 0, 0, 7); g.fill(); g.globalAlpha = 1; }
  // freckles / blush / beard
  if (F.freckles) { g.globalAlpha = 0.6; for (let k = 0; k < 14; k++) { const s = k % 2 ? 1 : -1; g.beginPath(); g.arc(cx + s * (sp + rnd(k) * 18 - 6), ey + 26 + rnd(k + 9) * 16, 2.2, 0, 7); g.fill(); } g.globalAlpha = 1; }
  if (F.blush) { g.fillStyle = "rgba(255,120,120,0.35)"; for (const s of [-1, 1]) { g.beginPath(); g.ellipse(cx + s * (sp + 8), ey + 32, 16, 9, 0, 0, 7); g.fill(); } g.fillStyle = ink; }
  if (F.beard === "stubble") { g.globalAlpha = 0.25; g.beginPath(); g.ellipse(cx, ey + 92, 70, 40, 0, 0, Math.PI); g.fill(); g.globalAlpha = 1; }
  if (F.beard === "full") { g.beginPath(); g.ellipse(cx, ey + 86, 74, 52, 0, 0.05, Math.PI - 0.05); g.fill(); }
  // mouth (talk opens it on speech only)
  const sm = e.smile ?? 0.3, op = Math.max(e.open ?? 0, e.talk ?? 0), my = ey + 66;
  const mouthInk = F.beard === "full" ? L.skin : ink;
  g.strokeStyle = mouthInk; g.fillStyle = mouthInk; g.lineWidth = 5.5;
  if (F.beard === "mustache") { g.fillStyle = ink; g.beginPath(); g.ellipse(cx - 14, my - 10, 18, 7, -0.2, 0, 7); g.ellipse(cx + 14, my - 10, 18, 7, 0.2, 0, 7); g.fill(); g.fillStyle = mouthInk; }
  if (op > 0.12) {
    g.beginPath(); g.ellipse(cx, my + 2, 13 + 6 * sm, 5 + 14 * op, 0, 0, 7); g.fill();
  } else {
    const w = { line: 22, smile: 26, small: 13, wide: 34, smirk: 22, soft: 18 }[F.mouth];
    const curve = (F.mouth === "line" ? 0.4 : 1) * (sm * 14);
    g.beginPath();
    if (F.mouth === "smirk") { g.moveTo(cx - w, my + 2); g.quadraticCurveTo(cx, my + 4 + curve * 0.4, cx + w, my - 6 - curve * 0.3); }
    else { g.moveTo(cx - w, my - curve * 0.25); g.quadraticCurveTo(cx, my + curve, cx + w, my - curve * 0.25); }
    g.stroke();
  }
  g.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
};
const texCache = new Map<string, THREE.CanvasTexture>();
const useFace = (L: ActorLook, e: Expr) => {
  const key = JSON.stringify([L.skin, L.ink, L.face, Math.round((e.smile ?? 0.3) * 10), Math.round((e.open ?? 0) * 10), Math.round((e.talk ?? 0) * 10), Math.round((e.brow ?? 0) * 10), !!e.blink, Math.round((e.eyesBig ?? 0) * 10), Math.round((e.lookX ?? 0) * 6), Math.round((e.lookY ?? 0) * 6)]);
  if (!texCache.has(key)) { if (texCache.size > 600) texCache.clear(); texCache.set(key, faceTex(L, e)); }
  return texCache.get(key)!;
};

// ─── head geometry: a sphere pushed toward a superellipse, then scaled per shape ───
const headGeo = (shape: HeadShape, part?: [number, number, number, number]) => {
  // part = [phi0, phiL, theta0, thetaL]: a piece of the same deformed surface (hair, hats), so it hugs every head shape
  const g = part ? new THREE.SphereGeometry(1, 40, 20, part[0], part[1], part[2], part[3]) : new THREE.SphereGeometry(1, 48, 32);
  const p = g.attributes.position as THREE.BufferAttribute, v = new THREE.Vector3();
  const pw = shape === "square" ? 3.2 : shape === "long" ? 2.4 : 2;
  const sc = SHAPE_SCALE[shape];
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    if (pw !== 2) { const n = Math.pow(Math.pow(Math.abs(v.x), pw) + Math.pow(Math.abs(v.y), pw) + Math.pow(Math.abs(v.z), pw), 1 / pw); v.divideScalar(n); }
    if (shape === "egg") v.x *= 1 - 0.12 * v.y;      // wider at the jaw
    if (shape === "bean") v.z += 0.06 * (1 - v.y * v.y) * Math.max(0, v.z);
    p.setXYZ(i, v.x * sc[0], v.y * sc[1], v.z * sc[2]);
  }
  g.computeVertexNormals();
  return g;
};
const headGeoCache = new Map<string, THREE.BufferGeometry>();
const getHeadGeo = (s: HeadShape) => { if (!headGeoCache.has(s)) headGeoCache.set(s, headGeo(s)); return headGeoCache.get(s)!; };

const R = 0.23;
export const SHAPE_SCALE: Record<HeadShape, [number, number, number]> = { round: [1, 1, 1], egg: [0.95, 1.12, 0.97], wide: [1.13, 0.9, 1.0], square: [1, 0.98, 0.95], bean: [1.0, 1.06, 0.92], long: [0.9, 1.2, 0.95] };
/** A cap of the head sphere from the crown down to `to` (0..1 of the way to the chin), slightly larger than the head. */
const capCache = new Map<string, THREE.BufferGeometry>();
const Cap: React.FC<{ shape: HeadShape; k: number; to: number; m: THREE.Material; from?: number; phi0?: number; phiL?: number; back?: number }> = ({ shape, k, to, m, from = 0, phi0 = 0, phiL = Math.PI * 2, back = 0 }) => {
  const key = [shape, from, to, phi0, phiL].join();
  if (!capCache.has(key)) capCache.set(key, headGeo(shape, [phi0, phiL, from * Math.PI, to * Math.PI]));
  return <mesh geometry={capCache.get(key)} material={m} position={[0, 0, -back]} scale={R * k} castShadow />;
};
const Head: React.FC<{ L: ActorLook; e: Expr }> = ({ L, e }) => {
  const tex = useFace(L, e);
  const hc = L.hairColor ?? "#1A1410", hat = L.hatColor ?? "#5A5A66";
  const top = { round: 1, egg: 1.12, wide: 0.9, square: 0.98, bean: 1.06, long: 1.2 }[L.shape] * R;
  const frame = new THREE.Color(L.skin).getHSL({ h: 0, s: 0, l: 0 }).l < 0.2 ? L.ink : "#1A1A22"; // glasses must read on dark heads
  const wide = { round: 1, egg: 0.95, wide: 1.13, square: 1, bean: 1, long: 0.9 }[L.shape];
  return (
    <group>
      <mesh geometry={getHeadGeo(L.shape)} scale={R} castShadow><meshStandardMaterial map={tex} roughness={0.62} metalness={0} /></mesh>
      {L.ears && [-1, 1].map((k) => <mesh key={k} material={satin(L.skin)} position={[k * R * wide * 0.98, -0.01, 0]} scale={[0.35, 0.6, 0.45]}><sphereGeometry args={[0.07, 14, 10]} /></mesh>)}
      {/* hair (caps hug the head shape) */}
      {L.hair === "crop" && <Cap shape={L.shape} k={1.045} to={0.36} m={matte(hc)} back={0.01} />}
      {L.hair === "buzz" && <Cap shape={L.shape} k={1.015} to={0.33} m={matte(hc)} />}
      {L.hair === "sidepart" && <><Cap shape={L.shape} k={1.05} to={0.38} m={matte(hc)} back={0.01} /><mesh material={matte(hc)} position={[R * 0.35, top * 0.8, R * 0.5]} rotation={[0.7, 0, -0.5]} scale={[1.7, 0.5, 0.9]}><sphereGeometry args={[0.07, 14, 10]} /></mesh></>}
      {L.hair === "tuft" && <mesh material={matte(hc)} position={[0.02, top * 1.02, 0.05]} rotation={[0.4, 0, -0.3]}><torusGeometry args={[0.045, 0.014, 8, 20, Math.PI * 1.4]} /></mesh>}
      {L.hair === "bun" && <><Cap shape={L.shape} k={1.04} to={0.36} m={matte(hc)} back={0.01} /><mesh material={matte(hc)} position={[0, top * 0.92, -R * 0.42]}><sphereGeometry args={[0.085, 16, 12]} /></mesh></>}
      {L.hair === "ponytail" && <><Cap shape={L.shape} k={1.04} to={0.36} m={matte(hc)} back={0.01} /><mesh material={matte(hc)} position={[0, top * 0.25, -R * 1.08]} rotation={[0.5, 0, 0]} scale={[0.8, 1.9, 0.8]}><sphereGeometry args={[0.06, 14, 10]} /></mesh></>}
      {L.hair === "long" && <><Cap shape={L.shape} k={1.06} to={0.4} m={matte(hc)} back={0.01} /><Cap shape={L.shape} k={1.07} from={0.3} to={0.45} phi0={Math.PI * 0.85} phiL={Math.PI * 1.3} m={matte(hc)} back={0.01} /><mesh material={matte(hc)} position={[0, -R * 0.45, -R * 0.5]} scale={[wide * 1.05, 1.25, 0.45]}><sphereGeometry args={[R * 0.9, 20, 12]} /></mesh></>}
      {L.hair === "afro" && <>{Array.from({ length: 24 }, (_, k) => { const a = rnd(k) * Math.PI * 2, el = 0.35 + rnd(k + 5) * 1.15; return <mesh key={k} material={matte(hc)} position={[Math.cos(a) * Math.cos(el) * R * wide * 1.02, Math.sin(el) * top * 1.02, Math.min(Math.sin(a) * Math.cos(el) * R, R * 0.35) - 0.02]}><sphereGeometry args={[0.078, 12, 10]} /></mesh>; })}</>}
      {L.hair === "curls" && <>{Array.from({ length: 18 }, (_, k) => { const a = (k / 18) * Math.PI * 2, el = 0.75 + (k % 3) * 0.28; return <mesh key={k} material={matte(hc)} position={[Math.cos(a) * Math.cos(el) * R * wide, Math.sin(el) * top, Math.min(Math.sin(a) * Math.cos(el) * R, R * 0.3) - 0.01]}><sphereGeometry args={[0.05, 10, 8]} /></mesh>; })}</>}
      {/* hats */}
      {L.hat === "beanie" && <><Cap shape={L.shape} k={1.08} to={0.33} m={matte(hat)} /><mesh material={matte(hat)} position={[0, top * 0.5, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[wide, 1, 1]}><torusGeometry args={[R * 0.92, 0.03, 8, 32]} /></mesh></>}
      {L.hat === "cap" && <group rotation={[D(-6), 0, 0]}><Cap shape={L.shape} k={1.06} to={0.34} m={matte(hat)} /><mesh material={matte(hat)} position={[0, top * 0.48, R * 0.92]} rotation={[D(14), 0, 0]} scale={[1, 0.12, 0.6]}><cylinderGeometry args={[0.16, 0.16, 0.12, 24, 1, false, -Math.PI / 2, Math.PI]} /></mesh></group>}
      {L.hat === "bucket" && <><Cap shape={L.shape} k={1.07} to={0.36} m={matte(hat)} /><mesh material={matte(hat)} position={[0, top * 0.48, 0]} scale={[wide, 1, 1]}><cylinderGeometry args={[R * 1.35, R * 1.45, 0.02, 32]} /></mesh></>}
      {L.hoodUp && <mesh material={matte(L.topColor)} scale={[wide * 1.14, top / R * 1.1, 1.14]} position={[0, 0.02, -0.025]}><sphereGeometry args={[R, 32, 20, D(160), D(220), 0, D(120)]} /></mesh>}
      {/* headphones */}
      {L.headphones && <group>{[-1, 1].map((k) => <mesh key={k} material={matte(L.headphones!)} position={[k * R * wide * 1.02, -0.005, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.07, 0.07, 0.05, 20]} /></mesh>)}<mesh material={matte(L.headphones)} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[wide * 1.08, top / R * 1.08, 1]}><torusGeometry args={[R * 1.02, 0.014, 8, 40, Math.PI]} /></mesh></group>}
      {/* glasses */}
      {L.glasses && <group position={[0, -0.005 + ((L.face.eyeY ?? 0) * 0.02), R * 0.98]}>{[-1, 1].map((k) => <mesh key={k} position={[k * 0.075 * (L.face.spacing ?? 1), 0.0, 0]} material={matte(frame)}>{L.glasses === "round" ? <torusGeometry args={[0.042, 0.007, 8, 28]} /> : <torusGeometry args={[0.046, 0.008, 4, 4]} />}</mesh>)}<mesh position={[0, 0.01, 0.005]} material={matte(frame)}><boxGeometry args={[0.05, 0.008, 0.008]} /></mesh></group>}
    </group>
  );
};

// ─── hands that move ─────────────────────────────────────────────────────────
const Hand: React.FC<{ shape: HandShape | number; side: number; wrist?: [number, number]; skin: string; t: number; seed: number; children?: React.ReactNode }> = ({ shape, side, wrist, skin, t, seed, children }) => {
  const h: { f: number[]; th: number; spread: number } = typeof shape === "number" ? { f: [shape, shape, shape, shape], th: shape * 0.8, spread: 0.1 } : HANDS[shape];
  const bend = wrist?.[0] ?? 8, twist = wrist?.[1] ?? -side * 80;
  const m = satin(skin);
  return (
    <group rotation={[0, D(twist), 0]}>
      <group rotation={[-D(bend), 0, 0]}>
        <mesh material={m} scale={[0.046, 0.055, 0.024]} position={[0, -0.045, 0]} castShadow><sphereGeometry args={[1, 16, 12]} /></mesh>
        {[-1.5, -0.5, 0.5, 1.5].map((k, i) => {
          // each finger drifts on its own clock (never a frozen mitten); fists and grips stay tight
          const tight = h.f[i] > 0.85 ? 0.2 : 1;
          const c = clamp(h.f[i] + tight * (0.07 * Math.sin(t * (1.1 + i * 0.23) + seed * 3 + i) + 0.04 * Math.sin(t * 2.7 + i * 1.7 + seed)), 0, 1);
          const len = i === 3 ? 0.8 : i === 1 ? 1.08 : 1;
          return (
            <group key={k} position={[k * 0.0185, -0.092, 0.004]} rotation={[-D(8 + 70 * c), 0, D(k * 6 * h.spread)]}>
              <mesh material={m} position={[0, -0.017 * len, 0]} castShadow><capsuleGeometry args={[0.0102, 0.022 * len, 4, 8]} /></mesh>
              <group position={[0, -0.036 * len, 0]} rotation={[-D(85 * c), 0, 0]}><mesh material={m} position={[0, -0.012 * len, 0]}><capsuleGeometry args={[0.0095, 0.016 * len, 4, 8]} /></mesh></group>
            </group>
          );
        })}
        <group position={[side * 0.04, -0.045, 0.012]} rotation={[-D(25 + 45 * Math.max(0, h.th)), 0, side * D(h.th < 0 ? -10 : 40 - 25 * h.th)]}>
          <mesh material={m} position={[0, -0.016, 0]} castShadow><capsuleGeometry args={[0.012, 0.022, 4, 8]} /></mesh>
          <group position={[0, -0.032, 0]} rotation={[-D(50 * Math.max(0, h.th)), 0, 0]}><mesh material={m} position={[0, -0.011, 0]}><capsuleGeometry args={[0.011, 0.014, 4, 8]} /></mesh></group>
        </group>
        <group position={[0, -0.075, 0.03]}>{children}</group>
      </group>
    </group>
  );
};

const Seg: React.FC<{ l: number; r0: number; r1: number; mat: THREE.Material; cap?: boolean }> = ({ l, r0, r1, mat, cap = true }) => (
  <>
    {cap && <mesh material={mat} castShadow><sphereGeometry args={[r0, 18, 14]} /></mesh>}
    <mesh material={mat} position={[0, -l / 2, 0]} castShadow><cylinderGeometry args={[r0, r1, l, 18]} /></mesh>
  </>
);
const Shoe: React.FC<{ color: string }> = ({ color }) => (
  <group position={[0, -0.03, 0.04]}>
    <mesh material={matte(color)} scale={[0.055, 0.04, 0.12]} castShadow><sphereGeometry args={[1, 16, 12]} /></mesh>
    <mesh material={matte("#3A3040")} position={[0, -0.03, 0]} scale={[0.056, 0.012, 0.122]}><sphereGeometry args={[1, 16, 8]} /></mesh>
  </group>
);
const torsoPts = (long: boolean, belly: number) => {
  const b = 0.012 * belly;
  const p: [number, number][] = long
    ? [[0, -0.42], [0.25, -0.42], [0.235, -0.2], [0.2 + b, 0.0], [0.188 + b * 1.5, 0.12], [0.2, 0.3], [0.215, 0.42], [0.19, 0.48], [0.1, 0.52], [0, 0.53]]
    : [[0, -0.07], [0.205 + b, -0.07], [0.2 + b * 1.3, 0.02], [0.188 + b * 1.6, 0.12], [0.2, 0.3], [0.215, 0.42], [0.19, 0.48], [0.1, 0.52], [0, 0.53]];
  return p.map(([r, y]) => new THREE.Vector2(r, y));
};
const DEPTH = 0.66;

/** Idle life: breathing, weight shift, slow head drift, a blink every few seconds. Each actor's seed keeps them out of step. */
export const idle = (p: Pose3, t: number, seed: number, amt = 1): { pose: Pose3; blink: boolean } => {
  const s = seed * 1.37;
  const sway = Math.sin(t * 0.55 + s) * amt;
  return {
    pose: {
      ...p,
      bob: (p.bob ?? 0) + 0.004 * Math.sin(t * 1.7 + s) * amt,
      twist: (p.twist ?? 0) + 2.5 * sway,
      lean: (p.lean ?? 0) + 1.2 * Math.sin(t * 1.7 + s),
      headTurn: (p.headTurn ?? 0) + 6 * Math.sin(t * 0.37 + s * 2) * amt + 3 * Math.sin(t * 1.1 + s),
      headNod: (p.headNod ?? 0) + 3 * Math.sin(t * 0.5 + s * 3) * amt,
      legL: p.legL ? [p.legL[0] + 2 * sway, p.legL[1] + Math.max(0, 4 * sway)] : p.legL,
      legR: p.legR ? [p.legR[0] - 2 * sway, p.legR[1] + Math.max(0, -4 * sway)] : p.legR,
    },
    blink: ((t + rnd(seed) * 4) % (3.1 + rnd(seed + 1) * 2.2)) < 0.12,
  };
};

export const Actor: React.FC<{
  look: ActorLook; pos: [number, number, number]; yaw?: number; pose?: Pose3; expr?: Expr; t?: number; seed?: number; alive?: number;
  propR?: React.ReactNode; propL?: React.ReactNode; rotX?: number; rotZ?: number;
}> = ({ look: L, pos, yaw = 0, pose: pose0 = {}, expr = {}, t = 0, seed = 1, alive = 1, propR, propL, rotX = 0, rotZ = 0 }) => {
  const { pose, blink } = alive > 0 ? idle(pose0, t, seed, alive) : { pose: pose0, blink: false };
  const e: Expr = { ...expr, blink: expr.blink ?? blink };
  const B = { h: 1, w: 1, legs: 1, belly: 0, ...L.build };
  const long = L.top === "coat";
  const torsoGeo = useMemo(() => new THREE.LatheGeometry(torsoPts(long, B.belly), 40), [long, B.belly]);
  const topM = matte(L.topColor), topD = matte(L.topDark ?? L.topColor), legs = matte(L.trousers), skin = satin(L.skin);
  const short = L.top === "tee" || L.top === "vest";
  const lean = pose.lean ?? 0, twist = pose.twist ?? 0;
  const arm = (side: 1 | -1, a: [number, number, number] | [number, number, number, number] = [0, 6, 8], prop?: React.ReactNode) => (
    <group position={[side * 0.215 * B.w, 0.44, -0.01]}>
      <mesh material={L.top === "vest" ? skin : topM} castShadow><sphereGeometry args={[0.078, 18, 14]} /></mesh>
      <group rotation={[0, 0, side * D(clamp(a[1], -10, 170))]}>
        <group rotation={[-D(clamp(a[0], -80, 180)), 0, 0]}>
          <group rotation={[0, side * D(clamp(a[3] ?? 0, -110, 110)), 0]}>
            <Seg l={0.27} r0={0.064} r1={0.055} mat={L.top === "vest" ? skin : topM} cap={false} />
            <group position={[0, -0.27, 0]} rotation={[-D(clamp(a[2], 0, 150)), 0, 0]}>
              <Seg l={0.24} r0={0.055} r1={0.046} mat={short ? skin : topM} />
              {!short && <mesh material={topD} position={[0, -0.235, 0]}><cylinderGeometry args={[0.05, 0.05, 0.03, 16]} /></mesh>}
              <group position={[0, -0.25, 0]}><Hand shape={(side === 1 ? pose.handL : pose.handR) ?? (pose.curl !== undefined ? pose.curl : "relaxed")} side={side} wrist={side === 1 ? pose.wristL : pose.wristR} skin={L.skin} t={t} seed={seed + side}>{prop}</Hand></group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
  const leg = (side: 1 | -1, l: [number, number] = [0, 0]) => (
    <group position={[side * 0.095 * B.w, 0, 0]} rotation={[-D(clamp(l[0], -90, 135)), 0, 0]}>
      <Seg l={0.39} r0={0.088 * B.w} r1={0.066} mat={legs} />
      <group position={[0, -0.39, 0]} rotation={[D(clamp(l[1], 0, 150)), 0, 0]}>
        <Seg l={0.36} r0={0.064} r1={0.05} mat={legs} />
        <group position={[0, -0.36, 0]} rotation={[-D(clamp(l[1], 0, 150) - clamp(l[0], -90, 110)) * 0.35, 0, 0]}><Shoe color={L.shoes} /></group>
      </group>
    </group>
  );
  const fz = (r: number) => r * DEPTH + 0.006;
  const legScale = B.legs;
  return (
    <group position={pos} rotation={[0, yaw, 0]} scale={B.h}>
      <group rotation={[rotX, 0, rotZ]}>
        <group position={[0, 0.8 * legScale + (pose.bob ?? 0), 0]}>
          <group scale={[1, legScale, 1]}>{leg(1, pose.legL)}{leg(-1, pose.legR)}</group>
          <mesh material={legs} position={[0, -0.02, 0]} scale={[0.19 * B.w, 0.1, 0.2 * DEPTH * 0.92]} castShadow><sphereGeometry args={[1, 20, 12]} /></mesh>
          <group rotation={[D(lean), D(twist), 0]}>
            <mesh geometry={torsoGeo} material={topM} scale={[B.w, 1, DEPTH * (0.92 + 0.08 * B.w)]} castShadow receiveShadow />
            {L.top === "hoodie" && <>
              {!L.hoodUp && <mesh material={topM} position={[0, 0.45, -0.14]} rotation={[D(-20), 0, 0]} scale={[0.15, 0.13, 0.08]} castShadow><sphereGeometry args={[1, 18, 12]} /></mesh>}
              <mesh material={topM} position={[0, 0.5, -0.01]} rotation={[Math.PI / 2 + D(14), 0, 0]} scale={[B.w, 0.85, 1]}><torusGeometry args={[0.12, 0.052, 12, 28]} /></mesh>
              {[-1, 1].map((k) => <mesh key={k} material={matte("#EDEBE4")} position={[k * 0.045, 0.39, fz(0.2) + 0.012]}><cylinderGeometry args={[0.006, 0.006, 0.14, 6]} /></mesh>)}
              <mesh material={topD} position={[0, 0.1, fz(0.188 + 0.012 * B.belly) - 0.004]} scale={[0.135 * B.w, 0.065, 0.02]}><sphereGeometry args={[1, 20, 10]} /></mesh>
            </>}
            {(L.top === "jacket" || L.top === "coat") && <>
              <mesh material={topD} position={[0, 0.5, 0.005]} scale={[B.w, 1, 0.85]}><cylinderGeometry args={[0.085, 0.13, 0.07, 24, 1, true]} /></mesh>
              <mesh material={topD} position={[0, 0.2, fz(0.2) + 0.002]} scale={[0.012, 0.32, 0.01]}><boxGeometry args={[1, 1, 1]} /></mesh>
            </>}
            {L.top === "sweater" && <mesh material={topD} position={[0, -0.05, 0]} scale={[B.w, 1, DEPTH]}><cylinderGeometry args={[0.208, 0.206, 0.06, 32, 1, true]} /></mesh>}
            {(L.top === "tee" || L.top === "vest") && <mesh material={skin} position={[0, 0.5, 0.0]}><cylinderGeometry args={[0.06, 0.075, 0.05, 16]} /></mesh>}
            {L.scarf && <mesh material={matte(L.scarf)} position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[B.w, 0.9, 1]}><torusGeometry args={[0.1, 0.045, 10, 24]} /></mesh>}
            {arm(1, pose.armL, propL)}
            {arm(-1, pose.armR, propR)}
            <mesh material={skin} position={[0, 0.58, 0]}><cylinderGeometry args={[0.055, 0.06, 0.12, 16]} /></mesh>
            <group position={[0, 0.79, 0.01]} rotation={[D(pose.headNod ?? 0), D(pose.headTurn ?? 0), 0]}><Head L={L} e={e} /></group>
          </group>
        </group>
      </group>
    </group>
  );
};

/** Just a head (for face sheets and inserts). */
export const ActorHead: React.FC<{ look: ActorLook; pos: [number, number, number]; expr?: Expr; yaw?: number }> = ({ look, pos, expr = {}, yaw = 0 }) => (
  <group position={pos} rotation={[0, yaw, 0]}><Head L={look} e={expr} /></group>
);
