// Episode 04 2D overlays (drawn over the 3D frame): phones (map drift, voice note, text message), the Lorenz graph,
// the branching-timelines graph, the lottery ticket. Motion Graphic style: Plus Jakarta Sans / Manrope, ink + amber + vermilion.
import React from "react";
import { BODY, C, expo, HEAD } from "./Text";

const c01 = (x: number) => Math.max(0, Math.min(1, x));
const back = (x: number) => { x = c01(x); return 1 + 2.7 * Math.pow(x - 1, 3) + 1.7 * Math.pow(x - 1, 2); };

/** A phone in perspective, centred at (x, y); children draw the screen (430 × 900). */
export const Phone2D: React.FC<{ x?: number; y?: number; s?: number; ry?: number; rx?: number; children: React.ReactNode; enter?: number; buzz?: number }> = ({ x = 960, y = 560, s = 0.9, ry = -10, rx = 6, children, enter = 1, buzz = 0 }) => {
  const e = expo(enter);
  const j = buzz > 0 ? Math.sin(buzz * 90) * 8 * buzz : 0;
  return (
    <div style={{ position: "absolute", left: x + j, top: y + (1 - e) * 600, width: 0, height: 0, perspective: 2000, opacity: Math.min(1, e * 2) }}>
      <div style={{ position: "absolute", left: -215, top: -450, width: 430, height: 900, transform: `scale(${s}) rotateX(${rx}deg) rotateY(${ry}deg)`, borderRadius: 60, background: "#0A0A0F", padding: 16, boxSizing: "border-box", border: "2px solid #2A2D38",
        boxShadow: "0 60px 120px rgba(0,0,0,0.6), 0 0 120px rgba(191,230,240,0.25)" }}>
        <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 46, overflow: "hidden", background: "#0E1430" }}>
          {children}
          <div style={{ position: "absolute", left: "50%", top: 14, width: 110, height: 30, marginLeft: -55, borderRadius: 15, background: "#000" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(130deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 35%)" }} />
        </div>
      </div>
    </div>
  );
};

/** Map app whose blue dot drifts away from the true position (GPS without relativity correction). drift 0..1. */
export const MapScreen: React.FC<{ drift: number }> = ({ drift }) => (
  <div style={{ position: "absolute", inset: 0, background: "#E9E4D8" }}>
    <svg width="100%" height="100%" viewBox="0 0 398 868">
      {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1="0" y1={60 + i * 70} x2="398" y2={40 + i * 74} stroke="#FFFFFF" strokeWidth={i % 3 ? 10 : 22} />)}
      {Array.from({ length: 6 }, (_, i) => <line key={`v${i}`} x1={30 + i * 72} y1="0" x2={50 + i * 70} y2="868" stroke="#FFFFFF" strokeWidth={i % 2 ? 10 : 20} />)}
      <rect x="230" y="520" width="120" height="90" rx="12" fill="#B8D8A8" />
      <path d="M0 700 Q 200 640 398 720 L398 868 L0 868 Z" fill="#9CC8F0" />
      <circle cx="160" cy="430" r="14" fill="none" stroke="#1B2A4E" strokeWidth="4" strokeDasharray="6 5" />
      <circle cx={160 + drift * 190} cy={430 + drift * 260} r="16" fill="#2E7DFF" stroke="#FFFFFF" strokeWidth="5" />
      <circle cx={160 + drift * 190} cy={430 + drift * 260} r={30 + 10 * Math.sin(drift * 30)} fill="#2E7DFF" opacity="0.18" />
      {drift > 0.05 && <line x1="160" y1="430" x2={160 + drift * 190} y2={430 + drift * 260} stroke="#D9472B" strokeWidth="4" strokeDasharray="10 8" />}
    </svg>
    <div style={{ position: "absolute", left: 20, right: 20, top: 60, padding: "14px 18px", borderRadius: 18, background: "#FFFFFF", fontFamily: BODY, fontWeight: 700, fontSize: 22, color: "#1B2A4E", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" }}>
      You are here… {drift > 0.3 ? <span style={{ color: C.red }}>or {Math.round(drift * 11)} km away</span> : "probably"}
    </div>
  </div>
);

/** Voice note from Jamie: waveform with a play head (progress 0..1). */
export const VoiceNoteScreen: React.FC<{ progress: number; t: number }> = ({ progress, t }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#141B3A, #0B1226)" }}>
    <div style={{ position: "absolute", top: 70, width: "100%", textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 26, color: "#fff" }}>
      <div style={{ width: 92, height: 92, borderRadius: 46, background: "#A0303C", margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, fontFamily: HEAD, fontWeight: 800 }}>J</div>
      Jamie
      <div style={{ fontSize: 18, opacity: 0.6, marginTop: 6, fontWeight: 600 }}>14 March · 19:57</div>
    </div>
    <div style={{ position: "absolute", left: 22, right: 22, top: 330, padding: "22px 22px", borderRadius: 30, background: "#2A3150", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 54, height: 54, borderRadius: 27, background: C.amber, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, fontSize: 24, fontWeight: 900 }}>{progress > 0 && progress < 1 ? "❚❚" : "▶"}</div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 3, height: 54 }}>
        {Array.from({ length: 34 }, (_, i) => {
          const h = 8 + 34 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6));
          const on = i / 34 < progress;
          return <div key={i} style={{ width: 5, height: on ? h * (0.8 + 0.2 * Math.sin(t * 20 + i)) : h, borderRadius: 3, background: on ? C.amber : "rgba(255,255,255,0.35)" }} />;
        })}
      </div>
      <div style={{ fontFamily: BODY, fontWeight: 700, fontSize: 20, color: "#fff" }}>0:{String(Math.min(11, Math.floor(progress * 11))).padStart(2, "0")}</div>
    </div>
    <div style={{ position: "absolute", left: 30, right: 30, top: 470, fontFamily: BODY, fontWeight: 600, fontSize: 20, color: "rgba(255,255,255,0.5)", textAlign: "center" }}>Last seen 12 months ago</div>
  </div>
);

/** A text message from your own number, sent "tomorrow". typed 0..1 reveals the message. */
export const TextScreen: React.FC<{ typed: number; stamp: number }> = ({ typed, stamp }) => {
  const msg = "Don't go back again. Whatever you do.";
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#141B3A, #0B1226)" }}>
      <div style={{ position: "absolute", top: 64, width: "100%", textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 24, color: "#fff" }}>
        <div style={{ width: 86, height: 86, borderRadius: 43, background: "#2E5FD0", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 38, fontFamily: HEAD, fontWeight: 800 }}>Me</div>
        Me <span style={{ opacity: 0.55, fontWeight: 600 }}>(your number)</span>
      </div>
      <div style={{ position: "absolute", top: 250, width: "100%", textAlign: "center", fontFamily: BODY, fontWeight: 700, fontSize: 18, color: stamp > 0 ? C.red : "rgba(255,255,255,0.5)", opacity: c01(stamp * 3 + 0.4) }}>
        Sent: TOMORROW, 07:41
      </div>
      <div style={{ position: "absolute", left: 22, top: 300, maxWidth: "82%", padding: "20px 24px", borderRadius: 30, background: "#2A3150", color: "#fff", fontFamily: BODY, fontWeight: 600, fontSize: 30, lineHeight: 1.25, transform: `scale(${0.7 + 0.3 * back(typed * 4)})`, transformOrigin: "left top", opacity: typed > 0 ? 1 : 0 }}>
        {msg.slice(0, Math.ceil(msg.length * Math.min(1, typed * 1.2)))}
      </div>
    </div>
  );
};

/** Lorenz 1961: two forecasts that start identical and split apart. draw 0..1. */
export const LorenzGraph: React.FC<{ draw: number; numbers: number }> = ({ draw, numbers }) => {
  const W = 1300, H = 520;
  const pts = (k: number) => Array.from({ length: 200 }, (_, i) => {
    const x = (i / 199) * W, u = i / 199;
    const div = Math.max(0, u - 0.25) ** 2 * 6;
    const y = H / 2 + Math.sin(u * 18) * 90 + Math.sin(u * 7.3) * 40 + k * div * 160 * Math.sin(u * 11 + 1);
    return `${x},${y}`;
  });
  const n = Math.floor(200 * draw);
  return (
    <div style={{ position: "absolute", left: 310, top: 330, width: W, height: H }}>
      <svg width={W} height={H} style={{ overflow: "visible" }}>
        <line x1="0" y1={H} x2={W} y2={H} stroke="rgba(241,244,242,0.4)" strokeWidth="3" />
        <polyline points={pts(0).slice(0, n).join(" ")} fill="none" stroke={C.cool} strokeWidth="7" strokeLinejoin="round" />
        <polyline points={pts(1).slice(0, n).join(" ")} fill="none" stroke={C.amber} strokeWidth="7" strokeLinejoin="round" opacity="0.9" />
      </svg>
      <div style={{ position: "absolute", left: 0, top: -120, fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: C.cool, opacity: c01(numbers * 3) }}>0.506127</div>
      <div style={{ position: "absolute", left: 420, top: -120, fontFamily: HEAD, fontWeight: 800, fontSize: 56, color: C.amber, opacity: c01(numbers * 3 - 1) }}>0.506</div>
      <div style={{ position: "absolute", right: 0, bottom: -60, fontFamily: BODY, fontWeight: 700, fontSize: 26, color: "rgba(241,244,242,0.7)" }}>simulated weather →</div>
    </div>
  );
};

/** Two ideas about changing the past: one line that refuses to split (Novikov), and a tree of timelines. a / b reveal 0..1. */
export const TimelinesGraph: React.FC<{ a: number; b: number }> = ({ a, b }) => (
  <div style={{ position: "absolute", left: 160, top: 300, width: 1600, height: 560 }}>
    <svg width="1600" height="560" style={{ overflow: "visible" }}>
      <g opacity={c01(a * 3)}>
        <line x1="0" y1="160" x2={700 * expo(a)} y2="160" stroke={C.cool} strokeWidth="10" strokeLinecap="round" />
        <path d={`M ${350} 160 q 60 -90 120 0`} fill="none" stroke={C.cool} strokeWidth="6" strokeDasharray="10 10" opacity={c01(a * 2 - 1)} />
        <text x="0" y="90" fill={C.cream} fontFamily="Plus Jakarta Sans" fontWeight="800" fontSize="40">One timeline. No contradictions.</text>
      </g>
      <g opacity={c01(b * 3)}>
        <line x1="0" y1="430" x2="420" y2="430" stroke={C.amber} strokeWidth="10" strokeLinecap="round" />
        {[-150, -75, 0, 75, 150].map((dy, i) => <line key={i} x1="420" y1="430" x2={420 + 900 * expo(b - i * 0.06)} y2={430 + dy} stroke={C.amber} strokeWidth="6" strokeLinecap="round" opacity={0.5 + 0.1 * i} />)}
        <text x="0" y="360" fill={C.cream} fontFamily="Plus Jakarta Sans" fontWeight="800" fontSize="40">Every change, a new timeline.</text>
      </g>
    </svg>
  </div>
);

/** A lottery ticket that pops in, then burns away (burn 0..1). */
export const Lottery: React.FC<{ show: number; burn: number }> = ({ show, burn }) => {
  if (show <= 0) return null;
  const p = back(show);
  return (
    <div style={{ position: "absolute", left: 960 - 330, top: 330, width: 660, height: 360, transform: `scale(${p}) rotate(-6deg)`, opacity: 1 - burn,
      borderRadius: 20, background: "linear-gradient(135deg, #F6E7C8, #F2B84B)", boxShadow: "0 40px 90px rgba(0,0,0,0.5)", filter: `blur(${burn * 10}px)`, overflow: "hidden" }}>
      <div style={{ padding: "26px 34px", fontFamily: HEAD, fontWeight: 800, fontSize: 44, color: C.ink }}>LOTTERY · SATURDAY</div>
      <div style={{ display: "flex", gap: 18, padding: "10px 34px" }}>
        {[7, 14, 22, 31, 38, 45].map((n) => <div key={n} style={{ width: 78, height: 78, borderRadius: 39, background: C.ink, color: C.cream, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: HEAD, fontWeight: 800, fontSize: 34 }}>{n}</div>)}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: `${burn * 100}%`, background: "linear-gradient(transparent, #D9472B 30%, #0B1226)" }} />
    </div>
  );
};
