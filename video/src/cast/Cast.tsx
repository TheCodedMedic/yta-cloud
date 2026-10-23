// Twenty distinct people for the v2 cast, and two identity options to choose between:
//   "ink":  matte dark heads with light face marks (closest to the genre, but satin, not glossy, and every face different);
//   "skin": matte skin-tone heads with dark face marks (further from other channels; reads warm and human).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { STAND, walk3 } from "../cam3d/Person3D";
import { Cam, useEpFonts } from "../ep04/AssetSheet";
import { V3 } from "../ep04/Vfx";
import { Actor, ActorHead, ActorLook, Expr } from "./Actor";

type Base = Omit<ActorLook, "skin" | "ink">;
const B: Base[] = [
  { name: "Kai", shape: "round", face: { eyes: "oval", brows: "thick", mouth: "smile" }, hair: "tuft", top: "hoodie", topColor: "#2E5FD0", topDark: "#1F3F94", trousers: "#27324F", shoes: "#E9ECF4" },
  { name: "Theo", shape: "square", face: { eyes: "dot", brows: "flat", mouth: "wide", nose: "line" }, hat: "beanie", hatColor: "#D9472B", top: "jacket", topColor: "#4E7A4A", topDark: "#36583A", trousers: "#2A2A30", shoes: "#151515", build: { w: 1.12 } },
  { name: "Mia", shape: "egg", face: { eyes: "lash", brows: "arched", mouth: "small", blush: true }, hair: "ponytail", hairColor: "#3A2418", top: "hoodie", topColor: "#E87AA8", topDark: "#B85A84", trousers: "#3A3550", shoes: "#F4F4F4", build: { h: 0.8 } },
  { name: "Grandad", shape: "long", face: { eyes: "sleepy", brows: "bushy", mouth: "line", beard: "mustache", nose: "button" }, hat: "cap", hatColor: "#4A4A52", glasses: "round", ears: true, top: "coat", topColor: "#7A6A5A", topDark: "#5A4A3E", trousers: "#3A3A44", shoes: "#2A1E16", scarf: "#8A3A3A", build: { h: 0.97, belly: 1.5 } },
  { name: "Ava", shape: "bean", face: { eyes: "almond", brows: "thin", mouth: "soft", freckles: true }, hair: "long", hairColor: "#5A3420", top: "sweater", topColor: "#F2C23A", topDark: "#C89A22", trousers: "#2A3450", shoes: "#F1F1F1" },
  { name: "Dele", shape: "wide", face: { eyes: "round", brows: "thick", mouth: "smirk" }, hair: "buzz", top: "tee", topColor: "#E07A2E", trousers: "#2A2F3E", shoes: "#F1F1F1", build: { w: 1.2, h: 1.06 } },
  { name: "Rosa", shape: "round", face: { eyes: "wide", brows: "arched", mouth: "smile", blush: true }, hair: "bun", hairColor: "#1A1410", top: "jacket", topColor: "#8A3A4A", topDark: "#6A2A36", trousers: "#2A2A34", shoes: "#151515" },
  { name: "Sam", shape: "egg", face: { eyes: "small", brows: "angled", mouth: "line", nose: "dot" }, headphones: "#F2B84B", hair: "crop", top: "hoodie", topColor: "#3A3A44", topDark: "#26262E", trousers: "#5A6A8A", shoes: "#F1F1F1", build: { w: 0.9, h: 1.04 } },
  { name: "Nia", shape: "long", face: { eyes: "button", brows: "thin", mouth: "smile" }, hair: "afro", hairColor: "#1A1410", top: "tee", topColor: "#4EB89A", trousers: "#2A3450", shoes: "#E9ECF4", build: { w: 0.92 } },
  { name: "Leo", shape: "square", face: { eyes: "tall", brows: "flat", mouth: "soft", beard: "stubble" }, hair: "sidepart", hairColor: "#3A2A1A", top: "coat", topColor: "#2F2F36", topDark: "#1E1E24", trousers: "#2F2F36", shoes: "#0E0E0E", build: { h: 1.08 } },
  { name: "Ivy", shape: "bean", face: { eyes: "oval", brows: "arched", mouth: "small", freckles: true }, hat: "bucket", hatColor: "#C9B48A", top: "vest", topColor: "#E9E2D0", trousers: "#6A4E3A", shoes: "#3A2A20", build: { h: 0.9 } },
  { name: "Omar", shape: "wide", face: { eyes: "almond", brows: "bushy", mouth: "wide", beard: "full" }, ears: true, top: "sweater", topColor: "#2E6A8A", topDark: "#1F4A66", trousers: "#2A2A30", shoes: "#151515", build: { w: 1.25, belly: 2 } },
  { name: "Zoe", shape: "round", face: { eyes: "lash", brows: "thin", mouth: "smirk" }, hair: "curls", hairColor: "#7A3A1A", glasses: "square", top: "jacket", topColor: "#F2E84A", topDark: "#C8BE2A", trousers: "#1E222E", shoes: "#E9ECF4" },
  { name: "Ben", shape: "egg", face: { eyes: "dot", brows: "thick", mouth: "smile", nose: "button" }, hat: "cap", hatColor: "#1B2A4E", top: "tee", topColor: "#B8432F", trousers: "#27324F", shoes: "#F1F1F1", build: { h: 0.86, w: 1.05 } },
  { name: "June", shape: "long", face: { eyes: "sleepy", brows: "arched", mouth: "soft" }, hair: "long", hairColor: "#C9A060", top: "coat", topColor: "#6A4E8A", topDark: "#4E3868", trousers: "#2A2A34", shoes: "#151515" },
  { name: "Tariq", shape: "square", face: { eyes: "round", brows: "angled", mouth: "line" }, hair: "buzz", headphones: "#E9ECF4", top: "hoodie", topColor: "#5A5E6E", topDark: "#40434F", trousers: "#2B2F3A", shoes: "#111111", build: { w: 1.08 } },
  { name: "Lily", shape: "egg", face: { eyes: "button", brows: "thin", mouth: "small", blush: true, freckles: true }, hair: "bun", hairColor: "#E0B070", top: "sweater", topColor: "#9AD0D8", topDark: "#70A8B0", trousers: "#3A3A44", shoes: "#F4F4F4", build: { h: 0.78 } },
  { name: "Marcus", shape: "wide", face: { eyes: "tall", brows: "flat", mouth: "smirk", beard: "stubble" }, hat: "beanie", hatColor: "#2A2A30", top: "jacket", topColor: "#C9B48A", topDark: "#A08B62", trousers: "#3A3A44", shoes: "#2A1E16", build: { h: 1.1, w: 1.1 } },
  { name: "Priya", shape: "bean", face: { eyes: "almond", brows: "arched", mouth: "smile", nose: "dot" }, hair: "ponytail", hairColor: "#1A1410", top: "vest", topColor: "#D9472B", trousers: "#2A3450", shoes: "#F1F1F1" },
  { name: "Nana", shape: "round", face: { eyes: "small", brows: "bushy", mouth: "soft", nose: "button" }, hair: "curls", hairColor: "#D8D8DC", glasses: "round", top: "coat", topColor: "#7A9A6A", topDark: "#5A7A4E", trousers: "#5A5A66", shoes: "#3A2A20", scarf: "#E8C24A", build: { h: 0.9, belly: 1.2 } },
];
const SKINS = ["#C68C5E", "#8D5A3B", "#E8B98E", "#6B3F2A", "#D9A47A", "#A86F4C", "#F1C9A5", "#5A3626"];
export const CAST_INK: ActorLook[] = B.map((b) => ({ ...b, skin: "#20181E", ink: "#F4EFE6" }));
export const CAST_SKIN: ActorLook[] = B.map((b, i) => ({ ...b, skin: SKINS[(i * 3) % SKINS.length], ink: "#1E1418" }));

// ─── review sheet: panel 0/1 = lineup (ink / skin), panel 2/3 = faces close-up (ink / skin), panel 4 = expressions ───
const Lights: React.FC = () => (
  <>
    <color attach="background" args={["#EAE6DE"]} />
    <hemisphereLight args={["#FFF6EA", "#8A8078", 1.3]} />
    <directionalLight position={[3, 6, 8]} intensity={2.2} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={6} shadow-camera-bottom={-2} />
    <directionalLight position={[-6, 3, -6]} intensity={1.2} color="#CFE0FF" />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[60, 30]} /><meshToonMaterial color="#D8D2C8" /></mesh>
  </>
);
const EXPRS: Expr[] = [{ smile: 0.9 }, { smile: 0, brow: 0.9 }, { smile: 0, brow: -0.8 }, { open: 0.7, eyesBig: 1 }, { smile: 0.4, lookX: 1 }, { blink: true, smile: 0.6 }, { talk: 0.5, smile: 0.3 }, { smile: 0, brow: 0.5, lookY: 1 }];
const PANELS = 5;
export const CAST_PANELS = PANELS;
export const CastSheet: React.FC = () => {
  const ready = useEpFonts();
  const f = useCurrentFrame();
  if (!ready) return <AbsoluteFill style={{ background: "#EAE6DE" }} />;
  const cast = f % 2 === 0 ? CAST_INK : CAST_SKIN;
  const title = ["Option A · ink heads (matte)", "Option B · skin tones (matte)", "Faces · option A", "Faces · option B", "Expressions · option B"][f];
  let cam: { pos: V3; target: V3; fov: number };
  let scene: React.ReactNode;
  if (f < 2) {
    cam = { pos: [0, 4.6, 15.5], target: [0, 0.6, -0.8], fov: 30 };
    scene = cast.map((L, i) => { const row = Math.floor(i / 10), x = -5.9 + (i % 10) * 1.25 + (row ? 0.62 : 0); return <Actor key={i} look={L} pos={[x, 0, row ? -2.2 : 0.6]} yaw={0.15 * Math.sin(i * 1.7)} pose={STAND} t={2 + i * 0.7} seed={i + 1} />; });
  } else if (f < 4) {
    const c = f === 2 ? CAST_INK : CAST_SKIN;
    cam = { pos: [0, -0.05, 4.7], target: [0, -0.05, 0], fov: 30 };
    scene = c.map((L, i) => <ActorHead key={i} look={L} pos={[-1.7 + (i % 5) * 0.85, 0.82 - Math.floor(i / 5) * 0.6, 0]} yaw={0.25 * Math.sin(i * 2.1)} expr={{ smile: 0.4 + 0.3 * Math.sin(i) }} />);
  } else {
    cam = { pos: [0, 1.5, 6.4], target: [0, 1.25, 0], fov: 32 };
    scene = EXPRS.map((e, i) => <Actor key={i} look={CAST_SKIN[[0, 2, 6, 11, 4, 8, 1, 16][i]]} pos={[-2.45 + i * 0.7, 0, 0]} pose={STAND} t={1} seed={i} alive={0} expr={e} />);
  }
  return (
    <AbsoluteFill style={{ background: "#EAE6DE" }}>
      <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 35, position: [0, 2, 6] }}>
        <Cam {...cam} />
        <Lights />
        {scene}
      </ThreeCanvas>
      <div style={{ position: "absolute", left: 50, top: 30, fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 52, color: "#1E1418" }}>{title}</div>
      {f < 2 && <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, display: "flex", justifyContent: "center", gap: 0, fontFamily: "'Manrope'", fontWeight: 700, fontSize: 22, color: "#3A3038" }}>{cast.map((L) => L.name).join(" · ")}</div>}
    </AbsoluteFill>
  );
};
export { walk3 };
