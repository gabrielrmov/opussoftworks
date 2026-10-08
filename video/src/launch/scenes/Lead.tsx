import React from "react";
import { useCurrentFrame } from "remotion";
import { LEAD } from "../../timeline";
import { rise, slam, slamOrigin } from "../anim";
import { Label, Line, METRICS } from "../text";
import { COLOR, SANS, SERIF } from "../tokens";

/** Azul-marinho: "Lead não é / resultado." (serifada) e "Venda é." em coral com slam. */
export const Lead: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <Label color={COLOR.coral} style={rise(f, LEAD.label, 20)}>
        01 — TRÁFEGO PAGO E AQUISIÇÃO
      </Label>
      <Line top={600} font={SERIF} size={168} tracking={-0.01} color={COLOR.white} style={rise(f, LEAD.lead)}>
        Lead não é
      </Line>
      <Line top={770} font={SERIF} size={168} italic tracking={-0.01} color={COLOR.white} style={rise(f, LEAD.resultado)}>
        resultado.
      </Line>
      <Line
        top={1010}
        font={SANS}
        size={220}
        weight={800}
        tracking={-0.04}
        color={COLOR.coral}
        style={{ opacity: f < LEAD.venda ? 0 : 1, transform: `scale(${slam(f, LEAD.venda)})`, transformOrigin: slamOrigin(METRICS["lead.venda"].width) }}
      >
        Venda é.
      </Line>
    </>
  );
};
