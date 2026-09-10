const pillars = [
  {
    label: "Tráfego pago",
    iconBg: "bg-violet-500/10 group-hover:bg-violet-500/20",
    iconText: "text-violet-400 group-hover:text-violet-300",
    icon: (
      <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />
    ),
  },
  {
    label: "Sistemas de gestão",
    iconBg: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
    iconText: "text-emerald-400 group-hover:text-emerald-300",
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
    iconBg: "bg-white/10 group-hover:bg-white/20",
    iconText: "text-gray-100 group-hover:text-white",
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
      <div
        className="pointer-events-none absolute -right-24 top-10 -z-10 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-16 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-24">
          <div className="grid gap-12 md:grid-cols-2 md:items-center md:gap-20">
            <div data-aos="fade-right">
              <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-emerald-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-emerald-200/50">
                <span className="inline-flex bg-linear-to-r from-emerald-500 to-emerald-200 bg-clip-text text-transparent">
                  Sobre a ELEVION
                </span>
              </div>
              <h2 className="mb-5 font-nacelle text-3xl font-semibold text-gray-100 md:text-4xl">
                Um parceiro só, em vez de três fornecedores
              </h2>
              <div className="space-y-4 text-indigo-200/65">
                <p>
                  A ELEVION nasceu em Goiânia com uma ideia simples: empresas
                  não deveriam precisar contratar uma agência de tráfego, um
                  desenvolvedor e um sistema de gestão separados — e ainda
                  torcer para que os três conversem entre si.
                </p>
                <p>
                  Unimos essas três frentes em um único processo, com um
                  único ponto de contato. Menos atrito, mais controle sobre o
                  que está sendo feito e por quê.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl border border-gray-800 bg-gray-900/40 p-7 md:p-9"
              data-aos="fade-left"
              data-aos-delay={100}
            >
              <p className="mb-6 text-sm font-medium uppercase tracking-wide text-gray-500">
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
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 ${pillar.iconBg} ${pillar.iconText}`}
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
                    <span className="font-nacelle font-semibold text-gray-100 transition-colors duration-300 group-hover:text-gray-50">
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
