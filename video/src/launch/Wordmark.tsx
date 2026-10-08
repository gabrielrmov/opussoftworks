import React from "react";
import { SANS } from "./font";
import { COLOR } from "./layout";

/**
 * O wordmark do site: "Opus" coral em negrito + "SoftWorks" em preto. Em
 * SVG pra a linha coral poder desenhar o contorno das letras.
 * `draw` (0→1) desenha o traço; `fill` (0→1) preenche.
 */
export const WordmarkSVG: React.FC<{ x: number; y: number; size: number; draw: number; fill: number }> = ({ x, y, size, draw, fill }) => {
  const dash = size * 6; // maior que o contorno de qualquer letra
  // Métrica da Inter Tight: o centro visual fica ~0,085em abaixo do centro da caixa.
  const baseline = y + size * 0.367 - size * 0.085;
  const stroke = {
    stroke: COLOR.coral,
    strokeWidth: size * 0.035,
    strokeDasharray: `${dash} ${dash}`,
    strokeDashoffset: dash * (1 - draw),
    strokeLinejoin: "round" as const,
  };
  return (
    <text x={x} y={baseline} textAnchor="middle" fontFamily={SANS} fontSize={size} letterSpacing={`${-0.03 * size}px`} style={{ paintOrder: "stroke" }}>
      <tspan fontWeight={800} fill={COLOR.coral} fillOpacity={fill} {...stroke}>
        Opus
      </tspan>
      <tspan fontWeight={500} fill={COLOR.ink} fillOpacity={fill} {...stroke} strokeOpacity={1 - fill}>
        SoftWorks
      </tspan>
    </text>
  );
};
