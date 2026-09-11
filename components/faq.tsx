const faqs = [
  {
    question: "Quanto tempo leva um projeto?",
    answer:
      "Depende do escopo. No diagnóstico inicial definimos prazo e checkpoints claros — sem promessa vaga de 'logo logo'.",
  },
  {
    question: "Dá pra contratar só um serviço, sem ser o pacote completo?",
    answer:
      "Sim. Tráfego pago, sistema de gestão ou site — separado ou combinado, o que fizer sentido pro momento da sua empresa.",
  },
  {
    question: "Que tipo de empresa a ELEVION atende?",
    answer:
      "De pequenos negócios a empresas em expansão que precisam organizar a operação, gerar mais lead ou ter uma presença digital que converte de verdade.",
  },
  {
    question: "Como funciona o contrato e o pagamento?",
    answer:
      "Escopo, prazo e valor ficam definidos antes de qualquer trabalho começar — sem letra miúda. Forma de pagamento é tratada caso a caso no diagnóstico.",
  },
  {
    question: "Como eu começo?",
    answer:
      "Solicite o diagnóstico gratuito. A gente entende seu negócio antes de montar qualquer proposta — sem custo, sem compromisso.",
  },
];

export default function Faq() {
  return (
    <section id="faq">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-white/10 py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] md:gap-16">
            {/* Left: heading + mini-CTA */}
            <div data-aos="fade-right">
              <div className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-silver-mist">
                Perguntas frequentes
              </div>
              <h2 className="mb-4 font-nacelle text-3xl font-medium text-platinum md:text-4xl">
                Antes de você perguntar
              </h2>
              <p className="mb-6 text-silver-mist">
                Reunimos aqui o que mais perguntam antes de fechar. Não achou
                a sua?
              </p>
              <a
                className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-platinum transition-all hover:gap-2.5"
                href="#contato"
              >
                Fale direto com a gente
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12 L19 12" />
                  <path d="M13 6 L19 12 L13 18" />
                </svg>
              </a>
            </div>

            {/* Right: accordion */}
            <div className="divide-y divide-white/10 rounded-2xl bg-liquid-kelp/40">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group p-5 transition-colors duration-300 hover:bg-white/[0.03] md:p-6"
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-nacelle text-[1.0625rem] font-medium text-platinum marker:content-none">
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      {faq.question}
                    </span>
                    <svg
                      className="shrink-0 text-silver-mist transition-all duration-300 group-hover:text-liquid-mist group-open:rotate-45 group-open:text-liquid-mist"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <path d="M12 5 L12 19 M5 12 L19 12" />
                    </svg>
                  </summary>
                  <p className="mt-3 text-silver-mist">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
