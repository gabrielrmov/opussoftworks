import React from "react";
import { useCurrentFrame } from "remotion";
import { drawnLength } from "./CoralLine";
import { COLOR, METHOD_L, STEP_LENGTHS } from "./layout";
import { enter, rise } from "./motion";
import { METHOD_STEPS } from "./timeline";
import { fitAll, sans, serif } from "./type";

/** As quatro etapas de "Como trabalhamos", com o título e a frase do site. */
const STEPS = [
  { title: "Diagnóstico", headline: "Antes de propor, a gente entende." },
  { title: "Estratégia", headline: "Prioridade antes de execução." },
  { title: "Implementação", headline: "Estratégia que sai do papel." },
  { title: "Otimização contínua", headline: "O trabalho não termina no lançamento." },
];
const NAME = sans(500, "-0.04em");
const SUB = serif();

/**
 * A linha desce como timeline; em cada etapa deixa um ponto (parado, sem
 * pulso) e o nome entra no beat, com a frase logo depois.
 */
export const Method: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < METHOD_STEPS[0] - 30 || frame > METHOD_STEPS[3] + 140) return null;
  const drawn = drawnLength(frame);
  const nameSize = fitAll(STEPS.map((s) => s.title), METHOD_L.textW, NAME, METHOD_L.nameMax);
  const subSize = fitAll(STEPS.map((s) => s.headline), METHOD_L.textW, SUB, METHOD_L.subSize);
  return (
    <>
      {STEPS.map((s, i) => {
        const at = METHOD_STEPS[i];
        const y = METHOD_L.steps[i];
        const reached = drawn >= STEP_LENGTHS[i] - 2;
        return (
          <React.Fragment key={s.title}>
            {reached && (
              <div
                style={{
                  position: "absolute",
                  left: METHOD_L.lineX - 17,
                  top: y - 17,
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: COLOR.coral,
                  transform: `scale(${0.5 + 0.5 * enter(frame, at - 2, 5)})`,
                }}
              />
            )}
            <div style={{ position: "absolute", left: METHOD_L.textX, top: y - 6, transform: "translateY(-100%)", whiteSpace: "nowrap" }}>
              <div style={{ ...NAME, fontSize: nameSize, lineHeight: 1, color: COLOR.ink, ...rise(frame, at) }}>{s.title}</div>
            </div>
            <div style={{ position: "absolute", left: METHOD_L.textX, top: y + 14, whiteSpace: "nowrap" }}>
              <div style={{ ...SUB, fontSize: subSize, lineHeight: 1.1, color: COLOR.muted, ...rise(frame, at + 4, 20) }}>{s.headline}</div>
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};
