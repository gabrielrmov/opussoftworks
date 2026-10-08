import { noise2D } from "@remotion/noise";
import { evolvePath } from "@remotion/paths";
import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR } from "./layout";
import { ease } from "./motion";

type Pt = [number, number];

/** Catmull-Rom → Bézier: um traço contínuo pelos pontos. */
const smoothPath = (pts: Pt[]) => {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += ` C ${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/** Círculo à mão: ~1,15 volta, raio irregular (noise), fecha passando do início. */
export const circlePath = (cx: number, cy: number, rx: number, ry: number, seed: string) => {
  const n = 22;
  return smoothPath(
    Array.from({ length: n + 1 }, (_, i) => {
      const t = i / n;
      const a = -2.6 + t * 1.16 * Math.PI * 2;
      const k = 1 + noise2D(seed, t * 3, 0) * 0.07 + 0.05 * t;
      return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k + (t - 0.5) * 6] as Pt;
    }),
  );
};

/** Sublinhado à mão: levemente ondulado e inclinado, com saída mais longa. */
export const underlinePath = (x0: number, x1: number, y: number, seed: string) =>
  smoothPath(
    Array.from({ length: 8 }, (_, i) => {
      const t = i / 7;
      return [x0 - 8 + (x1 - x0 + 30) * t, y + noise2D(seed, t * 2.5, 1) * 6 + t * 5] as Pt;
    }),
  );

/** Risco à mão: vai e volta. */
export const strikePath = (x0: number, x1: number, y: number, seed: string) => {
  const go: Pt[] = Array.from({ length: 9 }, (_, i) => {
    const t = i / 8;
    return [x0 + 4 + (x1 - x0 + 14) * t, y + 6 - 12 * t + noise2D(seed, t * 3, 2) * 5];
  });
  const back: Pt[] = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    return [x1 + 6 - (x1 - x0) * 0.82 * t, y - 4 + 10 * t + noise2D(seed, t * 3, 3) * 5];
  });
  return smoothPath([...go, ...back]);
};

/** Desenha um traço de caneta (evolvePath) entre `from` e `to`. */
export const Pen: React.FC<{ d: string; from: number; to: number; color?: string; width?: number }> = ({
  d,
  from,
  to,
  color = COLOR.coral,
  width = 9,
}) => {
  const f = useCurrentFrame();
  if (f < from) return null;
  const { strokeDasharray, strokeDashoffset } = evolvePath(ease(f, from, to), d);
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path d={d} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} filter="url(#hand)" />
    </svg>
  );
};

/**
 * Filtro "à mão": desloca o traço com ruído e troca a semente a cada 4
 * frames (efeito de animação desenhada quadro a quadro). Montado uma vez no canvas.
 */
export const HandFilter: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={0} height={0} style={{ position: "absolute" }}>
      <filter id="hand" x="-15%" y="-150%" width="130%" height="400%" filterUnits="objectBoundingBox">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={Math.floor(f / 4)} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={5} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
};
