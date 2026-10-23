// Episode 06 "What If Everyone Could Read Your Mind?": all parts joined into one film, plus review strips.
import React from "react";
import { joinShots, makeFilm } from "../epx/Kit";
import { END6 } from "./common";
import { A6_SHOTS, A6Type } from "./PartA";
import { B6_SHOTS, B6Type } from "./PartB";

const ALL = joinShots([A6_SHOTS, B6_SHOTS], END6);
const AllType: React.FC<{ t: number }> = ({ t }) => <><A6Type t={t} /><B6Type t={t} /></>;
export const EP6 = makeFilm(ALL, AllType, END6);
