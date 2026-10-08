import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { ramp, useEnter } from "../anim";
import { C, SANS } from "../theme";
import { MaskRise } from "./shared";

// "É entrega." chega junto do impacto da trilha em 5s (frame local 66 desta cena).
const SORTE_BLUR_FROM = 46;
const ENTREGA_AT = 64;

export const Statement: React.FC = () => {
  const frame = useCurrentFrame();
  const unfocus = ramp(frame, SORTE_BLUR_FROM, ENTREGA_AT, [0, 1], Easing.inOut(Easing.quad));
  const hit = useEnter(ENTREGA_AT, 12);
  const underline = ramp(frame, ENTREGA_AT + 8, ENTREGA_AT + 24, [0, 1], Easing.inOut(Easing.cubic));

  const line: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 600,
    fontSize: 112,
    lineHeight: 1.05,
    letterSpacing: "-0.055em",
    color: C.ink,
  };

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 70px", textAlign: "center" }}>
      <div style={line}>
        <MaskRise delay={6}>Resultado</MaskRise> <MaskRise delay={12}>não</MaskRise>
      </div>
      <div style={line}>
        <MaskRise delay={18}>é</MaskRise>{" "}
        <MaskRise delay={24}>
          <span
            style={{
              display: "inline-block",
              filter: `blur(${unfocus * 12}px)`,
              opacity: 1 - unfocus * 0.75,
              transform: `scale(${1 - unfocus * 0.06})`,
            }}
          >
            sorte.
          </span>
        </MaskRise>
      </div>

      <div
        style={{
          position: "relative",
          marginTop: 40,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 196,
          lineHeight: 1,
          letterSpacing: "-0.06em",
          color: C.orange,
          opacity: Math.min(1, hit * 2),
          transform: `scale(${1.25 - hit * 0.25})`,
          filter: `blur(${(1 - hit) * 16}px)`,
        }}
      >
        É entrega.
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: -18,
            height: 10,
            width: `${underline * 100}%`,
            borderRadius: 5,
            backgroundColor: C.ink,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
