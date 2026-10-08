import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C } from "../theme";
import { useCam } from "./Camera";
import { beatPulse } from "./motion";

const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  x: random(`px${i}`) * 1080,
  y: random(`py${i}`) * 1920,
  size: 5 + random(`ps${i}`) * 7,
  speed: 0.4 + random(`pv${i}`) * 0.9,
  depth: 0.15 + random(`pd${i}`) * 0.35,
  phase: random(`pp${i}`) * 60,
}));

/** Grade pontilhada off-white com parallax da câmera e partículas vivas. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = useCam();
  const spacing = 34 * Math.sqrt(Math.min(1, Math.max(0.35, cam.s)));
  const par = 0.35;
  const ox = (-cam.x * cam.s * par) % spacing;
  const oy = (-cam.y * cam.s * par) % spacing;
  const pulse = beatPulse(frame);

  return (
    <AbsoluteFill style={{ backgroundColor: C.paper }}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${C.dot} 2.2px, transparent 2.4px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
          backgroundPosition: `${ox}px ${oy}px`,
        }}
      />
      {PARTICLES.map((p, i) => {
        const x = (((p.x - cam.x * cam.s * p.depth) % 1080) + 1080) % 1080;
        const y = (((p.y - frame * p.speed - cam.y * cam.s * p.depth) % 1920) + 1920) % 1920;
        const twinkle = 0.5 + 0.5 * Math.sin((frame + p.phase) / 9);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size,
              borderRadius: p.size / 2,
              backgroundColor: C.ink,
              opacity: 0.08 + 0.12 * twinkle + 0.08 * pulse,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
