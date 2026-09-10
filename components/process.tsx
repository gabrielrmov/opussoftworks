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
    <section className="relative isolate" id="como-trabalhamos">
      <div
        className="pointer-events-none absolute -right-32 top-1/4 -z-10 h-[28rem] w-[28rem] rounded-full bg-emerald-500/25 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-16 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-24">
          {/* Section header */}
          <div
            className="mx-auto max-w-3xl pb-14 text-center md:pb-20"
            data-aos="fade-up"
          >
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-emerald-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-emerald-200/50">
              <span className="inline-flex bg-linear-to-r from-emerald-500 to-emerald-200 bg-clip-text text-transparent">
                Como funciona
              </span>
            </div>
            <h2 className="pb-4 font-nacelle text-3xl font-semibold tracking-tight text-gray-100 md:text-5xl">
              Do diagnóstico ao <span className="text-emerald-400">resultado</span>
            </h2>
            <p className="text-lg text-indigo-200/65">
              Quatro etapas. Cada uma termina em algo concreto na sua mão —
              não numa promessa pra próxima reunião.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative mx-auto max-w-2xl">
            <div
              className="pointer-events-none absolute left-[21px] top-3 bottom-3 w-px bg-linear-to-b from-emerald-500/50 via-emerald-500/15 to-transparent"
              aria-hidden="true"
            />
            <div className="space-y-10">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="group relative flex gap-5 sm:gap-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 130}
                >
                  <div className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-gray-950 font-nacelle text-base font-semibold text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-300 group-hover:shadow-[0_0_20px_-2px_rgba(52,211,153,0.7)]">
                    {index + 1}
                  </div>
                  <div className="flex-1 pb-1 pt-1.5">
                    <h3 className="mb-1.5 font-nacelle text-lg font-semibold text-gray-100">
                      {step.title}
                    </h3>
                    <p className="mb-3 text-indigo-200/65">
                      {step.description}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300 ring-1 ring-emerald-500/20">
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
