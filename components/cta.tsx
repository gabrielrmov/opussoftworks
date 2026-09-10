export default function Cta() {
  return (
    <section className="relative overflow-hidden" id="contato">
      <div
        className="pointer-events-none absolute -left-20 -top-16 -z-10 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-16 -right-20 -z-10 h-96 w-96 rounded-full bg-emerald-500/30 blur-3xl"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              className="pb-5 font-nacelle text-3xl font-semibold tracking-tight text-gray-100 md:text-5xl lg:text-6xl"
              data-aos="fade-up"
            >
              Pronto para parar de deixar{" "}
              <span className="bg-linear-to-r from-violet-400 to-emerald-400 bg-clip-text text-transparent">
                resultado
              </span>{" "}
              na mesa?
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
                  className="btn group mb-4 w-full scale-100 bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] px-6 py-3.5 text-base text-white shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16),0_0_32px_-6px_rgba(99,102,241,0.7)] transition-transform hover:scale-[1.03] hover:bg-[length:100%_150%] hover:shadow-[0_0_36px_-4px_rgba(255,255,255,0.4)] sm:mb-0 sm:w-auto"
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
