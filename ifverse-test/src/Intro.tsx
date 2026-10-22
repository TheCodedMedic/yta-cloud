import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Cafe, fadeInOut, Grade, Sky, SunRays } from "./Backdrop";
import { HoodieKid, TinyFigure } from "./Character";
import { C, FONT } from "./theme";

// Scene 1 — wide establishing shot of the café at sunset, slow push-in.
const Establish: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, dur], [1, 1.14], {
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(frame, dur, 10) }}>
      <AbsoluteFill style={{ transform: `scale(${zoom})`, transformOrigin: "50% 78%" }}>
        <Sky sunY={150} />
        <Cafe y={190} />
        <svg width={1920} height={1080} style={{ position: "absolute" }}>
          {/* street lamp + tree silhouettes */}
          <rect x={1640} y={520} width={10} height={520} fill={C.ink} />
          <circle cx={1645} cy={515} r={14} fill={C.windowHot} />
          <circle cx={1645} cy={515} r={60} fill={C.windowHot} opacity={0.15} />
          <circle cx={1790} cy={640} r={70} fill={C.ink} />
          <rect x={1784} y={650} width={12} height={380} fill={C.ink} />
          {/* table + two customers */}
          <ellipse cx={960} cy={985} rx={95} ry={20} fill={C.table} />
          <rect x={955} y={985} width={10} height={60} fill={C.ink} />
          <TinyFigure x={870} y={1040} color={C.hoodie} h={140} />
          <TinyFigure x={1050} y={1040} color={C.ink} h={140} hat />
        </svg>
      </AbsoluteFill>
      <Grade />
    </AbsoluteFill>
  );
};

// Scene 2 — close-up: buzzing fly, reaction-time HUD drops 0.25 s → 0.025 s,
// and the world (the fly) suddenly slows down.
const SLOW_AT = 70;
const Closeup: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame < SLOW_AT ? frame : SLOW_AT + (frame - SLOW_AT) * 0.1;
  const flyX = 960 + Math.sin(t / 3.1) * 330 + Math.sin(t / 1.3) * 60;
  const flyY = 420 + Math.cos(t / 2.3) * 160 + Math.sin(t / 0.9) * 30;
  const look = Math.max(-25, Math.min(25, (flyX - 960) / 12));
  const slowPop = spring({ frame: frame - SLOW_AT, fps, config: { damping: 12 } });
  const reaction = frame < SLOW_AT ? "0.25 s" : "0.025 s";
  const handAngle = (t * 24) % 360;
  const zoom = interpolate(frame, [SLOW_AT, SLOW_AT + 20], [1, 1.06], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(frame, dur, 10), transform: `scale(${zoom})` }}>
      <AbsoluteFill style={{ transform: "scale(2.1)", transformOrigin: "50% 75%", filter: "blur(9px) brightness(0.75)" }}>
        <Sky sunY={150} />
        <Cafe y={190} />
      </AbsoluteFill>
      {/* the slow-down moment: a cool tint washes over */}
      <AbsoluteFill style={{ background: "#5d6fb0", mixBlendMode: "soft-light", opacity: slowPop * 0.7 }} />
      <svg width={1920} height={1080} style={{ position: "absolute" }}>
        <HoodieKid x={960} y={600} scale={1.15} lookX={look} smile={frame < SLOW_AT ? 0.6 : 1} />
        {/* fly */}
        <g transform={`translate(${flyX} ${flyY})`}>
          {frame < SLOW_AT &&
            [1, 2, 3].map((k) => (
              <circle key={k} cx={-Math.cos(t / 3.1) * 10 * k} cy={Math.sin(t / 2.3) * 6 * k} r={9 - k * 2} fill={C.ink} opacity={0.25 / k} />
            ))}
          <ellipse
            cx={-8}
            cy={-12}
            rx={13}
            ry={6}
            fill="white"
            opacity={0.6}
            transform={`rotate(${-30 + Math.sin(t * 3) * 25})`}
          />
          <ellipse cx={8} cy={-12} rx={13} ry={6} fill="white" opacity={0.6} transform={`rotate(${30 - Math.sin(t * 3) * 25})`} />
          <circle r={11} fill={C.ink} />
        </g>
      </svg>
      {/* reaction-time HUD */}
      <div style={{ position: "absolute", right: 150, top: 110, textAlign: "center", transform: `scale(${1 + slowPop * 0.15 - (frame >= SLOW_AT ? 0.15 : 0) * (1 - slowPop)})` }}>
        <svg width={160} height={160}>
          <circle cx={80} cy={80} r={64} fill="rgba(20,15,30,0.55)" stroke="white" strokeWidth={5} />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1={80} y1={22} x2={80} y2={32} stroke="white" strokeWidth={4} transform={`rotate(${i * 30} 80 80)`} />
          ))}
          <line x1={80} y1={80} x2={80} y2={34} stroke={C.rim} strokeWidth={5} strokeLinecap="round" transform={`rotate(${handAngle} 80 80)`} />
          <circle cx={80} cy={80} r={6} fill="white" />
        </svg>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: 48, color: frame < SLOW_AT ? "white" : C.windowHot, letterSpacing: 2 }}>
          {reaction}
        </div>
      </div>
      <Grade />
    </AbsoluteFill>
  );
};

// Scene 3 — title card over the sunset with rotating rays.
const LINE1 = "WHAT IF YOUR REACTION TIME".split(" ");
const LINE2 = "WAS 10× FASTER?".split(" ");
const Title: React.FC<{ dur: number }> = ({ dur }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const word = (w: string, i: number, delay: number, color = "white") => {
    const s = spring({ frame: frame - delay - i * 4, fps, config: { damping: 14 } });
    return (
      <span
        key={w + i}
        style={{
          display: "inline-block",
          margin: "0 14px",
          opacity: s,
          transform: `translateY(${(1 - s) * 30}px)`,
          color,
        }}
      >
        {w}
      </span>
    );
  };
  const drift = interpolate(frame, [0, dur], [0, -30]);
  return (
    <AbsoluteFill style={{ opacity: fadeInOut(frame, dur, 10) }}>
      <AbsoluteFill style={{ transform: `translateY(${drift}px)` }}>
        <Sky sunY={640} />
        <SunRays cx={960} cy={640} />
        <Cafe y={720} />
      </AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 150,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 900,
          fontSize: 76,
          letterSpacing: 6,
          textShadow: "0 4px 24px rgba(40,20,40,0.6)",
        }}
      >
        <div>{LINE1.map((w, i) => word(w, i, 8))}</div>
        <div style={{ marginTop: 10 }}>
          {LINE2.map((w, i) => word(w, i, 8 + LINE1.length * 4 + 6, w === "10×" ? C.windowHot : "white"))}
        </div>
      </div>
      <Grade />
    </AbsoluteFill>
  );
};

export const Intro: React.FC = () => (
  <AbsoluteFill style={{ background: C.night }}>
    <Sequence from={0} durationInFrames={130}>
      <Establish dur={130} />
    </Sequence>
    <Sequence from={122} durationInFrames={128}>
      <Closeup dur={128} />
    </Sequence>
    <Sequence from={242} durationInFrames={118}>
      <Title dur={118} />
    </Sequence>
  </AbsoluteFill>
);
