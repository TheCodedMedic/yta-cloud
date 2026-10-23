// Rig angle sheet: the same character at every yaw, standing and walking, plus a turn. Render one still and inspect.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Character, POSES, walkPose } from "./kit/Character";
import { FONT_UI } from "./theme";

const YAWS = [0, 0.25, 0.5, 0.75, 1];

export const RigTest: React.FC = () => (
  <AbsoluteFill style={{ background: "#3b3f55" }}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080">
      {YAWS.map((yw, i) => (
        <g key={`s${i}`}>
          <Character x={200 + i * 210} y={210} s={0.62} yaw={yw} outfit="ivory" pose={yw === 0 ? POSES.front : POSES.stand} expr="smile" />
          <text x={200 + i * 210} y={340} fill="#fff" fontFamily={FONT_UI} fontSize={26} textAnchor="middle">yaw {yw}</text>
        </g>
      ))}
      {YAWS.map((yw, i) => (
        <Character key={`w${i}`} x={200 + i * 210} y={560} s={0.62} yaw={yw} outfit="hero" pose={walkPose(1.2)} expr="determined" />
      ))}
      {[0, 1, 2, 3, 4].map((k) => (
        <Character key={`k${k}`} x={1300 + k * 130} y={210} s={0.62} view="side" outfit="oldman" pose={walkPose((k / 5) * Math.PI * 2)} expr="think" />
      ))}
      <Character x={1320} y={560} s={0.62} view="quarter" outfit="scientist" pose={POSES.point} expr="shock" />
      <Character x={1520} y={560} s={0.62} view="side" outfit="friend" pose={POSES.armUp} expr="laugh" />
      <Character x={1720} y={560} s={0.62} view="side" facing={-1} outfit="sister" pose={POSES.sitTable} expr="worry" />
      {YAWS.map((yw, i) => (
        <Character key={`f${i}`} x={200 + i * 210} y={880} s={0.62} yaw={yw} outfit="ivory" pose={yw === 0 ? POSES.front : { ...POSES.stand, armN: [40, 70], armF: [20, 30] }} expr="worry" />
      ))}
      <Character x={1320} y={880} s={0.62} view="side" outfit="hero" pose={POSES.stand} expr="smug" />
      <Character x={1520} y={880} s={0.62} view="quarter" outfit="extra" pose={POSES.fistsUp} expr="laugh" />
      <Character x={1720} y={880} s={0.62} view="side" outfit="scientist" pose={POSES.stand} expr="neutral" />
    </svg>
  </AbsoluteFill>
);
