// Vertical player for "7 Days Offline": the landscape shot cropped to 9:16, flashes, a light vertical vignette, big text and captions.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { SpeedFlash } from "../kit/Fx";
import { FPS } from "../theme";
import { Shot } from "../shots/types";
import { at, BigText, Captions, END, P, Vertical } from "./ShortKit";
import { SHORT, SHORT_FLASHES } from "./shots";

const pick = (t: number) => {
  let i = SHORT.findIndex((s) => t >= s.t0 && t < s.t1);
  if (i < 0) i = t < SHORT[0].t0 ? 0 : SHORT.length - 1;
  return SHORT[i];
};

const Frame: React.FC<{ shot: Shot; t: number; frame: number; captions?: boolean }> = ({ shot, t, frame, captions = true }) => {
  const u = (t - shot.t0) / (shot.t1 - shot.t0);
  return (
    <AbsoluteFill style={{ background: "#000", overflow: "hidden" }}>
      <Vertical>
        {shot.render(t, u, frame)}
        {SHORT_FLASHES.map((fl, j) => <SpeedFlash key={j} age={frame - Math.round(fl.t * FPS)} strength={fl.strength} seed={j} />)}
        {(shot.cool ?? 0) > 0 && <AbsoluteFill style={{ background: "#3a5aa8", mixBlendMode: "soft-light", opacity: shot.cool }} />}
      </Vertical>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 80% 60% at 50% 45%, transparent 55%, rgba(12,6,18,0.35) 100%)", pointerEvents: "none" }} />
      <BigText t={t} t0={at(0, "seven") - 0.05} t1={P(1)} text="7 DAYS" size={190} y={360} />
      <BigText t={t} t0={at(2, "useless") - 0.05} t1={at(2, "your", 2, -0.06)} text="DECLINED" size={130} y={360} color="#ff6b55" />
      <BigText t={t} t0={at(5, "day") - 0.05} t1={at(6, "Day", 1, -0.05)} text="DAY 3" size={170} y={360} color="#f2b84b" />
      <BigText t={t} t0={at(6, "Day", 1, -0.05)} t1={at(6, "Day", 2, -0.05)} text="DAY 4" size={170} y={360} color="#ff9a4d" />
      <BigText t={t} t0={at(6, "Day", 2, -0.05)} t1={at(6, "And", 1, -0.06)} text="DAY 5" size={170} y={360} color="#ff6b55" />
      <BigText t={t} t0={at(8, "Watch") - 0.05} t1={END + 0.2} text="WATCH THE" size={120} y={300} />
      <BigText t={t} t0={at(8, "full") - 0.05} t1={END + 0.2} text="FULL STORY" size={150} y={440} color="#f2b84b" />
      {captions && <Captions t={t} y={1590} />}
    </AbsoluteFill>
  );
};

export const Short: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return <><Frame shot={pick(t)} t={t} frame={frame} /><Audio src={staticFile("short_vo.wav")} /></>;
};

/** Silent picture for the final mux (sound is mixed in Python). */
export const ShortPicture: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return <Frame shot={pick(t)} t={t} frame={frame} />;
};

/** Review: each shot at 10%, 50% and 90%. */
const LIST = SHORT.flatMap((s) => [0.1, 0.5, 0.9].map((p) => [s, p] as const));
export const SHORT_STRIPS = LIST.length;
export const ShortStrips: React.FC = () => {
  const [s, p] = LIST[useCurrentFrame()];
  const t = s.t0 + (s.t1 - s.t0) * p;
  const frame = Math.round(t * FPS);
  return (
    <>
      <Frame shot={s} t={t} frame={frame} />
      <div style={{ position: "absolute", left: 20, top: 10, color: "#fff", fontFamily: "sans-serif", fontSize: 44, fontWeight: 800, textShadow: "0 0 6px #000" }}>{s.id} @{p} {t.toFixed(2)}s</div>
    </>
  );
};

export const SHORT_FRAMES = Math.round((END + 0.1) * FPS);
