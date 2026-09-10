const principles = [
  {
    title: "Entrega",
    description:
      "Prazo combinado é prazo cumprido. Cada etapa tem data e responsável — se atrasar, você sabe antes de perguntar.",
    icon: (
      <>
        <path d="M12 3 L21 7.5 L21 16.5 L12 21 L3 16.5 L3 7.5 Z" />
        <path d="M3 7.5 L12 12 L21 7.5" />
        <path d="M12 12 L12 21" />
      </>
    ),
  },
  {
    title: "Responsabilidade",
    description:
      "Sem terceirizar seu projeto pra quem você nunca falou. Quem assina o contrato é quem responde pelo que sai errado.",
    icon: (
      <>
        <path d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z" />
        <path d="M8.5 12 L11 14.5 L16 9" />
      </>
    ),
  },
  {
    title: "Assertividade",
    description:
      "Achismo não entra em relatório. Toda decisão de campanha, sistema ou site parte de dado — e é revisada quando o dado muda.",
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      </>
    ),
  },
];

export default function Principles() {
  return (
    <section className="relative isolate" id="principios">
      <div
        className="pointer-events-none absolute -left-32 top-1/3 -z-10 h-[32rem] w-[32rem] rounded-full bg-violet-500/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-16 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-24">
          {/* Section header */}
          <div
            className="mx-auto max-w-3xl pb-14 text-center md:pb-20"
            data-aos="fade-up"
          >
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-violet-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-violet-200/50">
              <span className="inline-flex bg-linear-to-r from-violet-500 to-violet-200 bg-clip-text text-transparent">
                Nossos princípios
              </span>
            </div>
            <h2 className="pb-4 font-nacelle text-3xl font-semibold tracking-tight text-gray-100 md:text-5xl">
              As bases de cada <span className="text-violet-400">entrega</span>
            </h2>
            <p className="text-lg text-indigo-200/65">
              Não são valores de parede. São o que você pode cobrar da gente
              se o projeto sair do combinado.
            </p>
          </div>
          {/* Items */}
          <div className="mx-auto grid max-w-sm gap-14 sm:max-w-none sm:grid-cols-3 md:gap-x-14">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="group rounded-2xl p-2 transition-transform duration-300 hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 ring-1 ring-white/5 transition-all duration-300 group-hover:scale-110 group-hover:bg-violet-500/20 group-hover:text-violet-300 group-hover:shadow-[0_0_24px_-4px_rgba(167,139,250,0.6)]">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {principle.icon}
                    </svg>
                  </div>
                  <span className="font-nacelle text-sm font-semibold tracking-widest text-gray-700">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mb-1 font-nacelle text-[1.0625rem] font-semibold text-gray-200">
                  {principle.title}
                </h3>
                <p className="text-indigo-200/65">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
