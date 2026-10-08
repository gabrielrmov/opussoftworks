import { Easing, useCurrentFrame } from "remotion";
import { ramp, rise, useEnter } from "../anim";
import { Eyebrow } from "../components";
import { C, FONT_DISPLAY, FONT_UI } from "../theme";
import { AbsoluteFill } from "remotion";

const STEPS = [
  { title: "Diagnóstico", deliverable: "Relatório de oportunidades" },
  { title: "Plano de ação", deliverable: "Cronograma com responsáveis" },
  { title: "Execução", deliverable: "Acompanhamento semanal" },
  { title: "Resultado", deliverable: "O que mudou, em número" },
];

const FIRST = 50;
const GAP = 46;
const ROW_H = 220;

export const Process: React.FC = () => {
  const frame = useCurrentFrame();
  const head = useEnter(4);
  const title = useEnter(12);
  const line = ramp(frame, FIRST, FIRST + GAP * (STEPS.length - 1), [0, 1], Easing.inOut(Easing.quad));

  return (
    <AbsoluteFill style={{ padding: "250px 80px 0" }}>
      <Eyebrow style={rise(head, 20)}>Como funciona</Eyebrow>
      <div
        style={{
          marginTop: 34,
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 82,
          lineHeight: 1.06,
          letterSpacing: "-0.035em",
          color: C.ivory,
          ...rise(title, 50),
        }}
      >
        Do diagnóstico
        <br />
        ao resultado.
      </div>

      <div style={{ position: "relative", marginTop: 90 }}>
        <div
          style={{
            position: "absolute",
            left: 43,
            top: 44,
            width: 4,
            height: ROW_H * (STEPS.length - 1),
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 43,
            top: 44,
            width: 4,
            height: ROW_H * (STEPS.length - 1) * line,
            borderRadius: 2,
            backgroundColor: C.cobalt,
            boxShadow: `0 0 24px ${C.cobalt}`,
          }}
        />
        {STEPS.map((step, i) => (
          <Step key={step.title} n={i + 1} {...step} delay={FIRST + i * GAP} top={i * ROW_H} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const Step: React.FC<{ n: number; title: string; deliverable: string; delay: number; top: number }> = ({
  n,
  title,
  deliverable,
  delay,
  top,
}) => {
  const p = useEnter(delay, 14);
  const active = useEnter(delay, 200);
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", gap: 40 }}>
      <div
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_DISPLAY,
          fontWeight: 600,
          fontSize: 38,
          color: C.white,
          backgroundColor: active > 0.5 ? C.cobalt : C.button,
          border: `2px solid ${active > 0.5 ? C.cobalt : C.line}`,
          transform: `scale(${0.6 + p * 0.4})`,
          boxShadow: active > 0.5 ? `0 0 40px rgba(82,102,235,0.55)` : "none",
        }}
      >
        {n}
      </div>
      <div style={{ ...rise(p, 30), paddingTop: 6 }}>
        <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 58, letterSpacing: "-0.03em", color: C.ivory }}>
          {title}
        </div>
        <div
          style={{
            marginTop: 14,
            display: "inline-block",
            padding: "10px 22px",
            borderRadius: 999,
            border: `1px solid ${C.line}`,
            backgroundColor: C.card,
            fontFamily: FONT_UI,
            fontSize: 28,
            color: C.ash,
          }}
        >
          {deliverable}
        </div>
      </div>
    </div>
  );
};
