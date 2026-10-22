import { AbsoluteFill } from "remotion";
import { Character, POSES, Expr } from "./kit/Character";
import { Hand } from "./kit/Hand";
import { Fly, Cup, Phone, Table, Chair } from "./kit/Props";
import { Sky } from "./kit/Sets";
import { Grade } from "./kit/Fx";
import { Chip, Stopwatch, Stamp } from "./kit/Graphics";

const EX: Expr[] = ["neutral", "smile", "happy", "smug", "shock", "think", "deadpan", "laugh", "worry", "determined"];

export const KitTest = () => (
  <AbsoluteFill>
    <Sky sunY={200} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {EX.map((e, i) => (
        <Character key={e} x={110 + i * 180} y={330} s={0.55} outfit={i % 3 === 0 ? "hero" : i % 3 === 1 ? "friend" : "scientist"} expr={e} pose={POSES.stand} />
      ))}
      <Character x={150} y={760} s={0.6} pose={POSES.shrug} expr="happy" />
      <Character x={330} y={760} s={0.6} pose={POSES.point} expr="determined" outfit="friend" />
      <Character x={520} y={760} s={0.6} pose={POSES.armUp} expr="laugh" outfit="sister" />
      <Chair x={720} y={760} s={0.6} />
      <Character x={720} y={740} s={0.6} pose={POSES.sitTable} expr="smile" />
      <Table x={860} y={700} s={0.6} />
      <Hand x={1300} y={640} s={0.6} curl={0} />
      <Hand x={1300} y={900} s={0.6} curl={1} />
      <Fly x={1650} y={560} s={2} t={0.3} />
      <Cup x={1600} y={830} s={0.9} t={0.5} />
      <Phone x={1800} y={720} s={0.7} rot={-12} />
    </svg>
    <Stopwatch x={1800} y={40} t={0.3} value="0.025 s" gold />
    <Chip x={1100} y={1020} t={1} text="HEAD START" />
    <Stamp x={1500} y={260} t={1} text="×10" />
    <Grade frame={3} />
  </AbsoluteFill>
);
