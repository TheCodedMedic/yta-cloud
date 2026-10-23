// Episode 04, part C (beats 28–50): Jamie and the crossing (memory), the voice note, the decision, the river-road run,
// the year rewinding (pages, snow up, leaves back, people walking backwards, the seasons), Mill Road, the slow-motion save.
import React, { useMemo } from "react";
import * as THREE from "three";
import { LOOKS, mix3, Person3D, Pose3, run3, SIT, STAND, walk3 } from "../cam3d/Person3D";
import { World3D } from "../cam3d/World3D";
import { at, ex, hand, io, L3, orbit, P, PE, PS, rnd, RUN_Y, seg, Shot, shakeC } from "./core";
import { Phone2D, VoiceNoteScreen } from "./Dom";
import { Bedroom, Env, Mood, Park } from "./Sets";
import { Crossing, RiverRoad, Van } from "./Sets2";
import { BODY, C, Chip, expo, Flash, HEAD, Rise, Slam } from "./Text";
import { BodyArcs, Rain, Streaks, Tunnel, V3 } from "./Vfx";

const HOOD = LOOKS.hoodie, JAMIE = LOOKS.jamie;
const MEMORY = "sepia(0.45) saturate(0.55) brightness(0.92) contrast(1.05)";

/** Floating particles moving up (snow rising, leaves returning). */
const Rising: React.FC<{ center: V3; t: number; n?: number; color: string; size?: number; speed?: number; spread?: V3 }> = ({ center, t, n = 900, color, size = 0.04, speed = 1.6, spread = [16, 8, 10] }) => {
  const mesh = useMemo(() => {
    const im = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshBasicMaterial({ color, toneMapped: false }), n); im.frustumCulled = false; return im;
  }, [n, color]);
  const o = new THREE.Object3D();
  for (let i = 0; i < n; i++) {
    const y = ((rnd(i + 50) * spread[1] + t * speed * (0.6 + rnd(i) * 0.8)) % spread[1]);
    o.position.set(center[0] + (rnd(i + 1) - 0.5) * spread[0] + Math.sin(t * 2 + i) * 0.1, center[1] + y, center[2] + (rnd(i + 2) - 0.5) * spread[2]);
    o.rotation.set(t * rnd(i + 3) * 3, t * rnd(i + 4) * 2, 0);
    o.scale.set(size * (1 + rnd(i + 5)), size * (color === "#FFFFFF" ? 1 : 0.3) * (1 + rnd(i + 5)), size * (1 + rnd(i + 6)));
    o.updateMatrix(); mesh.setMatrixAt(i, o.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  return <primitive object={mesh} />;
};

// ─── Mill Road ───────────────────────────────────────────────────────────────
const MillRoad: React.FC<{ t: number; green?: boolean; rain?: boolean }> = ({ t, green = true, rain }) => (
  <>
    <Env mood="night" />
    <World3D bare night nearTrees={false} lamps cafe={false} glow={1.1} />
    {[-14, -2, 10, 22].map((x) => <pointLight key={x} position={[x, 3.2, -1.2]} color="#FFC777" intensity={7} distance={10} decay={1.6} />)}
    <Crossing green={green} />
    {rain && <Rain center={[0, 0, 3]} rt={t} motion={1} size={[16, 8, 8]} n={2400} />}
  </>
);
// the save: timings
const tVan = at(42, "van"), tSlow = at(44, "Time"), tReach = at(45, "reach"), tPull = at(45, "pull");
const vanX = (t: number) => {
  if (t < tSlow) return 8 + 9 * (tSlow - t);
  if (t < tPull + 0.25) return 8 - 0.72 * (t - tSlow);
  const x0 = 8 - 0.72 * (tPull + 0.25 - tSlow), d = t - (tPull + 0.25);
  return x0 - 3 * d * d - 2 * d * d * d;
};
const jamieZ = (t: number) => {
  if (t < at(44, "Jamie's")) return 1.0;
  if (t < tPull) return 1.0 + 0.9 * seg(t, at(44, "Jamie's"), tReach);
  return 1.9 - 1.6 * ex(seg(t, tPull, tPull + 0.5));
};
const heroSaveX = (t: number) => (t < at(43, "run") ? -14 : t < tReach ? -14 + 13.3 * seg(t, at(43, "run"), tReach) : -0.7);
const jamieWalk = (t: number): Pose3 => (t < at(44, "Jamie's") ? { ...STAND, armR: [42, 4, 95], headNod: 22 } : mix3({ ...walk3(0.12), armR: [42, 4, 95], headNod: 20 }, walk3(0.3), seg(t, at(44, "Jamie's"), tReach)));

const Save: React.FC<{ t: number }> = ({ t }) => {
  const pulled = t > tPull;
  const hz = pulled ? 1.6 - 1.0 * ex(seg(t, tPull, tPull + 0.5)) : 1.0;
  return (
    <>
      <MillRoad t={t} />
      <Person3D pos={[0.1, 0, jamieZ(t)]} yaw={pulled ? Math.PI * 0.85 : 0} look={JAMIE} pose={pulled ? { ...STAND, lean: -12, armL: [70, 30, 20] } : jamieWalk(t)} face={{ smile: 0, open: pulled ? 0.5 : 0, eyesBig: pulled ? 1 : 0 }} />
      <Person3D pos={[heroSaveX(t), 0, hz]} yaw={pulled ? -2.6 : RUN_Y} look={HOOD} pose={pulled ? { ...STAND, lean: -18, armR: [95, 10, 30] } : run3(t * 1.6)} face={{ brow: -0.8, open: 0.3 }} />
      {t > at(43, "run") && t < tPull + 0.3 && <BodyArcs c={[heroSaveX(t), 1.15, hz]} t={t} n={5} amt={0.9} />}
      <Van p={[vanX(t), 0, 3.6]} />
    </>
  );
};

/** Calendar page flipping backward (DOM), for "days peel away like pages". */
const Pages: React.FC<{ t: number; t0: number }> = ({ t, t0 }) => {
  const k = Math.floor((t - t0) * 9);
  const d = new Date(2026, 2, 14 + 365 - k * 9);
  const flip = ((t - t0) * 9) % 1;
  return (
    <div style={{ position: "absolute", left: 960 - 200, top: 300, width: 400, height: 460, perspective: 1400 }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "#F6F1E6", boxShadow: "0 40px 90px rgba(0,0,0,0.5)", textAlign: "center", fontFamily: HEAD, fontWeight: 800, color: C.ink }}>
        <div style={{ background: C.red, color: C.cream, borderRadius: "24px 24px 0 0", padding: "18px 0", fontSize: 44 }}>{d.toLocaleString("en-GB", { month: "long" }).toUpperCase()}</div>
        <div style={{ fontSize: 210, marginTop: 30 }}>{d.getDate()}</div>
      </div>
      <div style={{ position: "absolute", inset: 0, borderRadius: 24, background: "#EDE6D6", transformOrigin: "50% 0%", transform: `rotateX(${flip * 170}deg)`, opacity: 1 - flip * 0.6, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }} />
    </div>
  );
};

const Season: React.FC<{ t: number; mood: Mood; trees: string; ground?: string; particles?: string; up?: boolean }> = ({ t, mood, trees, ground, particles, up }) => (
  <>
    <Env mood={mood} />
    <Park />
    {ground && <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><planeGeometry args={[600, 300]} /><meshToonMaterial color={ground} /></mesh>}
    {Array.from({ length: 10 }, (_, i) => (
      <group key={i} position={[-8 + i * 2.2, 0, -3 - (i % 3)]} scale={0.9}>
        <mesh position={[0, 0.9, 0]}><cylinderGeometry args={[0.09, 0.14, 1.8, 8]} /><meshToonMaterial color="#4A3424" /></mesh>
        {trees !== "bare" && <mesh position={[0, 2.3, 0]}><sphereGeometry args={[0.95, 14, 10]} /><meshToonMaterial color={trees} /></mesh>}
      </group>
    ))}
    {particles && <Rising center={[0, 0, -1]} t={up ? t : -t} color={particles} n={1100} size={particles === "#FFFFFF" ? 0.035 : 0.06} speed={up ? 1.4 : 1.4} />}
  </>
);

export const C_SHOTS: Shot[] = [
  // 28–30 · the memory: twelve months ago, Mill Road
  { id: "mem-jamie", t0: P(28), t1: at(28, "crossed"), grade: MEMORY, scene: (t) => <><MillRoad t={t} rain /><Person3D pos={[-6 + (t - P(28)) * 1.2, 0, 1.0]} yaw={RUN_Y} look={JAMIE} pose={walk3(t * 1.1)} face={{ smile: 0.4 }} /></>,
    cam: (t) => hand({ pos: [-2 + (t - P(28)) * 0.8, 1.5, 5.6], target: [-4 + (t - P(28)) * 1.2, 1.2, 1.0], fov: 36 }, t, 0.01) },
  { id: "mem-light", t0: at(28, "crossed"), t1: at(29, "The", 2), grade: MEMORY, scene: (t) => <><MillRoad t={t} rain /><Person3D pos={[0.1, 0, 1.0 + seg(t, at(29, "green"), at(29, "The", 2) + 0.5) * 0.9]} yaw={0} look={JAMIE} pose={t > at(29, "green") ? walk3(t * 1.1) : { ...STAND, armR: [42, 4, 95], headNod: 22 }} /></>,
    cam: (t) => ({ pos: L3([0.9, 1.35, -0.9], [0.7, 1.45, -0.6], io(seg(t, at(28, "crossed"), at(29, "The", 2)))), target: [-1.6, 2.3, 8.3], fov: 40 }) },
  { id: "mem-van", t0: at(29, "The", 2), t1: P(30), grade: MEMORY, scene: (t) => <><MillRoad t={t} rain /><Van p={[22 - (t - at(29, "The", 2)) * 14, 0, 3.6]} /></>,
    cam: () => ({ pos: [-3, 0.6, 2.2], target: [12, 1.2, 3.6], fov: 34 }) },
  { id: "mem-late", t0: P(30), t1: P(31), grade: MEMORY + " brightness(0.8)", scene: (t) => <><MillRoad t={t} rain green={false} /><Person3D pos={[-1.6, 0, 1.0]} yaw={0.9} look={HOOD} pose={{ ...STAND, headNod: 15 }} face={{ smile: 0, brow: 0.8 }} /></>,
    cam: (t) => { const u = io(seg(t, P(30), P(31))); return { pos: L3([-6, 1.4, 5], [-4.4, 1.6, 3.6], u), target: [-1.6, 1.3, 1.0], fov: 40 }; } },
  // 31–32 · the voice note
  { id: "voice-note", t0: P(31), t1: P(32), scene: (t) => <><Bedroom windowMood="night" /><ambientLight intensity={0.25} /><Person3D pos={[-1.1, 0, -0.4]} yaw={0.6} look={HOOD} pose={{ ...SIT, armR: [60, 4, 100], headNod: 25 }} face={{ smile: 0, brow: 0.6 }} /><pointLight position={[-0.6, 1.2, 0.2]} color="#9FD8FF" intensity={3} distance={2.5} /></>,
    cam: (t) => ({ pos: L3([0.8, 1.4, 1.6], [0.3, 1.3, 1.1], io(seg(t, P(31), P(32)))), target: [-1.0, 1.15, -0.4], fov: 36 }), grade: "blur(3px) brightness(0.8)",
    dom: (t) => <Phone2D x={1220} y={560} s={0.95} enter={seg(t, at(31, "voice") - 0.3, at(31, "voice") + 0.3)}><VoiceNoteScreen progress={0} t={t} /></Phone2D> },
  { id: "voice-play", t0: P(32), t1: P(33), grade: MEMORY + " blur(2px)", scene: (t) => <><MillRoad t={t} rain /><Person3D pos={[0.1, 0, 1.0]} yaw={-0.5} look={JAMIE} pose={{ ...STAND, armR: [42, 4, 95], headNod: 10 }} face={{ smile: 0.5, open: Math.max(0, Math.sin(t * 15)) * 0.4 }} /></>,
    cam: (t) => ({ pos: L3([-1.0, 1.55, 3.0], [-0.6, 1.55, 2.3], io(seg(t, P(32), P(33)))), target: [0.1, 1.45, 1.0], fov: 34 }),
    dom: (t) => <Phone2D x={1500} y={560} s={0.9}><VoiceNoteScreen progress={seg(t, PS(32), PE(32))} t={t} /></Phone2D> },
  // 33–35 · a year is thirty-one million seconds; I'm going
  { id: "seconds", t0: P(33), t1: P(34), scene: (t) => <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[3, 0, 4.6]} yaw={0} look={HOOD} pose={{ ...STAND, armL: [40, 10, 70], armR: [40, 10, 70] }} /></>,
    cam: (t) => { const u = io(seg(t, P(33), P(34))); return { pos: L3([0, 6, -4], [6, 4, -3], u), target: [20, 2, 40], fov: 46 }; } },
  { id: "faster", t0: P(34), t1: P(35), scene: (t) => <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[0, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={mix3(STAND, { lean: 22, armL: [-30, 6, 60], armR: [35, 6, 70], legL: [30, 60], legR: [-18, 10], bob: -0.12 }, io(seg(t, at(34, "run"), at(34, "run") + 0.6)))} face={{ brow: -0.6 }} /><BodyArcs c={[0, 1.1, 1.2]} t={t} n={4} amt={seg(t, at(34, "Faster"), P(35))} /></>,
    cam: (t) => { const u = io(seg(t, P(34), P(35))); return { pos: L3([4, 1.0, 4.4], [2.2, 0.9, 3.0], u), target: [0, 1.0, 1.2], fov: 38 }; } },
  { id: "going", t0: P(35), t1: P(36), scene: (t) => <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[0, 0, 1.2]} yaw={RUN_Y + 0.5} look={HOOD} pose={{ ...STAND, lean: 6 }} face={{ brow: -0.9, open: Math.max(0, Math.sin(t * 13)) * 0.3 }} /><BodyArcs c={[0, 1.1, 1.2]} t={t} n={3} amt={0.5} /></>,
    cam: () => ({ pos: [1.4, 1.62, 2.4], target: [0, 1.52, 1.2], fov: 32 }) },
  // 36 · the long straight road by the river; and you run
  { id: "river-wide", t0: P(36), t1: at(36, "And"), scene: (t) => <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[0, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={STAND} /></>,
    cam: (t) => { const u = io(seg(t, P(36), at(36, "And"))); return { pos: L3([-30, 12, 22], [-18, 7, 16], u), target: [2, 1, 1], fov: 40 }; } },
  { id: "river-run", t0: at(36, "And"), t1: P(37), scene: (t) => { const d = t - at(36, "And"), x = 3 * d * d; return <><Env mood="night" /><RiverRoad t={t} /><Person3D pos={[x, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * (1.4 + d * 0.4))} face={{ brow: -0.8, open: 0.3 }} /><BodyArcs c={[x, 1.15, 1.2]} t={t} n={7} amt={Math.min(1, d / 1.5)} /><Streaks center={[x, 1.1, 1.2]} t={t} amt={Math.min(1, d / 2)} /></>; },
    cam: (t) => { const d = t - at(36, "And"), x = 3 * d * d; return shakeC({ pos: [x - 2.6 - d * 0.3, 0.8, 2.2], target: [x + 3, 1.0, 1.2], fov: 50 + 10 * Math.min(1, d / 3) }, t, 0.01 + 0.01 * Math.min(1, d / 2)); } },
  // 37 · the sound goes, then the colour; streetlights into threads; the river flows backwards
  { id: "colour-drain", t0: P(37), t1: at(37, "The"), grade: "saturate(0.5)", scene: (t) => { const x = 40 + (t - P(37)) * 20; return <><Env mood="night" /><RiverRoad t={-t * 3} /><Person3D pos={[x, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * 2)} /><BodyArcs c={[x, 1.15, 1.2]} t={t} n={6} amt={1} /><Streaks center={[x, 1.1, 1.2]} t={t} amt={1} /></>; },
    cam: (t) => { const x = 40 + (t - P(37)) * 20; return { pos: [x - 3, 0.9, 3.4], target: [x + 2, 1.0, 1.2], fov: 60 }; } },
  { id: "threads", t0: at(37, "The"), t1: P(38), grade: "saturate(0.15)", scene: (t) => { const x = 80 + (t - at(37, "The")) * 40; return <><Env mood="night" /><RiverRoad t={-t * 6} /><Person3D pos={[x, 0, 1.2]} yaw={RUN_Y} look={HOOD} pose={run3(t * 2.2)} /><Streaks center={[x, 2.5, -2]} t={t} amt={1} n={400} color="#FFD27A" /><Streaks center={[x, 1.1, 1.2]} t={t} amt={1} /></>; },
    cam: (t) => { const x = 80 + (t - at(37, "The")) * 40; return shakeC({ pos: [x - 1.5, 1.2, 4.2], target: [x + 6, 1.4, -1], fov: 72 }, t, 0.02); } },
  // 38 · days peel away; snow falls up; leaves fly back; people walk backwards out of shops
  { id: "pages", t0: P(38), t1: at(38, "Snow"), scene: (t) => <><Tunnel center={[30, 1.2, 0.4]} t={-t} speed={3} /><ambientLight intensity={0.5} /></>,
    cam: () => ({ pos: [-2, 1.2, 0.4], target: [10, 1.2, 0.4], fov: 64 }), dom: (t) => <Pages t={t} t0={P(38)} /> },
  { id: "snow-up", t0: at(38, "Snow"), t1: at(38, "Leaves"), scene: (t) => <Season t={t} mood="day" trees="bare" ground="#EEF2F6" particles="#FFFFFF" up />,
    cam: (t) => ({ pos: L3([2, 0.8, 6], [2, 2.6, 6.5], io(seg(t, at(38, "Snow"), at(38, "Leaves")))), target: [0, 3, -3], fov: 48 }) },
  { id: "leaves-back", t0: at(38, "Leaves"), t1: at(38, "People"), scene: (t) => <Season t={t} mood="golden" trees="#D9832E" particles="#E0742A" up />,
    cam: (t) => ({ pos: L3([4, 1.2, 5], [2, 1.6, 4.4], io(seg(t, at(38, "Leaves"), at(38, "People")))), target: [0, 2.2, -3], fov: 44 }) },
  { id: "backwards", t0: at(38, "People"), t1: P(39), scene: (t) => {
      const u = t - at(38, "People");
      return <><Env mood="day" /><World3D bare nearTrees={false} lamps={false} glow={0.25} />
        {[-3.4, -2.4, -1.4, -0.4].map((x, i) => <Person3D key={i} pos={[x + 0.4 * i, 0, -2.3 + u * 0.5]} yaw={Math.PI} look={(LOOKS as any)[["ex1", "ex3", "ex5", "ex8"][i]]} pose={walk3(-u * 0.9 - i * 0.3)} face={{ smile: 0.3 }}
          propR={<mesh position={[0, -0.2, 0]}><boxGeometry args={[0.18, 0.24, 0.12]} /><meshToonMaterial color={["#F2B84B", "#D9472B", "#F1F4F2", "#2E5FD0"][i]} /></mesh>} />)}</>;
    },
    cam: () => ({ pos: [-1.6, 1.4, 3.6], target: [-1.8, 1.2, -2], fov: 44 }), grade: "saturate(0.8)" },
  // 39 · winter / autumn / summer / spring, then a whole year in one breath
  { id: "winter", t0: P(39), t1: at(39, "Autumn"), scene: (t) => <Season t={t} mood="dawn" trees="bare" ground="#EEF2F6" particles="#FFFFFF" up />, cam: () => ({ pos: [0, 1.6, 7], target: [0, 2, -3], fov: 46 }) },
  { id: "autumn", t0: at(39, "Autumn"), t1: at(39, "Summer"), scene: (t) => <Season t={t} mood="golden" trees="#D9832E" particles="#E0742A" up />, cam: () => ({ pos: [3, 1.6, 7], target: [0, 2, -3], fov: 46 }) },
  { id: "summer", t0: at(39, "Summer"), t1: at(39, "Spring"), scene: (t) => <Season t={t} mood="day" trees="#4E9A3E" />, cam: () => ({ pos: [-3, 1.6, 7], target: [0, 2, -3], fov: 46 }) },
  { id: "spring", t0: at(39, "Spring"), t1: at(39, "A"), scene: (t) => <Season t={t} mood="dawn" trees="#F2A8C8" particles="#F8C8DA" up />, cam: () => ({ pos: [0, 1.2, 6], target: [0, 2.2, -3], fov: 46 }) },
  { id: "breath", t0: at(39, "A"), t1: P(40), scene: (t) => <><Tunnel center={[30, 1.2, 0.4]} t={-t} speed={6} /><Person3D pos={[2.6, 0, 0.4]} yaw={RUN_Y} look={HOOD} pose={run3(t * 1.8)} /><BodyArcs c={[2.6, 1.15, 0.4]} t={t} n={5} amt={1} /><ambientLight intensity={0.5} /></>,
    cam: (t) => shakeC({ pos: [-1.6, 1.25, 0.45], target: [8, 1.2, 0.4], fov: 64 + 10 * seg(t, at(39, "A"), P(40)) }, t, 0.03) },
  // 40 · arrival: 14 March, 19:58, Mill Road
  { id: "arrive", t0: P(40), t1: at(40, "Seven"), scene: (t) => <><MillRoad t={t} /><Person3D pos={[-14, 0, 1.0]} yaw={RUN_Y} look={HOOD} pose={{ ...STAND, lean: 10, bob: -0.04 }} face={{ open: 0.3, eyesBig: 0.6 }} />{t < at(40, "you're") && <BodyArcs c={[-14, 1.15, 1.0]} t={t} n={6} amt={1} />}</>,
    cam: (t) => { const u = io(seg(t, P(40), at(40, "Seven"))); return { pos: L3([-20, 0.5, 4], [-17, 1.5, 3.4], u), target: [-14, 1.2, 1.0], fov: 40 }; } },
  { id: "1958", t0: at(40, "Seven"), t1: P(41), scene: (t) => <MillRoad t={t} />,
    cam: (t) => { const u = io(seg(t, at(40, "Seven"), P(41))); return { pos: L3([6, 7, 9.6], [4, 5, 9.2], u), target: [0, 1, 2], fov: 44 }; } },
  // 41 · there he is: hood up, earphones in, phone
  { id: "there-he-is", t0: P(41), t1: at(41, "Hood"), scene: (t) => <><MillRoad t={t} /><Person3D pos={[0.1, 0, 1.0]} yaw={0} look={JAMIE} pose={jamieWalk(t)} /></>,
    cam: (t) => ({ pos: L3([-8, 1.5, 1.0], [-6, 1.5, 1.2], io(seg(t, P(41), at(41, "Hood")))), target: [0.1, 1.3, 1.0], fov: 26 }) },
  { id: "hood", t0: at(41, "Hood"), t1: at(41, "Looking"), scene: (t) => <><MillRoad t={t} /><Person3D pos={[0.1, 0, 1.0]} yaw={0} look={JAMIE} pose={jamieWalk(t)} face={{ smile: 0.2 }} /></>,
    cam: (t) => ({ pos: orbit([0.1, 1.6, 1.0], 40 + 30 * seg(t, at(41, "Hood"), at(41, "Looking")), 1.1, 1.65), target: [0.1, 1.55, 1.0], fov: 34 }) },
  { id: "his-phone", t0: at(41, "Looking"), t1: P(42), scene: (t) => <><MillRoad t={t} /><Person3D pos={[0.1, 0, 1.0]} yaw={0} look={JAMIE} pose={jamieWalk(t)} face={{ smile: 0.3 }} propR={<group position={[0, -0.1, 0.035]} rotation={[-1.15, 0, 0]}><mesh><boxGeometry args={[0.075, 0.15, 0.01]} /><meshStandardMaterial color="#0A0A0F" /></mesh><mesh position={[0, 0, 0.0055]}><planeGeometry args={[0.066, 0.138]} /><meshStandardMaterial color="#9FD8FF" emissive="#7FC8FF" emissiveIntensity={1.6} /></mesh></group>} /></>,
    cam: () => ({ pos: [0.95, 1.45, 2.1], target: [0.05, 1.25, 1.1], fov: 36 }) },
  // 42 · the van comes round the corner, too fast, again
  { id: "van", t0: P(42), t1: P(43), scene: (t) => <Save t={t} />,
    cam: (t) => { const vx = vanX(t); return hand({ pos: [vx - 9, 0.45, 2.0], target: [vx, 1.0, 3.6], fov: 32 }, t, 0.015); } },
  // 43 · you don't think. you run.
  { id: "you-run", t0: P(43), t1: P(44), scene: (t) => <Save t={t} />,
    cam: (t) => { const hx = heroSaveX(t); return shakeC({ pos: [hx - 2.6, 0.8, 0.0], target: [hx + 3, 1.0, 1.0], fov: 52 }, t, 0.02); } },
  // 44 · time stretches like warm glass; headlights crawl; his foot comes down, very slowly
  { id: "glass", t0: P(44), t1: at(44, "The"), noBlur: true, grade: "saturate(0.85) contrast(1.08)", scene: (t) => <Save t={t} />,
    cam: (t) => { const u = io(seg(t, P(44), at(44, "The"))); return { pos: orbit([-2, 1.2, 2], 200 + 70 * u, 6.5, 1.6 + u), target: [0, 1.0, 2.2], fov: 40 }; } },
  { id: "headlights", t0: at(44, "The"), t1: at(44, "Jamie's"), noBlur: true, scene: (t) => <Save t={t} />,
    cam: (t) => ({ pos: [vanX(t) - 6.5, 0.7, 5.8], target: [vanX(t) - 2.4, 0.85, 3.6], fov: 34 }) },
  { id: "foot", t0: at(44, "Jamie's"), t1: P(45), noBlur: true, scene: (t) => <Save t={t} />,
    cam: (t) => ({ pos: L3([1.4, 0.25, 2.8], [1.2, 0.2, 2.4], io(seg(t, at(44, "Jamie's"), P(45)))), target: [0.1, 0.15, jamieZ(t)], fov: 34 }) },
  // 45 · you reach him with half a second to spare. and you pull. (silence)
  { id: "reach", t0: P(45), t1: tPull - 0.05, noBlur: true, scene: (t) => <Save t={t} />,
    cam: (t) => ({ pos: orbit([-0.3, 1.1, 1.6], 120 + 40 * seg(t, P(45), tPull), 3.0, 1.3), target: [-0.3, 1.1, 1.6], fov: 40 }) },
  { id: "pull", t0: tPull - 0.05, t1: P(46), noBlur: true, scene: (t) => <Save t={t} />,
    cam: (t) => { const u = seg(t, tPull, P(46)); return shakeC({ pos: L3([-2.6, 0.5, -1.4], [-3.2, 0.9, -2.2], u), target: [vanX(t) * 0.5, 1.0, 2.0], fov: 46 }, t, u > 0.25 && u < 0.6 ? 0.04 : 0); } },
  // 46–50 · whoa; alive; early; the kerb
  { id: "whoa", t0: P(46), t1: P(47), scene: (t) => <><MillRoad t={t} /><Person3D pos={[0.1, 0, 0.3]} yaw={Math.PI * 0.85} look={JAMIE} pose={{ ...STAND, lean: -8, armL: [40, 30, 30] }} face={{ open: 0.6 * Math.max(0, Math.sin(t * 13)), eyesBig: 1, brow: 0.4 }} /></>,
    cam: () => ({ pos: [-0.8, 1.6, -1.3], target: [0.1, 1.5, 0.3], fov: 32 }) },
  { id: "alive", t0: P(47), t1: P(48), scene: (t) => <><MillRoad t={t} /><Person3D pos={[0.1, 0, 0.3]} yaw={Math.PI * 0.85} look={JAMIE} pose={{ ...STAND, armR: [10, 30, 90], armL: [10, 30, 90] }} face={{ smile: t > at(47, "Alive") ? 0.3 : 0, brow: t > at(47, "Annoyed") && t < at(47, "Confused") ? -0.7 : t < at(47, "Alive") ? 0.6 : 0, eyesBig: t > at(47, "Confused") && t < at(47, "Alive") ? 1 : 0 }} /><Person3D pos={[-0.7, 0, 0.7]} yaw={-2.4} look={HOOD} pose={STAND} face={{ smile: 0.4 }} /></>,
    cam: (t) => { const u = io(seg(t, P(47), P(48))); return { pos: L3([-1.8, 1.6, -2.8], [-1.2, 1.6, -1.8], u), target: [-0.2, 1.4, 0.5], fov: 34 }; } },
  { id: "early", t0: P(48), t1: P(49), scene: (t) => <><MillRoad t={t} /><Person3D pos={[0.1, 0, 0.3]} yaw={Math.PI * 0.75} look={JAMIE} pose={{ ...STAND, armR: [20, 20, 40] }} face={{ smile: 0.7, open: 0.4 * Math.max(0, Math.sin(t * 13)) }} /></>,
    cam: () => ({ pos: [-0.9, 1.55, -1.2], target: [0.1, 1.5, 0.3], fov: 30 }) },
  { id: "film", t0: P(49), t1: P(50), scene: (t) => <><MillRoad t={t} /><Person3D pos={[-0.7, 0, 0.7]} yaw={-2.0} look={HOOD} pose={{ ...STAND, headNod: -4 }} face={{ smile: 0.6, brow: 0.5, open: 0.3 * Math.max(0, Math.sin(t * 13)) }} /></>,
    cam: () => ({ pos: [-1.6, 1.55, -0.6], target: [-0.7, 1.5, 0.7], fov: 30 }) },
  { id: "kerb", t0: P(50), t1: P(51), scene: (t) => { const s = seg(t, at(50, "sit") - 0.3, at(50, "sit") + 0.3); return <><MillRoad t={t} /><Person3D pos={[-0.6, 0.12 * s, 1.35]} yaw={Math.PI} look={HOOD} pose={mix3({ ...STAND, lean: 14 }, { ...SIT, armL: [30, 10, 40], armR: [30, 10, 40], bob: -0.42 }, s)} face={{ smile: 1, open: 0.4 + 0.3 * Math.sin(t * 16) }} /><Person3D pos={[0.4, 0, 0.6]} yaw={-2.4} look={JAMIE} pose={STAND} face={{ smile: 0.2, brow: 0.5 }} /></>; },
    cam: (t) => { const u = io(seg(t, P(50), P(51))); return { pos: L3([-1.2, 1.2, -2.6], [-2.5, 5.5, -5.5], u), target: [-0.2, 0.8, 1.0], fov: 38 }; } },
];

export const CType: React.FC<{ t: number }> = ({ t }) => (
  <>
    <Chip t={t} at={P(28) + 0.1} out={P(30) - 0.1} text="12 MONTHS AGO · 14 MARCH" y={110} bg={C.navy} color={C.cream} />
    <Chip t={t} at={at(28, "Jamie")} out={at(28, "crossed") + 1} text="JAMIE · 17" y={180} bg="#A0303C" color={C.cream} />
    <Slam t={t} at={at(33, "Ten")} out={at(33, "A") - 0.05} text="10 SECONDS" size={120} y={160} x={110} align="left" color={C.cream} />
    <Slam t={t} at={at(33, "thirty-one")} out={P(34) - 0.05} text="31,536,000 SECONDS" size={110} y={160} x={110} align="left" color={C.amber} glow={C.amber} />
    <Slam t={t} at={at(39, "Winter")} out={at(39, "Autumn") - 0.02} text="WINTER" size={190} y={400} color={C.cool} />
    <Slam t={t} at={at(39, "Autumn")} out={at(39, "Summer") - 0.02} text="AUTUMN" size={190} y={400} color="#E0742A" />
    <Slam t={t} at={at(39, "Summer")} out={at(39, "Spring") - 0.02} text="SUMMER" size={190} y={400} color={C.amber} />
    <Slam t={t} at={at(39, "Spring")} out={at(39, "A") - 0.02} text="SPRING" size={190} y={400} color="#F2A8C8" />
    <Chip t={t} at={at(40, "fourteenth")} out={P(41) - 0.1} text="14 MARCH" y={110} bg={C.red} color={C.cream} />
    <Slam t={t} at={at(40, "Seven")} out={P(41) - 0.1} text="19:58" size={170} y={170} x={110} align="left" color={C.cream} />
    <Chip t={t} at={at(40, "Mill")} out={P(41) - 0.1} text="MILL ROAD" y={380} />
    <Flash t={t} at={P(40)} max={1} len={0.5} />
    <Flash t={t} at={at(36, "run") + 2.6} max={0.6} len={0.3} />
    <Flash t={t} at={tPull} color="#DDEBFF" max={0.5} len={0.25} />
  </>
);
