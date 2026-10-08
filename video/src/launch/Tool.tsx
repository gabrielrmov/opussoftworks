import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, METHOD_L, TOOL_L } from "./layout";
import { rise, slam, slamOrigin } from "./motion";
import { Pen, strikePath, underlinePath } from "./pen";
import { FUNCIONE, TOOL } from "./timeline";
import { fit, fitAll, sans, serif, widthOf } from "./type";

/** Frase do CTA final do site, quebrada em blocos. */
const TOOL_ROWS = ["Sua empresa", "não precisa", "de mais uma", "ferramenta."];
const FUNCIONE_ROWS = ["Precisa de um", "sistema que"];
const ROW = sans(700);
const FUNC = serif();

const Line: React.FC<{ y: number; size: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ y, size, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: TOOL_L.textX,
      top: y,
      transform: "translateY(-50%)",
      ...ROW,
      fontSize: size,
      lineHeight: 1,
      color: COLOR.ink,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * "Sua empresa não precisa de mais uma ferramenta." — a caneta risca
 * "ferramenta."; e, um bloco abaixo, "Precisa de um sistema que funcione.",
 * com "funcione." em serif coral, slam e sublinhado.
 */
export const Tool: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < TOOL.move - 15 || frame > FUNCIONE.underline + 70) return null;
  const size = fitAll([...TOOL_ROWS, ...FUNCIONE_ROWS], TOOL_L.textW, ROW, TOOL_L.rowMax);
  const fSize = fit("funcione.", TOOL_L.textW, FUNC, TOOL_L.funcioneMax);
  const fW = widthOf("funcione.", fSize, FUNC);
  const lastW = widthOf(TOOL_ROWS[3], size, ROW);
  const struck = frame >= TOOL.strike + 4;
  const fy = TOOL_L.funcioneTop + fSize / 2;

  return (
    <>
      {TOOL_ROWS.map((t, i) => (
        <Line key={t} y={TOOL_L.rows[i]} size={size} style={i === 3 && struck ? { color: COLOR.grey } : undefined}>
          <span style={{ display: "inline-block", ...rise(frame, TOOL.lines[i]) }}>{t}</span>
        </Line>
      ))}
      <Pen d={strikePath(TOOL_L.textX, TOOL_L.textX + lastW, TOOL_L.rows[3] + size * 0.06, "ferramenta")} from={TOOL.strike} to={TOOL.strike + 8} width={11} />

      {FUNCIONE_ROWS.map((t, i) => (
        <Line key={t} y={TOOL_L.funcioneRows[i]} size={size}>
          <span style={{ display: "inline-block", ...rise(frame, FUNCIONE.lines[i]) }}>{t}</span>
        </Line>
      ))}
      {frame >= FUNCIONE.funcione && (
        <Line y={fy} size={fSize} style={{ ...FUNC, color: COLOR.coral }}>
          <span
            style={{
              display: "inline-block",
              transformOrigin: slamOrigin(fW, TOOL_L.textX, METHOD_L.cx),
              transform: `scale(${slam(frame, FUNCIONE.funcione)})`,
            }}
          >
            funcione.
          </span>
        </Line>
      )}
      <Pen d={underlinePath(TOOL_L.textX + 6, TOOL_L.textX + fW - 10, fy + fSize * 0.42, "funcione")} from={FUNCIONE.underline} to={FUNCIONE.underline + 9} width={10} />
    </>
  );
};
