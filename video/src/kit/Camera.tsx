import React from "react";
import { AbsoluteFill } from "remotion";
import { H, W } from "../theme";
import { lerp, sstep } from "./Fx";

export type CamKey = [number, number, number]; // world x, world y, zoom

/** Frames a 1920x1080 "world" layer: centres (x, y) at zoom z, easing from a to b over u. */
export const Cam: React.FC<{
  u: number; a: CamKey; b?: CamKey; t?: number; shake?: number; parallax?: number; blur?: number; children: React.ReactNode;
}> = ({ u, a, b = a, t = 0, shake = 1, parallax = 1, blur = 0, children }) => {
  const e = sstep(u);
  const x = lerp(a[0], b[0], e) + Math.sin(t * 1.7) * 3 * shake + Math.sin(t * 3.1) * 1.5 * shake;
  const y = lerp(a[1], b[1], e) + Math.cos(t * 1.3) * 2.5 * shake;
  const z = 1 + (lerp(a[2], b[2], e) - 1) * parallax;
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${W / 2 - x * z}px, ${H / 2 - y * z}px) scale(${z})`,
        filter: blur ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

/** Full-frame SVG canvas in world coordinates. */
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <svg width={W} height={H} style={{ position: "absolute", overflow: "visible" }}>
    {children}
  </svg>
);
