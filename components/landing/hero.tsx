"use client";

import { getWhatsAppUrl } from "@/lib/whatsapp";
import ShinyText from "@/components/ui/shiny-text";
import SpecularButton from "@/components/ui/specular-button";
import DotField from "@/components/ui/dot-field";

const WHATSAPP_URL = getWhatsAppUrl(
  "Olá! Quero falar com um especialista da ELEVION.",
);

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      <DotField
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
        dotRadius={2}
        dotSpacing={16}
        cursorRadius={220}
        bulgeOnly
        bulgeStrength={40}
        glowRadius={220}
        gradientFrom="rgba(22, 93, 252, 0.6)"
        gradientTo="rgba(22, 93, 252, 0.32)"
        glowColor="rgba(22, 93, 252, 0.06)"
      />
      <div className="relative z-10 mx-auto max-w-[960px] px-6 pb-16 pt-20 text-center sm:px-11 sm:pb-24 sm:pt-28">
        <h1 className="font-intertight text-[34px] font-medium leading-[1.15] tracking-[-0.02em] text-landing-ink sm:text-[42px] lg:text-[51px]">
          Resultado não é sorte.{" "}
          <ShinyText
            text="É entrega."
            color="#165dfc"
            shineColor="#7fa8ff"
            speed={2.4}
            className="font-intertight font-medium"
          />
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-intertight text-lg text-landing-muted sm:text-xl lg:text-[26px] lg:leading-[1.3]">
          Estratégia, tecnologia e IA para empresas que querem vender mais,
          operar melhor e crescer com clareza.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <SpecularButton
            size="md"
            radius={999}
            tint="#171717"
            tintOpacity={1}
            textColor="#ffffff"
            lineColor="#165dfc"
            baseColor="#171717"
            onClick={() => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")}
          >
            Falar com um especialista
            <span aria-hidden="true">↗</span>
          </SpecularButton>
          <SpecularButton
            size="md"
            radius={999}
            tint="#ededed"
            tintOpacity={1}
            textColor="#171717"
            lineColor="#171717"
            baseColor="#ededed"
            onClick={() =>
              document.getElementById("solucoes")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Conhecer soluções
          </SpecularButton>
        </div>
      </div>
    </section>
  );
}
