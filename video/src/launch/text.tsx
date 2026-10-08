import React from "react";
import M from "./metrics.json";
import { MARGIN } from "./tokens";

export const METRICS = M as Record<string, { width: number; size: number; baseline: number; xMid: number; capTop: number }>;

/** Linha de texto (line-height 1) com o topo da caixa em `top`, alinhada à margem. */
export const Line: React.FC<{
  top: number;
  left?: number;
  font: string;
  size: number;
  weight?: number;
  italic?: boolean;
  tracking?: number; // em
  color: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ top, left = MARGIN, font, size, weight = 400, italic, tracking = 0, color, style, children }) => (
  <div
    style={{
      position: "absolute",
      left,
      top,
      fontFamily: font,
      fontSize: size,
      fontWeight: weight,
      fontStyle: italic ? "italic" : "normal",
      letterSpacing: `${tracking}em`,
      lineHeight: 1,
      color,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Rótulo mono pequeno, caixa alta, espaçado. */
export const Label: React.FC<{ top?: number; color: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  top = 250,
  color,
  children,
  style,
}) => (
  <Line top={top} font="JetBrains Mono" size={30} weight={500} tracking={0.14} color={color} style={style}>
    {children}
  </Line>
);
