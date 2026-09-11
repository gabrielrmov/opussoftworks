"use client";

export default function HeroHome() {
  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero content */}
        <div className="py-16 md:py-28">
          {/* Section header */}
          <div className="pb-10 text-center md:pb-14">
            <div
              className="mb-6 text-xs font-medium uppercase tracking-[0.15em] text-silver-mist"
              data-aos="fade-up"
            >
              Tráfego · Gestão · Sites
            </div>
            <h1
              className="pb-5 font-nacelle text-4xl font-medium tracking-tight text-platinum sm:text-5xl md:text-6xl lg:text-7xl"
              data-aos="fade-up"
            >
              Resultado não é sorte. É entrega.
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-silver-mist"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Uma operação só: tráfego que traz lead, sistema que organiza
                a venda, site que fecha negócio. Sem contratar três
                fornecedores e torcer pra eles conversarem entre si.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="bg-bioluminescent mb-4 flex w-full items-center justify-center gap-2 rounded-md px-7 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90 sm:mb-0 sm:w-auto"
                    href="#contato"
                  >
                    Solicitar diagnóstico gratuito
                  </a>
                </div>
                <div data-aos="fade-up" data-aos-delay={600}>
                  <a
                    className="flex w-full items-center justify-center rounded-md border border-white/15 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-silver-mist transition hover:border-white/30 hover:text-platinum sm:ml-4 sm:w-auto"
                    href="#servicos"
                  >
                    Ver serviços
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Visual: abstract preview of the 3 pillars working together */}
          <div
            className="relative mx-auto max-w-4xl"
            data-aos="zoom-in-up"
            data-aos-delay={300}
          >
            <div className="rounded-2xl bg-liquid-kelp p-4 md:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Tráfego pago: mini bar chart */}
                <div
                  className="animate-float rounded-xl bg-liquid-abyss/60 p-4"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-blue/15 text-brand-blue">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-silver-mist">
                      Tráfego pago
                    </span>
                  </div>
                  <div className="flex h-14 items-end gap-1.5">
                    {[38, 62, 48, 80, 58].map((h, i) => (
                      <div
                        key={i}
                        className="animate-grow-bar w-full origin-bottom rounded-t-sm bg-brand-blue/60"
                        style={{
                          height: `${h}%`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Sistemas de gestão: mini checklist */}
                <div
                  className="animate-float rounded-xl bg-liquid-abyss/60 p-4"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-indigo/15 text-brand-indigo">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="3" width="7.5" height="7.5" rx="1.2" />
                        <rect x="13.5" y="3" width="7.5" height="7.5" rx="1.2" />
                        <rect x="3" y="13.5" width="7.5" height="7.5" rx="1.2" />
                        <rect
                          x="13.5"
                          y="13.5"
                          width="7.5"
                          height="7.5"
                          rx="1.2"
                        />
                      </svg>
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-silver-mist">
                      Gestão
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {[100, 80, 60].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span
                          className="animate-pulse-soft h-3.5 w-3.5 shrink-0 rounded-full bg-brand-indigo/70"
                          style={{ animationDelay: `${i * 0.3}s` }}
                        />
                        <span
                          className="h-2 rounded-full bg-white/10"
                          style={{ width: `${w}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sites: mini browser mockup */}
                <div
                  className="animate-float rounded-xl bg-liquid-abyss/60 p-4"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-cyan/15 text-brand-cyan">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
                        <path d="M3 8.5 L21 8.5 M9 21 L15 21 M12 16.5 L12 21" />
                      </svg>
                    </div>
                    <span className="text-[11px] font-medium uppercase tracking-[0.1em] text-silver-mist">
                      Site
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg bg-liquid-deep/70">
                    <div className="flex items-center gap-1 px-2 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
                    </div>
                    <div className="space-y-1.5 p-2.5">
                      <span className="block h-2 w-3/4 rounded-full bg-white/20" />
                      <span className="block h-2 w-full rounded-full bg-white/10" />
                      <span className="block h-2 w-1/2 rounded-full bg-white/10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust badges */}
          <div
            className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6"
            data-aos="fade-up"
            data-aos-delay={200}
          >
            {[
              "Prazo cumprido",
              "Processo claro",
              "Resultado mensurável",
            ].map((label) => (
              <div key={label} className="flex items-center gap-2">
                <svg
                  className="text-liquid-mist"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12.5 L9.5 18 L20 6" />
                </svg>
                <span className="text-xs font-medium uppercase tracking-[0.1em] text-silver-mist">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
