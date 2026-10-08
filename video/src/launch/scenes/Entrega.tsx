import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { ENTREGA, SCENES } from "../../timeline";
import { slam, slamOrigin } from "../anim";
import { Line, METRICS } from "../text";
import { COLOR, MARGIN, SANS } from "../tokens";

const SIZE = 236; // 250 estourava a margem (918 px); 236 cabe com o slam e a deriva de zoom
const TOPS = [640, 870];

/** Smash cut pro coral: "É / entrega." com slam e deriva lenta de zoom. */
export const Entrega: React.FC = () => {
  const f = useCurrentFrame();
  const w = (METRICS["entrega.entrega"].width * SIZE) / 250;
  const drift = interpolate(f, [SCENES.entrega.from, SCENES.entrega.to], [1, 1.04]);
  // deriva ancorada na margem esquerda: o texto só cresce pra direita (cabe até 996)
  const cx = MARGIN;
  const cy = (TOPS[0] + TOPS[1] + SIZE) / 2;
  const widths = [(METRICS["entrega.e"].width * SIZE) / 250, w];
  const word = (text: string, at: number, i: number) => (
    <Line
      top={TOPS[i]}
      font={SANS}
      size={SIZE}
      weight={800}
      tracking={-0.045}
      color={COLOR.white}
      style={{ opacity: f < at ? 0 : 1, transform: `scale(${slam(f, at)})`, transformOrigin: slamOrigin(widths[i]) }}
    >
      {text}
    </Line>
  );
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${drift})`, transformOrigin: `${cx}px ${cy}px` }}>
      {word("É", ENTREGA.e, 0)}
      {word("entrega.", ENTREGA.entrega, 1)}
    </div>
  );
};
