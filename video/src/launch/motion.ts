import { Easing, interpolate } from "remotion";

/**
 * Linguagem de movimento — poucas curvas, usadas sempre do mesmo jeito:
 * - OUT (expo-out): tudo que entra. Rápido no começo, assenta longo.
 * - IN (expo-in): tudo que sai. Começa devagar e some rápido.
 * - IN_OUT: o que viaja de um lugar a outro (câmera, linha, wordmark).
 * Sem overshoot, sem blur de entrada, sem pulso.
 */
export const OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const IN = Easing.bezier(0.7, 0, 0.84, 0);
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const CAMERA_EASE = Easing.bezier(0.76, 0, 0.24, 1);
/** compatibilidade */
export const EASE = OUT;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ease = (frame: number, from: number, to: number, easing = OUT) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing });

/** 0→1 em `dur` frames a partir de `at` (expo-out). */
export const enter = (frame: number, at: number, dur = 16) => ease(frame, at, at + dur, OUT);
/** 0→1 em `dur` frames a partir de `at` (expo-in). */
export const leave = (frame: number, at: number, dur = 10) => ease(frame, at, at + dur, IN);

/** Elemento de interface entrando/saindo: opacidade + 24 px de deslocamento. */
export const appear = (frame: number, at: number, out?: number, dist = 24): React.CSSProperties => {
  const i = enter(frame, at, 14);
  const o = out === undefined ? 0 : leave(frame, out, 8);
  return { opacity: i * (1 - o), transform: `translateY(${(1 - i) * dist - o * dist * 0.5}px)` };
};
