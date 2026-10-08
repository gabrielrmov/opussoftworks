import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { SCENES, SISTEMA } from "../../timeline";
import { rise, slam, slamOrigin } from "../anim";
import { Line, METRICS } from "../text";
import { COLOR, SANS, SERIF } from "../tokens";

/** Coral: "Precisa de um / sistema que" em branco + "funcione." serifada itálica em preto. */
export const Sistema: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [SISTEMA.lines[2], SCENES.sistema.to], [1, 1.025], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, transform: `scale(${drift})`, transformOrigin: "84px 860px" }}>
      <Line top={560} font={SANS} size={130} weight={800} tracking={-0.04} color={COLOR.white} style={rise(f, SISTEMA.lines[0])}>
        Precisa de um
      </Line>
      <Line top={700} font={SANS} size={130} weight={800} tracking={-0.04} color={COLOR.white} style={rise(f, SISTEMA.lines[1])}>
        sistema que
      </Line>
      <Line
        top={850}
        font={SERIF}
        size={250}
        italic
        tracking={-0.01}
        color={COLOR.ink}
        style={{ opacity: f < SISTEMA.lines[2] ? 0 : 1, transform: `scale(${slam(f, SISTEMA.lines[2])})`, transformOrigin: slamOrigin(METRICS["system.2"].width) }}
      >
        funcione.
      </Line>
    </div>
  );
};
