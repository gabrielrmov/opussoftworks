import React from "react";
import { random, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FONT } from "./font";
import { HOOK_L } from "./layout";
import { ease, pop, popStyle } from "./motion";
import { HOOK } from "./timeline";

const base: React.CSSProperties = {
  position: "absolute",
  left: 0,
  width: HOOK_L.cx * 2,
  textAlign: "center",
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: HOOK_L.size,
  lineHeight: 1,
  letterSpacing: "-0.045em",
  color: C.ink,
  whiteSpace: "nowrap",
};

/** Linha de texto centrada no x do bloco, posicionada pelo centro vertical. */
const Row: React.FC<{ y: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ y, style, children }) => (
  <div style={{ ...base, top: y, transform: "translateY(-50%)", ...style }}>{children}</div>
);

const Word: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", transformOrigin: "center bottom", ...popStyle(pop(frame, at, 14), 1.15, 36) }}>{children}</span>;
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // "Resultado": já na tela no frame 0, em 1.15, e assenta com spring.
  const r = pop(frame, HOOK.resultado, 14);

  // "sorte.": glitch enquanto o risco passa e sai antes de o retângulo fechar.
  const glitching = frame >= HOOK.glitchFrom && frame < HOOK.entrega + 4;
  const tick = Math.floor(frame / 2);
  const jx = glitching ? (random(`gx${tick}`) - 0.5) * 34 : 0;
  const jy = glitching ? (random(`gy${tick}`) - 0.5) * 10 : 0;
  const sliceTop = random(`gs${tick}`) * 70;
  const out = ease(frame, HOOK.sorteOut, HOOK.entrega + 5);

  const ent = pop(frame, HOOK.entrega, 14);
  const ent2 = pop(frame, HOOK.entrega + 4, 14);

  return (
    <>
      <Row y={HOOK_L.rows.resultado} style={{ transform: `translateY(-50%) scale(${1.15 - 0.15 * r})` }}>
        Resultado
      </Row>
      <Row y={HOOK_L.rows.naoE}>
        <Word at={HOOK.nao}>não</Word> <Word at={HOOK.e}>é</Word>
      </Row>
      {out < 1 && (
        <Row y={HOOK_L.rows.sorte} style={{ opacity: 1 - out, filter: `blur(${out * 14}px)`, transform: `translateY(-50%) translateY(${-out * 40}px) scale(${1 - out * 0.1})` }}>
          <Word at={HOOK.sorte}>
            <span style={{ position: "relative", display: "inline-block" }}>
              <span style={{ display: "inline-block", transform: `translate(${jx}px, ${jy}px)`, filter: glitching ? `blur(${2 + random(`gb${tick}`) * 3}px)` : undefined }}>
                sorte.
              </span>
              {glitching && (
                <>
                  <span style={{ position: "absolute", left: -jx * 1.4, top: 0, opacity: 0.45, clipPath: `inset(${sliceTop}% 0 ${Math.max(0, 80 - sliceTop)}% 0)` }}>
                    sorte.
                  </span>
                  <span style={{ position: "absolute", left: jx * 0.8 + 14, top: 0, opacity: 0.3, clipPath: `inset(${100 - sliceTop}% 0 0 0)` }}>
                    sorte.
                  </span>
                </>
              )}
            </span>
          </Word>
        </Row>
      )}

      <Row y={HOOK_L.entrega.y} style={{ fontSize: HOOK_L.entrega.size, letterSpacing: "-0.05em", color: C.orange }}>
        <span style={{ display: "inline-block", transformOrigin: "center bottom", ...popStyle(ent, 1.25, 60) }}>É</span>{" "}
        <span style={{ display: "inline-block", transformOrigin: "center bottom", ...popStyle(ent2, 1.25, 60) }}>entrega.</span>
      </Row>
    </>
  );
};
