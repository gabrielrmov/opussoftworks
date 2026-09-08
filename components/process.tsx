const steps = [
  {
    title: "Diagnóstico",
    description:
      "Entendemos seu negócio, seu mercado e onde estão as maiores oportunidades.",
  },
  {
    title: "Plano de ação",
    description:
      "Definimos estratégia, prazos e responsáveis para cada frente do projeto.",
  },
  {
    title: "Execução",
    description:
      "Colocamos em prática com acompanhamento semanal e ajustes no caminho.",
  },
  {
    title: "Resultado",
    description:
      "Entregamos relatórios claros e ajustamos o que for preciso para melhorar.",
  },
];

export default function Process() {
  return (
    <section id="como-trabalhamos">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                Como funciona
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Do diagnóstico ao resultado
            </h2>
            <p className="text-lg text-indigo-200/65">
              Um processo simples de acompanhar, do primeiro dia ao relatório
              de resultado.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mx-auto grid max-w-sm gap-10 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-px bg-gray-800 lg:block"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <div key={step.title} className="relative text-center">
                <div className="relative z-10 mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-indigo-500 bg-gray-950 font-nacelle text-base font-semibold text-indigo-400">
                  {index + 1}
                </div>
                <h3 className="mb-2 font-nacelle text-[1.0625rem] font-semibold text-gray-200">
                  {step.title}
                </h3>
                <p className="text-sm text-indigo-200/65">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
