import React from "react";
import { Img, staticFile, useCurrentFrame } from "remotion";
import SITE from "../../public/site/opus-390.json";
import { COLOR, CROPS, emphasisBoxes, MAX_W, PILLARS_L, SITE_K } from "./layout";
import { rise, slam, slamOrigin } from "./motion";
import { circlePath, Pen, underlinePath } from "./pen";
import { PILLAR_AT, PILLAR_MARK } from "./timeline";
import { eyebrow, fit, sans, serif, widthOf } from "./type";

/** Título de cada frente: 1ª linha em serif itálico, 2ª em Inter Tight pesado — texto do site. */
const HEADLINES: [string, string][] = [
  ["Lead não é resultado.", "Venda é."],
  ["Sistemas e", "automações."],
  ["Sites que", "convertem."],
];
const LINE1 = serif();
const LINE2 = sans(800, "-0.05em");

const Pillar: React.FC<{ i: number }> = ({ i }) => {
  const frame = useCurrentFrame();
  const at = PILLAR_AT[i];
  // Só existe perto de quando a câmera passa (economiza render nas amostras de blur).
  if (frame < at - 18 || frame > at + 50) return null;

  const left = PILLARS_L.cx[i] - MAX_W / 2;
  const card = SITE.cards[i];
  const [l1, l2] = HEADLINES[i];
  const s1 = fit(l1, MAX_W, LINE1, 124);
  const s2 = fit(l2, MAX_W, LINE2, 176);
  const w2 = widthOf(l2, s2, LINE2);
  const boxes = emphasisBoxes(i);
  const mark = PILLAR_MARK[i];

  return (
    <>
      <div
        style={{
          position: "absolute",
          left,
          top: PILLARS_L.labelTop,
          ...eyebrow,
          fontSize: 32,
          lineHeight: 1,
          textTransform: "uppercase",
          color: COLOR.coral,
          whiteSpace: "nowrap",
          ...rise(frame, at - 4, 24),
        }}
      >
        {`0${i + 1} — ${card.title}`}
      </div>

      <div style={{ position: "absolute", left, top: PILLARS_L.headlineBottom, transform: "translateY(-100%)", whiteSpace: "nowrap" }}>
        <div style={{ ...LINE1, fontSize: s1, lineHeight: 1.08, color: COLOR.ink, ...rise(frame, at) }}>{l1}</div>
        <div style={{ ...LINE2, fontSize: s2, lineHeight: 1, color: i === 0 ? COLOR.coral : COLOR.ink, opacity: frame < at + 4 ? 0 : 1 }}>
          <span style={{ display: "inline-block", transformOrigin: slamOrigin(w2, left, PILLARS_L.cx[i]), transform: `scale(${slam(frame, at + 4)})` }}>{l2}</span>
        </div>
      </div>

      {/* O card real do site, ampliado (texto ~38 px). */}
      <div
        style={{
          position: "absolute",
          left,
          top: PILLARS_L.cardTop,
          width: MAX_W,
          height: PILLARS_L.cardH,
          borderRadius: 16 * SITE_K,
          overflow: "hidden",
        }}
      >
        <Img src={staticFile(CROPS.cards[i])} style={{ width: "100%", height: "100%", display: "block" }} />
      </div>

      {/* Caneta no trecho em negrito do card. */}
      {i === 0 ? (
        <Pen
          d={circlePath(boxes[0].x + boxes[0].w / 2, boxes[0].y + boxes[0].h / 2, boxes[0].w / 2 + 26, boxes[0].h / 2 + 20, "venda")}
          from={mark}
          to={mark + 10}
          width={7}
        />
      ) : (
        boxes.map((b, j) => (
          <Pen key={j} d={underlinePath(b.x, b.x + b.w, b.y + b.h + 6, `u${i}${j}`)} from={mark + j * 5} to={mark + j * 5 + (j === 0 ? 4 : 9)} width={7} />
        ))
      )}
    </>
  );
};

export const Pillars: React.FC = () => (
  <>
    {HEADLINES.map((_, i) => (
      <Pillar key={i} i={i} />
    ))}
  </>
);
