import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { ramp, rise, useEnter } from "../anim";
import { Eyebrow, Wordmark } from "../components";
import { C, FONT_DISPLAY, FONT_UI } from "../theme";

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useEnter(8, 14);
  const eyebrow = useEnter(30);
  const l1 = useEnter(52);
  const l2 = useEnter(64);
  const btn = useEnter(96, 14);
  const sub = useEnter(116);
  const url = useEnter(136);
  const underline = ramp(frame, 150, 185, [0, 1], Easing.inOut(Easing.cubic));
  // Brilho que atravessa o botão em loop.
  const shine = interpolate((frame - 120) % 110, [0, 50], [-130, 130], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.max(0, Math.sin((frame - 120) / 14)) * 0.018 * (frame > 120 ? 1 : 0);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 80px", textAlign: "center" }}>
      <div style={{ opacity: logo, transform: `scale(${0.85 + logo * 0.15})` }}>
        <Wordmark size={112} />
      </div>
      <Eyebrow style={{ ...rise(eyebrow, 20), marginTop: 36 }}>Tráfego · Gestão · Sites</Eyebrow>

      <div
        style={{
          marginTop: 110,
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 76,
          lineHeight: 1.1,
          letterSpacing: "-0.035em",
        }}
      >
        <div style={{ ...rise(l1, 40), color: C.ash, fontWeight: 500 }}>Resultado não é sorte.</div>
        <div style={{ ...rise(l2, 40), color: C.ivory }}>É entrega.</div>
      </div>

      <div
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 90,
          padding: "40px 64px",
          borderRadius: 999,
          backgroundColor: C.cobalt,
          fontFamily: FONT_UI,
          fontWeight: 600,
          fontSize: 32,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: C.white,
          boxShadow: "0 20px 80px rgba(82,102,235,0.5)",
          opacity: btn,
          transform: `translateY(${(1 - btn) * 40}px) scale(${(0.9 + btn * 0.1) * pulse})`,
        }}
      >
        Diagnóstico gratuito
        <span
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: "40%",
            marginLeft: "-20%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            transform: `translateX(${shine}%) skewX(-18deg)`,
          }}
        />
      </div>

      <div style={{ ...rise(sub, 20), marginTop: 30, fontFamily: FONT_UI, fontSize: 30, color: C.ash }}>
        Sem compromisso · Resposta em poucas horas
      </div>

      <div style={{ ...rise(url, 30), marginTop: 100, position: "relative" }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 64, letterSpacing: "-0.02em", color: C.ivory }}>
          opussoftworks.com.br
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: -14,
            height: 6,
            width: `${underline * 100}%`,
            borderRadius: 3,
            backgroundColor: C.cobalt,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
