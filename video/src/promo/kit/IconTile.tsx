import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand';
import {clamp01, lerp} from '../../lib/anim';
import {BOUNCE, snap} from './fx';
import {Glyph, GlyphName} from './Glyph';

type Props = {
  glyph: GlyphName;
  x: number;
  y: number;
  size: number;
  delay?: number;
  rot?: number;
  /** Desfoque fixo: simula profundidade de campo. */
  blur?: number;
  /** Deriva vertical por frame (parallax). */
  drift?: number;
  variant?: 'coral' | 'white' | 'graphite';
  opacity?: number;
};

/** Ícone em "tile" com volume suave, flutuando — os elementos 3D da referência, em 2D. */
export const IconTile: React.FC<Props> = ({glyph, x, y, size, delay = 0, rot = 0, blur = 0, drift = 0, variant = 'coral', opacity = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = snap(frame, fps, delay, BOUNCE);
  if (t <= 0.001) return null;
  const local = Math.max(0, frame - delay);
  const bob = Math.sin(local / 14 + x) * size * 0.04;
  const bg =
    variant === 'coral'
      ? `linear-gradient(150deg, #FF8463 0%, ${C.coral} 48%, #E9502B 100%)`
      : variant === 'graphite'
        ? `linear-gradient(150deg, #2C2C2C 0%, ${C.graphite} 60%)`
        : `linear-gradient(150deg, #FFFFFF 0%, ${C.g100} 100%)`;
  const ink = variant === 'white' ? C.coral : C.white;
  return (
    <div
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2 - local * drift + bob,
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: bg,
        boxShadow: variant === 'coral' ? `0 ${size * 0.14}px ${size * 0.3}px rgba(255, 96, 57, 0.32)` : `0 ${size * 0.12}px ${size * 0.3}px rgba(22, 22, 22, 0.12)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transform: `rotate(${lerp(rot - 25, rot, t)}deg) scale(${t})`,
        opacity: clamp01(t * 2) * opacity,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
      }}
    >
      <Glyph name={glyph} size={size * 0.56} color={ink} strokeWidth={5.5} />
    </div>
  );
};

/** Manchas coral desfocadas ao fundo (calor de cor, como na referência). */
export const Glow: React.FC<{x: number; y: number; size: number; opacity?: number; color?: string}> = ({x, y, size, opacity = 0.18, color = C.coral}) => (
  <div
    style={{
      position: 'absolute',
      left: x - size / 2,
      top: y - size / 2,
      width: size,
      height: size,
      borderRadius: '50%',
      background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      opacity: opacity * 1.6,
    }}
  />
);
