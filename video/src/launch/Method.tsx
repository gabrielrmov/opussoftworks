import React from "react";
import { useCurrentFrame } from "remotion";
import { drawnLength } from "./CoralLine";
import { COLOR, METHOD_L, STEP_LENGTHS } from "./layout";
import { enter, leave } from "./motion";
import { Mask } from "./reveal";
import { METHOD } from "./timeline";
import { fitAll, sans } from "./type";

const STEPS = ["Diagnóstico", "Estratégia", "Implementação", "Otimização"];
const NAME = sans(700, "-0.045em");

/**
 * A linha desce como timeline; quando passa por uma etapa, deixa um ponto
 * (sem pulso) e o nome sobe da máscara. Sai tudo antes de a câmera partir.
 */
export const Method: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < METHOD.at - 20 || frame > METHOD.moveFrom + 6) return null;
  const drawn = drawnLength(frame);
  const size = fitAll(STEPS, METHOD_L.textW, NAME, METHOD_L.size);
  return (
    <>
      {STEPS.map((label, i) => {
        const at = METHOD.steps[i];
        const y = METHOD_L.steps[i];
        const out = METHOD.exit + i * 2;
        const dot = drawn >= STEP_LENGTHS[i] - 2 ? enter(frame, at - 1, 10) * (1 - leave(frame, out, 8)) : 0;
        return (
          <React.Fragment key={label}>
            {dot > 0 && (
              <div
                style={{
                  position: "absolute",
                  left: METHOD_L.lineX - 18,
                  top: y - 18,
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: COLOR.coral,
                  transform: `scale(${dot})`,
                }}
              />
            )}
            <div style={{ position: "absolute", left: METHOD_L.textX, top: y - size / 2, ...NAME, fontSize: size, lineHeight: 1, color: COLOR.ink, whiteSpace: "nowrap" }}>
              <Mask at={at} out={out}>
                {label}
              </Mask>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};
