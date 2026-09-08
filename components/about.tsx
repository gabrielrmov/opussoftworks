const pillars = [
  {
    label: "Tráfego pago",
    icon: (
      <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />
    ),
  },
  {
    label: "Sistemas de gestão",
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
    <section id="sobre">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center md:gap-16">
            <div>
              <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
                <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                  Sobre a ELEVION
                </span>
              </div>
              <h2 className="mb-4 font-nacelle text-3xl font-semibold text-gray-100 md:text-4xl">
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

            <div className="rounded-2xl border border-gray-800 bg-gray-900/40 p-6 md:p-8">
              <p className="mb-5 text-sm font-medium uppercase tracking-wide text-gray-500">
                O que fica sob o mesmo teto
              </p>
              <div className="space-y-4">
                {pillars.map((pillar) => (
                  <div key={pillar.label} className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
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
                    <span className="font-nacelle font-semibold text-gray-100">
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
