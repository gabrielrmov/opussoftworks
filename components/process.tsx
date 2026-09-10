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
    <section className="relative overflow-hidden" id="como-trabalhamos">
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
              Um processo simples de acompanhar, do primeiro dia ao relatório
              de resultado.
            </p>
          </div>

          {/* Steps */}
          <div className="relative mx-auto grid max-w-sm gap-12 sm:max-w-none sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            <div
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[22px] hidden h-px bg-linear-to-r from-transparent via-emerald-500/30 to-transparent lg:block"
              aria-hidden="true"
            />
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="group relative text-center transition-transform duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="relative z-10 mx-auto mb-5 flex h-11 w-11 items-center justify-center rounded-full border-2 border-emerald-500 bg-gray-950 font-nacelle text-base font-semibold text-emerald-400 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-400 group-hover:bg-emerald-500/10 group-hover:text-emerald-300 group-hover:shadow-[0_0_20px_-2px_rgba(52,211,153,0.7)]">
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
