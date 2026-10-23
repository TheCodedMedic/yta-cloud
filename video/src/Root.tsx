import { Composition } from "remotion";
import { makeEpisode } from "./Episode";
import { KitTest } from "./KitTest";
import { RigTest } from "./RigTest";
import { AssetSheet, ASSET_PANELS } from "./ep04/AssetSheet";
import { Ep4Minute1, Ep4Minute1Picture, M1_FRAMES } from "./ep04/Minute1";
import { FPS4 } from "./ep04/core";
import { Ep4Film, Ep4FilmPicture, Ep4PartStrips, FILM_FRAMES, stripCount, PART_COUNT } from "./ep04/Film";
import { CameraTest, CamStills, CAMTEST_FRAMES, CAMSTILL_FRAMES, FPS3 } from "./cam3d/CameraTest";
import { makeMids, makeStrips } from "./Mids";
import { FLASHES, MIN1, MIN1_END } from "./shots/min1";
import { FLASHES2, MIN2, MIN2_END } from "./shots/min2";
import { FLASHES3, MIN3, MIN3_END } from "./shots/min3";
import { FLASHES4, MIN4, MIN4_END } from "./shots/min4";
import { DEMO, DEMO_END } from "./shots/demo";
import { F } from "./timing";
import { Short, ShortPicture, ShortStrips, SHORT_FRAMES, SHORT_STRIPS } from "./short/Short";
import { FPS, H, W } from "./theme";

const Minute1 = makeEpisode(MIN1, FLASHES);
const Mids1 = makeMids(MIN1);
const Mids2 = makeMids(MIN2);
const Strips3 = makeStrips(MIN3, MIN3.map((s) => s.id));
const Strips4 = makeStrips(MIN4, MIN4.map((s) => s.id));
const Demo = makeEpisode(DEMO, [], false);
const StripsD = makeStrips(DEMO, DEMO.map((s) => s.id), [0.1, 0.4, 0.7, 0.95]);
const ALL = [...MIN1, ...MIN2, ...MIN3, ...MIN4];
const Full = makeEpisode(ALL, [...FLASHES, ...FLASHES2, ...FLASHES3, ...FLASHES4]);
const Strips2 = makeStrips(MIN2, MIN2.map((s) => s.id));
const Late1 = makeMids(MIN1, 0.85);
const CHAR_SHOTS = ["wide", "swat", "herocalm", "gotcha", "twoshot", "friendfrozen", "sip", "stare", "shrug", "brain10", "quarter", "signal", "goldwatch", "lanes", "catch", "upgrade", "earlier", "superpower"];
const Strips1 = makeStrips(MIN1, CHAR_SHOTS);

export const Root = () => (
  <>
    <Composition id="Minute1" component={Minute1} durationInFrames={F(MIN1_END)} fps={FPS} width={W} height={H} />
    <Composition id="Demo" component={Demo} durationInFrames={F(DEMO_END)} fps={FPS} width={W} height={H} />
    <Composition id="StripsD" component={StripsD.Strips} durationInFrames={StripsD.count} fps={FPS} width={W} height={H} />
    <Composition id="Full" component={Full} durationInFrames={F(MIN4_END + 0.5)} fps={FPS} width={W} height={H} />
    <Composition id="Strips4" component={Strips4.Strips} durationInFrames={Strips4.count} fps={FPS} width={W} height={H} />
    <Composition id="Strips3" component={Strips3.Strips} durationInFrames={Strips3.count} fps={FPS} width={W} height={H} />
    <Composition id="Mids2" component={Mids2} durationInFrames={MIN2.length} fps={FPS} width={W} height={H} />
    <Composition id="Strips2" component={Strips2.Strips} durationInFrames={Strips2.count} fps={FPS} width={W} height={H} />
    <Composition id="Mids1" component={Mids1} durationInFrames={MIN1.length} fps={FPS} width={W} height={H} />
    <Composition id="Late1" component={Late1} durationInFrames={MIN1.length} fps={FPS} width={W} height={H} />
    <Composition id="Strips1" component={Strips1.Strips} durationInFrames={Strips1.count} fps={FPS} width={W} height={H} />
    <Composition id="Short" component={Short} durationInFrames={SHORT_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="ShortPicture" component={ShortPicture} durationInFrames={SHORT_FRAMES} fps={FPS} width={1080} height={1920} />
    <Composition id="ShortStrips" component={ShortStrips} durationInFrames={SHORT_STRIPS} fps={FPS} width={1080} height={1920} />
    <Composition id="CameraTest" component={CameraTest} durationInFrames={CAMTEST_FRAMES} fps={FPS3} width={1920} height={1080} />
    <Composition id="CamStills" component={CamStills} durationInFrames={CAMSTILL_FRAMES} fps={FPS3} width={1920} height={1080} />
    <Composition id="Ep4Minute1" component={Ep4Minute1} durationInFrames={M1_FRAMES} fps={FPS4} width={1920} height={1080} />
    <Composition id="Ep4Minute1Picture" component={Ep4Minute1Picture} durationInFrames={M1_FRAMES} fps={FPS4} width={1920} height={1080} />
    <Composition id="Ep4Film" component={Ep4Film} durationInFrames={FILM_FRAMES} fps={FPS4} width={1920} height={1080} />
    <Composition id="Ep4FilmPicture" component={Ep4FilmPicture} durationInFrames={FILM_FRAMES} fps={FPS4} width={1920} height={1080} />
    {Array.from({ length: PART_COUNT }, (_, k) => <Composition key={k} id={`Ep4Part${k}`} component={() => <Ep4PartStrips part={k} />} durationInFrames={stripCount(k)} fps={FPS4} width={1920} height={1080} />)}
    <Composition id="Ep4Assets" component={AssetSheet} durationInFrames={ASSET_PANELS} fps={30} width={1920} height={1080} />
    <Composition id="RigTest" component={RigTest} durationInFrames={1} fps={FPS} width={W} height={H} />
    <Composition id="KitTest" component={KitTest} durationInFrames={1} fps={FPS} width={W} height={H} />
  </>
);
