import "./css/style.css";

import localFont from "next/font/local";

import Header from "@/components/ui/header";

const nacelle = localFont({
  src: [
    {
      path: "../public/fonts/nacelle-regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/nacelle-semibold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/nacelle-semibolditalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-nacelle",
  display: "swap",
});

export const metadata = {
  title: {
    default: "ELEVION — Tráfego, gestão e sites para empresas",
    template: "%s · ELEVION",
  },
  description:
    "A ELEVION une tráfego pago, sistemas de gestão e sites profissionais para empresas que querem crescer com processo, responsabilidade e prazo cumprido.",
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
  themeColor: "#030712",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        className={`${nacelle.variable} bg-gray-950 font-inter text-base text-gray-200 antialiased`}
      >
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
