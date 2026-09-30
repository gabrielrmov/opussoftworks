import "./css/style.css";

import ConditionalHeader from "@/components/ui/conditional-header";

// Prefixo só existe no build do GitHub Pages (ver next.config.js).
const base = process.env.PAGES_BASE_PATH || "";

export const metadata = {
  metadataBase: new URL("https://opussoftworks.com.br"),
  title: {
    default: "OPUS SOFTWORKS — Tráfego, gestão e sites para empresas",
    template: "%s · OPUS SOFTWORKS",
  },
  icons: {
    icon: [
      { url: `${base}/favicon.ico`, sizes: "any" },
      { url: `${base}/images/opus-icon-192.png`, type: "image/png", sizes: "192x192" },
      { url: `${base}/images/opus-icon-512.png`, type: "image/png", sizes: "512x512" },
    ],
    shortcut: `${base}/favicon.ico`,
    apple: [{ url: `${base}/images/opus-apple-touch-icon.png`, sizes: "180x180", type: "image/png" }],
  },
  manifest: `${base}/manifest.webmanifest`,
  appleWebApp: { title: "Opus SoftWorks", capable: true },
  description:
    "Tráfego pago, sistemas de gestão e sites profissionais em um único parceiro. Diagnóstico gratuito e sem compromisso pela OPUS SOFTWORKS, em Goiânia.",
  keywords: [
    "tráfego pago",
    "gestão empresarial",
    "sites para empresas",
    "marketing digital",
    "Goiânia",
  ],
  openGraph: {
    url: "/",
    siteName: "Opus SoftWorks",
    title: "Opus SoftWorks | Tráfego pago, sistemas e sites em Goiânia",
    description:
      "Tráfego pago, sistemas de gestão e sites profissionais em um único processo, com entrega, responsabilidade e assertividade.",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "Opus SoftWorks — Resultado não é sorte. É entrega.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Opus SoftWorks | Tráfego pago, sistemas e sites em Goiânia",
    description:
      "Tráfego pago, sistemas de gestão e sites profissionais em um único processo.",
    images: ["/images/og-image.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FAFAFA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&family=Archivo:wght@500;800&family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap"
        />
        {/* Landing page (PDF "pronta") — Inter Tight (corpo/headings) e Instrument Serif
            (headline final "Estratégia, aliada à execução."), usadas só nessa página. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Instrument+Serif:ital@0&display=swap"
        />
      </head>
      <body className="bg-liquid-abyss font-inter text-base text-silver-mist antialiased">
        <div className="flex min-h-screen flex-col overflow-hidden supports-[overflow:clip]:overflow-clip">
          <ConditionalHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
