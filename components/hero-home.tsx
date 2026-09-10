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
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-indigo-300"
              data-aos="fade-up"
            >
              Tráfego · Gestão · Sites
            </div>
            <h1
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-5 font-nacelle text-4xl font-semibold text-transparent md:text-5xl"
              data-aos="fade-up"
            >
              Resultado não é sorte. É entrega.
            </h1>
            <div className="mx-auto max-w-3xl">
              <p
                className="mb-8 text-xl text-indigo-200/65"
                data-aos="fade-up"
                data-aos-delay={200}
              >
                Tráfego pago, sistemas de gestão e sites profissionais em um
                único processo — para empresas que querem crescer com
                responsabilidade e prazo cumprido.
              </p>
              <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
                <div data-aos="fade-up" data-aos-delay={400}>
                  <a
                    className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] sm:mb-0 sm:w-auto"
                    href="#contato"
                  >
                    <span className="relative inline-flex items-center">
                      Solicitar diagnóstico gratuito
                      <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                        -&gt;
                      </span>
                    </span>
                  </a>
                </div>
                <div data-aos="fade-up" data-aos-delay={600}>
                  <a
                    className="btn w-full border border-gray-700 bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] text-gray-300 hover:border-gray-600 hover:bg-[length:100%_150%] sm:ml-4 sm:w-auto"
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
            <div
              className="pointer-events-none absolute -left-10 -top-10 -z-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-10 -right-10 -z-10 h-40 w-40 rounded-full bg-emerald-500/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="rounded-2xl border border-gray-800 bg-gray-900/50 p-4 shadow-2xl shadow-black/40 backdrop-blur-md md:p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Tráfego pago: mini bar chart */}
                <div
                  className="animate-float rounded-xl border border-gray-800 bg-gray-950/60 p-4"
                  style={{ animationDelay: "0s" }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
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
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Tráfego pago
                    </span>
                  </div>
                  <div className="flex h-14 items-end gap-1.5">
                    {[38, 62, 48, 80, 58].map((h, i) => (
                      <div
                        key={i}
                        className="animate-grow-bar w-full origin-bottom rounded-t-sm bg-violet-500/60"
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
                  className="animate-float rounded-xl border border-gray-800 bg-gray-950/60 p-4"
                  style={{ animationDelay: "0.6s" }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
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
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Gestão
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {[100, 80, 60].map((w, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span
                          className="animate-pulse-soft h-3.5 w-3.5 shrink-0 rounded-full bg-emerald-500/70"
                          style={{ animationDelay: `${i * 0.3}s` }}
                        />
                        <span
                          className="h-2 rounded-full bg-gray-700/70"
                          style={{ width: `${w}%` }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sites: mini browser mockup */}
                <div
                  className="animate-float rounded-xl border border-gray-800 bg-gray-950/60 p-4"
                  style={{ animationDelay: "1.2s" }}
                >
                  <div className="mb-4 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-gray-100">
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
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Site
                    </span>
                  </div>
                  <div className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/60">
                    <div className="flex items-center gap-1 border-b border-gray-800 px-2 py-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-700" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-700" />
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-700" />
                    </div>
                    <div className="space-y-1.5 p-2.5">
                      <span className="block h-2 w-3/4 rounded-full bg-white/20" />
                      <span className="block h-2 w-full rounded-full bg-gray-700/70" />
                      <span className="block h-2 w-1/2 rounded-full bg-gray-700/70" />
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
                  className="text-indigo-400"
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
                <span className="text-sm font-medium uppercase tracking-wide text-gray-400">
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
