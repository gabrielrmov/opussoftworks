import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FONT } from "./font";
import { METHOD_L } from "./layout";
import { beatPulse, pop, popStyle } from "./motion";
import { METHOD_STEPS } from "./timeline";

const STEPS = ["Diagnóstico", "Estratégia", "Implementação", "Otimização"];

/** A linha coral desce vertical (ver layout) e cada etapa acende num beat. */
export const Method: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {STEPS.map((label, i) => {
        const at = METHOD_STEPS[i];
        const p = pop(frame, at, 14);
        const node = pop(frame, at, 11);
        const isLast = frame >= at && (i === STEPS.length - 1 || frame < METHOD_STEPS[i + 1]);
        const y = METHOD_L.steps[i];
        return (
          <div key={label}>
            <div
              style={{
                position: "absolute",
                left: METHOD_L.lineX - 30,
                top: y - 30,
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: C.orange,
                border: `8px solid ${C.paper}`,
                boxShadow: `0 0 0 4px ${C.orange}`,
                transform: `scale(${node * (1 + (isLast ? 0.18 * beatPulse(frame) : 0))})`,
              }}
            />
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
              <span style={{ display: "inline-block", transformOrigin: "left center", ...popStyle(p, 1.12, 0), transform: `${popStyle(p, 1.12, 0).transform} translateX(${(1 - Math.min(1, p)) * 60}px)` }}>
                {label}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
};
