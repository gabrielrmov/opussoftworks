export default function Cta() {
  return (
    <section className="relative overflow-hidden" id="contato">
      <div
        className="pointer-events-none absolute -left-16 -top-10 -z-10 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-10 -right-16 -z-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-violet-200),var(--color-gray-50),var(--color-emerald-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl"
              data-aos="fade-up"
            >
              Pronto para parar de deixar resultado na mesa?
            </h2>
            <p
              className="mx-auto mb-8 max-w-xl text-lg text-indigo-200/65"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              Fale com a ELEVION e receba um diagnóstico gratuito da sua
              presença digital e da sua operação.
            </p>
            <div className="mx-auto max-w-xs sm:flex sm:max-w-none sm:justify-center">
              <div data-aos="fade-up" data-aos-delay={400}>
                <a
                  className="btn group mb-4 w-full bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] hover:shadow-[0_0_28px_-4px_rgba(255,255,255,0.35)] sm:mb-0 sm:w-auto"
                  href="mailto:SEU-EMAIL@elevion.com.br"
                >
                  <span className="relative inline-flex items-center">
                    Quero meu diagnóstico
                    <span className="ml-1 tracking-normal text-white/50 transition-transform group-hover:translate-x-0.5">
                      -&gt;
                    </span>
                  </span>
                </a>
              </div>
            </div>
            <p
              className="mt-6 text-sm text-indigo-200/40"
              data-aos="fade-up"
              data-aos-delay={500}
            >
              [SEU E-MAIL] · [SEU WHATSAPP]
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
