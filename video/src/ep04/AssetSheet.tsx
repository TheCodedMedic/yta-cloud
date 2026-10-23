// Asset review for Episode 04: the hero in the blue hoodie at several angles, the night street, and every VFX element. One frame per panel.
import React, { useEffect, useState } from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Face3, LOOKS, Person3D, run3, STAND } from "../cam3d/Person3D";
import { World3D } from "../cam3d/World3D";
import { BodyArcs, Bolt, ClockFace, Rain, SkyCracks, Streaks, Tunnel, V3 } from "./Vfx";

export const useEpFonts = () => {
  const [ready, setReady] = useState(false);
  const [h] = useState(() => delayRender("fonts"));
  useEffect(() => {
    Promise.all([
      new FontFace("Plus Jakarta Sans", `url(${staticFile("fonts/PlusJakartaSans.ttf")})`, { weight: "200 800" }).load(),
      new FontFace("Manrope", `url(${staticFile("fonts/Manrope.ttf")})`, { weight: "200 800" }).load(),
      // the sign-off font is optional (its licence keeps it out of the repo): fall back silently if the file is missing
      new FontFace("CutieMolly", `url(${staticFile("fonts/CutieMolly.ttf")})`).load().catch(() => null),
    ]).then((fs) => { fs.forEach((f) => f && document.fonts.add(f)); setReady(true); continueRender(h); });
  }, [h]);
  return ready;
};

export const Cam: React.FC<{ pos: V3; target: V3; fov: number; roll?: number }> = ({ pos, target, fov, roll = 0 }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...pos); camera.fov = fov; camera.near = 0.03; camera.far = 900; camera.up.set(0, 1, 0);
  camera.lookAt(...target); if (roll) camera.rotateZ(roll); camera.updateProjectionMatrix();
  return null;
};

const H: V3 = [0, 0, 0.4];
const hero = (pose = STAND, face: Face3 = { smile: 0.4 }, yaw = 0, pos: V3 = H) => <Person3D pos={pos} yaw={yaw} look={LOOKS.hoodie} pose={pose} face={face} />;
const frozenRun = run3(0.18);

type Panel = { title: string; cam: { pos: V3; target: V3; fov: number }; scene: React.ReactNode };
const PANELS: Panel[] = [
  { title: "HERO · FRONT", cam: { pos: [0, 1.25, 4.2], target: [0, 1.0, 0.4], fov: 30 }, scene: <><World3D night noLamp />{hero()}</> },
  { title: "HERO · THREE-QUARTER", cam: { pos: [2.8, 1.35, 3.4], target: [0, 1.0, 0.4], fov: 30 }, scene: <><World3D night noLamp />{hero(STAND, { smile: 0.6 })}</> },
  { title: "HERO · PROFILE", cam: { pos: [4.2, 1.2, 0.45], target: [0, 1.0, 0.4], fov: 30 }, scene: <><World3D night noLamp />{hero()}</> },
  { title: "HERO · BACK (HOOD)", cam: { pos: [0.8, 1.6, -2.0], target: [0, 1.1, 0.4], fov: 34 }, scene: <><World3D night noLamp />{hero()}</> },
  { title: "HERO · SPRINT + STREAKS", cam: { pos: [0.6, 1.0, 4.0], target: [0.3, 0.95, 0.4], fov: 36 }, scene: <><World3D night noLamp />{hero(run3(0.3), { smile: 0, brow: -0.6 }, Math.PI / 2)}<Streaks center={[0, 1.1, 0.4]} t={1} amt={0.8} /></> },
  { title: "FROZEN RAIN · BULLET TIME", cam: { pos: [2.4, 1.5, 2.6], target: [0, 1.05, 0.4], fov: 38 }, scene: <><World3D night noLamp />{hero(frozenRun, { smile: 0, brow: -0.6 }, Math.PI / 2)}<Rain center={[0, 0, 1.5]} rt={3} motion={0} size={[8, 6, 7]} n={2600} /></> },
  { title: "LIGHTNING ON THE BODY", cam: { pos: [1.1, 1.45, 1.7], target: [0, 1.25, 0.4], fov: 34 }, scene: <><World3D night noLamp />{hero(frozenRun, { smile: 0, brow: -0.7 }, Math.PI / 2)}<BodyArcs c={[0, 1.15, 0.4]} t={0.37} n={7} /></> },
  { title: "NIGHT STREET · RAIN", cam: { pos: [7, 2.4, 9.5], target: [-2, 1.4, -1], fov: 40 }, scene: <><World3D night />{hero(run3(0.6), { smile: 0 }, Math.PI / 2)}<Rain center={[0, 0, 3]} rt={2.2} motion={1} size={[22, 9, 14]} n={4000} /></> },
  { title: "LIGHTNING BOLT (SKY STRIKE)", cam: { pos: [4, 1.6, 8], target: [-4, 9, -12], fov: 55 }, scene: <><World3D night /><Bolt a={[-10, 26, -14]} b={[-4, 0, -2.6]} t={0} seed={11} width={6} branches={5} light={60} /></> },
  { title: "TIME TUNNEL", cam: { pos: [-3, 1.2, 0.4], target: [10, 1.1, 0.4], fov: 60 }, scene: <><Tunnel center={[20, 1.2, 0.4]} t={1.2} />{hero(run3(0.4), { smile: 0 }, Math.PI / 2, [2.5, 0, 0.4])}<BodyArcs c={[2.5, 1.1, 0.4]} t={0.5} n={4} /><ambientLight intensity={0.6} /></> },
  { title: "SCARS IN THE SKY (×40)", cam: { pos: [3, 1.0, 6], target: [-2, 12, -30], fov: 55 }, scene: <><World3D night /><SkyCracks t={4} n={40} />{hero(STAND, { smile: 0, open: 0.3, eyesBig: 1 }, Math.PI * 0.85)}</> },
  { title: "CITY REWRITING + REWINDING CLOCK", cam: { pos: [9, 4, 9.5], target: [-4, 4, -4], fov: 46 }, scene: <><World3D night rewrite={(i) => ({ k: 0.4 + 1.6 * ((Math.sin(i * 12.9898) * 43758.5453) % 1 + 1) % 1, flash: i % 5 === 0 ? 1 : 0 })} /><ClockFace pos={[1.5, 3.2, 1.4]} r={1.1} t={2} /></> },
];
export const ASSET_PANELS = PANELS.length;

export const AssetSheet: React.FC = () => {
  const ready = useEpFonts();
  const p = PANELS[useCurrentFrame()];
  if (!ready) return <AbsoluteFill style={{ background: "#0B1226" }} />;
  return (
    <AbsoluteFill style={{ background: "#0B1226" }}>
      <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 35, position: [0, 2, 6] }}>
        <Cam {...p.cam} />
        {p.scene}
      </ThreeCanvas>
      <div style={{ position: "absolute", left: 60, top: 44, fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 64, color: "#F1F4F2", letterSpacing: "-0.03em", textShadow: "0 6px 26px rgba(0,0,0,0.7)" }}>{p.title}</div>
    </AbsoluteFill>
  );
};
