import React from "react";
import { useCurrentFrame } from "remotion";
import { COLOR, HOOK_L } from "./layout";
import { Mask } from "./reveal";
import { HOOK } from "./timeline";
import { sans } from "./type";

const face = sans(700);

const Row: React.FC<{ y: number; size?: number; color?: string; children: React.ReactNode }> = ({ y, size = HOOK_L.size, color = COLOR.ink, children }) => (
  <div style={{ position: "absolute", left: HOOK_L.x0, top: y - size / 2, ...face, fontSize: size, lineHeight: 1, color, whiteSpace: "nowrap" }}>{children}</div>
);

/**
 * "Resultado / não é / sorte." linha a linha, subindo de trás da máscara.
 * A linha coral risca "sorte." (que acinzenta e sai) e fecha a caixa em
 * volta de "É entrega.". Tudo sai antes de a câmera partir.
 */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame > HOOK.moveFrom + 6) return null;
  const x = HOOK.exit;
  return (
    <>
      <Row y={HOOK_L.rows.resultado}>
        <Mask at={HOOK.resultado} out={x} dur={18}>Resultado</Mask>
      </Row>
      <Row y={HOOK_L.rows.naoE}>
        <Mask at={HOOK.naoE} out={x + 2}>não é</Mask>
      </Row>
      <Row y={HOOK_L.rows.sorte} color={frame >= HOOK.grey ? COLOR.grey : COLOR.ink}>
        <Mask at={HOOK.sorte} out={HOOK.sorteOut}>sorte.</Mask>
      </Row>
      <Row y={HOOK_L.entrega.y} size={HOOK_L.entrega.size}>
        <Mask at={HOOK.entrega} out={x + 4} dur={20} style={{ letterSpacing: "-0.05em" }}>
          É entrega.
        </Mask>
      </Row>
    </>
  );
};
