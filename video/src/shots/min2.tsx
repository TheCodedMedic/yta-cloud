// Beats 9-18: blinks, toast and ice cream, online games, dodgeball, the cost.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, Stage } from "../kit/Camera";
import { blinkAt, Character, handPos, mixPose, Pose, POSES, seatLayout } from "../kit/Character";
import { clamp01, Dust, easeOut, lerp, Rings, sstep, Streaks } from "../kit/Fx";
import { Chip, Label, Stamp, Stopwatch } from "../kit/Graphics";
import { Bubble, Caption, Cards, Counter, LoadingBar, ThoughtStack, TwinDials } from "../kit/Graphics2";
import { Hand } from "../kit/Hand";
import { Chair, Cup, Table } from "../kit/Props";
import { Ball, Cone, Monitor, Plate, Scoop, Toast } from "../kit/Props2";
import { BusInterior, CrowdRow, DarkRoom, GymSet } from "../kit/Sets2";
import { at, end, PG, PS } from "../timing";
import { C, FONT_UI } from "../theme";
import { CafeBg, TableTop } from "./scenes";
import { Flash, Shot } from "./types";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const L = { hip: 760, ...seatLayout(760, 1) };

const heroClose = (t: number, frame: number, expr: any, opts: { look?: [number, number]; pose?: Pose; glow?: number; x?: number; view?: "side" | "front"; blink?: boolean } = {}) => (
  <Stage>
    <Character x={opts.x ?? 960} y={990} s={2.7} view={opts.view ?? "side"} pose={opts.pose ?? (opts.view === "front" ? POSES.front : { lean: 4, armN: [14, 18], armF: [6, 16] })}
      expr={expr} look={opts.look ?? [0.3, 0.1]} blink={opts.blink ?? blinkAt(frame, 11)} brainGlow={opts.glow} />
  </Stage>
);

const Terrace: React.FC<{ t: number; frame: number; heroPose?: Pose; friendPose?: Pose; heroExpr?: any; friendExpr?: any; friend?: boolean; heroLook?: [number, number] }> = ({
  t, frame, heroPose = POSES.sitTable, friendPose = POSES.sitTable, heroExpr = "smile", friendExpr = "laugh", friend = true, heroLook = [0.4, 0.2],
}) => (
  <Stage>
    <Chair x={740} y={L.seatY} s={0.9} legs={L.chairLegs / 0.9} />
    <Chair x={1180} y={L.seatY} s={0.9} facing={-1} legs={L.chairLegs / 0.9} />
    <Character x={750} y={L.hip} s={1.0} pose={heroPose} expr={heroExpr} look={heroLook} blink={blinkAt(frame, 7)} />
    {friend && <Character x={1170} y={L.hip} s={1.0} facing={-1} outfit="friend" pose={friendPose} expr={friendExpr} blink={blinkAt(frame, 40)} />}
    <Table x={960} y={L.tableTopY} s={0.9} h={L.tableH / 0.9} />
    <Cup x={895} y={L.tableTopY - 2} s={0.42} t={t} />
  </Stage>
);

export const MIN2_END = PG(18);

export const FLASHES2: Flash[] = [
  { t: at(10, "Caught", 1), x: 1000, y: 760, strength: 0.8 },
  { t: at(10, "Caught", 2), x: 1100, y: 620, strength: 0.8 },
  { t: at(11, "Hacker"), strength: 0.5 },
  { t: at(12, "Not"), strength: 0.6 },
  { t: at(13, "weird"), strength: 0.3 },
];

const POCKETS: Pose = { lean: 0, armN: [10, -34], armF: [10, -34], legN: [8, 0], legF: [8, 0] };

export const MIN2: Shot[] = [
  // ── Beat 9: a blink ───────────────────────────────────────────────────────
  {
    id: "blink1", t0: PS(9), t1: at(9, "For"),
    render: (t, u, f) => {
      const b = at(9, "blink", 1);
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[760, 640, 2.2]} b={[740, 640, 2.26]} blur={12} />
          {heroClose(t, f, "smile", { look: [0.2, 0], blink: t >= b && t < b + 0.1 })}
          <Stopwatch x={1560} y={110} t={0} value="0.1 s" popT={t - at(9, "tenth")} sweep={0} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "blackout", t0: at(9, "For"), t1: at(9, "You", 2), bars: "tight", cool: 0.2,
    render: (t, u, f) => {
      const b = at(9, "blink", 2);
      const dark = t >= b && t < b + 1.15;
      const timer = clamp01((t - b) / 1.0);
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[760, 640, 2.2]} blur={12} />
          {heroClose(t, f, t > b + 1.15 ? "shock" : "smile", { look: [0.2, 0], blink: false })}
          {dark && (
            <AbsoluteFill style={{ background: "#000" }}>
              <div style={{ position: "absolute", left: "50%", top: 420, transform: "translateX(-50%)", fontFamily: FONT_UI, fontWeight: 800, fontSize: 200, color: C.gold, letterSpacing: 6 }}>
                {timer.toFixed(2)} s
              </div>
              <Label x={960} y={690} t={t - at(9, "full")} text="A FULL SECOND OF DARKNESS" size={48} />
            </AbsoluteFill>
          )}
        </AbsoluteFill>
      );
    },
  },
  {
    id: "noblink", t0: at(9, "You", 2), t1: PS(10),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[960, 640, 2.0]} b={[960, 620, 2.1]} blur={12} />
        {heroClose(t, f, "determined", { view: "front", look: [0, -0.2], blink: false })}
        <Dust t={t} n={20} seed="nb" />
        <Chip x={960} y={230} t={t - at(9, "less")} text="BLINKS: 15/MIN → 2/MIN" accent={C.gold} />
      </AbsoluteFill>
    ),
  },
  // ── Beat 10: toast, ice cream ─────────────────────────────────────────────
  {
    id: "toast", t0: PS(10), t1: at(10, "Your"),
    render: (t, u) => {
      const sl = at(10, "slides"), c = at(10, "Caught", 1);
      const slide = easeOut(seg(t, sl, sl + 0.6), 1.5);
      const fall = seg(t, sl + 0.5, c);
      const reach = easeOut(seg(t, c - 0.22, c), 2);
      const caught = t >= c;
      const tx = caught ? 1120 : lerp(560, 1080, slide) + fall * 60;
      const ty = caught ? 700 : 690 + fall * fall * 380;
      const rot = caught ? 0 : slide * 25 + fall * 160;
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} edge />
          <Stage>
            <Plate x={560} y={720} s={1.1} />
            {!caught && <Toast x={tx} y={ty} s={1.1} rot={rot} />}
            <Hand x={lerp(-200, 1060, reach)} y={lerp(1150, 760, reach)} s={1.5} rot={-20} curl={0.15} />
            {caught && <Toast x={tx} y={ty} s={1.1} rot={-6} />}
            <Rings t={t - c - 0.05} cx={1120} cy={700} scale={0.9} />
          </Stage>
          <Caption t={t - at(10, "butter")} text="BUTTER SIDE UP." />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "icecream", t0: at(10, "Your"), t1: PS(11),
    render: (t, u, f) => {
      const tip = at(10, "tips"), c = at(10, "Caught", 2), back = at(10, "back");
      const tilt = easeOut(seg(t, tip - 0.4, tip + 0.1));
      const fall = seg(t, tip, c);
      const reach = easeOut(seg(t, c - 0.3, c), 3);
      const ret = easeOut(seg(t, at(10, "placed"), back + 0.2), 2);
      const pose: Pose = { lean: 0, armN: [70 - tilt * 25, 95 - tilt * 60], armF: [8, 10], legN: [6, 0], legF: [6, 0] };
      const [hx, hy] = handPos(760, 1010, 2.4, 1, pose, "N", "front");
      const coneTop: [number, number] = [hx + 10, hy - 150];
      const scoop: [number, number] = t < tip ? [coneTop[0], coneTop[1] - 40]
        : t < c ? [coneTop[0] + fall * 260, coneTop[1] - 40 + fall * fall * 520]
        : [lerp(coneTop[0] + 260, coneTop[0], ret), lerp(coneTop[1] + 480, coneTop[1] - 40, ret)];
      const handXY: [number, number] = t < c ? [lerp(2300, coneTop[0] + 330, reach), lerp(1000, coneTop[1] + 500, reach)]
        : [lerp(coneTop[0] + 330, coneTop[0] + 70, ret), lerp(coneTop[1] + 500, coneTop[1] - 20, ret)];
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[960, 700, 1.6]} blur={8} />
          <Stage>
            <Character x={760} y={1010} s={2.4} view="front" outfit="sister" pose={pose}
              expr={t < tip ? "happy" : t < at(10, "top") ? "shock" : "laugh"} blink={blinkAt(f, 23)} />
            <Cone x={coneTop[0]} y={coneTop[1]} s={1.3} rot={-tilt * 28} />
            {t > c - 0.3 && <Hand x={handXY[0]} y={handXY[1]} s={0.85} rot={200} curl={0.25} />}
            <Scoop x={scoop[0]} y={scoop[1]} s={1.3} />
            <Rings t={t - c - 0.05} cx={scoop[0]} cy={scoop[1]} scale={0.8} />
          </Stage>
          <Caption t={t - at(10, "top")} text="RIGHT BACK ON TOP." />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 11: online games ─────────────────────────────────────────────────
  {
    id: "gamer", t0: PS(11), t1: at(11, "By"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <DarkRoom t={t}>
          <Chair x={880} y={L.seatY + 20} s={0.9} legs={L.chairLegs / 0.9} />
          <Character x={890} y={L.hip + 20} s={1.0} pose={{ lean: 10, armN: [62, 40 + Math.sin(t * 22) * 6], armF: [56, 36 - Math.sin(t * 22) * 6], legN: [88, -92], legF: [82, -88] }} expr="determined" look={[0.9, 0]} blink={blinkAt(f, 9)} rim={C.rimCold} rimDir={[1, -0.3]} />
          <Monitor x={1180} y={600} s={1.1} />
        </DarkRoom>
      </AbsoluteFill>
    ),
  },
  {
    id: "gamescreen", t0: at(11, "By"), t1: at(11, "Forty"),
    render: (t) => {
      const see = at(11, "see"), moved = at(11, "already");
      const k = sstep(seg(t, moved, moved + 0.3));
      const hx = lerp(1000, 1500, k), hy = lerp(600, 420, k);
      return (
        <AbsoluteFill style={{ background: "#0d1a2b" }}>
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            <defs>
              <pattern id="ggrid" width={60} height={60} patternUnits="userSpaceOnUse"><path d="M60,0 L0,0 0,60" fill="none" stroke="#1f3650" strokeWidth={1} /></pattern>
            </defs>
            <rect width={1920} height={1080} fill="url(#ggrid)" />
            <rect x={200} y={160} width={1520} height={760} fill="none" stroke="#2c4f73" strokeWidth={4} />
            {/* enemy players with view cones */}
            {[[420, 300], [520, 760], [1380, 820]].map(([ex, ey], i) => {
              const ang = Math.atan2(hy - ey, hx - ex);
              const seen = t >= see;
              return (
                <g key={i}>
                  <path d={`M${ex},${ey} L${ex + Math.cos(ang - 0.35) * 700},${ey + Math.sin(ang - 0.35) * 700} L${ex + Math.cos(ang + 0.35) * 700},${ey + Math.sin(ang + 0.35) * 700} Z`} fill={seen ? "#e0b140" : "#4b7fe0"} opacity={0.12} />
                  <circle cx={ex} cy={ey} r={26} fill="#4b7fe0" />
                  <circle cx={ex} cy={ey} r={10} fill="#0d1a2b" />
                </g>
              );
            })}
            {/* hero: ghost at the old spot, real at the new one */}
            {t >= moved && <circle cx={1000} cy={600} r={28} fill="none" stroke={C.gold} strokeWidth={3} strokeDasharray="8 8" opacity={0.7} />}
            {t >= moved && <path d={`M1000,600 L${hx},${hy}`} stroke={C.gold} strokeWidth={3} strokeDasharray="10 10" opacity={0.6} />}
            <circle cx={hx} cy={hy} r={28} fill={C.hoodie} />
            <circle cx={hx} cy={hy} r={10} fill="#0d1a2b" />
            <Rings t={t - moved} cx={1000} cy={600} scale={0.6} color={C.gold} />
          </svg>
          <Label x={960} y={110} t={t - see} text="THEY SEE YOU HERE" color="#e0b140" />
          <Label x={1500} y={340} t={t - moved} text="ALREADY MOVED" color={C.gold} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "wins", t0: at(11, "Forty"), t1: at(11, "Your"),
    render: (t) => {
      const n = Math.round(lerp(1, 40, easeOut(seg(t, at(11, "Forty"), at(11, "row")), 1.5)));
      return (
        <AbsoluteFill style={{ background: "#0d1a2b" }}>
          <Streaks t={t} n={30} speed={1600} opacity={0.2} />
          <Counter x={960} y={480} t={t - at(11, "Forty")} value={String(n)} label="WINS IN A ROW" />
          <svg width={1920} height={1080} style={{ position: "absolute" }}><Rings t={t - at(11, "row")} cx={960} cy={460} scale={1.5} color={C.gold} /></svg>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "inbox", t0: at(11, "Your"), t1: PS(12),
    render: (t) => {
      const f0 = at(11, "fills");
      const items = ["HACKER", "hacker.", "HACKER??", "reported", "hacker", "HACKER!!!", "aimbot", "HACKER"].map((text, i) => ({ user: ["xX_sniper_Xx", "noodle42", "pro_gamer_99", "meg", "kaz", "rooky", "tilt3d", "gg_ez"][i], text, at: f0 + i * 0.22 }));
      return (
        <AbsoluteFill style={{ background: "#0d1a2b" }}>
          <DarkRoom t={t} />
          <AbsoluteFill style={{ background: "#0d1a2b", opacity: 0.5 }} />
          <Cards t={t} items={items} seed="hk" />
          <Stamp x={960} y={540} t={t - at(11, "Hacker")} text="HACKER" color="#ff5a5a" />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 12: dodgeball ────────────────────────────────────────────────────
  {
    id: "gymwide", t0: PS(12), t1: at(12, "You"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <GymSet t={t}>
          <CrowdRow x={960} y={520} s={0.55} n={7} mood="idle" t={t} frame={f} gap={260} />
          <Character x={960} y={880} s={0.95} view="front" pose={POCKETS} expr="deadpan" blink={blinkAt(f, 3)} />
          {[0, 1, 2, 3].map((i) => {
            const ph = ((t * 1.6 + i * 0.37) % 1);
            const fromL = i % 2 === 0;
            return <Ball key={i} x={fromL ? lerp(-100, 2020, ph) : lerp(2020, -100, ph)} y={760 + Math.sin(ph * Math.PI) * -200 + i * 30} s={0.9} rot={ph * 720} color={["#d8303a", "#3f78d6", "#e5b53a", "#45b56a"][i]} />;
          })}
        </GymSet>
        <Caption t={t - at(12, "nature")} text="A NATURE DOCUMENTARY." />
      </AbsoluteFill>
    ),
  },
  {
    id: "pockets", t0: at(12, "You"), t1: at(12, "and"),
    render: (t, u, f) => {
      const shots = [at(12, "stand"), at(12, "middle"), at(12, "hands"), at(12, "pockets")];
      return (
        <AbsoluteFill>
          <GymSet t={t}>
            <CrowdRow x={960} y={520} s={0.55} n={7} mood="shock" t={t} frame={f} gap={260} />
          </GymSet>
          <AbsoluteFill style={{ filter: "blur(6px)", opacity: 0.001 }} />
          <Stage>
            <Character x={960} y={1010} s={2.2} view="front" pose={POCKETS} expr="deadpan" look={[0, 0]} blink={blinkAt(f, 3)} />
            {shots.map((s0, i) => {
              const k = (t - s0) / 0.28;
              if (k < 0 || k > 1) return null;
              const fromL = i % 2 === 0;
              const x = fromL ? lerp(-150, 2070, k) : lerp(2070, -150, k);
              const y = 420 + i * 90;
              return (
                <g key={i}>
                  <line x1={x} y1={y} x2={x + (fromL ? -500 : 500)} y2={y} stroke="white" strokeWidth={6} opacity={0.5} strokeLinecap="round" />
                  <Ball x={x} y={y} s={1.5} rot={k * 900} color={["#d8303a", "#3f78d6", "#e5b53a", "#45b56a"][i]} />
                </g>
              );
            })}
          </Stage>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "nobody", t0: at(12, "and"), t1: PS(13),
    render: (t, u, f) => (
      <AbsoluteFill>
        <GymSet t={t}>
          <CrowdRow x={960} y={520} s={0.55} n={7} mood={t > at(12, "Not") ? "cheer" : "shock"} t={t} frame={f} gap={260} />
          {[0, 1, 2, 3].map((i) => {
            const b = Math.abs(Math.sin(t * 5 + i)) * 120;
            return <Ball key={i} x={560 + i * 270} y={1000 - b} s={0.9} rot={t * 300} color={["#d8303a", "#3f78d6", "#e5b53a", "#45b56a"][i]} />;
          })}
          <Character x={960} y={880} s={0.95} view="front" pose={POCKETS} expr={t > at(12, "Not") ? "smug" : "deadpan"} blink={blinkAt(f, 3)} />
          <Rings t={t - at(12, "Not")} cx={960} cy={760} scale={1.3} color={C.gold} />
        </GymSet>
        <Stamp x={960} y={300} t={t - at(12, "Not")} text="NOT ONCE." />
      </AbsoluteFill>
    ),
  },
  // ── Beat 13: things get weird ─────────────────────────────────────────────
  {
    id: "weird", t0: PS(13), t1: PS(14), bars: "tight", cool: 0.35,
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[760, 640, 2.2]} b={[760, 600, 2.35]} blur={14} dim={0.35} />
        <Cam u={u} a={[960, 540, 1]} b={[960, 500, 1.1]} t={t}>{heroClose(t, f, t > at(13, "weird") ? "worry" : "think", { look: [0.5, -0.3] })}</Cam>
        <Dust t={t * 0.2} n={30} seed="wd" />
      </AbsoluteFill>
    ),
  },
  // ── Beat 14: burning energy, five meals ───────────────────────────────────
  {
    id: "burning", t0: PS(14), t1: at(14, "You"),
    render: (t, u, f) => {
      const g = 0.6 + Math.sin(t * 14) * 0.3;
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[760, 640, 2.2]} blur={12} dim={0.2} />
          {heroClose(t, f, "worry", { view: "front", look: [0, -0.3], glow: g })}
          <Streaks t={t} n={14} speed={-900} opacity={0.18} seed="heat" />
          <Chip x={1380} y={300} t={t - at(14, "gaming")} text="GAMING PC MODE" accent="#ff7a3c" />
          <Chip x={1380} y={400} t={t - at(14, "computer")} text="FAN: 100%" accent="#ff7a3c" size={32} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "meals", t0: at(14, "You"), t1: PS(15),
    render: (t, u) => {
      const f0 = at(14, "five");
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} />
          <Stage>
            {[0, 1, 2, 3, 4].map((i) => {
              const k = easeOut(seg(t, f0 + i * 0.14, f0 + i * 0.14 + 0.25), 3);
              if (k <= 0) return null;
              return <g key={i} transform={`translate(0,${(1 - k) * -120})`} opacity={k}><Plate x={420 + i * 270} y={880 - (i % 2) * 90} s={0.9} /></g>;
            })}
          </Stage>
          <Counter x={960} y={330} t={t - f0} value={String(Math.min(5, 1 + Math.floor((t - f0) / 0.14)))} label="MEALS A DAY" size={150} />
          <Caption t={t - at(14, "hungry")} text="STILL HUNGRY." />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 15: loading screens ──────────────────────────────────────────────
  {
    id: "loading", t0: PS(15), t1: at(15, "Your"),
    render: (t, u, f) => {
      const k = seg(t, PS(15), at(15, "Your"));
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[1160, 640, 2.2]} blur={12} />
          <Stage>
            <Character x={1000} y={990} s={2.7} facing={-1} outfit="friend" pose={{ lean: 2, armN: [40, 60 + Math.sin(t * 6) * 10], armF: [10, 16] }} expr="happy" blink={blinkAt(f, 30)} />
          </Stage>
          <Bubble x={470} y={400} t={t - PS(15)} text="SO BASICALLY WHAT HAPPENED WAS" tail="right" crawl={k * 0.55} size={38} />
          <LoadingBar x={470} y={500} w={460} frac={k * 0.55} label={`LOADING… ${Math.round(k * 55)}%`} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "stack", t0: at(15, "Your"), t1: PS(16),
    render: (t, u, f) => {
      const k = seg(t, at(15, "Your"), PS(16));
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[960, 640, 1.5]} blur={6} />
          <Cam u={u} a={[960, 540, 1]} b={[960, 540, 1.06]} t={t}>
            <Terrace t={t} frame={f} heroExpr={t > at(15, "bored") ? "deadpan" : "smug"} friendExpr="happy"
              friendPose={{ ...POSES.sitTable, armN: [70, 50 + Math.sin(t * 6) * 12] }} heroLook={[0.3, 0.3]} />
          </Cam>
          <Bubble x={1240} y={430} t={t - at(15, "friend")} text="SO BASICALLY WHAT—" tail="down" crawl={k * 0.7} size={32} />
          <ThoughtStack x={300} y={250} t={t} size={32} lines={[
            { text: "…HAPPENED WAS THE DOG.", at: at(15, "guessed") },
            { text: "YEAH. CLASSIC.", at: at(15, "answered") },
            { text: "OK.", at: at(15, "head") },
            { text: "…", at: at(15, "bored") },
          ]} />
          <Caption t={t - at(15, "bored")} text="LOADING… 71%" size={44} />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 16: bus ride, school day ─────────────────────────────────────────
  {
    id: "bus", t0: PS(16), t1: at(16, "A", 3),
    render: (t, u, f) => {
      const slow = t > at(16, "feels") ? 25 : 140;
      return (
        <AbsoluteFill>
          <BusInteriorWrap t={t} speed={slow} f={f} />
          <TwinDials x={1400} y={160} t={t - at(16, "ten")} s={1.1}
            a={{ label: "THE BUS", value: "10 MIN", frac: (t * 0.1) % 1 }}
            b={{ label: "TO YOU", value: t > at(16, "hour") ? "1 H 30" : "…", frac: (t * 1.0) % 1, color: C.gold }} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "schoolweek", t0: at(16, "A", 3), t1: PS(17),
    render: (t) => {
      const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
      const k = seg(t, at(16, "day"), at(16, "week"));
      return (
        <AbsoluteFill style={{ background: "#14202e" }}>
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {days.map((d, i) => (
              <g key={d} transform={`translate(${260 + i * 235},540)`}>
                <rect x={-95} y={-140} width={190} height={280} rx={14} fill={i < Math.ceil(k * 7) ? C.amber : "#1f3650"} opacity={i < Math.ceil(k * 7) ? 0.9 : 1} stroke="#2c4f73" strokeWidth={3} />
                <text x={0} y={-80} textAnchor="middle" fontFamily={FONT_UI} fontWeight={800} fontSize={40} fill={C.cream} letterSpacing={4}>{d}</text>
                {i === 0 && <circle cx={0} cy={40} r={44} fill="none" stroke={C.gold} strokeWidth={6} />}
              </g>
            ))}
          </svg>
          <Label x={960} y={160} t={t - at(16, "school")} text="ONE SCHOOL DAY" size={50} />
          <Stamp x={960} y={900} t={t - at(16, "week")} text="FEELS LIKE A WEEK" />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 17: finishing sentences, then jokes ──────────────────────────────
  {
    id: "finishing", t0: PS(17), t1: at(17, "And"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[960, 640, 1.5]} blur={6} />
        <Terrace t={t} frame={f} heroExpr="smug" friendExpr={t > at(17, "jokes") ? "deadpan" : "happy"}
          friendPose={{ ...POSES.sitTable, armN: [70, 50 + Math.sin(t * 5) * 12] }} />
        <Bubble x={1230} y={430} t={t - PS(17)} text="SO YESTERDAY I—" tail="down" size={32} fade={t < at(17, "finishing") + 0.4 ? 1 : 0.35} />
        <Bubble x={690} y={430} t={t - at(17, "finishing")} text="—WENT TO THE DENTIST." tail="down" size={32} fade={t < at(17, "Then") ? 1 : 0.35} />
        <Bubble x={1230} y={300} t={t - at(17, "Then")} text="AND THEN THE DOG—" tail="down" size={32} fade={t < at(17, "jokes") + 0.3 ? 1 : 0.35} />
        <Bubble x={690} y={300} t={t - at(17, "jokes")} text="—ATE THE REMOTE." tail="down" size={32} />
      </AbsoluteFill>
    ),
  },
  {
    id: "nojokes", t0: at(17, "And"), t1: PS(18), bars: "tight",
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[1160, 640, 2.2]} b={[1160, 600, 2.3]} blur={12} dim={0.2} />
        <Stage>
          <Character x={1000} y={990} s={2.7} facing={-1} outfit="friend" pose={{ lean: 0, armN: [10, 16], armF: [10, 16], head: t > at(17, "stops") ? -6 : 0 }}
            expr={t > at(17, "stops") ? "worry" : "deadpan"} blink={blinkAt(f, 30)} />
        </Stage>
        <Bubble x={560} y={420} t={t - at(17, "stops")} text="…" tail="right" size={44} fade={clamp01((PS(18) - t) / 0.6)} />
      </AbsoluteFill>
    ),
  },
  // ── Beat 18: a lonely way to live ─────────────────────────────────────────
  {
    id: "lonely", t0: PS(18), t1: PS(19), bars: "tight", cool: 0.3,
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[960, 640, 1.3]} b={[960, 660, 1.5]} blur={2} dim={0.45} />
        <Cam u={u} a={[960, 560, 1]} b={[900, 600, 1.12]} t={t}>
          <Terrace t={t} frame={f} friend={false} heroExpr="neutral" heroPose={{ ...POSES.sitTable, armN: [40, 50], armF: [36, 44], head: -4 }} heroLook={[0.1, 0.4]} />
        </Cam>
        <Dust t={t * 0.3} n={30} seed="ln" />
        <Caption t={t - at(18, "lonely")} text="A LONELY WAY TO LIVE." size={50} />
      </AbsoluteFill>
    ),
  },
];

// Bus with the hero seated by the window (kept separate so the set stays generic).
const BusInteriorWrap: React.FC<{ t: number; speed: number; f: number }> = ({ t, speed, f }) => {
  return (
    <BusInterior t={t} speed={speed}>
      <Character x={470} y={760} s={1.1} pose={{ lean: -4, armN: [30, 70], armF: [26, 64], legN: [88, -92], legF: [82, -88], head: -3 }} expr="deadpan" look={[-0.6, 0.2]} blink={blinkAt(f, 5)} />
    </BusInterior>
  );
};
