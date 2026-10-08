import React from "react";
import { AbsoluteFill } from "remotion";
import { useCam } from "./Camera";
import { COLOR } from "./layout";

/**
 * Papel #FAFAFA com a grade pontilhada do site. A grade acompanha a câmera
 * com parallax leve (0,35) — é o que dá profundidade aos movimentos — e
 * nada mais se mexe nela.
 */
export const Background: React.FC = () => {
  const cam = useCam();
  const spacing = 36 * Math.sqrt(Math.min(1, Math.max(0.4, cam.s)));
  const par = 0.35;
  const ox = (-cam.x * cam.s * par) % spacing;
  const oy = (-cam.y * cam.s * par) % spacing;
  return (
    <AbsoluteFill style={{ backgroundColor: COLOR.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${COLOR.dot} 2px, transparent 2.3px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundPosition: `${ox}px ${oy}px`,
        }}
      />
    </AbsoluteFill>
  );
};
