import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { LOGO_L, SCREEN_FOCUS, toWorld, WORDMARK } from "./layout";
import { ease, pop } from "./motion";
import { LOGO } from "./timeline";
import { WordmarkSVG } from "./Wordmark";

/**
 * A linha chega e escreve o wordmark grande (~78% da largura); no impacto
 * ele ganha cor e, em seguida, encolhe e sobe pro topo do CTA — é o mesmo
 * elemento do começo ao fim.
 */
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < LOGO.drawFrom - 1) return null;
  const draw = ease(frame, LOGO.move + 8, LOGO.impact);
  const fill = ease(frame, LOGO.impact - 2, LOGO.impact + 4);
  const punch = pop(frame, LOGO.impact, 12);
  const m = ease(frame, LOGO.shrinkFrom, LOGO.shrinkTo);
  const top = toWorld(SCREEN_FOCUS.x, WORDMARK.ctaSy);
  const y = interpolate(m, [0, 1], [toWorld(SCREEN_FOCUS.x, WORDMARK.revealSy).y, top.y]);
  const size = interpolate(m, [0, 1], [WORDMARK.revealSize, WORDMARK.ctaSize]) * (frame >= LOGO.impact ? 1.08 - 0.08 * punch : 1);
  return (
    <svg width={7800} height={4600} viewBox="0 0 7800 4600" style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}>
      <WordmarkSVG x={LOGO_L.x} y={y} size={size} draw={draw} fill={fill} />
    </svg>
  );
};
