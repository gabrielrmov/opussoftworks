export const metadata = {
  title: "ELEVION — Tráfego, gestão e sites para empresas",
  description:
    "A ELEVION une tráfego pago, sistemas de gestão e sites profissionais para empresas que querem crescer com processo, responsabilidade e prazo cumprido.",
};

import Hero from "@/components/hero-home";
import About from "@/components/about";
import GlobalReach from "@/components/global-reach";
import Services from "@/components/services";
import Principles from "@/components/principles";
import Process from "@/components/process";
import Guarantees from "@/components/guarantees";
import Faq from "@/components/faq";
import Cta from "@/components/cta";
import GatewayFlow from "@/components/ui/gateway-flow";

export default function Home() {
  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10">
        <GatewayFlow className="h-full w-full" opacity={0.35} density={0.6} />
        <div className="absolute inset-0 bg-liquid-abyss/75" />
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat",
          }}
          aria-hidden="true"
        />
      </div>
      <Hero />
      <About />
      <GlobalReach />
      <Services />
      <Principles />
      <Process />
      <Guarantees />
      <Faq />
      <Cta />
    </div>
  );
}
