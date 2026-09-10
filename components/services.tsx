import Spotlight from "@/components/spotlight";
import ServiceCard from "@/components/service-card";

const services = [
  {
    tag: "Tráfego pago",
    title: "Campanhas que trazem gente pronta pra comprar",
    description:
      "Campanhas em Google Ads e Meta Ads focadas em geração de leads e vendas, com acompanhamento constante de métricas.",
    accent: "violet" as const,
    icon: (
      <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />
    ),
  },
  {
    tag: "Sistemas de gestão",
    title: "Sua operação organizada em um só lugar",
    description:
      "Ferramentas sob medida para organizar vendas, estoque, financeiro e contratos em um só lugar.",
    accent: "emerald" as const,
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
    accent: "white" as const,
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
        <div className="pb-16 md:pb-24">
          {/* Section header */}
          <div
            className="mx-auto max-w-3xl pb-14 text-center md:pb-20"
            data-aos="fade-up"
          >
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-gray-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-gray-200/50">
              <span className="inline-flex bg-linear-to-r from-white to-gray-400 bg-clip-text text-transparent">
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
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.tag}
                tag={service.tag}
                title={service.title}
                description={service.description}
                icon={service.icon}
                accent={service.accent}
                index={index}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              />
            ))}
          </Spotlight>
        </div>
      </div>
    </section>
  );
}
