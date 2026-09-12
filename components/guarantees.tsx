import KineticText from "@/components/ui/kinetic-text";

const guarantees = [
  {
    title: "Diagnóstico sem compromisso",
    description:
      "Você recebe uma análise real do seu negócio antes de decidir se fecha com a gente — sem pressão.",
    icon: (
      <>
        <path d="M12 3 L20 6 V11 C20 16 16.5 19.5 12 21 C7.5 19.5 4 16 4 11 V6 Z" />
        <path d="M8.5 12 L11 14.5 L16 9" />
      </>
    ),
  },
  {
    title: "Escopo e prazo no contrato",
    description:
      "O que será feito, quando e por quem fica definido por escrito antes de qualquer trabalho começar.",
    icon: (
      <>
        <rect x="4" y="3" width="16" height="18" rx="1.5" />
        <path d="M8 8 L16 8 M8 12 L16 12 M8 16 L12.5 16" />
      </>
    ),
  },
  {
    title: "Contato direto com quem executa",
    description:
      "Nada de suporte terceirizado lendo script. Você fala com quem está de fato mexendo na sua campanha, sistema ou site.",
    icon: (
      <>
        <circle cx="9" cy="8" r="3.5" />
        <path d="M3 20 C3 15.5 5.5 13 9 13 C12.5 13 15 15.5 15 20" />
        <path d="M16 4.5 C17.5 5.3 18.5 6.8 18.5 8.5 C18.5 10.2 17.5 11.7 16 12.5" />
        <path d="M18 14 C20 14.8 21 16.8 21 19.5" />
      </>
    ),
  },
];

export default function Guarantees() {
  return (
    <section className="relative overflow-hidden" id="garantias">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-liquid-kelp/50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 bottom-10 -z-10 h-[380px] w-[380px] rounded-full bg-brand-cyan/10 blur-[110px]"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-white/10 py-16 md:py-24">
          {/* Section header */}
          <div
            className="mx-auto max-w-3xl pb-14 text-center md:pb-16"
            data-aos="fade-up"
          >
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-silver-mist">
              Garantias
            </div>
            <KineticText
              as="h2"
              className="font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl"
              text="Compromissos que você pode cobrar da gente"
            />
          </div>

          {/* Items */}
          <div className="mx-auto grid max-w-sm gap-6 sm:max-w-none sm:grid-cols-3">
            {guarantees.map((item, index) => (
              <div
                key={item.title}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.05]"
                data-aos="fade-up"
                data-aos-delay={index * 150}
              >
                <div className="relative">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-liquid-mist transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
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
                      {item.icon}
                    </svg>
                  </div>
                </div>
                <h3 className="font-nacelle text-base font-medium text-platinum transition-transform duration-300 group-hover:translate-x-1">
                  {item.title}
                </h3>
                <p className="text-sm text-silver-mist">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
