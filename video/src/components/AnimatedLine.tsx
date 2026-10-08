import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {EASE_IN_OUT, prog} from '../lib/anim';

type Props = {
  d: string;
  /** [frame inicial, duração] do desenho (stroke-dashoffset). */
  draw?: [number, number];
  /** [frame inicial, duração] do recolhimento: a cauda percorre o traço. */
  retract?: [number, number];
  /** Janela visível explícita (0..1 do comprimento) — substitui draw/retract. */
  window?: [number, number];
  color?: string;
  width?: number;
  opacity?: number;
  easing?: (t: number) => number;
  cap?: 'round' | 'butt' | 'square';
  transform?: string;
};

export const AnimatedLine: React.FC<Props> = ({
  d,
  draw = [0, 30],
  retract,
  window,
  color = C.coral,
  width = 6,
  opacity = 1,
  easing = EASE_IN_OUT,
  cap = 'round',
  transform,
}) => {
  const frame = useCurrentFrame();
  const head = window ? window[1] : prog(frame, draw[0], draw[1], easing);
  const tail = window ? window[0] : retract ? prog(frame, retract[0], retract[1], easing) * head : 0;
  const len = head - tail;
  if (len <= 0.0005 || opacity <= 0) return null;
  return (
    <path
      d={d}
      transform={transform}
      pathLength={1}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap={cap}
      strokeLinejoin="round"
      strokeDasharray={`${len} 3`}
      strokeDashoffset={-tail}
      opacity={opacity}
    />
  );
};
