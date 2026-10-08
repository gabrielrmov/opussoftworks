import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { blurIn, ramp, useEnter } from "../anim";
import { DotPaper, Eyebrow } from "../components";
import { C, SANS } from "../theme";

// Copy dos cards do site, na íntegra.
const CARDS = [
  {
    n: "01",
    title: "Tráfego pago e aquisição",
    body: "Campanhas em Meta e Google guiadas por números que importam: custo por cliente, taxa de fechamento e retorno sobre o investimento.",
    punch: "Lead não é resultado. Venda é.",
  },
  {
    n: "02",
    title: "Sistemas e automações",
    body: "Entendemos como a operação funciona, eliminamos tarefas repetitivas e centralizamos as informações que hoje estão espalhadas.",
    punch: "Menos trabalho manual. Mais controle para decidir.",
  },
  {
    n: "03",
    title: "Sites que convertem",
    body: "Sites rápidos, claros e pensados para vender. Em poucos segundos, o visitante entende o que a empresa faz, por que escolher você e",
    punch: "qual é o próximo passo.",
  },
];

const EVERY = 148; // frames por card
const PEEK = 74; // quanto cada card anterior aparece acima do atual

export const Solutions: React.FC = () => {
  const frame = useCurrentFrame();
  const eyebrow = useEnter(6);

  return (
    <DotPaper>
      <AbsoluteFill style={{ padding: "330px 60px 0" }}>
        <Eyebrow style={blurIn(eyebrow, 16, 6)}>Soluções</Eyebrow>

        <div style={{ position: "relative", marginTop: 60 + PEEK * 2 }}>
          {CARDS.map((card, i) => {
            const start = 14 + i * EVERY;
            const enter = ramp(frame, start, start + 34, [0, 1], Easing.out(Easing.exp));
            // Quantos cards chegaram depois deste (0..2), suavizado.
            const depth = CARDS.slice(i + 1).reduce(
              (acc, _, j) => acc + ramp(frame, 14 + (i + 1 + j) * EVERY, 14 + (i + 1 + j) * EVERY + 34, [0, 1], Easing.out(Easing.exp)),
              0,
            );
            return (
              <div
                key={card.n}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  zIndex: i,
                  transformOrigin: "top center",
                  transform: `translateY(${(1 - enter) * 900 - depth * PEEK}px) scale(${1 - depth * 0.05})`,
                  opacity: interpolate(enter, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
                  filter: `brightness(${1 - depth * 0.04})`,
                }}
              >
                <SolutionCard {...card} start={start} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </DotPaper>
  );
};

const SolutionCard: React.FC<(typeof CARDS)[number] & { start: number }> = ({ n, title, body, punch, start }) => {
  const frame = useCurrentFrame();
  const highlight = ramp(frame, start + 50, start + 90, [0, 1], Easing.inOut(Easing.cubic));
  return (
    <div
      style={{
        backgroundColor: C.card,
        borderRadius: 44,
        padding: "64px 60px 72px",
        minHeight: 840,
        boxShadow: "0 -10px 40px rgba(0,0,0,0.05)",
        border: `1px solid ${C.border}`,
        fontFamily: SANS,
      }}
    >
      <div style={{ fontSize: 40, fontWeight: 500, color: C.orange }}>{n}</div>
      <div style={{ marginTop: 40, fontSize: 76, fontWeight: 600, letterSpacing: "-0.045em", lineHeight: 1.05, color: C.ink }}>
        {title}
      </div>
      <p style={{ margin: "44px 0 0", fontSize: 46, lineHeight: 1.45, letterSpacing: "-0.015em", color: C.muted }}>
        {body}{" "}
        <span
          style={{
            fontWeight: 600,
            color: C.ink,
            backgroundImage: `linear-gradient(rgba(255,96,57,0.22), rgba(255,96,57,0.22))`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${highlight * 100}% 100%`,
            boxDecorationBreak: "clone",
            WebkitBoxDecorationBreak: "clone",
            borderRadius: 6,
          }}
        >
          {punch}
        </span>
      </p>
    </div>
  );
};
