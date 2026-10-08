import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FONT } from "./font";
import { pop, popStyle } from "./motion";
import { SYSTEM } from "./timeline";

/**
 * Título do momento "sistema" — fica em coordenadas de tela, por cima do
 * canvas, enquanto a câmera está aberta mostrando os três pilares ligados.
 */
export const SystemTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const a = pop(frame, SYSTEM.titleA, 15);
  const b = pop(frame, SYSTEM.titleB, 15);
  const out = interpolate(frame, [SYSTEM.out, SYSTEM.out + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  if (frame < SYSTEM.titleA - 2 || out >= 1) return null;
  const line: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 700,
    fontSize: 128,
    lineHeight: 1.02,
    letterSpacing: "-0.05em",
    textAlign: "center",
  };
  return (
    <AbsoluteFill style={{ opacity: 1 - out, filter: `blur(${out * 14}px)`, transform: `translateY(${-out * 60}px)` }}>
      <div style={{ position: "absolute", top: 520, left: 60, right: 140, ...line, color: C.ink, ...popStyle(a, 1.15, 40) }}>
        Três frentes.
      </div>
      <div style={{ position: "absolute", top: 660, left: 60, right: 140, ...line, color: C.orange, ...popStyle(b, 1.15, 40) }}>
        Uma estratégia.
      </div>
    </AbsoluteFill>
  );
};
