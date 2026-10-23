// Episode 04 detailed interiors and the car park (v2, after the user's "we need details" note), plus painted photos.
// Same coordinates as the v1 sets so every camera still works:
//   Kitchen: room 7 × 6 (back wall z −3, side walls x ±3.5, front wall with a doorway at z 4), table at (0, 0.3), top 0.78
//   Bedroom: room 5 × 5 (open on +z), bed x −2.1..−0.7 / z −2.35..−0.25 (mattress top 0.69), desk at (1.6, −1.9), window at (0.6, 1.65, −2.49)
//   Classroom: room 12 × 10, desks in a 4 × 3 grid, the hero's desk is the back-right one at (3.8, 2.4)
//   CarPark: fills the gap where the café stood (x −5.9..0.8, z −3..−11)
import React, { useMemo } from "react";
import * as THREE from "three";
import { LOOKS, Person3D, STAND, toon } from "../cam3d/Person3D";
import { Chair, sitOn } from "../cam3d/Props3D";
import { Mood } from "./Sets";
import { Car } from "./Sets2";

const D = THREE.MathUtils.degToRad;
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const tex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep?: [number, number]) => {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); }
  return t;
};
const Box: React.FC<{ p: [number, number, number]; s: [number, number, number]; c: string; r?: [number, number, number]; cast?: boolean }> = ({ p, s, c, r, cast = true }) => (
  <mesh position={p} rotation={r} material={toon(c)} castShadow={cast} receiveShadow><boxGeometry args={s} /></mesh>
);

// ─── painted photos ──────────────────────────────────────────────────────────
type PhotoKind = "beach" | "family" | "birthday" | "mountains" | "graduation" | "dog" | "brothers";
const person = (g: CanvasRenderingContext2D, x: number, y: number, s: number, top: string, smile = true) => {
  g.fillStyle = top; g.beginPath(); g.roundRect(x - 22 * s, y + 28 * s, 44 * s, 70 * s, 12 * s); g.fill();
  g.fillStyle = "#0E070D"; g.beginPath(); g.arc(x, y, 28 * s, 0, 7); g.fill();
  g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.arc(x - 9 * s, y - 11 * s, 6 * s, 0, 7); g.fill();
  g.strokeStyle = "#F4EFE6"; g.lineWidth = 3 * s; g.lineCap = "round";
  [-9, 9].forEach((dx) => { g.beginPath(); g.arc(x + dx * s, y - 2 * s, 4.5 * s, 0, 7); g.stroke(); });
  g.beginPath(); smile ? g.arc(x, y + 7 * s, 9 * s, 0.25, Math.PI - 0.25) : (g.moveTo(x - 7 * s, y + 12 * s), g.lineTo(x + 7 * s, y + 12 * s)); g.stroke();
};
export const drawPhoto = (kind: PhotoKind) => tex(512, 400, (g) => {
  const sky = (a: string, b: string) => { const gr = g.createLinearGradient(0, 0, 0, 260); gr.addColorStop(0, a); gr.addColorStop(1, b); g.fillStyle = gr; g.fillRect(0, 0, 512, 400); };
  if (kind === "beach") {
    sky("#4FA8E8", "#BFE6F8"); g.fillStyle = "#FFE08A"; g.beginPath(); g.arc(420, 70, 38, 0, 7); g.fill();
    g.fillStyle = "#1E78B8"; g.fillRect(0, 210, 512, 60); g.fillStyle = "#F7FBFF"; for (let i = 0; i < 12; i++) g.fillRect(i * 45 + 10, 222 + (i % 3) * 12, 26, 3);
    g.fillStyle = "#F0D9A0"; g.fillRect(0, 270, 512, 130);
    g.fillStyle = "#D9472B"; g.beginPath(); g.moveTo(70, 200); g.quadraticCurveTo(130, 140, 190, 200); g.fill(); g.fillStyle = "#3A2A22"; g.fillRect(127, 195, 5, 110);
    person(g, 250, 250, 1, "#E58A3A"); person(g, 320, 245, 1.05, "#7A5A8C"); person(g, 385, 262, 0.8, "#2E5FD0");
  } else if (kind === "family") {
    sky("#E8D4B8", "#D9C0A0"); g.fillStyle = "#8A5A3E"; g.fillRect(0, 300, 512, 100); g.fillStyle = "#4E6A8A"; g.beginPath(); g.roundRect(70, 230, 372, 90, 20); g.fill();
    g.fillStyle = "#F6F1E6"; g.fillRect(380, 60, 90, 120); g.fillStyle = "#9CC8F0"; g.fillRect(388, 68, 74, 104);
    person(g, 150, 200, 1.1, "#7A5A8C"); person(g, 230, 190, 1.2, "#5A5E6E"); person(g, 300, 220, 0.85, "#2E5FD0"); person(g, 360, 228, 0.75, "#A0303C");
  } else if (kind === "birthday") {
    sky("#F6C8D8", "#FBE4EC"); ["#D9472B", "#F2B84B", "#2E5FD0", "#4E9A4E"].forEach((c, i) => { g.fillStyle = c; g.beginPath(); g.ellipse(60 + i * 120, 70 + (i % 2) * 20, 26, 32, 0, 0, 7); g.fill(); g.strokeStyle = "#666"; g.lineWidth = 1; g.beginPath(); g.moveTo(60 + i * 120, 102); g.lineTo(60 + i * 120, 160); g.stroke(); });
    g.fillStyle = "#F6F1E6"; g.fillRect(170, 270, 170, 70); g.fillStyle = "#E8A0B8"; g.fillRect(170, 262, 170, 16);
    for (let i = 0; i < 5; i++) { g.fillStyle = "#F2B84B"; g.fillRect(190 + i * 32, 238, 6, 26); g.fillStyle = "#FF8A3A"; g.beginPath(); g.ellipse(193 + i * 32, 232, 5, 9, 0, 0, 7); g.fill(); }
    person(g, 110, 220, 1, "#2E5FD0"); person(g, 410, 225, 0.9, "#A0303C");
  } else if (kind === "mountains") {
    sky("#7FB4E6", "#E6F1FA"); g.fillStyle = "#6A7A9A"; g.beginPath(); g.moveTo(0, 260); g.lineTo(140, 90); g.lineTo(260, 240); g.lineTo(360, 120); g.lineTo(512, 260); g.fill();
    g.fillStyle = "#F7FBFF"; g.beginPath(); g.moveTo(110, 125); g.lineTo(140, 90); g.lineTo(170, 128); g.fill(); g.beginPath(); g.moveTo(335, 150); g.lineTo(360, 120); g.lineTo(388, 152); g.fill();
    g.fillStyle = "#3E7A4E"; g.fillRect(0, 255, 512, 50); g.fillStyle = "#4E8AC0"; g.fillRect(0, 300, 512, 100);
    for (let i = 0; i < 9; i++) { g.fillStyle = "#2E5A3E"; g.beginPath(); g.moveTo(20 + i * 58, 290); g.lineTo(38 + i * 58, 230); g.lineTo(56 + i * 58, 290); g.fill(); }
  } else if (kind === "graduation") {
    sky("#9CC8F0", "#DCEBF8"); g.fillStyle = "#C9B8A0"; g.fillRect(0, 230, 512, 170); g.fillStyle = "#B8A890"; for (let i = 0; i < 6; i++) g.fillRect(40 + i * 80, 120, 30, 120);
    person(g, 256, 200, 1.4, "#1B2A4E"); g.fillStyle = "#0E070D"; g.fillRect(206, 150, 100, 14); g.fillRect(246, 136, 20, 18); g.strokeStyle = "#F2B84B"; g.lineWidth = 4; g.beginPath(); g.moveTo(300, 157); g.lineTo(316, 190); g.stroke();
    g.fillStyle = "#F6F1E6"; g.save(); g.translate(320, 290); g.rotate(-0.4); g.fillRect(-40, -8, 80, 16); g.restore();
  } else if (kind === "dog") {
    sky("#9CD0F0", "#E8F4FA"); g.fillStyle = "#5E9A4E"; g.fillRect(0, 250, 512, 150);
    g.fillStyle = "#B8763A"; g.beginPath(); g.ellipse(280, 280, 80, 45, 0, 0, 7); g.fill(); g.beginPath(); g.arc(360, 240, 36, 0, 7); g.fill();
    g.fillStyle = "#8A5226"; g.beginPath(); g.ellipse(385, 220, 12, 26, 0.4, 0, 7); g.fill(); g.fillStyle = "#0E070D"; g.beginPath(); g.arc(372, 236, 5, 0, 7); g.fill(); g.beginPath(); g.arc(394, 248, 6, 0, 7); g.fill();
    g.fillStyle = "#B8763A"; [215, 240, 315, 340].forEach((x) => g.fillRect(x, 310, 14, 50)); person(g, 140, 240, 1, "#4E7A4A");
  } else {
    sky("#F2B87A", "#F8DCB0"); g.fillStyle = "#5E8A4E"; g.fillRect(0, 280, 512, 120);
    person(g, 200, 200, 1.3, "#2E5FD0"); person(g, 300, 215, 1.15, "#A0303C");
    g.strokeStyle = "#0E070D"; g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); g.moveTo(222, 250); g.quadraticCurveTo(250, 236, 278, 252); g.stroke();
  }
  g.fillStyle = "rgba(255,255,255,0.08)"; g.beginPath(); g.moveTo(0, 0); g.lineTo(220, 0); g.lineTo(0, 260); g.fill();
});
/** A framed photo (wood frame, white mat, glass sheen). w is the outer width. */
export const Framed: React.FC<{ kind: PhotoKind; p: [number, number, number]; w?: number; r?: [number, number, number] }> = ({ kind, p, w = 1, r }) => {
  const t = useMemo(() => drawPhoto(kind), [kind]);
  const h = w * 0.82;
  return (
    <group position={p} rotation={r}>
      <Box p={[0, 0, 0]} s={[w, h, 0.04]} c="#4A3424" />
      <mesh position={[0, 0, 0.021]}><planeGeometry args={[w * 0.9, h * 0.88]} /><meshToonMaterial color="#F6F3EA" /></mesh>
      <mesh position={[0, 0, 0.023]}><planeGeometry args={[w * 0.76, h * 0.72]} /><meshBasicMaterial map={t} toneMapped={false} /></mesh>
    </group>
  );
};

// ─── kitchen ─────────────────────────────────────────────────────────────────
export const Kitchen: React.FC<{ bowls?: number; sky?: string; fridgeOpen?: number; toastUp?: number; chairs?: boolean }> = ({ bowls = 0, sky = "#BFE0FF", fridgeOpen = 0, toastUp = 0, chairs = true }) => {
  const tiles = useMemo(() => tex(128, 128, (g) => { g.fillStyle = "#EDEFF2"; g.fillRect(0, 0, 128, 128); g.strokeStyle = "#C9CDD6"; g.lineWidth = 4; g.strokeRect(0, 0, 64, 64); g.strokeRect(64, 64, 64, 64); g.strokeRect(64, 0, 64, 64); g.strokeRect(0, 64, 64, 64); }, [8, 2]), []);
  const wood = useMemo(() => tex(256, 256, (g) => { g.fillStyle = "#C9A87A"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? "#BE9C6E" : "#D2B286"; g.fillRect(0, i * 16, 256, 15); } }, [4, 4]), []);
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[7, 8]} /><meshToonMaterial map={wood} /></mesh>
      <mesh position={[0, 1.6, -3]} material={toon("#E7D9C4")} receiveShadow><planeGeometry args={[7, 3.2]} /></mesh>
      <mesh position={[-3.5, 1.6, 0.5]} rotation={[0, Math.PI / 2, 0]} material={toon("#D9C8B0")}><planeGeometry args={[7, 3.2]} /></mesh>
      <mesh position={[3.5, 1.6, 0.5]} rotation={[0, -Math.PI / 2, 0]} material={toon("#D9C8B0")}><planeGeometry args={[7, 3.2]} /></mesh>
      <mesh position={[0, 3.2, 0.5]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F0EAE0")}><planeGeometry args={[7, 7]} /></mesh>
      {/* front wall with a doorway, a calendar and a print */}
      {[-2.1, 2.1].map((x) => <mesh key={x} position={[x, 1.6, 4]} rotation={[0, Math.PI, 0]} material={toon("#E0D2BC")}><planeGeometry args={[2.8, 3.2]} /></mesh>)}
      <mesh position={[0, 2.8, 4]} rotation={[0, Math.PI, 0]} material={toon("#E0D2BC")}><planeGeometry args={[1.4, 0.8]} /></mesh>
      <mesh position={[0, 1.2, 4.6]} rotation={[0, Math.PI, 0]} material={toon("#6A5A4A")}><planeGeometry args={[1.4, 2.4]} /></mesh>
      <Framed kind="mountains" p={[2.0, 1.6, 3.97]} w={1.0} r={[0, Math.PI, 0]} />
      <Box p={[-2.0, 1.7, 3.97]} s={[0.5, 0.7, 0.01]} c="#F6F1E6" /><Box p={[-2.0, 1.97, 3.96]} s={[0.5, 0.16, 0.012]} c="#D9472B" />
      {/* counter run: base cabinets, worktop, tiles, sink and tap, toaster, kettle, cereal box, fruit, plant */}
      <Box p={[-1.4, 0.45, -2.62]} s={[4, 0.9, 0.7]} c="#5E7E9E" />
      {Array.from({ length: 5 }, (_, i) => <Box key={i} p={[-3.0 + i * 0.8, 0.5, -2.26]} s={[0.04, 0.12, 0.02]} c="#D9D9E0" cast={false} />)}
      <Box p={[-1.4, 0.92, -2.6]} s={[4.05, 0.06, 0.76]} c="#E9E2D0" />
      <mesh position={[-1.4, 1.35, -2.98]}><planeGeometry args={[4, 0.8]} /><meshToonMaterial map={tiles} /></mesh>
      <Box p={[-1.4, 2.25, -2.8]} s={[4, 0.8, 0.4]} c="#6E8EAE" />
      {Array.from({ length: 5 }, (_, i) => <Box key={`u${i}`} p={[-3.0 + i * 0.8, 1.95, -2.59]} s={[0.04, 0.1, 0.02]} c="#D9D9E0" cast={false} />)}
      <Box p={[-0.7, 0.93, -2.6]} s={[0.7, 0.04, 0.45]} c="#9AA0AC" />
      <mesh position={[-0.7, 1.08, -2.82]} rotation={[0, 0, 0]} material={toon("#C9CCD6")}><cylinderGeometry args={[0.018, 0.018, 0.28, 8]} /></mesh>
      <mesh position={[-0.7, 1.21, -2.72]} rotation={[Math.PI / 2, 0, 0]} material={toon("#C9CCD6")}><cylinderGeometry args={[0.016, 0.016, 0.2, 8]} /></mesh>
      <group position={[-2.6, 1.07, -2.6]}>
        <Box p={[0, 0, 0]} s={[0.36, 0.24, 0.24]} c="#C9CCD6" />
        {[-0.06, 0.06].map((x) => <Box key={x} p={[x, 0.08 + 0.12 * toastUp, 0]} s={[0.02, 0.16, 0.15]} c="#D9A050" cast={false} />)}
      </group>
      <group position={[-1.8, 1.05, -2.65]}><mesh material={toon("#D9472B")}><cylinderGeometry args={[0.09, 0.11, 0.2, 16]} /></mesh><mesh position={[0.1, 0.03, 0]} rotation={[0, 0, D(-50)]} material={toon("#D9472B")}><cylinderGeometry args={[0.015, 0.02, 0.12, 8]} /></mesh></group>
      <group position={[-3.15, 1.12, -2.55]}><Box p={[0, 0, 0]} s={[0.24, 0.34, 0.08]} c="#F2B84B" /><Box p={[0, 0.06, 0.042]} s={[0.16, 0.1, 0.002]} c="#D9472B" cast={false} /></group>
      <group position={[0.2, 0.98, -2.55]}><mesh material={toon("#E9ECF4")}><sphereGeometry args={[0.14, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>{[[-0.05, 0, "#E8C24A"], [0.05, 0.02, "#D9472B"], [0, -0.05, "#7AB84A"]].map(([x, z, c], i) => <mesh key={i} position={[x as number, 0.02, z as number]} material={toon(c as string)}><sphereGeometry args={[0.05, 12, 8]} /></mesh>)}</group>
      <group position={[1.6, 0.98, -2.7]}><mesh material={toon("#B8643A")}><cylinderGeometry args={[0.1, 0.08, 0.18, 12]} /></mesh><mesh position={[0, 0.22, 0]} material={toon("#4E8A4E")}><sphereGeometry args={[0.18, 12, 8]} /></mesh></group>
      {/* window with frame, curtains and the sky */}
      <mesh position={[0.6, 1.9, -2.99]}><planeGeometry args={[1.6, 1.0]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
      <Box p={[0.6, 1.9, -2.97]} s={[1.7, 0.05, 0.04]} c="#F6F1E6" /><Box p={[0.6, 1.9, -2.97]} s={[0.05, 1.05, 0.04]} c="#F6F1E6" />
      <Box p={[0.6, 2.42, -2.96]} s={[1.75, 0.06, 0.06]} c="#F6F1E6" /><Box p={[0.6, 1.38, -2.94]} s={[1.75, 0.05, 0.12]} c="#F6F1E6" />
      {[-0.35, 1.55].map((x) => <Box key={x} p={[x, 1.85, -2.92]} s={[0.32, 1.2, 0.04]} c="#D98A5A" />)}
      <pointLight position={[0.6, 1.9, -2.2]} color={sky} intensity={5} distance={6} />
      {/* fridge with handle and magnets; the door swings open (fridgeOpen 0..1) */}
      <group position={[2.6, 0, -2.55]}>
        <Box p={[0, 1.0, 0]} s={[0.9, 2.0, 0.8]} c="#E9ECF4" />
        <group position={[-0.45, 0, 0.41]} rotation={[0, D(-100 * fridgeOpen), 0]}>
          <Box p={[0.45, 1.0, 0.02]} s={[0.9, 1.98, 0.05]} c="#F2F4F8" />
          <Box p={[0.08, 1.15, 0.07]} s={[0.04, 0.5, 0.04]} c="#9AA0AC" />
          {[["#D9472B", 0.5, 1.5], ["#2E5FD0", 0.65, 1.3], ["#F2B84B", 0.4, 1.25]].map(([c, x, y], i) => <Box key={i} p={[x as number, y as number, 0.05]} s={[0.07, 0.07, 0.02]} c={c as string} cast={false} />)}
        </group>
        {fridgeOpen > 0.05 && <><pointLight position={[0, 1.2, 0.2]} color="#EAF6FF" intensity={4 * fridgeOpen} distance={2.5} />{[0.6, 1.0, 1.4].map((y) => <Box key={y} p={[0, y, 0.1]} s={[0.8, 0.02, 0.6]} c="#DDE4EE" cast={false} />)}<Box p={[-0.2, 1.1, 0.1]} s={[0.12, 0.22, 0.12]} c="#F6F1E6" /><Box p={[0.2, 0.7, 0.1]} s={[0.2, 0.15, 0.15]} c="#7AB84A" /></>}
      </group>
      {/* left wall: shelf with mugs and a clock */}
      <Box p={[-3.45, 1.7, 0.4]} s={[0.25, 0.04, 1.4]} c="#8A6A4E" />
      {[0, 1, 2].map((i) => <mesh key={i} position={[-3.42, 1.79, -0.1 + i * 0.4]} material={toon(["#2E5FD0", "#F2B84B", "#D9472B"][i])}><cylinderGeometry args={[0.05, 0.045, 0.12, 12]} /></mesh>)}
      {/* the table with a runner and chairs */}
      <group position={[0, 0, 0.3]}>
        <Box p={[0, 0.75, 0]} s={[1.8, 0.06, 1.0]} c="#8A6A4E" />
        <Box p={[0, 0.785, 0]} s={[1.8, 0.005, 0.32]} c="#D98A5A" cast={false} />
        {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([a, b], k) => <Box key={k} p={[a, 0.37, b]} s={[0.05, 0.74, 0.05]} c="#6A4E3A" />)}
        {Array.from({ length: bowls }, (_, k) => (
          <group key={k} position={[-0.6 + (k % 4) * 0.4, 0.8, -0.15 + Math.floor(k / 4) * 0.3]}>
            <mesh material={toon(["#F2B84B", "#D9472B", "#2E5FD0", "#4E7A4A"][k % 4])}><sphereGeometry args={[0.1, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>
            <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={toon("#E8C77A")}><circleGeometry args={[0.09, 16]} /></mesh>
          </group>
        ))}
      </group>
      {chairs && <><Chair p={[0, 0, 1.08]} yaw={Math.PI} /><Chair p={[0, 0, -0.48]} yaw={0} /><Chair p={[-1.25, 0, 0.3]} yaw={Math.PI / 2} /><Chair p={[1.25, 0, 0.3]} yaw={-Math.PI / 2} /></>}
      {/* pendant lamp, rug */}
      <mesh position={[0, 2.9, 0.3]} material={toon("#222")}><cylinderGeometry args={[0.006, 0.006, 0.6, 6]} /></mesh>
      <mesh position={[0, 2.55, 0.3]} material={toon("#2A3450")}><coneGeometry args={[0.22, 0.2, 20, 1, true]} /></mesh>
      <mesh position={[0, 2.5, 0.3]}><sphereGeometry args={[0.08, 12, 8]} /><meshStandardMaterial color="#FFE2A8" emissive="#FFC877" emissiveIntensity={2} /></mesh>
      <pointLight position={[0, 2.4, 0.3]} color="#FFD9A0" intensity={5} distance={7} castShadow />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.3]} material={toon("#7A3E4A")}><planeGeometry args={[2.8, 2.0]} /></mesh>
      <ambientLight intensity={0.55} />
    </group>
  );
};

// ─── bedroom ─────────────────────────────────────────────────────────────────
export const Bedroom: React.FC<{ windowMood: Mood }> = ({ windowMood }) => {
  const sky = { night: "#16224A", dawn: "#E8A890", day: "#9CC8F0", golden: "#F2B87A", dusk: "#C06A6A" }[windowMood];
  const poster = useMemo(() => tex(256, 360, (g) => { const gr = g.createLinearGradient(0, 0, 0, 360); gr.addColorStop(0, "#0B1226"); gr.addColorStop(1, "#2E5FD0"); g.fillStyle = gr; g.fillRect(0, 0, 256, 360); g.fillStyle = "#F2B84B"; g.beginPath(); g.arc(128, 150, 60, 0, 7); g.fill(); g.strokeStyle = "#F2B84B"; g.lineWidth = 4; g.beginPath(); g.ellipse(128, 150, 100, 26, -0.3, 0, 7); g.stroke(); g.fillStyle = "#F1F4F2"; g.font = "800 34px 'Plus Jakarta Sans'"; g.textAlign = "center"; g.fillText("SATURN", 128, 310); for (let i = 0; i < 40; i++) { g.fillRect(rnd(i) * 256, rnd(i + 9) * 260, 2, 2); } }), []);
  const books = ["#D9472B", "#2E5FD0", "#F2B84B", "#4E7A4A", "#7A5A8C", "#E9E2D0", "#3A2A22"];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#8A6A4E")} receiveShadow><planeGeometry args={[5, 5]} /></mesh>
      <mesh position={[0, 1.5, -2.5]} material={toon("#4A5A7A")} receiveShadow><planeGeometry args={[5, 3]} /></mesh>
      <mesh position={[-2.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#55658A")} receiveShadow><planeGeometry args={[5, 3]} /></mesh>
      <mesh position={[2.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#55658A")} receiveShadow><planeGeometry args={[5, 3]} /></mesh>
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#E0DCD0")}><planeGeometry args={[5, 5]} /></mesh>
      {/* window with frame and curtains */}
      <mesh position={[0.6, 1.65, -2.49]}><planeGeometry args={[1.5, 1.2]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
      <Box p={[0.6, 1.65, -2.47]} s={[1.6, 0.06, 0.03]} c="#E8E4DA" /><Box p={[0.6, 1.65, -2.47]} s={[0.06, 1.3, 0.03]} c="#E8E4DA" />
      {[-0.35, 1.55].map((x) => <Box key={x} p={[x, 1.6, -2.42]} s={[0.36, 1.6, 0.04]} c="#C8B8E0" />)}
      <pointLight position={[0.6, 1.7, -1.6]} color={sky} intensity={windowMood === "night" ? 1.5 : 5} distance={6} />
      {/* bed with headboard, duvet, pillows; nightstand with lamp and alarm clock */}
      <group position={[-1.4, 0, -1.3]}>
        <Box p={[0, 0.25, 0]} s={[1.4, 0.5, 2.1]} c="#3A2A22" />
        <Box p={[0, 0.75, -1.06]} s={[1.45, 1.0, 0.08]} c="#4A3424" />
        <Box p={[0, 0.58, 0.05]} s={[1.36, 0.16, 1.95]} c="#E9E2D0" />
        <Box p={[0, 0.66, 0.35]} s={[1.4, 0.08, 1.3]} c="#2E5FD0" />
        {[-0.32, 0.32].map((x) => <mesh key={x} position={[x, 0.72, -0.75]} scale={[0.28, 0.08, 0.16]} material={toon("#F6F1E6")}><sphereGeometry args={[1, 14, 8]} /></mesh>)}
      </group>
      <group position={[-0.35, 0, -2.15]}>
        <Box p={[0, 0.28, 0]} s={[0.45, 0.56, 0.4]} c="#6A4E3A" />
        <mesh position={[0, 0.64, 0]} material={toon("#E9E2D0")}><cylinderGeometry args={[0.08, 0.1, 0.16, 12]} /></mesh>
        <mesh position={[0, 0.8, 0]} material={toon("#F2B84B")}><coneGeometry args={[0.14, 0.16, 16, 1, true]} /></mesh>
        <pointLight position={[0, 0.8, 0.1]} color="#FFC877" intensity={1.5} distance={2.5} />
        <Box p={[0.14, 0.6, 0.08]} s={[0.12, 0.08, 0.05]} c="#1B2A4E" />
      </group>
      {/* desk with laptop and chair */}
      <group position={[1.6, 0, -1.9]}>
        <Box p={[0, 0.75, 0]} s={[1.4, 0.06, 0.6]} c="#6A4E3A" />
        {[-0.65, 0.65].map((x) => <Box key={x} p={[x, 0.37, 0]} s={[0.05, 0.74, 0.55]} c="#4A3424" />)}
        <Box p={[-0.15, 0.79, 0.02]} s={[0.4, 0.02, 0.28]} c="#9AA0AC" />
        <mesh position={[-0.15, 0.93, -0.12]} rotation={[D(-15), 0, 0]}><boxGeometry args={[0.4, 0.27, 0.015]} /><meshStandardMaterial color="#2A2D38" emissive="#7FB8FF" emissiveIntensity={0.5} /></mesh>
        <mesh position={[0.45, 0.95, 0]}><sphereGeometry args={[0.1, 12, 8]} /><meshStandardMaterial color="#FFE2A8" emissive="#FFC877" emissiveIntensity={2} /></mesh>
        <pointLight position={[0.4, 1.1, 0.2]} color="#FFC877" intensity={2.5} distance={4} />
        {[0, 1, 2, 3].map((i) => <Box key={i} p={[0.25 + i * 0.05, 0.86, -0.18]} s={[0.04, 0.16, 0.12]} c={books[i]} cast={false} />)}
      </group>
      <Chair p={[1.4, 0, -1.25]} yaw={Math.PI} col="#2A3450" />
      {/* wardrobe and bookshelf */}
      <group position={[2.15, 0, 0.9]}><Box p={[0, 1.0, 0]} s={[0.6, 2.0, 1.2]} c="#7A5A3E" />{[-0.25, 0.25].map((z) => <Box key={z} p={[-0.31, 1.0, z]} s={[0.02, 1.9, 0.56]} c="#8A6A4E" cast={false} />)}<Box p={[-0.33, 1.05, 0.05]} s={[0.03, 0.2, 0.03]} c="#C9CCD6" cast={false} /></group>
      <group position={[-2.3, 0, 0.8]}>
        <Box p={[0, 0.9, 0]} s={[0.35, 1.8, 1.0]} c="#6A4E3A" />
        {[0.4, 0.9, 1.4].map((y, r) => <group key={y}>{Array.from({ length: 7 }, (_, i) => <Box key={i} p={[0.12, y + 0.12, -0.4 + i * 0.12]} s={[0.12, 0.2 + rnd(i + r * 7) * 0.08, 0.08]} c={books[(i + r) % books.length]} cast={false} />)}</group>)}
      </group>
      <mesh position={[-2.48, 1.85, -0.9]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.6, 0.85]} /><meshBasicMaterial map={poster} /></mesh>
      <Framed kind="brothers" p={[2.47, 1.7, -1.0]} w={0.6} r={[0, -Math.PI / 2, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.006, 0.3]} material={toon("#2E5FD0")}><circleGeometry args={[1.1, 32]} /></mesh>
    </group>
  );
};

// ─── classroom ───────────────────────────────────────────────────────────────
export const Classroom: React.FC<{ t: number; answer: number }> = ({ answer }) => {
  const board = useMemo(() => tex(1024, 512, (g) => { g.fillStyle = "#1E3A2E"; g.fillRect(0, 0, 1024, 512); g.fillStyle = "#F1F4F2"; g.font = "800 72px 'Plus Jakarta Sans'"; g.fillText("Q7.  3x + 5 = 20", 70, 170); g.font = "600 48px 'Plus Jakarta Sans'"; g.fillText("x = ?", 70, 300); g.strokeStyle = "rgba(241,244,242,0.4)"; g.lineWidth = 3; g.beginPath(); g.moveTo(600, 360); g.lineTo(900, 300); g.stroke(); }), []);
  const paper = useMemo(() => [0, 1].map((k) => tex(512, 512, (g) => {
    g.fillStyle = "#F6F1E6"; g.fillRect(0, 0, 512, 512); g.strokeStyle = "#9CC8F0"; g.lineWidth = 2; for (let i = 0; i < 12; i++) { g.beginPath(); g.moveTo(0, 60 + i * 38); g.lineTo(512, 60 + i * 38); g.stroke(); }
    g.fillStyle = "#1B2A4E"; g.font = "800 60px 'Plus Jakarta Sans'"; g.fillText("Q7.  x = " + (k ? "5" : "8"), 40, 200);
    g.lineWidth = 16; g.strokeStyle = k ? "#2E9A4E" : "#D9472B"; g.beginPath();
    if (k) { g.moveTo(330, 300); g.lineTo(380, 360); g.lineTo(470, 240); } else { g.moveTo(330, 250); g.lineTo(450, 370); g.moveTo(450, 250); g.lineTo(330, 370); } g.stroke();
  })), []);
  const posters = ["#F2B84B", "#2E5FD0", "#D9472B"];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#8A7A6A")} receiveShadow><planeGeometry args={[12, 10]} /></mesh>
      <mesh position={[0, 1.6, -5]} material={toon("#C9B8A0")}><planeGeometry args={[12, 3.2]} /></mesh>
      <mesh position={[-6, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#B8A890")}><planeGeometry args={[10, 3.2]} /></mesh>
      <mesh position={[6, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#B8A890")}><planeGeometry args={[10, 3.2]} /></mesh>
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#E0DCD0")}><planeGeometry args={[12, 10]} /></mesh>
      <mesh position={[0, 1.8, -4.98]}><planeGeometry args={[5, 2.5]} /><meshBasicMaterial map={board} /></mesh>
      <Box p={[0, 0.5, -4.95]} s={[5.2, 0.06, 0.12]} c="#6A4E3A" />
      {/* windows on the right wall with daylight; posters and a clock on the left */}
      {[-2.5, 0, 2.5].map((z) => <group key={z}><mesh position={[5.98, 1.8, z]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[1.8, 1.4]} /><meshBasicMaterial color="#BFE0FF" toneMapped={false} /></mesh><Box p={[5.96, 1.8, z]} s={[0.04, 1.5, 0.06]} c="#F6F1E6" /></group>)}
      <directionalLight position={[10, 4, 0]} intensity={1.2} color="#FFF4E0" />
      {posters.map((c, i) => <group key={i}><Box p={[-5.97, 1.9, -3 + i * 1.6]} s={[0.02, 0.9, 0.7]} c={c} cast={false} /><Box p={[-5.96, 2.05, -3 + i * 1.6]} s={[0.02, 0.12, 0.5]} c="#F6F1E6" cast={false} /></group>)}
      <mesh position={[-1.6, 2.8, -4.97]}><circleGeometry args={[0.25, 24]} /><meshToonMaterial color="#F6F1E6" /></mesh>
      {/* teacher's desk and the teacher */}
      <Box p={[-3.4, 0.75, -3.6]} s={[1.6, 0.08, 0.8]} c="#6A4E3A" /><Box p={[-3.4, 0.37, -3.6]} s={[1.5, 0.74, 0.7]} c="#5A3E2A" />
      <Person3D pos={[-3.4, 0, -4.3]} yaw={0.2} look={LOOKS.teacher} pose={{ ...STAND, armR: [75, 25, 25], handR: "point", wristR: [0, 0] }} face={{ smile: 0.1 }} />
      {/* desks, chairs and students */}
      {Array.from({ length: 12 }, (_, i) => {
        const x = -4 + (i % 4) * 2.6, z = -2 + Math.floor(i / 4) * 2.2, hero = i === 11;
        return (
          <group key={i} position={[x, 0, z]}>
            <Box p={[0, 0.75, 0]} s={[1.2, 0.06, 0.7]} c="#B88A5A" />
            {[[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]].map(([a, b], k) => <Box key={k} p={[a, 0.37, b]} s={[0.04, 0.74, 0.04]} c="#3A3A44" cast={false} />)}
            <mesh position={[0, 0.785, 0.05]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.42, 0.42]} /><meshBasicMaterial map={hero ? paper[answer] : paper[0]} /></mesh>
            <mesh position={[0.28, 0.79, 0.05]} rotation={[-Math.PI / 2, 0, 0.6]} material={toon("#F2B84B")}><planeGeometry args={[0.012, 0.16]} /></mesh>
            <Chair p={[0, 0, 0.6]} yaw={Math.PI} col="#3E5A7A" />
            <Person3D pos={[0, 0, 0.6]} yaw={Math.PI} look={hero ? LOOKS.hoodie : (LOOKS as any)[["ex1", "ex3", "ex5", "ex8", "ex6", "ex2"][i % 6]]} pose={sitOn(0.46, { headNod: 28, armL: [62, 8, 72], armR: [62, 8, 72], handR: hero ? "pinch" : "relaxed" })} face={{ smile: hero && answer ? 0.7 : 0.1 }} />
          </group>
        );
      })}
      <pointLight position={[3, 2.8, 2]} intensity={6} distance={14} color="#FFF4E0" />
      <ambientLight intensity={0.5} />
    </group>
  );
};

// ─── the car park (where the café was) ───────────────────────────────────────
export const CarPark: React.FC = () => {
  const asphalt = useMemo(() => tex(256, 256, (g) => { g.fillStyle = "#3A3A44"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 600; i++) { g.fillStyle = `rgba(${rnd(i) > 0.5 ? 255 : 0},${rnd(i) > 0.5 ? 255 : 0},${rnd(i) > 0.5 ? 255 : 0},0.05)`; g.fillRect(rnd(i + 1) * 256, rnd(i + 2) * 256, 2, 2); } }, [4, 4]), []);
  const sign = useMemo(() => tex(256, 256, (g) => { g.fillStyle = "#2E5FD0"; g.fillRect(0, 0, 256, 256); g.fillStyle = "#F1F4F2"; g.font = "900 200px 'Plus Jakarta Sans'"; g.textAlign = "center"; g.fillText("P", 128, 200); }), []);
  const board = useMemo(() => tex(512, 256, (g) => { g.fillStyle = "#F6F1E6"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#D9472B"; g.fillRect(0, 0, 512, 60); g.fillStyle = "#F1F4F2"; g.font = "800 40px 'Plus Jakarta Sans'"; g.fillText("CITY PARKING", 30, 45); g.fillStyle = "#1B2A4E"; g.font = "700 34px 'Plus Jakarta Sans'"; g.fillText("£2.50 / hour", 30, 130); g.fillText("24 HOURS", 30, 190); }), []);
  const cars: [number, number, string, number][] = [[-5.0, -6.0, "#B8432F", 0], [-3.9, -6.0, "#E9ECF0", 0], [-1.7, -6.0, "#2E5FD0", 0], [-0.6, -6.0, "#4E4E58", 0], [-4.4, -9.4, "#F2B84B", Math.PI], [-1.1, -9.4, "#4E7A4A", Math.PI]];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.55, 0.008, -7]} receiveShadow><planeGeometry args={[6.7, 8]} /><meshToonMaterial map={asphalt} /></mesh>
      {/* bays and arrows */}
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-5.6 + i * 1.1, 0.012, -6.0]} material={toon("#ECE8DC")}><planeGeometry args={[0.07, 2.2]} /></mesh>)}
      {Array.from({ length: 7 }, (_, i) => <mesh key={`b${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-5.6 + i * 1.1, 0.012, -9.4]} material={toon("#ECE8DC")}><planeGeometry args={[0.07, 2.2]} /></mesh>)}
      {[-7.7, -4.6].map((z) => <mesh key={z} rotation={[-Math.PI / 2, 0, 0]} position={[-2.55, 0.012, z]} material={toon("#F2B84B")}><planeGeometry args={[0.5, 0.12]} /></mesh>)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.55, 0.012, -4.0]} material={toon("#ECE8DC")}><planeGeometry args={[6.4, 0.1]} /></mesh>
      {/* parked cars (side by side, bonnets out) */}
      {cars.map(([x, z, c, y], i) => <group key={i} scale={0.85}><Car p={[x / 0.85, 0, z / 0.85]} col={c} yaw={Math.PI / 2 + y} /></group>)}
      {/* side walls of the neighbouring buildings, back wall with a billboard */}
      <Box p={[-6.05, 3, -7.2]} s={[0.3, 6, 8.4]} c="#6A5A62" /><Box p={[0.95, 3, -7.2]} s={[0.3, 6, 8.4]} c="#5A4E68" />
      <Box p={[-2.55, 2.5, -11.2]} s={[7.2, 5, 0.3]} c="#7A6A6A" />
      <mesh position={[-2.55, 2.8, -11.03]}><planeGeometry args={[3.6, 1.8]} /><meshBasicMaterial map={board} /></mesh>
      {/* front: low brick wall either side of the entrance, barrier arm and booth, the P sign, pay machine */}
      <Box p={[-5.0, 0.35, -3.3]} s={[1.8, 0.7, 0.3]} c="#9A5A44" /><Box p={[0.1, 0.35, -3.3]} s={[1.4, 0.7, 0.3]} c="#9A5A44" />
      <group position={[-0.9, 0, -3.5]}>
        <Box p={[0, 0.55, 0]} s={[0.35, 1.1, 0.35]} c="#D9472B" />
        <group position={[0, 0.95, 0]} rotation={[0, 0, D(0)]}>{Array.from({ length: 6 }, (_, i) => <Box key={i} p={[-0.3 - i * 0.5, 0, 0]} s={[0.5, 0.08, 0.08]} c={i % 2 ? "#D9472B" : "#F1F4F2"} />)}</group>
      </group>
      <group position={[0.3, 0, -4.4]}><Box p={[0, 1.2, 0]} s={[1.0, 2.4, 1.0]} c="#E9E2D0" /><mesh position={[-0.51, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[0.7, 0.6]} /><meshStandardMaterial color="#9FC8E8" emissive="#FFE2A8" emissiveIntensity={0.3} /></mesh><Box p={[0, 2.45, 0]} s={[1.15, 0.1, 1.15]} c="#2A3450" /></group>
      <group position={[-5.6, 0, -3.6]}><Box p={[0, 1.5, 0]} s={[0.08, 3, 0.08]} c="#22263A" /><mesh position={[0, 2.8, 0.05]}><planeGeometry args={[0.6, 0.6]} /><meshBasicMaterial map={sign} /></mesh></group>
      <group position={[-3.6, 0, -4.2]}><Box p={[0, 0.7, 0]} s={[0.4, 1.4, 0.3]} c="#2A3450" /><Box p={[0, 1.1, 0.16]} s={[0.25, 0.18, 0.02]} c="#BFE6F0" cast={false} /></group>
      {/* lamp posts, bollards, a puddle, a trolley */}
      {[-5.4, 0.4].map((x) => <group key={x} position={[x, 0, -8.2]}><Box p={[0, 2.2, 0]} s={[0.08, 4.4, 0.08]} c="#22263A" /><Box p={[0.3, 4.35, 0]} s={[0.7, 0.1, 0.2]} c="#22263A" /></group>)}
      {[-4.2, -3.3].map((x) => <mesh key={x} position={[x, 0.35, -3.6]} material={toon("#F2B84B")}><cylinderGeometry args={[0.08, 0.08, 0.7, 10]} /></mesh>)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-2.2, 0.015, -7.6]}><circleGeometry args={[0.6, 24]} /><meshStandardMaterial color="#5A6A8A" roughness={0.05} metalness={0.5} /></mesh>
      <group position={[-3.2, 0, -8.0]} rotation={[0, 0.5, 0]}><Box p={[0, 0.7, 0]} s={[0.5, 0.4, 0.8]} c="#C9CCD6" /><Box p={[0, 0.35, 0]} s={[0.04, 0.7, 0.04]} c="#9AA0AC" /></group>
    </group>
  );
};

// ─── the photo wall (hallway) ────────────────────────────────────────────────
export const PhotoWall: React.FC<{ holiday: boolean; glitch?: number }> = ({ holiday, glitch = 0 }) => {
  const wall = useMemo(() => tex(256, 256, (g) => { g.fillStyle = "#D9C8B0"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 8; i++) { g.fillStyle = i % 2 ? "#D2C0A6" : "#DDCCB4"; g.fillRect(i * 32, 0, 32, 256); } }, [6, 1]), []);
  const set: [PhotoKind, number, number, number][] = [["family", -1.9, 1.95, 1.0], [holiday ? "beach" : "mountains", -0.45, 2.05, 1.15], ["birthday", 1.0, 1.9, 0.95], ["graduation", 2.3, 2.05, 0.8], ["dog", -1.2, 1.0, 0.85], ["brothers", 1.6, 1.0, 0.9]];
  return (
    <group>
      <mesh position={[0, 1.6, -0.05]}><planeGeometry args={[6.5, 3.2]} /><meshToonMaterial map={wall} /></mesh>
      <Box p={[0, 0.06, -0.02]} s={[6.5, 0.12, 0.05]} c="#F6F1E6" />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]} material={toon("#8A6A4E")}><planeGeometry args={[6.5, 3]} /></mesh>
      <Box p={[2.6, 0.45, 0.25]} s={[0.9, 0.9, 0.4]} c="#6A4E3A" />
      <mesh position={[2.6, 1.05, 0.25]} material={toon("#B8643A")}><cylinderGeometry args={[0.1, 0.08, 0.2, 12]} /></mesh>
      <mesh position={[2.6, 1.3, 0.25]} material={toon("#4E8A4E")}><sphereGeometry args={[0.2, 12, 8]} /></mesh>
      {set.map(([k, x, y, w], i) => <Framed key={i} kind={k} p={[x + (i === 1 ? (rnd(Math.floor(glitch * 30)) - 0.5) * 0.1 * glitch : 0), y, 0]} w={w} />)}
      <pointLight position={[0, 2.6, 2]} intensity={5} distance={7} color="#FFE2B0" />
      <ambientLight intensity={0.55} />
    </group>
  );
};
