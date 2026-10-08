import { noise2D } from "@remotion/noise";
import { evolvePath, getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BUTTON_RECT, COLOR, CTA_LINE_PATH, LINE_LENGTH, LINE_PATH, LINE_W, pillPath, WAYPOINTS } from "./layout";
import { ease, EASE } from "./motion";
import { CTA, LINE_PROGRESS, LOGO } from "./timeline";

/**
 * Deixa um caminho vetorial com cara de traço à mão: reamostra a cada
 * `step` px e desloca cada ponto na normal com ruído (@remotion/noise).
 */
const handify = (d: string, seed: string, step = 36, amp = 2.4) => {
  const len = getLength(d);
  const n = Math.max(2, Math.round(len / step));
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const l = (len * i) / n;
    const p = getPointAtLength(d, l);
    const t = getTangentAtLength(d, l);
    if (!p || !t) continue; // trecho degenerado: sem ponto/tangente
    const off = noise2D(seed, l / 260, 0) * amp + noise2D(seed, l / 55, 9) * amp * 0.35;
    pts.push([p.x - t.y * off, p.y + t.x * off]);
  }
  let out = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    out += ` Q ${x0.toFixed(1)} ${y0.toFixed(1)} ${((x0 + x1) / 2).toFixed(1)} ${((y0 + y1) / 2).toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return out + ` L ${last[0].toFixed(1)} ${last[1].toFixed(1)}`;
};

const MAIN = handify(LINE_PATH, "main");
const MAIN_LEN = getLength(MAIN);
const RATIO = MAIN_LEN / LINE_LENGTH; // waypoints medidos no caminho limpo
const CTA_D = handify(CTA_LINE_PATH, "cta");
const BUTTON_D = handify(pillPath(BUTTON_RECT.cx, BUTTON_RECT.cy, BUTTON_RECT.w + 28, BUTTON_RECT.h + 28), "button", 24, 1.8);

/** Quanto da linha principal está desenhado neste frame (no caminho limpo). */
export const drawnLength = (frame: number) => {
  const pts = LINE_PROGRESS.map((k) => ({ f: k.f, len: WAYPOINTS[k.at] }));
  if (frame <= pts[0].f) return pts[0].len;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (frame <= b.f) {
      const t = EASE(interpolate(frame, [a.f, b.f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return a.len + (b.len - a.len) * t;
    }
  }
  return pts[pts.length - 1].len;
};

/** Enquanto a linha escreve o wordmark, a cauda é "consumida" até a âncora. */
const tailLength = (frame: number) => {
  if (frame < LOGO.drawFrom) return 0;
  return WAYPOINTS.logoAnchor - 1400 * (1 - ease(frame, LOGO.drawFrom, LOGO.impact));
};

export const CoralLine: React.FC = () => {
  const frame = useCurrentFrame();
  const head = drawnLength(frame) * RATIO;
  const tail = tailLength(frame) * RATIO;
  const cta = ease(frame, CTA.lineFrom, CTA.pillFrom);
  const pill = ease(frame, CTA.pillFrom, CTA.closed);
  const ctaEvo = evolvePath(cta, CTA_D);
  const pillEvo = evolvePath(pill, BUTTON_D);
  const common = { fill: "none", stroke: COLOR.coral, strokeWidth: LINE_W, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {head - tail > 0.5 && <path d={MAIN} {...common} strokeDasharray={`0 ${tail} ${head - tail} ${MAIN_LEN + 10}`} />}
      {cta > 0 && <path d={CTA_D} {...common} strokeDasharray={ctaEvo.strokeDasharray} strokeDashoffset={ctaEvo.strokeDashoffset} />}
      {pill > 0 && <path d={BUTTON_D} {...common} strokeDasharray={pillEvo.strokeDasharray} strokeDashoffset={pillEvo.strokeDashoffset} />}
    </svg>
  );
};
