"use client";

import TrueFocus from "@/components/ui/true-focus";
import TiltedCard from "@/components/ui/tilted-card";

const pillars = [
  {
    number: "01",
    title: "Tráfego pago e aquisição",
    text: "Campanhas em Meta e Google guiadas por números que importam: custo por cliente, taxa de fechamento e retorno sobre o investimento. Lead não é resultado. ",
    emphasis: "Venda é.",
  },
  {
    number: "02",
    title: "Sistemas e automações",
    text: "Entendemos como a operação funciona, eliminamos tarefas repetitivas e centralizamos as informações que hoje estão espalhadas. ",
    emphasis: "Menos trabalho manual. Mais controle para decidir.",
  },
  {
    number: "03",
    title: "Sites que convertem",
    text: "Sites rápidos, claros e pensados para vender. Em poucos segundos, o visitante entende o que a empresa faz, por que escolher você e ",
    emphasis: "qual é o próximo passo.",
  },
];

export default function Pillars() {
  return (
    <section id="solucoes" className="mx-auto max-w-[960px] px-6 py-16 sm:px-11 sm:py-24">
      <style>{`
        .pillars-truefocus .focus-word {
          font-family: var(--font-intertight);
          font-size: clamp(1.75rem, 5vw, 2.75rem);
          font-weight: 600;
          letter-spacing: -0.02em;
          color: var(--color-landing-ink, #171717);
        }
      `}</style>
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-intertight text-xs font-medium uppercase tracking-[0.14em] text-landing-accent">
          Onde a ELEVION entra
        </p>
        <div className="pillars-truefocus mt-4 flex justify-center">
          <TrueFocus
            sentence="Tráfego Sistemas Sites"
            manualMode={false}
            blurAmount={4}
            borderColor="#165dfc"
            glowColor="rgba(22, 93, 252, 0.5)"
            animationDuration={0.6}
            pauseBetweenAnimations={1.2}
          />
        </div>
        <h2 className="mt-3 font-intertight text-2xl font-medium tracking-[-0.02em] text-landing-ink sm:text-[30px]">
          Três frentes, uma mesma estratégia.
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-landing-muted sm:text-[15px]">
          Raramente o problema é só um. Quase sempre é aquisição, operação e
          presença digital puxando para lados diferentes. Trabalhamos nos
          três, na ordem que fizer sentido.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {pillars.map((p) => (
          <TiltedCard key={p.number} rotateAmplitude={8} scaleOnHover={1.03}>
            <div className="h-full rounded-2xl bg-landing-card p-6">
              <span className="font-intertight text-xs font-medium tracking-[0.1em] text-landing-accent">
                {p.number}
              </span>
              <h3 className="mt-3 font-intertight text-base font-medium text-landing-ink">
                {p.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-landing-muted">
                {p.text}
                <strong className="font-medium text-landing-ink">{p.emphasis}</strong>
              </p>
            </div>
          </TiltedCard>
        ))}
      </div>
    </section>
  );
}
