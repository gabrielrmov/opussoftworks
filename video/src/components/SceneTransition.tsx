import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../brand';
import {EASE_IN_OUT, lerp, prog} from '../lib/anim';
import {Pt} from '../lib/geometry';
import {HEIGHT, WIDTH} from '../timing';

type Props = {
  /** iris: círculo que se preenche e expande · split: faixa que abre a partir de uma linha. */
  type: 'iris' | 'split';
  start: number;
  duration: number;
  origin: Pt;
  color: string;
  /** Raio inicial (iris). */
  fromSize?: number;
  /** Cor das bordas que acompanham a abertura (split). */
  edgeColor?: string;
};

/** Transições geométricas entre cenas — usar dentro de <Stage>. */
export const SceneTransition: React.FC<Props> = ({type, start, duration, origin, color, fromSize = 0, edgeColor = C.coral}) => {
  const frame = useCurrentFrame();
  if (frame < start) return null;

  if (type === 'iris') {
    const fillIn = prog(frame, start, 6);
    const grow = prog(frame, start + 4, duration - 4, EASE_IN_OUT);
    const cover = Math.max(
      ...[
        [0, 0],
        [WIDTH, 0],
        [0, HEIGHT],
        [WIDTH, HEIGHT],
      ].map(([x, y]) => Math.hypot(x - origin.x, y - origin.y)),
    );
    return <circle cx={origin.x} cy={origin.y} r={lerp(fromSize, cover + 20, grow)} fill={color} opacity={fillIn} />;
  }

  const t = prog(frame, start, duration, EASE_IN_OUT);
  const half = lerp(0, Math.max(origin.y, HEIGHT - origin.y) + 20, t);
  const edge = 1 - prog(frame, start + duration * 0.4, duration * 0.6);
  return (
    <>
      <rect x={-40} y={origin.y - half} width={WIDTH + 80} height={half * 2} fill={color} />
      <line x1={-40} x2={WIDTH + 40} y1={origin.y - half} y2={origin.y - half} stroke={edgeColor} strokeWidth={5} opacity={edge} />
      <line x1={-40} x2={WIDTH + 40} y1={origin.y + half} y2={origin.y + half} stroke={edgeColor} strokeWidth={5} opacity={edge} />
    </>
  );
};
