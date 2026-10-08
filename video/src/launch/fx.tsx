import { noise2D } from "@remotion/noise";
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { useCam } from "./Camera";
import { COLOR } from "./layout";
import { CAMERA_STILL_FROM } from "./timeline";

/**
 * Câmera na mão: ruído contínuo (@remotion/noise), ~3 px de deriva e ~0,12°
 * de rotação. Para quando o CTA assenta.
 */
export const Handheld: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const k = f >= CAMERA_STILL_FROM ? 0.25 : 1;
  const x = noise2D("hx", f / 40, 0) * 3 * k;
  const y = noise2D("hy", 0, f / 45) * 3 * k;
  const r = noise2D("hr", f / 60, 7) * 0.12 * k;
  return <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.008)` }}>{children}</AbsoluteFill>;
};

/** Grão animado (seed nova a cada frame, multiply) + vinheta leve. */
export const FilmFinish: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, mixBlendMode: "multiply", opacity: 0.09 }}>
        <filter id={`grain-${f}`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f} stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${f})`} />
      </svg>
      <AbsoluteFill style={{ background: "radial-gradient(ellipse 75% 65% at 50% 48%, transparent 55%, rgba(0,0,0,0.12) 100%)", mixBlendMode: "multiply" }} />
    </AbsoluteFill>
  );
};

/** Fundo #FAFAFA com a grade de pontos azuis do hero do site (parallax leve com a câmera). */
export const Paper: React.FC = () => {
  const cam = useCam();
  const sp = 45; // 18 px CSS × 2,5
  const ox = (-cam.x * 0.25) % sp;
  const oy = (-cam.y * 0.25) % sp;
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLOR.dot} 2.6px, transparent 3px)`,
          backgroundSize: `${sp}px ${sp}px`,
          backgroundPosition: `${ox}px ${oy}px`,
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 45%, black 30%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 45%, black 30%, transparent 85%)",
        }}
      />
    </AbsoluteFill>
  );
};
