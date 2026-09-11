import KineticText from "@/components/ui/kinetic-text";

const steps = [
  {
    title: "Diagnóstico",
    description:
      "Mapeamos seu negócio, seu mercado e onde o dinheiro está sendo deixado na mesa — antes de propor qualquer coisa.",
    deliverable: "Relatório de oportunidades",
  },
  {
    title: "Plano de ação",
    description:
      "Cada frente ganha estratégia, prazo e responsável. Você sabe o que vai acontecer antes de acontecer.",
    deliverable: "Cronograma com responsáveis",
  },
  {
    title: "Execução",
    description:
      "Colocamos em prática com acompanhamento semanal — ajuste de rota acontece no meio do caminho, não só no fim.",
    deliverable: "Painel de acompanhamento",
  },
  {
    title: "Resultado",
    description:
      "Você recebe o que mudou, em número — não um relatório genérico de tarefas concluídas.",
    deliverable: "Relatório de resultado",
  },
];

export default function Process() {
  return (
    <section className="relative" id="como-trabalhamos">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-white/10 py-16 md:py-24">
          {/* Section header */}
          <div
            className="mx-auto max-w-3xl pb-14 text-center md:pb-20"
            data-aos="fade-up"
          >
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-silver-mist">
              Como funciona
            </div>
            <KineticText
              as="h2"
              className="pb-4 font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl"
              text="Do diagnóstico ao resultado"
            />
            <p className="text-lg text-silver-mist">
              Quatro etapas. Cada uma termina em algo concreto na sua mão —
              não numa promessa pra próxima reunião.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative mx-auto max-w-2xl">
            <div
              className="pointer-events-none absolute left-[21px] top-3 bottom-3 w-px bg-white/10"
              data-aos="fade-up"
              data-aos-duration={900}
              aria-hidden="true"
            />
            <div className="space-y-10">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="group relative flex gap-5 transition-transform duration-300 hover:translate-x-1.5 sm:gap-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 130}
                >
                  <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-liquid-abyss font-nacelle text-base font-medium text-platinum transition-all duration-300 group-hover:scale-110 group-hover:border-brand-indigo/40 group-hover:text-brand-indigo">
                    {index + 1}
                  </div>
                  <div className="flex-1 pb-1 pt-1.5">
                    <h3 className="mb-1.5 font-nacelle text-lg font-medium text-platinum">
                      {step.title}
                    </h3>
                    <p className="mb-3 text-silver-mist">
                      {step.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs font-medium text-liquid-mist transition-colors duration-300 group-hover:border-brand-indigo/40">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12.5 L9.5 17 L19 6" />
                      </svg>
                      {step.deliverable}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
