import React from "react";
import { C, FONT_TITLE, FONT_UI } from "../theme";
import { clamp01, easeOut } from "./Fx";

const pop = (t: number, dur = 0.35) => {
  // overshoot pop-in
  const u = clamp01(t / dur);
  return u === 0 ? 0 : 1 + Math.sin(u * Math.PI) * 0.12 * (1 - u) - (1 - easeOut(u)) * 0.6;
};

/** Small stopwatch HUD with a value under it. `gold` switches to the power colour. */
export const Stopwatch: React.FC<{ x: number; y: number; t: number; value: string; gold?: boolean; popT?: number; s?: number; sweep?: number }> = ({
  x, y, t, value, gold, popT = 99, s = 1, sweep = 1,
}) => {
  const col = gold ? C.gold : C.cream;
  const k = popT < 0.4 ? 1 + Math.sin((popT / 0.4) * Math.PI) * 0.25 : 1;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,0) scale(${s * k})`, textAlign: "center" }}>
      <svg width={110} height={118} viewBox="-55 -63 110 118">
        <rect x={-8} y={-62} width={16} height={10} rx={3} fill={col} />
        <circle r={46} fill="rgba(14,8,20,0.55)" stroke={col} strokeWidth={4} />
        {Array.from({ length: 12 }, (_, i) => (
          <line key={i} x1={0} y1={-38} x2={0} y2={-31} stroke={col} strokeWidth={3} transform={`rotate(${i * 30})`} />
        ))}
        <line x1={0} y1={0} x2={0} y2={-34} stroke={gold ? C.amber : C.rim} strokeWidth={4} strokeLinecap="round" transform={`rotate(${(t * 360 * sweep) % 360})`} />
        <circle r={5} fill={col} />
      </svg>
      <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 40, color: col, letterSpacing: 2, textShadow: `0 0 18px ${gold ? "rgba(255,200,90,0.7)" : "rgba(0,0,0,0.5)"}`, marginTop: -6 }}>
        {value}
      </div>
    </div>
  );
};

/** A pill label that slides up with overshoot. */
export const Chip: React.FC<{ x: number; y: number; t: number; text: string; accent?: string; icon?: React.ReactNode; size?: number }> = ({
  x, y, t, text, accent = C.amber, icon, size = 40,
}) => {
  if (t < 0) return null;
  const u = easeOut(t / 0.3);
  return (
    <div
      style={{
        position: "absolute", left: x, top: y + (1 - u) * 30, opacity: u, transform: `translate(-50%,-50%) scale(${pop(t)})`,
        display: "flex", alignItems: "center", gap: 12, padding: `${size * 0.28}px ${size * 0.6}px`,
        background: "rgba(22,14,30,0.82)", border: `2px solid ${accent}`, borderRadius: 999,
        fontFamily: FONT_UI, fontWeight: 800, fontSize: size, color: C.cream, letterSpacing: 3, whiteSpace: "nowrap",
        boxShadow: `0 0 26px ${accent}55`,
      }}
    >
      {icon}
      {text}
    </div>
  );
};

/** Plain floating word (labels like EYES → BRAIN). */
export const Label: React.FC<{ x: number; y: number; t: number; text: string; color?: string; size?: number }> = ({
  x, y, t, text, color = C.cream, size = 44,
}) => {
  if (t < 0) return null;
  const u = easeOut(t / 0.25);
  return (
    <div style={{
      position: "absolute", left: x, top: y - (1 - u) * 18, opacity: u, transform: "translate(-50%,-50%)",
      fontFamily: FONT_UI, fontWeight: 800, fontSize: size, color, letterSpacing: 6,
      textShadow: `0 0 20px rgba(255,190,110,0.55), 0 3px 0 ${C.outline}`, whiteSpace: "nowrap",
    }}>{text}</div>
  );
};

/** The big title card text block. `t` = seconds since it starts. */
export const TitleText: React.FC<{ t: number; small: string; big: string; tag: string }> = ({ t, small, big, tag }) => {
  const s1 = easeOut(t / 0.35);
  const s2 = easeOut((t - 0.45) / 0.3);
  const shake = t > 0.45 && t < 0.75 ? Math.sin(t * 90) * 6 * (0.75 - t) / 0.3 : 0;
  const s3 = easeOut((t - 0.9) / 0.4);
  return (
    <div style={{ position: "absolute", top: 170, width: "100%", textAlign: "center" }}>
      <div style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: 54, letterSpacing: 8, color: C.cream, opacity: s1, transform: `translateY(${(1 - s1) * 20}px)`, textShadow: "0 4px 20px rgba(30,10,30,0.7)" }}>
        {small}
      </div>
      <div style={{
        fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 128, letterSpacing: 4, lineHeight: 1.08,
        background: `linear-gradient(180deg, #fff4d6 0%, ${C.gold} 45%, ${C.amber} 100%)`,
        WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent",
        filter: "drop-shadow(0 0 22px rgba(255,170,70,0.65)) drop-shadow(0 5px 0 #3a1f1a)",
        opacity: clamp01(s2 * 1.5), transform: `scale(${1.25 - 0.25 * s2}) translateX(${shake}px)`,
      }}>
        {big}
      </div>
      <div style={{ margin: "18px auto 0", width: 760 * s3, height: 2, background: `linear-gradient(90deg, transparent, ${C.cream}, transparent)` }} />
      <div style={{ fontFamily: FONT_UI, fontWeight: 700, fontSize: 30, letterSpacing: 10, color: C.cream, opacity: s3 * 0.85, marginTop: 14 }}>{tag}</div>
    </div>
  );
};

/** Stamp: big word that slams in with a slight rotation. */
export const Stamp: React.FC<{ x: number; y: number; t: number; text: string; sub?: string; color?: string }> = ({ x, y, t, text, sub, color = C.gold }) => {
  if (t < 0) return null;
  const u = clamp01(t / 0.18);
  const k = 1.8 - 0.8 * easeOut(u, 3);
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%,-50%) scale(${k}) rotate(-4deg)`, opacity: u, textAlign: "center" }}>
      <div style={{
        fontFamily: FONT_TITLE, fontWeight: 900, fontSize: 96, letterSpacing: 6, color, padding: "6px 34px",
        border: `6px solid ${color}`, borderRadius: 18, background: "rgba(20,10,24,0.55)",
        textShadow: "0 0 26px rgba(255,180,80,0.6)", boxShadow: "0 0 40px rgba(255,170,60,0.35)",
      }}>{text}</div>
      {sub && <div style={{ fontFamily: FONT_UI, fontWeight: 800, fontSize: 48, letterSpacing: 8, color: C.cream, marginTop: 18, textShadow: "0 3px 0 #1e1426, 0 0 18px rgba(0,0,0,0.6)" }}>{sub}</div>}
    </div>
  );
};
