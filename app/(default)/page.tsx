import type { Metadata } from "next";
import { homeJsonLd, jsonLdString } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: "Opus SoftWorks | Tráfego pago, sistemas e sites em Goiânia" },
  description:
    "Tráfego pago, sistemas de gestão e sites que convertem, sob uma mesma estratégia. Diagnóstico gratuito para empresas, em Goiânia e todo o Brasil.",
  alternates: { canonical: "/" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString(homeJsonLd()) }}
      />
      <SiteHeader />
      <main id="conteudo">
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
      </main>
      <div id="header-theme-dark-2" aria-hidden="true" />
      <LandingCinematicFooter />
    </div>
  );
}
