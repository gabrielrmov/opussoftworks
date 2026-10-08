import React, {useId} from 'react';
import {staticFile} from 'remotion';
import {C, LOGO_ASSETS} from '../brand';
import {segsToD} from '../lib/geometry';
import {INF_BOX, INF_FROM_CROSS, INF_STROKE} from '../lib/infinity';

const D = segsToD(INF_FROM_CROSS, true);

type Props = {
  cx: number;
  cy: number;
  /** Largura total do símbolo na tela. */
  width: number;
  /** Revelação: uma máscara percorre o traço do infinito (0..1). */
  progress?: number;
  opacity?: number;
};

/**
 * Símbolo oficial da OPUS (arquivo original, sem recolorir nem distorcer),
 * revelado por uma máscara que percorre o próprio traço. Usar dentro de um <svg>.
 */
export const OpusSymbol: React.FC<Props> = ({cx, cy, width, progress = 1, opacity = 1}) => {
  const id = `opus-sym-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  if (progress <= 0.001 || opacity <= 0) return null;
  const s = width / INF_BOX.width;
  const masked = progress < 1;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${s}) translate(${-INF_BOX.cx} ${-INF_BOX.cy})`} opacity={opacity}>
      {masked && (
        <defs>
          <mask id={id} maskUnits="userSpaceOnUse" x={-60} y={-60} width={INF_BOX.width + 120} height={INF_BOX.height + 120}>
            <path
              d={D}
              fill="none"
              stroke="#fff"
              strokeWidth={INF_STROKE * 1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              strokeDasharray={`${progress} 2`}
            />
          </mask>
        </defs>
      )}
      <g mask={masked ? `url(#${id})` : undefined}>
        {LOGO_ASSETS.symbol ? (
          <image href={staticFile(LOGO_ASSETS.symbol)} x={0} y={0} width={INF_BOX.width} height={INF_BOX.height} />
        ) : (
          <path d={D} fill="none" stroke={C.coral} strokeWidth={INF_STROKE} strokeLinejoin="round" />
        )}
      </g>
    </g>
  );
};
