import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { HOOK } from "../../timeline";
import { rise } from "../anim";
import { Pen, strikePath } from "../pen";
import { Label, Line, METRICS } from "../text";
import { COLOR, MARGIN, SANS } from "../tokens";

const SIZE = 200;
const TOPS = [620, 820, 1020];

/** Uma palavra por beat; "sorte." apaga e leva um risco de caneta. */
export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const grey = interpolate(f, [HOOK.strike, HOOK.strike + 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const sorte = METRICS["hook.sorte"];
  const y = TOPS[2] + sorte.xMid;
  const word = (text: string, at: number, i: number, color: string = COLOR.ink) => (
    <Line top={TOPS[i]} font={SANS} size={SIZE} weight={800} tracking={-0.04} color={color} style={rise(f, at)}>
      {text}
    </Line>
  );
  return (
    <>
      <Label color={COLOR.ink}>OPUS SOFTWORKS</Label>
      {word("Resultado", HOOK.resultado, 0)}
      {word("não é", HOOK.naoE, 1)}
      {word("sorte.", HOOK.sorte, 2, grey > 0 ? mix(COLOR.ink, COLOR.grey, grey) : COLOR.ink)}
      <Pen d={strikePath(MARGIN, MARGIN + sorte.width, y, "hook")} from={HOOK.strike} to={HOOK.strike + 8} width={14} />
    </>
  );
};

/** Mistura duas cores hex. */
export const mix = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * t)).join(",")})`;
};
