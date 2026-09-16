"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import type { GlobeConfig, Position } from "@/components/ui/globe";
import VariableProximity from "@/components/ui/variable-proximity";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false },
);

const globeConfig: GlobeConfig = {
  // globeColor era quase igual ao fundo da seção (#0E0E13) — o globo
  // sumia, ficava só um círculo preto com brilho na borda. Um azul-noite
  // dá volume/forma real à esfera sem fugir da paleta.
  pointSize: 2.4,
  globeColor: "#0A1730",
  showAtmosphere: true,
  atmosphereColor: "#2F8CFF",
  atmosphereAltitude: 0.14,
  emissive: "#0A1730",
  emissiveIntensity: 0.25,
  shininess: 0.9,
  polygonColor: "rgba(163, 202, 255, 0.85)",
  ambientLight: "#3A5A8C",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#2F8CFF",
  arcTime: 1200,
  arcLength: 0.85,
  rings: 2,
  maxRings: 3,
  // Goiânia — sede da ELEVION
  initialPosition: { lat: -16.6869, lng: -49.2648 },
  autoRotate: true,
  autoRotateSpeed: 0.4,
};

// Capitais brasileiras, com Goiânia (sede) como centro — reforça "base local,
// atendimento em todo o Brasil" sem prometer alcance internacional que não existe.
const GOIANIA = { lat: -16.6869, lng: -49.2648 };
const capitals = [
  { name: "São Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro", lat: -22.9068, lng: -43.1729 },
  { name: "Brasília", lat: -15.7801, lng: -47.9292 },
  { name: "Belo Horizonte", lat: -19.9167, lng: -43.9345 },
  { name: "Salvador", lat: -12.9714, lng: -38.5014 },
  { name: "Fortaleza", lat: -3.7172, lng: -38.5433 },
  { name: "Recife", lat: -8.0476, lng: -34.877 },
  { name: "Porto Alegre", lat: -30.0346, lng: -51.2177 },
  { name: "Curitiba", lat: -25.4284, lng: -49.2733 },
  { name: "Manaus", lat: -3.119, lng: -60.0217 },
  { name: "Belém", lat: -1.4558, lng: -48.4902 },
];

const routeColors = ["#2F8CFF"];

const globeArcs: Position[] = capitals.map((capital, index) => ({
  order: index + 1,
  startLat: GOIANIA.lat,
  startLng: GOIANIA.lng,
  endLat: capital.lat,
  endLng: capital.lng,
  arcAlt: 0.2 + (index % 4) * 0.08,
  color: routeColors[index % routeColors.length],
}));

export default function GlobalReach() {
  const headingRef = useRef<HTMLHeadingElement>(null);

  return (
    <section className="relative overflow-hidden" id="alcance">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-liquid-kelp/50" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(47,140,255,0.08) 0%, transparent 55%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-cobalt/25 to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-20 md:py-32">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-4">
            <motion.div
              className="relative z-20 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-3 font-mono-brand text-xs font-medium uppercase tracking-[0.18em] text-cobalt">
                Alcance
              </div>
              <h2
                ref={headingRef}
                className="text-3xl font-medium tracking-tight text-platinum md:text-5xl"
              >
                <VariableProximity
                  label="Atendemos empresas em todo o Brasil"
                  containerRef={headingRef}
                  fromFontVariationSettings="'wght' 420, 'opsz' 10"
                  toFontVariationSettings="'wght' 650, 'opsz' 28"
                  radius={90}
                  falloff="linear"
                />
              </h2>
              <p className="mx-auto mt-4 max-w-md text-silver-mist md:mx-0 md:text-lg">
                Base em Goiânia, operação 100% remota: tráfego, sistema e site
                funcionam do mesmo jeito não importa em qual estado sua
                empresa esteja.
              </p>
            </motion.div>
            <div className="relative -mx-4 h-[22rem] w-[calc(100%+2rem)] sm:h-[26rem] md:mx-0 md:-mr-16 md:h-[28rem] md:w-[calc(100%+4rem)] lg:-mr-24 lg:h-[30rem] lg:w-[calc(100%+6rem)]">
              <World data={globeArcs} globeConfig={globeConfig} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
