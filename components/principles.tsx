import KineticText from "@/components/ui/kinetic-text";

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
    <section className="relative" id="principios">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-white/10 py-16 md:py-24">
          {/* Section header */}
          <div
            className="mx-auto max-w-3xl pb-14 text-center md:pb-20"
            data-aos="fade-up"
          >
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-silver-mist">
              Nossos princípios
            </div>
            <KineticText
              as="h2"
              className="pb-4 font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl"
              text="As bases de cada entrega"
            />
            <p className="text-lg text-silver-mist">
              Não são valores de parede. São o que você pode cobrar da gente
              se o projeto sair do combinado.
            </p>
          </div>
          {/* Items */}
          <div className="mx-auto grid max-w-sm gap-14 sm:max-w-none sm:grid-cols-3 md:gap-x-14">
            {principles.map((principle, index) => (
              <article
                key={principle.title}
                className="group rounded-2xl p-2 transition-all duration-300 hover:-translate-y-1.5"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="relative">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 scale-150 rounded-full bg-liquid-mist opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-40"
                    />
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-liquid-kelp text-liquid-mist transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
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
                  </div>
                  <span className="font-nacelle text-sm font-medium tracking-widest text-slate-deep transition-colors duration-300 group-hover:text-liquid-mist">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="mb-1 font-nacelle text-[1.0625rem] font-medium text-platinum transition-transform duration-300 group-hover:translate-x-1">
                  {principle.title}
                </h3>
                <p className="text-silver-mist">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
