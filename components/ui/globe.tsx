"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";

export type Position = {
  order: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  arcAlt: number;
  color: string;
};

export type GlobeConfig = {
  pointSize?: number;
  globeColor?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereAltitude?: number;
  emissive?: string;
  emissiveIntensity?: number;
  shininess?: number;
  polygonColor?: string;
  ambientLight?: string;
  directionalLeftLight?: string;
  directionalTopLight?: string;
  pointLight?: string;
  arcTime?: number;
  arcLength?: number;
  rings?: number;
  maxRings?: number;
  initialPosition?: { lat: number; lng: number };
  autoRotate?: boolean;
  autoRotateSpeed?: number;
};

type WorldProps = {
  data: Position[];
  globeConfig: GlobeConfig;
};

type CountryFeature = Record<string, unknown>;

type GlobePoint = { lat: number; lng: number; color: string; size: number };

// Fonte dos contornos dos países (mesmo dataset usado nos exemplos oficiais
// da lib three-globe) — servido estaticamente em /public/data.
const COUNTRIES_URL = "/data/globe-countries.json";

export function World({ data, globeConfig }: WorldProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [ringsData, setRingsData] = useState<GlobePoint[]>([]);

  // Contornos dos países (preenchimento hexagonal do globo)
  useEffect(() => {
    let cancelled = false;
    fetch(COUNTRIES_URL)
      .then((res) => res.json())
      .then((geojson: { features?: CountryFeature[] }) => {
        if (!cancelled) setCountries(geojson.features ?? []);
      })
      .catch(() => {
        // Sem os contornos o globo ainda funciona, só sem o preenchimento hexagonal.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Redimensiona o canvas junto com o container (react-globe.gl exige px explícito)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return undefined;
    const update = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const globeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: globeConfig.globeColor ?? "#062056",
      emissive: new THREE.Color(globeConfig.emissive ?? "#062056"),
      emissiveIntensity: globeConfig.emissiveIntensity ?? 0.1,
      shininess: globeConfig.shininess ?? 0.9,
    });
  }, [
    globeConfig.globeColor,
    globeConfig.emissive,
    globeConfig.emissiveIntensity,
    globeConfig.shininess,
  ]);

  // Um ponto em cada ponta de cada arco (sem duplicar coordenadas repetidas)
  const points = useMemo<GlobePoint[]>(() => {
    const seen = new Set<string>();
    const result: GlobePoint[] = [];
    data.forEach((arc) => {
      const size = globeConfig.pointSize ?? 1;
      const startKey = `${arc.startLat},${arc.startLng}`;
      const endKey = `${arc.endLat},${arc.endLng}`;
      if (!seen.has(startKey)) {
        seen.add(startKey);
        result.push({ lat: arc.startLat, lng: arc.startLng, color: arc.color, size });
      }
      if (!seen.has(endKey)) {
        seen.add(endKey);
        result.push({ lat: arc.endLat, lng: arc.endLng, color: arc.color, size });
      }
    });
    return result;
  }, [data, globeConfig.pointSize]);

  // Anéis pulsantes: a cada intervalo, sorteia alguns pontos pra "piscar"
  useEffect(() => {
    if (points.length === 0) return undefined;
    const ringCount = globeConfig.maxRings ?? 3;
    const tick = () => {
      setRingsData(
        Array.from(
          { length: Math.min(ringCount, points.length) },
          () => points[Math.floor(Math.random() * points.length)],
        ),
      );
    };
    tick();
    const interval = setInterval(tick, 2000);
    return () => clearInterval(interval);
  }, [points, globeConfig.maxRings]);

  const handleGlobeReady = () => {
    const globe = globeRef.current;
    if (!globe) return;

    const controls = globe.controls();
    controls.autoRotate = globeConfig.autoRotate ?? true;
    controls.autoRotateSpeed = globeConfig.autoRotateSpeed ?? 0.5;
    controls.enableZoom = false;

    globe.pointOfView(
      {
        lat: globeConfig.initialPosition?.lat ?? 0,
        lng: globeConfig.initialPosition?.lng ?? 0,
        altitude: 1.7,
      },
      0,
    );

    const ambient = new THREE.AmbientLight(globeConfig.ambientLight ?? "#ffffff", 0.8);
    const directionalLeft = new THREE.DirectionalLight(
      globeConfig.directionalLeftLight ?? "#ffffff",
      0.6,
    );
    directionalLeft.position.set(-400, 100, 400);
    const directionalTop = new THREE.DirectionalLight(
      globeConfig.directionalTopLight ?? "#ffffff",
      0.6,
    );
    directionalTop.position.set(-200, 500, 200);
    const point = new THREE.PointLight(globeConfig.pointLight ?? "#ffffff", 0.5);
    point.position.set(-200, 500, 200);

    globe.lights([ambient, directionalLeft, directionalTop, point]);
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      {size.width > 0 && size.height > 0 && (
        <Globe
          ref={globeRef}
          width={size.width}
          height={size.height}
          backgroundColor="rgba(0,0,0,0)"
          globeImageUrl={null}
          globeMaterial={globeMaterial}
          showAtmosphere={globeConfig.showAtmosphere ?? true}
          atmosphereColor={globeConfig.atmosphereColor ?? "#ffffff"}
          atmosphereAltitude={globeConfig.atmosphereAltitude ?? 0.1}
          hexPolygonsData={countries}
          hexPolygonResolution={3}
          hexPolygonMargin={0.7}
          hexPolygonColor={() => globeConfig.polygonColor ?? "rgba(255,255,255,0.7)"}
          hexPolygonAltitude={0.01}
          arcsData={data}
          arcStartLat={(d: object) => (d as Position).startLat}
          arcStartLng={(d: object) => (d as Position).startLng}
          arcEndLat={(d: object) => (d as Position).endLat}
          arcEndLng={(d: object) => (d as Position).endLng}
          arcAltitude={(d: object) => (d as Position).arcAlt}
          arcColor={(d: object) => (d as Position).color}
          arcStroke={0.5}
          arcDashLength={globeConfig.arcLength ?? 0.9}
          arcDashGap={4}
          arcDashAnimateTime={globeConfig.arcTime ?? 1000}
          arcsTransitionDuration={0}
          pointsData={points}
          pointLat={(d: object) => (d as GlobePoint).lat}
          pointLng={(d: object) => (d as GlobePoint).lng}
          pointColor={(d: object) => (d as GlobePoint).color}
          pointAltitude={0.005}
          pointRadius={(d: object) => (d as GlobePoint).size}
          pointsMerge
          ringsData={ringsData}
          ringLat={(d: object) => (d as GlobePoint).lat}
          ringLng={(d: object) => (d as GlobePoint).lng}
          ringColor={(d: object) => (d as GlobePoint).color}
          ringMaxRadius={5}
          ringPropagationSpeed={3}
          ringRepeatPeriod={800}
          onGlobeReady={handleGlobeReady}
          enablePointerInteraction={false}
        />
      )}
    </div>
  );
}
