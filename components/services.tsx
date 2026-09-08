import Spotlight from "@/components/spotlight";

const services = [
  {
    tag: "Tráfego pago",
    title: "Campanhas que trazem gente pronta pra comprar",
    description:
      "Campanhas em Google Ads e Meta Ads focadas em geração de leads e vendas, com acompanhamento constante de métricas.",
    icon: (
      <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />
    ),
  },
  {
    tag: "Sistemas de gestão",
    title: "Sua operação organizada em um só lugar",
    description:
      "Ferramentas sob medida para organizar vendas, estoque, financeiro e contratos em um só lugar.",
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
    tag: "Sites para empresas",
    title: "Um site que converte visita em cliente",
    description:
      "Sites institucionais e comerciais rápidos, profissionais e prontos para converter visitantes em clientes.",
    icon: (
      <>
        <rect x="3" y="4.5" width="18" height="12" rx="1.5" />
        <path d="M3 8.5 L21 8.5 M9 21 L15 21 M12 16.5 L12 21" />
      </>
    ),
  },
];

export default function Services() {
  return (
    <section id="servicos">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="pb-12 md:pb-20">
          {/* Section header */}
          <div className="mx-auto max-w-3xl pb-12 text-center md:pb-20">
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">
              <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">
                O que fazemos
              </span>
            </div>
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">
              Três frentes, um objetivo
            </h2>
            <p className="text-lg text-indigo-200/65">
              Fazer sua empresa vender mais e operar melhor — com tráfego,
              gestão e presença digital trabalhando juntos.
            </p>
          </div>
          {/* Spotlight items */}
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">
            {services.map((service) => (
              <a
                key={service.tag}
                className="group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80 before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500 after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64 after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500 hover:after:opacity-20 group-hover:before:opacity-100"
                href="#contato"
              >
                <div className="relative z-20 flex h-full flex-col overflow-hidden rounded-[inherit] bg-gray-950 p-6 after:absolute after:inset-0 after:-z-10 after:bg-linear-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {service.icon}
                    </svg>
                  </div>
                  <span className="mb-3 inline-flex w-fit rounded-full bg-gray-800/60 px-2.5 py-0.5 text-xs font-medium text-indigo-300">
                    {service.tag}
                  </span>
                  <h3 className="mb-2 font-nacelle text-lg font-semibold text-gray-100">
                    {service.title}
                  </h3>
                  <p className="text-indigo-200/65">{service.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-400 transition-opacity group-hover/card:opacity-80">
                    Saiba mais
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
                  </span>
                </div>
              </a>
            ))}
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
