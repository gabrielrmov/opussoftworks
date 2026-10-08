import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { C, SANS } from "../theme";
import { MaskRise } from "./shared";

/** 0–3s: o wordmark entra "com precisão" — linha de medida, máscara e cruzes de registro. */
export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const line = ramp(frame, 0, 16, [0, 1], Easing.inOut(Easing.cubic));
  const tag = useEnter(40);
  const drift = 1 + frame * 0.0006;

  const big: React.CSSProperties = {
    fontFamily: SANS,
    fontWeight: 800,
    fontSize: 156,
    lineHeight: 0.95,
    letterSpacing: "-0.055em",
    color: C.ink,
  };

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", transform: `scale(${drift})` }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <MaskRise delay={8} style={big}>
          OPUS
        </MaskRise>
        <MaskRise delay={14} style={big}>
          SOFTWORKS
        </MaskRise>

        {/* Linha de medida com cruzes nas pontas */}
        <div style={{ position: "relative", width: 900, height: 40, marginTop: 30 }}>
          <div
            style={{
              position: "absolute",
              top: 19,
              left: `${50 - line * 50}%`,
              width: `${line * 100}%`,
              height: 3,
              backgroundColor: C.orange,
            }}
          />
          {[0, 1].map((side) => (
            <svg
              key={side}
              width={40}
              height={40}
              viewBox="0 0 40 40"
              style={{ position: "absolute", top: 0, [side ? "right" : "left"]: -20, opacity: ramp(frame, 14, 22) }}
            >
              <path d="M20 4 L20 36 M4 20 L36 20" stroke={C.ink} strokeWidth={2.5} />
            </svg>
          ))}
        </div>

        <div
          style={{
            marginTop: 34,
            fontFamily: SANS,
            fontWeight: 500,
            fontSize: 28,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: C.muted,
            ...blurIn(tag, 14, 8),
          }}
        >
          Estratégia · Tecnologia · IA
        </div>
      </div>
    </AbsoluteFill>
  );
};
