import React from "react";
import { random } from "remotion";
import { C, FONT_TITLE, FONT_UI, W } from "../theme";
import { clamp01, easeOut } from "./Fx";

const popK = (t: number, dur = 0.3) => {
  const u = clamp01(t / dur);
  return u === 0 ? 0 : easeOut(u, 3) * (1 + Math.sin(u * Math.PI) * 0.12);
};

/** Speech bubble: cream rounded box with a tail. `crawl` 0..1 reveals the text slowly (loading-screen gag). */
export const Bubble: React.FC<{
  x: number; y: number; t: number; text: string; tail?: "down" | "left" | "right" | "none"; size?: number;
  crawl?: number; color?: string; ink?: string; maxW?: number; fade?: number;
}> = ({ x, y, t, text, tail = "down", size = 40, crawl, color = C.cream, ink = C.outline, maxW = 560, fade = 1 }) => {
  if (t < 0) return null;
  const k = popK(t);
  const shown = crawl === undefined ? text : text.slice(0, Math.round(text.length * clamp01(crawl)));
  const tails = {
    down: { left: "50%", bottom: -16, transform: "translateX(-50%)", borderWidth: "18px 14px 0 14px", borderColor: `${color} transparent transparent transparent` },
    left: { left: -18, top: "55%", transform: "translateY(-50%)", borderWidth: "12px 20px 12px 0", borderColor: `transparent ${color} transparent transparent` },
    right: { right: -18, top: "55%", transform: "translateY(-50%)", borderWidth: "12px 0 12px 20px", borderColor: `transparent transparent transparent ${color}` },
    none: { display: "none" },
  } as const;
  return (
    <div style={{
      position: "absolute", left: x, top: y, transform: `translate(-50%,-100%) scale(${k})`, transformOrigin: tail === "down" ? "50% 100%" : "50% 50%",
      opacity: k * fade, maxWidth: maxW, padding: `${size * 0.4}px ${size * 0.7}px`, background: color, borderRadius: size * 0.7,
      fontFamily: FONT_UI, fontWeight: 800, fontSize: size, color: ink, letterSpacing: 2, lineHeight: 1.15, textAlign: "center",
      boxShadow: "0 8px 24px rgba(10,5,15,0.35)",
    }}>
      {shown}
      {crawl !== undefined && crawl < 1 && <span style={{ opacity: Math.round(t * 3) % 2 ? 1 : 0 }}>|</span>}
      <div style={{ position: "absolute", width: 0, height: 0, borderStyle: "solid", ...tails[tail] }} />
    </div>
  );
};

/** Thoughts that pile up: each line appears at its time, older lines shift up. */
export const ThoughtStack: React.FC<{ x: number; y: number; t: number; lines: { text: string; at: number; color?: string; ink?: string }[]; size?: number; align?: "left" | "center" }> = ({
  x, y, t, lines, size = 34, align = "left",
}) => {
  const vis = lines.filter((l) => t >= l.at);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: align === "center" ? "translateX(-50%)" : undefined, display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", gap: 10 }}>
      {vis.map((l, i) => {
        const k = popK(t - l.at, 0.25);
        return (
          <div key={i} style={{
            transform: `scale(${k}) translateX(${(i % 2) * 18}px)`, transformOrigin: "0 100%", opacity: Math.min(1, k) * (i === vis.length - 1 ? 1 : 0.85),
            padding: `${size * 0.28}px ${size * 0.6}px`, background: l.color ?? C.cream, borderRadius: 999, fontFamily: FONT_UI, fontWeight: 800, fontSize: size,
            color: l.ink ?? C.outline, letterSpacing: 2, whiteSpace: "nowrap", boxShadow: "0 6px 18px rgba(10,5,15,0.3)",
          }}>{l.text}</div>
        );
      })}
    </div>
  );
};

const Dial: React.FC<{ t: number; label: string; value: string; frac: number; color: string; s: number }> = ({ t, label, value, frac, color, s }) => (
  <div style={{ textAlign: "center", transform: `scale(${s})` }}>
    <svg width={120} height={126} viewBox="-60 -66 120 126">
      <rect x={-8} y={-64} width={16} height={10} rx={3} fill={color} />
      <circle r={48} fill="rgba(14,8,20,0.6)" stroke={color} strokeWidth={4} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} y1={-40} x2={0} y2={-33} stroke={color} strokeWidth={3} transform={`rotate(${i * 30})`} />)}
      <line x1={0} y1={0} x2={0} y2={-36} stroke={color} strokeWidth={4} strokeLinecap="round" transform={`rotate(${frac * 360})`} />
      <circle r={5} fill={color} />
    </svg>
    <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 30, color: C.cream, letterSpacing: 3, marginTop: -4 }}>{label}</div>
    <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, color, letterSpacing: 2, textShadow: `0 0 16px ${color}66` }}>{value}</div>
  </div>
);

/** Two stopwatch dials side by side (e.g. BRAIN vs ARMS, BALL vs BODY). */
export const TwinDials: React.FC<{ x: number; y: number; t: number; a: { label: string; value: string; frac: number; color?: string }; b: { label: string; value: string; frac: number; color?: string }; s?: number }> = ({
  x, y, t, a, b, s = 1,
}) => {
  if (t < 0) return null;
  const k = popK(t);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) scale(${k})`, opacity: k, display: "flex", gap: 40 * s }}>
      <Dial t={t} {...a} color={a.color ?? C.gold} s={s} />
      <Dial t={t} {...b} color={b.color ?? "#9aa3b8"} s={s} />
    </div>
  );
};

/** Bottom-centre caption that is the punchline ("A FLY = A SLOW BALLOON"). */
export const Caption: React.FC<{ t: number; text: string; y?: number; color?: string; size?: number; hold?: number }> = ({
  t, text, y = 900, color = C.cream, size = 54, hold,
}) => {
  if (t < 0) return null;
  const k = popK(t, 0.22);
  const fade = hold !== undefined ? clamp01((hold - t) / 0.25) : 1;
  return (
    <div style={{
      position: "absolute", left: "50%", top: y, transform: `translate(-50%,-50%) scale(${k})`, opacity: k * fade, whiteSpace: "nowrap",
      fontFamily: FONT_TITLE, fontWeight: 900, fontSize: size, color, letterSpacing: 4,
      textShadow: `0 4px 0 ${C.outline}, 0 0 24px rgba(0,0,0,0.6), 0 0 36px rgba(255,190,110,0.25)`,
    }}>{text}</div>
  );
};

/** Big number with a label; `value` can animate. */
export const Counter: React.FC<{ x: number; y: number; t: number; value: string; label: string; color?: string; size?: number }> = ({
  x, y, t, value, label, color = C.gold, size = 170,
}) => {
  if (t < 0) return null;
  const k = popK(t);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, opacity: k, textAlign: "center" }}>
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: size, color, lineHeight: 1, letterSpacing: 2, textShadow: `0 6px 0 ${C.outline}, 0 0 40px ${color}55` }}>{value}</div>
      <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: size * 0.28, color: C.cream, letterSpacing: 8, marginTop: 10 }}>{label}</div>
    </div>
  );
};

/** Notification / comment cards that tumble in one after another. */
export const Cards: React.FC<{ t: number; items: { user: string; text: string; at: number }[]; seed?: string; accent?: string }> = ({ t, items, seed = "c", accent = C.amber }) => (
  <>
    {items.map((it, i) => {
      if (t < it.at) return null;
      const k = popK(t - it.at, 0.28);
      const x = 300 + random(`${seed}x${i}`) * (W - 900);
      const y = 180 + random(`${seed}y${i}`) * 560;
      const rot = (random(`${seed}r${i}`) - 0.5) * 14;
      return (
        <div key={i} style={{
          position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) scale(${k})`, opacity: k, width: 440, padding: "14px 20px",
          background: "#f7f3ec", borderRadius: 14, boxShadow: "0 10px 30px rgba(10,5,15,0.45)", fontFamily: FONT_UI, color: "#2a2230",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 22, fontWeight: 700, color: "#6b6275" }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: accent }} />{it.user}
          </div>
          <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: 1, marginTop: 6 }}>{it.text}</div>
        </div>
      );
    })}
  </>
);

/** Thin progress bar (loading screen). */
export const LoadingBar: React.FC<{ x: number; y: number; w: number; frac: number; label?: string }> = ({ x, y, w, frac, label }) => (
  <div style={{ position: "absolute", left: x - w / 2, top: y, width: w }}>
    <div style={{ height: 14, borderRadius: 7, background: "rgba(246,234,214,0.25)", overflow: "hidden" }}>
      <div style={{ width: `${clamp01(frac) * 100}%`, height: "100%", background: C.gold }} />
    </div>
    {label && <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 28, color: C.cream, letterSpacing: 6, textAlign: "center", marginTop: 10 }}>{label}</div>}
  </div>
);

/** End card: question, comment chip and subscribe chip. */
export const EndCard: React.FC<{ t: number; question: string; tComment: number; tSub: number }> = ({ t, question, tComment, tSub }) => {
  const k = popK(t, 0.4);
  const kc = popK(t - tComment);
  const ks = popK(t - tSub);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 40 }}>
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 70, color: C.cream, textAlign: "center", maxWidth: 1400, lineHeight: 1.15, letterSpacing: 2, transform: `scale(${k})`, opacity: k, textShadow: `0 5px 0 ${C.outline}` }}>{question}</div>
      <div style={{ display: "flex", gap: 40 }}>
        <div style={{ transform: `scale(${kc})`, opacity: kc, padding: "16px 40px", borderRadius: 999, border: `3px solid ${C.cream}`, fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, color: C.cream, letterSpacing: 4 }}>💬 TELL US IN THE COMMENTS</div>
        <div style={{ transform: `scale(${ks})`, opacity: ks, padding: "16px 40px", borderRadius: 999, background: "#e0262d", fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, color: "white", letterSpacing: 4, boxShadow: "0 0 30px rgba(224,38,45,0.5)" }}>🔔 SUBSCRIBE</div>
      </div>
    </div>
  );
};
