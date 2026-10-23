// On-screen type for Episode 04 (1920×1080), in the approved Motion Graphic style: Plus Jakarta Sans 800,
// Rise (masked per-word slide), Slam (scale + blur in), Chip (pill pop), Strike (vermilion bar), all driven by absolute time t.
import React from "react";

export const HEAD = "'Plus Jakarta Sans'", BODY = "'Manrope'";
export const C = { ink: "#0B1226", navy: "#1B2A4E", amber: "#F2B84B", red: "#D9472B", cream: "#F1F4F2", cool: "#BFE6F0" };
const c01 = (x: number) => Math.max(0, Math.min(1, x));
export const expo = (x: number) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * c01(x)));
const back = (x: number) => { x = c01(x); return 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2); };
const outA = (t: number, out?: number) => (out === undefined ? 1 : 1 - c01((t - out) / 0.25));

export const Rise: React.FC<{ t: number; at: number; out?: number; text: string; size: number; x?: number; y: number; w?: number; align?: "left" | "center"; color?: string; hi?: Record<string, string> }> = ({ t, at, out, text, size, x = 110, y, w = 1100, align = "left", color = C.cream, hi = {} }) => {
  const o = outA(t, out);
  if (t < at - 0.05 || o <= 0) return null;
  return (
    <div style={{ position: "absolute", left: align === "center" ? (1920 - w) / 2 : x, width: w, top: y, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26,
      fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1.04, letterSpacing: "-0.03em", color, opacity: o, textShadow: "0 10px 40px rgba(0,0,0,0.55)" }}>
      {text.split(" ").map((wd, i) => {
        const p = expo((t - at - i * 0.06) / 0.45);
        return (
          <span key={i} style={{ display: "inline-block", overflow: "hidden", paddingBottom: size * 0.14, marginBottom: -size * 0.14 }}>
            <span style={{ display: "inline-block", transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 5}deg)`, color: hi[wd] ?? color }}>{wd}</span>
          </span>
        );
      })}
    </div>
  );
};

export const Slam: React.FC<{ t: number; at: number; out?: number; text: string; size: number; x?: number; y: number; color?: string; glow?: string; align?: "left" | "center" | "right"; tracking?: string }> = ({ t, at, out, text, size, x, y, color = C.cream, glow, align = "center", tracking = "-0.04em" }) => {
  if (t < at) return null;
  const p = c01((t - at) / 0.22), o = outA(t, out);
  if (o <= 0) return null;
  const s = 2.4 - 1.4 * expo(p);
  return (
    <div style={{ position: "absolute", left: x ?? 0, right: x === undefined ? 0 : undefined, top: y, textAlign: align, fontFamily: HEAD, fontWeight: 800, fontSize: size, lineHeight: 1, letterSpacing: tracking, color,
      transform: `scale(${s})`, transformOrigin: align === "center" ? "50% 50%" : align === "right" ? "100% 50%" : "0% 50%", filter: `blur(${(1 - p) * 16}px)`, opacity: Math.min(1, p * 2) * o,
      textShadow: glow ? `0 0 40px ${glow}, 0 0 90px ${glow}88` : "0 14px 50px rgba(0,0,0,0.6)" }}>{text}</div>
  );
};

export const Chip: React.FC<{ t: number; at: number; out?: number; text: string; x?: number; y: number; bg?: string; color?: string; size?: number }> = ({ t, at, out, text, x = 110, y, bg = C.amber, color = C.ink, size = 30 }) => {
  const p = t < at ? 0 : back((t - at) / 0.32) * outA(t, out);
  if (p <= 0.01) return null;
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `scale(${p})`, transformOrigin: "0% 50%", padding: `${size * 0.32}px ${size * 0.8}px`, borderRadius: 999, background: bg, color,
      fontFamily: HEAD, fontWeight: 800, fontSize: size, letterSpacing: "0.14em", boxShadow: `0 14px 40px ${bg}55` }}>{text}</div>
  );
};

/** A phrase that gets a glowing vermilion strike drawn across it at `strikeAt`. */
export const Strike: React.FC<{ t: number; at: number; strikeAt: number; out?: number; text: string; size: number; x?: number; y: number }> = ({ t, at, strikeAt, out, text, size, x = 110, y }) => {
  const o = outA(t, out);
  if (t < at || o <= 0) return null;
  const p = expo((t - at) / 0.4), s = expo((t - strikeAt) / 0.45);
  return (
    <div style={{ position: "absolute", left: x, top: y, opacity: o * Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 30}px)` }}>
      <div style={{ position: "relative", display: "inline-block", fontFamily: HEAD, fontWeight: 800, fontSize: size, letterSpacing: "-0.03em", color: t > strikeAt ? "rgba(241,244,242,0.55)" : C.cream, textShadow: "0 10px 40px rgba(0,0,0,0.55)" }}>
        {text}
        {t > strikeAt && <div style={{ position: "absolute", left: -10, top: "52%", height: size * 0.11, width: `calc(${s * 100}% + 20px)`, background: C.red, borderRadius: 6, boxShadow: `0 0 24px ${C.red}` }} />}
      </div>
    </div>
  );
};

/** Full-frame flash (white or coloured), peak at `at`. */
export const Flash: React.FC<{ t: number; at: number; color?: string; max?: number; len?: number }> = ({ t, at, color = "#FFFFFF", max = 0.85, len = 0.3 }) => {
  if (t < at - 0.05 || t > at + len) return null;
  const o = t < at ? (1 - (at - t) / 0.05) * max : max * (1 - (t - at) / len);
  return <div style={{ position: "absolute", inset: 0, background: color, opacity: o, pointerEvents: "none" }} />;
};
