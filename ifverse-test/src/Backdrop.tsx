import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "./theme";

export const Sky: React.FC<{ sunY?: number }> = ({ sunY = 330 }) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 18) * 0.03;
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${C.skyTop} 0%, ${C.skyMid} 55%, ${C.skyLow} 80%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% ${sunY}px, ${C.sun} 0px, ${C.sun} 70px, rgba(255,215,150,0.75) ${110 * pulse}px, rgba(246,179,107,0.25) ${330 * pulse}px, transparent ${620 * pulse}px)`,
        }}
      />
    </AbsoluteFill>
  );
};

export const SunRays: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => {
  const frame = useCurrentFrame();
  const rays = Array.from({ length: 28 });
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <g
        transform={`rotate(${frame * 0.08} ${cx} ${cy})`}
        opacity={0.22}
        style={{ mixBlendMode: "screen" }}
      >
        {rays.map((_, i) => {
          const a = (i / rays.length) * Math.PI * 2;
          const w = 0.035;
          const r = 1600;
          return (
            <polygon
              key={i}
              points={`${cx},${cy} ${cx + Math.cos(a - w) * r},${cy + Math.sin(a - w) * r} ${cx + Math.cos(a + w) * r},${cy + Math.sin(a + w) * r}`}
              fill={C.windowHot}
            />
          );
        })}
      </g>
    </svg>
  );
};

// Café storefront: upper storeys, striped awning, warm windows.
export const Cafe: React.FC<{ x?: number; y?: number; w?: number }> = ({
  x = 360,
  y = 160,
  w = 1200,
}) => {
  const frame = useCurrentFrame();
  const stripes = 16;
  const sw = w / stripes;
  const awningY = y + 420;
  const winY = awningY + 120;
  const flicker = (i: number) =>
    0.85 + Math.sin(frame / 7 + i * 1.7) * 0.04 + Math.sin(frame / 3.1 + i) * 0.02;
  return (
    <svg width={1920} height={1080} style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="win" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.windowHot} />
          <stop offset="1" stopColor={C.window} />
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
      </defs>
      {/* side buildings */}
      <rect x={0} y={y - 60} width={x} height={1080} fill={C.shadow} />
      <rect x={x + w} y={y - 100} width={1920 - x - w} height={1080} fill={C.shadow} />
      {[0, 1, 2].map((r) =>
        [0, 1].map((c) => (
          <rect
            key={`l${r}${c}`}
            x={60 + c * 150}
            y={y + r * 140}
            width={70}
            height={90}
            fill={r === 1 && c === 0 ? C.window : C.wall}
            opacity={0.9}
          />
        )),
      )}
      {/* main facade */}
      <rect x={x} y={y} width={w} height={1080} fill={C.wall} />
      <rect x={x} y={y} width={w} height={14} fill={C.wallLight} />
      {[0, 1].map((r) =>
        Array.from({ length: 7 }).map((_, c) => {
          const lit = (r * 7 + c) % 5 === 2;
          return (
            <g key={`u${r}${c}`}>
              <rect x={x + 70 + c * ((w - 140) / 7)} y={y + 60 + r * 170} width={90} height={120} fill={lit ? C.window : C.shadow} opacity={lit ? 0.85 : 1} />
              <rect x={x + 60 + c * ((w - 140) / 7)} y={y + 180 + r * 170} width={110} height={10} fill={C.wallLight} />
            </g>
          );
        }),
      )}
      {/* awning */}
      {Array.from({ length: stripes }).map((_, i) => (
        <path
          key={i}
          d={`M${x + i * sw},${awningY} h${sw} v60 q${-sw / 2},22 ${-sw},0 z`}
          fill={i % 2 ? C.awningCream : C.awningRed}
        />
      ))}
      <rect x={x - 10} y={awningY - 14} width={w + 20} height={16} fill={C.shadow} />
      {/* shop windows with warm glow bleeding out */}
      <rect
        x={x + 40}
        y={winY}
        width={w - 80}
        height={300}
        fill={C.window}
        filter="url(#glow)"
        opacity={0.55}
      />
      {Array.from({ length: 6 }).map((_, i) => {
        const pw = (w - 80) / 6;
        return (
          <g key={i} opacity={flicker(i)}>
            <rect x={x + 40 + i * pw + 8} y={winY} width={pw - 16} height={300} fill="url(#win)" />
            <rect x={x + 40 + i * pw + 8} y={winY + 130} width={pw - 16} height={6} fill={C.wall} />
            <rect x={x + 40 + i * pw + pw / 2 - 3} y={winY} width={6} height={300} fill={C.wall} />
          </g>
        );
      })}
      {/* hanging lamps */}
      {[0.25, 0.5, 0.75].map((p) => (
        <g key={p}>
          <line x1={x + w * p} y1={awningY + 60} x2={x + w * p} y2={winY - 20} stroke={C.ink} strokeWidth={3} />
          <circle cx={x + w * p} cy={winY - 14} r={9} fill={C.windowHot} />
          <circle cx={x + w * p} cy={winY - 14} r={40} fill={C.windowHot} opacity={0.18} />
        </g>
      ))}
      {/* pavement */}
      <rect x={0} y={winY + 300} width={1920} height={1080} fill={C.night} />
      <rect x={0} y={winY + 300} width={1920} height={8} fill={C.shadow} />
    </svg>
  );
};

// Soft vignette + film grain — a big part of the "cinematic" look.
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  const seed = frame % 8;
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 45%, rgba(15,10,25,0.55) 100%)",
        }}
      />
      <svg width={1920} height={1080} style={{ position: "absolute", opacity: 0.07 }}>
        <filter id={`grain${seed}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={seed} />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const fadeInOut = (frame: number, dur: number, f = 8) =>
  interpolate(frame, [0, f, dur - f, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
