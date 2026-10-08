import { getLength } from "@remotion/paths";
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { useCam } from "./Camera";
import { BUTTON_HALVES, COLOR, LINE_LENGTH, LINE_PATH, LINE_W, WAYPOINTS } from "./layout";
import { ease, IN_OUT } from "./motion";
import { CTA, LINE_PROGRESS, LOGO } from "./timeline";

/** Quanto da linha principal está desenhado neste frame. */
export const drawnLength = (frame: number) => {
  const pts = LINE_PROGRESS.map((k) => ({ f: k.f, len: WAYPOINTS[k.at] }));
  if (frame <= pts[0].f) return pts[0].len;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (frame <= b.f) {
      const t = IN_OUT(interpolate(frame, [a.f, b.f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      return a.len + (b.len - a.len) * t;
    }
  }
  return pts[pts.length - 1].len;
};

/** No fechamento a linha recolhe inteira (a cauda corre até a ponta) e "passa" pro botão. */
const tailLength = (frame: number) => {
  if (frame < LOGO.retract) return 0;
  const from = WAYPOINTS.logoEnd - 2400; // o que vem antes já está fora do quadro
  return from + (WAYPOINTS.logoEnd - from) * ease(frame, LOGO.retract, LOGO.retract + 18, IN_OUT);
};

const HALF_LEN = getLength(BUTTON_HALVES[0]);

/** Trecho visível de um caminho entre `tail` e `head` (sem ponto solto no início). */
const dash = (tail: number, head: number, total: number) => ({
  strokeDasharray: `${Math.max(0, head - tail)} ${total * 2 + 10}`,
  strokeDashoffset: -tail,
});

export const CoralLine: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCam();
  // Na visão geral a câmera abre ~4×: a espessura compensa um pouco pra a linha não sumir.
  const width = LINE_W / Math.pow(cam.s, 0.6);
  const head = drawnLength(frame);
  const tail = tailLength(frame);
  const pill = ease(frame, CTA.pillFrom, CTA.closed, IN_OUT) * HALF_LEN;
  const common = { fill: "none", stroke: COLOR.coral, strokeWidth: width, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}>
      {head - tail > 0.5 && <path d={LINE_PATH} {...common} {...dash(tail, head, LINE_LENGTH)} />}
      {pill > 0.5 && BUTTON_HALVES.map((d) => <path key={d} d={d} {...common} {...dash(0, pill, HALF_LEN)} />)}
    </svg>
  );
};
