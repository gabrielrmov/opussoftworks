import ServiceCard from "@/components/service-card";

const services = [
  {
    tag: "Tráfego pago",
    title: "Campanhas que trazem gente pronta pra comprar",
    description:
      "Google Ads e Meta Ads configurados pra gerar lead qualificado, não clique barato. Métrica acompanhada toda semana, não só no relatório mensal.",
    icon: (
      <path d="M3 17 L9.5 10.5 L13.5 14.5 L21 6 M15 6 L21 6 L21 12" />
    ),
  },
  {
    tag: "Sistemas de gestão",
    title: "Sua operação organizada em um só lugar",
    description:
      "Sistema construído pro seu processo real, não uma planilha genérica adaptada. Vendas, estoque, financeiro e contrato num só painel.",
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
      "Rápido, responsivo e construído pra guiar quem chega até o contato — não só bonito de olhar, funcional pra vender.",
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
            <div className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-silver-mist">
              O que fazemos
            </div>
            <h2 className="pb-4 font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl">
              Três frentes, um resultado só
            </h2>
            <p className="text-lg text-silver-mist">
              Cada frente resolve um gargalo diferente. Juntas, tiram o
              crescimento da sua empresa da sorte e colocam no processo.
            </p>
          </div>
          {/* Service cards */}
          <div className="mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard
                key={service.tag}
                tag={service.tag}
                title={service.title}
                description={service.description}
                icon={service.icon}
                index={index}
                data-aos="fade-up"
                data-aos-delay={index * 150}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
