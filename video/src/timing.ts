// Every cut, pose and effect is anchored to a measured word, never a typed second.
import words from "./words.json";
import chunks from "./timeline_chunks.json";
import { FPS } from "./theme";

type Word = { para: number; word: string; start: number; end: number };
const W = words as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");

const find = (para: number, word: string, nth: number) => {
  const hits = W.filter((w) => w.para === para && norm(w.word) === norm(word));
  const hit = hits[nth - 1];
  if (!hit) throw new Error(`word "${word}"#${nth} not found in beat ${para}`);
  return hit;
};

/** Start time (s) of the nth occurrence of `word` in beat `para`. */
export const at = (para: number, word: string, nth = 1, off = 0) =>
  find(para, word, nth).start + off;
/** End time (s) of the nth occurrence of `word` in beat `para`. */
export const end = (para: number, word: string, nth = 1, off = 0) =>
  find(para, word, nth).end + off;
/** Start / end of a whole beat (from the assembled voice timeline). */
export const PS = (para: number) => chunks[para].start;
export const PE = (para: number) => chunks[para].end;
/** End of beat plus its designed silence. */
export const PG = (para: number) => chunks[para].end + chunks[para].gap_after;

export const F = (sec: number) => Math.round(sec * FPS);
