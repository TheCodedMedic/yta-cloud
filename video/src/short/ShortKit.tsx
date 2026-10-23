// "7 Days Offline" (What If in Theory): the vertical Short's own kit. The landscape kit (rig, camera, sets, effects)
// draws each shot in its 1920x1080 world; <Vertical> scales that world to fill a 1080x1920 frame and keeps the centre
// band (world x 656..1264 at zoom 1). Captions, the day counter and the end text are drawn in the vertical frame.
import React from "react";
import { AbsoluteFill, continueRender, delayRender, staticFile } from "remotion";
import { clamp01, easeOut, sstep } from "../kit/Fx";
import words from "./words.json";
import chunks from "./timeline_chunks.json";

export const VW = 1080, VH = 1920, K = VH / 1080;
export const FONT_CAP = "Cutie Molly";
if (typeof document !== "undefined") {
  const h = delayRender("cutie");
  new FontFace(FONT_CAP, `url(${staticFile("fonts/CutieMolly.ttf")})`).load().then((f) => { document.fonts.add(f); continueRender(h); }).catch(() => continueRender(h));
}

// ---- word anchors (beats are 0-based here, like episodes/offline_short)
type Word = { para: number; word: string; start: number; end: number };
const WD = words as Word[];
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9']/g, "");
export const at = (p: number, w: string, nth = 1, off = 0) => {
  const hit = WD.filter((x) => x.para === p && norm(x.word) === norm(w))[nth - 1];
  if (!hit) throw new Error(`word ${w}#${nth} not in beat ${p}`);
  return hit.start + off;
};
export const PS = (p: number) => (chunks as any)[p].start as number;
export const PE = (p: number) => (chunks as any)[p].end as number;
export const P = (p: number) => PS(p) - 0.12;
export const END = PE(chunks.length - 1) + (chunks as any)[chunks.length - 1].gap_after;
export const seg = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/** The landscape world, scaled to fill the vertical frame (centre band). */
export const Vertical: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ overflow: "hidden" }}>
    <div style={{ position: "absolute", left: -(1920 * K - VW) / 2, top: 0, width: 1920, height: 1080, transform: `scale(${K})`, transformOrigin: "0 0" }}>
      {children}
    </div>
  </AbsoluteFill>
);

// ---- captions: 1-3 words, Cutie Molly, cream with the spoken word in amber, thick dark outline, at ~70% height
type Group = { words: Word[]; t0: number; t1: number };
const groups: Group[] = (() => {
  const gs: Group[] = []; let cur: Word[] = [];
  WD.forEach((w, i) => {
    cur.push(w);
    const nx = WD[i + 1];
    const brk = /[.,!?:;]$/.test(w.word) || cur.length >= 3 || !nx || nx.start - w.end > 0.3 || nx.para !== w.para;
    if (brk) { gs.push({ words: cur, t0: cur[0].start, t1: 0 }); cur = []; }
  });
  gs.forEach((g, i) => { g.t1 = Math.min(i + 1 < gs.length ? gs[i + 1].t0 : g.words[g.words.length - 1].end + 0.6, g.words[g.words.length - 1].end + 0.5); });
  return gs;
})();

export const Captions: React.FC<{ t: number; y?: number }> = ({ t, y = 1340 }) => {
  const g = groups.find((x) => t >= x.t0 - 0.02 && t < x.t1);
  if (!g) return null;
  const k = 0.86 + 0.14 * easeOut((t - g.t0) / 0.14, 3);
  const text = g.words.map((w) => w.word.replace(/[.,!?:;]+$/, "").toUpperCase());
  const size = Math.min(92, 1700 / Math.max(6, text.join(" ").length));
  return (
    <div style={{ position: "absolute", left: 0, width: VW, top: y, transform: `translateY(-50%) scale(${k})`, textAlign: "center", whiteSpace: "nowrap" }}>
      {text.map((s, i) => {
        const w = g.words[i]; const on = t >= w.start - 0.03 && t < w.end + 0.05;
        return (
          <span key={i} style={{ fontFamily: FONT_CAP, fontSize: size, color: on ? "#f2b84b" : "#f6ead6", margin: "0 14px",
            WebkitTextStroke: "10px #0b1226", paintOrder: "stroke fill", letterSpacing: 2 }}>{s}</span>
        );
      })}
    </div>
  );
};

/** Big text in the vertical frame (one at a time): pops in, fades out. */
export const BigText: React.FC<{ t: number; t0: number; t1: number; text: string; y?: number; color?: string; size?: number }> = ({ t, t0, t1, text, y = 330, color = "#f6ead6", size = 120 }) => {
  if (t < t0 || t > t1) return null;
  const u = t - t0; const k = 0.7 + 0.3 * easeOut(u / 0.22, 3) + 0.06 * Math.sin(Math.min(1, u / 0.3) * Math.PI);
  const a = clamp01(u / 0.12) * clamp01((t1 - t) / 0.2);
  return (
    <div style={{ position: "absolute", left: 0, width: VW, top: y, transform: `translateY(-50%) scale(${k})`, textAlign: "center", opacity: a,
      fontFamily: FONT_CAP, fontSize: size, color, WebkitTextStroke: "12px #0b1226", paintOrder: "stroke fill", whiteSpace: "nowrap" }}>{text}</div>
  );
};

// ---- props drawn in the landscape world (SVG groups)
export const PhoneBig: React.FC<{ x: number; y: number; s?: number; rot?: number; state: "feed" | "spin" | "nocon" | "map" | "mapgone" | "mum" | "dark"; t: number; gone?: number }> = ({ x, y, s = 1, rot = 0, state, t, gone = 0 }) => {
  const W_ = 230, H_ = 460;
  const scr = () => {
    if (state === "dark") return <rect x={-W_ / 2 + 12} y={-H_ / 2 + 14} width={W_ - 24} height={H_ - 28} rx={22} fill="#05060c" />;
    if (state === "feed") return (<g>{[0, 1, 2, 3].map((i) => (
      <g key={i}><rect x={-95} y={-190 + i * 98 - ((t * 60) % 98)} width={190} height={84} rx={12} fill={["#3d6fb6", "#c56aa8", "#f2b84b", "#5a8f7a"][i]} opacity={0.9} /></g>))}</g>);
    if (state === "spin") return <g transform={`rotate(${t * 360})`}>{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={Math.cos(i * 0.785) * 40} cy={Math.sin(i * 0.785) * 40} r={9} fill="#f6ead6" opacity={0.15 + i * 0.1} />)}</g>;
    if (state === "nocon") return (<g>
      <rect x={-W_ / 2 + 12} y={-H_ / 2 + 14} width={W_ - 24} height={H_ - 28} rx={22} fill="#2a0d10" />
      {[30, 55, 80].map((r) => <path key={r} d={`M${-r * 0.8},${-10 - r * 0.25} A${r},${r} 0 0 1 ${r * 0.8},${-10 - r * 0.25}`} stroke="#f6ead6" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.5} />)}
      <line x1={-70} y1={40} x2={70} y2={-100} stroke="#d9472b" strokeWidth={14} strokeLinecap="round" />
      <text x={0} y={120} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#ff6b55">NO CONNECTION</text>
    </g>);
    if (state === "map" || state === "mapgone") {
      const tiles = [] as React.ReactNode[];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 8; j++) {
        const g = clamp01(gone * 1.6 - ((i * 7 + j * 3) % 10) / 16);
        tiles.push(<rect key={`${i}-${j}`} x={-W_ / 2 + 12 + i * 51.5} y={-H_ / 2 + 14 + j * 54} width={52} height={55} fill={g > 0.5 ? "#3a3f52" : "#d9cdb0"} />);
        if (g <= 0.5) tiles.push(<line key={`l${i}-${j}`} x1={-W_ / 2 + 12 + i * 51.5} y1={-H_ / 2 + 40 + j * 54} x2={-W_ / 2 + 64 + i * 51.5} y2={-H_ / 2 + 40 + j * 54} stroke="#fff8e8" strokeWidth={6} />);
      }
      const pul = (t * 0.9) % 1;
      return (<g>{tiles}<circle r={22 + 50 * pul} fill="none" stroke="#3d8bff" strokeWidth={5} opacity={1 - pul} /><circle r={18} fill="#3d8bff" stroke="#f6ead6" strokeWidth={6} /></g>);
    }
    return (<g>
      <circle cx={0} cy={-90} r={48} fill="#b5654f" /><text x={0} y={-74} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={48} fill="#f6ead6">M</text>
      <text x={0} y={10} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={40} fill="#f6ead6">Mum</text>
      <text x={0} y={70} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={34} fill="#8a93b0">??? ??? ????</text>
    </g>);
  };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-W_ / 2 - 6} y={-H_ / 2 - 6} width={W_ + 12} height={H_ + 12} rx={40} fill="#f0c094" opacity={0.6} />
      <rect x={-W_ / 2} y={-H_ / 2} width={W_} height={H_} rx={36} fill="#0d0e16" />
      <rect x={-W_ / 2 + 12} y={-H_ / 2 + 14} width={W_ - 24} height={H_ - 28} rx={22} fill="#18264d" />
      {scr()}
    </g>
  );
};

export const CardReader: React.FC<{ x: number; y: number; s?: number; declined: number }> = ({ x, y, s = 1, declined }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-110} y={-160} width={220} height={320} rx={30} fill="#23212c" />
    <rect x={-86} y={-134} width={172} height={110} rx={10} fill={declined > 0.5 ? "#3a0e10" : "#1c3a2c"} />
    <text x={0} y={-68} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={declined > 0.5 ? "#ff5a45" : "#7fe0a8"}>{declined > 0.5 ? "DECLINED" : "TAP CARD"}</text>
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={-70 + c * 52} y={0 + r * 44} width={40} height={30} rx={6} fill="#3b3848" />))}
    {declined > 0.5 && <circle cx={0} cy={-79} r={95 + 30 * (declined - 0.5)} fill="#ff3b2b" opacity={0.12} />}
  </g>
);

export const Shelves: React.FC<{ x: number; y: number; w: number; full: number; seed?: number }> = ({ x, y, w, full, seed = 1 }) => {
  const items = [] as React.ReactNode[];
  const cols = ["#d9472b", "#f2b84b", "#5a8f7a", "#3d6fb6", "#c56aa8", "#e9e2d0"];
  for (let r = 0; r < 4; r++) for (let i = 0; i < Math.floor(w / 46); i++) {
    const keep = ((i * 37 + r * 11 + seed * 7) % 100) / 100 < full;
    if (keep) items.push(<rect key={`${r}-${i}`} x={x + 8 + i * 46} y={y + r * 150 - 92} width={36} height={86} rx={6} fill={cols[(i + r * 2 + seed) % 6]} />);
  }
  return (
    <g>
      <rect x={x - 12} y={y - 160} width={w + 24} height={640} fill="#2b2433" />
      {[0, 1, 2, 3].map((r) => <rect key={r} x={x - 12} y={y + r * 150 - 6} width={w + 24} height={14} fill="#4a4058" />)}
      {items}
    </g>
  );
};

export const MapSheet: React.FC<{ x: number; y: number; s?: number; open: number; route: number; t: number }> = ({ x, y, s = 1, open, route, t }) => {
  const wv = 700 * (0.18 + 0.82 * open), hv = 460;
  const d = "M-260,140 C-160,40 -120,150 -20,60 S140,-60 250,-130";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-wv / 2} y={-hv / 2} width={wv} height={hv} fill="#efe3c8" stroke="#c9b48e" strokeWidth={4} />
      {open > 0.6 && (
        <g opacity={(open - 0.6) / 0.4}>
          {[-1, 0, 1].map((k) => <line key={k} x1={k * wv / 3} y1={-hv / 2} x2={k * wv / 3} y2={hv / 2} stroke="#d5c39c" strokeWidth={3} />)}
          <path d="M-350,-60 Q-100,-120 80,-40 T350,-20" stroke="#9fb7c4" strokeWidth={22} fill="none" opacity={0.8} />
          <path d={d} stroke="#c9b48e" strokeWidth={10} fill="none" strokeDasharray="1 0" />
          <path d={d} stroke="#d9472b" strokeWidth={10} fill="none" strokeLinecap="round" pathLength={1} strokeDasharray={`${route} 1`} />
          <circle cx={250} cy={-130} r={24 + 4 * Math.sin(t * 6)} fill="#f2b84b" opacity={route > 0.95 ? 1 : 0.4} />
          <circle cx={-260} cy={140} r={14} fill="#0b1226" />
        </g>
      )}
    </g>
  );
};

export const City: React.FC<{ lit: number; t: number; dark?: number }> = ({ lit, t, dark = 0 }) => {
  const b = [] as React.ReactNode[];
  for (let i = 0; i < 14; i++) {
    const x = i * 145 - 40, h = 380 + ((i * 97) % 260), y = 1080 - h - 140;
    b.push(<rect key={`b${i}`} x={x} y={y} width={130} height={h + 140} fill={dark ? "#1b1830" : "#2e2840"} />);
    for (let r = 0; r < Math.floor(h / 60); r++) for (let c = 0; c < 3; c++) {
      const on = ((i * 13 + r * 7 + c * 5) % 100) / 100 < lit;
      b.push(<rect key={`w${i}-${r}-${c}`} x={x + 16 + c * 38} y={y + 24 + r * 60} width={24} height={32} fill={on ? "#ffd27a" : "#141225"} opacity={on ? 0.85 : 1} />);
    }
  }
  return <g>{b}</g>;
};

export const Lamppost: React.FC<{ x: number; y: number; notes: number; t: number }> = ({ x, y, notes, t }) => (
  <g>
    <rect x={x - 10} y={y - 620} width={20} height={620} fill="#1d1a26" />
    <path d={`M${x},${y - 620} q60,-30 110,0`} stroke="#1d1a26" strokeWidth={16} fill="none" />
    <circle cx={x + 110} cy={y - 600} r={20} fill="#ffd27a" />
    {Array.from({ length: Math.floor(notes) }, (_, i) => (
      <g key={i} transform={`translate(${x - 70 + ((i * 53) % 120)},${y - 520 + ((i * 71) % 300)}) rotate(${((i * 37) % 30) - 15})`}>
        <rect x={0} y={0} width={110} height={80} fill={i % 3 ? "#efe3c8" : "#f6d8c8"} />
        {[18, 36, 54].map((yy) => <line key={yy} x1={12} y1={yy} x2={96 - (i * 7) % 30} y2={yy} stroke="#2a2238" strokeWidth={4} />)}
      </g>
    ))}
  </g>
);

export const Truck: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-260} y={-230} width={360} height={190} rx={10} fill="#4a5568" />
    <path d="M100,-170 L190,-170 L240,-100 L240,-40 L100,-40 Z" fill="#5b667a" />
    <rect x={140} y={-158} width={60} height={50} fill="#1d2433" />
    <circle cx={-170} cy={-30} r={34} fill="#111" /><circle cx={170} cy={-30} r={34} fill="#111" />
    <circle cx={-170} cy={-30} r={12} fill="#666" /><circle cx={170} cy={-30} r={12} fill="#666" />
  </g>
);

export const Envelope: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-80} width={240} height={160} rx={8} fill="#f6ead6" />
    <path d="M-120,-80 L0,10 L120,-80" stroke="#c9b48e" strokeWidth={6} fill="none" />
    <circle cx={70} cy={40} r={18} fill="#d9472b" />
  </g>
);

export const Coin: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <ellipse rx={56} ry={56 * Math.max(0.15, Math.abs(Math.cos((rot * Math.PI) / 90)))} fill="#f2b84b" stroke="#b47a1a" strokeWidth={8} />
  </g>
);

export const fade = (t: number, a: number, b: number) => sstep(seg(t, a, b));
