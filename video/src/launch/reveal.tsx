import React from "react";
import { useCurrentFrame } from "remotion";
import { enter, leave } from "./motion";

/**
 * Uma linha de texto que sobe de trás de uma máscara (entrada) e sai por
 * cima dela (saída). A máscara tem folga pra acentos e descendentes.
 */
export const Mask: React.FC<{
  at: number;
  out?: number;
  dur?: number;
  inline?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ at, out, dur = 16, inline, style, children }) => {
  const f = useCurrentFrame();
  const i = enter(f, at, dur);
  const o = out === undefined ? 0 : leave(f, out, 10);
  const hidden = f < at || o >= 1;
  return (
    <span
      style={{
        display: inline ? "inline-block" : "block",
        overflow: "hidden",
        verticalAlign: "top",
        padding: "0.22em 0.08em 0.18em",
        margin: "-0.22em -0.08em -0.18em",
        visibility: hidden ? "hidden" : undefined,
        ...style,
      }}
    >
      <span style={{ display: "block", transform: `translateY(${(1 - i) * 130 - o * 130}%)` }}>{children}</span>
    </span>
  );
};
