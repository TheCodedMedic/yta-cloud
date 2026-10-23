// Episode 04, the whole film: every part's shots in order (each shot ends where the next begins), all on-screen type, the voice.
import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { useEpFonts } from "./AssetSheet";
import { FILM_END, FPS4, Shot, ShotFrame } from "./core";
import { M1_SHOTS, M1Type } from "./Minute1";
import { B_SHOTS, BType } from "./PartB";
import { C_SHOTS, CType } from "./PartC";
import { D_SHOTS, DType } from "./PartD";
import { E_SHOTS, EType } from "./PartE";

const PARTS: { shots: Shot[]; type: React.FC<{ t: number }> }[] = [
  { shots: M1_SHOTS, type: M1Type },
  { shots: B_SHOTS, type: BType },
  { shots: C_SHOTS, type: CType },
  { shots: D_SHOTS, type: DType },
  { shots: E_SHOTS, type: EType },
];
const ALL: Shot[] = PARTS.flatMap((p) => p.shots).sort((a, b) => a.t0 - b.t0).map((s, i, arr) => ({ ...s, t1: arr[i + 1] ? arr[i + 1].t0 : FILM_END }));
const AllType: React.FC<{ t: number }> = ({ t }) => <>{PARTS.map((p, i) => <p.type key={i} t={t} />)}</>;

export const FILM_FRAMES = Math.round(FILM_END * FPS4);
export const Ep4Film: React.FC<{ voice?: boolean }> = ({ voice = true }) => {
  const ready = useEpFonts();
  const t = useCurrentFrame() / FPS4;
  if (!ready) return <AbsoluteFill style={{ background: "#05070F" }} />;
  return <><ShotFrame shots={ALL} t={t} type={AllType} />{voice && <Audio src={staticFile("ep04_vo.wav")} />}</>;
};
export const Ep4FilmPicture: React.FC = () => <Ep4Film voice={false} />;

/** Review strips: inputProps { part } picks one part (index into PARTS); each shot at 15 / 50 / 85 %. */
const listFor = (part: number) => PARTS[part].shots.map((s) => ALL.find((a) => a.id === s.id && a.t0 === s.t0)!).flatMap((s) => [0.15, 0.5, 0.85].map((p) => [s, p] as const));
export const stripCount = (part: number) => listFor(part).length;
export const Ep4PartStrips: React.FC<{ part: number }> = ({ part }) => {
  const ready = useEpFonts();
  const [s, p] = listFor(part)[useCurrentFrame()];
  const t = s.t0 + (s.t1 - s.t0) * p;
  if (!ready) return <AbsoluteFill style={{ background: "#05070F" }} />;
  return <ShotFrame shots={ALL} t={t} type={AllType} label={`${s.id} ${t.toFixed(2)}s`} />;
};
export const PART_COUNT = PARTS.length;
