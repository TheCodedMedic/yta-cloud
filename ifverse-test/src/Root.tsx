import { Composition } from "remotion";
import { Intro } from "./Intro";

export const Root = () => (
  <Composition
    id="Intro"
    component={Intro}
    durationInFrames={360}
    fps={30}
    width={1920}
    height={1080}
  />
);
