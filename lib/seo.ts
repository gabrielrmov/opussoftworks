import { faqItems } from "@/lib/landing-content";

export const SITE_URL = "https://opussoftworks.com.br";
export const SITE_NAME = "Opus SoftWorks";

const ID = {
  org: `${SITE_URL}/#organization`,
  site: `${SITE_URL}/#website`,
  page: `${SITE_URL}/#webpage`,
};

const services = [
  {
    name: "Tráfego pago e aquisição",
    serviceType: "Gestão de tráfego pago",
    description:
      "Campanhas em Meta e Google guiadas por custo por cliente, taxa de fechamento e retorno sobre o investimento.",
  },
  {
    name: "Sistemas e automações",
    serviceType: "Sistemas de gestão empresarial e automações",
    description:
      "Mapeamento da operação, eliminação de tarefas repetitivas e centralização das informações para decidir com mais controle.",
  },
  {
    name: "Sites que convertem",
    serviceType: "Desenvolvimento de sites",
    description:
      "Sites rápidos, claros e pensados para vender, em que o visitante entende o que a empresa faz e qual é o próximo passo.",
  },
];

// Só descreve o que está visível na home: sem telefone (o número do site ainda é provisório),
// sem avaliações e sem dados que não apareçam na página.
export function homeJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": ID.org,
        name: SITE_NAME,
        alternateName: "OPUS SOFTWORKS",
        url: `${SITE_URL}/`,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/images/opus-icon-512.png`,
          width: 512,
          height: 512,
        },
        image: `${SITE_URL}/images/og-image.png`,
        description:
          "Tráfego pago, sistemas de gestão e sites profissionais para empresas, sob uma mesma estratégia.",
        slogan: "Resultado não é sorte. É entrega.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Goiânia",
          addressRegion: "GO",
          addressCountry: "BR",
        },
        areaServed: { "@type": "Country", name: "Brasil" },
        knowsAbout: [
          "Tráfego pago",
          "Sistemas de gestão empresarial",
          "Automações",
          "Desenvolvimento de sites",
        ],
        makesOffer: services.map((s) => ({ "@id": `${SITE_URL}/#servico-${slug(s.name)}` })),
      },
      {
        "@type": "WebSite",
        "@id": ID.site,
        url: `${SITE_URL}/`,
        name: SITE_NAME,
        inLanguage: "pt-BR",
        publisher: { "@id": ID.org },
      },
      {
        "@type": "WebPage",
        "@id": ID.page,
        url: `${SITE_URL}/`,
        name: "Opus SoftWorks — Tráfego, gestão e sites para empresas",
        inLanguage: "pt-BR",
        isPartOf: { "@id": ID.site },
        about: { "@id": ID.org },
        primaryImageOfPage: `${SITE_URL}/images/og-image.png`,
      },
      ...services.map((s) => ({
        "@type": "Service",
        "@id": `${SITE_URL}/#servico-${slug(s.name)}`,
        name: s.name,
        serviceType: s.serviceType,
        description: s.description,
        provider: { "@id": ID.org },
        areaServed: { "@type": "Country", name: "Brasil" },
      })),
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntityOfPage: { "@id": ID.page },
        mainEntity: faqItems.map((q) => ({
          "@type": "Question",
          name: q.question,
          acceptedAnswer: { "@type": "Answer", text: q.answer },
        })),
      },
    ],
  };
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Evita fechar a tag <script> se algum texto um dia contiver "</script>".
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
