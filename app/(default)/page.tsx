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

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Principles />
      <Process />
      <Faq />
      <Cta />
    </>
  );
}
