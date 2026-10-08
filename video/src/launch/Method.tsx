import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { drawnLength } from "./CoralLine";
import { FONT } from "./font";
import { METHOD_L, STEP_LENGTHS } from "./layout";
import { beatPulse, pop, popStyle } from "./motion";
import { METHOD_STEPS } from "./timeline";

const STEPS = ["Diagnóstico", "Estratégia", "Implementação", "Otimização"];

/**
 * A linha desce vertical durante o movimento de câmera e marca os quatro
 * nós; cada etapa acende num beat.
 */
export const Method: React.FC = () => {
  const frame = useCurrentFrame();
  const drawn = drawnLength(frame);
  return (
    <>
      {STEPS.map((label, i) => {
        const at = METHOD_STEPS[i];
        const p = pop(frame, at, 14);
        const reached = drawn >= STEP_LENGTHS[i] - 2;
        const ring = pop(frame, at - 12, 12);
        const lit = frame >= at;
        const isLast = lit && (i === STEPS.length - 1 || frame < METHOD_STEPS[i + 1]);
        const y = METHOD_L.steps[i];
        return (
          <div key={label}>
            {reached && (
              <div
                style={{
                  position: "absolute",
                  left: METHOD_L.lineX - 28,
                  top: y - 28,
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: lit ? C.orange : C.paper,
                  border: `9px solid ${C.orange}`,
                  transform: `scale(${Math.max(ring, 0.6) * (1 + (isLast ? 0.18 * beatPulse(frame) : 0))})`,
                }}
              />
            )}
            <div
              style={{
                position: "absolute",
                left: METHOD_L.textX,
                top: y,
                transform: "translateY(-50%)",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: METHOD_L.size,
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: C.ink,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ display: "inline-block", transformOrigin: "left center", ...popStyle(p, 1.12, 30) }}>{label}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};
