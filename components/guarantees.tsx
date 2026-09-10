const guarantees = [
  {
    title: "Diagnóstico sem compromisso",
    description:
      "Você recebe uma análise real do seu negócio antes de decidir se fecha com a gente — sem pressão.",
    accent: "violet" as const,
    icon: (
      <>
        <path d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z" />
        <path d="M8.5 12 L11 14.5 L16 9" />
      </>
    ),
  },
  {
    title: "Escopo e prazo no contrato",
    description:
      "O que será feito, quando e por quem fica definido por escrito antes de qualquer trabalho começar.",
    accent: "emerald" as const,
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M8 8 L16 8 M8 12 L16 12 M8 16 L12.5 16" />
      </>
    ),
  },
  {
    title: "Contato direto com quem executa",
    description:
      "Sem camadas de atendimento no meio do caminho — você fala com quem está de fato tocando o seu projeto.",
    accent: "white" as const,
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20 C3 15.5 5.5 13 9 13 C12.5 13 15 15.5 15 20" />
        <path d="M16 4.5 C17.5 5.3 18.5 6.8 18.5 8.5 C18.5 10.2 17.5 11.7 16 12.5" />
        <path d="M18 14 C20 14.8 21 16.8 21 19.5" />
      </>
    ),
  },
];

const accentStyles = {
  violet: "bg-violet-500/10 text-violet-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  white: "bg-white/10 text-gray-100",
};

export default function Guarantees() {
  return (
    <section className="relative" id="garantias">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-16 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-24">
          {/* Section header */}
          <div
            className="mx-auto max-w-3xl pb-14 text-center md:pb-16"
            data-aos="fade-up"
          >
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-gray-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-gray-200/50">
              <span className="inline-flex bg-linear-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent">
                Garantias
              </span>
            </div>
            <h2 className="font-nacelle text-3xl font-semibold text-gray-100 md:text-4xl">
              Compromissos que você pode cobrar da gente
            </h2>
          </div>

          {/* Items */}
          <div className="mx-auto grid max-w-sm gap-8 rounded-2xl border border-gray-800 bg-gray-900/30 p-6 shadow-xl shadow-black/20 sm:max-w-none sm:grid-cols-3 md:p-10">
            {guarantees.map((item, index) => (
              <div
                key={item.title}
                className="flex flex-col items-start gap-3"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-white/5 ${accentStyles[item.accent]}`}
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {item.icon}
                  </svg>
                </div>
                <h3 className="font-nacelle text-base font-semibold text-gray-100">
                  {item.title}
                </h3>
                <p className="text-sm text-indigo-200/65">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
