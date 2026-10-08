import { random, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FONT } from "./font";
import { HOOK_L } from "./layout";
import { ease, pop, popStyle } from "./motion";
import { HOOK } from "./timeline";

const base: React.CSSProperties = {
  position: "absolute",
  left: HOOK_L.x,
  fontFamily: FONT,
  fontWeight: 700,
  fontSize: HOOK_L.size,
  lineHeight: 1,
  letterSpacing: "-0.045em",
  color: C.ink,
  whiteSpace: "nowrap",
  transformOrigin: "left center",
};

/** Posiciona uma linha de texto pelo centro vertical (coordenadas de mundo). */
const Row: React.FC<{ y: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ y, style, children }) => (
  <div style={{ ...base, top: y, transform: "translateY(-50%)", ...style }}>{children}</div>
);

const Word: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, children, style }) => {
  const frame = useCurrentFrame();
  const p = pop(frame, at, 14);
  return <span style={{ display: "inline-block", transformOrigin: "left bottom", ...popStyle(p, 1.15, 36), ...style }}>{children}</span>;
};

export const Hook: React.FC = () => {
  const frame = useCurrentFrame();

  // "Resultado": já está na tela no frame 0, em escala 1.15, e assenta com spring.
  const r = pop(frame, HOOK.resultado, 14);

  // Glitch em "sorte." até o risco chegar.
  const glitching = frame >= HOOK.glitchFrom && frame < HOOK.entrega;
  const tick = Math.floor(frame / 2);
  const jx = glitching ? (random(`gx${tick}`) - 0.5) * 34 : 0;
  const jy = glitching ? (random(`gy${tick}`) - 0.5) * 10 : 0;
  const sliceTop = random(`gs${tick}`) * 70;
  const settle = ease(frame, HOOK.entrega, HOOK.entrega + 12);
  const sorteBlur = glitching ? 2 + random(`gb${tick}`) * 4 : (1 - settle) * 3;

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
      <Row y={HOOK_L.rows.sorte}>
        <Word at={HOOK.sorte}>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span
              style={{
                display: "inline-block",
                transform: `translate(${jx}px, ${jy}px)`,
                filter: `blur(${sorteBlur}px)`,
                opacity: frame >= HOOK.entrega ? 0.78 : 1,
              }}
            >
              sorte.
            </span>
            {glitching && (
              <>
                <span
                  style={{
                    position: "absolute",
                    left: -jx * 1.4,
                    top: 0,
                    opacity: 0.45,
                    clipPath: `inset(${sliceTop}% 0 ${Math.max(0, 80 - sliceTop)}% 0)`,
                  }}
                >
                  sorte.
                </span>
                <span
                  style={{
                    position: "absolute",
                    left: jx * 0.8 + 14,
                    top: 0,
                    opacity: 0.3,
                    clipPath: `inset(${100 - sliceTop}% 0 0 0)`,
                  }}
                >
                  sorte.
                </span>
              </>
            )}
          </span>
        </Word>
      </Row>

      <Row y={HOOK_L.entrega.y} style={{ fontSize: HOOK_L.entrega.size, letterSpacing: "-0.05em", color: C.orange }}>
        <span style={{ display: "inline-block", transformOrigin: "left bottom", ...popStyle(ent, 1.25, 60) }}>É</span>{" "}
        <span style={{ display: "inline-block", transformOrigin: "left bottom", ...popStyle(ent2, 1.25, 60) }}>entrega.</span>
      </Row>
    </>
  );
};
