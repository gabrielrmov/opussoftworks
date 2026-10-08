import React from 'react';
import {interpolateColors} from 'remotion';
import {C, FONT} from '../../brand';
import {clamp01, lerp} from '../../lib/anim';
import {Glyph, GlyphName} from './Glyph';

/** Botão em pílula coral com ícone. `press` 0..1 afunda o botão. */
export const PillButton: React.FC<{label: string; glyph: GlyphName; height?: number; press?: number; style?: React.CSSProperties}> = ({
  label,
  glyph,
  height = 150,
  press = 0,
  style,
}) => (
  <div
    style={{
      height,
      padding: `0 ${height * 0.42}px 0 ${height * 0.3}px`,
      borderRadius: height / 2,
      background: interpolateColors(press, [0, 1], [C.coral, '#E9502B']),
      display: 'flex',
      alignItems: 'center',
      gap: height * 0.16,
      boxShadow: `0 ${lerp(22, 8, press)}px ${lerp(46, 18, press)}px rgba(255,96,57,0.35)`,
      transform: `scale(${1 - 0.06 * press})`,
      ...style,
    }}
  >
    <Glyph name={glyph} size={height * 0.5} color={C.white} strokeWidth={5.5} />
    <span style={{fontFamily: FONT.title, fontWeight: 700, fontSize: height * 0.42, color: C.white, whiteSpace: 'nowrap'}}>{label}</span>
  </div>
);

/** Chave liga/desliga. `on` 0..1. */
export const Toggle: React.FC<{on: number; scale?: number}> = ({on, scale = 1}) => (
  <div
    style={{
      width: 112 * scale,
      height: 62 * scale,
      borderRadius: 31 * scale,
      background: interpolateColors(on, [0, 1], ['rgba(156,156,156,0.35)', C.coral]),
      position: 'relative',
    }}
  >
    <div
      style={{
        position: 'absolute',
        top: 6 * scale,
        left: (6 + 50 * clamp01(on)) * scale,
        width: 50 * scale,
        height: 50 * scale,
        borderRadius: '50%',
        background: C.white,
        boxShadow: '0 3px 8px rgba(22,22,22,0.18)',
      }}
    />
  </div>
);

/** Selo circular coral com check desenhado. */
export const CheckBadge: React.FC<{t: number; draw: number; size: number}> = ({t, draw, size}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: C.coral,
      transform: `scale(${t})`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 18px 40px rgba(255,96,57,0.35)',
    }}
  >
    <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 60 60">
      <polyline
        points="13,31 25,43 47,18"
        fill="none"
        stroke={C.white}
        strokeWidth={7}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={`${draw} 2`}
      />
    </svg>
  </div>
);

/** Barra "esqueleto" de interface. */
export const Skel: React.FC<{w: number; h?: number; color?: string; style?: React.CSSProperties}> = ({w, h = 14, color = 'rgba(156,156,156,0.35)', style}) => (
  <div style={{width: w, height: h, borderRadius: h / 2, background: color, ...style}} />
);
