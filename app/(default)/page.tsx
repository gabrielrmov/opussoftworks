export const metadata = {
  title: "OPUS SOFTWORKS — Tráfego, gestão e sites para empresas",
  description:
    "Estratégia, tecnologia e IA para empresas crescerem com decisões melhores. Tráfego pago, sistemas e automações e sites que convertem, sob uma mesma estratégia.",
};

import SiteHeader from "@/components/landing/site-header";
import Hero from "@/components/landing/hero";
import Divider from "@/components/landing/divider";
import Pillars from "@/components/landing/pillars";
import Process from "@/components/landing/process";
import Testimonials from "@/components/landing/testimonials";
import Faq from "@/components/landing/faq";
import GlyphPortalSection from "@/components/landing/glyph-portal-section";
import FinalCta from "@/components/landing/final-cta";
import LandingCinematicFooter from "@/components/landing/landing-cinematic-footer";

export default function Home() {
  return (
    <div className="bg-landing-bg text-landing-ink">
      <SiteHeader />
      <Hero />
      <Divider />
      <Pillars />
      <Process />
      <Testimonials />
      <Faq />
      <div id="header-theme-dark-1" aria-hidden="true" />
      <GlyphPortalSection />
      <div id="header-theme-light-1" aria-hidden="true" />
      <FinalCta />
      <div id="header-theme-dark-2" aria-hidden="true" />
      <LandingCinematicFooter />
    </div>
  );
}
