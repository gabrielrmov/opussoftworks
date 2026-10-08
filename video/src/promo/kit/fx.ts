import type React from 'react';
import {spring} from 'remotion';
import {EASE_IN, EASE_OUT, prog} from '../../lib/anim';

// Molas com mais energia que as do filme de lançamento: o promo é rápido.
export const SNAP = {damping: 13, stiffness: 190, mass: 0.7};
export const BOUNCE = {damping: 9, stiffness: 170, mass: 0.6};

export const snap = (frame: number, fps: number, delay: number, config = SNAP) =>
  spring({frame: frame - delay, fps, config});

/** Pulso 1→0 em torno de um frame (clique, impacto). */
export const pulse = (frame: number, at: number, width = 4) => Math.max(0, 1 - Math.abs(frame - at) / width);

type Move = 'blur' | 'whipUp' | 'whipLeft' | 'zoom' | 'shrink';

/** Saída de plano: desfoque, chicote ou zoom — as transições rápidas da referência. */
export const exitStyle = (frame: number, at: number, dur: number, kind: Move, origin = '50% 50%'): React.CSSProperties => {
  const e = prog(frame, at, dur, EASE_IN);
  if (e <= 0) return {};
  switch (kind) {
    case 'whipUp':
      return {transform: `translateY(${-e * 900}px)`, filter: `blur(${e * 26}px)`, opacity: 1 - e * 0.7};
    case 'whipLeft':
      return {transform: `translateX(${-e * 1000}px)`, filter: `blur(${e * 26}px)`, opacity: 1 - e * 0.7};
    case 'zoom':
      return {transform: `scale(${1 + e * 2.6})`, transformOrigin: origin, filter: `blur(${e * 22}px)`, opacity: 1 - e};
    case 'shrink':
      return {transform: `scale(${1 - e * 0.85})`, transformOrigin: origin, filter: `blur(${e * 14}px)`, opacity: 1 - e};
    default:
      return {transform: `scale(${1 + e * 0.12})`, filter: `blur(${e * 30}px)`, opacity: 1 - e};
  }
};

/** Entrada de plano vindo desfocado de baixo (continua um chicote para cima). */
export const enterStyle = (frame: number, dur: number): React.CSSProperties => {
  const t = prog(frame, 0, dur, EASE_OUT);
  if (t >= 1) return {};
  return {transform: `translateY(${(1 - t) * 700}px)`, filter: `blur(${(1 - t) * 24}px)`};
};
