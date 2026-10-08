import React from 'react';
import {interpolate, random, staticFile} from 'remotion';
import {C, LOGO_ASSETS} from '../../brand';
import {CLAMP, EASE_OUT, prog} from '../../lib/anim';
import {INF_BOX} from '../../lib/infinity';

/** Brilho que passa sobre o símbolo oficial (máscara = o próprio arquivo do logo). */
export const LogoShine: React.FC<{cx: number; cy: number; width: number; frame: number; start: number; duration?: number}> = ({cx, cy, width, frame, start, duration = 22}) => {
  const t = prog(frame, start, duration);
  if (!LOGO_ASSETS.symbol || t <= 0 || t >= 1) return null;
  const h = (width * INF_BOX.height) / INF_BOX.width;
  const url = `url(${staticFile(LOGO_ASSETS.symbol)})`;
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - width / 2,
        top: cy - h / 2,
        width,
        height: h,
        WebkitMaskImage: url,
        maskImage: url,
        WebkitMaskSize: '100% 100%',
        maskSize: '100% 100%',
        background: `linear-gradient(105deg, transparent ${t * 140 - 40}%, rgba(255,255,255,0.75) ${t * 140 - 25}%, transparent ${t * 140 - 10}%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
};

/** Bússola: a agulha gira sem rumo e, a partir de `settleAt`, assenta apontando para a direita. */
export const Compass: React.FC<{x: number; y: number; r: number; frame: number; color: string; settleAt?: number; opacity?: number}> = ({x, y, r, frame, color, settleAt, opacity = 1}) => {
  const wild = frame * 11 + Math.sin(frame * 0.31) * 60 + Math.sin(frame * 0.13) * 140;
  const settle = settleAt === undefined ? 0 : prog(frame, settleAt, 22, EASE_OUT);
  const target = Math.ceil(wild / 360) * 360 + 90; // aponta para a direita (leste)
  const angle = wild + (target - wild) * settle;
  return (
    <svg width={r * 2 + 20} height={r * 2 + 20} style={{position: 'absolute', left: x - r - 10, top: y - r - 10, opacity, overflow: 'visible'}}>
      <g transform={`translate(${r + 10} ${r + 10})`}>
        <circle r={r} fill="none" stroke={color} strokeWidth={4} opacity={0.9} />
        {Array.from({length: 24}, (_, i) => (
          <line key={i} x1={0} y1={-r + 8} x2={0} y2={-r + (i % 6 === 0 ? 24 : 14)} stroke={color} strokeWidth={i % 6 === 0 ? 4 : 2} opacity={0.7} transform={`rotate(${i * 15})`} />
        ))}
        <g transform={`rotate(${angle})`}>
          <polygon points={`0,${-r + 30} ${r * 0.12},0 0,${r * 0.12} ${-r * 0.12},0`} fill={color} />
          <polygon points={`0,${r - 30} ${r * 0.12},0 0,${-r * 0.12} ${-r * 0.12},0`} fill={color} opacity={0.35} />
        </g>
        <circle r={8} fill={color} />
      </g>
    </svg>
  );
};

/** Explosão radial de traços + partículas num impacto. */
export const Burst: React.FC<{x: number; y: number; frame: number; at: number; color: string; rays?: number; radius?: number}> = ({x, y, frame, at, color, rays = 12, radius = 260}) => {
  const t = interpolate(frame, [at, at + 16], [0, 1], CLAMP);
  if (t <= 0 || t >= 1) return null;
  const e = EASE_OUT(t);
  return (
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
      {Array.from({length: rays}, (_, i) => {
        const a = (i / rays) * Math.PI * 2 + random(`b${i}`) * 0.3;
        const r0 = radius * (0.35 + e * 0.75);
        const r1 = radius * (0.35 + e * 0.75) + radius * 0.3 * (1 - e);
        return (
          <line
            key={i}
            x1={x + Math.cos(a) * r0}
            y1={y + Math.sin(a) * r0}
            x2={x + Math.cos(a) * r1}
            y2={y + Math.sin(a) * r1}
            stroke={color}
            strokeWidth={8 * (1 - e) + 2}
            strokeLinecap="round"
          />
        );
      })}
      {Array.from({length: 10}, (_, i) => {
        const a = random(`bp${i}`) * Math.PI * 2;
        const d = radius * (0.5 + random(`bd${i}`) * 0.9) * e;
        return <circle key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d} r={(5 + random(`bs${i}`) * 7) * (1 - e)} fill={color} />;
      })}
    </svg>
  );
};

/** Pequenos cards de tarefa que se amontoam (excesso de "fazer mais"). */
export const TaskPile: React.FC<{frame: number; start: number; exitAt: number}> = ({frame, start, exitAt}) => {
  const out = prog(frame, exitAt, 14, (t) => t * t);
  return (
    <>
      {Array.from({length: 9}, (_, i) => {
        const t = prog(frame, start + i * 2.2, 12, EASE_OUT);
        if (t <= 0) return null;
        const side = random(`ts${i}`) > 0.5 ? 1 : -1;
        const tx = 120 + random(`tx${i}`) * 820;
        const ty = 380 + random(`ty${i}`) * 300 + (i % 2) * 980;
        const rot = (random(`tr${i}`) - 0.5) * 30;
        const fromX = tx + side * 700;
        const x = fromX + (tx - fromX) * t + side * out * 900;
        const y = ty - out * 300 * (random(`to${i}`) + 0.3);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - 150,
              top: y - 44,
              width: 300,
              height: 88,
              borderRadius: 22,
              background: C.white,
              boxShadow: '0 14px 34px rgba(22,22,22,0.10), inset 0 0 0 2px rgba(156,156,156,0.25)',
              transform: `rotate(${rot + side * out * 40}deg)`,
              opacity: 1 - out,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: '0 22px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{width: 34, height: 34, borderRadius: 10, boxShadow: `inset 0 0 0 3px ${i % 3 === 0 ? C.coral : 'rgba(156,156,156,0.6)'}`}} />
            <div>
              <div style={{width: 150 + (i % 3) * 20, height: 12, borderRadius: 6, background: 'rgba(22,22,22,0.7)'}} />
              <div style={{width: 100, height: 10, borderRadius: 5, background: 'rgba(156,156,156,0.4)', marginTop: 10}} />
            </div>
          </div>
        );
      })}
    </>
  );
};
