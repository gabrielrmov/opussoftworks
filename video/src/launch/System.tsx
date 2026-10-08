import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { COLOR, MAX_W, SYSTEM_TITLE, W } from "./layout";
import { Mask } from "./reveal";
import { SYSTEM } from "./timeline";
import { sans } from "./type";

/**
 * Com a câmera aberta mostrando os três pilares lado a lado (os próprios
 * mockups, ligados pela linha), o título entra por cima, em coordenadas de tela.
 */
export const SystemTitle: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < SYSTEM.titleA - 2 || frame > SYSTEM.out + 14) return null;
  const rows = [
    { text: "Três frentes.", at: SYSTEM.titleA, color: COLOR.ink },
    { text: "Uma estratégia.", at: SYSTEM.titleB, color: COLOR.coral },
  ];
  return (
    <AbsoluteFill>
      {rows.map((r, i) => (
        <div
          key={r.text}
          style={{
            position: "absolute",
            left: (W - MAX_W) / 2,
            top: SYSTEM_TITLE.sy[i] - SYSTEM_TITLE.size / 2,
            ...sans(700, "-0.05em"),
            fontSize: SYSTEM_TITLE.size,
            lineHeight: 1,
            color: r.color,
            whiteSpace: "nowrap",
          }}
        >
          <Mask at={r.at} out={SYSTEM.out + i * 2} dur={18}>
            {r.text}
          </Mask>
        </div>
      ))}
    </AbsoluteFill>
  );
};
