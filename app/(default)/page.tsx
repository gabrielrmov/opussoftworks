export const metadata = {
  title: "ELEVION — Tráfego, gestão e sites para empresas",
  description:
    "A ELEVION une tráfego pago, sistemas de gestão e sites profissionais para empresas que querem crescer com processo, responsabilidade e prazo cumprido.",
};

import Hero from "@/components/hero-home";
import About from "@/components/about";
import Services from "@/components/services";
import Principles from "@/components/principles";
import Process from "@/components/process";
import Faq from "@/components/faq";
import Cta from "@/components/cta";
import GatewayFlow from "@/components/ui/gateway-flow";

export default function Home() {
  return (
    <div className="relative">
      <div className="fixed inset-0 -z-10">
        <GatewayFlow className="h-full w-full" />
      </div>
      <Hero />
      <About />
      <Services />
      <Principles />
      <Process />
      <Faq />
      <Cta />
    </div>
  );
}
