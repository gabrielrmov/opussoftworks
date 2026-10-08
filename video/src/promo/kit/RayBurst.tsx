import React from 'react';
import {C} from '../../brand';

/** Explosão de raios coral sobre grafite (transição de impacto). */
export const RayBurst: React.FC<{scale: number; rotate: number; opacity?: number; rays?: number}> = ({scale, rotate, opacity = 1, rays = 18}) => {
  const step = 360 / rays;
  const R = 2200;
  const pts = (deg: number) => {
    const a = ((deg - step * 0.28) * Math.PI) / 180;
    const b = ((deg + step * 0.28) * Math.PI) / 180;
    return `0,0 ${R * Math.cos(a)},${R * Math.sin(a)} ${R * Math.cos(b)},${R * Math.sin(b)}`;
  };
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity}}>
      <defs>
        <radialGradient id="ray-glow">
          <stop offset="0%" stopColor={C.coral} stopOpacity={0.95} />
          <stop offset="60%" stopColor={C.coral} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill={C.graphite} />
      <g transform={`translate(540 960) rotate(${rotate}) scale(${scale})`}>
        {Array.from({length: rays}, (_, i) => (
          <polygon key={i} points={pts(i * step)} fill={C.coral} opacity={i % 2 ? 0.55 : 0.9} />
        ))}
      </g>
      <circle cx={540} cy={960} r={420 * scale} fill="url(#ray-glow)" />
    </svg>
  );
};
