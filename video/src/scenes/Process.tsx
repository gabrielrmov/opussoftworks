import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { blurIn, useEnter } from "../anim";
import { DotPaper, Eyebrow } from "../components";
import { C, SANS } from "../theme";

const STEPS = [
  {
    title: "Diagnóstico",
    n: "01",
    lead: "Antes de propor, a gente entende.",
    body: "Mergulhamos na operação, nas metas, nos números e nos gargalos para identificar o que realmente precisa ser resolvido.",
  },
  {
    title: "Estratégia",
    n: "02",
    lead: "Prioridade antes de execução.",
    body: "Definimos o que atacar primeiro, onde investir e quais indicadores vão mostrar, na prática, se estamos no caminho certo.",
  },
];

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/\\[]{}()_-:;.";
const glyph = (seed: string) => GLYPHS[Math.floor(random(seed) * GLYPHS.length)];

const HEADLINE = "Clareza antes de velocidade.";

export const Process: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrow = useEnter(6);

  return (
    <DotPaper>
      <AsciiField />
      <AbsoluteFill style={{ padding: "330px 70px 0", textAlign: "center", alignItems: "center" }}>
        <Eyebrow style={blurIn(eyebrow, 16, 6)}>Como trabalhamos</Eyebrow>
        <h2
          style={{
            margin: "34px 0 0",
            fontFamily: SANS,
            fontWeight: 600,
            fontSize: 96,
            lineHeight: 1.04,
            letterSpacing: "-0.05em",
            color: C.ink,
            maxWidth: 900,
          }}
        >
          <Scramble text={HEADLINE} start={12} frame={frame} />
        </h2>

        <div style={{ marginTop: 80, display: "flex", flexDirection: "column", gap: 28, width: "100%", textAlign: "left" }}>
          {STEPS.map((step, i) => (
            <StepCard key={step.n} {...step} delay={70 + i * 34} />
          ))}
        </div>
      </AbsoluteFill>
    </DotPaper>
  );
};

/** Texto que "decodifica" de caracteres aleatórios pro texto final, como o fundo ASCII do site. */
const Scramble: React.FC<{ text: string; start: number; frame: number }> = ({ text, start, frame }) => {
  const tick = Math.floor(frame / 3);
  return (
    <>
      {text.split("").map((ch, i) => {
        const resolveAt = start + i * 1.6 + 10;
        if (ch === " " || frame >= resolveAt) return <span key={i}>{ch}</span>;
        if (frame < start + i * 0.8) return <span key={i} style={{ opacity: 0 }}>{ch}</span>;
        return (
          <span key={i} style={{ color: C.orange }}>
            {glyph(`h-${i}-${tick}`)}
          </span>
        );
      })}
    </>
  );
};

/** Faixa de caracteres que se embaralham — eco da seção "Como trabalhamos" do site. */
const AsciiField: React.FC = () => {
  const frame = useCurrentFrame();
  const tick = Math.floor(frame / 4);
  const rows = 30;
  const cols = 56;
  return (
    <AbsoluteFill
      style={{
        top: 760,
        fontFamily: SANS,
        fontSize: 26,
        lineHeight: "38px",
        letterSpacing: "0.22em",
        textAlign: "center",
        color: "#d4d4d4",
        whiteSpace: "pre",
        overflow: "hidden",
        maskImage: "linear-gradient(180deg, transparent, black 25%, black 70%, transparent)",
        WebkitMaskImage: "linear-gradient(180deg, transparent, black 25%, black 70%, transparent)",
      }}
    >
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r}>
          {Array.from({ length: cols })
            .map((__, c) => (random(`v-${r}-${c}`) < 0.55 ? glyph(`a-${r}-${c}-${tick + ((r * 7 + c) % 5)}`) : " "))
            .join("")}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const StepCard: React.FC<(typeof STEPS)[number] & { delay: number }> = ({ title, n, lead, body, delay }) => {
  const p = useEnter(delay, 18);
  return (
    <div
      style={{
        backgroundColor: C.white,
        border: `1px solid ${C.border}`,
        borderRadius: 36,
        padding: "48px 52px",
        fontFamily: SANS,
        boxShadow: "0 20px 50px rgba(0,0,0,0.06)",
        ...blurIn(p, 60, 10),
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
        <span style={{ fontSize: 44, fontWeight: 600, letterSpacing: "-0.035em", color: C.ink }}>{title}</span>
        <span style={{ fontSize: 30, fontWeight: 500, color: C.orange }}>{n}</span>
      </div>
      <div style={{ marginTop: 22, fontSize: 36, fontWeight: 500, color: C.ink }}>{lead}</div>
      <div style={{ marginTop: 14, fontSize: 32, lineHeight: 1.45, color: C.muted }}>{body}</div>
    </div>
  );
};
