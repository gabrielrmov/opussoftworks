import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SANS } from "./font";
import { COLOR, SCREEN_FOCUS, toWorld, WM_MASK_BOTTOM_SY, WORDMARK } from "./layout";
import { ease, enter, IN_OUT } from "./motion";
import { LOGO } from "./timeline";

/** O wordmark do site: "Opus" coral em negrito + "SoftWorks" em preto. */
export const Wordmark: React.FC<{ size: number }> = ({ size }) => (
  <span style={{ fontFamily: SANS, fontSize: size, lineHeight: 1, letterSpacing: "-0.03em", whiteSpace: "nowrap" }}>
    <span style={{ fontWeight: 800, color: COLOR.coral }}>Opus</span>
    <span style={{ fontWeight: 500, color: COLOR.ink }}>SoftWorks</span>
  </span>
);

/**
 * A linha assenta num patamar e vira a linha de base; o wordmark sobe de
 * trás dela (a borda da máscara é a própria linha). Depois ele viaja pro
 * topo do CTA, encolhendo, enquanto a linha recolhe.
 */
export const Logo: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < LOGO.reveal - 1) return null;
  const S = WORDMARK.revealSize;
  const center = toWorld(SCREEN_FOCUS.x, WORDMARK.revealSy);
  const maskBottom = toWorld(0, WM_MASK_BOTTOM_SY).y;
  const h = 2 * (maskBottom - center.y); // máscara simétrica em volta do centro
  const up = enter(frame, LOGO.reveal, 22);
  const m = ease(frame, LOGO.moveFrom, LOGO.moveTo, IN_OUT);
  const y = interpolate(m, [0, 1], [center.y, toWorld(0, WORDMARK.ctaSy).y]);
  const scale = interpolate(m, [0, 1], [1, WORDMARK.ctaSize / S]);
  return (
    <div
      style={{
        position: "absolute",
        left: center.x,
        top: y,
        height: h,
        transform: `translate(-50%, -50%) scale(${scale})`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <div style={{ transform: `translateY(${(1 - up) * 130}%)` }}>
        <Wordmark size={S} />
      </div>
    </div>
  );
};
