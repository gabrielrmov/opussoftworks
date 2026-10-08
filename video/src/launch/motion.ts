import { Easing, interpolate } from "remotion";

/** Entradas: secas, 6–10 frames, sem blur nem fade lento. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

/** Câmera: arranca forte e freia seco (chicote), nada de deslize mole. */
export const CAMERA_EASE = Easing.bezier(0.7, 0, 0.2, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const ease = (frame: number, from: number, to: number) =>
  interpolate(frame, [from, to], [0, 1], { ...clamp, easing: EASE });

/** 0→1 em `dur` frames a partir de `at`. */
export const enter = (frame: number, at: number, dur = 8) => ease(frame, at, at + dur);

/** Palavra entrando: aparece no frame exato e sobe 40 px em 8 frames. */
export const rise = (frame: number, at: number, dist = 40): React.CSSProperties => ({
  opacity: frame < at ? 0 : 1,
  transform: `translateY(${(1 - enter(frame, at, 8)) * dist}px)`,
});

/** "Slam": escala 1+amount → 1 em 6 frames, pras frases de impacto. */
export const slam = (frame: number, at: number, amount = 0.2) => 1 + amount * (1 - enter(frame, at, 6));

/**
 * Origem do slam pra uma linha de largura `w` que começa em `left` (mundo
 * = tela na escala 1, com o bloco centrado em 540): mantém o overshoot de
 * 1.2× centrado no quadro, sem cortar na borda.
 */
export const slamOrigin = (w: number, left: number, frameCenterX: number) => {
  const c = left + w / 2;
  const o = 1.2 * w > 860 ? (1.2 * c - frameCenterX) / 0.2 : c;
  return `${o - left}px 50%`;
};
