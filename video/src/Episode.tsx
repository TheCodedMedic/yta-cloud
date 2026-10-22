import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { Grade, Letterbox, SpeedFlash, sstep } from "./kit/Fx";
import { BAR_PX, Flash, Shot } from "./shots/types";
import { FPS } from "./theme";

const BAR_EASE = 9; // frames

export const makeEpisode = (shots: Shot[], flashes: Flash[], voice = true) => {
  const Episode: React.FC = () => {
    const frame = useCurrentFrame();
    const t = frame / FPS;
    let i = shots.findIndex((s) => t >= s.t0 && t < s.t1);
    if (i < 0) i = t < shots[0].t0 ? 0 : shots.length - 1;
    const shot = shots[i];
    const u = (t - shot.t0) / (shot.t1 - shot.t0);

    const target = BAR_PX[shot.bars ?? "normal"];
    const prev = i > 0 ? BAR_PX[shots[i - 1].bars ?? "normal"] : target;
    const k = sstep((frame - Math.round(shot.t0 * FPS)) / BAR_EASE);
    const bars = prev + (target - prev) * k;

    return (
      <AbsoluteFill style={{ background: "#000" }}>
        {shot.render(t, u, frame)}
        {flashes.map((fl, j) => (
          <SpeedFlash key={j} age={frame - Math.round(fl.t * FPS)} cx={fl.x} cy={fl.y} strength={fl.strength} seed={j} />
        ))}
        <Grade frame={frame} vignette={0.42 + (bars - 62) / 160} cool={shot.cool} />
        <Letterbox h={bars} />
        {voice && <Audio src={staticFile("vo.wav")} />}
      </AbsoluteFill>
    );
  };
  return Episode;
};
