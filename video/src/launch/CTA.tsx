import React from "react";
import { useCurrentFrame } from "remotion";
import { BUTTON_RECT, COLOR, CTA_L, MAX_W, SCREEN_FOCUS, toWorld } from "./layout";
import { enter } from "./motion";
import { Mask } from "./reveal";
import { CTA } from "./timeline";
import { fitAll, sans } from "./type";

const QUESTION = ["Vamos elevar o", "próximo passo?"];
const Q = sans(700, "-0.045em");

/**
 * Fechamento centrado: a pergunta sobe da máscara, a linha desenha o
 * contorno do botão a partir do topo (as duas metades ao mesmo tempo) e,
 * quando fecha, o botão preenche. A partir de CTA.still nada entra nem sai.
 */
export const CTA_Block: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CTA.question - 2) return null;
  const size = fitAll(QUESTION, MAX_W, Q, CTA_L.questionMax);
  const fill = enter(frame, CTA.closed, 8);
  const R = BUTTON_RECT;
  const centered = (sy: number): React.CSSProperties => {
    const p = toWorld(SCREEN_FOCUS.x, sy);
    return { position: "absolute", left: p.x - MAX_W / 2, width: MAX_W, top: p.y, transform: "translateY(-50%)", textAlign: "center", whiteSpace: "nowrap" };
  };

  return (
    <>
      {QUESTION.map((text, i) => (
        <div key={text} style={{ ...centered(CTA_L.questionSy[i]), ...Q, fontSize: size, lineHeight: 1, color: COLOR.ink }}>
          <Mask at={CTA.question + i * 4} dur={18}>
            {text}
          </Mask>
        </div>
      ))}

      {/* O preenchimento ocupa exatamente o contorno que a linha fecha. */}
      <div
        style={{
          position: "absolute",
          left: R.cx - R.w / 2,
          top: R.cy - R.h / 2,
          width: R.w,
          height: R.h,
          borderRadius: R.h / 2,
          backgroundColor: COLOR.coral,
          opacity: fill,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 14,
          ...sans(600, "-0.02em"),
          fontSize: CTA_L.button.text,
          color: COLOR.white,
          whiteSpace: "nowrap",
        }}
      >
        <Mask at={CTA.label} inline>
          Falar com um especialista
        </Mask>
        <Mask at={CTA.label + 3} inline>
          <svg width={40} height={40} viewBox="0 0 24 24" fill="none" stroke={COLOR.white} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={{ display: "block" }}>
            <path d="M7 17 L17 7 M9 7 L17 7 L17 15" />
          </svg>
        </Mask>
      </div>

      <div style={{ ...centered(CTA_L.urlSy), ...sans(500, "-0.01em"), fontSize: CTA_L.urlSize, lineHeight: 1, color: COLOR.muted }}>
        <Mask at={CTA.url}>opussoftworks.com.br</Mask>
      </div>
    </>
  );
};
