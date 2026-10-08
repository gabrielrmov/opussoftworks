import React from 'react';
import {AbsoluteFill} from 'remotion';
import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import {C} from '../../brand';
import {EASE_IN, EASE_IN_OUT, EASE_OUT} from '../../lib/anim';

/* Transições próprias do promo (CSS puro, funcionam no render). */

type ZoomProps = Record<string, never>;
const ZoomThrough: React.FC<TransitionPresentationComponentProps<ZoomProps>> = ({children, presentationDirection, presentationProgress}) => {
  const t = presentationProgress;
  if (presentationDirection === 'exiting') {
    const e = EASE_IN(t);
    return <AbsoluteFill style={{transform: `scale(${1 + e * 0.6})`, opacity: Math.max(0, 1 - t * 2.2), filter: `blur(${e * 18}px)`}}>{children}</AbsoluteFill>;
  }
  const e = EASE_OUT(t);
  return <AbsoluteFill style={{transform: `scale(${0.82 + e * 0.18})`, opacity: Math.min(1, Math.max(0, (t - 0.35) * 2.2)), filter: e < 1 ? `blur(${(1 - e) * 14}px)` : undefined}}>{children}</AbsoluteFill>;
};
/** O plano que sai avança contra a câmera e desfoca; o que entra vem de trás. */
export const zoomThrough = (): TransitionPresentation<ZoomProps> => ({component: ZoomThrough, props: {}});

type BarProps = {color: string};
const BarWipe: React.FC<TransitionPresentationComponentProps<BarProps>> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const t = EASE_IN_OUT(presentationProgress);
  if (presentationDirection === 'exiting') return <AbsoluteFill style={{transform: `translateY(${-t * 140}px)`}}>{children}</AbsoluteFill>;
  // borda inclinada: sobe 30% da esquerda para a direita; varre de baixo para cima
  const below = (yLeft: number) => `polygon(0% ${yLeft}%, 100% ${yLeft - 30}%, 100% 100%, 0% 100%)`;
  const yContent = 130 - t * 130;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: passedProps.color, clipPath: below(yContent - 16)}} />
      <AbsoluteFill style={{clipPath: below(yContent)}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
/** Uma faixa coral inclinada atravessa a tela e deixa o próximo plano para trás dela. */
export const barWipe = (color: string = C.coral): TransitionPresentation<BarProps> => ({component: BarWipe, props: {color}});

type CircleProps = {x: number; y: number; color: string};
const CircleReveal: React.FC<TransitionPresentationComponentProps<CircleProps>> = ({children, presentationDirection, presentationProgress, passedProps}) => {
  const t = EASE_IN_OUT(presentationProgress);
  if (presentationDirection === 'exiting') return <AbsoluteFill style={{transform: `scale(${1 - t * 0.08})`}}>{children}</AbsoluteFill>;
  const r = t * 2300;
  const {x, y} = passedProps;
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: passedProps.color, clipPath: `circle(${r * 1.08 + 30}px at ${x}px ${y}px)`}} />
      <AbsoluteFill style={{clipPath: `circle(${r}px at ${x}px ${y}px)`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
/** O próximo plano abre num círculo a partir de um ponto, com uma borda coral à frente. */
export const circleReveal = (x = 540, y = 960, color: string = C.coral): TransitionPresentation<CircleProps> => ({
  component: CircleReveal,
  props: {x, y, color},
});
