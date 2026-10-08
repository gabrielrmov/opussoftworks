import React from "react";
import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { FONT } from "./font";
import { BUTTON_RECT, CTA_L, SCREEN_FOCUS, toWorld } from "./layout";
import { ease, pop, popStyle } from "./motion";
import { CTA } from "./timeline";

/**
 * CTA no terço do meio pra baixo. A partir do 780 nada entra nem sai: o
 * botão (preenchido dentro do contorno que a linha fecha) só pulsa.
 */
export const CTA_Block: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < CTA.question - 2) return null;
  const q = [pop(frame, CTA.question, 15), pop(frame, CTA.question + 5, 15)];
  const url = pop(frame, CTA.url, 15);
  const fill = ease(frame, CTA.closed, CTA.at);
  const pulse = frame >= CTA.at ? 0.5 - 0.5 * Math.cos((2 * Math.PI * (frame - CTA.at)) / 30) : 0;
  const urlPos = toWorld(SCREEN_FOCUS.x, CTA_L.urlSy);
  const R = BUTTON_RECT;

  return (
    <>
      {["Vamos elevar o", "próximo passo?"].map((text, i) => {
        const pos = toWorld(SCREEN_FOCUS.x, CTA_L.questionSy[i]);
        return (
          <div
            key={text}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y,
              transform: "translate(-50%, -50%)",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: CTA_L.questionSize,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: C.ink,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ display: "inline-block", ...popStyle(q[i], 1.12, 40) }}>{text}</span>
          </div>
        );
      })}

      {/* Preenchimento do botão: ocupa exatamente o contorno que a linha fecha. */}
      <div
        style={{
          position: "absolute",
          left: R.cx - R.w / 2,
          top: R.cy - R.h / 2,
          width: R.w,
          height: R.h,
          borderRadius: R.h / 2,
          backgroundColor: C.orange,
          opacity: fill,
          boxShadow: `0 0 ${20 + 40 * pulse}px rgba(255,96,57,${0.25 + 0.25 * pulse})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: CTA_L.button.text,
          letterSpacing: "-0.02em",
          color: C.white,
          whiteSpace: "nowrap",
        }}
      >
        Falar com um especialista
        <svg
          width={44}
          height={44}
          viewBox="0 0 24 24"
          fill="none"
          stroke={C.white}
          strokeWidth={2.4}
          strokeLinecap="round"
          style={{ transform: `translate(${pulse * 4}px, ${-pulse * 4}px)` }}
        >
          <path d="M7 17 L17 7 M9 7 L17 7 L17 15" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: urlPos.x,
          top: urlPos.y,
          transform: "translate(-50%, -50%)",
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: CTA_L.urlSize,
          letterSpacing: "-0.02em",
          color: C.ink,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "inline-block", ...popStyle(url, 1.1, 30) }}>opussoftworks.com.br</span>
      </div>
    </>
  );
};
