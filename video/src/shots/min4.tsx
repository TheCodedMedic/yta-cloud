// Beats 27-31: nobody noticed, except your friend; tell me what it's like; the fly; end card.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, Stage } from "../kit/Camera";
import { blinkAt, Character, handPos, Pose, POSES, seatLayout } from "../kit/Character";
import { clamp01, Dust, easeOut, lerp, Rings, sstep } from "../kit/Fx";
import { Chip } from "../kit/Graphics";
import { Bubble, Caption, EndCard } from "../kit/Graphics2";
import { Hand } from "../kit/Hand";
import { Chair, Cup, Fly, Table } from "../kit/Props";
import { Balloon, Train } from "../kit/Props2";
import { CrowdRow, PlatformSet } from "../kit/Sets2";
import { at, PE, PG, PS } from "../timing";
import { C } from "../theme";
import { CafeBg, SunsetBurst, TableTop } from "./scenes";
import { Flash, Shot } from "./types";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));
const L = { hip: 760, ...seatLayout(760, 1) };

export const MIN4_END = PG(31);

export const FLASHES4: Flash[] = [
  { t: at(29, "away"), strength: 0.3 },
];

const Terrace: React.FC<{ t: number; frame: number; heroPose?: Pose; friendPose?: Pose; heroExpr?: any; friendExpr?: any; heroLook?: [number, number] }> = ({
  t, frame, heroPose = POSES.sitTable, friendPose = POSES.sitTable, heroExpr = "smile", friendExpr = "happy", heroLook = [0.4, 0.2],
}) => (
  <Stage>
    <Chair x={740} y={L.seatY} s={0.9} legs={L.chairLegs / 0.9} />
    <Chair x={1180} y={L.seatY} s={0.9} facing={-1} legs={L.chairLegs / 0.9} />
    <Character x={750} y={L.hip} s={1.0} pose={heroPose} expr={heroExpr} look={heroLook} blink={blinkAt(frame, 7)} />
    <Character x={1170} y={L.hip} s={1.0} facing={-1} outfit="friend" pose={friendPose} expr={friendExpr} blink={blinkAt(frame, 40)} />
    <Table x={960} y={L.tableTopY} s={0.9} h={L.tableH / 0.9} />
    <Cup x={895} y={L.tableTopY - 2} s={0.42} t={t} />
  </Stage>
);

export const MIN4: Shot[] = [
  // ── Beat 27: it's already over; nobody noticed; except your friend ────────
  {
    id: "unfreeze", t0: PS(27), t1: at(27, "Nobody"),
    render: (t, u, f) => {
      const give = sstep(seg(t, at(27, "already"), at(27, "over") + 0.4));
      const heroPose: Pose = { lean: lerp(8, 0, give), armN: [lerp(135, 70, give), lerp(8, 60, give)], armF: [-8, 12], legN: [lerp(20, 6, give), 0], legF: [lerp(-16, -4, give), 0] };
      const sisterPose: Pose = { lean: 0, armN: [lerp(110, 80, give), lerp(30, 80, give)], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] };
      const [hx, hy] = handPos(880, 960, 0.95, 1, heroPose, "N");
      const [sx, sy] = handPos(1370, 960, 0.78, -1, sisterPose, "N");
      const to: [number, number] = [lerp(hx, sx, give), lerp(hy, sy, give)];
      return (
        <AbsoluteFill>
          <Cam u={u} a={[1100, 700, 1.3]} b={[1080, 700, 1.25]} t={t}>
            <PlatformSet t={t} night={0.15} train={<Train x={lerp(4600, 6200, seg(t, PS(27), PS(27) + 1.2))} y={690} s={0.9} len={6} headlight={0} />}>
              <CrowdRow x={500} y={940} s={0.62} n={3} mood={t > at(27, "reacts") ? "idle" : "frozen"} t={t} frame={f} gap={240} seed="pa" />
              <Character x={880} y={960} s={0.95} pose={heroPose} expr={give > 0.5 ? "smile" : "determined"} look={[0.9, -0.3]} blink={blinkAt(f, 7)} />
              <Character x={1370} y={960} s={0.78} facing={-1} outfit="sister" pose={sisterPose} expr="happy" look={[0.5, -0.4]} blink={blinkAt(f, 23)} />
              <Balloon x={lerp(1270, 1400, give)} y={lerp(440, 520, give)} s={0.9} t={t} to={to} sway={0.3} />
            </PlatformSet>
          </Cam>
          <Caption t={t - at(27, "over")} text="ALREADY OVER." y={200} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "nobodyknows", t0: at(27, "Nobody"), t1: at(27, "Except"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <Cam u={u} a={[700, 760, 1.6]} b={[720, 760, 1.65]} t={t}>
          <PlatformSet t={t} night={0.15}>
            <CrowdRow x={700} y={940} s={0.62} n={5} mood="idle" t={t} frame={f} gap={240} seed="pa" />
          </PlatformSet>
        </Cam>
        <Bubble x={722} y={600} t={t - at(27, "even")} text="…SO ANYWAY" tail="down" size={30} />
        <Bubble x={1198} y={600} t={t - at(27, "anything")} text="IS THAT THE 4:15?" tail="down" size={30} />
        <Caption t={t - at(27, "happened")} text="NOBODY EVEN NOTICED." y={200} />
      </AbsoluteFill>
    ),
  },
  {
    id: "friendsaw", t0: at(27, "Except"), t1: PS(28), bars: "tight",
    render: (t, u, f) => (
      <AbsoluteFill>
        <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.5)" }}><PlatformSet t={t} night={0.15} /></AbsoluteFill>
        <Cam u={u} a={[960, 540, 1]} b={[960, 520, 1.08]} t={t}>
          <Stage>
            <Character x={1000} y={990} s={2.7} facing={-1} outfit="friend" pose={{ lean: 2, armN: [10, 16], armF: [10, 16] }} expr="shock" look={[0.6, 0.1]} blink={false} />
          </Stage>
        </Cam>
        <Caption t={t - at(27, "whole")} text="HE SAW THE WHOLE THING." />
      </AbsoluteFill>
    ),
  },
  // ── Beat 28: not like a hacker; okay, tell me what it's like ──────────────
  {
    id: "notahacker", t0: PS(28), t1: at(28, "He", 2), bars: "tight",
    render: (t, u, f) => {
      const h = at(28, "hacker");
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.5)" }}><PlatformSet t={t} night={0.15} /></AbsoluteFill>
          <Stage>
            <Character x={1000} y={990} s={2.7} facing={-1} outfit="friend" pose={{ lean: 2, armN: [10, 16], armF: [10, 16] }} expr={t > h ? "smile" : "neutral"} look={[0.6, 0.1]} blink={blinkAt(f, 30)} />
          </Stage>
          <div style={{ opacity: clamp01((h + 0.4 - t) / 0.4) }}>
            <Chip x={520} y={330} t={t - at(28, "looking")} text="HACKER" accent="#ff5a5a" />
          </div>
          <svg width={1920} height={1080} style={{ position: "absolute" }}>
            {t > h && t < h + 0.4 && <line x1={420} y1={330} x2={620} y2={330} stroke="#ff5a5a" strokeWidth={8} strokeLinecap="round" opacity={clamp01((h + 0.4 - t) / 0.4)} />}
          </svg>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "okay", t0: at(28, "He", 2), t1: PS(29),
    render: (t, u, f) => (
      <AbsoluteFill>
        <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.5)" }}><PlatformSet t={t} night={0.15} /></AbsoluteFill>
        <Stage>
          <Character x={1000} y={990} s={2.7} facing={-1} outfit="friend" pose={{ lean: 2, armN: [30, 40 + Math.sin(t * 5) * 6], armF: [10, 16], head: t > at(28, "Tell") ? 5 : 0 }} expr={t > at(28, "Tell") ? "happy" : "smile"} look={[0.6, 0.1]} blink={blinkAt(f, 30)} />
        </Stage>
        <Bubble x={520} y={400} t={t - at(28, "okay")} text="OKAY." tail="right" size={44} fade={t < at(28, "Tell") ? 1 : 0.4} />
        <Bubble x={520} y={560} t={t - at(28, "Tell")} text="TELL ME WHAT IT'S LIKE." tail="right" size={40} />
      </AbsoluteFill>
    ),
  },
  // ── Beat 29: so you tell him, slowly; you laugh at the end of his joke ─────
  {
    id: "tellhim", t0: PS(29), t1: at(29, "You", 2),
    render: (t, u, f) => {
      const k = seg(t, at(29, "Slowly"), at(29, "You", 2));
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[960, 640, 1.5]} blur={6} />
          <Cam u={u} a={[960, 540, 1]} b={[960, 540, 1.05]} t={t}>
            <Terrace t={t} frame={f} heroPose={{ ...POSES.sitTable, armN: [70, 50 + Math.sin(t * 5) * 12] }} heroExpr="smile" friendExpr="happy" heroLook={[0.6, 0.1]} />
          </Cam>
          <Bubble x={700} y={430} t={t - at(29, "Slowly")} text="IT'S LIKE… EVERYONE'S ON PAUSE." tail="down" size={32} crawl={k} />
          <Caption t={t - at(29, "Slowly")} text="SLOWLY." size={44} hold={2.0} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "laugh", t0: at(29, "You", 2), t1: PS(30),
    render: (t, u, f) => {
      const j = at(29, "joke"), a = at(29, "away");
      const k = seg(t, at(29, "You", 2), j + 0.6);
      const laughing = t > a;
      const up: Pose = { ...POSES.sitTable, armN: [70, 110], armF: [60, 100], head: 6 };
      return (
        <AbsoluteFill>
          <CafeBg t={t} u={u} a={[960, 640, 1.5]} b={[960, 630, 1.6]} blur={6} />
          <Cam u={u} a={[960, 540, 1]} b={[960, 540, 1.08]} t={t}>
            <Terrace t={t} frame={f}
              heroPose={laughing ? up : POSES.sitTable} friendPose={laughing ? up : { ...POSES.sitTable, armN: [70, 50 + Math.sin(t * 5) * 12] }}
              heroExpr={laughing ? "laugh" : "smile"} friendExpr={laughing ? "laugh" : "happy"} heroLook={[0.6, 0.1]} />
            <Stage><Rings t={t - a} cx={960} cy={560} scale={1.2} color={C.gold} /></Stage>
          </Cam>
          <Bubble x={1240} y={430} t={t - at(29, "You", 2)} text="…AND THEN THE DOG ATE THE REMOTE!" tail="down" size={30} crawl={k} fade={laughing ? 0.5 : 1} />
          <Caption t={t - a} text="YOU SAW IT COMING A MILE AWAY." size={44} />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 30: a fly lands on your cup; you let it go ───────────────────────
  {
    id: "flyreturns", t0: PS(30), t1: at(30, "you", 1),
    render: (t, u) => {
      const land = at(30, "lands");
      const k = easeOut(seg(t, PS(30), land + 0.1));
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} />
          <Cam u={u} a={[960, 600, 1.0]} b={[960, 620, 1.06]} t={t}>
            <Stage>
              <Cup x={960} y={900} s={2.6} t={t} />
              <Hand x={300} y={880} s={1.4} rot={-10} curl={0.12} />
              <Fly x={lerp(1800, 1050, k) + (1 - k) * Math.sin(t * 8) * 50} y={lerp(240, 708, k)} s={2.2} t={t} flap={t < land + 0.1 ? 1 : 0} rub={t > land ? (Math.sin(t * 9) + 1) / 2 : 0} />
              <Rings t={t - land} cx={1060} cy={712} scale={0.6} />
            </Stage>
          </Cam>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "watch", t0: at(30, "you", 1), t1: at(30, "So"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <CafeBg t={t} u={u} a={[760, 640, 2.2]} b={[740, 640, 2.3]} blur={12} />
        <Cam u={u} a={[960, 540, 1]} b={[960, 530, 1.06]} t={t}>
          <Stage>
            <Character x={960} y={990} s={2.7} pose={{ lean: 4, armN: [14, 18], armF: [6, 16], head: -3 }} expr="smile" look={[0.6, 0.7]} blink={blinkAt(f, 11) || (t > at(30, "it", 1) && t < at(30, "it", 1) + 0.25)} />
          </Stage>
        </Cam>
        <Dust t={t * 0.4} n={24} seed="wt" />
        <Caption t={t - at(30, "all")} text="ALL THE TIME IN THE WORLD." color={C.gold} />
      </AbsoluteFill>
    ),
  },
  {
    id: "letgo", t0: at(30, "So"), t1: PS(31),
    render: (t, u) => {
      const go = at(30, "go");
      const k = easeOut(seg(t, go, go + 1.2), 1.5);
      return (
        <AbsoluteFill>
          <TableTop t={t} u={u} />
          <Cam u={u} a={[960, 600, 1.06]} b={[960, 580, 1.0]} t={t}>
            <Stage>
              <Cup x={960} y={900} s={2.6} t={t} />
              <Hand x={300} y={880} s={1.4} rot={-10} curl={0.12} />
              <Fly x={1050 + k * 1100} y={708 - k * 700 + Math.sin(t * 7) * 20 * k} s={2.2 - k * 0.8} t={t} flap={t > go ? 1 : 0} rub={t < go ? (Math.sin(t * 9) + 1) / 2 : 0} rot={-20 * k} />
              <Rings t={t - go} cx={1060} cy={712} scale={0.5} />
            </Stage>
          </Cam>
          <Caption t={t - go} text="SO YOU LET IT GO." size={46} />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 31: end card ─────────────────────────────────────────────────────
  {
    id: "endcard", t0: PS(31), t1: PG(31) + 0.5,
    render: (t) => {
      const fade = clamp01((PG(31) - t) / 1.6);
      const bal = at(31, "balloon");
      return (
        <AbsoluteFill style={{ background: "#000" }}>
          <AbsoluteFill style={{ opacity: fade }}>
            <SunsetBurst t={t} sunY={760} rays={0.16} />
            <AbsoluteFill style={{ background: "rgba(20,10,30,0.45)" }} />
            <svg width={1920} height={1080} style={{ position: "absolute" }}>
              {t > bal && <Balloon x={1600} y={900 - (t - bal) * 60} s={0.8} t={t} to={[1560, 1080]} sway={0.6} />}
            </svg>
            <EndCard t={t - PS(31)} question="WHAT WOULD YOU DO WITH A QUARTER-SECOND HEAD START?" tComment={at(31, "comments") - PS(31)} tSub={at(31, "subscribe") - PS(31)} />
          </AbsoluteFill>
        </AbsoluteFill>
      );
    },
  },
];
