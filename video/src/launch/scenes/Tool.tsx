import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { TOOL } from "../../timeline";
import { rise } from "../anim";
import { Pen, strikePath } from "../pen";
import { Line, METRICS } from "../text";
import { COLOR, MARGIN, SANS } from "../tokens";
import { mix } from "./Hook";

const LINES = ["Sua empresa", "não precisa", "de mais uma", "ferramenta."];
const SIZE = 150;
const TOPS = [560, 710, 860, 1010];

/** Uma linha por beat; "ferramenta." apaga e é riscada — callback do gancho. */
export const Tool: React.FC = () => {
  const f = useCurrentFrame();
  const grey = interpolate(f, [TOOL.strike, TOOL.strike + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const m = METRICS["tool.3"];
  return (
    <>
      {LINES.map((text, i) => (
        <Line
          key={text}
          top={TOPS[i]}
          font={SANS}
          size={SIZE}
          weight={800}
          tracking={-0.04}
          color={i === 3 && grey > 0 ? mix(COLOR.ink, COLOR.grey, grey) : COLOR.ink}
          style={rise(f, TOOL.lines[i])}
        >
          {text}
        </Line>
      ))}
      <Pen d={strikePath(MARGIN, MARGIN + m.width, TOPS[3] + m.xMid, "tool")} from={TOOL.strike} to={TOOL.strike + 8} width={13} />
    </>
  );
};
