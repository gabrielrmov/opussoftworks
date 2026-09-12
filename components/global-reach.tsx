"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import type { GlobeConfig, Position } from "@/components/ui/globe";

const World = dynamic(
  () => import("@/components/ui/globe").then((m) => m.World),
  { ssr: false },
);

const globeConfig: GlobeConfig = {
  pointSize: 2,
  globeColor: "#0b0f1f",
  showAtmosphere: true,
  atmosphereColor: "#4fd8ff",
  atmosphereAltitude: 0.12,
  emissive: "#0b0f1f",
  emissiveIntensity: 0.15,
  shininess: 0.7,
  polygonColor: "rgba(245, 246, 251, 0.55)",
  ambientLight: "#5b5ef5",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#4fd8ff",
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

const routeColors = ["#7c3aed", "#5b5ef5", "#2f8cff", "#4fd8ff"];

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
  return (
    <section className="relative overflow-hidden" id="alcance">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-liquid-kelp/50" />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="border-t border-white/10 py-16 md:py-24">
          <div className="grid items-center gap-8 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:gap-4">
            <motion.div
              className="relative z-20 text-center md:text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="mb-3 font-mono-brand text-xs font-medium uppercase tracking-[0.18em] text-silver-mist">
                Alcance
              </div>
              <h2 className="font-nacelle text-3xl font-medium tracking-tight text-platinum md:text-5xl">
                Atendemos empresas em todo o Brasil
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
