import React from 'react';
import {AbsoluteFill, random} from 'remotion';
import {C} from '../../brand';
import {useRealTime} from './RealTime';

export type AmbientVariant = 'light' | 'grey' | 'coral' | 'dark';

const PALETTE: Record<AmbientVariant, {dot: string; particle: string; ring: string}> = {
  light: {dot: 'rgba(22,22,22,0.10)', particle: C.coral, ring: 'rgba(255,96,57,0.22)'},
  grey: {dot: 'rgba(22,22,22,0.10)', particle: C.coral, ring: 'rgba(255,96,57,0.20)'},
  coral: {dot: 'rgba(255,255,255,0.16)', particle: C.white, ring: 'rgba(255,255,255,0.25)'},
  dark: {dot: 'rgba(255,255,255,0.08)', particle: C.coral, ring: 'rgba(255,96,57,0.30)'},
};

const N = 16;

/**
 * Fundo vivo: grade de pontos que desliza, partículas com paralaxe (perto = maior,
 * mais rápida e desfocada) e anéis finos girando. Roda no tempo real do plano.
 */
export const Ambient: React.FC<{variant: AmbientVariant; seed?: string; density?: number}> = ({variant, seed = 'opus', density = 1}) => {
  const {frame} = useRealTime();
  const p = PALETTE[variant];
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `radial-gradient(${p.dot} 2px, transparent 2.4px)`,
          backgroundSize: '36px 36px',
          backgroundPosition: `${frame * 0.35}px ${-frame * 0.6}px`,
          WebkitMaskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 20%, transparent 85%)',
          maskImage: 'radial-gradient(ellipse 75% 60% at 50% 45%, black 20%, transparent 85%)',
        }}
      />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <circle cx={1080} cy={260} r={420} fill="none" stroke={p.ring} strokeWidth={2} strokeDasharray="4 14" transform={`rotate(${frame * 0.25} 1080 260)`} />
        <circle cx={0} cy={1700} r={360} fill="none" stroke={p.ring} strokeWidth={2} strokeDasharray="2 10" transform={`rotate(${-frame * 0.3} 0 1700)`} />
      </svg>
      {Array.from({length: Math.round(N * density)}, (_, i) => {
        const depth = random(`${seed}-d-${i}`);
        const x0 = random(`${seed}-x-${i}`) * 1080;
        const y0 = random(`${seed}-y-${i}`) * 1920;
        const speed = 0.4 + depth * 1.6;
        const y = (((y0 - frame * speed) % 2040) + 2040) % 2040 - 60;
        const x = x0 + Math.sin(frame / (30 + depth * 20) + i) * (10 + depth * 18);
        const size = 6 + depth * 16;
        const kind = i % 3;
        const style: React.CSSProperties = {
          position: 'absolute',
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          opacity: 0.25 + depth * 0.45,
          filter: depth > 0.75 ? `blur(${(depth - 0.75) * 14}px)` : undefined,
          transform: `rotate(${frame * (depth - 0.5) * 2}deg)`,
        };
        if (kind === 0) return <div key={i} style={{...style, borderRadius: '50%', background: p.particle}} />;
        if (kind === 1) return <div key={i} style={{...style, borderRadius: '50%', boxShadow: `inset 0 0 0 ${Math.max(2, size * 0.18)}px ${p.particle}`}} />;
        return (
          <svg key={i} viewBox="0 0 10 10" style={style}>
            <path d="M5 1 V9 M1 5 H9" stroke={p.particle} strokeWidth={2.2} strokeLinecap="round" />
          </svg>
        );
      })}
    </AbsoluteFill>
  );
};

/** Granulação de filme bem sutil (por cima de tudo). */
export const Grain: React.FC<{frame: number; opacity?: number}> = ({frame, opacity = 0.05}) => (
  <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity, pointerEvents: 'none', mixBlendMode: 'multiply'}}>
    <filter id="opus-grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={Math.floor(frame / 2) % 97} stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width={1080} height={1920} filter="url(#opus-grain)" />
  </svg>
);
