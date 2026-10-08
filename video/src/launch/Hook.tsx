import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, HOOK_L } from "./layout";
import { rise, slam } from "./motion";
import { HOOK } from "./timeline";
import { sans } from "./type";

const face = sans(700);

/** Linha centrada no x do bloco, posicionada pelo centro vertical. */
const Row: React.FC<{ y: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ y, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      top: y,
      width: HOOK_L.cx * 2,
      transform: "translateY(-50%)",
      textAlign: "center",
      ...face,
      fontSize: HOOK_L.size,
      lineHeight: 1,
      color: COLOR.ink,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

const Word: React.FC<{ at: number; children: React.ReactNode }> = ({ at, children }) => {
  const frame = useCurrentFrame();
  return <span style={{ display: "inline-block", ...rise(frame, at, 36) }}>{children}</span>;
};

/**
 * "Resultado não é sorte. É entrega." — palavra por palavra no beat.
 * A linha risca "sorte." (que acinzenta e sai seco) e fecha o retângulo
 * em volta de "É entrega.", que entra com slam.
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > HOOK.boxClosed + 30) return null;
  return (
    <>
      <Row y={HOOK_L.rows.resultado}>
        <span style={{ display: "inline-block", transform: `scale(${slam(frame, HOOK.resultado, 0.08)})` }}>Resultado</span>
      </Row>
      <Row y={HOOK_L.rows.naoE}>
        <Word at={HOOK.nao}>não</Word> <Word at={HOOK.e}>é</Word>
      </Row>
      {frame < HOOK.sorteOut && (
        <Row y={HOOK_L.rows.sorte} style={{ color: frame >= HOOK.grey ? COLOR.grey : COLOR.ink }}>
          <Word at={HOOK.sorte}>sorte.</Word>
        </Row>
      )}
      {frame >= HOOK.entrega && (
        <Row y={HOOK_L.entrega.y} style={{ fontSize: HOOK_L.entrega.size, letterSpacing: "-0.05em", color: COLOR.coral }}>
          <span style={{ display: "inline-block", transform: `scale(${slam(frame, HOOK.entrega)})` }}>É entrega.</span>
        </Row>
      )}
    </>
  );
};
