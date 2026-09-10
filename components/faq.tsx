const faqs = [
  {
    question: "Quanto tempo leva um projeto?",
    answer:
      "Depende do escopo. No diagnóstico inicial definimos prazo e checkpoints claros — sem promessas vagas de 'logo logo'.",
  },
  {
    question: "Dá pra contratar só um serviço, sem ser o pacote completo?",
    answer:
      "Sim. Você pode contratar tráfego pago, sistema de gestão ou site separadamente, ou combinar os três — o que fizer sentido para o momento da sua empresa.",
  },
  {
    question: "Que tipo de empresa a ELEVION atende?",
    answer:
      "De pequenos negócios a empresas em expansão que querem organizar a operação, gerar mais leads ou ter uma presença digital que realmente converte.",
  },
  {
    question: "Como funciona o contrato e o pagamento?",
    answer:
      "Escopo, prazo e valores são definidos e combinados antes de qualquer trabalho começar — sem letra miúda. Condições de pagamento são tratadas caso a caso no diagnóstico.",
  },
  {
    question: "Como eu começo?",
    answer:
      "Solicite o diagnóstico gratuito. A gente entra em contato para entender seu negócio antes de montar qualquer proposta.",
  },
];

export default function Faq() {
  return (
    <section id="faq">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-16">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-gray-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-gray-200/50">
              <span className="inline-flex bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Perguntas frequentes
              </span>
            </div>
            <h2 className="font-nacelle text-3xl font-semibold text-gray-100 md:text-4xl">
              Antes de você perguntar
            </h2>
          </div>

          <div className="mx-auto max-w-3xl divide-y divide-gray-800 rounded-2xl border border-gray-800">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-5 md:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-nacelle text-[1.0625rem] font-semibold text-gray-100 marker:content-none">
                  {faq.question}
                  <svg
                    className="shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-45"
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
                <p className="mt-3 text-indigo-200/65">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
