import { useCurrentFrame } from "remotion";
import { C } from "./theme";

// Ifverse-style figure: solid black round head, happy-arc eyes, warm rim light,
// red hoodie. Drawn around (0,0) = centre of the head, scale ~1 = 1080p close-up.
export const HoodieKid: React.FC<{
  x: number;
  y: number;
  scale?: number;
  lookX?: number;
  smile?: number;
}> = ({ x, y, scale = 1, lookX = 0, smile = 1 }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin(frame / 14) * 4;
  // blink every ~3s, 4 frames long
  const blink = frame % 95 < 4 ? 0.15 : 1;
  const eyeY = -8;
  return (
    <g transform={`translate(${x} ${y + breathe * 0.4}) scale(${scale})`}>
      {/* torso / hoodie */}
      <path
        d={`M-150,${420 + breathe} Q-160,170 -60,120 L60,120 Q160,170 150,${420 + breathe} Z`}
        fill={C.hoodie}
        stroke={C.rim}
        strokeWidth={5}
      />
      <path d="M-150,420 Q-150,230 -90,160 L-70,420 Z" fill={C.hoodieDark} opacity={0.6} />
      {/* hood behind neck */}
      <path d="M-95,140 Q0,200 95,140 Q60,95 0,95 Q-60,95 -95,140 Z" fill={C.hoodieDark} />
      {/* drawstrings */}
      <line x1={-28} y1={160} x2={-34} y2={260} stroke={C.awningCream} strokeWidth={5} strokeLinecap="round" />
      <line x1={28} y1={160} x2={34} y2={260} stroke={C.awningCream} strokeWidth={5} strokeLinecap="round" />
      {/* head */}
      <circle cx={0} cy={0} r={118} fill={C.rim} />
      <circle cx={-4} cy={2} r={114} fill={C.ink} />
      {/* face */}
      <g transform={`translate(${lookX} 0)`} stroke="white" strokeWidth={9} strokeLinecap="round" fill="none">
        <g transform={`translate(0 ${eyeY}) scale(1 ${blink}) translate(0 ${-eyeY})`}>
          <path d={`M-58,${eyeY} q20,-${22 * smile} 40,0`} />
          <path d={`M18,${eyeY} q20,-${22 * smile} 40,0`} />
        </g>
        <path d={`M-30,40 q30,${30 * smile} 60,0`} />
      </g>
    </g>
  );
};

// Small full-body stick figure for wide shots.
export const TinyFigure: React.FC<{
  x: number;
  y: number;
  color: string;
  hat?: boolean;
  h?: number;
}> = ({ x, y, color, hat, h = 90 }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 10 + x) * 2;
  const head = h * 0.2;
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1={-8} y1={0} x2={-6} y2={-h * 0.45} stroke={C.ink} strokeWidth={h * 0.07} strokeLinecap="round" />
      <line x1={8} y1={0} x2={6} y2={-h * 0.45} stroke={C.ink} strokeWidth={h * 0.07} strokeLinecap="round" />
      <rect x={-h * 0.14} y={-h * 0.8} width={h * 0.28} height={h * 0.4} rx={h * 0.06} fill={color} />
      <circle cx={sway * 0.3} cy={-h * 0.8 - head} r={head} fill={C.ink} stroke={C.rim} strokeWidth={2} />
      {hat && (
        <path
          d={`M${-head},${-h * 0.8 - head * 1.2} a${head},${head * 0.9} 0 0 1 ${head * 2},0 h${head * 0.6} z`}
          fill="#f2c230"
        />
      )}
    </g>
  );
};
