import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { C, SANS } from "../theme";

const STEPS = ["Diagnóstico", "Estratégia", "Implementação", "Otimização"];
// Ritmo crescente: intervalos de 46 → 34 → 26 frames entre etapas.
const ACTIVATE = [18, 64, 98, 124];
const ROW = 210;

export const Method: React.FC = () => {
  const frame = useCurrentFrame();
  const head = useEnter(4);
  const rail = interpolate(frame, ACTIVATE, [0, 1, 2, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const percent = Math.round(
    interpolate(frame, [ACTIVATE[0], ACTIVATE[3] + 20], [0, 100], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  return (
    <AbsoluteFill style={{ padding: "300px 90px 0" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: SANS,
          ...blurIn(head, 20, 8),
        }}
      >
        <span style={{ fontSize: 28, fontWeight: 500, letterSpacing: "0.22em", textTransform: "uppercase", color: C.orange }}>
          Método
        </span>
        <span style={{ fontSize: 40, fontWeight: 600, fontVariantNumeric: "tabular-nums", color: C.ink }}>{percent}%</span>
      </div>

      <div style={{ position: "relative", marginTop: 110 }}>
        {/* Trilho de progresso */}
        <div style={{ position: "absolute", left: 22, top: 30, width: 4, height: ROW * 3, backgroundColor: "rgba(0,0,0,0.08)" }} />
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 30,
            width: 4,
            height: (ROW * 3 * rail) / 3,
            backgroundColor: C.orange,
          }}
        />
        {STEPS.map((step, i) => (
          <Step key={step} label={step} index={i} at={ACTIVATE[i]} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Step: React.FC<{ label: string; index: number; at: number }> = ({ label, index, at }) => {
  const frame = useCurrentFrame();
  const appear = useEnter(at - 14);
  const active = ramp(frame, at, at + 8);
  const next = index < 3 ? ramp(frame, ACTIVATE[index + 1], ACTIVATE[index + 1] + 8) : 0;
  return (
    <div
      style={{
        position: "absolute",
        top: index * ROW,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        gap: 50,
        fontFamily: SANS,
        ...blurIn(appear, 40, 10),
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          flexShrink: 0,
          backgroundColor: active > 0.5 ? C.orange : C.paper,
          border: `4px solid ${active > 0.5 ? C.orange : "rgba(0,0,0,0.15)"}`,
          transform: `scale(${1 + (active - next) * 0.25})`,
        }}
      />
      <div>
        <div style={{ fontSize: 28, fontWeight: 500, color: active > 0.5 ? C.orange : C.muted }}>0{index + 1}</div>
        <div
          style={{
            fontSize: 92,
            fontWeight: 600,
            letterSpacing: "-0.055em",
            lineHeight: 1.02,
            color: C.ink,
            opacity: 0.22 + active * 0.78 - next * 0.35,
            transform: `translateX(${active * 12 - next * 12}px)`,
          }}
        >
          {label}
          {index < 3 && <span style={{ color: C.orange, opacity: active }}> →</span>}
        </div>
      </div>
    </div>
  );
};
