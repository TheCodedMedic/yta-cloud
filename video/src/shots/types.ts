import React from "react";

export type Bars = "normal" | "tight" | "slow";

export type Shot = {
  id: string;
  t0: number; // seconds, from a word anchor
  t1: number;
  bars?: Bars;
  cool?: number; // cold grade amount (slow-motion beats)
  render: (t: number, u: number, frame: number) => React.ReactNode;
};

/** A one-off flash/ring event in film time. */
export type Flash = { t: number; x?: number; y?: number; strength?: number };

export const BAR_PX: Record<Bars, number> = { normal: 62, tight: 96, slow: 126 };
