import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, OUTCOME_L } from "./layout";
import { Mask } from "./reveal";
import { OUTCOME } from "./timeline";
import { sans } from "./type";

// Sem números: a curva de crescimento é a própria linha coral (ver layout).
const ROWS = [
  { text: "Venda mais.", accent: false },
  { text: "Opere melhor.", accent: false },
  { text: "Cresça com", accent: true },
  { text: "clareza.", accent: true },
];

export const Outcome: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < OUTCOME.at - 24 || frame > OUTCOME.moveFrom + 6) return null;
  return (
    <>
      {ROWS.map((row, i) => (
        <div
          key={row.text}
          style={{
            position: "absolute",
            left: OUTCOME_L.textX,
            top: OUTCOME_L.rows[i] - OUTCOME_L.size / 2,
            ...sans(700, "-0.05em"),
            fontSize: OUTCOME_L.size,
            lineHeight: 1,
            whiteSpace: "nowrap",
            color: row.accent ? COLOR.coral : COLOR.ink,
          }}
        >
          <Mask at={OUTCOME.lines[i]} out={OUTCOME.exit + i * 2}>
            {row.text}
          </Mask>
        </div>
      ))}
    </>
  );
};
