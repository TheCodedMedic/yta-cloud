import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grade, Letterbox } from "./kit/Fx";
import { BAR_PX, Shot } from "./shots/types";
import { FPS, FONT_UI } from "./theme";

/** Review sheet source: frame i shows shot i at a chosen point (default: middle). */
export const makeMids = (shots: Shot[], at = 0.5) => {
  const Mids: React.FC = () => {
    const i = useCurrentFrame();
    const s = shots[i];
    const t = s.t0 + (s.t1 - s.t0) * at;
    const frame = Math.round(t * FPS);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        {s.render(t, at, frame)}
        <Grade frame={frame} cool={s.cool} />
        <Letterbox h={BAR_PX[s.bars ?? "normal"]} />
        <div style={{ position: "absolute", left: 20, top: 8, color: "#fff", fontFamily: FONT_UI, fontSize: 40, fontWeight: 800 }}>
          {i} {s.id} {t.toFixed(1)}s
        </div>
      </AbsoluteFill>
    );
  };
  return Mids;
};

/** Review strip source: for each listed shot, frames at the given points. */
export const makeStrips = (shots: Shot[], ids: string[], points = [0.08, 0.5, 0.92]) => {
  const list = ids.flatMap((id) => points.map((p) => [shots.find((s) => s.id === id)!, p] as const));
  const Strips: React.FC = () => {
    const [s, p] = list[useCurrentFrame()];
    const t = s.t0 + (s.t1 - s.t0) * p;
    const frame = Math.round(t * FPS);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        {s.render(t, p, frame)}
        <Grade frame={frame} cool={s.cool} />
        <Letterbox h={BAR_PX[s.bars ?? "normal"]} />
        <div style={{ position: "absolute", left: 20, top: 8, color: "#fff", fontFamily: FONT_UI, fontSize: 40, fontWeight: 800 }}>
          {s.id} @{p} {t.toFixed(2)}s
        </div>
      </AbsoluteFill>
    );
  };
  return { Strips, count: list.length };
};
