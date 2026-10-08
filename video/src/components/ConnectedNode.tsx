import React from 'react';
import {interpolateColors} from 'remotion';
import {C, TYPE} from '../brand';
import {lerp} from '../lib/anim';
import {Pt} from '../lib/geometry';
import {ServiceIcon, ServiceIconName} from './ServiceIcon';

export type NodeLook = {
  pos: Pt;
  size: number;
  radius: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  glyph: string;
};

type Props = {
  from: NodeLook;
  to: NodeLook;
  /** Progresso da transformação from → to (0..1). */
  t: number;
  icon?: ServiceIconName;
  scale?: number;
  opacity?: number;
  /** Rótulo do nó e seu progresso de revelação (máscara). */
  label?: string;
  labelT?: number;
  labelSide?: 'top' | 'bottom';
};

const mix = (a: string, b: string, t: number) => interpolateColors(t, [0, 1], [a, b]);

/** Nó do sistema: pode nascer como outro elemento (ícone, ponto) e virar círculo conectado. */
export const ConnectedNode: React.FC<Props> = ({
  from,
  to,
  t,
  icon,
  scale = 1,
  opacity = 1,
  label,
  labelT = 0,
  labelSide = 'bottom',
}) => {
  const x = lerp(from.pos.x, to.pos.x, t);
  const y = lerp(from.pos.y, to.pos.y, t);
  const size = lerp(from.size, to.size, t);
  const radius = lerp(from.radius, to.radius, t);
  const sw = lerp(from.strokeWidth, to.strokeWidth, t);
  // troca de cor curta, para não demorar nos tons intermediários
  const ct = Math.min(1, Math.max(0, (t - 0.45) / 0.25));
  if (opacity <= 0) return null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          borderRadius: radius,
          background: mix(from.fill, to.fill, ct),
          boxShadow: `inset 0 0 0 ${sw}px ${mix(from.stroke, to.stroke, ct)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {icon && <ServiceIcon name={icon} size={lerp(58, 64, t)} color={mix(from.glyph, to.glyph, ct)} />}
      </div>
      {label && (
        <div
          style={{
            position: 'absolute',
            left: x - 200,
            width: 400,
            top: labelSide === 'top' ? y - size / 2 - 72 : y + size / 2 + 34,
            textAlign: 'center',
            overflow: 'hidden',
            padding: '0.15em 0',
            opacity,
          }}
        >
          <div
            style={{
              ...TYPE.label,
              fontSize: 32,
              color: C.graphite,
              transform: `translateY(${(1 - labelT) * 130}%)`,
            }}
          >
            {label}
          </div>
        </div>
      )}
    </>
  );
};
