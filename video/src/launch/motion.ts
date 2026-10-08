import { Easing, interpolate, spring } from "remotion";
import { BEAT, FPS } from "./timeline";

/** Curva padrão do vídeo (expo-out suave). */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Curva da câmera: sai suave e assenta rápido. Limita a velocidade de pico
 * dos pans (com EASE, o primeiro frame andava ~1/3 do caminho e o motion
 * blur apagava o texto).
 */
export const CAMERA_EASE = Easing.bezier(0.5, 0, 0.15, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 entre dois frames, com EASE. */
export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: EASE });

/** Spring com leve overshoot (damping 15). */
export const pop = (frame: number, at: number, damping = 15) =>
  spring({ frame: frame - at, fps: FPS, config: { damping, mass: 0.9 } });

/** Pulso que decai a cada beat (1 no beat, ~0 no meio). */
export const beatPulse = (frame: number) => Math.exp(-(((frame % BEAT) + BEAT) % BEAT) / 4);

/** Estilo de entrada "pop": escala com overshoot, subida curta e blur. */
export const popStyle = (p: number, from = 1.15, rise = 40): React.CSSProperties => ({
  opacity: Math.min(1, p * 2.2),
  transform: `translateY(${(1 - Math.min(p, 1)) * rise}px) scale(${from - (from - 1) * p})`,
  filter: `blur(${Math.max(0, 1 - p * 1.6) * 10}px)`,
});
