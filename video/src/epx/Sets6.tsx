// Episode 06 sets and props: the number 42 bus (interior, city sliding past the windows), the garden with the patio,
// the café counter, the interview room, the launderette street, a theatre spotlight, the white bear, books and cards.
import React, { useMemo } from "react";
import * as THREE from "three";
import { Look3, Person3D, Pose3, toon } from "../cam3d/Person3D";
import { Chair, sitOn } from "../cam3d/Props3D";
import { Building, World3D } from "../cam3d/World3D";
import { Env, Mood, TreeA, Pine, Bench } from "../ep04/Sets";
import { Framed } from "../ep04/Sets3";
import { V3 } from "../ep04/Vfx";
import { Box, Glow, tex } from "./Sets5";

const D = THREE.MathUtils.degToRad;
const rnd = (s: number) => { const x = Math.sin(s * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ─── the bus ─────────────────────────────────────────────────────────────────
/** Bus interior along x (driving +x), floor y 0, walls z ±1.25, roof 2.3. Rows of forward-facing seats every 1.1 m from x −5.
 *  Seat (row r, place p): p 0 = window left (z −0.95), 1 = aisle left (z −0.5), 2 = aisle right (z 0.5), 3 = window right (z 0.95). */
export const seatPos = (r: number, p: number): V3 => [-5 + r * 1.1, 0, [-0.95, -0.5, 0.5, 0.95][p]];
export const BUS_SIT = sitOn(0.45, { armL: [30, 8, 50], armR: [30, 8, 50] });
export const BusInterior: React.FC<{ t: number; mood?: Mood; speed?: number }> = ({ t, mood = "day", speed = 6 }) => {
  const off = -((t * speed) % 120);
  return (
    <>
      <Env mood={mood} />
      <group position={[off, -0.75, -4.8]}><World3D bare lamps={false} nearTrees glow={0.4} /></group>
      <group position={[off + 120, -0.75, -4.8]}><World3D bare lamps={false} nearTrees={false} cafe={false} glow={0.4} /></group>
      {/* floor, aisle strip, roof, front and back walls */}
      <Box p={[0, -0.05, 0]} s={[12, 0.1, 2.5]} c="#3A3F52" cast={false} />
      <Box p={[0, 0.002, 0]} s={[12, 0.01, 0.55]} c="#E8C24A" cast={false} />
      <Box p={[0, 2.35, 0]} s={[12, 0.1, 2.5]} c="#E9ECF4" cast={false} />
      {[-6, 6].map((x) => <Box key={x} p={[x, 1.15, 0]} s={[0.1, 2.3, 2.5]} c="#2E5FD0" cast={false} />)}
      {/* side walls: lower panel, upper strip, window posts (open windows show the street) */}
      {[-1.25, 1.25].map((z) => (
        <group key={z}>
          <Box p={[0, 0.45, z]} s={[12, 0.9, 0.08]} c="#2E5FD0" cast={false} />
          <Box p={[0, 2.12, z]} s={[12, 0.36, 0.08]} c="#2E5FD0" cast={false} />
          {Array.from({ length: 12 }, (_, i) => <Box key={i} p={[-5.5 + i, 1.45, z]} s={[0.08, 1.0, 0.1]} c="#22263A" cast={false} />)}
          <Box p={[0, 0.92, z * 0.97]} s={[12, 0.05, 0.1]} c="#C9CCD6" cast={false} />
        </group>
      ))}
      {/* grab poles and the ceiling rail, bell buttons, stop sign */}
      {[-4.4, -2.2, 0, 2.2, 4.4].map((x) => <mesh key={x} position={[x, 1.15, 0.3]} material={toon("#F2B84B")}><cylinderGeometry args={[0.022, 0.022, 2.3, 10]} /></mesh>)}
      {[-0.32, 0.32].map((z) => <mesh key={z} position={[0, 2.12, z]} rotation={[0, 0, Math.PI / 2]} material={toon("#C9CCD6")}><cylinderGeometry args={[0.018, 0.018, 12, 8]} /></mesh>)}
      <group position={[5.94, 1.9, 0]}><Box p={[0, 0, 0]} s={[0.02, 0.24, 1.2]} c="#0B1226" cast={false} /><Glow p={[-0.01, 0, 0]} s={[0.01, 0.14, 1.0]} c="#FF8A3A" i={1.6} /></group>
      {/* seats */}
      {Array.from({ length: 10 }, (_, r) => [0, 1, 2, 3].map((p) => {
        const [x, , z] = seatPos(r, p);
        return (
          <group key={`${r}${p}`} position={[x, 0, z]}>
            <Box p={[0, 0.42, 0]} s={[0.46, 0.08, 0.42]} c="#B8432F" />
            <Box p={[-0.24, 0.72, 0]} s={[0.07, 0.6, 0.42]} c="#B8432F" r={[0, 0, D(-8)]} />
            <Box p={[-0.26, 1.06, 0]} s={[0.05, 0.08, 0.42]} c="#E8C24A" cast={false} />
            <Box p={[0, 0.2, 0]} s={[0.06, 0.4, 0.06]} c="#22263A" cast={false} />
          </group>
        );
      }))}
      {Array.from({ length: 5 }, (_, i) => <Glow key={i} p={[-4.8 + i * 2.4, 2.29, 0]} s={[1.2, 0.02, 0.18]} c="#F4FAFF" i={1.2} />)}
      <pointLight position={[0, 2.1, 0]} intensity={4} distance={10} color="#FFF4E0" />
      <ambientLight intensity={0.45} />
    </>
  );
};
/** A seated passenger at seat (r, p); `turn` 0..1 swivels them round to stare backwards at `tx` (x of the hero). */
export const Passenger: React.FC<{ r: number; p: number; look: Look3; turn?: number; pose?: Pose3; face?: object; tx?: number }> = ({ r, p, look, turn = 0, pose, face = {}, tx = -100 }) => {
  const pos = seatPos(r, p);
  const back = pos[0] > tx ? 1 : 0; // only people in front of the hero turn round
  const side = pos[2] < 0 ? -1 : 1;
  const yaw = Math.PI / 2 + side * back * turn * 2.3;
  return <Person3D pos={pos} yaw={yaw} look={look} pose={{ ...(pose ?? BUS_SIT), headTurn: -side * back * turn * 25 }} face={{ smile: 0.2, ...face }} />;
};
/** A wig, slightly to the left, on a head centred at p. */
export const Wig: React.FC<{ p: V3; yaw?: number; off?: number }> = ({ p, yaw = 0, off = 1 }) => (
  <group position={p} rotation={[0, yaw, D(14 * off)]}>
    <mesh material={toon("#8A5A2A")} position={[0.04 * off, 0.07, -0.02]} scale={[1.1, 0.72, 1.12]}><sphereGeometry args={[0.23, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
    <mesh material={toon("#7A4A22")} position={[0.04 * off, 0.06, -0.12]} scale={[1.05, 0.9, 0.6]}><sphereGeometry args={[0.24, 20, 12]} /></mesh>
  </group>
);

// ─── books, cards ────────────────────────────────────────────────────────────
/** An open book lying on the palm (use with PHONE_LOOK and the cradle hand), or closed (open = 0). */
export const HeldBook: React.FC<{ open?: number; col?: string }> = ({ open = 1, col = "#2E7A6A" }) => (
  <group position={[0, -0.06, 0.035]}>
    <group rotation={[0, -D(80 * open), 0]} position={[0, 0, 0]}><Box p={[-0.085, 0, 0]} s={[0.17, 0.23, 0.012]} c={col} cast={false} /><Box p={[-0.085, 0, 0.008]} s={[0.16, 0.22, 0.006]} c="#F6F1E6" cast={false} /></group>
    <Box p={[0.085, 0, 0]} s={[0.17, 0.23, 0.012]} c={col} cast={false} /><Box p={[0.085, 0, 0.008]} s={[0.16, 0.22, 0.006]} c="#F6F1E6" cast={false} />
  </group>
);
/** Playing cards fanned in the hand. */
export const HeldCards: React.FC = () => (
  <group position={[0, -0.05, 0.03]}>{[-2, -1, 0, 1, 2].map((k) => <group key={k} rotation={[0, 0, D(k * 9)]}><Box p={[0, -0.05, k * 0.002]} s={[0.06, 0.09, 0.002]} c="#F6F6F4" cast={false} /></group>)}</group>
);
export const Chips: React.FC<{ p: V3; n?: number }> = ({ p, n = 8 }) => (
  <group position={p}>{Array.from({ length: n }, (_, i) => <mesh key={i} position={[(i % 3) * 0.06, Math.floor(i / 3) * 0.012, 0]} material={toon(["#D9472B", "#2E5FD0", "#F6F1E6"][i % 3])}><cylinderGeometry args={[0.025, 0.025, 0.01, 14]} /></mesh>)}</group>
);

// ─── garden ──────────────────────────────────────────────────────────────────
/** Back garden along −x: the house and patio at x 0, the lawn running 12 m to a shed and the back fence at x −12. */
export const Garden: React.FC<{ mood?: Mood }> = ({ mood = "golden" }) => (
  <>
    <Env mood={mood} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#5E8A4E")} receiveShadow><planeGeometry args={[60, 40]} /></mesh>
    {Array.from({ length: 12 }, (_, i) => <Box key={i} p={[0.9 + (i % 3) * 0.62 - 0.6, 0.02, -1.6 + Math.floor(i / 3) * 0.82]} s={[0.58, 0.04, 0.78]} c={i % 2 ? "#C9B8A0" : "#B8A890"} cast={false} />)}
    {/* the house wall with door, window and a light */}
    <Box p={[2.3, 1.8, 0]} s={[0.3, 3.6, 8]} c="#C98A6A" />
    <Box p={[2.14, 1.05, 0.9]} s={[0.04, 2.1, 0.9]} c="#2A3450" cast={false} />
    <mesh position={[2.13, 1.7, -1.6]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[1.2, 1.0]} /><meshStandardMaterial color="#FFE2A8" emissive="#FFC877" emissiveIntensity={0.5} /></mesh>
    {/* patio table and chairs */}
    <group position={[0.6, 0, -0.6]}><mesh position={[0, 0.72, 0]} material={toon("#F6F1E6")}><cylinderGeometry args={[0.45, 0.45, 0.04, 24]} /></mesh><Box p={[0, 0.36, 0]} s={[0.06, 0.72, 0.06]} c="#9AA0AC" /></group>
    <Chair p={[0.6, 0, 0.3]} yaw={Math.PI} col="#F6F1E6" />
    {/* fences, shed, trees, washing line, flower beds */}
    {[-4, 4].map((z) => <group key={z}>{Array.from({ length: 30 }, (_, i) => <Box key={i} p={[1.5 - i * 0.5, 0.75, z]} s={[0.46, 1.5, 0.05]} c={i % 2 ? "#8A6A4E" : "#7A5A3E"} cast={false} />)}</group>)}
    {Array.from({ length: 16 }, (_, i) => <Box key={`b${i}`} p={[-13, 0.75, -3.75 + i * 0.5]} s={[0.05, 1.5, 0.46]} c={i % 2 ? "#8A6A4E" : "#7A5A3E"} cast={false} />)}
    <group position={[-11.5, 0, 2.6]}><Box p={[0, 1.0, 0]} s={[1.6, 2.0, 1.4]} c="#6A8A6A" /><Box p={[0, 2.15, 0]} s={[1.8, 0.12, 1.6]} c="#3A3A44" r={[D(8), 0, 0]} /><Box p={[0.81, 0.9, 0]} s={[0.02, 1.7, 0.7]} c="#4A6A4A" cast={false} /></group>
    <TreeA p={[-8, 0, -3]} s={1.2} col="#4E7A3E" /><TreeA p={[-3.5, 0, 3.2]} s={0.9} col="#5A8A4A" /><Pine p={[-12, 0, -2.6]} s={1.3} />
    <mesh position={[-5, 1.7, 0]} rotation={[0, 0, Math.PI / 2]} material={toon("#DDDDDD")}><cylinderGeometry args={[0.005, 0.005, 6, 6]} /></mesh>
    {[-6.5, -5.6, -4.4, -3.4].map((x, i) => <Box key={x} p={[x, 1.45, 0]} s={[0.45, 0.5, 0.02]} c={["#E87AA8", "#F6F1E6", "#2E5FD0", "#F2B84B"][i]} cast={false} />)}
    {Array.from({ length: 20 }, (_, i) => <mesh key={`f${i}`} position={[-1 - i * 0.55, 0.12, -3.6]} material={toon(["#D9472B", "#F2B84B", "#E87AA8", "#F6F1E6"][i % 4])}><sphereGeometry args={[0.1, 10, 8]} /></mesh>)}
    {[-10, -12].map((x) => <Building key={x} x={x - 6} z={-12} w={8} h={9} d={6} color="#B87A5A" seed={x + 40} glow={0.3} />)}
  </>
);

// ─── café counter ────────────────────────────────────────────────────────────
export const CafeInterior: React.FC = () => {
  const menu = useMemo(() => tex(512, 256, (g) => { g.fillStyle = "#1E2A24"; g.fillRect(0, 0, 512, 256); g.fillStyle = "#F6F1E6"; g.font = "800 34px 'Plus Jakarta Sans'"; ["FLAT WHITE  3.20", "LATTE  3.40", "TEA  2.10", "TOASTIE  4.80"].forEach((l, i) => g.fillText(l, 30, 60 + i * 52)); }), []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#8A6A4E")} receiveShadow><planeGeometry args={[10, 8]} /></mesh>
      <mesh position={[0, 1.6, -3]} material={toon("#E7D9C4")}><planeGeometry args={[10, 3.2]} /></mesh>
      <mesh position={[-5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#D9C8B0")}><planeGeometry args={[8, 3.2]} /></mesh>
      <mesh position={[5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} material={toon("#D9C8B0")}><planeGeometry args={[8, 3.2]} /></mesh>
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F0EAE0")}><planeGeometry args={[10, 8]} /></mesh>
      {/* counter, espresso machine, cups, cake stand, menu board, pendant lamps */}
      <Box p={[0, 0.5, -1.2]} s={[4, 1.0, 0.7]} c="#2E5A4E" /><Box p={[0, 1.02, -1.2]} s={[4.1, 0.05, 0.8]} c="#E9E2D0" />
      <group position={[-1.0, 1.05, -1.35]}><Box p={[0, 0.22, 0]} s={[0.7, 0.44, 0.45]} c="#C9CCD6" /><Box p={[0, 0.48, 0]} s={[0.72, 0.06, 0.47]} c="#9AA0AC" />{[-0.15, 0.15].map((x) => <Box key={x} p={[x, 0.12, 0.25]} s={[0.06, 0.08, 0.06]} c="#2A2A30" cast={false} />)}</group>
      {Array.from({ length: 6 }, (_, i) => <mesh key={i} position={[0.2 + i * 0.16, 1.1, -1.35]} material={toon("#F6F1E6")}><cylinderGeometry args={[0.045, 0.035, 0.1, 12]} /></mesh>)}
      <group position={[1.4, 1.05, -1.2]}><mesh material={toon("#E9ECF4")}><cylinderGeometry args={[0.2, 0.2, 0.02, 20]} /></mesh><mesh position={[0, 0.08, 0]} material={toon("#C98A5A")}><cylinderGeometry args={[0.14, 0.14, 0.14, 20]} /></mesh></group>
      <mesh position={[0, 2.3, -2.98]}><planeGeometry args={[2.4, 1.2]} /><meshBasicMaterial map={menu} /></mesh>
      <Box p={[-2.6, 1.5, -2.95]} s={[0.9, 1.2, 0.05]} c="#6A4E3A" /><Framed kind="mountains" p={[2.6, 1.8, -2.97]} w={0.9} />
      {[-1.2, 0, 1.2].map((x) => <group key={x}><mesh position={[x, 2.75, -1.0]} material={toon("#2A3450")}><coneGeometry args={[0.18, 0.18, 16, 1, true]} /></mesh><Glow p={[x, 2.68, -1.0]} s={[0.1, 0.04, 0.1]} c="#FFE2A8" i={2} /><pointLight position={[x, 2.5, -1.0]} intensity={2.5} distance={4} color="#FFD9A0" /></group>)}
      {/* tables by the window */}
      {[[-3, 1.8], [-1, 2.2], [2.6, 1.9]].map(([x, z], i) => <group key={i} position={[x, 0, z]}><mesh position={[0, 0.74, 0]} material={toon("#6A4E3A")}><cylinderGeometry args={[0.4, 0.4, 0.04, 20]} /></mesh><Box p={[0, 0.37, 0]} s={[0.05, 0.74, 0.05]} c="#2A2A30" /></group>)}
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 4, 4]} intensity={1.2} castShadow />
    </>
  );
};

// ─── interview room ──────────────────────────────────────────────────────────
/** A glass-walled meeting room: long table along x at z 0 (top 0.76). Panel chairs at z −0.75 facing +z; the candidate's chair at z +0.95 facing −z. */
export const PANEL: V3[] = [[-0.9, 0, -0.78], [0, 0, -0.78], [0.9, 0, -0.78]];
export const CAND: V3 = [0, 0, 0.95];
export const InterviewRoom: React.FC<{ night?: boolean }> = () => (
  <>
    <mesh rotation={[-Math.PI / 2, 0, 0]} material={toon("#9AA0AC")} receiveShadow><planeGeometry args={[9, 8]} /></mesh>
    <mesh position={[0, 1.6, -3]} material={toon("#E9ECF0")}><planeGeometry args={[9, 3.2]} /></mesh>
    <mesh position={[-4.5, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} material={toon("#DCE0E6")}><planeGeometry args={[8, 3.2]} /></mesh>
    <mesh position={[4.5, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}><planeGeometry args={[8, 3.2]} /><meshStandardMaterial color="#9FC8E8" transparent opacity={0.35} /></mesh>
    <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]} material={toon("#F4F6F8")}><planeGeometry args={[9, 8]} /></mesh>
    {/* city window wall behind the panel */}
    <mesh position={[0, 1.7, -2.98]}><planeGeometry args={[6, 2.0]} /><meshBasicMaterial color="#BFE0FF" toneMapped={false} /></mesh>
    {Array.from({ length: 7 }, (_, i) => <Box key={i} p={[-3 + i, 1.7, -2.95]} s={[0.05, 2.0, 0.05]} c="#5A5E6E" cast={false} />)}
    {Array.from({ length: 8 }, (_, i) => <Box key={`s${i}`} p={[-2.8 + i * 0.8, 1.0 + rnd(i) * 0.6, -3.5]} s={[0.7, 2 + rnd(i) * 1.2, 0.1]} c={["#7A86A8", "#8A90A8", "#6A7898"][i % 3]} cast={false} />)}
    {/* the table, glasses of water, a jug, papers, a pen; the chairs; a plant */}
    <Box p={[0, 0.74, 0]} s={[3.2, 0.06, 1.1]} c="#F4F4F2" /><Box p={[-1.4, 0.37, 0]} s={[0.08, 0.72, 0.9]} c="#5A5E6E" /><Box p={[1.4, 0.37, 0]} s={[0.08, 0.72, 0.9]} c="#5A5E6E" />
    {PANEL.map(([x, , z], i) => <group key={i}><Chair p={[x, 0, z - 0.05]} yaw={0} col="#2A3450" /><Box p={[x, 0.78, z + 0.38]} s={[0.21, 0.004, 0.3]} c="#F6F6F4" cast={false} /><mesh position={[x + 0.25, 0.83, z + 0.3]}><cylinderGeometry args={[0.035, 0.03, 0.1, 12]} /><meshStandardMaterial color="#CFE6FF" transparent opacity={0.6} /></mesh></group>)}
    <Chair p={[CAND[0], 0, CAND[2] + 0.05]} yaw={Math.PI} col="#2A3450" />
    <mesh position={[0.4, 0.85, 0.15]}><cylinderGeometry args={[0.07, 0.06, 0.2, 14]} /><meshStandardMaterial color="#CFE6FF" transparent opacity={0.5} /></mesh>
    <group position={[-3.6, 0, -2.4]}><mesh position={[0, 0.25, 0]} material={toon("#B8643A")}><cylinderGeometry args={[0.22, 0.18, 0.5, 14]} /></mesh><mesh position={[0, 0.9, 0]} material={toon("#4E8A4E")}><sphereGeometry args={[0.45, 14, 10]} /></mesh></group>
    {[-1.5, 1.5].map((x) => <Glow key={x} p={[x, 3.17, 0]} s={[1.4, 0.04, 0.4]} c="#F4FAFF" i={1.3} />)}
    <pointLight position={[0, 2.8, 0.5]} intensity={7} distance={10} color="#F4FAFF" castShadow />
    <ambientLight intensity={0.6} />
  </>
);

// ─── the launderette street (night), the flat window above ───────────────────
export const Launderette: React.FC<{ t: number; window?: boolean }> = ({ t, window = true }) => {
  const sign = useMemo(() => tex(512, 128, (g) => { g.fillStyle = "#0B1226"; g.fillRect(0, 0, 512, 128); g.fillStyle = "#7FE0FF"; g.font = "800 62px 'Plus Jakarta Sans'"; g.textAlign = "center"; g.fillText("LAUNDERETTE", 256, 86); }), []);
  return (
    <group position={[2.4, 0, -3.3]}>
      <Box p={[0, 3, -0.4]} s={[5, 6, 0.8]} c="#5A4E68" />
      <mesh position={[0, 1.2, 0.01]}><planeGeometry args={[3.6, 1.8]} /><meshStandardMaterial color="#DDF4FF" emissive="#BFE6FF" emissiveIntensity={0.8} /></mesh>
      {[-1.2, -0.4, 0.4, 1.2].map((x, i) => <group key={x} position={[x, 0.75, 0.05]}><mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.16, 0.24, 24]} /><meshBasicMaterial color="#9AA0AC" side={THREE.DoubleSide} /></mesh><mesh rotation={[Math.PI / 2, 0, t * (2 + i)]}><circleGeometry args={[0.16, 8]} /><meshBasicMaterial color={["#F6F1E6", "#E87AA8", "#2E5FD0", "#F2B84B"][i]} /></mesh></group>)}
      <mesh position={[0, 2.35, 0.05]}><planeGeometry args={[3.4, 0.6]} /><meshBasicMaterial map={sign} toneMapped={false} /></mesh>
      <pointLight position={[0, 2.3, 0.8]} color="#7FE0FF" intensity={3} distance={5} />
      <mesh position={[0.8, 3.9, 0.01]}><planeGeometry args={[1.2, 1.1]} /><meshStandardMaterial color={window ? "#FFE2A8" : "#1A2034"} emissive={window ? "#FFC877" : "#000000"} emissiveIntensity={window ? 1.2 : 0} /></mesh>
      <Box p={[0.8, 3.9, 0.02]} s={[1.25, 0.05, 0.03]} c="#2A2A30" cast={false} />
    </group>
  );
};

// ─── spotlight on a dark stage ───────────────────────────────────────────────
export const Spotlight: React.FC<{ p: V3; h?: number; r?: number; on?: number }> = ({ p, h = 6, r = 1.2, on = 1 }) => (
  <group position={p}>
    <mesh position={[0, h / 2, 0]}><coneGeometry args={[r, h, 32, 1, true]} /><meshBasicMaterial color="#FFF4D8" transparent opacity={0.09 * on} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} /></mesh>
    <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[r, 40]} /><meshBasicMaterial color="#FFF4D8" transparent opacity={0.35 * on} toneMapped={false} /></mesh>
    <spotLight position={[0, h, 0]} target-position={p} angle={Math.atan(r / h) * 1.2} penumbra={0.4} intensity={60 * on} distance={h * 2} color="#FFF4D8" />
  </group>
);

// ─── the white bear ──────────────────────────────────────────────────────────
export const WhiteBear: React.FC<{ p: V3; yaw?: number; s?: number; t?: number }> = ({ p, yaw = 0, s = 1, t = 0 }) => {
  const W = toon("#F4F6F8");
  const step = Math.sin(t * 4) * 0.25;
  return (
    <group position={p} rotation={[0, yaw, 0]} scale={s}>
      <mesh material={W} position={[0, 0.75, 0]} scale={[0.55, 0.45, 0.9]} castShadow><sphereGeometry args={[1, 20, 14]} /></mesh>
      <mesh material={W} position={[0, 0.95, 0.85]} castShadow><sphereGeometry args={[0.3, 18, 12]} /></mesh>
      <mesh material={W} position={[0, 0.88, 1.12]} scale={[0.6, 0.5, 0.7]}><sphereGeometry args={[0.2, 14, 10]} /></mesh>
      <mesh position={[0, 0.9, 1.26]}><sphereGeometry args={[0.04, 10, 8]} /><meshBasicMaterial color="#0E070D" /></mesh>
      {[-1, 1].map((k) => <mesh key={k} position={[k * 0.13, 1.06, 1.08]}><sphereGeometry args={[0.03, 10, 8]} /><meshBasicMaterial color="#0E070D" /></mesh>)}
      {[-1, 1].map((k) => <mesh key={`e${k}`} material={W} position={[k * 0.2, 1.22, 0.78]}><sphereGeometry args={[0.08, 10, 8]} /></mesh>)}
      {[[-0.3, 0.5], [0.3, 0.5], [-0.3, -0.5], [0.3, -0.5]].map(([x, z], i) => <mesh key={i} material={W} position={[x, 0.3, z + (i % 2 ? step : -step) * 0.4]}><cylinderGeometry args={[0.13, 0.12, 0.6, 12]} /></mesh>)}
    </group>
  );
};
export { Bench };
