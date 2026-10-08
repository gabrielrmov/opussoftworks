import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FONT } from "./font";
import { OUTCOME_L } from "./layout";
import { pop, popStyle } from "./motion";
import { OUTCOME_LINES } from "./timeline";

// Sem números: a curva de crescimento é a própria linha coral (ver layout).
const ROWS = [
  { text: "Venda mais.", at: OUTCOME_LINES[0] },
  { text: "Opere melhor.", at: OUTCOME_LINES[1] },
  { text: "Cresça com", at: OUTCOME_LINES[2], accent: true },
  { text: "clareza.", at: OUTCOME_LINES[2] + 4, accent: true },
];

export const Outcome: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {ROWS.map((row, i) => {
        const p = pop(frame, row.at, 14);
        return (
          <div
            key={row.text}
            style={{
              position: "absolute",
              left: OUTCOME_L.textX,
              top: OUTCOME_L.rows[i],
              transform: "translateY(-50%)",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: OUTCOME_L.size,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              whiteSpace: "nowrap",
              color: row.accent ? C.orange : C.ink,
            }}
          >
            <span style={{ display: "inline-block", transformOrigin: "left bottom", ...popStyle(p, 1.15, 50) }}>{row.text}</span>
          </div>
        );
      })}
    </>
  );
};
