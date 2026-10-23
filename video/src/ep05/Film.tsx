// Episode 05 "What If You Couldn't Feel Pain?": all parts joined into one film, plus review strips.
import React from "react";
import { joinShots, makeFilm } from "../epx/Kit";
import { END5 } from "./common";
import { A_SHOTS, AType } from "./PartA";
import { B_SHOTS, BType } from "./PartB";
import { C_SHOTS, CType } from "./PartC";
import { D_SHOTS, DType } from "./PartD";

const ALL = joinShots([A_SHOTS, B_SHOTS, C_SHOTS, D_SHOTS], END5);
const AllType: React.FC<{ t: number }> = ({ t }) => <><AType t={t} /><BType t={t} /><CType t={t} /><DType t={t} /></>;
export const EP5 = makeFilm(ALL, AllType, END5);
