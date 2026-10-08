import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {EASE_IN, EASE_OUT, lerp, prog} from '../lib/anim';

type Props = {
  cx: number;
  cy: number;
  r: number;
  delay?: number;
  duration?: number;
  /** Raio inicial no modo "expand". */
  fromR?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  opacity?: number;
  /** expand: cresce do raio inicial · draw: contorno desenhado · ripple: expande e some. */
  mode?: 'expand' | 'draw' | 'ripple';
  exit?: [number, number];
  easing?: (t: number) => number;
};

export const AnimatedCircle: React.FC<Props> = ({
  cx,
  cy,
  r,
  delay = 0,
  duration = 30,
  fromR = 0,
  color = C.coral,
  strokeWidth = 4,
  fill = 'none',
  opacity = 1,
  mode = 'expand',
  exit,
  easing = EASE_OUT,
}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, delay, duration, easing);
  const out = exit ? prog(frame, exit[0], exit[1], EASE_IN) : 0;
  if (t <= 0 || out >= 1) return null;

  if (mode === 'draw') {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={fill}
        stroke={color}
        strokeWidth={strokeWidth}
        pathLength={1}
        strokeDasharray={`${t} 2`}
        transform={`rotate(-90 ${cx} ${cy})`}
        opacity={opacity * (1 - out)}
      />
    );
  }

  const radius = lerp(fromR, r, t);
  const alpha = mode === 'ripple' ? (1 - t) * opacity : Math.min(1, t * 1.6) * opacity;
  return (
    <circle cx={cx} cy={cy} r={radius} fill={fill} stroke={color} strokeWidth={strokeWidth} opacity={alpha * (1 - out)} />
  );
};
