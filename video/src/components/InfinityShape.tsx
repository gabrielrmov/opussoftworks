import React from 'react';
import {C} from '../brand';
import {segsToD} from '../lib/geometry';
import {INF_BOX, INF_FROM_CROSS} from '../lib/infinity';

const D = segsToD(INF_FROM_CROSS, true);

type Props = {
  cx: number;
  cy: number;
  /** Largura do símbolo na tela. */
  width: number;
  color?: string;
  /** Espessura do traço na tela (px). */
  strokeWidth?: number;
  /** Quanto do traço está desenhado (0..1). */
  progress?: number;
  opacity?: number;
};

/** Forma de infinito assimétrico (linguagem geométrica do símbolo OPUS) — usar dentro de <Stage>. */
export const InfinityShape: React.FC<Props> = ({
  cx,
  cy,
  width,
  color = C.coral,
  strokeWidth = 12,
  progress = 1,
  opacity = 1,
}) => {
  if (progress <= 0.001 || opacity <= 0) return null;
  const s = width / INF_BOX.drawnWidth;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-INF_BOX.cx} ${-INF_BOX.cy})`} opacity={opacity}>
      <path
        d={D}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth / s}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={progress >= 1 ? undefined : `${progress} 2`}
      />
    </g>
  );
};
