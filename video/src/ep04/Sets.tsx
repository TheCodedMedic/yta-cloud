// Episode 04 environments: sky + light presets (night, dawn, day, golden, dusk) and sets
// (park with trees, golden plaza, bedroom interior, garage with the time machine, rooftop), plus crowds and umbrellas.
import React, { useMemo } from "react";
import * as THREE from "three";
import { getInputProps } from "remotion";
import { Building } from "../cam3d/World3D";
import { Look3, LOOKS, Person3D, Pose3, STAND, toon } from "../cam3d/Person3D";
import { V3 } from "./Vfx";

const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const D = THREE.MathUtils.degToRad;
/** Shadow map resolution; --props {"shadowRes":1024} to trade sharpness for speed. */
const SHADOW_RES = ((typeof window !== "undefined" ? (getInputProps() as { shadowRes?: number }).shadowRes : undefined) ?? 2048);
export type Mood = "night" | "dawn" | "day" | "golden" | "dusk";

const SKY: Record<Mood, [number, string][]> = {
  night: [[0, "#04060F"], [0.3, "#0B1226"], [0.46, "#1E2A4A"], [0.5, "#2E3A5E"], [0.53, "#121828"], [1, "#080A12"]],
  dawn: [[0, "#1B2A4E"], [0.3, "#4A5A8E"], [0.44, "#C99AB0"], [0.49, "#FFC59A"], [0.53, "#7A6A7E"], [1, "#2A2A3A"]],
  day: [[0, "#3E7FD6"], [0.3, "#6FA8E8"], [0.46, "#B9DAF5"], [0.5, "#E6F1FA"], [0.53, "#9AB0C4"], [1, "#6A7A88"]],
  golden: [[0, "#3A5A9A"], [0.3, "#8A8AB4"], [0.44, "#F2B87A"], [0.49, "#FFD39A"], [0.53, "#9A7A6A"], [1, "#4A3A3A"]],
  dusk: [[0, "#0E1430"], [0.28, "#2A2A5E"], [0.42, "#8A4A7A"], [0.48, "#F07A4A"], [0.52, "#5A3A4A"], [1, "#1A1422"]],
};
const FOG: Record<Mood, [string, number, number]> = { night: ["#0E1424", 16, 120], dawn: ["#8A7A96", 25, 180], day: ["#C9DDEE", 40, 260], golden: ["#D9A880", 30, 220], dusk: ["#4A3050", 20, 160] };
const LIGHT: Record<Mood, { hemi: [string, string, number]; sun: [string, number, V3]; rim: [string, number] }> = {
  night: { hemi: ["#5A6EA8", "#141018", 0.7], sun: ["#8FA8E0", 1.0, [-14, 10, 16]], rim: ["#9FC4FF", 2.2] },
  dawn: { hemi: ["#C8B8E0", "#4A3A40", 1.0], sun: ["#FFC8A0", 1.8, [-20, 6, 14]], rim: ["#AFC8FF", 1.4] },
  day: { hemi: ["#CFE4FF", "#6A5A4A", 1.3], sun: ["#FFF4E0", 2.8, [-10, 22, 14]], rim: ["#DDEBFF", 0.8] },
  golden: { hemi: ["#FFD8B0", "#5A4030", 1.1], sun: ["#FFB870", 3.0, [-24, 7, 12]], rim: ["#FFE0B8", 1.6] },
  dusk: { hemi: ["#8A6AA0", "#2A1A24", 0.9], sun: ["#FF8A5A", 2.0, [-24, 4, 10]], rim: ["#9FB0FF", 1.8] },
};

/** Sky dome + fog + the light rig for a mood. */
export const Env: React.FC<{ mood: Mood; shadowBox?: number; center?: V3 }> = ({ mood, shadowBox = 14, center = [0, 0, 0] }) => {
  const tex = useMemo(() => {
    const c = document.createElement("canvas"); c.width = 4; c.height = 512;
    const g = c.getContext("2d")!; const gr = g.createLinearGradient(0, 0, 0, 512);
    SKY[mood].forEach(([o, col]) => gr.addColorStop(o, col)); g.fillStyle = gr; g.fillRect(0, 0, 4, 512);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }, [mood]);
  const L = LIGHT[mood], f = FOG[mood];
  return (
    <>
      <mesh position={center}><sphereGeometry args={[500, 32, 16]} /><meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} /></mesh>
      <fog attach="fog" args={f} />
      <hemisphereLight args={L.hemi} />
      <directionalLight position={[center[0] + L.sun[2][0], L.sun[2][1], center[2] + L.sun[2][2]]} target-position={center} color={L.sun[0]} intensity={L.sun[1]} castShadow
        shadow-mapSize={[SHADOW_RES, SHADOW_RES]} shadow-camera-left={-shadowBox} shadow-camera-right={shadowBox} shadow-camera-top={shadowBox} shadow-camera-bottom={-shadowBox} shadow-camera-near={1} shadow-camera-far={80} shadow-bias={-0.0004} shadow-normalBias={0.02} />
      <directionalLight position={[center[0] + 6, 6, center[2] - 16]} color={L.rim[0]} intensity={L.rim[1]} />
    </>
  );
};

// ─── props ───────────────────────────────────────────────────────────────────
export const TreeA: React.FC<{ p: V3; s?: number; col?: string }> = ({ p, s = 1, col = "#3E6A46" }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.9, 0]} material={toon("#4A3424")} castShadow><cylinderGeometry args={[0.09, 0.14, 1.8, 8]} /></mesh>
    <mesh position={[0, 2.3, 0]} material={toon(col)} castShadow><sphereGeometry args={[0.95, 14, 10]} /></mesh>
    <mesh position={[0.45, 2.75, 0.25]} material={toon(col)} castShadow><sphereGeometry args={[0.6, 12, 8]} /></mesh>
    <mesh position={[-0.4, 2.65, -0.2]} material={toon(col)} castShadow><sphereGeometry args={[0.55, 12, 8]} /></mesh>
  </group>
);
export const Pine: React.FC<{ p: V3; s?: number }> = ({ p, s = 1 }) => (
  <group position={p} scale={s}>
    <mesh position={[0, 0.5, 0]} material={toon("#4A3424")}><cylinderGeometry args={[0.08, 0.1, 1, 6]} /></mesh>
    {[0, 1, 2].map((k) => <mesh key={k} position={[0, 1.2 + k * 0.6, 0]} material={toon("#2E5A3E")} castShadow><coneGeometry args={[0.9 - k * 0.22, 1.1, 10]} /></mesh>)}
  </group>
);
export const Bench: React.FC<{ p: V3; ry?: number }> = ({ p, ry = 0 }) => (
  <group position={p} rotation={[0, ry, 0]}>
    <mesh position={[0, 0.45, 0]} material={toon("#7A5A3E")} castShadow><boxGeometry args={[1.6, 0.06, 0.45]} /></mesh>
    <mesh position={[0, 0.75, -0.2]} material={toon("#7A5A3E")} castShadow><boxGeometry args={[1.6, 0.4, 0.05]} /></mesh>
    {[-0.7, 0.7].map((x) => <mesh key={x} position={[x, 0.22, 0]} material={toon("#22263A")}><boxGeometry args={[0.06, 0.45, 0.4]} /></mesh>)}
  </group>
);
export const Umbrella: React.FC<{ p: V3; col?: string; tilt?: number }> = ({ p, col = "#1B2A4E", tilt = 0.1 }) => (
  <group position={p} rotation={[tilt, 0, tilt * 0.5]}>
    <mesh material={toon(col)} position={[0, 0, 0]} castShadow><sphereGeometry args={[0.62, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2.6]} /></mesh>
    <mesh material={toon("#222")} position={[0, -0.45, 0]}><cylinderGeometry args={[0.012, 0.012, 0.95, 6]} /></mesh>
  </group>
);

// ─── crowds ──────────────────────────────────────────────────────────────────
const EXTRA_LOOKS = ["ex1", "ex2", "ex3", "ex4", "ex5", "ex6", "ex7", "ex8"];
export type Extra = { pos: V3; yaw: number; look: string; pose: Pose3; umbrella?: string };
/** A seeded set of pedestrians along a line. */
export const makeCrowd = (seed: number, n: number, x0: number, x1: number, z0: number, z1: number, umbrellas = false): Extra[] =>
  Array.from({ length: n }, (_, i) => ({
    pos: [x0 + (x1 - x0) * rnd(seed + i), 0, z0 + (z1 - z0) * rnd(seed + i + 50)] as V3,
    yaw: rnd(seed + i + 9) > 0.5 ? Math.PI / 2 : -Math.PI / 2,
    look: EXTRA_LOOKS[Math.floor(rnd(seed + i + 77) * EXTRA_LOOKS.length)],
    pose: { ...STAND, armR: umbrellas ? [55, 8, 95] as [number, number, number] : [6, 8, 14] as [number, number, number], legL: [14 * (rnd(seed + i + 3) - 0.5) * 2, 8], legR: [-10, 4] },
    umbrella: umbrellas && rnd(seed + i + 31) > 0.25 ? ["#1B2A4E", "#D9472B", "#2E2E36", "#F2B84B", "#4E7A4A"][i % 5] : undefined,
  }));
/** walk(t): pose override for walkers (null = frozen pose). */
export const Crowd: React.FC<{ list: Extra[]; walk?: (i: number) => { dx: number; pose: Pose3 } | null }> = ({ list, walk }) => (
  <>
    {list.map((e, i) => {
      const w = walk?.(i);
      const pos: V3 = [e.pos[0] + (w?.dx ?? 0) * Math.sin(e.yaw), 0, e.pos[2]];
      return (
        <group key={i}>
          <Person3D pos={pos} yaw={e.yaw} look={(LOOKS as Record<string, Look3>)[e.look]} pose={w?.pose ?? e.pose} face={{ smile: rnd(i) * 0.6, blink: false }} />
          {e.umbrella && <Umbrella p={[pos[0] + Math.sin(e.yaw) * 0.12, 2.15, pos[2] + Math.cos(e.yaw) * 0.12]} col={e.umbrella} />}
        </group>
      );
    })}
  </>
);

// ─── sets ────────────────────────────────────────────────────────────────────
/** Park: grass, a path along x, trees, benches, lamps, a city skyline behind. */
export const Park: React.FC<{ x0?: number }> = ({ x0 = 0 }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x0, 0, 0]} material={toon("#5E8A4E")} receiveShadow><planeGeometry args={[600, 300]} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[x0, 0.005, 0.2]} material={toon("#C9B48A")} receiveShadow><planeGeometry args={[600, 2.2]} /></mesh>
    {Array.from({ length: 60 }, (_, i) => {
      const x = x0 - 150 + i * 5 + rnd(i) * 3, z = i % 2 ? -2.5 - rnd(i + 3) * 6 : 7 + rnd(i + 5) * 7;
      return rnd(i + 9) > 0.35 ? <TreeA key={i} p={[x, 0, z]} s={0.9 + rnd(i + 2) * 0.6} col={["#3E6A46", "#4E7A3E", "#5A8A4A", "#2E5A3E"][i % 4]} /> : <Pine key={i} p={[x, 0, z]} s={1 + rnd(i + 4) * 0.5} />;
    })}
    {Array.from({ length: 12 }, (_, i) => <Bench key={i} p={[x0 - 60 + i * 11, 0, -1.4]} />)}
    {Array.from({ length: 30 }, (_, i) => <Building key={i} x={x0 - 150 + i * 10} z={-70} w={8} h={14 + rnd(i + 40) * 30} d={6} color={["#7A86A8", "#8A90A8", "#6A7898"][i % 3]} seed={i} />)}
  </group>
);

/** Golden-hour plaza: paving, a fountain, trees in planters, warm buildings around. */
export const Plaza: React.FC<{ rewrite?: (i: number) => { k: number; flash: number } }> = ({ rewrite }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#B49A80")} receiveShadow><planeGeometry args={[300, 300]} /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]} material={toon("#A08670")}><ringGeometry args={[3, 3.4, 48]} /></mesh>
    <group position={[0, 0, -4]}>
      <mesh position={[0, 0.3, 0]} material={toon("#8A8A94")} castShadow><cylinderGeometry args={[2, 2.1, 0.6, 32]} /></mesh>
      <mesh position={[0, 0.58, 0]}><cylinderGeometry args={[1.85, 1.85, 0.05, 32]} /><meshStandardMaterial color="#5A8AC0" roughness={0.1} metalness={0.3} /></mesh>
      <mesh position={[0, 1.2, 0]} material={toon("#8A8A94")}><cylinderGeometry args={[0.18, 0.25, 1.4, 12]} /></mesh>
    </group>
    {[[-6, -2], [6, -2], [-6, 5], [6, 5]].map(([x, z], i) => <group key={i}><mesh position={[x, 0.3, z]} material={toon("#6A5A4A")}><boxGeometry args={[1.4, 0.6, 1.4]} /></mesh><TreeA p={[x, 0.6, z]} s={0.8} col="#5A8A3E" /></group>)}
    {Array.from({ length: 14 }, (_, i) => {
      const a = (i / 14) * Math.PI * 2, r = 22, rw = rewrite?.(i);
      return <group key={i} position={[Math.sin(a) * r, 0, Math.cos(a) * r - 4]} rotation={[0, a + Math.PI, 0]}><Building x={0} z={0} w={8} h={(10 + rnd(i) * 14) * (rw?.k ?? 1)} d={6} color={["#C98A6A", "#D9A880", "#B87A5A", "#E0B890"][i % 4]} seed={i + 9} flash={rw?.flash} /></group>;
    })}
  </group>
);

/** Bedroom interior (room 5 × 3 × 5, open on the +z side for the camera). windowMood sets the sky seen outside. */
export const Bedroom: React.FC<{ windowMood: Mood }> = ({ windowMood }) => {
  const sky = { night: "#16224A", dawn: "#E8A890", day: "#9CC8F0", golden: "#F2B87A", dusk: "#C06A6A" }[windowMood];
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#8A6A4E")} receiveShadow><planeGeometry args={[5, 5]} /></mesh>
      <mesh position={[0, 1.5, -2.5]} material={toon("#4A5A7A")} receiveShadow><planeGeometry args={[5, 3]} /></mesh>
      <mesh position={[-2.5, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#55658A")} receiveShadow><planeGeometry args={[5, 3]} /></mesh>
      <mesh position={[2.5, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#55658A")} receiveShadow><planeGeometry args={[5, 3]} /></mesh>
      <mesh position={[0, 3, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#E0DCD0")}><planeGeometry args={[5, 5]} /></mesh>
      {/* window with the sky outside */}
      <mesh position={[0.6, 1.65, -2.49]}><planeGeometry args={[1.5, 1.2]} /><meshBasicMaterial color={sky} toneMapped={false} /></mesh>
      <mesh position={[0.6, 1.65, -2.48]} material={toon("#E8E4DA")}><boxGeometry args={[1.6, 0.06, 0.03]} /></mesh>
      <mesh position={[0.6, 1.65, -2.48]} material={toon("#E8E4DA")}><boxGeometry args={[0.06, 1.3, 0.03]} /></mesh>
      <pointLight position={[0.6, 1.7, -1.6]} color={sky} intensity={windowMood === "night" ? 1.5 : 5} distance={6} />
      {/* bed */}
      <group position={[-1.4, 0, -1.3]}>
        <mesh position={[0, 0.25, 0]} material={toon("#3A2A22")} castShadow><boxGeometry args={[1.4, 0.5, 2.1]} /></mesh>
        <mesh position={[0, 0.55, 0.1]} material={toon("#E9E2D0")} castShadow><boxGeometry args={[1.36, 0.14, 1.8]} /></mesh>
        <mesh position={[0, 0.6, 0.35]} material={toon("#D9472B")}><boxGeometry args={[1.38, 0.1, 1.2]} /></mesh>
        <mesh position={[0, 0.7, -0.75]} material={toon("#F6F1E6")}><boxGeometry args={[0.8, 0.14, 0.4]} /></mesh>
      </group>
      {/* desk, lamp, poster, rug */}
      <group position={[1.6, 0, -1.9]}>
        <mesh position={[0, 0.75, 0]} material={toon("#6A4E3A")} castShadow><boxGeometry args={[1.4, 0.06, 0.6]} /></mesh>
        {[-0.65, 0.65].map((x) => <mesh key={x} position={[x, 0.37, 0]} material={toon("#4A3424")}><boxGeometry args={[0.05, 0.74, 0.55]} /></mesh>)}
        <mesh position={[0.4, 0.95, 0]}><sphereGeometry args={[0.1, 12, 8]} /><meshStandardMaterial color="#FFE2A8" emissive="#FFC877" emissiveIntensity={2} /></mesh>
        <pointLight position={[0.4, 1.1, 0.2]} color="#FFC877" intensity={2.5} distance={4} />
      </group>
      <mesh position={[-2.48, 1.7, -0.4]} rotation={[0, Math.PI / 2, 0]}><planeGeometry args={[0.7, 1.0]} /><meshBasicMaterial color="#F2B84B" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.3, 0.006, 0.3]} material={toon("#2E5FD0")}><circleGeometry args={[1.1, 32]} /></mesh>
    </group>
  );
};

/** Garage / workshop with a time-machine pod (the one we don't use). glow 0..1 lights the rings. */
export const Garage: React.FC<{ glow: number; t: number }> = ({ glow, t }) => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#4A4A52")} receiveShadow><planeGeometry args={[14, 14]} /></mesh>
    <mesh position={[0, 3, -5]} material={toon("#3A3A44")}><planeGeometry args={[14, 6]} /></mesh>
    <mesh position={[-6, 3, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#34343E")}><planeGeometry args={[14, 6]} /></mesh>
    <mesh position={[6, 3, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#34343E")}><planeGeometry args={[14, 6]} /></mesh>
    {/* the pod */}
    <group position={[0, 0, -1.5]}>
      <mesh position={[0, 0.15, 0]} material={toon("#2A2A30")} castShadow><cylinderGeometry args={[1.5, 1.6, 0.3, 40]} /></mesh>
      <mesh position={[0, 1.4, 0]} castShadow><sphereGeometry args={[1.1, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.62]} /><meshPhysicalMaterial color="#9FC4E0" roughness={0.1} transmission={0} transparent opacity={0.45} /></mesh>
      <mesh position={[0, 1.1, 0]} material={toon("#5A5E6E")}><cylinderGeometry args={[1.1, 1.2, 1.0, 40, 1, true]} /></mesh>
      {[0.5, 0.9, 1.3].map((y, k) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, t * (k % 2 ? 1.5 : -1.2)]}>
          <torusGeometry args={[1.25 + k * 0.08, 0.035, 8, 48]} />
          <meshStandardMaterial color="#7FC8FF" emissive="#7FC8FF" emissiveIntensity={0.3 + 3 * glow} toneMapped={false} />
        </mesh>
      ))}
      <pointLight position={[0, 1.4, 1]} color="#7FC8FF" intensity={1 + 8 * glow} distance={8} />
    </group>
    {/* workbench and hanging bulb */}
    <mesh position={[-3.8, 0.9, -3.6]} material={toon("#6A4E3A")} castShadow><boxGeometry args={[3, 0.1, 1]} /></mesh>
    <mesh position={[-3.8, 0.45, -3.6]} material={toon("#4A3424")}><boxGeometry args={[2.8, 0.9, 0.9]} /></mesh>
    <mesh position={[1.5, 4.2, 0.5]}><sphereGeometry args={[0.12, 12, 8]} /><meshStandardMaterial color="#FFE2A8" emissive="#FFC877" emissiveIntensity={2.5} /></mesh>
    <pointLight position={[1.5, 4.0, 0.5]} color="#FFC877" intensity={6} distance={10} castShadow />
    <ambientLight intensity={0.25} />
  </group>
);

/** Rooftop: roof surface, parapets, a water tank and AC units, the city all around below. */
export const Rooftop: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} material={toon("#5A5560")} receiveShadow><planeGeometry args={[16, 12]} /></mesh>
    {[[0, -6, 16, 0], [0, 6, 16, 0], [-8, 0, 12, 1], [8, 0, 12, 1]].map(([x, z, w, rot], i) => (
      <mesh key={i} position={[x, 0.45, z]} rotation={[0, rot ? Math.PI / 2 : 0, 0]} material={toon("#6A6570")} castShadow><boxGeometry args={[w, 0.9, 0.3]} /></mesh>
    ))}
    <group position={[-5, 0, -4]}>
      <mesh position={[0, 2.6, 0]} material={toon("#7A5A3E")} castShadow><cylinderGeometry args={[1, 1, 1.8, 20]} /></mesh>
      <mesh position={[0, 3.7, 0]} material={toon("#5A3E2A")}><coneGeometry args={[1.1, 0.5, 20]} /></mesh>
      {[[-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6]].map(([x, z], k) => <mesh key={k} position={[x, 0.85, z]} material={toon("#3A3A44")}><boxGeometry args={[0.08, 1.7, 0.08]} /></mesh>)}
    </group>
    {[[4, -4], [5.5, -4]].map(([x, z], i) => <mesh key={i} position={[x, 0.45, z]} material={toon("#8A8A94")} castShadow><boxGeometry args={[1.2, 0.9, 1]} /></mesh>)}
    <group position={[0, -30, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#2A2A34")}><planeGeometry args={[600, 600]} /></mesh>
      {Array.from({ length: 70 }, (_, i) => {
        const a = rnd(i) * Math.PI * 2, r = 22 + rnd(i + 1) * 70;
        return <Building key={i} x={Math.sin(a) * r} z={Math.cos(a) * r} w={6 + rnd(i + 2) * 8} h={14 + rnd(i + 3) * 42} d={6 + rnd(i + 4) * 6} color={["#4A4466", "#5A4E68", "#3E4A66", "#6A5A62"][i % 4]} seed={i} />;
      })}
    </group>
  </group>
);
