import LetterGlitch from "@/components/ui/letter-glitch";
import GlitchText from "@/components/ui/glitch-text";

const steps = [
  {
    number: "01",
    title: "Diagnóstico",
    headline: "Antes de propor, a gente entende.",
    text: "Mergulhamos na operação, nas metas, nos números e nos gargalos para identificar o que realmente precisa ser resolvido.",
  },
  {
    number: "02",
    title: "Estratégia",
    headline: "Prioridade antes de execução.",
    text: "Definimos o que atacar primeiro, onde investir e quais indicadores vão mostrar, na prática, se estamos no caminho certo.",
  },
  {
    number: "03",
    title: "Implementação",
    headline: "Estratégia que sai do papel.",
    text: "Colocamos campanhas, sistemas e sites para funcionar de forma integrada, com processos claros, prazos definidos e acompanhamento em cada etapa.",
  },
  {
    number: "04",
    title: "Otimização contínua",
    headline: "O trabalho não termina no lançamento.",
    text: "Analisamos resultados, ajustamos estratégias e eliminamos o que não funciona. Porque crescimento consistente vem de evolução contínua.",
  },
];

export default function Process() {
  return (
    <section
      id="como-trabalhamos"
      className="relative overflow-hidden px-6 py-16 sm:px-11 sm:py-24"
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" aria-hidden="true">
        <LetterGlitch
          glitchColors={["#165dfc", "#7fa8ff", "#171717"]}
          glitchSpeed={60}
          smooth
          lightMode
          backgroundColor="transparent"
          outerVignette={false}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-[960px]">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-intertight text-xs font-medium uppercase tracking-[0.14em] text-landing-accent">
            Como trabalhamos
          </p>
          <h2 className="mt-3 font-intertight text-2xl font-medium tracking-[-0.02em] text-landing-ink sm:text-[30px]">
            <GlitchText speed={0.6} enableOnHover className="inline-block">
              Clareza antes de velocidade.
            </GlitchText>
          </h2>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-landing-ink/10 bg-landing-bg">
          <div className="grid sm:grid-cols-2">
            {steps.map((s, i) => (
              <div
                key={s.number}
                className={`p-6 sm:p-8 ${i % 2 === 0 ? "sm:border-r" : ""} ${
                  i < 2 ? "border-b" : ""
                } border-landing-ink/10`}
              >
                <div className="flex items-baseline gap-3">
                  <h3 className="font-intertight text-base font-medium text-landing-ink">
                    {s.title}
                  </h3>
                  <span className="font-intertight text-xs font-medium text-landing-accent">
                    {s.number}
                  </span>
                </div>
                <p className="mt-3 text-[13px] font-medium leading-relaxed text-landing-ink">
                  {s.headline}
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-landing-muted">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
