import React from "react";
import { getLength, getPointAtLength } from "@remotion/paths";
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { useCam } from "./Camera";
import { BUTTON_RECT, CTA_LINE_PATH, LINE_LENGTH, LINE_PATH, LINE_W, pillPath, WAYPOINTS } from "./layout";
import { beatPulse, ease, EASE } from "./motion";
import { CTA, LINE_PROGRESS, LOGO, SYSTEM, SYSTEM_ZOOM } from "./timeline";

/** Quanto da linha principal está desenhado neste frame. */
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

/**
 * Enquanto a linha escreve o wordmark, a cauda que entra pela esquerda é
 * "consumida": recolhe até a âncora, pra nada sobrar perto da borda no CTA.
 */
const tailLength = (frame: number) => {
  if (frame < LOGO.move + 10) return 0;
  // Os trechos antes da âncora já estão fora do quadro; só os últimos 1400 px recolhem.
  return WAYPOINTS.logoAnchor - 1400 * (1 - ease(frame, LOGO.move + 10, LOGO.impact));
};

const CTA_LINE_LEN = getLength(CTA_LINE_PATH);
const BUTTON_D = pillPath(BUTTON_RECT.cx, BUTTON_RECT.cy, BUTTON_RECT.w, BUTTON_RECT.h);
const BUTTON_LEN = getLength(BUTTON_D);

export const CoralLine: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCam();
  const pulse = beatPulse(frame);
  // Espessura compensada pelo zoom, pra linha nunca sumir quando a câmera abre.
  const k = 1 / Math.pow(cam.s, 0.6);
  const width = LINE_W * k * (1 + 0.18 * pulse);

  const head = drawnLength(frame);
  const tail = tailLength(frame);
  const showMain = head - tail > 0.5;
  const mainHead = showMain && frame < LOGO.move + 10 ? getPointAtLength(LINE_PATH, Math.max(0.01, head)) : null;

  const ctaDraw = ease(frame, CTA.lineFrom, CTA.pillFrom);
  const pillDraw = ease(frame, CTA.pillFrom, CTA.closed);
  const ctaHead =
    ctaDraw > 0 && pillDraw === 0
      ? getPointAtLength(CTA_LINE_PATH, CTA_LINE_LEN * ctaDraw)
      : pillDraw > 0 && pillDraw < 1
        ? getPointAtLength(BUTTON_D, BUTTON_LEN * pillDraw)
        : null;

  // Dados correndo pela linha entre os pilares quando o sistema aparece.
  const dataOn = interpolate(frame, [SYSTEM_ZOOM.from + 6, SYSTEM_ZOOM.to, SYSTEM.out, SYSTEM.out + 10], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const dataFrom = WAYPOINTS.p1Start;
  const dataTo = WAYPOINTS.p3End;

  return (
    <svg
      width={7800}
      height={4600}
      viewBox="0 0 7800 4600"
      style={{ position: "absolute", left: 0, top: 0, overflow: "visible", pointerEvents: "none" }}
    >
      {showMain && (
        <path
          d={LINE_PATH}
          fill="none"
          stroke={C.orange}
          strokeWidth={width}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={`0 ${tail} ${head - tail} ${LINE_LENGTH + 10}`}
        />
      )}
      {dataOn > 0 &&
        [0, 1, 2, 3, 4].map((i) => {
          const t = ((frame - SYSTEM_ZOOM.to) / 70 + i / 5 + 10) % 1;
          const p = getPointAtLength(LINE_PATH, dataFrom + (dataTo - dataFrom) * t);
          return p ? <circle key={i} cx={p.x} cy={p.y} r={26 * k} fill={C.orange} opacity={dataOn} /> : null;
        })}
      {ctaDraw > 0 && (
        <path
          d={CTA_LINE_PATH}
          fill="none"
          stroke={C.orange}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={`${CTA_LINE_LEN * ctaDraw} ${CTA_LINE_LEN + 10}`}
        />
      )}
      {pillDraw > 0 && (
        <path
          d={BUTTON_D}
          fill="none"
          stroke={C.orange}
          strokeWidth={width}
          strokeLinecap="round"
          strokeDasharray={`${BUTTON_LEN * pillDraw} ${BUTTON_LEN + 10}`}
        />
      )}
      {[mainHead, ctaHead].map(
        (h, i) =>
          h && (
            <g key={i}>
              <circle cx={h.x} cy={h.y} r={width * (2.4 + pulse * 1.6)} fill={C.orange} opacity={0.18} />
              <circle cx={h.x} cy={h.y} r={width * 1.1} fill={C.orange} />
            </g>
          ),
      )}
    </svg>
  );
};
