import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { ramp } from "../anim";
import { C, SANS } from "../theme";
import { MaskRise } from "./shared";

const LINES: { text: string; accent?: boolean }[] = [
  { text: "Venda mais." },
  { text: "Opere melhor." },
  { text: "Cresça com clareza.", accent: true },
];

// Curva de progresso discreta que se desenha ao fundo.
const CURVE = "M 90 1640 C 300 1620, 420 1560, 560 1500 S 860 1330, 990 1240";
const CURVE_LEN = 1100;

export const Outcome: React.FC = () => {
  const frame = useCurrentFrame();
  const draw = ramp(frame, 6, 120, [0, 1], Easing.inOut(Easing.quad));

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={CURVE} fill="none" stroke={C.ink} strokeOpacity={0.12} strokeWidth={4} />
        <path
          d={CURVE}
          fill="none"
          stroke={C.orange}
          strokeWidth={5}
          strokeLinecap="round"
          strokeDasharray={CURVE_LEN}
          strokeDashoffset={CURVE_LEN * (1 - draw)}
        />
      </svg>

      <AbsoluteFill style={{ justifyContent: "center", padding: "0 90px 220px" }}>
        {LINES.map((line, i) => (
          <div
            key={line.text}
            style={{
              fontFamily: SANS,
              fontWeight: 600,
              fontSize: 112,
              lineHeight: 1.08,
              letterSpacing: "-0.058em",
              color: line.accent ? C.orange : C.ink,
            }}
          >
            <MaskRise delay={10 + i * 22}>{line.text}</MaskRise>
          </div>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
