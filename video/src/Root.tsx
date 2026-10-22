import { Composition } from "remotion";
import { makeEpisode } from "./Episode";
import { KitTest } from "./KitTest";
import { makeMids } from "./Mids";
import { FLASHES, MIN1, MIN1_END } from "./shots/min1";
import { F } from "./timing";
import { FPS, H, W } from "./theme";

const Minute1 = makeEpisode(MIN1, FLASHES);
const Mids1 = makeMids(MIN1);
const Late1 = makeMids(MIN1, 0.85);

export const Root = () => (
  <>
    <Composition id="Minute1" component={Minute1} durationInFrames={F(MIN1_END)} fps={FPS} width={W} height={H} />
    <Composition id="Mids1" component={Mids1} durationInFrames={MIN1.length} fps={FPS} width={W} height={H} />
    <Composition id="Late1" component={Late1} durationInFrames={MIN1.length} fps={FPS} width={W} height={H} />
    <Composition id="KitTest" component={KitTest} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);
