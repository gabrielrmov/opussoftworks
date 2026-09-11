import "./css/style.css";

import Header from "@/components/ui/header";

export const metadata = {
  title: {
    default: "ELEVION — Tráfego, gestão e sites para empresas",
    template: "%s · ELEVION",
  },
  description:
    "Tráfego pago, sistemas de gestão e sites profissionais em um único parceiro. Diagnóstico gratuito e sem compromisso pela ELEVION, em Goiânia.",
  keywords: [
    "tráfego pago",
    "gestão empresarial",
    "sites para empresas",
    "marketing digital",
    "Goiânia",
  ],
  openGraph: {
    title: "ELEVION — Tráfego, gestão e sites para empresas",
    description:
      "Tráfego pago, sistemas de gestão e sites profissionais em um único processo, com entrega, responsabilidade e assertividade.",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "ELEVION — Tráfego, gestão e sites para empresas",
    description:
      "Tráfego pago, sistemas de gestão e sites profissionais em um único processo.",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0f1f",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-liquid-abyss font-inter text-base text-silver-mist antialiased">
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
