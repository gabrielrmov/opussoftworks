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
    <div className="relative flex h-[36rem] w-full flex-col items-center justify-center overflow-hidden py-16 md:h-[40rem]">
      <div className="relative z-20 mx-auto mb-6 w-full max-w-3xl px-4 md:mb-0">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center font-nacelle text-2xl font-medium tracking-tight text-platinum md:text-4xl">
            Atendemos empresas em todo o Brasil
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-silver-mist md:text-base">
            Base em Goiânia, operação 100% remota: tráfego, sistema e site
            funcionam do mesmo jeito não importa em qual estado sua empresa
            esteja.
          </p>
        </motion.div>
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-40 bg-gradient-to-b from-transparent to-liquid-abyss" />
      <div className="absolute inset-x-0 -bottom-16 z-10 h-[26rem] w-full md:h-full">
        <World data={globeArcs} globeConfig={globeConfig} />
      </div>
    </div>
  );
}
