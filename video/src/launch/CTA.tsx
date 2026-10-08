import React from "react";
import { useCurrentFrame } from "remotion";
import { BUTTON_RECT, COLOR, CTA_L, MAX_W, SCREEN_FOCUS, toWorld } from "./layout";
import { enter, rise } from "./motion";
import { CTA } from "./timeline";
import { fitAll, mono, sans, serif } from "./type";

/** CTA final do site: h2 em Instrument Serif e o botão pílula preto. */
const TITLE = ["Estratégia, aliada", "à execução."];
const H2 = serif(false);

/**
 * Embaixo do wordmark: o título entra, a linha sai do wordmark e contorna o
 * botão; quando fecha, o botão "acende" (preto, como no site) com o clique.
 * A partir do 780 nada entra nem sai.
 */
export const CTA_Block: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CTA.question - 2) return null;
  const size = fitAll(TITLE, MAX_W, H2, CTA_L.questionSize + 16);
  const on = enter(frame, CTA.closed, 4);
  const urlPos = toWorld(SCREEN_FOCUS.x, CTA_L.urlSy);
  const R = BUTTON_RECT;

  return (
    <>
      {TITLE.map((text, i) => {
        const pos = toWorld(SCREEN_FOCUS.x, CTA_L.questionSy[i]);
        return (
          <div key={text} style={{ position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%, -50%)", ...H2, fontSize: size, lineHeight: 1, color: COLOR.ink, whiteSpace: "nowrap" }}>
            <span style={{ display: "inline-block", ...rise(frame, CTA.question + i * 4, 30) }}>{text}</span>
          </div>
        );
      })}

      {/* O botão do site: pílula preta, texto branco médio. Ocupa o contorno que a linha fecha. */}
      {frame >= CTA.closed && (
        <div
          style={{
            position: "absolute",
            left: R.cx - R.w / 2,
            top: R.cy - R.h / 2,
            width: R.w,
            height: R.h,
            borderRadius: R.h / 2,
            backgroundColor: COLOR.ink,
            transform: `scale(${0.94 + 0.06 * on})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...sans(500, "-0.01em"),
            fontSize: CTA_L.button.text,
            color: COLOR.white,
            whiteSpace: "nowrap",
          }}
        >
          Conversar no WhatsApp
        </div>
      )}

      <div style={{ position: "absolute", left: urlPos.x, top: urlPos.y, transform: "translate(-50%, -50%)", ...mono, fontSize: CTA_L.urlSize, color: COLOR.muted, whiteSpace: "nowrap" }}>
        <span style={{ display: "inline-block", ...rise(frame, CTA.url, 20) }}>opussoftworks.com.br</span>
      </div>
    </>
  );
};
