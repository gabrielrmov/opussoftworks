import {Easing, interpolate, spring} from 'remotion';

export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EASE_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const EASE_SINE = Easing.inOut(Easing.sin);

export const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Sem overshoot / overshoot muito discreto (~1,5%).
export const SPRING_SOFT = {damping: 200, mass: 1, stiffness: 100};
export const SPRING_SUBTLE = {damping: 16, mass: 0.9, stiffness: 110};

/** Progresso 0→1 entre `start` e `start + duration`. */
export const prog = (
  frame: number,
  start: number,
  duration: number,
  easing: (t: number) => number = EASE_OUT,
) => interpolate(frame, [start, start + duration], [0, 1], {...CLAMP, easing});

export const sp = (
  frame: number,
  fps: number,
  delay: number,
  config = SPRING_SOFT,
  durationInFrames?: number,
) => spring({frame: frame - delay, fps, config, durationInFrames});

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
