import KineticText from "@/components/ui/kinetic-text";

const pillars = [
  {
    label: "Tráfego pago",
    accentBg: "bg-brand-blue/15",
    accentText: "text-brand-blue",
    icon: (
      <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />
    ),
  },
  {
    label: "Sistemas de gestão",
    accentBg: "bg-brand-indigo/15",
    accentText: "text-brand-indigo",
    icon: (
      <>
        <rect x="3" y="3" width="7.5" height="7.5" rx="1.2" />
        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2" />
        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2" />
        <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.2" />
      </>
    ),
  },
  {
    label: "Sites para empresas",
    accentBg: "bg-brand-cyan/15",
    accentText: "text-brand-cyan",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
        <path d="M3 8.5 L21 8.5 M9 21 L15 21 M12 16.5 L12 21" />
      </>
    ),
  },
];

export default function About() {
  return (
    <section className="relative overflow-hidden" id="sobre">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-liquid-deep/40" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-white/10 py-16 md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
            <div data-aos="fade-right">
              <div className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-silver-mist">
                Sobre a ELEVION
              </div>
              <KineticText
                as="h2"
                className="mb-5 font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl"
                text="Um parceiro só, em vez de três fornecedores"
              />
              <div className="space-y-4 text-silver-mist">
                <p>
                  A ELEVION nasceu em Goiânia com uma constatação simples:
                  agência de tráfego, desenvolvedor e sistema de gestão
                  raramente falam a mesma língua — e quem paga o preço disso
                  é a empresa, no meio do fogo cruzado.
                </p>
                <p>
                  Por isso colocamos as três frentes debaixo do mesmo teto,
                  com um único ponto de contato. Você não gerencia
                  fornecedores — gerencia resultado.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl bg-liquid-kelp p-7 transition-shadow duration-500 hover:shadow-[0_25px_60px_-25px_rgba(91,94,245,0.35)] md:p-9"
              data-aos="fade-left"
              data-aos-delay={100}
            >
              <p className="mb-6 text-xs font-medium uppercase tracking-[0.12em] text-silver-mist">
                Tudo sob o mesmo teto
              </p>
              <div className="space-y-4">
                {pillars.map((pillar, index) => (
                  <div
                    key={pillar.label}
                    className="group flex items-center gap-4 rounded-xl p-2 transition-all duration-300 hover:translate-x-1 hover:bg-white/5"
                    data-aos="fade-up"
                    data-aos-delay={150 + index * 100}
                  >
                    <div className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 scale-150 rounded-full opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-80 ${pillar.accentBg}`}
                      />
                      <div
                        className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${pillar.accentBg} ${pillar.accentText}`}
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
                        {pillar.icon}
                      </svg>
                      </div>
                    </div>
                    <span className="font-nacelle font-medium text-platinum">
                      {pillar.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
