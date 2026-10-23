// Shared kit for Episodes 05 and 06: word-timing helpers from a timing.json, the new cast looks, a film assembler
// (picture, review strips) and in-world 3D overlays (camera-facing thought cards, damage glows, expanding rings).
import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Look3, LOOKS, Person3D } from "../cam3d/Person3D";
import { useEpFonts } from "../ep04/AssetSheet";
import { FPS4, Shot, ShotFrame } from "../ep04/core";
import { V3 } from "../ep04/Vfx";

export type Timing = { words: { b: number; w: string; s: number; e: number }[]; beats: { b: number; s: number; e: number; gap: number }[] };
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9']/g, "");

/** at(beat, word, nth, off): start of the nth `word` in beat b (1-based). atE: its end. PS/PE: beat edges. P: a cut 0.12 s before a beat. */
export const makeT = (T: Timing) => {
  const find = (b: number, word: string, nth: number) => {
    const hits = T.words.filter((w) => w.b === b && norm(w.w) === norm(word));
    if (!hits[nth - 1]) throw new Error(`word ${word}#${nth} not in beat ${b}: ${T.words.filter((w) => w.b === b).map((w) => w.w).join(" ")}`);
    return hits[nth - 1];
  };
  const at = (b: number, word: string, nth = 1, off = 0) => find(b, word, nth).s + off;
  const atE = (b: number, word: string, nth = 1, off = 0) => find(b, word, nth).e + off;
  const PS = (b: number) => T.beats[b - 1].s;
  const PE = (b: number) => T.beats[b - 1].e;
  const P = (b: number) => PS(b) - 0.12;
  const N = T.beats.length;
  return { at, atE, PS, PE, P, N, END: PE(N) + 2.4 };
};

// ─── cast ────────────────────────────────────────────────────────────────────
export const CAST: Record<string, Look3> = {
  hero: LOOKS.hoodie,
  theo: { coat: "#E07A2E", coatDark: "#B05A1E", trousers: "#2A2F3E", shoes: "#F1F1F1", hoodie: true },
  mia: { coat: "#E87AA8", coatDark: "#B85A84", trousers: "#3A3550", shoes: "#F4F4F4", hoodie: true },
  grandad: { coat: "#7A6A5A", coatDark: "#5A4A3E", trousers: "#3A3A44", shoes: "#2A1E16", long: true, cap: "#4A4A52", scarf: "#8A3A3A" },
  doctor: { coat: "#F2F4F6", coatDark: "#C9CED6", trousers: "#3A5A8A", shoes: "#E9ECF4", long: true },
  nurse: { coat: "#5A9AC0", coatDark: "#3E7898", trousers: "#5A9AC0", shoes: "#F1F1F1" },
  jo: { coat: "#7A4E8E", coatDark: "#5A3870", trousers: "#2A2236", shoes: "#151515", long: true, scarf: "#E8C24A" },
  performer: { coat: "#C9A04A", coatDark: "#9A7830", trousers: "#5A3A2A", shoes: "#3A2A20", sleeveless: true },
  dentist: { coat: "#9AD0D8", coatDark: "#70A8B0", trousers: "#9AD0D8", shoes: "#F1F1F1" },
  boss: { coat: "#3A3A44", coatDark: "#26262E", trousers: "#26262E", shoes: "#111111", button: true },
  mum: { coat: "#4E7A6A", coatDark: "#36584A", trousers: "#2A2A34", shoes: "#2A1E16", long: true },
  girl: { coat: "#F2C23A", coatDark: "#C89A22", trousers: "#2A3450", shoes: "#F1F1F1", long: true },
  teacher: LOOKS.teacher,
  wig: { coat: "#5A5E6E", coatDark: "#40434F", trousers: "#2B2F3A", shoes: "#111111", long: true },
  ivw1: { coat: "#2A3450", coatDark: "#1B2236", trousers: "#2A3450", shoes: "#111111", button: true },
  ivw2: { coat: "#8A3A4A", coatDark: "#6A2A36", trousers: "#2A2A34", shoes: "#151515", long: true },
  ivw3: { coat: "#5A6A4A", coatDark: "#405034", trousers: "#2A2A30", shoes: "#151515" },
};

/** A smaller person (child): the same rig scaled about the feet. Seats must be given in local units (seat / s). */
export const Kid: React.FC<React.ComponentProps<typeof Person3D> & { s?: number }> = ({ s = 0.82, pos, ...rest }) => (
  <group position={pos} scale={s}><Person3D pos={[0, 0, 0]} {...rest} /></group>
);

// ─── in-world overlays ───────────────────────────────────────────────────────
/** Children always face the camera (the Cam component sets the camera before the scene renders). */
export const Billboard: React.FC<{ p: V3; children: React.ReactNode }> = ({ p, children }) => {
  const camera = useThree((s) => s.camera);
  return <group position={p} quaternion={camera.quaternion.clone()}>{children}</group>;
};

const cardTex = (text: string, color: string, ink: string, w: number) => {
  const c = document.createElement("canvas"); const g = c.getContext("2d")!;
  const font = "800 64px 'Plus Jakarta Sans'"; g.font = font;
  const words = text.split(" "); const lines: string[] = []; let cur = "";
  for (const wd of words) { const nx = cur ? cur + " " + wd : wd; if (g.measureText(nx).width > w - 90 && cur) { lines.push(cur); cur = wd; } else cur = nx; }
  if (cur) lines.push(cur);
  const lw = Math.max(...lines.map((l) => g.measureText(l).width));
  c.width = Math.ceil(lw + 100); c.height = 40 + lines.length * 78 + 60;
  g.font = font; g.fillStyle = color; g.beginPath(); g.roundRect(4, 4, c.width - 8, c.height - 54, 44); g.fill();
  g.beginPath(); g.moveTo(c.width * 0.3, c.height - 52); g.lineTo(c.width * 0.22, c.height - 6); g.lineTo(c.width * 0.42, c.height - 52); g.fill();
  g.fillStyle = ink; g.textBaseline = "top"; lines.forEach((l, i) => g.fillText(l, 50, 30 + i * 78));
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return { t, aspect: c.width / c.height, rows: c.height / 130 };
};
/** A thought (or speech) card floating in the world, facing the camera. `pop` 0..1 scales it in. h = height in metres. */
export const ThoughtCard: React.FC<{ p: V3; text: string; pop?: number; h?: number; color?: string; ink?: string; w?: number; glow?: boolean }> = ({ p, text, pop = 1, h = 0.32, color = "#F6F1E6", ink = "#0B1226", w = 560, glow = true }) => {
  const { t, aspect, rows } = useMemo(() => cardTex(text, color, ink, w), [text, color, ink, w]);
  if (pop <= 0.01) return null;
  const k = 1 + 2.7 * Math.pow(Math.min(1, pop) - 1, 3) + 1.7 * Math.pow(Math.min(1, pop) - 1, 2);
  const H = h * rows; // h = height of one line of text (m); the card sits on its tail point
  return (
    <Billboard p={p}>
      <group scale={k}><group position={[0, H / 2, 0]}>
        {glow && <mesh position={[0, 0, -0.01]}><planeGeometry args={[H * aspect * 1.12, H * 1.2]} /><meshBasicMaterial color="#BFE6FF" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>}
        <mesh><planeGeometry args={[H * aspect, H]} /><meshBasicMaterial map={t} transparent toneMapped={false} depthWrite={false} /></mesh>
      </group></group>
    </Billboard>
  );
};

/** Expanding rings on the ground from a person: the radius the thoughts carry (Ep06) or a pulse (Ep05). age in s. */
export const Ripples: React.FC<{ c: V3; age: number; color?: string; max?: number; n?: number; period?: number; opacity?: number }> = ({ c, age, color = "#9FD8FF", max = 10, n = 3, period = 1.6, opacity = 0.7 }) => {
  if (age < 0) return null;
  return (
    <group position={[c[0], 0.03, c[2]]} rotation={[-Math.PI / 2, 0, 0]}>
      {Array.from({ length: n }, (_, k) => {
        const u = ((age + (k * period) / n) % period) / period;
        const r = 0.3 + u * max;
        return <mesh key={k}><ringGeometry args={[r, r + 0.06 + 0.04 * u * max * 0.1, 96]} /><meshBasicMaterial color={color} transparent opacity={opacity * (1 - u) * Math.min(1, age * 2)} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>;
      })}
    </group>
  );
};

/** A soft glowing sphere (the edge of the ten-metre zone, a light source, an aura). */
export const GlowBall: React.FC<{ p: V3; r: number; color?: string; opacity?: number; wire?: boolean }> = ({ p, r, color = "#9FD8FF", opacity = 0.12, wire }) => (
  <mesh position={p}><sphereGeometry args={[r, 48, 24]} /><meshBasicMaterial color={color} transparent opacity={opacity} wireframe={wire} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
);

/** Hidden damage the hero can't feel: a pulsing red glow at a body point (s = size, amt 0..1). */
export const Damage: React.FC<{ p: V3; t: number; amt?: number; s?: number }> = ({ p, t, amt = 1, s = 0.09 }) => {
  if (amt <= 0.01) return null;
  const k = 0.75 + 0.25 * Math.sin(t * 7);
  return (
    <group position={p}>
      <mesh><sphereGeometry args={[s * 0.55, 16, 12]} /><meshBasicMaterial color="#FF3A2A" transparent opacity={0.8 * amt} toneMapped={false} depthWrite={false} /></mesh>
      <mesh><sphereGeometry args={[s * 1.3 * k, 16, 12]} /><meshBasicMaterial color="#FF5A3A" transparent opacity={0.28 * amt} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      <pointLight color="#FF4A2A" intensity={1.6 * amt * k} distance={1.2} />
    </group>
  );
};

// ─── film assembly ───────────────────────────────────────────────────────────
/** Join shot lists: sort by start and make each shot end where the next begins. */
export const joinShots = (lists: Shot[][], end: number): Shot[] =>
  lists.flat().sort((a, b) => a.t0 - b.t0).map((s, i, arr) => ({ ...s, t1: arr[i + 1] ? arr[i + 1].t0 : end }));

export const makeFilm = (all: Shot[], Type: React.FC<{ t: number }>, end: number) => {
  const frames = Math.round(end * FPS4);
  const Picture: React.FC = () => {
    const ready = useEpFonts();
    const t = useCurrentFrame() / FPS4;
    if (!ready) return <AbsoluteFill style={{ background: "#05070F" }} />;
    return <ShotFrame shots={all} t={t} type={Type} />;
  };
  // review strips: every shot at 15 / 50 / 85 %, labelled
  const list = all.flatMap((s) => [0.15, 0.5, 0.85].map((p) => [s, p] as const));
  const Strips: React.FC = () => {
    const ready = useEpFonts();
    const [s, p] = list[Math.min(list.length - 1, useCurrentFrame())];
    const t = s.t0 + (s.t1 - s.t0) * p;
    if (!ready) return <AbsoluteFill style={{ background: "#05070F" }} />;
    return <ShotFrame shots={all} t={t} type={Type} label={`${s.id} ${t.toFixed(2)}s`} />;
  };
  return { Picture, Strips, frames, strips: list.length, ids: all.map((s) => s.id) };
};
