// Review sheet for the new hands, held props and seating (one panel per frame).
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { HANDS, HandShape, LOOKS, Person3D, Pose3, STAND } from "../cam3d/Person3D";
import { Bowl, Chair, CUP_HOLD, eatPose, HeldCup, HeldPhone, HeldSpoon, kerbSit, PHONE_LOOK, sitOn, talkHands, wavePose } from "../cam3d/Props3D";
import { Cam, useEpFonts } from "./AssetSheet";
import { Env } from "./Sets";
import { V3 } from "./Vfx";

const H = LOOKS.hoodie;
type P = { title: string; cam: { pos: V3; target: V3; fov: number }; scene: React.ReactNode };
const shapes = Object.keys(HANDS) as HandShape[];
const PANELS: P[] = [
  { title: "HAND SHAPES (right hand, raised)", cam: { pos: [0, 1.5, 1.6], target: [0, 1.4, 0], fov: 40 },
    scene: <>{shapes.map((sh, i) => <Person3D key={sh} pos={[-1.6 + i * 0.4, 0, 0]} yaw={0} look={H} pose={{ ...STAND, armR: [60, 30, 90], handR: sh, wristR: [0, 0] }} />)}</> },
  { title: "PHONE IN HAND", cam: { pos: [0.05, 1.62, 0.55], target: [-0.12, 1.15, 0.3], fov: 40 }, scene: <Person3D pos={[0, 0, 0]} yaw={0} look={H} pose={PHONE_LOOK} propR={<HeldPhone />} /> },
  { title: "PHONE (SIDE)", cam: { pos: [1.4, 1.4, 0.3], target: [0, 1.2, 0.2], fov: 40 }, scene: <Person3D pos={[0, 0, 0]} yaw={0} look={LOOKS.jamie} pose={PHONE_LOOK} propR={<HeldPhone />} /> },
  { title: "CUP IN HAND", cam: { pos: [0.5, 1.3, 1.6], target: [-0.1, 1.0, 0.1], fov: 40 }, scene: <Person3D pos={[0, 0, 0]} yaw={0} look={LOOKS.ex4} pose={CUP_HOLD} propR={<HeldCup />} /> },
  { title: "EATING ON A CHAIR (spoon + bowl)", cam: { pos: [1.4, 1.3, 1.4], target: [0, 0.9, 0.2], fov: 42 },
    scene: <><Chair p={[0, 0, 0]} /><mesh position={[0, 0.74, 0.55]}><boxGeometry args={[1, 0.05, 0.6]} /><meshToonMaterial color="#8A6A4E" /></mesh><Bowl p={[-0.1, 0.8, 0.45]} /><Person3D pos={[0, 0, 0.02]} yaw={0} look={LOOKS.jamie} pose={eatPose(0.6, sitOn(0.46))} propR={<HeldSpoon />} /></> },
  { title: "EATING (spoon at mouth)", cam: { pos: [1.4, 1.3, 1.4], target: [0, 0.9, 0.2], fov: 42 },
    scene: <><Chair p={[0, 0, 0]} /><mesh position={[0, 0.74, 0.55]}><boxGeometry args={[1, 0.05, 0.6]} /><meshToonMaterial color="#8A6A4E" /></mesh><Bowl p={[-0.1, 0.8, 0.45]} /><Person3D pos={[0, 0, 0.02]} yaw={0} look={LOOKS.jamie} pose={eatPose(1.3, sitOn(0.46))} propR={<HeldSpoon />} /></> },
  { title: "SITTING ON A KERB", cam: { pos: [1.8, 1.0, 1.6], target: [0, 0.5, 0], fov: 42 },
    scene: <><mesh position={[0, 0.07, -0.3]}><boxGeometry args={[3, 0.14, 0.6]} /><meshToonMaterial color="#6A6480" /></mesh><Person3D pos={[0, 0, -0.18]} yaw={0} look={H} pose={kerbSit({ armR: [70, 20, 40], handR: "open" })} face={{ smile: 1 }} /></> },
  { title: "TALKING HANDS + WAVE", cam: { pos: [0, 1.4, 2.6], target: [0, 1.1, 0], fov: 40 },
    scene: <><Person3D pos={[-0.5, 0, 0]} yaw={0.3} look={LOOKS.coach} pose={talkHands(1, STAND)} /><Person3D pos={[0.5, 0, 0]} yaw={-0.3} look={H} pose={wavePose(0.3)} face={{ smile: 0.8 }} /><Person3D pos={[1.4, 0, 0]} yaw={-0.3} look={H} pose={{ ...wavePose(0.3), wristR: [0, -90] }} face={{ smile: 0.8 }} /></> },
];
export const HAND_PANELS = PANELS.length;
export const HandTest: React.FC = () => {
  const ready = useEpFonts();
  const p = PANELS[useCurrentFrame()];
  if (!ready) return <AbsoluteFill style={{ background: "#0B1226" }} />;
  return (
    <AbsoluteFill style={{ background: "#0B1226" }}>
      <ThreeCanvas width={1920} height={1080} shadows gl={{ antialias: true, preserveDrawingBuffer: true }} camera={{ fov: 35, position: [0, 2, 6] }}>
        <Cam {...p.cam} /><Env mood="day" />
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[40, 40]} /><meshToonMaterial color="#B8B0A0" /></mesh>
        {p.scene}
      </ThreeCanvas>
      <div style={{ position: "absolute", left: 50, top: 36, fontFamily: "'Plus Jakarta Sans'", fontWeight: 800, fontSize: 56, color: "#F1F4F2", textShadow: "0 6px 26px rgba(0,0,0,0.7)" }}>{p.title}</div>
    </AbsoluteFill>
  );
};
