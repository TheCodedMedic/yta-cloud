// Reusable backgrounds for the episode's shots.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Cam, CamKey, Stage } from "../kit/Camera";
import { Bokeh, Dust } from "../kit/Fx";
import { CafeFront, Sky, SunRays } from "../kit/Sets";
import { C, H, W } from "../theme";

/** The café front as a (possibly blurred) background behind close-ups. */
export const CafeBg: React.FC<{ t: number; u: number; a: CamKey; b?: CamKey; blur?: number; dim?: number; patrons?: React.ReactNode }> = ({
  t, u, a, b, blur = 0, dim = 0, patrons,
}) => (
  <AbsoluteFill>
    <Cam u={u} a={a} b={b} t={t} blur={blur}>
      <Sky t={t} sunY={170} />
      <CafeFront t={t} patrons={patrons} />
    </Cam>
    {blur > 0 && <Bokeh t={t} n={12} seed="cafe" opacity={0.3} area={[0, 80, W, 700]} />}
    {dim > 0 && <AbsoluteFill style={{ background: C.night, opacity: dim }} />}
  </AbsoluteFill>
);

/** Close-up tabletop: blurred café behind, the table surface across the bottom. */
export const TableTop: React.FC<{ t: number; u: number; children?: React.ReactNode; edge?: boolean }> = ({ t, u, children, edge }) => (
  <AbsoluteFill>
    <CafeBg t={t} u={u} a={[960, 640, 2.2]} b={[940, 640, 2.3]} blur={14} />
    <Stage>
      <defs>
        <linearGradient id="tt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.tableTop} />
          <stop offset="1" stopColor={C.table} />
        </linearGradient>
      </defs>
      {edge ? (
        <>
          <path d={`M-100,700 L1180,700 Q1210,700 1210,730 L1210,1200 L-100,1200 Z`} fill="url(#tt)" />
          <path d="M-100,700 L1180,700 Q1210,700 1210,730 L1210,760 L-100,760 Z" fill={C.table} />
          <rect x={-100} y={700} width={1290} height={4} fill="#9c82ad" opacity={0.6} />
        </>
      ) : (
        <>
          <ellipse cx={960} cy={1180} rx={1500} ry={420} fill="url(#tt)" />
          <ellipse cx={760} cy={820} rx={520} ry={40} fill="white" opacity={0.05} />
        </>
      )}
      {children}
    </Stage>
    <Dust t={t} n={18} seed="tt" />
  </AbsoluteFill>
);

/** Sunset hero backdrop with rotating rays. */
export const SunsetBurst: React.FC<{ t: number; sunY?: number; rays?: number }> = ({ t, sunY = 560, rays = 0.24 }) => (
  <AbsoluteFill>
    <Sky t={t} sunY={sunY} />
    <SunRays cx={960} cy={sunY} t={t} opacity={rays} />
    <svg width={W} height={H} style={{ position: "absolute" }}>
      {/* distant rooftops */}
      <path d={`M0,${sunY + 120} L220,${sunY + 120} L220,${sunY + 70} L380,${sunY + 70} L380,${sunY + 140} L640,${sunY + 140} L640,${sunY + 90} L760,${sunY + 90} L760,${sunY + 150} L1180,${sunY + 150} L1180,${sunY + 80} L1320,${sunY + 80} L1320,${sunY + 130} L1600,${sunY + 130} L1600,${sunY + 60} L1760,${sunY + 60} L1760,${sunY + 120} L1920,${sunY + 120} L1920,1080 L0,1080 Z`}
        fill={C.wallDark} opacity={0.85} />
      <rect x={0} y={sunY + 200} width={W} height={H} fill={C.night} opacity={0.9} />
    </svg>
  </AbsoluteFill>
);

/** Dark blueprint panel with a fine grid, framed inside the shot. */
export const Blueprint: React.FC<{ t: number; children?: React.ReactNode }> = ({ t, children }) => (
  <AbsoluteFill>
    <CafeBg t={t} u={0} a={[960, 600, 1.6]} blur={16} dim={0.55} />
    <svg width={W} height={H} style={{ position: "absolute" }}>
      <defs>
        <pattern id="grid" width={40} height={40} patternUnits="userSpaceOnUse">
          <path d="M40,0 L0,0 0,40" fill="none" stroke={C.blueprintLine} strokeWidth={1} opacity={0.6} />
        </pattern>
      </defs>
      <rect x={140} y={110} width={1640} height={860} rx={18} fill={C.blueprint} stroke="#3c5a78" strokeWidth={3} />
      <rect x={140} y={110} width={1640} height={860} rx={18} fill="url(#grid)" />
      <circle cx={180} cy={150} r={9} fill="#3fd17a" />
      {children}
    </svg>
  </AbsoluteFill>
);
