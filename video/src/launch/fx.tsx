import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FLASH_AT } from "../timeline";
import { COLOR } from "./tokens";

/** Câmera na mão: soma de senos (~3 px de deriva, ~0,12° de rotação). */
export const Handheld: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const x = 1.8 * Math.sin(f / 23) + 0.9 * Math.sin(f / 9.7 + 1.3) + 0.4 * Math.sin(f / 4.1 + 0.4);
  const y = 1.6 * Math.sin(f / 19 + 2.1) + 0.9 * Math.sin(f / 11.3) + 0.4 * Math.sin(f / 3.7 + 1);
  const r = 0.08 * Math.sin(f / 31 + 0.7) + 0.04 * Math.sin(f / 13.1);
  return (
    <AbsoluteFill style={{ transform: `translate(${x}px, ${y}px) rotate(${r}deg) scale(1.006)` }}>{children}</AbsoluteFill>
  );
};

/** Grão animado (seed muda a cada frame) + vinheta leve. */
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
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 75% 65% at 50% 48%, transparent 55%, rgba(0,0,0,0.13) 100%)",
          mixBlendMode: "multiply",
        }}
      />
    </AbsoluteFill>
  );
};

/** Flash branco de 1–2 frames nos cortes pra coral. */
export const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = Math.max(0, ...FLASH_AT.map((at) => interpolate(f, [at - 0.01, at, at + 1, at + 2], [0, 0.9, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })));
  return o > 0 ? <AbsoluteFill style={{ backgroundColor: COLOR.white, opacity: o }} /> : null;
};

/** Grade de pontos igual à do hero do site (pontos azuis a cada 18 px CSS → 40 px aqui). */
export const DotGrid: React.FC<{ color?: string }> = ({ color = COLOR.dot }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(${color} 2.6px, transparent 3px)`,
      backgroundSize: "40px 40px",
      backgroundPosition: "20px 20px",
    }}
  />
);
