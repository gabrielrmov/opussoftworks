import React from 'react';
import {C} from '../brand';

export type ProblemCardKind = 'solid' | 'lines';

type Props = {
  x: number;
  y: number;
  w?: number;
  h?: number;
  rot?: number;
  opacity?: number;
  radius?: number;
  bg?: string;
  borderOpacity?: number;
  contentOpacity?: number;
  kind: ProblemCardKind;
  /** Progresso das duas barras internas. */
  bars: [number, number];
};

/** Card solto da cena 02 (pode encolher até virar um nó na cena 03). */
export const ProblemCard: React.FC<Props> = ({
  x,
  y,
  w = 250,
  h = 290,
  rot = 0,
  opacity = 1,
  radius = 22,
  bg = C.white,
  borderOpacity = 1,
  contentOpacity = 1,
  kind,
  bars,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - w / 2,
      top: y - h / 2,
      width: w,
      height: h,
      borderRadius: radius,
      background: bg,
      boxShadow: `inset 0 0 0 2px rgba(156,156,156,${0.4 * borderOpacity}), 0 18px 44px rgba(22,22,22,${0.06 * borderOpacity})`,
      transform: `rotate(${rot}deg)`,
      opacity,
      overflow: 'hidden',
    }}
  >
    <div style={{position: 'absolute', left: 38, top: 72, opacity: contentOpacity}}>
      {kind === 'solid' ? (
        <>
          <div style={{width: 136 * bars[0], height: 28, borderRadius: 4, background: C.coral}} />
          <div style={{width: 136 * bars[1], height: 28, borderRadius: 4, background: C.graphite, marginTop: 16}} />
        </>
      ) : (
        <>
          <div style={{width: 156 * bars[0], height: 9, borderRadius: 5, background: C.coral}} />
          <div style={{width: 156 * bars[1], height: 6, borderRadius: 3, background: C.g500, opacity: 0.55, marginTop: 26}} />
        </>
      )}
    </div>
  </div>
);
