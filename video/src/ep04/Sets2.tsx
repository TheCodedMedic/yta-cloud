// Episode 04 sets and props, part 2: space and GPS satellites, vehicles (bus, van, cars), pigeon and coffee,
// classroom, five-a-side pitch, kitchen, Mill Road crossing, the river road with the tower, the car park, the photo wall.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Building } from "../cam3d/World3D";
import { LOOKS, Person3D, SIT, STAND, toon } from "../cam3d/Person3D";
import { V3 } from "./Vfx";

const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const D = THREE.MathUtils.degToRad;
const canvas = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
};
const FONT = "800 64px 'Plus Jakarta Sans'";

// ─── space ───────────────────────────────────────────────────────────────────
export const Space: React.FC<{ t: number; sats?: number; spin?: number }> = ({ t, sats = 6, spin = 0.05 }) => {
  const earth = useMemo(() => canvas(1024, 512, (g) => {
    g.fillStyle = "#1E5AA8"; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 70; i++) {
      g.fillStyle = ["#3E8A4E", "#5A9A4A", "#B89A6A", "#4E7A3E"][i % 4];
      g.beginPath(); const x = rnd(i) * 1024, y = 80 + rnd(i + 9) * 352, r = 20 + rnd(i + 5) * 70;
      g.ellipse(x, y, r * 1.6, r, rnd(i + 3) * 3, 0, Math.PI * 2); g.fill();
    }
    g.fillStyle = "#F4F8FF"; g.fillRect(0, 0, 1024, 30); g.fillRect(0, 482, 1024, 30);
  }), []);
  const stars = useMemo(() => {
    const g = new THREE.BufferGeometry(); const p: number[] = [];
    for (let i = 0; i < 2500; i++) { const a = rnd(i) * Math.PI * 2, b = Math.acos(2 * rnd(i + 3000) - 1); p.push(300 * Math.sin(b) * Math.cos(a), 300 * Math.cos(b), 300 * Math.sin(b) * Math.sin(a)); }
    g.setAttribute("position", new THREE.Float32BufferAttribute(p, 3)); return g;
  }, []);
  return (
    <>
      <color attach="background" args={["#02030A"]} />
      <points geometry={stars}><pointsMaterial color="#FFFFFF" size={0.7} sizeAttenuation={false} /></points>
      <mesh rotation={[0.3, t * spin, 0]}><sphereGeometry args={[4, 64, 48]} /><meshStandardMaterial map={earth} roughness={0.8} /></mesh>
      <mesh><sphereGeometry args={[4.18, 48, 32]} /><meshBasicMaterial color="#6FB8FF" transparent opacity={0.16} side={THREE.BackSide} blending={THREE.AdditiveBlending} /></mesh>
      {Array.from({ length: sats }, (_, k) => {
        const inc = D(20 + k * 25), a = t * 0.25 + k * 1.05, r = 6.2;
        const p: V3 = [Math.cos(a) * r, Math.sin(a) * r * Math.sin(inc), Math.sin(a) * r * Math.cos(inc)];
        return (
          <group key={k} position={p} rotation={[0, -a, inc]}>
            <mesh material={toon("#D9D9E0")}><boxGeometry args={[0.18, 0.18, 0.28]} /></mesh>
            {[-1, 1].map((s) => <mesh key={s} position={[s * 0.32, 0, 0]} material={toon("#2E4A8A")}><boxGeometry args={[0.42, 0.01, 0.2]} /></mesh>)}
            <mesh position={[0, 0.16, 0]}><sphereGeometry args={[0.03, 8, 6]} /><meshBasicMaterial color="#F2B84B" /></mesh>
          </group>
        );
      })}
      <ambientLight intensity={0.25} />
      <directionalLight position={[12, 4, 8]} intensity={3} color="#FFF4E0" />
    </>
  );
};

// ─── vehicles ────────────────────────────────────────────────────────────────
const Wheel: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p} rotation={[Math.PI / 2, 0, 0]}><mesh material={toon("#141414")}><cylinderGeometry args={[0.38, 0.38, 0.28, 18]} /></mesh><mesh position={[0, 0.15, 0]} material={toon("#9A9AA4")}><cylinderGeometry args={[0.18, 0.18, 0.02, 12]} /></mesh></group>
);
/** Bus along x, facing +x. doors 0 open .. 1 closed. */
export const Bus: React.FC<{ p: V3; doors?: number; col?: string; yaw?: number }> = ({ p, doors = 1, col = "#2E5FD0", yaw = Math.PI }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <mesh position={[0, 1.75, 0]} material={toon(col)} castShadow><boxGeometry args={[10, 2.9, 2.5]} /></mesh>
    <mesh position={[0, 3.25, 0]} material={toon("#E9ECF4")}><boxGeometry args={[9.8, 0.12, 2.4]} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[-3.8 + i * 1.45, 2.25, 1.26]}><planeGeometry args={[1.25, 1.1]} /><meshStandardMaterial color="#9FC8E8" emissive="#FFE2A8" emissiveIntensity={0.35} /></mesh>)}
    <mesh position={[4.98, 2.0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[2.2, 1.6]} /><meshStandardMaterial color="#9FC8E8" emissive="#BFE6F0" emissiveIntensity={0.2} /></mesh>
    {/* front doors */}
    {[-1, 1].map((k) => <mesh key={k} position={[3.6 + k * 0.32 * (0.2 + 0.8 * doors) * 1.5 - k * 0.48 * (1 - doors), 1.45, 1.27]}><planeGeometry args={[0.62, 2.1]} /><meshStandardMaterial color="#2A3450" emissive="#9FC8E8" emissiveIntensity={0.15} /></mesh>)}
    <mesh position={[3.6, 1.45, 1.255]}><planeGeometry args={[1.3, 2.2]} /><meshBasicMaterial color="#0B1226" /></mesh>
    {[[-3.3, 1.1], [-3.3, -1.1], [3.3, 1.1], [3.3, -1.1]].map(([x, z], i) => <Wheel key={i} p={[x, 0.38, z]} />)}
    <mesh position={[5.02, 0.9, 0.85]}><sphereGeometry args={[0.13, 10, 8]} /><meshBasicMaterial color="#FFF4D0" /></mesh>
    <mesh position={[5.02, 0.9, -0.85]}><sphereGeometry args={[0.13, 10, 8]} /><meshBasicMaterial color="#FFF4D0" /></mesh>
  </group>
);
/** White van facing −x (it comes round the corner toward the crossing). lights: headlight beams. */
export const Van: React.FC<{ p: V3; yaw?: number; lights?: boolean }> = ({ p, yaw = Math.PI, lights = true }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <mesh position={[-0.6, 1.35, 0]} material={toon("#E9ECF0")} castShadow><boxGeometry args={[3.6, 2.1, 2.0]} /></mesh>
    <mesh position={[1.75, 1.0, 0]} material={toon("#E9ECF0")} castShadow><boxGeometry args={[1.3, 1.4, 1.95]} /></mesh>
    <mesh position={[2.3, 1.35, 0]} rotation={[0, Math.PI / 2, D(-14)]}><planeGeometry args={[1.8, 0.75]} /><meshStandardMaterial color="#1E2A3A" roughness={0.1} metalness={0.5} /></mesh>
    {[[-1.6, 0.95], [-1.6, -0.95], [1.6, 0.95], [1.6, -0.95]].map(([x, z], i) => <Wheel key={i} p={[x, 0.38, z]} />)}
    {[-0.7, 0.7].map((z) => <mesh key={z} position={[2.41, 0.85, z]}><boxGeometry args={[0.04, 0.18, 0.34]} /><meshBasicMaterial color="#FFF8E0" toneMapped={false} /></mesh>)}
    {lights && [-0.7, 0.7].map((z) => (
      <spotLight key={`s${z}`} position={[2.5, 0.85, z]} angle={0.42} penumbra={0.6} intensity={60} distance={30} color="#FFF4D8" target-position={[14, 0, z]} />
    ))}
    {lights && <mesh position={[6, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}><coneGeometry args={[1.6, 7, 24, 1, true]} /><meshBasicMaterial color="#FFF4D8" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>}
  </group>
);
export const Car: React.FC<{ p: V3; col?: string; yaw?: number }> = ({ p, col = "#B8432F", yaw = 0 }) => (
  <group position={p} rotation={[0, yaw, 0]}>
    <mesh position={[0, 0.65, 0]} material={toon(col)} castShadow><boxGeometry args={[4.2, 0.75, 1.8]} /></mesh>
    <mesh position={[-0.2, 1.25, 0]} material={toon(col)} castShadow><boxGeometry args={[2.3, 0.6, 1.65]} /></mesh>
    <mesh position={[-0.2, 1.25, 0]}><boxGeometry args={[2.32, 0.45, 1.67]} /><meshStandardMaterial color="#20304A" roughness={0.1} metalness={0.4} /></mesh>
    {[[-1.35, 0.85], [-1.35, -0.85], [1.35, 0.85], [1.35, -0.85]].map(([x, z], i) => <group key={i} scale={0.85}><Wheel p={[x / 0.85, 0.38, z / 0.85]} /></group>)}
  </group>
);

// ─── small life ──────────────────────────────────────────────────────────────
/** Pigeon. flap = wing phase (radians); set it constant to freeze mid-flap. */
export const Pigeon: React.FC<{ p: V3; flap: number; yaw?: number; s?: number }> = ({ p, flap, yaw = 0, s = 1 }) => {
  const w = Math.sin(flap) * 0.9;
  return (
    <group position={p} rotation={[0, yaw, 0]} scale={s}>
      <mesh material={toon("#7A7E8E")} scale={[0.12, 0.09, 0.2]} castShadow><sphereGeometry args={[1, 14, 10]} /></mesh>
      <mesh position={[0, 0.09, 0.15]} material={toon("#5A5E70")}><sphereGeometry args={[0.055, 12, 8]} /></mesh>
      <mesh position={[0, 0.08, 0.205]} rotation={[D(90), 0, 0]} material={toon("#E8B04A")}><coneGeometry args={[0.012, 0.04, 6]} /></mesh>
      {[-1, 1].map((k) => (
        <group key={k} position={[k * 0.08, 0.03, 0]} rotation={[0, 0, k * w]}>
          <mesh position={[k * 0.17, 0, 0]} material={toon("#8E92A2")} scale={[0.18, 0.012, 0.11]}><sphereGeometry args={[1, 10, 6]} /></mesh>
        </group>
      ))}
      <mesh position={[0, 0.0, -0.22]} material={toon("#5A5E70")} scale={[0.07, 0.01, 0.09]}><sphereGeometry args={[1, 8, 6]} /></mesh>
    </group>
  );
};
/** A paper coffee cup; spill 0..1 draws a brown ribbon of coffee arcing out of it. */
export const Coffee: React.FC<{ p: V3; spill: number; tilt?: number }> = ({ p, spill, tilt = 0 }) => {
  const geo = useMemo(() => {
    if (spill <= 0.02) return null;
    const pts = Array.from({ length: 24 }, (_, i) => { const u = (i / 23) * spill; return new THREE.Vector3(u * 0.55, 0.14 + Math.sin(u * 3) * 0.12 - u * u * 0.3, Math.sin(u * 7) * 0.03); });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 40, 0.018, 8, false);
  }, [Math.round(spill * 60)]);
  return (
    <group position={p}>
      <group rotation={[0, 0, tilt]}>
        <mesh material={toon("#F1E8D6")} castShadow><cylinderGeometry args={[0.045, 0.035, 0.13, 16]} /></mesh>
        <mesh position={[0, 0.07, 0]} material={toon("#3A2A22")}><cylinderGeometry args={[0.047, 0.047, 0.02, 16]} /></mesh>
      </group>
      {geo && <mesh geometry={geo}><meshStandardMaterial color="#5A3420" roughness={0.2} metalness={0.1} /></mesh>}
      {geo && Array.from({ length: 6 }, (_, k) => <mesh key={k} position={[0.1 + k * 0.08 * spill, 0.2 - k * 0.03, (rnd(k) - 0.5) * 0.08]}><sphereGeometry args={[0.012, 8, 6]} /><meshStandardMaterial color="#5A3420" roughness={0.2} /></mesh>)}
    </group>
  );
};
export const BusStop: React.FC<{ p: V3 }> = ({ p }) => (
  <group position={p}>
    <mesh position={[0, 2.4, 0]} material={toon("#2A3450")}><boxGeometry args={[3, 0.1, 1.4]} /></mesh>
    {[-1.45, 1.45].map((x) => <mesh key={x} position={[x, 1.2, -0.6]} material={toon("#2A3450")}><boxGeometry args={[0.08, 2.4, 0.08]} /></mesh>)}
    <mesh position={[0, 1.3, -0.65]}><planeGeometry args={[2.9, 1.9]} /><meshStandardMaterial color="#BFE6F0" transparent opacity={0.3} /></mesh>
    <mesh position={[1.9, 1.5, 0]} material={toon("#D9472B")}><cylinderGeometry args={[0.25, 0.25, 0.06, 20]} /></mesh>
    <mesh position={[1.9, 0.75, 0]} material={toon("#2A3450")}><cylinderGeometry args={[0.03, 0.03, 1.5, 8]} /></mesh>
  </group>
);

// ─── interiors ───────────────────────────────────────────────────────────────
const Room: React.FC<{ w: number; d: number; h?: number; floor: string; wall: string; wall2?: string }> = ({ w, d, h = 3.2, floor, wall, wall2 }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon(floor)} receiveShadow><planeGeometry args={[w, d]} /></mesh>
    <mesh position={[0, h / 2, -d / 2]} material={toon(wall)} receiveShadow><planeGeometry args={[w, h]} /></mesh>
    <mesh position={[-w / 2, h / 2, 0]} rotation={[0, Math.PI / 2, 0]} material={toon(wall2 ?? wall)}><planeGeometry args={[d, h]} /></mesh>
    <mesh position={[w / 2, h / 2, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon(wall2 ?? wall)}><planeGeometry args={[d, h]} /></mesh>
    <mesh position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#E0DCD0")}><planeGeometry args={[w, d]} /></mesh>
  </group>
);
/** Classroom: board with the maths question; rows of desks with students; the hero's desk front right. answer 0 wrong / 1 right. */
export const Classroom: React.FC<{ t: number; answer: number }> = ({ t, answer }) => {
  const board = useMemo(() => canvas(1024, 512, (g) => {
    g.fillStyle = "#1E3A2E"; g.fillRect(0, 0, 1024, 512);
    g.fillStyle = "#F1F4F2"; g.font = "800 72px 'Plus Jakarta Sans'"; g.fillText("Q7.  3x + 5 = 20", 70, 170);
    g.font = "600 48px 'Plus Jakarta Sans'"; g.fillText("x = ?", 70, 300);
  }), []);
  const paper = useMemo(() => [0, 1].map((k) => canvas(512, 512, (g) => {
    g.fillStyle = "#F6F1E6"; g.fillRect(0, 0, 512, 512); g.fillStyle = "#1B2A4E"; g.font = "800 64px 'Plus Jakarta Sans'";
    g.fillText("Q7.  x = " + (k ? "5" : "8"), 40, 200);
    g.lineWidth = 16; g.strokeStyle = k ? "#2E9A4E" : "#D9472B"; g.beginPath();
    if (k) { g.moveTo(330, 300); g.lineTo(380, 360); g.lineTo(470, 240); } else { g.moveTo(330, 250); g.lineTo(450, 370); g.moveTo(450, 250); g.lineTo(330, 370); }
    g.stroke();
  })), []);
  return (
    <group>
      <Room w={12} d={10} floor="#8A7A6A" wall="#C9B8A0" wall2="#B8A890" />
      <mesh position={[0, 1.8, -4.98]}><planeGeometry args={[5, 2.5]} /><meshBasicMaterial map={board} /></mesh>
      <group position={[-3.4, 0, -4.3]}><Person3D pos={[0, 0, 0]} yaw={0.2} look={LOOKS.teacher} pose={{ ...STAND, armR: [80, 10, 20] }} face={{ smile: 0.1 }} /></group>
      {Array.from({ length: 12 }, (_, i) => {
        const x = -4 + (i % 4) * 2.6, z = -2 + Math.floor(i / 4) * 2.2, hero = i === 11;
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.75, 0]} material={toon("#B88A5A")} castShadow><boxGeometry args={[1.2, 0.06, 0.7]} /></mesh>
            {[[-0.55, -0.3], [0.55, -0.3], [-0.55, 0.3], [0.55, 0.3]].map(([a, b], k) => <mesh key={k} position={[a, 0.37, b]} material={toon("#3A3A44")}><boxGeometry args={[0.04, 0.74, 0.04]} /></mesh>)}
            <mesh position={[0, 0.79, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.45, 0.45]} /><meshBasicMaterial map={hero ? paper[answer] : paper[0]} /></mesh>
            <Person3D pos={[0, 0, 0.62]} yaw={Math.PI} look={hero ? LOOKS.hoodie : (LOOKS as any)[["ex1", "ex3", "ex5", "ex8", "ex6", "ex2"][i % 6]]} pose={{ ...SIT, headNod: 30, armL: [50, 6, 80], armR: [50, 6, 80] }} face={{ smile: hero && answer ? 0.7 : 0.1 }} />
          </group>
        );
      })}
      <pointLight position={[3, 2.8, 2]} intensity={6} distance={14} color="#FFF4E0" />
      <ambientLight intensity={0.5} />
    </group>
  );
};
/** Five-a-side cage pitch with goals; the ball travels along `ballPath(t)`. */
export const Pitch: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#3E8A4E")} receiveShadow><planeGeometry args={[40, 24]} /></mesh>
    {[[0, 0, 30, 0.08], [0, 8, 30, 0.08], [0, -8, 30, 0.08]].map(([x, z, w, h], i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.005, z]} material={toon("#F1F4F2")}><planeGeometry args={[w, h]} /></mesh>)}
    {[-15, 15, 0].map((x) => <mesh key={x} rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[x, 0.005, 0]} material={toon("#F1F4F2")}><planeGeometry args={[16, 0.08]} /></mesh>)}
    {[-14.6, 14.6].map((x) => (
      <group key={x} position={[x, 0, 0]}>
        {[-1.6, 1.6].map((z) => <mesh key={z} position={[0, 1.0, z]} material={toon("#F4F4F4")}><cylinderGeometry args={[0.06, 0.06, 2, 10]} /></mesh>)}
        <mesh position={[0, 2.0, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F4F4F4")}><cylinderGeometry args={[0.06, 0.06, 3.3, 10]} /></mesh>
        <mesh position={[Math.sign(x) * 0.7, 1.0, 0]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[3.2, 2]} /><meshBasicMaterial color="#FFFFFF" transparent opacity={0.18} side={THREE.DoubleSide} /></mesh>
      </group>
    ))}
    {Array.from({ length: 16 }, (_, i) => <mesh key={i} position={[-20 + i * 2.6, 2.5, -12]} material={toon("#2A2A30")}><cylinderGeometry args={[0.05, 0.05, 5, 6]} /></mesh>)}
    <mesh position={[0, 2.5, -12]}><planeGeometry args={[40, 5]} /><meshBasicMaterial color="#1A1A22" transparent opacity={0.35} /></mesh>
    {Array.from({ length: 4 }, (_, i) => <group key={i} position={[-14 + i * 9.3, 8, -11]}><mesh><boxGeometry args={[1.2, 0.4, 0.4]} /><meshBasicMaterial color="#FFF8E0" toneMapped={false} /></mesh><pointLight intensity={30} distance={30} color="#FFF8E0" /></group>)}
  </group>
);
/** Kitchen: counter, toaster, fridge, a table with `bowls` cereal bowls, a window showing `sky`. */
export const Kitchen: React.FC<{ bowls?: number; sky?: string; toast?: boolean }> = ({ bowls = 1, sky = "#BFE0FF" }) => (
  <group>
    <Room w={7} d={6} floor="#C9B48A" wall="#E7D9C4" wall2="#D9C8B0" />
    {/* the front of the room (seen in reverse shots): floor extension, a wall with a doorway and a calendar */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 3.5]} material={toon("#C9B48A")}><planeGeometry args={[7, 1]} /></mesh>
    <mesh position={[-2.1, 1.6, 4]} rotation={[0, Math.PI, 0]} material={toon("#E0D2BC")}><planeGeometry args={[2.8, 3.2]} /></mesh>
    <mesh position={[2.1, 1.6, 4]} rotation={[0, Math.PI, 0]} material={toon("#E0D2BC")}><planeGeometry args={[2.8, 3.2]} /></mesh>
    <mesh position={[0, 2.8, 4]} rotation={[0, Math.PI, 0]} material={toon("#E0D2BC")}><planeGeometry args={[1.4, 0.8]} /></mesh>
    <mesh position={[0, 1.2, 4.6]} rotation={[0, Math.PI, 0]} material={toon("#6A5A4A")}><planeGeometry args={[1.4, 2.4]} /></mesh>
    <mesh position={[-2.0, 1.8, 3.98]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.6, 0.8]} /><meshToonMaterial color="#F6F1E6" /></mesh>
    <mesh position={[-2.0, 2.1, 3.97]} rotation={[0, Math.PI, 0]}><planeGeometry args={[0.6, 0.2]} /><meshToonMaterial color="#D9472B" /></mesh>
    <mesh position={[2.0, 1.4, 3.98]} rotation={[0, Math.PI, 0]}><planeGeometry args={[1.1, 0.8]} /><meshToonMaterial color="#7A9AC0" /></mesh>
    <mesh position={[-1.4, 0.45, -2.6]} material={toon("#6A8AA8")} castShadow><boxGeometry args={[4, 0.9, 0.7]} /></mesh>
    <mesh position={[-1.4, 0.92, -2.6]} material={toon("#E9E2D0")}><boxGeometry args={[4.05, 0.06, 0.75]} /></mesh>
    <mesh position={[-2.6, 1.08, -2.6]} material={toon("#B8B8C0")} castShadow><boxGeometry args={[0.4, 0.26, 0.25]} /></mesh>
    <mesh position={[2.6, 1.0, -2.55]} material={toon("#E9ECF4")} castShadow><boxGeometry args={[0.9, 2.0, 0.8]} /></mesh>
    <mesh position={[0.6, 1.9, -2.99]}><planeGeometry args={[1.6, 1.0]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
    <pointLight position={[0.6, 1.9, -2.2]} color={sky} intensity={5} distance={6} />
    <group position={[0, 0, 0.3]}>
      <mesh position={[0, 0.75, 0]} material={toon("#8A6A4E")} castShadow><boxGeometry args={[1.8, 0.06, 1.0]} /></mesh>
      {[[-0.8, -0.4], [0.8, -0.4], [-0.8, 0.4], [0.8, 0.4]].map(([a, b], k) => <mesh key={k} position={[a, 0.37, b]} material={toon("#6A4E3A")}><boxGeometry args={[0.05, 0.74, 0.05]} /></mesh>)}
      {Array.from({ length: bowls }, (_, k) => (
        <group key={k} position={[-0.6 + (k % 4) * 0.4, 0.8, -0.15 + Math.floor(k / 4) * 0.3]}>
          <mesh material={toon(["#F2B84B", "#D9472B", "#2E5FD0", "#4E7A4A"][k % 4])}><sphereGeometry args={[0.1, 16, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} /></mesh>
          <mesh position={[0, -0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} material={toon("#E8C77A")}><circleGeometry args={[0.09, 16]} /></mesh>
        </group>
      ))}
    </group>
    <mesh position={[0, 2.6, 0.3]}><sphereGeometry args={[0.14, 12, 8]} /><meshStandardMaterial color="#FFE2A8" emissive="#FFC877" emissiveIntensity={2} /></mesh>
    <pointLight position={[0, 2.4, 0.3]} color="#FFD9A0" intensity={5} distance={7} castShadow />
    <ambientLight intensity={0.55} />
  </group>
);

// ─── exteriors ───────────────────────────────────────────────────────────────
/** Zebra crossing over the road at x = 0, a pedestrian light per side (green while `green`). */
export const Crossing: React.FC<{ green: boolean }> = ({ green }) => (
  <group>
    {Array.from({ length: 8 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 2.0 + i * 0.8]} material={toon("#ECE8DC")}><planeGeometry args={[2.6, 0.45]} /></mesh>)}
    {[[1.6, 1.4], [-1.6, 8.3]].map(([x, z], i) => (
      <group key={i} position={[x, 0, z]}>
        <mesh position={[0, 1.4, 0]} material={toon("#22263A")}><cylinderGeometry args={[0.06, 0.06, 2.8, 8]} /></mesh>
        <mesh position={[0, 2.6, 0]} material={toon("#1A1A22")}><boxGeometry args={[0.3, 0.6, 0.25]} /></mesh>
        <mesh position={[0, 2.75, i ? -0.13 : 0.13]}><circleGeometry args={[0.09, 16]} /><meshBasicMaterial color={green ? "#1A2A1A" : "#FF4A3A"} toneMapped={false} /></mesh>
        <mesh position={[0, 2.48, i ? -0.13 : 0.13]}><circleGeometry args={[0.09, 16]} /><meshBasicMaterial color={green ? "#4AFF7A" : "#1A2A1A"} toneMapped={false} /></mesh>
        {green && <pointLight position={[0, 2.5, i ? -0.4 : 0.4]} color="#4AFF7A" intensity={1.5} distance={3} />}
      </group>
    ))}
  </group>
);
/** The river road: a long straight road along x, a railing, the river (z > 6), the city across with THE TOWER. tower 0 = never built. */
export const RiverRoad: React.FC<{ t: number; tower?: number; night?: boolean }> = ({ t, tower = 1 }) => {
  const water = useMemo(() => {
    const tx = canvas(256, 256, (g) => { g.fillStyle = "#0E1A30"; g.fillRect(0, 0, 256, 256); for (let i = 0; i < 90; i++) { g.fillStyle = `rgba(255,${190 + rnd(i) * 60},120,${0.15 + rnd(i + 2) * 0.4})`; g.fillRect(rnd(i + 5) * 256, rnd(i + 7) * 256, 10 + rnd(i) * 40, 2); } });
    tx.wrapS = tx.wrapT = THREE.RepeatWrapping; tx.repeat.set(60, 8); return tx;
  }, []);
  water.offset.x = t * 0.02;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -2]} material={toon("#3A3A4A")} receiveShadow><planeGeometry args={[800, 10]} /></mesh>
      {Array.from({ length: 160 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-400 + i * 5, 0.004, -0.6]} material={toon("#E8DFC8")}><planeGeometry args={[2.4, 0.12]} /></mesh>)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 4.2]} material={toon("#5A5560")}><planeGeometry args={[800, 3]} /></mesh>
      <mesh position={[0, 0.55, 5.6]} material={toon("#22263A")}><boxGeometry args={[800, 0.06, 0.06]} /></mesh>
      {Array.from({ length: 160 }, (_, i) => <mesh key={`r${i}`} position={[-400 + i * 5, 0.28, 5.6]} material={toon("#22263A")}><boxGeometry args={[0.06, 0.56, 0.06]} /></mesh>)}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 60]}><planeGeometry args={[900, 110]} /><meshStandardMaterial map={water} color="#5A6A8A" roughness={0.15} metalness={0.4} emissive="#1A2A4A" emissiveIntensity={0.4} /></mesh>
      {Array.from({ length: 60 }, (_, i) => (
        <group key={`l${i}`} position={[-300 + i * 10, 0, -5.4]}>
          <mesh position={[0, 2, 0]} material={toon("#22263A")}><cylinderGeometry args={[0.05, 0.08, 4, 8]} /></mesh>
          <mesh position={[0, 4.05, 0.3]}><sphereGeometry args={[0.16, 10, 8]} /><meshBasicMaterial color="#FFD27A" toneMapped={false} /></mesh>
        </group>
      ))}
      {Array.from({ length: 70 }, (_, i) => <Building key={i} x={-350 + i * 10 + rnd(i) * 4} z={120 + rnd(i + 3) * 30} w={8} h={12 + rnd(i + 5) * 34} d={8} color={["#3E4A66", "#4A4466", "#58506A"][i % 3]} seed={i} />)}
      {tower > 0.01 && (
        <group position={[30, 0, 125]} scale={[1, tower, 1]}>
          <mesh position={[0, 45, 0]} material={toon("#6A7898")}><cylinderGeometry args={[4, 7, 90, 8]} /></mesh>
          <mesh position={[0, 96, 0]} material={toon("#8A98B8")}><coneGeometry args={[4, 14, 8]} /></mesh>
          <mesh position={[0, 106, 0]}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#FF4A3A" toneMapped={false} /></mesh>
        </group>
      )}
      {Array.from({ length: 20 }, (_, i) => <pointLight key={`p${i}`} position={[-95 + i * 10, 3.9, -4.8]} color="#FFC777" intensity={5} distance={9} decay={1.6} />)}
    </group>
  );
};
/** The car park that replaced the café: painted bays, parked cars, a barrier and a pay machine. */
export const CarPark: React.FC = () => (
  <group position={[-2.6, 0, -6]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={toon("#3A3A44")} receiveShadow><planeGeometry args={[12, 6]} /></mesh>
    {Array.from({ length: 6 }, (_, i) => <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[-5 + i * 2.2, 0.015, 0.2]} material={toon("#ECE8DC")}><planeGeometry args={[0.08, 4]} /></mesh>)}
    {[[-3.9, "#B8432F"], [-1.7, "#2E5FD0"], [2.7, "#E9ECF0"]].map(([x, c], i) => <Car key={i} p={[x as number, 0, 0.3]} col={c as string} yaw={Math.PI / 2} />)}
    <mesh position={[5.5, 0.6, 2.6]} material={toon("#D9472B")}><boxGeometry args={[0.3, 1.2, 0.3]} /></mesh>
    <mesh position={[4.0, 1.05, 2.6]} material={toon("#F1F4F2")}><boxGeometry args={[3, 0.1, 0.1]} /></mesh>
    <mesh position={[5.5, 0.8, -2.4]} material={toon("#2A3450")}><boxGeometry args={[0.5, 1.6, 0.4]} /></mesh>
    <mesh position={[0, 2.4, -2.95]}><planeGeometry args={[3, 0.8]} /><meshBasicMaterial color="#2E5FD0" /></mesh>
  </group>
);
/** Hallway photo wall. holiday: the beach photo you never took. */
export const PhotoWall: React.FC<{ holiday: boolean; glitch?: number }> = ({ holiday, glitch = 0 }) => {
  const photos = useMemo(() => [0, 1, 2, 3].map((k) => canvas(256, 200, (g) => {
    const sky = ["#9CC8F0", "#F2B87A", "#BFE0FF", "#7AA8D8"][k]; g.fillStyle = sky; g.fillRect(0, 0, 256, 200);
    g.fillStyle = ["#5E8A4E", "#B49A80", "#E8D4A0", "#3E6A46"][k]; g.fillRect(0, 130, 256, 70);
    for (let i = 0; i < (k === 2 ? 4 : 3); i++) { g.fillStyle = "#0E070D"; g.beginPath(); g.arc(70 + i * 50, 95, 16, 0, 7); g.fill(); g.fillStyle = ["#2E5FD0", "#A0303C", "#7A5A8C", "#4E7A4A"][i]; g.fillRect(58 + i * 50, 110, 24, 34); }
  })), []);
  const beach = useMemo(() => canvas(256, 200, (g) => {
    g.fillStyle = "#6FC0F0"; g.fillRect(0, 0, 256, 200); g.fillStyle = "#FFE08A"; g.beginPath(); g.arc(200, 45, 22, 0, 7); g.fill();
    g.fillStyle = "#2E8AC0"; g.fillRect(0, 110, 256, 30); g.fillStyle = "#F0D9A0"; g.fillRect(0, 140, 256, 60);
    for (let i = 0; i < 3; i++) { g.fillStyle = "#0E070D"; g.beginPath(); g.arc(80 + i * 45, 120, 14, 0, 7); g.fill(); g.fillStyle = ["#E58A3A", "#7A5A8C", "#2E5FD0"][i]; g.fillRect(70 + i * 45, 133, 20, 30); }
  }), []);
  return (
    <group>
      <mesh position={[0, 1.6, -0.05]} material={toon("#C9B8A0")}><planeGeometry args={[6, 3.2]} /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]} material={toon("#8A6A4E")}><planeGeometry args={[6, 3]} /></mesh>
      {[[-1.9, 1.9], [-0.5, 2.1], [0.9, 1.85], [2.2, 2.05], [-1.2, 1.0], [1.5, 1.05]].map(([x, y], i) => {
        const tex = i === 1 && holiday ? beach : photos[i % 4];
        return (
          <group key={i} position={[x + (i === 1 ? (rnd(Math.floor(glitch * 30)) - 0.5) * 0.1 * glitch : 0), y, 0]}>
            <mesh material={toon("#3A2A22")}><boxGeometry args={[1.0, 0.82, 0.04]} /></mesh>
            <mesh position={[0, 0, 0.025]}><planeGeometry args={[0.86, 0.68]} /><meshBasicMaterial map={tex} /></mesh>
          </group>
        );
      })}
      <pointLight position={[0, 2.6, 2]} intensity={5} distance={7} color="#FFE2B0" />
      <ambientLight intensity={0.5} />
    </group>
  );
};
