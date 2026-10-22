// First minute of "Head Start" (beats 0-8). Every boundary is a measured word.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, Stage } from "../kit/Camera";
import { blinkAt, Character, handPos, mixPose, Pose, POSES, seatLayout, walkPose } from "../kit/Character";
import { clamp01, Dust, easeOut, lerp, Rings, sstep, Streaks } from "../kit/Fx";
import { Chip, Label, Stamp, Stopwatch, TitleText } from "../kit/Graphics";
import { Hand } from "../kit/Hand";
import { Chair, Cup, Fly, Phone, Table } from "../kit/Props";
import { at, end, PG, PS } from "../timing";
import { C, FONT_UI } from "../theme";
import { Blueprint, CafeBg, SunsetBurst, TableTop } from "./scenes";
import { Flash, Shot } from "./types";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));


/** The terrace two-shot set: hero left, friend right, table between. */
const Terrace: React.FC<{ t: number; heroPose?: Pose; friendPose?: Pose; heroExpr?: any; friendExpr?: any; phone?: React.ReactNode; frame: number }> = ({
  t, heroPose = POSES.sitTable, friendPose = POSES.sitTable, heroExpr = "smile", friendExpr = "laugh", phone, frame,
}) => (
  <Stage>
    <Chair x={740} y={L.seatY} s={0.9} legs={L.chairLegs / 0.9} />
    <Chair x={1180} y={L.seatY} s={0.9} facing={-1} legs={L.chairLegs / 0.9} />
    <Character x={750} y={L.hip} s={1.0} pose={heroPose} expr={heroExpr} look={[0.4, 0.2]} blink={blinkAt(frame, 7)} />
    <Character x={1170} y={L.hip} s={1.0} facing={-1} outfit="friend" pose={friendPose} expr={friendExpr} blink={blinkAt(frame, 40)} />
    <Table x={960} y={L.tableTopY} s={0.9} h={L.tableH / 0.9} />
    <Cup x={895} y={L.tableTopY - 2} s={0.42} t={t} />
    {phone}
  </Stage>
);

const L = { hip: 760, ...seatLayout(760, 1) };

const heroClose = (t: number, frame: number, expr: any, opts: { look?: [number, number]; pose?: Pose; glow?: number; x?: number } = {}) => (
  <Stage>
    <Character x={opts.x ?? 960} y={990} s={2.7} pose={opts.pose ?? { lean: 4, armN: [14, 18], armF: [6, 16] }}
      expr={expr} look={opts.look ?? [0.3, 0.1]} blink={blinkAt(frame, 11)} brainGlow={opts.glow} />
  </Stage>
);

export const MIN1_END = PG(8);

export const FLASHES: Flash[] = [
  { t: at(1, "close"), x: 1000, y: 560, strength: 0.9 },
  { t: at(2, "caught"), x: 980, y: 620, strength: 1 },
  { t: at(5, "was"), strength: 0.4 },
  { t: at(7, "head"), strength: 0.7 },
  { t: at(8, "superpower"), strength: 0.35 },
];

export const MIN1: Shot[] = [
  // ── Beat 0: every human has lost a fight to a fly ──────────────────────────
  {
    id: "wide", t0: 0, t1: at(0, "lost"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[960, 560, 1.0]} b={[960, 600, 1.08]}
          patrons={
            <g>
              <Character x={895} y={922} s={0.32} pose={POSES.sitTable} expr="smile" blink={blinkAt(f)} />
              <Character x={1025} y={922} s={0.32} facing={-1} outfit="friend" pose={POSES.sitTable} expr="laugh" />
              <Table x={960} y={902} s={0.3} h={126} />
            </g>
          } />
        <Stage>
          <Fly x={300 + t * 260} y={420 + Math.sin(t * 5) * 40} s={0.5} t={t} />
        </Stage>
      </AbsoluteFill>
    ),
  },
  {
    id: "swat", t0: at(0, "lost"), t1: at(0, "It", 1),
    render: (t, u, f) => {
      const sw = seg(t, at(0, "fight") - 0.05, at(0, "fight") + 0.15);
      const flyT = t - at(0, "fight");
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[700, 700, 2.0]} b={[720, 700, 2.05]} blur={10} />
          <Stage>
            <Character x={760} y={1000} s={2.2} outfit="extra"
              pose={mixPose({ lean: 0, armN: [30, 40], armF: [-10, 10] }, { lean: 12, armN: [122, 4], armF: [-10, 10] }, sstep(sw))}
              expr={flyT > 0.2 ? "deadpan" : "determined"} look={[0.8, -0.6]} blink={blinkAt(f, 3)} />
            <Fly x={flyT < 0 ? 1180 + Math.sin(t * 6) * 30 : 1180 + flyT * 900} y={flyT < 0 ? 330 + Math.cos(t * 5) * 30 : 330 - flyT * 500}
              s={1.3} t={t} rot={flyT > 0 ? -25 : 0} />
            {flyT > 0 && flyT < 0.5 && <path d={`M1180,330 Q${1180 + flyT * 400},${300 - flyT * 300} ${1180 + flyT * 900},${330 - flyT * 500}`} stroke="white" strokeWidth={3} strokeDasharray="6 10" fill="none" opacity={1 - flyT * 2} />}
          </Stage>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "flymacro", t0: at(0, "It", 1), t1: at(0, "It", 2), bars: "slow", cool: 0.25,
    render: (t, u) => {
      const ts = t - at(0, "It", 1);
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} />
          <Stage>
            <Fly x={860} y={760} s={7} t={t} rot={-4} flap={0.15} />
            <Rings t={t - at(0, "sees")} cx={980} cy={700} scale={1.2} />
          </Stage>
          {/* giant blurred hand creeping in, in slow motion */}
          <AbsoluteFill style={{ filter: "blur(18px)" }}>
            <Stage>
              <Hand x={2300 - ts * 160} y={420} s={2.4} rot={200} curl={0.1} />
            </Stage>
          </AbsoluteFill>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "flychill", t0: at(0, "It", 2), t1: PS(1),
    render: (t, u) => (
      <AbsoluteFill>
        <TableTop t={t} u={u} />
        <Cam u={u} a={[960, 540, 1.0]} b={[960, 560, 1.12]} t={t}>
          <Stage>
            <Fly x={960} y={780} s={8} t={t} flap={0} rub={(Math.sin(t * 9) + 1) / 2} />
          </Stage>
        </Cam>
        <AbsoluteFill style={{ filter: "blur(20px)", opacity: 0.85 }}>
          <Stage>
            <Hand x={lerp(-200, 2400, u)} y={260} s={2.2} rot={10} curl={0.2} />
          </Stage>
        </AbsoluteFill>
      </AbsoluteFill>
    ),
  },
  // ── Beat 1: one lands on your cup, you just close your hand ────────────────
  {
    id: "cupland", t0: PS(1), t1: at(1, "and", 1),
    render: (t, u) => {
      const land = at(1, "lands");
      const k = easeOut(seg(t, land - 0.8, land + 0.15));
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} />
          <Cam u={u} a={[960, 600, 1.0]} b={[960, 620, 1.08]} t={t}>
            <Stage>
              <Cup x={960} y={900} s={2.6} t={t} />
              <Fly x={lerp(1700, 1050, k) + (1 - k) * Math.sin(t * 8) * 60} y={lerp(260, 708, k)} s={2.2} t={t} flap={t < land + 0.1 ? 1 : 0} />
              <Rings t={t - land} cx={1060} cy={712} scale={0.6} />
            </Stage>
          </Cam>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "herocalm", t0: at(1, "and", 1), t1: at(1, "You", 2),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[760, 640, 2.2]} b={[740, 640, 2.25]} blur={12} />
        <Cam u={u} a={[960, 540, 1]} b={[960, 520, 1.06]} t={t}>{heroClose(t, f, "smug", { look: [0.6, 0.7] })}</Cam>
      </AbsoluteFill>
    ),
  },
  {
    id: "catchfly", t0: at(1, "You", 2), t1: at(1, "Gotcha"), bars: "slow",
    render: (t, u) => {
      const c = at(1, "close");
      const reach = easeOut(seg(t, at(1, "You", 2), c + 0.05), 3);
      const curl = sstep(seg(t, c + 0.02, end(1, "hand")));
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} />
          <Stage>
            <Cup x={960} y={900} s={2.6} t={t} />
            {curl < 0.5 && <Fly x={1050} y={708} s={2.2} t={t} flap={0} rub={(Math.sin(t * 9) + 1) / 2} />}
            <Hand x={lerp(-300, 1010, reach)} y={lerp(620, 650, reach)} s={1.6} rot={-6} curl={curl} />
            <Rings t={t - c - 0.12} cx={1050} cy={660} scale={1} />
          </Stage>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "gotcha", t0: at(1, "Gotcha"), t1: PS(2),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[760, 640, 2.2]} blur={12} />
        {heroClose(t, f, "smug", { look: [0.2, 0], pose: { lean: 2, armN: [40, 120 + Math.sin(t * 30) * 2], armF: [10, 24] } })}
      </AbsoluteFill>
    ),
  },
  // ── Beat 2: the phone slides off the edge ──────────────────────────────────
  {
    id: "twoshot", t0: PS(2), t1: at(2, "slides"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[960, 600, 1.35]} b={[960, 610, 1.42]} blur={3} />
        <Cam u={u} a={[960, 560, 1.0]} b={[960, 570, 1.05]} t={t}>
          <Terrace t={t} frame={f}
            friendPose={mixPose(POSES.sitTable, { ...POSES.sitTable, armN: [110, 30] }, (Math.sin(t * 5) + 1) / 2)}
            phone={<Phone x={1060 + seg(t, at(2, "phone") - 0.2, at(2, "slides")) * 25} y={L.tableTopY - 6} s={0.3} rot={-4} />} />
        </Cam>
      </AbsoluteFill>
    ),
  },
  {
    id: "phoneedge", t0: at(2, "slides"), t1: at(2, "Before"), bars: "slow", cool: 0.2,
    render: (t, u) => {
      const off = at(2, "off");
      const slide = seg(t, at(2, "slides"), off);
      const tip = seg(t, off, at(2, "Before")) * 0.35;
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} edge />
          <Stage>
            <Phone x={lerp(900, 1180, slide) + tip * 60} y={688 + tip * 40} s={1.6} rot={tip * 40} />
          </Stage>
          <Stopwatch x={1740} y={90} t={(t - off) * 0.1} value="SLOW" />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "friendfrozen", t0: at(2, "Before"), t1: at(2, "you've"), bars: "slow", cool: 0.25,
    render: (t, u) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[1160, 640, 2.2]} blur={12} />
        <Stage>
          <Character x={1040} y={990} s={2.7} facing={-1} outfit="friend" pose={{ lean: 6, armN: [70, 40], armF: [20, 24] }} expr="laugh" />
        </Stage>
        <AbsoluteFill style={{ filter: "blur(10px)" }}>
          <Stage>
            <Phone x={380} y={900 + (t - at(2, "Before")) * 18} s={3.0} rot={30 + (t - at(2, "Before")) * 6} />
          </Stage>
        </AbsoluteFill>
        <Dust t={t * 0.1} n={40} seed="frz" />
      </AbsoluteFill>
    ),
  },
  {
    id: "catchphone", t0: at(2, "you've"), t1: at(2, "and", 1),
    render: (t, u) => {
      const c = at(2, "caught");
      const put = at(2, "put");
      if (t < put) {
        const reach = easeOut(seg(t, at(2, "you've"), c), 3);
        const curl = sstep(seg(t, c, c + 0.15)) * 0.55;
        return (
          <AbsoluteFill>
            <TableTop t={t} u={u} edge />
            <Stage>
              <Phone x={1320} y={860} s={1.6} rot={40} />
              <Hand x={lerp(-200, 1250, reach)} y={lerp(980, 900, reach)} s={1.4} rot={-14} curl={curl} />
              <Rings t={t - c - 0.06} cx={1320} cy={860} scale={0.9} />
            </Stage>
          </AbsoluteFill>
        );
      }
      const k = easeOut(seg(t, put, at(2, "back") + 0.2), 3);
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} edge />
          <Stage>
            <Phone x={lerp(1250, 820, k)} y={lerp(560, 688, k)} s={1.6} rot={lerp(20, -2, k)} />
            <Hand x={lerp(1150, 520 - k * 200, k)} y={lerp(520, 640, k)} s={1.4} rot={-8} curl={0.45 * (1 - k)} />
            <Rings t={t - at(2, "back") - 0.12} cx={820} cy={690} scale={0.6} />
          </Stage>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "sip", t0: at(2, "and", 1), t1: PS(3),
    render: (t, u, f) => {
      const lift = sstep(seg(t, at(2, "and", 1), at(2, "sip")));
      const pose: Pose = { lean: -2, armN: [lerp(20, 95, lift), lerp(70, 105, lift)], armF: [-10, 10], head: lift * 8 };
      const [hx, hy] = handPos(900, 990, 2.7, 1, pose);
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[760, 640, 2.2]} blur={12} />
          <Stage>
            <Character x={900} y={990} s={2.7} pose={pose} expr={lift > 0.8 ? "happy" : "smile"} blink={blinkAt(f, 2)} />
            {/* handle in the hand, mug toward the face */}
            <Cup x={hx - 20} y={hy + 34} s={1.0} t={t} />
          </Stage>
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 3: he stares, you shrug, slow motion ──────────────────────────────
  {
    id: "stare", t0: PS(3), t1: at(3, "You", 1), bars: "tight",
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[1160, 640, 2.2]} blur={12} />
        <Cam u={u} a={[960, 540, 1.0]} b={[960, 500, 1.12]} t={t}>
          <Stage>
            <Character x={980} y={990} s={2.7} facing={-1} outfit="friend" pose={{ lean: 2, armN: [10, 16], armF: [10, 16] }} expr="shock" blink={blinkAt(f, 30)} />
          </Stage>
        </Cam>
      </AbsoluteFill>
    ),
  },
  {
    id: "shrug", t0: at(3, "You", 1), t1: at(3, "To"),
    render: (t, u, f) => {
      const k = sstep(seg(t, at(3, "You", 1), at(3, "shrug") + 0.25));
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[760, 640, 2.0]} blur={10} />
          <Stage>
            <Character x={960} y={960} s={2.3} view="front" pose={mixPose(POSES.front, POSES.shrug, k)}
              expr={k > 0.6 ? "happy" : "smile"} blink={blinkAt(f, 5)} />
          </Stage>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "slowmo", t0: at(3, "To"), t1: PS(4), bars: "slow", cool: 0.35,
    render: (t, u) => {
      const ts = t - at(3, "To");
      return (
        <AbsoluteFill>
          <TableTop t={t * 0.2} u={u} edge />
          <Stage>
            {[3, 2, 1].map((k) => (
              <g key={k} opacity={0.12 * (4 - k)}>
                <Phone x={1300 - k * 30} y={760 + (ts - k * 0.15) * 40} s={2} rot={30 + (ts - k * 0.15) * 14} />
              </g>
            ))}
            <Phone x={1300} y={760 + ts * 40} s={2} rot={30 + ts * 14} />
            <Rings t={(ts % 1.1)} cx={1300} cy={760 + ts * 40} scale={1.1} />
          </Stage>
          <Dust t={t * 0.05} n={50} seed="slow" />
          <Label x={960} y={190} t={t - at(3, "slow")} text="SLOW MOTION" size={52} />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 4: your brain runs ten times faster ───────────────────────────────
  {
    id: "brain10", t0: PS(4), t1: PS(5),
    render: (t, u, f) => {
      const g = sstep(seg(t, at(4, "brain"), at(4, "brain") + 0.4));
      return (
        <AbsoluteFill>
          <SunsetBurst t={t} sunY={600} />
          <Streaks t={t} n={18} speed={2400} opacity={0.25 * g} />
          <Cam u={u} a={[960, 560, 1]} b={[960, 520, 1.1]} t={t}>
            <Stage>
              <Character x={960} y={990} s={2.6} view="front" pose={POSES.hero} expr={g > 0.5 ? "smug" : "smile"} brainGlow={g} blink={blinkAt(f, 9)} rimDir={[0, -1]} />
              <Rings t={t - at(4, "ten")} cx={960} cy={610} scale={1.2} color={C.gold} />
            </Stage>
          </Cam>
          <Stamp x={1430} y={360} t={t - at(4, "ten")} text="×10" />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 5: title card ─────────────────────────────────────────────────────
  {
    id: "title", t0: PS(5), t1: PS(6),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[960, 640, 1.15]} b={[960, 470, 1.0]}
          patrons={
            <g>
              <Character x={895} y={922} s={0.32} pose={POSES.sitTable} expr="smile" blink={blinkAt(f)} />
              <Character x={1025} y={922} s={0.32} facing={-1} outfit="friend" pose={POSES.sitTable} expr="laugh" />
              <Table x={960} y={902} s={0.3} h={126} />
            </g>
          } />
        <AbsoluteFill style={{ background: "linear-gradient(180deg, rgba(20,10,30,0.65) 0%, rgba(20,10,30,0.35) 40%, transparent 55%)" }} />
        <TitleText t={t - PS(5)} small="WHAT IF YOUR REACTION TIME" big="WAS 10× FASTER?" tag="A HEAD START STORY" />
      </AbsoluteFill>
    ),
  },
  // ── Beat 6: a quarter of a second; eyes → brain → muscles ──────────────────
  {
    id: "quarter", t0: PS(6), t1: at(6, "Light"),
    render: (t, u, f) => {
      const react = at(6, "react");
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[760, 640, 1.9]} blur={12} dim={0.25} />
          <Stage>
            <Character x={720} y={960 - (t > react ? Math.sin(seg(t, react, react + 0.3) * Math.PI) * 40 : 0)} s={2.2} outfit="extra"
              view="front" pose={t > react ? POSES.frontFists : POSES.front} expr={t > react ? "shock" : "neutral"} blink={blinkAt(f, 21)} />
          </Stage>
          <Stopwatch x={1340} y={330} s={2.2} t={seg(t, at(6, "quarter"), react) * 0.25} sweep={4} value={t > at(6, "quarter") ? "0.25 s" : "0.00 s"} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "signal", t0: at(6, "Light"), t1: PS(7),
    render: (t, u, f) => {
      const tE = at(6, "eyes"), tB = at(6, "brain"), tM = at(6, "muscles");
      const eye: [number, number] = [790, 500], brain: [number, number] = [740, 440], hand: [number, number] = [1020, 760];
      const p1 = seg(t, at(6, "Light"), tE), p2 = seg(t, tE, tB), p3 = seg(t, at(6, "only"), tM);
      let dot: [number, number] = [lerp(1500, eye[0], p1), lerp(380, eye[1], p1)];
      if (p2 > 0) dot = [lerp(eye[0], brain[0], p2), lerp(eye[1], brain[1], p2)];
      if (p3 > 0) dot = [lerp(brain[0], hand[0], p3), lerp(brain[1], hand[1], p3)];
      const move = sstep(seg(t, at(6, "move"), at(6, "move") + 0.3));
      return (
        <AbsoluteFill>
          <Blueprint t={t}>
            <Character x={760} y={890} s={1.9} pose={mixPose({ armN: [20, 10], armF: [-6, 10], legN: [4, 0], legF: [-4, 0] }, { armN: [80, 6], armF: [-6, 10], legN: [4, 0], legF: [-4, 0] }, move)}
              expr="neutral" look={[1, 0]} brainGlow={t > tB ? 0.9 : 0} blink={blinkAt(f, 13)} />
            <circle cx={dot[0]} cy={dot[1]} r={14} fill={C.gold} />
            <circle cx={dot[0]} cy={dot[1]} r={34} fill={C.gold} opacity={0.25} />
            <path d={`M1500,380 L${eye[0]},${eye[1]}`} stroke={C.gold} strokeWidth={3} strokeDasharray="10 12" opacity={0.5 * p1} />
            <Rings t={t - tE} cx={eye[0]} cy={eye[1]} scale={0.4} color={C.gold} />
            <Rings t={t - tB} cx={brain[0]} cy={brain[1]} scale={0.5} color={C.gold} />
            <Rings t={t - tM} cx={hand[0]} cy={hand[1]} scale={0.5} color={C.gold} />
          </Blueprint>
          <Label x={620} y={190} t={t - tE} text="EYES" />
          <Label x={760} y={190} t={t - tE - 0.2} text="→" />
          <Label x={900} y={190} t={t - tB} text="BRAIN" />
          <Label x={1050} y={190} t={t - tB - 0.2} text="→" />
          <Label x={1220} y={190} t={t - tM} text="MUSCLES" />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 7: two and a half hundredths; your head start ─────────────────────
  {
    id: "goldwatch", t0: PS(7), t1: at(7, "That"),
    render: (t, u, f) => {
      const g = t > at(7, "two");
      return (
        <AbsoluteFill>
          <SunsetBurst t={t} sunY={620} rays={0.18} />
          <Cam u={u} a={[960, 560, 1]} b={[960, 540, 1.05]} t={t}>{heroClose(t, f, g ? "smug" : "smile", { x: 820, glow: g ? 0.8 : 0 })}</Cam>
          <Stopwatch x={1400} y={250} s={2} t={g ? 0.05 : 0.25} value={g ? "0.025 s" : "0.25 s"} gold={g} popT={t - at(7, "two")} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "lanes", t0: at(7, "That"), t1: at(7, "head"),
    render: (t, u, f) => {
      const g0 = at(7, "gap");
      const hero = Math.max(0, t - g0) * 330;
      const norm = Math.max(0, t - g0 - 0.9) * 330;
      const bracket = easeOut(seg(t, at(7, "between"), at(7, "between") + 0.4));
      return (
        <AbsoluteFill>
          <Blueprint t={t}>
            <line x1={320} y1={540} x2={1720} y2={540} stroke="#3c5a78" strokeWidth={2} />
            <line x1={330} y1={160} x2={330} y2={920} stroke={C.cream} strokeWidth={4} strokeDasharray="14 10" />
            <Character x={380 + norm} y={420} s={0.9} outfit="extra" pose={norm > 0 ? walkPose(t * 11) : POSES.stand} expr="neutral" />
            <Character x={380 + hero} y={840} s={0.9} pose={hero > 0 ? walkPose(t * 11) : POSES.stand} expr="happy" blink={blinkAt(f)} />
            {bracket > 0 && (
              <g opacity={bracket}>
                <path d={`M${400 + norm},${585} L${400 + norm},605 L${400 + hero},605 L${400 + hero},585`} stroke={C.gold} strokeWidth={4} fill="none" />
                <text x={400 + (norm + hero) / 2} y={570} textAnchor="middle" fill={C.gold} fontFamily={FONT_UI} fontWeight={800} fontSize={48} letterSpacing={3}>0.225 s</text>
              </g>
            )}
          </Blueprint>
          <Label x={1560} y={300} t={t - at(7, "That")} text="EVERYONE ELSE" size={40} />
          <Label x={1560} y={720} t={t - at(7, "you")} text="YOU" size={48} color={C.gold} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "headstart", t0: at(7, "head"), t1: PS(8),
    render: (t) => (
      <AbsoluteFill>
        <SunsetBurst t={t} sunY={560} rays={0.3} />
        <Stage><Rings t={t - at(7, "head") - 0.05} cx={960} cy={520} scale={1.6} color={C.gold} /></Stage>
        <Stamp x={960} y={400} t={t - at(7, "head")} text="HEAD START" sub="0.225 SECONDS" />
      </AbsoluteFill>
    ),
  },
  // ── Beat 8: you're not faster, you're earlier ──────────────────────────────
  {
    id: "catch", t0: PS(8), t1: at(8, "Only"), bars: "tight",
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[760, 640, 2.2]} blur={12} dim={0.15} />
        <Cam u={u} a={[960, 540, 1]} b={[960, 470, 1.15]} t={t}>{heroClose(t, f, "think", { look: [0.5, -0.4] })}</Cam>
      </AbsoluteFill>
    ),
  },
  {
    id: "upgrade", t0: at(8, "Only"), t1: at(8, "You're", 1),
    render: (t, u, f) => {
      const arms = at(8, "arms", 1);
      const flap = t > arms ? Math.sin((t - arms) * 6) : 0;
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[960, 640, 1.8]} blur={10} />
          <Stage>
            <Character x={960} y={890} s={1.9}
              view="front" pose={{ lean: 0, armN: [45 + flap * 55, 12], armF: [45 + flap * 55, 12], legN: [8, 0], legF: [8, 0] }}
              expr={t > arms ? "deadpan" : "happy"} brainGlow={sstep(seg(t, at(8, "brain"), at(8, "upgrade")))} blink={blinkAt(f, 17)} />
          </Stage>
          <Chip x={960} y={250} t={t - at(8, "upgrade")} text="BRAIN  ×10" accent={C.gold} />
          <Chip x={1340} y={720} t={t - arms} text="ARMS  ×1" accent="#8a8aa0" />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "earlier", t0: at(8, "You're", 1), t1: at(8, "And"),
    render: (t, u, f) => {
      const g0 = at(8, "You're", 1);
      const hero = Math.max(0, t - g0) * 300;
      const norm = Math.max(0, t - g0 - 0.9) * 300;
      return (
        <AbsoluteFill>
          <Blueprint t={t}>
            <line x1={330} y1={160} x2={330} y2={920} stroke={C.cream} strokeWidth={4} strokeDasharray="14 10" />
            <Character x={380 + norm} y={420} s={0.9} outfit="extra" pose={norm > 0 ? walkPose(t * 11) : POSES.stand} expr="neutral" />
            <Character x={380 + hero} y={840} s={0.9} pose={walkPose(t * 11)} expr="happy" blink={blinkAt(f)} />
          </Blueprint>
          <Chip x={960} y={600} t={t - at(8, "faster")} text="SAME SPEED" accent="#8a8aa0" size={38} />
          <Chip x={1450} y={680} t={t - at(8, "earlier", 1)} text="EARLIER" accent={C.gold} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "superpower", t0: at(8, "And"), t1: PG(8),
    render: (t, u, f) => {
      const sp = at(8, "superpower");
      return (
        <AbsoluteFill>
          <SunsetBurst t={t} sunY={520} rays={0.22 + 0.15 * sstep(seg(t, sp, sp + 0.4))} />
          <Streaks t={t} n={26} speed={1800} opacity={0.3} />
          <Cam u={u} a={[960, 560, 1.18]} b={[960, 600, 1.0]} t={t}>
            <Stage>
              <Character x={960} y={900} s={1.6} view="front" pose={POSES.hero} expr="happy" blink={blinkAt(f, 4)} rimDir={[0, -1]}
                brainGlow={0.4 + 0.5 * sstep(seg(t, sp, sp + 0.3))} />
              <Rings t={t - sp} cx={960} cy={680} scale={1.4} color={C.gold} />
            </Stage>
          </Cam>
        </AbsoluteFill>
      );
    },
  },
];
