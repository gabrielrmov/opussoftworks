import { useCurrentFrame } from "remotion";
import { C } from "../theme";
import { pillRect } from "./CoralLine";
import { FONT } from "./font";
import { CTA_CAM, CTA_L, toWorld } from "./layout";
import { ease, pop, popStyle } from "./motion";
import { CTA_AT, LOGO } from "./timeline";

/**
 * Montado entre LOGO.hold e CTA_AT; a partir do 780 nada entra nem sai,
 * só o botão pulsa. Tamanhos de tela convertidos pra mundo (câmera 0.8).
 */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  if (frame < LOGO.hold - 2) return null;
  const k = 1 / CTA_CAM.s;
  const q = [pop(frame, LOGO.hold + 3, 15), pop(frame, LOGO.hold + 7, 15)];
  const url = pop(frame, LOGO.hold + 12, 15);
  const fill = ease(frame, LOGO.hold + 8, CTA_AT - 2);
  const pulse = frame >= CTA_AT ? 0.5 - 0.5 * Math.cos((2 * Math.PI * (frame - CTA_AT)) / 30) : 0;
  const rect = pillRect(frame);
  const pad = 22 * k;
  const urlPos = toWorld(500, CTA_L.urlSy);

  return (
    <>
      {["Vamos elevar o", "próximo passo?"].map((text, i) => {
        const pos = toWorld(500, CTA_L.questionSy[i]);
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
              fontSize: CTA_L.questionSize * k,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              color: C.ink,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ display: "inline-block", ...popStyle(q[i], 1.12, 40 * k) }}>{text}</span>
          </div>
        );
      })}

      {/* Botão: preenchimento coral dentro do contorno (a linha) */}
      <div
        style={{
          position: "absolute",
          left: rect.cx - rect.w / 2 + pad,
          top: rect.cy - rect.h / 2 + pad,
          width: rect.w - pad * 2,
          height: rect.h - pad * 2,
          borderRadius: 999,
          backgroundColor: C.orange,
          opacity: fill,
          transform: `scale(${(0.9 + 0.1 * fill) * (1 + 0.03 * pulse)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16 * k,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: CTA_L.button.text * k,
          letterSpacing: "-0.02em",
          color: C.white,
          whiteSpace: "nowrap",
        }}
      >
        Falar com um especialista
        <svg width={44 * k} height={44 * k} viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth={2.4} strokeLinecap="round">
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
          fontSize: CTA_L.urlSize * k,
          letterSpacing: "-0.02em",
          color: C.ink,
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ display: "inline-block", ...popStyle(url, 1.1, 30 * k) }}>opussoftworks.com.br</span>
      </div>
    </>
  );
};
