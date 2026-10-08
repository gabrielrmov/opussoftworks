import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { LOGO_L, SCREEN_FOCUS, toWorld, WORDMARK } from "./layout";
import { ease, enter } from "./motion";
import { LOGO } from "./timeline";
import { WordmarkSVG } from "./Wordmark";

/**
 * A linha chega e escreve o wordmark grande (~78% da largura); no impacto
 * ele ganha cor com um tranco curto e sobe pro topo do CTA — é o mesmo
 * elemento do começo ao fim.
 */
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < LOGO.drawFrom - 1) return null;
  const draw = ease(frame, LOGO.move + 8, LOGO.impact);
  const fill = ease(frame, LOGO.impact - 2, LOGO.impact + 3);
  const m = ease(frame, LOGO.shrinkFrom, LOGO.shrinkTo);
  const y = interpolate(m, [0, 1], [toWorld(SCREEN_FOCUS.x, WORDMARK.revealSy).y, toWorld(SCREEN_FOCUS.x, WORDMARK.ctaSy).y]);
  const punch = frame >= LOGO.impact ? 1.06 - 0.06 * enter(frame, LOGO.impact, 6) : 1;
  const size = interpolate(m, [0, 1], [WORDMARK.revealSize, WORDMARK.ctaSize]) * punch;
  return (
    <svg width={1} height={1} style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <WordmarkSVG x={LOGO_L.x} y={y} size={size} draw={draw} fill={fill} />
    </svg>
  );
};
