import { AbsoluteFill } from "remotion";
import { Character, POSES, Expr, walkPose, seatLayout } from "./kit/Character";
import { Hand } from "./kit/Hand";
import { Fly, Cup, Phone, Table, Chair } from "./kit/Props";
import { Sky } from "./kit/Sets";
import { Grade } from "./kit/Fx";

const EX: Expr[] = ["neutral", "smile", "happy", "smug", "shock", "think", "deadpan", "laugh", "worry", "determined"];
const L = seatLayout(760, 0.7);

export const KitTest = () => (
  <AbsoluteFill>
    <Sky sunY={200} />
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      {EX.map((e, i) => (
        <Character key={e} x={100 + i * 150} y={250} s={0.5} outfit={i % 3 === 0 ? "hero" : i % 3 === 1 ? "friend" : "scientist"} expr={e}
          view={i % 2 ? "front" : "side"} />
      ))}
      {/* walk cycle keys: contact, down, passing, up */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
        <Character key={k} x={90 + k * 110} y={520} s={0.5} pose={walkPose((k / 8) * Math.PI * 2)} expr="smile" />
      ))}
      <Character x={1050} y={520} s={0.5} view="front" pose={POSES.shrug} expr="happy" />
      <Character x={1200} y={520} s={0.5} view="front" pose={POSES.spread} expr="laugh" />
      <Character x={1350} y={520} s={0.5} view="front" pose={POSES.frontFists} expr="shock" outfit="friend" />
      <Character x={1480} y={520} s={0.5} pose={POSES.point} expr="determined" outfit="scientist" />
      <Character x={1620} y={520} s={0.5} pose={POSES.armUp} expr="laugh" outfit="sister" />
      <Character x={1760} y={520} s={0.5} view="front" pose={POSES.hero} expr="smug" brainGlow={1} />
      <Chair x={200} y={L.seatY} s={0.7} legs={L.chairLegs / 0.7} />
      <Character x={210} y={760} s={0.7} pose={POSES.sitTable} expr="smile" />
      <Table x={360} y={L.tableTopY} s={0.7} h={L.tableH / 0.7} />
      <Character x={510} y={760} s={0.7} facing={-1} outfit="friend" pose={POSES.sitTable} expr="laugh" />
      <Chair x={520} y={L.seatY} s={0.7} facing={-1} legs={L.chairLegs / 0.7} />
      <Hand x={1100} y={800} s={0.5} curl={0} />
      <Hand x={1100} y={980} s={0.5} curl={1} />
      <Fly x={1500} y={760} s={2} t={0.3} />
      <Cup x={1500} y={1000} s={0.8} t={0.5} />
      <Phone x={1750} y={850} s={0.7} rot={-12} />
    </svg>
    <Grade frame={3} />
  </AbsoluteFill>
);
