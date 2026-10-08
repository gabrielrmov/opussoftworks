import React from "react";
import { useCurrentFrame } from "remotion";
import { SIGNATURE } from "../../timeline";
import { enter, rise } from "../anim";
import { DotGrid } from "../fx";
import { Pen, underlinePath } from "../pen";
import { Line, METRICS } from "../text";
import { COLOR, MARGIN, MONO, SANS, SERIF } from "../tokens";

const WM = 128;
const TAG = 92;
const TAG_TOPS = [740, 842];

/** Assinatura: wordmark do site (wipe), tagline com sublinhado à mão, botão e URL. */
export const Signature: React.FC = () => {
  const f = useCurrentFrame();
  const wipe = enter(f, SIGNATURE.wordmark, 10);
  const btnIn = enter(f, SIGNATURE.button, 8);
  const pulse = f >= SIGNATURE.button + 8 ? 1 + 0.02 * (0.5 - 0.5 * Math.cos(((f - SIGNATURE.button - 8) / 30) * 2 * Math.PI)) : 1;
  const prefix = METRICS["sig.line2prefix"].width;
  const exe = METRICS["sig.execucao"];
  const underlineY = TAG_TOPS[1] + METRICS["sig.line2"].baseline + 16;

  return (
    <>
      <DotGrid />
      {/* Wordmark igual ao do site: "Opus" 800 coral + "SoftWorks" 500 preto */}
      <Line top={550} font={SANS} size={WM} tracking={-0.035} color={COLOR.ink} style={{ clipPath: `inset(-10% ${(1 - wipe) * 100}% -10% 0)` }}>
        <span style={{ fontWeight: 800, color: COLOR.coral }}>Opus</span>
        <span style={{ fontWeight: 500 }}>SoftWorks</span>
      </Line>
      <Line top={TAG_TOPS[0]} font={SERIF} size={TAG} tracking={-0.01} color={COLOR.ink} style={rise(f, SIGNATURE.tagline)}>
        Estratégia, aliada
      </Line>
      <Line top={TAG_TOPS[1]} font={SERIF} size={TAG} tracking={-0.01} color={COLOR.ink} style={rise(f, SIGNATURE.tagline + 4)}>
        à execução.
      </Line>
      <Pen d={underlinePath(MARGIN + prefix, MARGIN + prefix + exe.width, underlineY, "exec")} from={SIGNATURE.underline} to={SIGNATURE.underline + 9} width={9} />
      {/* Botão do site: pílula preta, texto branco, seta ↗ */}
      <div
        style={{
          position: "absolute",
          left: MARGIN,
          top: 1020,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "34px 56px",
          borderRadius: 999,
          backgroundColor: COLOR.ink,
          color: COLOR.white,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 50,
          letterSpacing: "-0.01em",
          lineHeight: 1,
          whiteSpace: "nowrap",
          opacity: f < SIGNATURE.button ? 0 : 1,
          transform: `translateY(${(1 - btnIn) * 40}px) scale(${pulse})`,
          transformOrigin: "left center",
        }}
      >
        Falar com um especialista
        <svg width={46} height={46} viewBox="0 0 24 24" fill="none" stroke={COLOR.white} strokeWidth={2} strokeLinecap="round">
          <path d="M7 17 L17 7 M9 7 L17 7 L17 15" />
        </svg>
      </div>
      <Line top={1210} font={MONO} size={40} weight={500} color={COLOR.ink} style={rise(f, SIGNATURE.url)}>
        opussoftworks.com.br
      </Line>
    </>
  );
};
