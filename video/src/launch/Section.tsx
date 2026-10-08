import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import { CROPS, MAX_W, SECTION_L } from "./layout";
import { Pen, underlinePath } from "./pen";
import { SECTION } from "./timeline";

/**
 * O cabeçalho real da seção do site ("Onde a Opus SoftWorks entra — Três
 * frentes, uma mesma estratégia."), ampliado. A caneta sublinha "estratégia.".
 */
export const Section: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < SECTION.at - 18 || frame > SECTION.at + 95) return null;
  const h2 = SECTION_L.h2;
  // "estratégia." ocupa ~34–66% da largura do h2, na 2ª linha (medido na captura).
  const y = h2.y + h2.h + 4;
  return (
    <>
      <Img
        src={staticFile(CROPS.section)}
        style={{ position: "absolute", left: SECTION_L.cx - MAX_W / 2, top: SECTION_L.top, width: MAX_W, height: SECTION_L.h }}
      />
      <Pen d={underlinePath(h2.x + h2.w * 0.335, h2.x + h2.w * 0.655, y, "estrategia")} from={SECTION.underline} to={SECTION.underline + 9} />
    </>
  );
};
