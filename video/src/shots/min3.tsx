// Beats 19-26: the platform, the balloon, the train.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, Stage } from "../kit/Camera";
import { blinkAt, Character, handPos, mixPose, Pose, POSES, walkPose } from "../kit/Character";
import { clamp01, Dust, easeOut, lerp, Rings, sstep, Streaks } from "../kit/Fx";
import { Chip, Label, Stamp, Stopwatch } from "../kit/Graphics";
import { Caption, ThoughtStack, TwinDials } from "../kit/Graphics2";
import { Hand } from "../kit/Hand";
import { Balloon, Train } from "../kit/Props2";
import { CrowdRow, PlatformSet } from "../kit/Sets2";
import { at, end, PE, PG, PS } from "../timing";
import { C } from "../theme";
import { Blueprint } from "./scenes";
import { Flash, Shot } from "./types";

const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

// Platform staging (world coords). The yellow line is at y≈750; people stand on the near platform.
const FLOOR = 1010;           // hips y for s=1 standing on the near platform (feet ≈ 1130, below frame bottom crop → use s 0.75)
const HOLD: Pose = { lean: 0, armN: [38, 108], armF: [8, 10], legN: [6, 0], legF: [6, 0] }; // sister holding the string up (front)
const TRAIN_X = 520; // where the express is "frozen" during the head-start beats
const SISTER_SIDE_HOLD: Pose = { lean: 0, armN: [60, 95], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] };

export const MIN3_END = PG(26);

export const FLASHES3: Flash[] = [
  { t: at(22, "now"), strength: 0.5 },
  { t: at(25, "balloon"), x: 980, y: 520, strength: 1 },
  { t: PE(26) + 0.1, strength: 0.6 },
];

const Crowd: React.FC<{ t: number; f: number; mood?: any; x?: number }> = ({ t, f, mood = "idle", x = 1100 }) => (
  <CrowdRow x={x} y={930} s={0.62} n={7} mood={mood} t={t} frame={f} gap={250} seed="pl" />
);

export const MIN3: Shot[] = [
  // ── Beat 19: one Saturday afternoon ───────────────────────────────────────
  {
    id: "saturday", t0: PS(19), t1: PS(20),
    render: (t, u, f) => (
      <AbsoluteFill>
        <Cam u={u} a={[960, 540, 1.0]} b={[960, 560, 1.08]} t={t}>
          <PlatformSet t={t}>
            <Crowd t={t} f={f} x={1150} />
          </PlatformSet>
        </Cam>
        <Caption t={t - at(19, "Saturday")} text="SATURDAY AFTERNOON." y={200} hold={at(19, "being") - at(19, "Saturday") + 1.2} />
        <Caption t={t - at(19, "early")} text="BEING EARLY IS ALL THAT MATTERS." y={200} size={46} />
      </AbsoluteFill>
    ),
  },
  // ── Beat 20: the platform is packed ───────────────────────────────────────
  {
    id: "packed", t0: PS(20), t1: at(20, "Your"),
    render: (t, u, f) => (
      <AbsoluteFill>
        <Cam u={u} a={[960, 600, 1.15]} b={[940, 600, 1.2]} t={t}>
          <PlatformSet t={t}>
            <CrowdRow x={700} y={940} s={0.62} n={6} mood="idle" t={t} frame={f} gap={240} seed="pa" />
            <CrowdRow x={1500} y={940} s={0.62} n={4} mood="idle" t={t} frame={f} gap={240} seed="pb" />
          </PlatformSet>
        </Cam>
        <Label x={960} y={150} t={t - at(20, "packed")} text="PACKED" size={56} />
      </AbsoluteFill>
    ),
  },
  {
    id: "trio", t0: at(20, "Your"), t1: PS(21),
    render: (t, u, f) => {
      const [hx, hy] = handPos(1240, 960, 0.78, 1, HOLD, "N", "front");
      return (
        <AbsoluteFill>
          <Cam u={u} a={[1000, 640, 1.5]} b={[1020, 640, 1.56]} t={t}>
            <PlatformSet t={t}>
              <Character x={760} y={960} s={0.95} facing={-1} outfit="friend" pose={{ lean: 4, armN: [60, 80], armF: [8, 12], legN: [4, 0], legF: [-4, 0] }} expr="smile" look={[0.4, 0.4]} blink={blinkAt(f, 40)} />
              <Character x={1000} y={960} s={0.95} view="front" pose={POSES.front} expr="smile" blink={blinkAt(f, 7)} />
              <Character x={1240} y={960} s={0.78} view="front" outfit="sister" pose={HOLD} expr="happy" blink={blinkAt(f, 23)} />
              <Balloon x={1300} y={560} s={0.9} t={t} to={[hx, hy]} />
            </PlatformSet>
          </Cam>
          <Label x={520} y={360} t={t - at(20, "friend")} text="YOUR FRIEND" size={40} />
          <Label x={1420} y={330} t={t - at(20, "sister")} text="YOUR LITTLE SISTER" size={40} />
          <svg width={1920} height={1080} style={{ position: "absolute" }}><Rings t={t - at(20, "balloon")} cx={1470} cy={420} scale={0.7} color="#ff8a90" /></svg>
          <Label x={1470} y={230} t={t - at(20, "balloon")} text="THE RED BALLOON" size={40} color="#ff8a90" />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 21: the string slips, one step, two, the express train ───────────
  {
    id: "slip", t0: PS(21), t1: at(21, "She"), bars: "slow", cool: 0.2,
    render: (t, u) => {
      const s0 = at(21, "slips");
      const open = sstep(seg(t, s0, s0 + 0.35));
      const rise = easeOut(seg(t, s0, at(21, "She")), 1.6);
      const [bx, by] = [1000 + rise * 140, 300 - rise * 200];
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ filter: "blur(12px)", transform: "scale(1.4)" }}><PlatformSet t={t} /></AbsoluteFill>
          <Stage>
            <Balloon x={bx} y={by} s={1.4} t={t} to={[900 + open * 40, 700 - open * 10]} sway={0.4} />
            <Hand x={860} y={760} s={1.2} rot={-70} curl={0.55 * (1 - open)} sleeve="#c56aa8" />
            <Rings t={t - s0} cx={900} cy={690} scale={0.7} color="#ff8a90" />
          </Stage>
          <Dust t={t * 0.2} n={30} seed="sl" />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "steps", t0: at(21, "She"), t1: at(21, "And"),
    render: (t, u, f) => {
      const one = at(21, "One"), two = at(21, "Two"), edge = at(21, "edge");
      // two walk steps toward the edge (to the right), then stop at the yellow line
      const ph = t < one ? 0 : t < two ? seg(t, one, one + 0.6) * Math.PI : t < edge ? Math.PI + seg(t, two, two + 0.6) * Math.PI : 2 * Math.PI;
      const sx = 980 + (t < one ? 0 : t < two ? seg(t, one, one + 0.6) * 90 : t < edge ? 90 + seg(t, two, two + 0.6) * 90 : 180);
      const walking = (t > one && t < one + 0.6) || (t > two && t < two + 0.6);
      const pose: Pose = walking ? mixPose(walkPose(ph, 0.9), { armN: [100, 40], armF: [-8, 12] }, 0.5) : { lean: 4, armN: [110, 30], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] };
      const [hx, hy] = handPos(sx, 960, 0.78, 1, pose, "N");
      const bx = sx + 260 + (t - at(21, "She")) * 30, by = 420 - (t - at(21, "She")) * 40;
      return (
        <AbsoluteFill>
          <Cam u={u} a={[1100, 640, 1.5]} b={[1160, 640, 1.55]} t={t}>
            <PlatformSet t={t}>
              <CrowdRow x={600} y={940} s={0.62} n={4} mood="idle" t={t} frame={f} gap={240} seed="pa" />
              <Character x={sx} y={960} s={0.78} outfit="sister" pose={pose} expr="happy" look={[0.9, -0.6]} blink={blinkAt(f, 23)} />
              <Balloon x={bx} y={by} s={0.9} t={t} to={undefined} />
              <path d={`M${bx},${by + 56} Q${bx - 60},${by + 180} ${bx - 30 + Math.sin(t * 2) * 15},${by + 300}`} stroke="#f0e6d8" strokeWidth={2.5} fill="none" opacity={0.9} />
            </PlatformSet>
          </Cam>
          <Label x={700} y={200} t={t - one} text="ONE STEP." size={46} />
          <Label x={960} y={200} t={t - two} text="TWO." size={46} />
          <Caption t={t - at(21, "Toward")} text="TOWARD THE EDGE." color="#ff8a90" />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "train", t0: at(21, "And"), t1: PS(22), cool: 0.3,
    render: (t, u, f) => {
      const tx = lerp(-2600, TRAIN_X, easeOut(seg(t, at(21, "express"), PS(22)), 1.2));
      return (
        <AbsoluteFill>
          <PlatformSet t={t} train={<Train x={tx} y={690} s={0.9} len={5} headlight={1} />}>
            <CrowdRow x={700} y={940} s={0.62} n={6} mood="idle" t={t} frame={f} gap={240} seed="pa" />
            <Character x={1500} y={960} s={0.78} outfit="sister" pose={{ lean: 4, armN: [110, 30], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] }} expr="happy" look={[0.9, -0.6]} blink={blinkAt(f, 23)} />
          </PlatformSet>
          <Streaks t={t} n={16} speed={2600} opacity={0.25 * seg(t, at(21, "express"), PS(22))} seed="tr" />
          <Caption t={t - at(21, "doesn't")} text="THE EXPRESS. IT DOESN'T STOP HERE." color="#ff8a90" size={46} />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 22: everyone else, a quarter of a second; you see it now ─────────
  {
    id: "everyone", t0: PS(22), t1: at(22, "You"), bars: "slow", cool: 0.4,
    render: (t, u, f) => (
      <AbsoluteFill>
        <Cam u={u} a={[900, 640, 1.3]} t={t}>
          <PlatformSet t={t} train={<Train x={TRAIN_X} y={690} s={0.9} len={5} />}>
            <CrowdRow x={700} y={940} s={0.62} n={6} mood="frozen" t={0} frame={0} gap={240} seed="pa" />
            <Character x={1300} y={960} s={0.95} facing={-1} outfit="friend" pose={{ lean: 6, armN: [60, 80], armF: [8, 12], legN: [4, 0], legF: [-4, 0] }} expr="smile" look={[0.4, 0.6]} blink={false} />
          </PlatformSet>
        </Cam>
        <Dust t={0} n={40} seed="fz" />
        <TwinDials x={960} y={120} t={t - at(22, "quarter")} s={1.1}
          a={{ label: "EVERYONE ELSE", value: "0.25 s", frac: 0.25, color: "#9aa3b8" }}
          b={{ label: "YOU", value: "0.025 s", frac: 0.025, color: C.gold }} />
      </AbsoluteFill>
    ),
  },
  {
    id: "younow", t0: at(22, "You"), t1: PS(23), bars: "slow",
    render: (t, u, f) => (
      <AbsoluteFill>
        <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.5)" }}><PlatformSet t={t} night={0.3} /></AbsoluteFill>
        <Cam u={u} a={[960, 540, 1]} b={[960, 520, 1.1]} t={t}>
          <Stage>
            <Character x={960} y={1180} s={3.4} view="front" pose={POSES.front} expr="determined" look={[0.3, -0.4]} blink={false} brainGlow={0.5 + 0.5 * sstep(seg(t, at(22, "now"), at(22, "now") + 0.3))} />
          </Stage>
        </Cam>
        <svg width={1920} height={1080} style={{ position: "absolute" }}><Rings t={t - at(22, "now")} cx={960} cy={330} scale={1.6} color={C.gold} /></svg>
        <Stamp x={960} y={880} t={t - at(22, "now")} text="NOW." />
      </AbsoluteFill>
    ),
  },
  // ── Beat 23: you can't run faster; all you get is time to think ───────────
  {
    id: "geometry", t0: PS(23), t1: at(23, "You"),
    render: (t) => (
      <AbsoluteFill>
        <Blueprint t={t}>
          <rect x={300} y={700} width={1320} height={40} fill="#e8c23a" opacity={0.8} />
          <text x={960} y={690} textAnchor="middle" fill={C.cream} fontFamily="sans-serif" fontWeight={800} fontSize={28} letterSpacing={4}>EDGE</text>
          <circle cx={1360} cy={640} r={22} fill="#c56aa8" />
          <circle cx={700} cy={640} r={22} fill={C.hoodie} />
          <path d="M700,640 L1360,640" stroke={C.gold} strokeWidth={3} strokeDasharray="12 10" />
          <text x={1030} y={610} textAnchor="middle" fill={C.gold} fontFamily="sans-serif" fontWeight={800} fontSize={36} letterSpacing={3}>3 M</text>
          <path d="M300,420 L1600,420" stroke="#9aa3b8" strokeWidth={6} />
          <path d="M520,420 L600,420" stroke="#ff8a90" strokeWidth={14} />
          <text x={560} y={390} textAnchor="middle" fill="#ff8a90" fontFamily="sans-serif" fontWeight={800} fontSize={30} letterSpacing={3}>EXPRESS</text>
        </Blueprint>
        <Chip x={960} y={170} t={t - at(23, "head")} text="HEAD START: 0.225 s" accent={C.gold} />
      </AbsoluteFill>
    ),
  },
  {
    id: "legs", t0: at(23, "You"), t1: at(23, "All"),
    render: (t, u, f) => {
      const run = Math.max(0, t - at(23, "run")) * 240;
      return (
        <AbsoluteFill>
          <Blueprint t={t}>
            <rect x={1500} y={300} width={40} height={500} fill="#e8c23a" opacity={0.8} />
            <circle cx={1440} cy={640} r={22} fill="#c56aa8" />
            <Character x={Math.min(520 + run, 1100)} y={800} s={0.9} pose={run > 0 && 520 + run < 1100 ? walkPose(t * 14, 1.2) : POSES.stand} expr={t > at(23, "normal") ? "worry" : "determined"} blink={blinkAt(f)} />
            <path d="M520,860 L1440,860" stroke="#9aa3b8" strokeWidth={3} strokeDasharray="12 10" />
            {t > at(23, "legs", 2) && <text x={1250} y={560} textAnchor="middle" fill="#ff5a5a" fontFamily="sans-serif" fontWeight={900} fontSize={60} letterSpacing={4}>TOO FAR</text>}
          </Blueprint>
          <Chip x={700} y={200} t={t - at(23, "legs", 1)} text="LEGS: NORMAL" accent="#8a8aa0" />
          <Chip x={1200} y={200} t={t - at(23, "normal")} text="SPEED: NORMAL" accent="#8a8aa0" />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "timetothink", t0: at(23, "All"), t1: PS(24), bars: "tight",
    render: (t, u, f) => (
      <AbsoluteFill>
        <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.5)" }}><PlatformSet t={t} night={0.3} /></AbsoluteFill>
        <Stage>
          <Character x={960} y={990} s={2.7} pose={{ lean: 4, armN: [14, 18], armF: [6, 16] }} expr="think" look={[0.5, -0.3]} blink={blinkAt(f, 11)} brainGlow={0.9} />
        </Stage>
        <Stopwatch x={1560} y={110} t={0.225 + (t - at(23, "All")) * 0.02} value="0.225 s" gold sweep={0} />
        <Caption t={t - at(23, "time")} text="TIME TO THINK." color={C.gold} />
      </AbsoluteFill>
    ),
  },
  // ── Beat 24: grab her arm? too far. shout? one move ───────────────────────
  {
    id: "options", t0: PS(24), t1: PS(25), bars: "tight", cool: 0.25,
    render: (t, u, f) => (
      <AbsoluteFill>
        <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.5)" }}><PlatformSet t={t} night={0.35} /></AbsoluteFill>
        <Cam u={u} a={[960, 540, 1]} b={[960, 530, 1.06]} t={t}>
          <Stage>
            <Character x={700} y={990} s={2.7} pose={{ lean: 4, armN: [14, 18], armF: [6, 16] }} expr={t > at(24, "one") ? "determined" : "think"} look={[0.6, -0.2]} blink={blinkAt(f, 11)} brainGlow={0.9} />
          </Stage>
        </Cam>
        <ThoughtStack x={1050} y={220} t={t} size={40} lines={[
          { text: "GRAB HER ARM?", at: at(24, "Grab") },
          { text: "✗ TOO FAR.", at: at(24, "Too"), color: "#ff5a5a", ink: "white" },
          { text: "SHOUT?", at: at(24, "Shout") },
          { text: "✗ SHE WON'T HEAR.", at: at(24, "won't"), color: "#ff5a5a", ink: "white" },
          { text: "ONE MOVE.", at: at(24, "one"), color: C.gold },
        ]} />
      </AbsoluteFill>
    ),
  },
  // ── Beat 25: you reach for the balloon ────────────────────────────────────
  {
    id: "notsister", t0: PS(25), t1: at(25, "You", 2), bars: "slow", cool: 0.3,
    render: (t, u, f) => {
      const reach = easeOut(seg(t, at(25, "reach", 1), at(25, "sister")), 2);
      const pose: Pose = { lean: 8, armN: [lerp(20, 135, reach), lerp(20, 8, reach)], armF: [-8, 12], legN: [20, 0], legF: [-16, 0] };
      return (
        <AbsoluteFill>
          <Cam u={u} a={[1100, 700, 1.3]} b={[1120, 700, 1.34]} t={t}>
            <PlatformSet t={t} night={0.2} train={<Train x={TRAIN_X} y={690} s={0.9} len={5} />}>
              <Character x={880} y={960} s={0.95} pose={pose} expr="determined" look={[0.9, -0.7]} blink={false} />
              <Character x={1340} y={960} s={0.78} outfit="sister" pose={{ lean: 4, armN: [110, 30], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] }} expr="happy" look={[0.9, -0.6]} blink={false} />
              <Balloon x={1260} y={430} s={0.9} t={t} to={[1180, 700]} sway={0.3} />
            </PlatformSet>
          </Cam>
          <Dust t={t * 0.15} n={30} seed="ns" />
          <Label x={1500} y={230} t={t - at(25, "sister")} text="NOT HER" size={44} color="#ff8a90" />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "grabstring", t0: at(25, "You", 2), t1: PS(26), bars: "slow", cool: 0.3,
    render: (t, u) => {
      const g = at(25, "balloon");
      const reach = easeOut(seg(t, at(25, "You", 2), g), 3);
      const curl = sstep(seg(t, g, g + 0.18));
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ filter: "blur(12px)", transform: "scale(1.4)" }}><PlatformSet t={t} night={0.25} /></AbsoluteFill>
          <Stage>
            <Balloon x={1040} y={200} s={1.4} t={t} to={[990, 560 - curl * 20]} sway={0.3} />
            <Hand x={lerp(-300, 960, reach)} y={lerp(1000, 600, reach)} s={1.5} rot={-50} curl={curl} />
            <Rings t={t - g - 0.05} cx={990} cy={560} scale={1.1} />
          </Stage>
          <Dust t={t * 0.15} n={30} seed="gs" />
        </AbsoluteFill>
      );
    },
  },
  // ── Beat 26: the string stops, she stops, she looks up ────────────────────
  {
    id: "stringstops", t0: PS(26), t1: at(26, "She", 2), bars: "slow", cool: 0.25,
    render: (t, u, f) => {
      const stop2 = at(26, "stops", 2);
      const sisterPose: Pose = t < stop2 ? mixPose(walkPose(seg(t, PS(26), stop2) * 3, 0.7), { armN: [110, 30], armF: [-8, 12] }, 0.5) : { lean: 2, armN: [110, 30], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] };
      const heroPose: Pose = { lean: 8, armN: [135, 8], armF: [-8, 12], legN: [20, 0], legF: [-16, 0] };
      const [hx, hy] = handPos(880, 960, 0.95, 1, heroPose, "N");
      return (
        <AbsoluteFill>
          <Cam u={u} a={[1100, 700, 1.3]} t={t}>
            <PlatformSet t={t} night={0.2} train={<Train x={TRAIN_X} y={690} s={0.9} len={5} />}>
              <Character x={880} y={960} s={0.95} pose={heroPose} expr="determined" look={[0.9, -0.7]} blink={false} />
              <Character x={1340 + (t < stop2 ? seg(t, PS(26), stop2) * 30 : 30)} y={960} s={0.78} outfit="sister" pose={sisterPose} expr={t < stop2 ? "happy" : "shock"} look={[0.9, -0.6]} blink={blinkAt(f, 23)} />
              <Balloon x={1270} y={440} s={0.9} t={t} to={[hx, hy]} sway={t < at(26, "stops", 1) ? 0.6 : 0.15} />
              <Rings t={t - at(26, "stops", 1)} cx={1270} cy={440} scale={0.7} color="#ff8a90" />
            </PlatformSet>
          </Cam>
          <Label x={1150} y={200} t={t - at(26, "stops", 1)} text="THE STRING STOPS." size={44} />
          <Label x={1150} y={280} t={t - stop2} text="SHE STOPS." size={44} color={C.gold} />
        </AbsoluteFill>
      );
    },
  },
  {
    id: "looksup", t0: at(26, "She", 2), t1: PE(26), bars: "tight",
    render: (t, u, f) => {
      const up = at(26, "up"), you = at(26, "you");
      const look: [number, number] = t < up ? [0, 0] : t < you ? [0.2, -0.9] : [-0.9, -0.1];
      return (
        <AbsoluteFill>
          <AbsoluteFill style={{ filter: "blur(14px)", transform: "scale(1.5)" }}><PlatformSet t={t} night={0.2} /></AbsoluteFill>
          <Stage>
            <Character x={960} y={1000} s={2.8} view="front" outfit="sister" pose={{ lean: 0, armN: [110, 30], armF: [10, 8], legN: [6, 0], legF: [6, 0], head: t > up ? 6 : 0 }}
              expr={t < up ? "shock" : t < you ? "neutral" : "happy"} look={look} blink={blinkAt(f, 23)} />
            {t > up && <Balloon x={1180} y={110} s={1.1} t={t} to={undefined} sway={0.2} />}
          </Stage>
        </AbsoluteFill>
      );
    },
  },
  {
    id: "trainpass", t0: PE(26), t1: PS(27), bars: "slow", cool: 0.45,
    render: (t, u, f) => {
      const tx = lerp(TRAIN_X, 4600, easeOut(seg(t, PE(26), PS(27) - 0.2), 0.8));
      const heroPose: Pose = { lean: 8, armN: [135, 8], armF: [-8, 12], legN: [20, 0], legF: [-16, 0] };
      const [hx, hy] = handPos(880, 960, 0.95, 1, heroPose, "N");
      return (
        <AbsoluteFill>
          <Cam u={u} a={[1100, 700, 1.3]} b={[1100, 700, 1.26]} t={t} shake={3}>
            <PlatformSet t={t} night={0.2} train={<Train x={tx} y={690} s={0.9} len={6} headlight={0.4} />}>
              <CrowdRow x={500} y={940} s={0.62} n={3} mood="shock" t={t} frame={f} gap={240} seed="pa" />
              <Character x={880} y={960} s={0.95} pose={heroPose} expr="determined" look={[0.9, -0.7]} blink={false} />
              <Character x={1370} y={960} s={0.78} outfit="sister" pose={{ lean: 2, armN: [110, 30], armF: [-8, 12], legN: [4, 0], legF: [-4, 0] }} expr="shock" look={[-0.9, 0]} blink={false} />
              <Balloon x={1270} y={440} s={0.9} t={t} to={[hx, hy]} sway={0.15} />
            </PlatformSet>
          </Cam>
          <Streaks t={t} n={40} speed={3200} opacity={0.5} seed="tp" />
        </AbsoluteFill>
      );
    },
  },
];
