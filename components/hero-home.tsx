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
