export default function Cta() {
  return (
    <section className="relative" id="contato">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-16 md:py-24">
          <div className="rounded-2xl bg-liquid-deep px-6 py-16 text-center sm:px-12 md:py-[120px]">
            <div className="mx-auto max-w-3xl">
              <h2
                className="pb-5 font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl lg:text-6xl"
                data-aos="fade-up"
              >
                Pronto para parar de deixar{" "}
                <span className="text-lavender-phosphor">resultado</span> na
                mesa?
              </h2>
              <p
                className="mx-auto mb-8 max-w-xl text-lg text-silver-mist"
                data-aos="fade-up"
                data-aos-delay={100}
              >
                Diagnóstico gratuito, sem compromisso. Você decide se faz
                sentido depois de ver, na prática, onde dá pra melhorar.
              </p>
              <div
                className="mx-auto flex max-w-xs justify-center sm:max-w-none"
                data-aos="fade-up"
                data-aos-delay={400}
              >
                <a
                  className="bg-bioluminescent w-full rounded-md px-8 py-3.5 text-xs font-medium uppercase tracking-[0.1em] text-white transition-opacity hover:opacity-90 sm:w-auto"
                  href="mailto:SEU-EMAIL@elevion.com.br"
                >
                  Quero meu diagnóstico
                </a>
              </div>
              <p
                className="mt-6 text-xs uppercase tracking-[0.1em] text-slate-deep"
                data-aos="fade-up"
                data-aos-delay={500}
              >
                [SEU E-MAIL] · [SEU WHATSAPP]
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
