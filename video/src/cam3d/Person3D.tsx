// A real 3D character built from simple shapes, so it reads correctly from every camera angle:
// glossy black sphere head with cream face marks wrapped on the sphere, a rounded oval torso (jacket),
// shoulder caps, tapered arms and legs with elbows and knees, hands with a thumb and four fingers, shoes with a sole.
// Units: metres-ish. Feet on y = 0, hips at y = 0.8, head centre at about y = 1.56. Facing +z at yaw 0.
import React, { useMemo } from "react";
import * as THREE from "three";

export type Pose3 = {
  lean?: number;     // torso lean forward (deg)
  twist?: number;    // torso twist about y (deg)
  headTurn?: number; // head turn about y (deg), + = to the character's left
  headNod?: number;  // + looks down (deg)
  armL?: Arm; // left arm: forward swing, outward swing, elbow bend, and optional upper-arm roll (deg, + turns the elbow outward/down)
  armR?: Arm;
  legL?: [number, number];         // left leg: forward swing, knee bend (deg)
  legR?: [number, number];
  bob?: number;      // whole body vertical offset
  curl?: number;     // finger curl 0 open .. 1 fist (used when no hand shape is given)
  handL?: HandShape; handR?: HandShape;          // named hand shapes (see HANDS)
  wristL?: [number, number]; wristR?: [number, number]; // wrist bend (deg, + toward the palm) and twist (deg, about the forearm)
};

/** Hand shapes: curl per finger (index, middle, ring, pinky), thumb curl, finger spread. */
export type HandShape = "relaxed" | "open" | "fist" | "point" | "grip" | "pinch" | "wave" | "thumbsUp" | "flat" | "cradle";
export const HANDS: Record<HandShape, { f: [number, number, number, number]; th: number; spread: number }> = {
  relaxed: { f: [0.25, 0.32, 0.4, 0.48], th: 0.25, spread: 0.1 },
  open: { f: [0.05, 0.05, 0.08, 0.1], th: 0.05, spread: 0.6 },
  wave: { f: [0, 0, 0, 0], th: 0, spread: 1 },
  flat: { f: [0, 0, 0, 0], th: 0.3, spread: 0 },
  fist: { f: [1, 1, 1, 1], th: 0.9, spread: 0 },
  point: { f: [0, 1, 1, 1], th: 0.85, spread: 0 },
  grip: { f: [0.62, 0.68, 0.72, 0.78], th: 0.55, spread: 0 },
  pinch: { f: [0.55, 0.85, 0.95, 1], th: 0.6, spread: 0 },
  thumbsUp: { f: [1, 1, 1, 1], th: -0.4, spread: 0 },
  cradle: { f: [0.1, 0.12, 0.16, 0.2], th: 0.55, spread: 0.05 }, // a phone resting on the palm and fingers, screen up
};

export type Arm = [number, number, number] | [number, number, number, number];
export type Face3 = { smile?: number; open?: number; brow?: number; blink?: boolean; eyesBig?: number };

export type Look3 = {
  coat: string; coatDark: string; trousers: string; shoes: string;
  long?: boolean; cap?: string; button?: boolean; sleeveless?: boolean; shorts?: boolean; hoodie?: boolean; beanie?: string; scarf?: string; hoodUp?: boolean; earphones?: boolean; scar?: boolean; whistle?: boolean;
};
export const LOOKS: Record<string, Look3> = {
  hero: { coat: "#E9E2D0", coatDark: "#C9BFA6", trousers: "#2B3042", shoes: "#17101A", button: true },
  oldman: { coat: "#8A6A4A", coatDark: "#634B33", trousers: "#2F3442", shoes: "#1A1410", long: true, cap: "#6A6A72" },
  // the channel hero (2026-10-23): signature blue hoodie, dark jeans, light trainers
  hoodie: { coat: "#2E5FD0", coatDark: "#1F3F94", trousers: "#27324F", shoes: "#E9ECF4", hoodie: true },
  jamie: { coat: "#A0303C", coatDark: "#7A2230", trousers: "#1E222E", shoes: "#E9ECF4", hoodie: true, hoodUp: true, earphones: true },
  coach: { coat: "#2E6A4A", coatDark: "#1F4A34", trousers: "#2E6A4A", shoes: "#151515", cap: "#1B2A4E", whistle: true },
  keeper: { coat: "#C8E04A", coatDark: "#9AB030", trousers: "#1E222E", shoes: "#151515" },
  older: { coat: "#1E3C8A", coatDark: "#142A60", trousers: "#20242F", shoes: "#2A2A2A", hoodie: true, scar: true },
  teacher: { coat: "#6A4E8A", coatDark: "#4E3868", trousers: "#2A2A34", shoes: "#151515", long: true },
  // extras for crowds: varied coats and hats (no sister-channel teal coat or mustard scarf)
  ex1: { coat: "#B8432F", coatDark: "#8A2F20", trousers: "#2B2B33", shoes: "#1A1410", long: true },
  ex2: { coat: "#C9B48A", coatDark: "#A08B62", trousers: "#3A3A44", shoes: "#2A1E16", long: true, beanie: "#5A5A66" },
  ex3: { coat: "#4E7A4A", coatDark: "#36583A", trousers: "#2A2A30", shoes: "#151515", beanie: "#D9472B" },
  ex4: { coat: "#5A5E6E", coatDark: "#40434F", trousers: "#2B2F3A", shoes: "#111111", button: false },
  ex5: { coat: "#E7D9C4", coatDark: "#C6B79F", trousers: "#6A4E3A", shoes: "#3A2A20", scarf: "#7A3E8A" },
  ex6: { coat: "#7A4E8E", coatDark: "#5A3870", trousers: "#2A2236", shoes: "#151515", cap: "#3A4A6A" },
  ex7: { coat: "#2F2F36", coatDark: "#1E1E24", trousers: "#2F2F36", shoes: "#0E0E0E", long: true },
  ex8: { coat: "#E58A3A", coatDark: "#B8682A", trousers: "#27324F", shoes: "#E9ECF4" },
  runner: { coat: "#3D7DCA", coatDark: "#2A5B98", trousers: "#1F2433", shoes: "#F1F4F2" },
};

const D = THREE.MathUtils.degToRad;
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const INK = "#0E070D";
const FACE = "#F4EFE6";

// three-step toon ramp shared by every cloth material: flat light / mid / shade, like the 2D look
const ramp = (() => {
  const data = new Uint8Array([90, 90, 90, 255, 175, 175, 175, 255, 255, 255, 255, 255]);
  const t = new THREE.DataTexture(data, 3, 1, THREE.RGBAFormat);
  t.minFilter = THREE.NearestFilter; t.magFilter = THREE.NearestFilter; t.needsUpdate = true;
  return t;
})();
const toonCache = new Map<string, THREE.MeshToonMaterial>();
export const toon = (c: string) => {
  if (!toonCache.has(c)) toonCache.set(c, new THREE.MeshToonMaterial({ color: c, gradientMap: ramp }));
  return toonCache.get(c)!;
};
const gloss = new THREE.MeshPhysicalMaterial({ color: INK, roughness: 0.22, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.15 });
const faceMat = new THREE.MeshBasicMaterial({ color: FACE });

/** A tapered limb segment hanging down from its joint (length l), with a round cap at the joint. */
const Seg: React.FC<{ l: number; r0: number; r1: number; mat: THREE.Material; cap?: boolean }> = ({ l, r0, r1, mat, cap = true }) => (
  <>
    {cap && <mesh material={mat} castShadow><sphereGeometry args={[r0, 18, 14]} /></mesh>}
    <mesh material={mat} position={[0, -l / 2, 0]} castShadow><cylinderGeometry args={[r0, r1, l, 18]} /></mesh>
  </>
);

/** Hand at the end of the forearm: palm, four two-joint fingers that curl, an opposable thumb, a wrist that bends and twists.
 * Local frame before the wrist: −y runs along the forearm, the palm faces +z. side = +1 left hand, −1 right hand.
 * Default twist turns the palm toward the body when the arm hangs. Props attach at the palm (children). */
const Hand: React.FC<{ shape: HandShape | number; side: number; wrist?: [number, number]; children?: React.ReactNode }> = ({ shape, side, wrist, children }) => {
  const h = typeof shape === "number" ? { f: [shape, shape, shape, shape] as [number, number, number, number], th: shape * 0.8, spread: 0.1 } : HANDS[shape];
  const bend = wrist?.[0] ?? 8, twist = wrist?.[1] ?? -side * 80;
  return (
    <group rotation={[0, D(twist), 0]}>
      <group rotation={[-D(bend), 0, 0]}>
        <mesh material={gloss} scale={[0.046, 0.055, 0.024]} position={[0, -0.045, 0]} castShadow><sphereGeometry args={[1, 16, 12]} /></mesh>
        {[-1.5, -0.5, 0.5, 1.5].map((k, i) => {
          const c = h.f[i], len = i === 3 ? 0.8 : i === 1 ? 1.08 : 1;
          return (
            <group key={k} position={[k * 0.0185, -0.092, 0.004]} rotation={[-D(8 + 70 * c), 0, D(k * 6 * h.spread)]}>
              <mesh material={gloss} position={[0, -0.017 * len, 0]} castShadow><capsuleGeometry args={[0.0102, 0.022 * len, 4, 8]} /></mesh>
              <group position={[0, -0.036 * len, 0]} rotation={[-D(85 * c), 0, 0]}>
                <mesh material={gloss} position={[0, -0.012 * len, 0]}><capsuleGeometry args={[0.0095, 0.016 * len, 4, 8]} /></mesh>
              </group>
            </group>
          );
        })}
        <group position={[side * 0.04, -0.045, 0.012]} rotation={[-D(25 + 45 * Math.max(0, h.th)), 0, side * D(h.th < 0 ? -10 : 40 - 25 * h.th)]}>
          <mesh material={gloss} position={[0, -0.016, 0]} castShadow><capsuleGeometry args={[0.012, 0.022, 4, 8]} /></mesh>
          <group position={[0, -0.032, 0]} rotation={[-D(50 * Math.max(0, h.th)), 0, 0]}>
            <mesh material={gloss} position={[0, -0.011, 0]}><capsuleGeometry args={[0.011, 0.014, 4, 8]} /></mesh>
          </group>
        </group>
        <group position={[0, -0.075, 0.03]}>{children}</group>
      </group>
    </group>
  );
};

/** Shoe: heel, toe pointing forward (+z), a lighter sole. */
const Shoe: React.FC<{ color: string }> = ({ color }) => (
  <group position={[0, -0.03, 0.04]}>
    <mesh material={toon(color)} scale={[0.055, 0.04, 0.12]} castShadow><sphereGeometry args={[1, 16, 12]} /></mesh>
    <mesh material={toon("#3A3040")} position={[0, -0.03, 0]} scale={[0.056, 0.012, 0.122]}><sphereGeometry args={[1, 16, 8]} /></mesh>
  </group>
);

// torso profile (radius, height) from the hips (0) to the neck base (0.52), turned into an oval body
const torsoPts = (long: boolean) => {
  const p: [number, number][] = long
    ? [[0, -0.42], [0.25, -0.42], [0.235, -0.2], [0.2, 0.0], [0.185, 0.12], [0.2, 0.3], [0.215, 0.42], [0.19, 0.48], [0.1, 0.52], [0, 0.53]]
    : [[0, -0.07], [0.205, -0.07], [0.2, 0.02], [0.185, 0.12], [0.2, 0.3], [0.215, 0.42], [0.19, 0.48], [0.1, 0.52], [0, 0.53]];
  return p.map(([r, y]) => new THREE.Vector2(r, y));
};
const DEPTH = 0.66; // torso depth relative to width

/** A cream mark following the head sphere: points given as (azimuth, elevation) in radians. */
const SurfaceLine: React.FC<{ R: number; pts: [number, number][]; w: number }> = ({ R, pts, w }) => {
  const geo = useMemo(() => {
    const v = pts.map(([az, el]) => new THREE.Vector3(R * Math.cos(el) * Math.sin(az), R * Math.sin(el), R * Math.cos(el) * Math.cos(az)));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(v), 24, w, 6, false);
  }, [R, w, JSON.stringify(pts)]);
  return <mesh geometry={geo} material={faceMat} />;
};

/** A ring (eye) or disc (pupil) lying on the head sphere at (azimuth, elevation). */
const OnHead: React.FC<{ R: number; az: number; el: number; children: React.ReactNode }> = ({ R, az, el, children }) => (
  <group rotation={[-el, az, 0]}>
    <group position={[0, 0, R * 0.995]}>{children}</group>
  </group>
);

const Head: React.FC<{ face: Face3; cap?: string; hood?: string; earphones?: boolean }> = ({ face, cap, hood, earphones }) => {
  const R = 0.23;
  const smile = face.smile ?? 0.4, open = face.open ?? 0, brow = face.brow ?? 0, big = face.eyesBig ?? 0;
  const eyeR = 0.036 * (1 + 0.3 * big);
  const ey = face.blink ? 0.12 : 1;
  const mouth: [number, number][] = [-1, -0.5, 0, 0.5, 1].map((s) => [s * 0.27, -0.32 - smile * 0.09 * (1 - s * s)]);
  return (
    <group>
      <mesh material={gloss} castShadow><sphereGeometry args={[R, 40, 30]} /></mesh>
      {[-1, 1].map((e) => (
        <React.Fragment key={e}>
          <OnHead R={R} az={e * 0.33} el={0.08}>
            <mesh material={faceMat} scale={[1, ey, 1]}><torusGeometry args={[eyeR, 0.0085, 8, 28]} /></mesh>
            {!face.blink && <mesh material={faceMat} position={[0, -0.004, 0.004]}><circleGeometry args={[eyeR * 0.42, 18]} /></mesh>}
          </OnHead>
          {/* brow: + brow = worried (inner ends up), − = angry */}
          <SurfaceLine R={R + 0.002} w={0.0075} pts={[[e * 0.2, 0.3 + brow * 0.06], [e * 0.33, 0.32], [e * 0.46, 0.3 - brow * 0.03]]} />
        </React.Fragment>
      ))}
      {open > 0.12 ? (
        <OnHead R={R} az={0} el={-0.34}>
          <mesh material={faceMat} scale={[1, 0.35 + open * 0.9, 1]}><torusGeometry args={[0.032, 0.0085, 8, 24]} /></mesh>
        </OnHead>
      ) : (
        <SurfaceLine R={R + 0.002} w={0.0085} pts={mouth} />
      )}
      {hood && (
        <mesh material={toon(hood)} scale={[1.12, 1.1, 1.12]} position={[0, 0.02, -0.02]} castShadow>
          <sphereGeometry args={[R, 32, 20, D(165), D(210), 0, D(118)]} />
        </mesh>
      )}
      
      {earphones && [-1, 1].map((k) => <mesh key={k} position={[k * R * 0.86, -0.06, R * 0.42]}><sphereGeometry args={[0.022, 10, 8]} /><meshBasicMaterial color="#F4F4F4" /></mesh>)}
      {cap && (
        <group rotation={[D(-8), 0, 0]}>
          <mesh material={toon(cap)} position={[0, 0.07, 0]} scale={[1.04, 0.62, 1.06]}>
            <sphereGeometry args={[R, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
          <mesh material={toon("#55555C")} position={[0, 0.085, R * 0.95]} rotation={[D(12), 0, 0]} scale={[1, 0.14, 0.62]}>
            <cylinderGeometry args={[0.16, 0.16, 0.12, 24, 1, false, -Math.PI / 2, Math.PI]} />
          </mesh>
        </group>
      )}
    </group>
  );
};

export const Person3D: React.FC<{
  pos: [number, number, number]; yaw?: number; pose?: Pose3; face?: Face3; look?: Look3;
  propR?: React.ReactNode; propL?: React.ReactNode; rotX?: number; rotZ?: number; ghost?: number;
}> = ({ pos, yaw = 0, pose = {}, face = {}, look = LOOKS.hero, propR, propL, rotX = 0, rotZ = 0 }) => {
  const lean = pose.lean ?? 0, twist = pose.twist ?? 0;
  const torsoGeo = useMemo(() => new THREE.LatheGeometry(torsoPts(!!look.long), 40), [look.long]);
  const coat = toon(look.coat), coatDark = toon(look.coatDark), legs = toon(look.trousers);
  const arm = (side: 1 | -1, a: Arm = [0, 6, 8], prop?: React.ReactNode) => (
    <group position={[side * 0.215, 0.44, -0.01]}>
      <mesh material={coat} castShadow><sphereGeometry args={[0.078, 18, 14]} /></mesh>
      <group rotation={[0, 0, side * D(clamp(a[1], -10, 170))]}>
        <group rotation={[-D(clamp(a[0], -80, 180)), 0, 0]}>
          <group rotation={[0, side * D(clamp(a[3] ?? 0, -110, 110)), 0]}>
          <Seg l={0.27} r0={0.064} r1={0.055} mat={coat} cap={false} />
          <group position={[0, -0.27, 0]} rotation={[-D(clamp(a[2], 0, 150)), 0, 0]}>
            <Seg l={0.24} r0={0.055} r1={0.046} mat={coat} />
            <mesh material={coatDark} position={[0, -0.235, 0]}><cylinderGeometry args={[0.05, 0.05, 0.03, 16]} /></mesh>
            <group position={[0, -0.25, 0]}><Hand shape={(side === 1 ? pose.handL : pose.handR) ?? (pose.curl !== undefined ? pose.curl : "relaxed")} side={side} wrist={side === 1 ? pose.wristL : pose.wristR}>{prop}</Hand></group>
            {look.scar && side === -1 && <mesh position={[0, -0.12, 0.05]}><boxGeometry args={[0.012, 0.22, 0.012]} /><meshBasicMaterial color="#BFE6FF" toneMapped={false} /></mesh>}
          </group>
          </group>
        </group>
      </group>
    </group>
  );
  const leg = (side: 1 | -1, l: [number, number] = [0, 0]) => (
    <group position={[side * 0.095, 0, 0]} rotation={[-D(clamp(l[0], -90, 135)), 0, 0]}>
      <Seg l={0.39} r0={0.088} r1={0.066} mat={legs} />
      <group position={[0, -0.39, 0]} rotation={[D(clamp(l[1], 0, 150)), 0, 0]}>
        <Seg l={0.36} r0={0.064} r1={0.05} mat={legs} />
        <group position={[0, -0.36, 0]} rotation={[-D(clamp(l[1], 0, 150) - clamp(l[0], -90, 110)) * 0.35, 0, 0]}><Shoe color={look.shoes} /></group>
      </group>
    </group>
  );
  const fz = (r: number) => r * DEPTH + 0.006; // front surface of the oval torso
  return (
    <group position={pos} rotation={[0, yaw, 0]}>
      <group rotation={[rotX, 0, rotZ]}>
      <group position={[0, 0.8 + (pose.bob ?? 0), 0]}>
        {leg(1, pose.legL)}
        {leg(-1, pose.legR)}
        {/* pelvis under the jacket hem */}
        <mesh material={legs} position={[0, -0.02, 0]} scale={[0.2, 0.1, 0.2 * DEPTH * 1.1]} castShadow><sphereGeometry args={[1, 20, 12]} /></mesh>
        <group rotation={[D(lean), D(twist), 0]}>
          <mesh geometry={torsoGeo} material={coat} scale={[1, 1, DEPTH]} castShadow receiveShadow />
          {/* buttons on the front: ONE vermilion button at the top, three cream below */}
          {look.button && (
            <>
              <mesh position={[0.035, 0.38, fz(0.205)]}><sphereGeometry args={[0.019, 14, 10]} /><meshToonMaterial color="#D9472B" gradientMap={ramp} /></mesh>
              {[0.26, 0.16, 0.06].map((y) => (
                <mesh key={y} position={[0.035, y, fz(0.19)]} material={toon("#F6F1E6")}><sphereGeometry args={[0.012, 10, 8]} /></mesh>
              ))}
            </>
          )}
          {/* collar ring around the neck (jackets) or the hoodie's hood, drawstrings, pocket and ribbed hem */}
          {!look.hoodie && <mesh material={coatDark} position={[0, 0.5, 0.005]} scale={[1, 1, 0.85]}><cylinderGeometry args={[0.085, 0.13, 0.07, 24, 1, true]} /></mesh>}
          {look.hoodie && (
            <>
              <mesh material={coat} position={[0, 0.5, -0.01]} rotation={[Math.PI / 2 + D(14), 0, 0]} scale={[1, 0.85, 1]} castShadow><torusGeometry args={[0.12, 0.052, 12, 28]} /></mesh>
              <mesh material={coat} position={[0, 0.45, -0.14]} rotation={[D(-20), 0, 0]} scale={[0.15, 0.13, 0.08]} castShadow><sphereGeometry args={[1, 18, 12]} /></mesh>
              <mesh material={coatDark} position={[0, 0.455, -0.2]} rotation={[D(-20), 0, 0]} scale={[0.09, 0.07, 0.03]}><sphereGeometry args={[1, 14, 10]} /></mesh>
              {[-1, 1].map((k) => (
                <group key={k} position={[k * 0.045, 0.46, fz(0.2) + 0.012]} rotation={[D(-6), 0, k * D(4)]}>
                  <mesh material={toon("#EDEBE4")} position={[0, -0.07, 0]}><cylinderGeometry args={[0.006, 0.006, 0.14, 6]} /></mesh>
                  <mesh material={toon("#C9C4B8")} position={[0, -0.145, 0]}><cylinderGeometry args={[0.009, 0.009, 0.022, 8]} /></mesh>
                </group>
              ))}
              <mesh material={coatDark} position={[0, 0.1, fz(0.188) - 0.004]} scale={[0.135, 0.065, 0.02]}><sphereGeometry args={[1, 20, 10]} /></mesh>
              <mesh material={coatDark} position={[0, -0.045, 0]} scale={[1, 1, DEPTH]}><cylinderGeometry args={[0.208, 0.206, 0.05, 32, 1, true]} /></mesh>
            </>
          )}
          {arm(1, pose.armL, propL)}
          {arm(-1, pose.armR, propR)}
          <mesh material={gloss} position={[0, 0.58, 0]}><cylinderGeometry args={[0.055, 0.06, 0.12, 16]} /></mesh>
          {look.whistle && <mesh position={[0.04, 0.3, 0.15]} material={toon("#D9D9D9")}><boxGeometry args={[0.05, 0.025, 0.03]} /></mesh>}
          {look.scarf && <mesh material={toon(look.scarf)} position={[0, 0.52, 0.0]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.9, 1]}><torusGeometry args={[0.1, 0.045, 10, 24]} /></mesh>}
          <group position={[0, 0.79, 0.01]} rotation={[D(pose.headNod ?? 0), D(pose.headTurn ?? 0), 0]}>
            <Head face={face} cap={look.cap} hood={look.hoodUp ? look.coat : undefined} earphones={look.earphones} />
            {look.beanie && (
              <group>
                <mesh material={toon(look.beanie)} position={[0, 0.06, -0.01]} scale={[1.06, 0.8, 1.06]}><sphereGeometry args={[0.23, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
                <mesh material={toon(look.beanie)} position={[0, 0.07, -0.01]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.235, 0.025, 8, 32]} /></mesh>
              </group>
            )}
          </group>
        </group>
      </group>
      </group>
    </group>
  );
};

// ─── poses ───────────────────────────────────────────────────────────────────
export const SIT: Pose3 = { lean: 4, armL: [40, 6, 60], armR: [40, 6, 60], legL: [90, 90], legR: [86, 88], bob: -0.38 };
export const STAND: Pose3 = { armL: [4, 7, 10], armR: [4, 7, 10], legL: [2, 2], legR: [-2, 2] };

/** Walk: phase in cycles (1 = one full stride pair). Knee straight at contact, most bent mid-swing; arms opposite. */
export const walk3 = (ph: number, amp = 1): Pose3 => {
  const a = ph * Math.PI * 2;
  const leg = (p: number): [number, number] => [26 * amp * Math.sin(p), 6 + 46 * amp * Math.max(0, Math.cos(p - 0.6))];
  const armSw = (p: number): [number, number, number] => [-22 * amp * Math.sin(p), 7, 14 + 18 * Math.max(0, -Math.sin(p))];
  return { lean: 4, legL: leg(a), legR: leg(a + Math.PI), armL: armSw(a), armR: armSw(a + Math.PI), bob: -0.02 * Math.abs(Math.cos(a)) };
};

/** Run: longer stride, high knee, elbows at about 90 degrees, forward lean. */
export const run3 = (ph: number): Pose3 => {
  const a = ph * Math.PI * 2;
  const leg = (p: number): [number, number] => [42 * Math.sin(p), 18 + 95 * Math.max(0, Math.cos(p - 0.9))];
  const armSw = (p: number): [number, number, number] => [-46 * Math.sin(p), 10, 85];
  return { lean: 14, legL: leg(a), legR: leg(a + Math.PI), armL: armSw(a), armR: armSw(a + Math.PI), bob: 0.05 * Math.abs(Math.sin(a)) - 0.02, curl: 0.9 };
};

export const mix3 = (a: Pose3, b: Pose3, u: number): Pose3 => {
  const m = (x = 0, y = 0) => x + (y - x) * u;
  const m2 = (x: [number, number] = [0, 0], y: [number, number] = [0, 0]): [number, number] => [m(x[0], y[0]), m(x[1], y[1])];
  const m3 = (x: Arm = [0, 0, 0], y: Arm = [0, 0, 0]): Arm => [m(x[0], y[0]), m(x[1], y[1]), m(x[2], y[2]), m(x[3] ?? 0, y[3] ?? 0)];
  return {
    lean: m(a.lean, b.lean), twist: m(a.twist, b.twist), headTurn: m(a.headTurn, b.headTurn), headNod: m(a.headNod, b.headNod),
    armL: m3(a.armL, b.armL), armR: m3(a.armR, b.armR), legL: m2(a.legL, b.legL), legR: m2(a.legR, b.legR), bob: m(a.bob, b.bob), curl: m(a.curl ?? 0.35, b.curl ?? 0.35),
    handL: u < 0.5 ? a.handL : b.handL, handR: u < 0.5 ? a.handR : b.handR,
    wristL: a.wristL || b.wristL ? m2(a.wristL ?? [8, -80], b.wristL ?? [8, -80]) : undefined, wristR: a.wristR || b.wristR ? m2(a.wristR ?? [8, 80], b.wristR ?? [8, 80]) : undefined,
  };
};
