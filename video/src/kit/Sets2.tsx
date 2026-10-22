import React from "react";
import { AbsoluteFill, random } from "remotion";
import { C, H, W } from "../theme";
import { blinkAt, Character, Pose, POSES } from "./Character";
import { Bokeh } from "./Fx";

const CROWD = ["#e5b53a", "#3f78d6", "#45b56a", "#d8303a", "#8a52c8", "#f08a2c", "#2f9fb8"];

export type Mood = "idle" | "cheer" | "shock" | "frozen" | "sad";

/** A row of front-facing extras in coloured hoodies. */
export const CrowdRow: React.FC<{ x: number; y: number; s?: number; n?: number; mood?: Mood; t?: number; frame?: number; seed?: string; gap?: number }> = ({
  x, y, s = 0.8, n = 5, mood = "idle", t = 0, frame = 0, seed = "cr", gap = 230,
}) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const ph = random(`${seed}${i}`) * 6.28;
      const bob = mood === "cheer" ? Math.sin(t * 9 + ph) * 8 : 0;
      const pose: Pose =
        mood === "cheer" ? { armN: [165 + Math.sin(t * 9 + ph) * 10, 6], armF: [165 - Math.sin(t * 9 + ph) * 10, 6], legN: [8, 0], legF: [8, 0] }
        : mood === "shock" ? POSES.frontFists
        : mood === "sad" ? { armN: [6, 4], armF: [6, 4], legN: [4, 0], legF: [4, 0], head: -4 }
        : POSES.front;
      const expr = mood === "cheer" ? "laugh" : mood === "shock" ? "shock" : mood === "sad" ? "worry" : mood === "frozen" ? "neutral" : "smile";
      return (
        <g key={i} transform={`translate(0,${bob})`}>
          <Character x={x + (i - (n - 1) / 2) * gap * s} y={y} s={s} view="front" outfit="extra" pose={pose} expr={expr}
            blink={mood === "frozen" ? false : blinkAt(frame, i * 17)} rim={C.rim} />
          <circle cx={x + (i - (n - 1) / 2) * gap * s} cy={y - 60 * s} r={0} />
          <style>{``}</style>
        </g>
      );
    })}
  </g>
);

/** Recolour helper: crowd hoodies vary via a CSS filter on the group. */
export const Tint: React.FC<{ color: string; children: React.ReactNode }> = ({ children }) => <g>{children}</g>;

/** School gym: wooden floor with court lines, bleachers with crowd dots, banner. */
export const GymSet: React.FC<{ t: number; children?: React.ReactNode }> = ({ t, children }) => (
  <AbsoluteFill style={{ background: "#2a2236" }}>
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="gymFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b98a52" />
          <stop offset="1" stopColor="#8f6538" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={560} fill="#33293f" />
      {/* bleachers */}
      {[0, 1, 2, 3].map((r) => (
        <g key={r}>
          <rect x={0} y={300 + r * 60} width={W} height={60} fill={r % 2 ? "#3d3250" : "#372c48"} />
          {Array.from({ length: 26 }, (_, i) => (
            <circle key={i} cx={40 + i * 74 + (r % 2) * 37} cy={318 + r * 60} r={16} fill={CROWD[(i + r) % CROWD.length]} opacity={0.55} />
          ))}
        </g>
      ))}
      <rect x={0} y={540} width={W} height={22} fill="#241c30" />
      <rect x={0} y={560} width={W} height={H} fill="url(#gymFloor)" />
      {Array.from({ length: 28 }, (_, i) => <rect key={i} x={i * 70} y={560} width={2} height={H} fill="#7a5530" opacity={0.35} />)}
      <circle cx={960} cy={860} r={220} fill="none" stroke="#f4efe6" strokeWidth={6} opacity={0.7} />
      <line x1={960} y1={560} x2={960} y2={H} stroke="#f4efe6" strokeWidth={6} opacity={0.7} />
      <rect x={60} y={580} width={1800} height={480} fill="none" stroke="#f4efe6" strokeWidth={6} opacity={0.5} />
      <ellipse cx={960} cy={700} rx={700} ry={120} fill="white" opacity={0.05} />
      {/* banner */}
      <rect x={660} y={120} width={600} height={90} rx={10} fill="#8e2b33" />
      <text x={960} y={180} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={44} letterSpacing={8} fill={C.cream}>GO TIGERS</text>
      {[300, 700, 1220, 1620].map((x) => <circle key={x} cx={x} cy={60} r={60} fill="#fff1c9" opacity={0.12} />)}
      {children}
    </svg>
  </AbsoluteFill>
);

/** Dark bedroom with a glowing monitor on a desk. */
export const DarkRoom: React.FC<{ t: number; glow?: string; children?: React.ReactNode }> = ({ t, glow = "#4b7fe0", children }) => (
  <AbsoluteFill style={{ background: "#120f1a" }}>
    <AbsoluteFill style={{ background: `radial-gradient(circle at 1180px 520px, ${glow}66 0px, ${glow}22 420px, transparent 900px)` }} />
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <rect x={0} y={0} width={W} height={H} fill="#1a1524" opacity={0.6} />
      <rect x={120} y={120} width={300} height={200} rx={8} fill="#26203a" />
      <rect x={120} y={120} width={300} height={200} rx={8} fill="none" stroke="#3b3353" strokeWidth={6} />
      <rect x={1500} y={100} width={240} height={340} rx={8} fill="#2a2342" />
      <rect x={0} y={760} width={W} height={H} fill="#1e1829" />
      <rect x={560} y={700} width={1100} height={26} rx={8} fill="#3a2f4a" />
      <rect x={600} y={726} width={30} height={300} fill="#2b2238" />
      <rect x={1590} y={726} width={30} height={300} fill="#2b2238" />
      <ellipse cx={1180} cy={712} rx={360} ry={30} fill={glow} opacity={0.18} />
      {children}
    </svg>
    <Bokeh t={t} n={6} seed="dr" color={glow} opacity={0.2} area={[900, 300, 800, 300]} />
  </AbsoluteFill>
);

/** Bus interior: window strip with scrolling buildings, seat backs. `speed` px/s. */
export const BusInterior: React.FC<{ t: number; speed?: number; children?: React.ReactNode }> = ({ t, speed = 120, children }) => {
  const off = (t * speed) % 900;
  return (
    <AbsoluteFill style={{ background: "#3b3550" }}>
      <svg width={W} height={H} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="busSky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#8d7bb4" />
            <stop offset="1" stopColor="#f0b07a" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={W} height={H} fill="#2f2a42" />
        {/* window */}
        <rect x={120} y={120} width={1680} height={520} rx={28} fill="url(#busSky)" />
        <g clipPath="url(#busClip)">
          <clipPath id="busClip"><rect x={120} y={120} width={1680} height={520} rx={28} /></clipPath>
          {Array.from({ length: 10 }, (_, i) => {
            const bx = ((i * 300 - off) % 2100 + 2100) % 2100 - 200;
            const h = 160 + random(`bh${i}`) * 220;
            return <rect key={i} x={bx} y={640 - h} width={200 + random(`bw${i}`) * 80} height={h} fill="#4b3d60" opacity={0.85} />;
          })}
          <rect x={0} y={600} width={W} height={60} fill="#3a2f4d" />
        </g>
        <rect x={120} y={120} width={1680} height={520} rx={28} fill="none" stroke="#1f1a2c" strokeWidth={18} />
        <rect x={950} y={120} width={14} height={520} fill="#1f1a2c" />
        {/* seats */}
        <rect x={0} y={640} width={W} height={H} fill="#3b3550" />
        <rect x={200} y={700} width={520} height={400} rx={30} fill="#5a4e78" />
        <rect x={1200} y={700} width={520} height={400} rx={30} fill="#5a4e78" />
        <rect x={0} y={880} width={W} height={60} fill="#2a2440" />
        {/* hand rail */}
        <rect x={0} y={60} width={W} height={14} fill="#c9b36a" />
        {children}
      </svg>
    </AbsoluteFill>
  );
};

/** Station platform at dusk. Camera looks across the tracks; the platform edge runs along the bottom third. */
export const PlatformSet: React.FC<{ t: number; night?: number; children?: React.ReactNode; train?: React.ReactNode }> = ({ t, night = 0, children, train }) => (
  <AbsoluteFill style={{ background: "#1c1828" }}>
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="plSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d3470" />
          <stop offset="0.6" stopColor="#8d5f8c" />
          <stop offset="1" stopColor="#e9a06e" />
        </linearGradient>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="url(#plSky)" />
      {/* city */}
      {Array.from({ length: 18 }, (_, i) => {
        const h = 120 + random(`ph${i}`) * 260;
        return (
          <g key={i}>
            <rect x={i * 110 - 20} y={520 - h} width={100} height={h} fill="#2c2340" />
            {Array.from({ length: 4 }, (_, k) => random(`pw${i}${k}`) > 0.5 && <rect key={k} x={i * 110 + 6 + (k % 2) * 46} y={540 - h + Math.floor(k / 2) * 60} width={22} height={30} fill={C.window} opacity={0.7} />)}
          </g>
        );
      })}
      {/* far platform + tracks */}
      <rect x={0} y={520} width={W} height={40} fill="#4a3e5c" />
      <rect x={0} y={560} width={W} height={160} fill="#2a2235" />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 50} y={600} width={26} height={80} fill="#3a2f45" />)}
      <rect x={0} y={612} width={W} height={8} fill="#8c8ca0" />
      <rect x={0} y={664} width={W} height={8} fill="#8c8ca0" />
      {train}
      {/* near platform */}
      <rect x={0} y={720} width={W} height={H} fill="#5b4d70" />
      <rect x={0} y={720} width={W} height={16} fill="#8f7fa8" />
      <rect x={0} y={740} width={W} height={18} fill="#e8c23a" />
      {Array.from({ length: 48 }, (_, i) => <rect key={i} x={i * 40} y={740} width={20} height={18} fill="#2a2235" opacity={0.25} />)}
      <rect x={0} y={760} width={W} height={H} fill="#4f4262" />
      {/* pillars + lamps + sign */}
      {[260, 960, 1660].map((x) => (
        <g key={x}>
          <rect x={x - 22} y={0} width={44} height={720} fill="#3a3050" />
          <rect x={x - 70} y={300} width={140} height={60} rx={8} fill="#1f3b63" />
          <text x={x} y={342} textAnchor="middle" fontFamily="sans-serif" fontWeight={800} fontSize={30} fill="white" letterSpacing={4}>PLATFORM 2</text>
          <circle cx={x} cy={120} r={16} fill="#fff1c9" />
          <circle cx={x} cy={120} r={90} fill="#fff1c9" opacity={0.12} />
        </g>
      ))}
      {children}
    </svg>
    {night > 0 && <AbsoluteFill style={{ background: "#121a3a", mixBlendMode: "multiply", opacity: night }} />}
  </AbsoluteFill>
);
