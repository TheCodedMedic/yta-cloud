// Episode 05 shared: timing, cast placements in the kitchen, the dark "x-ray" stage, the nerve, the reflex arc, 2D phone screens.
import React from "react";
import * as THREE from "three";
import { Person3D, Pose3, STAND } from "../cam3d/Person3D";
import { Bowl, faceTo, HeldSpoon, eatPose, sitOn, Chair } from "../cam3d/Props3D";
import { Kitchen } from "../ep04/Sets3";
import { BODY, C, HEAD } from "../ep04/Text";
import { V3 } from "../ep04/Vfx";
import { CAST, Damage, Kid, makeT, Timing } from "../epx/Kit";
import { Hob, PanOnHob } from "../epx/Sets5";
import TIMING from "./timing.json";

export const T5 = makeT(TIMING as Timing);
export const { at, atE, PS, PE, P } = T5;
export const END5 = T5.END;

// ─── kitchen placements (ep04 Kitchen: table centre (0, 0.3), chairs at z 1.08 / −0.48 and x ±1.25) ───
export const AT_HOB: V3 = [-1.35, 0, -1.88];
export const SEAT_S: V3 = [0, 0, 1.08];      // south chair, faces −z
export const SEAT_N: V3 = [0, 0, -0.48];     // north chair, faces +z
export const SEAT_W: V3 = [-1.25, 0, 0.3];   // west chair, faces +x
export const SEAT_E: V3 = [1.25, 0, 0.3];    // east chair, faces −x
export const MIA_S = 0.82;
export const yawTo = (a: V3, b: V3) => faceTo([a[0], a[2]], [b[0], b[2]]);

export const REACH: Pose3 = { ...STAND, lean: 12, armR: [58, 6, 22], handR: "grip", wristR: [0, 80], headNod: 28 };
export const HOLD_PAN: Pose3 = { ...STAND, lean: 4, armR: [62, 10, 40], handR: "grip", wristR: [0, 80], headNod: 18, armL: [6, 8, 14] };

/** Mia at the west chair, eating (or frozen with the spoon down). */
export const Mia: React.FC<{ t: number; eating?: boolean; face?: object; pose?: Pose3; yaw?: number }> = ({ t, eating = true, face = {}, pose, yaw = Math.PI / 2 }) => (
  <>
    <Bowl p={[-0.66, 0.8, 0.3]} full={0.7} />
    <Kid s={MIA_S} pos={SEAT_W} yaw={yaw} look={CAST.mia} pose={pose ?? (eating ? eatPose(t, sitOn(0.46 / MIA_S)) : sitOn(0.46 / MIA_S, { armR: [42, 8, 70], handR: "pinch", armL: [30, 10, 70], headNod: -4 }))} face={{ smile: 0.4, ...face }} propR={<HeldSpoon />} />
  </>
);
/** The Saturday kitchen: hob on, the pan, morning sky. */
export const Kitchen5: React.FC<{ t: number; pan?: boolean; steam?: number; night?: boolean; heat?: number; bowls?: number }> = ({ t, pan = true, steam = 0.6, night, heat = 1, bowls = 0 }) => (
  <>
    <Kitchen sky={night ? "#16224A" : "#FFE0A8"} bowls={bowls} />
    <Hob heat={heat} />
    {pan && <PanOnHob t={t} steam={steam} />}
    {night && <ambientLight intensity={-0.25} />}
  </>
);

// ─── the dark stage (x-ray / diagram scenes) ─────────────────────────────────
export const DarkStage: React.FC<{ tint?: string }> = ({ tint = "#9FC4FF" }) => (
  <>
    <color attach="background" args={["#05070F"]} />
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><circleGeometry args={[4, 48]} /><meshStandardMaterial color="#10162A" roughness={0.6} /></mesh>
    <ambientLight intensity={0.35} />
    <directionalLight position={[3, 4, 3]} intensity={1.2} castShadow />
    <directionalLight position={[-2, 2.5, -4]} intensity={2.6} color={tint} />
  </>
);
/** The hero with hidden damage glowing: hand, mouth, ankle, heel, belly. keys: which glows (0..1). */
export const XRayHero: React.FC<{ t: number; pos?: V3; yaw?: number; pose?: Pose3; face?: object; hand?: number; shin?: number; mouth?: number; heel?: number; belly?: number; arm?: number }> = ({ t, pos = [0, 0, 0], yaw = 0, pose = STAND, face = {}, hand = 0, shin = 0, mouth = 0, heel = 0, belly = 0, arm = 0 }) => {
  const by = pose.bob ?? 0; // seated poses lower the body
  const w = (x: number, y: number, z: number): V3 => { const c = Math.cos(yaw), s = Math.sin(yaw); return [pos[0] + x * c + z * s, pos[1] + (y > 0.6 ? y + by : y), pos[2] - x * s + z * c]; };
  return (
    <>
      <Person3D pos={pos} yaw={yaw} look={CAST.hero} pose={pose} face={{ smile: 0.4, ...face }} propR={hand > 0.01 ? <Damage p={[0, -0.06, 0.03]} t={t} amt={hand} s={0.07} /> : undefined} />
      <Damage p={w(0.1, 0.32, 0.06)} t={t + 1} amt={shin} s={0.11} />
      <Damage p={w(0, 1.47, 0.2)} t={t + 2} amt={mouth} s={0.06} />
      <Damage p={w(-0.1, 0.05, -0.08)} t={t + 3} amt={heel} s={0.08} />
      <Damage p={w(0.06, 0.95, 0.15)} t={t + 4} amt={belly} s={0.14} />
      <Damage p={w(0.26, 1.15, 0.0)} t={t + 5} amt={arm} s={0.1} />
    </>
  );
};

// ─── the nerve (SCN9A): a glowing fibre; pulses run toward a switch and die there when it's off ───
export const Nerve: React.FC<{ t: number; on?: boolean; sw?: number }> = ({ t, on = false, sw = 0 }) => {
  const curve = React.useMemo(() => new THREE.CatmullRomCurve3(Array.from({ length: 30 }, (_, i) => new THREE.Vector3(-14 + i, Math.sin(i * 0.5) * 0.25, Math.cos(i * 0.37) * 0.3))), []);
  return (
    <>
      <color attach="background" args={["#04060F"]} />
      <fog attach="fog" args={["#04060F", 6, 22]} />
      <mesh><tubeGeometry args={[curve, 200, 0.09, 12, false]} /><meshStandardMaterial color="#2A4A8A" emissive="#3A6AD0" emissiveIntensity={0.6} roughness={0.4} /></mesh>
      <mesh><tubeGeometry args={[curve, 200, 0.2, 12, false]} /><meshBasicMaterial color="#5A8AFF" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} /></mesh>
      {Array.from({ length: 9 }, (_, k) => {
        const u = ((t * 0.12 + k / 9) % 1);
        if (!on && u > 0.5) return null;
        const p = curve.getPoint(u);
        const fade = !on && u > 0.44 ? (0.5 - u) / 0.06 : 1;
        return <group key={k} position={p}><mesh><sphereGeometry args={[0.12, 14, 10]} /><meshBasicMaterial color="#DDF0FF" transparent opacity={fade} toneMapped={false} /></mesh><pointLight color="#9FC8FF" intensity={1.5 * fade} distance={2} /></group>;
      })}
      {/* the switch at the middle of the fibre */}
      <group position={curve.getPoint(0.5)}>
        <mesh><boxGeometry args={[0.5, 0.5, 0.5]} /><meshStandardMaterial color={on ? "#3DD68C" : "#D9472B"} emissive={on ? "#3DD68C" : "#D9472B"} emissiveIntensity={0.6 + sw} roughness={0.3} /></mesh>
        <pointLight color={on ? "#3DD68C" : "#FF4A2A"} intensity={4} distance={4} />
      </group>
      <ambientLight intensity={0.3} />
    </>
  );
};

/** The reflex arc drawn on the hero (at the origin, facing +z, right hand forward over a hot ring): hand → spine → arm. u 0..1 runs the pulse. */
export const ReflexArc: React.FC<{ u: number }> = ({ u }) => {
  const pts: V3[] = [[-0.3, 1.0, 0.55], [-0.28, 1.12, 0.28], [-0.22, 1.24, 0.02], [-0.05, 1.18, -0.1], [0, 1.0, -0.12], [-0.05, 1.18, -0.1], [-0.22, 1.24, 0.02], [-0.28, 1.12, 0.28], [-0.3, 1.0, 0.55]];
  const curve = React.useMemo(() => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), []);
  const p = curve.getPoint(Math.min(1, Math.max(0, u)));
  return (
    <>
      <mesh><tubeGeometry args={[curve, 120, 0.012, 8, false]} /><meshBasicMaterial color="#9FD8FF" transparent opacity={0.85} toneMapped={false} /></mesh>
      <mesh><tubeGeometry args={[curve, 120, 0.03, 8, false]} /><meshBasicMaterial color="#5A9AFF" transparent opacity={0.25} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} /></mesh>
      {u > 0 && u < 1 && <group position={p}><mesh><sphereGeometry args={[0.04, 12, 8]} /><meshBasicMaterial color="#FFFFFF" toneMapped={false} /></mesh><pointLight color="#9FD8FF" intensity={2} distance={1} /></group>}
    </>
  );
};

// ─── 2D phone screens ────────────────────────────────────────────────────────
/** A video with a view counter that climbs to `views`. */
export const VideoScreen: React.FC<{ views: number; t: number }> = ({ views, t }) => (
  <div style={{ position: "absolute", inset: 0, background: "#0E1430" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 80, height: 300, background: "linear-gradient(135deg, #3E7FD6, #1B2A4E)", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 140, top: 70, width: 110, height: 110, borderRadius: 55, background: "#0E070D" }} />
      <div style={{ position: "absolute", left: 120, top: 175, width: 150, height: 140, borderRadius: 30, background: "#2E5FD0" }} />
      <div style={{ position: "absolute", left: 250, top: 120, width: 60, height: 60, borderRadius: 30, background: "#FF5A2A", boxShadow: "0 0 40px #FF5A2A", opacity: 0.6 + 0.4 * Math.sin(t * 8) }} />
    </div>
    <div style={{ position: "absolute", left: 24, right: 24, top: 400, fontFamily: HEAD, fontWeight: 800, fontSize: 30, color: "#fff", lineHeight: 1.2 }}>The guy who CAN'T FEEL PAIN 😳 (real)</div>
    <div style={{ position: "absolute", left: 24, top: 500, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: C.amber }}>{Math.round(views).toLocaleString("en-GB")} views</div>
    <div style={{ position: "absolute", left: 24, top: 560, fontFamily: BODY, fontWeight: 600, fontSize: 22, color: "rgba(255,255,255,0.6)" }}>👍 {Math.round(views / 21).toLocaleString("en-GB")} · 💬 {Math.round(views / 160).toLocaleString("en-GB")}</div>
  </div>
);
/** A message from Theo at 02:00; typed 0..1 reveals it. */
export const TheoMsg: React.FC<{ typed: number }> = ({ typed }) => {
  const msg = "Mate. I just put my hand on the hob. And I didn't feel anything.";
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#141B3A, #0B1226)" }}>
      <div style={{ position: "absolute", top: 64, width: "100%", textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 24, color: "#fff" }}>
        <div style={{ width: 86, height: 86, borderRadius: 43, background: "#E07A2E", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, fontFamily: HEAD, fontWeight: 800 }}>T</div>
        Theo
      </div>
      <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 18, color: "rgba(255,255,255,0.55)" }}>Today 02:00</div>
      <div style={{ position: "absolute", left: 22, top: 300, maxWidth: "84%", padding: "20px 24px", borderRadius: 30, background: "#2A3150", color: "#fff", fontFamily: BODY, fontWeight: 600, fontSize: 30, lineHeight: 1.25, opacity: typed > 0 ? 1 : 0 }}>
        {msg.slice(0, Math.ceil(msg.length * Math.min(1, typed)))}
      </div>
    </div>
  );
};
export { Chair };
