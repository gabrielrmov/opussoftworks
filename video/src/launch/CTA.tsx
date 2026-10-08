import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { Arrow, Wordmark } from "../components";
import { C, SANS } from "../theme";
import { MaskRise } from "./shared";

/** 28–30s: são só 2 segundos — tudo entra até ~0,8s e segura. */
export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const logo = useEnter(2);
  const btn = useEnter(14, 16);
  const fill = ramp(frame, 26, 38, [0, 1], Easing.inOut(Easing.cubic));
  const url = useEnter(22);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 60px" }}>
      <div style={blurIn(logo, 16, 10)}>
        <Wordmark size={72} />
      </div>
      <div
        style={{
          marginTop: 90,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 118,
          lineHeight: 1.0,
          letterSpacing: "-0.065em",
          color: C.ink,
        }}
      >
        <div>
          <MaskRise delay={4}>Vamos elevar o</MaskRise>
        </div>
        <div>
          <MaskRise delay={9}>próximo passo?</MaskRise>
        </div>
      </div>
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          marginTop: 80,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "36px 58px",
          borderRadius: 999,
          backgroundColor: C.ink,
          color: C.white,
          fontFamily: SANS,
          fontWeight: 500,
          fontSize: 40,
          ...blurIn(btn, 30, 8),
        }}
      >
        <span style={{ position: "absolute", inset: 0, backgroundColor: C.orange, transformOrigin: "left", transform: `scaleX(${fill})` }} />
        <span style={{ position: "relative", display: "flex", alignItems: "center", gap: 14 }}>
          Falar com um especialista <Arrow size={34} />
        </span>
      </div>
      <div style={{ marginTop: 44, fontFamily: SANS, fontWeight: 500, fontSize: 36, color: C.muted, ...blurIn(url, 16, 6) }}>
        opussoftworks.com.br
      </div>
    </AbsoluteFill>
  );
};
