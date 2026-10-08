import { Easing, interpolate } from "remotion";

/** Curva de todas as entradas: rápida, sem moleza. */
export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** 0→1 em `dur` frames (6–10) a partir de `at`. */
export const enter = (frame: number, at: number, dur = 8) =>
  interpolate(frame, [at, at + dur], [0, 1], { ...clamp, easing: EASE });

/** "Slam": escala 1.2 → 1 em 6 frames. */
export const slam = (frame: number, at: number) => 1.2 - 0.2 * enter(frame, at, 6);
export const SLAM_FRAMES = 6;

/**
 * Origem do slam pra uma linha de largura `w` alinhada na margem: se o
 * overshoot de 1.2× não cabe entre as margens, a origem é escolhida pra o
 * texto escalado ficar centrado no quadro (nunca cortado pela borda); senão,
 * o centro da própria palavra.
 */
export const slamOrigin = (w: number, margin = 84, textW = 912, frameW = 1080) => {
  // centro do texto escalado no centro do quadro: o + 1.2·(margin + w/2 − o) = frameW/2
  const o = 1.2 * w > textW ? (1.2 * (margin + w / 2) - frameW / 2) / 0.2 : margin + w / 2;
  return `${o - margin}px 50%`;
};

/** Entrada padrão de palavra: sobe 40 px e aparece em 8 frames (sem fade lento). */
export const rise = (frame: number, at: number, dist = 40): React.CSSProperties => {
  const p = enter(frame, at, 8);
  return { opacity: frame < at ? 0 : 1, transform: `translateY(${(1 - p) * dist}px)` };
};
