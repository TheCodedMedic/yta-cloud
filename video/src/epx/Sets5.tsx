// Episode 05 sets and props: the hob and frying pan in the kitchen, a shop aisle with the skull hot sauce, the dentist,
// the gym, the hospital room and corridor, the street-performer's coals, a fire-alarm bell on a wall. Every set is dressed.
import React, { useMemo } from "react";
import * as THREE from "three";
import { LOOKS, Person3D, STAND, toon } from "../cam3d/Person3D";
import { Chair, sitOn } from "../cam3d/Props3D";
import { Building } from "../cam3d/World3D";
import { Framed } from "../ep04/Sets3";
import { V3 } from "../ep04/Vfx";
import { CAST } from "./Kit";

const D = THREE.MathUtils.degToRad;
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const tex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, rep?: [number, number]) => {
  const c = document.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(...rep); }
  return t;
};
export const Box: React.FC<{ p: V3; s: V3; c: string; r?: V3; cast?: boolean }> = ({ p, s, c, r, cast = true }) => (
  <mesh position={p} rotation={r} material={toon(c)} castShadow={cast} receiveShadow><boxGeometry args={s} /></mesh>
);
export const Glow: React.FC<{ p: V3; s: V3; c: string; i?: number; r?: V3 }> = ({ p, s, c, i = 1, r }) => (
  <mesh position={p} rotation={r}><boxGeometry args={s} /><meshStandardMaterial color={c} emissive={c} emissiveIntensity={i} toneMapped={false} /></mesh>
);

// ─── kitchen hob (built into the ep04 Kitchen worktop at x −1.35, z −2.6) ────
export const HOB: V3 = [-1.35, 0.955, -2.55];
/** Hob plate with two rings; `heat` 0..1 glows the front ring. */
export const Hob: React.FC<{ heat?: number; light?: boolean }> = ({ heat = 1, light = false }) => (
  <group position={HOB}>
    <Box p={[0, 0, 0]} s={[0.52, 0.02, 0.46]} c="#1A1A22" cast={false} />
    {[[-0.12, 0.1], [0.12, -0.1]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0.012, z]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.05, 0.095, 32]} />
        <meshStandardMaterial color={i === 0 ? "#FF5A1E" : "#3A3A44"} emissive="#FF4A12" emissiveIntensity={i === 0 ? 2.2 * heat : 0} toneMapped={false} />
      </mesh>
    ))}
    {light && heat > 0.05 && <pointLight position={[-0.12, 0.15, 0.1]} color="#FF6A2A" intensity={2.5 * heat} distance={1.6} />}
    {[-0.18, 0, 0.18].map((x) => <mesh key={x} position={[x, -0.06, 0.24]} rotation={[Math.PI / 2, 0, 0]} material={toon("#C9CCD6")}><cylinderGeometry args={[0.022, 0.022, 0.03, 12]} /></mesh>)}
  </group>
);
/** The frying pan resting on the front ring (world prop), with an egg. */
export const PanOnHob: React.FC<{ steam?: number; t?: number }> = ({ steam = 0, t = 0 }) => (
  <group position={[HOB[0] - 0.12, HOB[1] + 0.03, HOB[2] + 0.1]}>
    <PanBody />
    <group position={[0.31, 0.025, 0]} rotation={[0, 0, D(-8)]}><mesh material={toon("#2A2A30")} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.014, 0.016, 0.3, 10]} /></mesh></group>
    <Steam t={t} amt={steam} />
  </group>
);
const PanBody: React.FC = () => (
  <>
    <mesh material={toon("#2A2A30")} castShadow><cylinderGeometry args={[0.15, 0.13, 0.045, 28, 1, true]} /></mesh>
    <mesh position={[0, -0.02, 0]} material={toon("#202026")}><cylinderGeometry args={[0.13, 0.13, 0.01, 28]} /></mesh>
    <mesh position={[0, -0.012, 0]} rotation={[-Math.PI / 2, 0, 0]} material={toon("#F6F3EA")}><circleGeometry args={[0.06, 20]} /></mesh>
    <mesh position={[0.01, -0.006, 0.01]} material={toon("#F2B030")}><sphereGeometry args={[0.024, 12, 8]} /></mesh>
  </>
);
/** The pan held by its handle: drawn in the palm frame (−y toward the fingertips). The handle runs out of the fist, the pan beyond it, kept level. */
export const HeldPan: React.FC<{ tilt?: number }> = ({ tilt = 0 }) => (
  <group position={[0, -0.02, 0.03]}>
    <mesh material={toon("#2A2A30")} position={[0, -0.13, 0]}><cylinderGeometry args={[0.014, 0.016, 0.28, 10]} /></mesh>
    <group position={[0, -0.42, 0]} rotation={[0, 0, Math.PI / 2 + tilt]}><PanBody /></group>
  </group>
);
/** Rising steam wisps (amt 0..1). */
export const Steam: React.FC<{ t: number; amt: number; p?: V3 }> = ({ t, amt, p = [0, 0.05, 0] }) => {
  if (amt <= 0.02) return null;
  return (
    <group position={p}>
      {Array.from({ length: 7 }, (_, k) => {
        const u = ((t * 0.6 + k / 7) % 1);
        return <mesh key={k} position={[Math.sin(t * 2 + k) * 0.05 * u, u * 0.5, Math.cos(t * 1.7 + k) * 0.04 * u]} scale={0.04 + u * 0.08}><sphereGeometry args={[1, 10, 8]} /><meshBasicMaterial color="#F4F4F8" transparent opacity={0.35 * amt * (1 - u)} depthWrite={false} /></mesh>;
      })}
    </group>
  );
};

// ─── hot sauce and the shop aisle ────────────────────────────────────────────
const skullLabel = () => tex(128, 160, (g) => {
  g.fillStyle = "#1A1A22"; g.fillRect(0, 0, 128, 160); g.fillStyle = "#F6F1E6"; g.beginPath(); g.arc(64, 62, 30, 0, 7); g.fill(); g.fillRect(48, 82, 32, 22);
  g.fillStyle = "#1A1A22"; g.beginPath(); g.arc(52, 60, 9, 0, 7); g.fill(); g.beginPath(); g.arc(76, 60, 9, 0, 7); g.fill(); g.fillRect(56, 88, 4, 14); g.fillRect(68, 88, 4, 14);
  g.fillStyle = "#FF3A2A"; g.font = "900 22px 'Plus Jakarta Sans'"; g.textAlign = "center"; g.fillText("XXX HOT", 64, 140);
});
/** The skull bottle (standing, base at p). */
export const Sauce: React.FC<{ p?: V3; s?: number }> = ({ p = [0, 0, 0], s = 1 }) => {
  const lab = useMemo(skullLabel, []);
  return (
    <group position={p} scale={s}>
      <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.035, 0.035, 0.14, 18]} /><meshStandardMaterial color="#C81E12" roughness={0.25} /></mesh>
      <mesh position={[0, 0.07, 0.0]} rotation={[0, 0, 0]}><cylinderGeometry args={[0.0355, 0.0355, 0.08, 18, 1, true, -0.9, 1.8]} /><meshBasicMaterial map={lab} /></mesh>
      <mesh position={[0, 0.165, 0]} material={toon("#C81E12")}><cylinderGeometry args={[0.012, 0.03, 0.05, 12]} /></mesh>
      <mesh position={[0, 0.2, 0]} material={toon("#1A1A22")}><cylinderGeometry args={[0.014, 0.014, 0.03, 12]} /></mesh>
    </group>
  );
};
/** Sauce held upright in a gripping hand (CUP_HOLD pose): bottle axis along the palm's x. */
export const HeldSauce: React.FC = () => <group position={[0, -0.03, 0.045]} rotation={[0, 0, D(90)]}><group position={[0, -0.08, 0]}><Sauce /></group></group>;

/** Shop aisle along x at z = 0: shelves both sides full of products, price strips, ceiling lights, a checkout far end. */
export const ShopAisle: React.FC = () => {
  const cols = ["#D9472B", "#F2B84B", "#2E5FD0", "#4E9A4E", "#E87AA8", "#F6F1E6", "#7A5A8C", "#E58A3A"];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#DCD8CE")} receiveShadow><planeGeometry args={[30, 8]} /></mesh>
      <mesh position={[0, 3.4, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F0EEE8")}><planeGeometry args={[30, 8]} /></mesh>
      <mesh position={[0, 1.7, -3.5]} material={toon("#E7E2D6")}><planeGeometry args={[30, 3.4]} /></mesh>
      {[-1.6, 1.6].map((z, side) => (
        <group key={z} position={[0, 0, z]}>
          <Box p={[0, 1.0, side ? 0.2 : -0.2]} s={[14, 2.0, 0.5]} c="#E9ECF0" />
          {[0.3, 0.75, 1.2, 1.65].map((y, r) => (
            <group key={y}>
              <Box p={[0, y, side ? -0.08 : 0.08]} s={[14, 0.03, 0.5]} c="#C9CDD6" cast={false} />
              <Box p={[0, y + 0.015, side ? -0.32 : 0.32]} s={[14, 0.04, 0.01]} c="#F2B84B" cast={false} />
              {Array.from({ length: 40 }, (_, i) => {
                const h = 0.14 + rnd(i + r * 50 + side * 999) * 0.16, c = cols[(i * 3 + r + side) % cols.length];
                const x = -6.8 + i * 0.34;
                if (side === 0 && r === 2 && i === 21) return null; // the gap where the skull sauce is (placed in shots)
                return rnd(i * 7 + r) > 0.5
                  ? <mesh key={i} position={[x, y + 0.015 + h / 2, side ? -0.12 : 0.12]} material={toon(c)}><cylinderGeometry args={[0.05, 0.05, h, 12]} /></mesh>
                  : <Box key={i} p={[x, y + 0.015 + h / 2, side ? -0.12 : 0.12]} s={[0.22, h, 0.14]} c={c} cast={false} />;
              })}
            </group>
          ))}
        </group>
      ))}
      <Sauce p={[-6.8 + 21 * 0.34, 1.215, -1.48]} s={1.1} />
      {Array.from({ length: 6 }, (_, i) => <Glow key={i} p={[-6 + i * 2.4, 3.36, 0]} s={[1.6, 0.04, 0.3]} c="#FFF8EA" i={1.5} />)}
      <pointLight position={[0, 3, 0]} intensity={8} distance={14} color="#FFF4E0" />
      <Box p={[8, 0.5, 0]} s={[0.8, 1, 2]} c="#2A3450" />
      <ambientLight intensity={0.7} />
    </group>
  );
};

// ─── dentist ─────────────────────────────────────────────────────────────────
/** Dentist room: the reclined chair (patient head at ~[0, 1.05, −0.9]), the lamp arm, a tray and drill, cabinets, a window. */
export const DENT_HEAD: V3 = [0, 1.3, -0.2];
export const Dentist: React.FC<{ drill?: number; lamp?: boolean }> = ({ drill = 0, lamp = true }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#D9E6EA")} receiveShadow><planeGeometry args={[7, 7]} /></mesh>
    <mesh position={[0, 1.6, -3]} material={toon("#EAF2F4")}><planeGeometry args={[7, 3.2]} /></mesh>
    <mesh position={[-3.5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#DDEBEE")}><planeGeometry args={[7, 3.2]} /></mesh>
    <mesh position={[3.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#DDEBEE")}><planeGeometry args={[7, 3.2]} /></mesh>
    <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F4F6F6")}><planeGeometry args={[7, 7]} /></mesh>
    {/* window with blinds */}
    <mesh position={[1.4, 1.8, -2.98]}><planeGeometry args={[1.6, 1.1]} /><meshBasicMaterial color="#BFE0FF" toneMapped={false} /></mesh>
    {Array.from({ length: 9 }, (_, i) => <Box key={i} p={[1.4, 1.32 + i * 0.12, -2.95]} s={[1.65, 0.03, 0.02]} c="#F6F6F6" cast={false} />)}
    {/* the chair: base, seat, reclined back, headrest, footrest */}
    <group position={[0, 0, 0]}>
      <mesh position={[0, 0.25, 0.1]} material={toon("#C9CCD6")}><cylinderGeometry args={[0.12, 0.25, 0.5, 18]} /></mesh>
      <Box p={[0, 0.55, 0.2]} s={[0.62, 0.12, 0.6]} c="#3E9AA8" />
      <Box p={[0, 0.78, -0.42]} s={[0.62, 0.12, 0.8]} c="#3E9AA8" r={[D(-35), 0, 0]} />
      <Box p={[0, 1.0, -0.86]} s={[0.32, 0.1, 0.24]} c="#2E7A88" r={[D(-50), 0, 0]} />
      <Box p={[0, 0.42, 0.75]} s={[0.55, 0.1, 0.5]} c="#3E9AA8" r={[D(20), 0, 0]} />
    </group>
    {/* lamp arm over the patient */}
    <group position={[0.9, 0, -1.4]}>
      <Box p={[0, 1.4, 0]} s={[0.08, 2.8, 0.08]} c="#C9CCD6" />
      <Box p={[-0.4, 2.0, 0.25]} s={[0.9, 0.06, 0.06]} c="#C9CCD6" r={[0, D(-30), D(-15)]} />
      <group position={[-0.8, 1.85, 0.5]} rotation={[D(40), 0, 0]}>
        <Box p={[0, 0, 0]} s={[0.36, 0.12, 0.18]} c="#E9ECF0" />
        <Glow p={[0, -0.065, 0]} s={[0.3, 0.01, 0.12]} c="#FFFBEA" i={lamp ? 3 : 0.2} />
      </group>
      {lamp && <spotLight position={[-0.8, 1.8, 0.5]} target-position={DENT_HEAD} angle={0.35} penumbra={0.5} intensity={30} distance={6} color="#FFF8E8" />}
    </group>
    {/* tray, drill, cabinets, certificate */}
    <group position={[-0.8, 0, -0.6]}>
      <Box p={[0, 1.0, 0]} s={[0.5, 0.03, 0.35]} c="#C9CCD6" /><Box p={[0, 0.5, 0]} s={[0.04, 1.0, 0.04]} c="#9AA0AC" />
      {[0, 1, 2].map((i) => <Box key={i} p={[-0.15 + i * 0.12, 1.03, 0]} s={[0.015, 0.01, 0.2]} c="#E9ECF0" cast={false} />)}
    </group>
    <group position={[-0.4 + 0.25 * drill, 1.36 - 0.04 * drill, -0.05]} rotation={[0, 0, D(-70)]}>
      <Box p={[0, 0, 0]} s={[0.025, 0.2, 0.025]} c="#F1F1F4" /><Box p={[0, -0.11, 0]} s={[0.006, 0.03, 0.006]} c="#9AA0AC" cast={false} />
    </group>
    <Box p={[-2.6, 0.45, -2.6]} s={[1.6, 0.9, 0.7]} c="#F4F6F6" /><Box p={[-2.6, 0.92, -2.6]} s={[1.65, 0.05, 0.75]} c="#9AD0D8" />
    <Box p={[-2.6, 2.2, -2.8]} s={[1.6, 0.7, 0.35]} c="#F4F6F6" />
    <Framed kind="mountains" p={[-1.2, 1.9, -2.97]} w={0.7} />
    <Box p={[-3.48, 1.8, -0.5]} s={[0.02, 0.5, 0.4]} c="#F6F1E6" cast={false} />
    <pointLight position={[0, 2.8, 0]} intensity={6} distance={9} color="#F4FAFF" />
    <ambientLight intensity={0.7} />
  </group>
);

// ─── gym ─────────────────────────────────────────────────────────────────────
export const Gym: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#3A3A44")} receiveShadow><planeGeometry args={[14, 10]} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0.5]} material={toon("#2E5A8A")}><planeGeometry args={[3, 2]} /></mesh>
    <mesh position={[0, 1.8, -4]} material={toon("#9AA0AC")}><planeGeometry args={[14, 3.6]} /></mesh>
    <mesh position={[0, 1.5, -3.97]}><planeGeometry args={[8, 2.2]} /><meshStandardMaterial color="#B8C8D8" roughness={0.05} metalness={0.6} /></mesh>
    <mesh position={[-7, 1.8, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#8A909C")}><planeGeometry args={[10, 3.6]} /></mesh>
    <mesh position={[7, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#8A909C")}><planeGeometry args={[10, 3.6]} /></mesh>
    {/* dumbbell rack, bench, a treadmill, a punch bag */}
    <group position={[-3.6, 0, -3.2]}>
      <Box p={[0, 0.5, 0]} s={[2.4, 0.06, 0.5]} c="#22263A" /><Box p={[0, 0.25, 0]} s={[2.3, 0.5, 0.06]} c="#22263A" />
      {Array.from({ length: 8 }, (_, i) => <group key={i} position={[-1.05 + i * 0.3, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}><mesh material={toon("#1A1A22")}><cylinderGeometry args={[0.06 + i * 0.006, 0.06 + i * 0.006, 0.08, 12]} /></mesh></group>)}
    </group>
    <Box p={[2.6, 0.45, -1.5]} s={[0.4, 0.08, 1.4]} c="#D9472B" /><Box p={[2.6, 0.22, -1.5]} s={[0.1, 0.44, 1.0]} c="#22263A" />
    <group position={[4.8, 0, -2.6]}><Box p={[0, 0.2, 0]} s={[0.8, 0.12, 1.8]} c="#22263A" /><Box p={[0, 0.9, -0.85]} s={[0.8, 0.5, 0.1]} c="#2A2A34" r={[D(-20), 0, 0]} /><Box p={[0, 0.6, -0.8]} s={[0.06, 1.0, 0.06]} c="#9AA0AC" /></group>
    <group position={[-5.4, 0, 0.6]}><mesh position={[0, 2.9, 0]} material={toon("#9AA0AC")}><cylinderGeometry args={[0.01, 0.01, 0.6, 6]} /></mesh><mesh position={[0, 1.8, 0]} material={toon("#8A2A2A")} castShadow><cylinderGeometry args={[0.25, 0.25, 1.2, 18]} /></mesh></group>
    {Array.from({ length: 4 }, (_, i) => <Glow key={i} p={[-4.5 + i * 3, 3.55, 0]} s={[1.6, 0.05, 0.25]} c="#F4FAFF" i={1.4} />)}
    <pointLight position={[0, 3.2, 0.5]} intensity={12} distance={14} color="#F4FAFF" castShadow />
    <hemisphereLight args={["#DDE8FF", "#3A3A44", 0.9]} />
    <ambientLight intensity={0.6} />
  </group>
);

// ─── hospital ────────────────────────────────────────────────────────────────
/** Hospital room: bed along z (pillow end at z −1.6, mattress top 0.75), monitor with a heart trace, IV stand, curtain, window at night/day. */
export const BED: V3 = [0, 0, -0.6];
export const Hospital: React.FC<{ t: number; night?: boolean; beat?: number }> = ({ t, night = true, beat = 72 }) => {
  const screen = useMemo(() => document.createElement("canvas"), []);
  const mtex = useMemo(() => { screen.width = 256; screen.height = 160; const tx = new THREE.CanvasTexture(screen); tx.colorSpace = THREE.SRGBColorSpace; return tx; }, [screen]);
  const g = screen.getContext("2d")!; g.fillStyle = "#06120E"; g.fillRect(0, 0, 256, 160); g.strokeStyle = "#3DFF8A"; g.lineWidth = 3; g.beginPath();
  for (let x = 0; x < 256; x++) { const ph = ((x / 256) * 3 + t * (beat / 60)) % 1; const y = 80 - (ph > 0.42 && ph < 0.46 ? 50 : ph > 0.46 && ph < 0.5 ? -25 : 0) - Math.sin(ph * 30) * 2; x ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.fillStyle = "#3DFF8A"; g.font = "800 34px 'Plus Jakarta Sans'"; g.fillText(String(beat), 180, 40); mtex.needsUpdate = true;
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#C9D6DA")} receiveShadow><planeGeometry args={[7, 7]} /></mesh>
      <mesh position={[0, 1.6, -3]} material={toon("#DCE8EA")}><planeGeometry args={[7, 3.2]} /></mesh>
      <mesh position={[-3.5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#D2E0E2")}><planeGeometry args={[7, 3.2]} /></mesh>
      <mesh position={[3.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#D2E0E2")}><planeGeometry args={[7, 3.2]} /></mesh>
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F2F4F4")}><planeGeometry args={[7, 7]} /></mesh>
      <mesh position={[-1.6, 1.8, -2.98]}><planeGeometry args={[1.4, 1.1]} /><meshBasicMaterial color={night ? "#1A2448" : "#BFE0FF"} toneMapped={false} /></mesh>
      <Box p={[-1.6, 1.8, -2.96]} s={[1.5, 0.05, 0.03]} c="#F6F6F6" cast={false} />
      {/* bed */}
      <group position={BED}>
        <Box p={[0, 0.45, 0]} s={[1.0, 0.12, 2.1]} c="#9AA0AC" /><Box p={[0, 0.6, 0]} s={[0.95, 0.18, 2.0]} c="#F4F6F8" />
        <Box p={[0, 0.62, 0.35]} s={[0.98, 0.16, 1.2]} c="#7AA8C8" />
        <mesh position={[0, 0.75, -0.8]} scale={[0.36, 0.08, 0.2]} material={toon("#FFFFFF")}><sphereGeometry args={[1, 14, 8]} /></mesh>
        <Box p={[0, 0.9, -1.05]} s={[1.0, 0.6, 0.06]} c="#9AA0AC" />
        {[[-0.45, -0.95], [0.45, -0.95], [-0.45, 0.95], [0.45, 0.95]].map(([x, z], i) => <Box key={i} p={[x, 0.2, z]} s={[0.05, 0.4, 0.05]} c="#6A707C" />)}
      </group>
      {/* monitor on a stand */}
      <group position={[0.95, 0, -1.6]} rotation={[0, D(-25), 0]}>
        <Box p={[0, 0.7, 0]} s={[0.05, 1.4, 0.05]} c="#9AA0AC" />
        <Box p={[0, 1.5, 0]} s={[0.5, 0.36, 0.08]} c="#2A2D38" />
        <mesh position={[0, 1.5, 0.045]}><planeGeometry args={[0.44, 0.28]} /><meshBasicMaterial map={mtex} toneMapped={false} /></mesh>
      </group>
      {/* IV stand, curtain rail and curtain, chair, flowers */}
      <group position={[-0.85, 0, -1.3]}><Box p={[0, 0.95, 0]} s={[0.03, 1.9, 0.03]} c="#C9CCD6" /><mesh position={[0, 1.75, 0]}><boxGeometry args={[0.14, 0.22, 0.04]} /><meshStandardMaterial color="#DDEEFF" transparent opacity={0.7} /></mesh></group>
      <Box p={[2.0, 3.0, 0]} s={[0.03, 0.03, 5]} c="#9AA0AC" cast={false} />
      <group position={[2.0, 1.75, 0.6]}>{Array.from({ length: 7 }, (_, i) => <Box key={i} p={[0, 0, -1.2 + i * 0.36]} s={[0.05, 2.4, 0.32]} c={i % 2 ? "#8AC0C8" : "#7AB0B8"} r={[0, D(i % 2 ? 20 : -20), 0]} />)}</group>
      <Chair p={[-1.2, 0, 0.6]} yaw={D(70)} col="#5A6A8A" />
      <group position={[1.1, 0, 0.9]}><Box p={[0, 0.35, 0]} s={[0.5, 0.7, 0.45]} c="#C9CCD6" /><mesh position={[0, 0.8, 0]} material={toon("#9AD0D8")}><cylinderGeometry args={[0.06, 0.05, 0.16, 12]} /></mesh>{[0, 1, 2, 3].map((k) => <mesh key={k} position={[Math.sin(k * 1.6) * 0.06, 0.95, Math.cos(k * 1.6) * 0.06]} material={toon(["#F2B84B", "#E87AA8", "#D9472B", "#F6F1E6"][k])}><sphereGeometry args={[0.045, 10, 8]} /></mesh>)}</group>
      <Glow p={[0, 3.17, -0.4]} s={[1.2, 0.04, 0.3]} c="#F4FAFF" i={night ? 0.8 : 1.4} />
      <pointLight position={[0, 2.8, 0]} intensity={night ? 4 : 7} distance={9} color={night ? "#DDE8FF" : "#F4FAFF"} castShadow />
      <ambientLight intensity={night ? 0.45 : 0.7} />
    </group>
  );
};
/** Hospital corridor along −z: doors, rails, ceiling lights, a gurney. `run` moves the lights for a push. */
export const Corridor: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#B8C8CC")} receiveShadow><planeGeometry args={[3.2, 60]} /></mesh>
    {[-1.6, 1.6].map((x) => <mesh key={x} position={[x, 1.5, 0]} rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]} material={toon("#DCE8EA")}><planeGeometry args={[60, 3]} /></mesh>)}
    <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F2F4F4")}><planeGeometry args={[3.2, 60]} /></mesh>
    {Array.from({ length: 12 }, (_, i) => (
      <group key={i}>
        <Glow p={[0, 2.97, 20 - i * 4]} s={[0.8, 0.03, 0.4]} c="#F4FAFF" i={1.6} />
        <Box p={[i % 2 ? 1.58 : -1.58, 1.05, 18 - i * 4]} s={[0.04, 2.1, 1.1]} c={i % 3 ? "#5A8AA8" : "#7AA0B8"} cast={false} />
        <Box p={[1.56, 0.9, 20 - i * 4]} s={[0.04, 0.05, 3.6]} c="#9AA0AC" cast={false} />
        <Box p={[-1.56, 0.9, 20 - i * 4]} s={[0.04, 0.05, 3.6]} c="#9AA0AC" cast={false} />
      </group>
    ))}
    <group position={[-0.9, 0, -6]}><Box p={[0, 0.75, 0]} s={[0.6, 0.1, 1.9]} c="#F4F6F8" /><Box p={[0, 0.38, 0]} s={[0.5, 0.06, 1.7]} c="#9AA0AC" /></group>
    {Array.from({ length: 5 }, (_, i) => <pointLight key={i} position={[0, 2.7, 16 - i * 8]} intensity={5} distance={9} color="#F4FAFF" />)}
    <ambientLight intensity={0.6} />
  </group>
);

// ─── the street performer's coals (golden street) ────────────────────────────
export const Coals: React.FC<{ t: number; p?: V3 }> = ({ t, p = [0, 0, 0] }) => (
  <group position={p}>
    <Box p={[0, 0.04, 0]} s={[3.2, 0.08, 0.9]} c="#3A2A22" />
    {Array.from({ length: 70 }, (_, i) => (
      <mesh key={i} position={[-1.5 + rnd(i) * 3, 0.1, -0.38 + rnd(i + 5) * 0.76]} scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.05 + rnd(i + 9) * 0.04, 8, 6]} />
        <meshStandardMaterial color="#2A1A14" emissive="#FF5A12" emissiveIntensity={0.6 + 1.6 * (0.5 + 0.5 * Math.sin(t * 3 + i))} toneMapped={false} />
      </mesh>
    ))}
    <pointLight position={[0, 0.5, 0]} color="#FF6A2A" intensity={6} distance={4} />
  </group>
);
/** A warm old-town street: low buildings both sides, awnings, strings of lights. */
export const OldStreet: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#C9A87A")} receiveShadow><planeGeometry args={[200, 60]} /></mesh>
    {Array.from({ length: 14 }, (_, i) => <Building key={i} x={-30 + i * 5} z={-7} w={4.6} h={5 + rnd(i) * 5} d={3} color={["#D9A880", "#C98A6A", "#E0B890", "#B87A5A"][i % 4]} seed={i} glow={0.3} />)}
    {Array.from({ length: 14 }, (_, i) => <Building key={`b${i}`} x={-30 + i * 5} z={8} w={4.6} h={5 + rnd(i + 30) * 5} d={3} color={["#C98A6A", "#E0B890", "#B87A5A", "#D9A880"][i % 4]} seed={i + 30} glow={0.3} />)}
    {Array.from({ length: 10 }, (_, i) => <mesh key={`a${i}`} position={[-24 + i * 5, 2.4, -5.2]} rotation={[D(70), 0, 0]} material={toon(["#D9472B", "#2E5FD0", "#4E9A4E", "#F2B84B"][i % 4])}><planeGeometry args={[3.6, 1]} /></mesh>)}
    {Array.from({ length: 30 }, (_, i) => <mesh key={`l${i}`} position={[-14 + i, 3.6 - Math.sin((i % 6) / 6 * Math.PI) * 0.4, 0]}><sphereGeometry args={[0.05, 8, 6]} /><meshBasicMaterial color="#FFD27A" toneMapped={false} /></mesh>)}
  </group>
);

// ─── the alarm (pain as a smoke alarm) ───────────────────────────────────────
/** A red alarm bell on a wall; `ripped` 0..1 pulls it off with its wires trailing; `ring` shakes the hammer. */
export const AlarmBell: React.FC<{ t: number; ripped?: number; ring?: number; p?: V3 }> = ({ t, ripped = 0, ring = 0, p = [0, 1.6, -1] }) => {
  const off = ripped * ripped;
  const j = ring > 0 ? Math.sin(t * 70) * 0.01 * ring : 0;
  return (
    <group position={p}>
      <mesh position={[0, 0, -0.02]} material={toon("#E7E2D6")}><planeGeometry args={[6, 4]} /></mesh>
      <Box p={[0, 0, 0.01]} s={[0.36, 0.36, 0.02]} c={ripped > 0.1 ? "#9A9AA4" : "#D9472B"} cast={false} />
      {ripped > 0.05 && [-0.06, 0, 0.06].map((x, i) => {
        const pts = [new THREE.Vector3(x, 0, 0.02), new THREE.Vector3(x * 2 + 0.1 * off, -0.3 * off, 0.3 * off), new THREE.Vector3(0.2 * off, -0.9 * off, 0.8 * off)];
        return <mesh key={i}><tubeGeometry args={[new THREE.CatmullRomCurve3(pts), 16, 0.006, 6, false]} /><meshToonMaterial color={["#D9472B", "#2E5FD0", "#F2B84B"][i]} /></mesh>;
      })}
      <group position={[0.2 * off + j, -0.9 * off, 0.08 + 0.8 * off]} rotation={[D(-70 * off), D(30 * off), D(20 * off)]}>
        <mesh rotation={[Math.PI / 2, 0, 0]} material={toon("#D9472B")} castShadow><cylinderGeometry args={[0.15, 0.15, 0.06, 28]} /></mesh>
        <mesh position={[0, 0, 0.04]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.13, 0.13, 0.02, 24]} /><meshStandardMaterial color="#E85A3A" metalness={0.4} roughness={0.3} /></mesh>
        <mesh position={[0, -0.12, 0.05]} material={toon("#2A2A30")}><sphereGeometry args={[0.025, 10, 8]} /></mesh>
      </group>
    </group>
  );
};
