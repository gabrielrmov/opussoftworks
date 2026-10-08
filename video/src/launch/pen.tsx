import { getLength } from "@remotion/paths";
import React from "react";
import { random, useCurrentFrame } from "remotion";
import { enter } from "./anim";
import { COLOR } from "./tokens";

type Pt = [number, number];

/** Catmull-Rom → Bézier: um traço contínuo e orgânico pelos pontos. */
const smoothPath = (pts: Pt[]) => {
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
};

/** Risco à mão: vai e volta, levemente inclinado, com jitter determinístico. */
export const strikePath = (x0: number, x1: number, y: number, seed: string) => {
  const n = 9;
  const go: Pt[] = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [x0 + 4 + (x1 - x0 + 14) * t, y + 6 - 12 * t + (random(`${seed}a${i}`) - 0.5) * 9];
  });
  const back: Pt[] = Array.from({ length: 6 }, (_, i) => {
    const t = i / 5;
    return [x1 + 6 - (x1 - x0) * 0.82 * t, y - 4 + 10 * t + (random(`${seed}b${i}`) - 0.5) * 9];
  });
  return smoothPath([...go, ...back]);
};

/** Círculo à mão: ~1,15 volta, raio irregular, fecha passando do ponto inicial. */
export const circlePath = (cx: number, cy: number, rx: number, ry: number, seed: string) => {
  const n = 22;
  const start = -2.6;
  const turns = 1.16;
  const pts: Pt[] = Array.from({ length: n + 1 }, (_, i) => {
    const t = i / n;
    const a = start + t * turns * Math.PI * 2;
    const k = 1 + (random(`${seed}${i}`) - 0.5) * 0.09 + 0.05 * t; // espirala de leve pra fora
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k + (t - 0.5) * 6];
  });
  return smoothPath(pts);
};

/** Sublinhado à mão: ondulado, com saída mais longa. */
export const underlinePath = (x0: number, x1: number, y: number, seed: string) => {
  const n = 8;
  const pts: Pt[] = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return [x0 - 10 + (x1 - x0 + 40) * t, y + Math.sin(t * Math.PI * 1.3) * 5 + (random(`${seed}${i}`) - 0.5) * 7 + t * 4];
  });
  return smoothPath(pts);
};

/** Desenha um traço de caneta (strokeDashoffset) entre `from` e `to`. */
export const Pen: React.FC<{ d: string; from: number; to: number; color?: string; width?: number }> = ({
  d,
  from,
  to,
  color = COLOR.coral,
  width = 12,
}) => {
  const frame = useCurrentFrame();
  const len = getLength(d);
  const p = enter(frame, from, to - from);
  if (frame < from) return null;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${len} ${len}`}
        strokeDashoffset={len * (1 - p)}
      />
    </svg>
  );
};
