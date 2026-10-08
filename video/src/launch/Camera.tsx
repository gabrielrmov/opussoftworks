import React, { createContext, useContext } from "react";
import { interpolate } from "remotion";
import { SCREEN_FOCUS } from "./layout";
import { CAMERA_EASE } from "./motion";
import { CAMERA, CAMERA_STILL_FROM } from "./timeline";

export type Cam = { x: number; y: number; s: number };

/** Câmera em qualquer frame (inclusive fracionário, pro motion blur). */
export const camAt = (frame: number): Cam => {
  const last = CAMERA[CAMERA.length - 1];
  let cam: Cam = { x: last.x, y: last.y, s: last.s };
  for (let i = 0; i < CAMERA.length - 1; i++) {
    const a = CAMERA[i];
    const b = CAMERA[i + 1];
    if (frame <= b.f) {
      const t = CAMERA_EASE(interpolate(frame, [a.f, b.f], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
      cam = {
        x: a.x + (b.x - a.x) * t,
        y: a.y + (b.y - a.y) * t,
        s: Math.exp(Math.log(a.s) + (Math.log(b.s) - Math.log(a.s)) * t),
      };
      break;
    }
  }
  // "Respiração": escala oscila entre 1 e 1,03 a cada 4 beats.
  if (frame < CAMERA_STILL_FROM) {
    cam.s *= 1 + 0.015 * (1 - Math.cos((2 * Math.PI * frame) / 60));
  }
  return cam;
};

/** Velocidade da câmera em px de tela por frame — decide se liga o motion blur. */
export const camSpeed = (frame: number) => {
  const a = camAt(Math.max(0, frame - 1));
  const b = camAt(frame);
  const pan = Math.hypot(b.x - a.x, b.y - a.y) * b.s;
  const zoom = Math.abs(Math.log(b.s / a.s)) * 900;
  return { total: pan + zoom, zoomDominant: zoom > pan };
};

const CamContext = createContext<Cam>({ x: 0, y: 0, s: 1 });
export const useCam = () => useContext(CamContext);

/** Transforma o canvas de mundo pra tela a partir do foco/escala da câmera. */
export const Camera: React.FC<{ cam: Cam; children: React.ReactNode }> = ({ cam, children }) => (
  <CamContext.Provider value={cam}>
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        transformOrigin: "0 0",
        transform: `translate(${SCREEN_FOCUS.x - cam.x * cam.s}px, ${SCREEN_FOCUS.y - cam.y * cam.s}px) scale(${cam.s})`,
      }}
    >
      {children}
    </div>
  </CamContext.Provider>
);

export const CamProvider = CamContext.Provider;
