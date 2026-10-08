import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT, HAIRLINE, TYPE} from '../brand';
import {CLAMP, EASE_IN, EASE_IN_OUT, SPRING_SOFT, SPRING_SUBTLE, clamp01, lerp, prog, sp} from '../lib/anim';
import {lerpPt, Pt} from '../lib/geometry';
import {S4_CARD} from '../lib/layout';
import {MaskText} from './MaskText';
import {ServiceIcon, ServiceIconName} from './ServiceIcon';

export type ServiceCardProps = {
  title: string;
  subtitle: string;
  icon: ServiceIconName;
  /** Centro vertical do card. */
  cy: number;
  enterFrom: 'left' | 'center' | 'right';
  delay: number;
  /** Ponto de onde o nó coral viaja até virar o ícone (continuidade da cena anterior). */
  origin?: Pt;
  originDelay?: number;
  exitAt?: number;
  /** Permite intercalar outras camadas (ex.: linha de conexão) entre corpo e ícone. */
  layer?: 'all' | 'body' | 'tile';
};

const TILE_FROM = 32;

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  subtitle,
  icon,
  cy,
  enterFrom,
  delay,
  origin,
  originDelay = 0,
  exitAt,
  layer = 'all',
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {x, w, h, tile, tileX} = S4_CARD;
  const top = cy - h / 2;

  // Corpo do card
  const enter = sp(frame, fps, delay, SPRING_SUBTLE);
  const tx = enterFrom === 'left' ? (enter - 1) * 1100 : enterFrom === 'right' ? (1 - enter) * 1100 : 0;
  const scale = enterFrom === 'center' ? lerp(0.9, 1, enter) : 1;
  const bodyOpacity = clamp01(enter * (enterFrom === 'center' ? 1.4 : 3));
  const fadeOut = exitAt === undefined ? 0 : prog(frame, exitAt, 12, EASE_IN);
  const collapse = exitAt === undefined ? 0 : prog(frame, exitAt + 6, 20, EASE_IN_OUT);

  // Ícone: o nó viaja da origem e cresce até virar o tile coral
  const tileCenter = {x: tileX, y: cy};
  const travel = origin ? sp(frame, fps, originDelay, SPRING_SOFT, 26) : 1;
  const pos = origin ? lerpPt(origin, tileCenter, travel) : tileCenter;
  const grow = sp(frame, fps, delay + 10, SPRING_SUBTLE);
  const tileSize = lerp(TILE_FROM, tile, grow);
  const tileRadius = lerp(TILE_FROM / 2, 22, grow);
  const glyph = prog(frame, delay + 18, 16);
  const tileVisible = origin ? frame >= originDelay : grow > 0.01;

  const gfx = prog(frame, delay + 26, 14);

  const body = (
    <div
      style={{
        position: 'absolute',
        left: x,
        top,
        width: w,
        height: h,
        transform: `translateX(${tx}px) scale(${scale}) scaleX(${1 - collapse})`,
        transformOrigin: `${tileX - x}px 50%`,
        opacity: bodyOpacity * (1 - collapse),
        background: C.white,
        borderRadius: 28,
        border: `2px solid ${HAIRLINE}`,
        boxSizing: 'border-box',
        boxShadow: '0 20px 50px rgba(22, 22, 22, 0.05)',
      }}
    >
      <div style={{position: 'absolute', left: tileX - x + tile / 2 + 44, top: 62, opacity: 1 - fadeOut}}>
        <MaskText delay={delay + 16} duration={20} style={{...TYPE.label, fontSize: 46, color: C.graphite, letterSpacing: '0.05em'}}>
          {title}
        </MaskText>
        <MaskText delay={delay + 22} duration={20} style={{fontFamily: FONT.text, fontSize: 32, color: C.g500, marginTop: 22}}>
          {subtitle}
        </MaskText>
      </div>
      <div style={{position: 'absolute', right: 52, top: '50%', transform: 'translateY(-50%)', opacity: gfx * (1 - fadeOut)}}>
        <MicroGraphic icon={icon} start={delay + 26} />
      </div>
    </div>
  );

  const tileEl = tileVisible ? (
    <div
      style={{
        position: 'absolute',
        left: pos.x - tileSize / 2,
        top: pos.y - tileSize / 2,
        width: tileSize,
        height: tileSize,
        borderRadius: tileRadius,
        background: C.coral,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{clipPath: `inset(${(1 - glyph) * 100}% 0 0 0)`, display: 'flex'}}>
        <ServiceIcon name={icon} size={tile * 0.52} color={C.white} />
      </div>
    </div>
  ) : null;

  return (
    <>
      {layer !== 'tile' && body}
      {layer !== 'body' && tileEl}
    </>
  );
};

/** Pequena interação gráfica à direita de cada card. */
const MicroGraphic: React.FC<{icon: ServiceIconName; start: number}> = ({icon, start}) => {
  const frame = useCurrentFrame();
  const grey = 'rgba(156, 156, 156, 0.5)';

  if (icon === 'trafego') {
    const heights = [34, 52, 72, 96];
    return (
      <svg width={150} height={100}>
        {heights.map((hgt, i) => {
          const t = prog(frame, start + i * 5, 16);
          const bh = hgt * t;
          return <rect key={i} x={i * 38} y={100 - bh} width={24} height={bh} rx={5} fill={i === 3 ? C.coral : grey} />;
        })}
      </svg>
    );
  }

  if (icon === 'sistemas') {
    const xs = [15, 85, 155];
    const cycle = 46;
    const local = Math.max(0, frame - start - 10);
    const phase = (local % cycle) / cycle;
    const dotX = interpolate(phase, [0, 0.8, 1], [15, 155, 155], {...CLAMP, easing: EASE_IN_OUT});
    const dotOpacity = frame - start < 10 ? 0 : interpolate(phase, [0, 0.08, 0.8, 1], [0, 1, 1, 0], CLAMP);
    const linkT = prog(frame, start, 18);
    return (
      <svg width={170} height={60}>
        <line x1={15} y1={30} x2={15 + 140 * linkT} y2={30} stroke={grey} strokeWidth={3} />
        {xs.map((cx, i) => {
          const near = Math.max(0, 1 - Math.abs(dotX - cx) / 30) * dotOpacity;
          return (
            <circle
              key={i}
              cx={cx}
              cy={30}
              r={11 * prog(frame, start + i * 4, 12)}
              fill={near > 0.5 ? C.coral : C.white}
              stroke={near > 0.5 ? C.coral : grey}
              strokeWidth={3}
            />
          );
        })}
        <circle cx={dotX} cy={30} r={6} fill={C.coral} opacity={dotOpacity} />
      </svg>
    );
  }

  const frameT = prog(frame, start, 18);
  const bars = [0, 1, 2].map((i) => prog(frame, start + 10 + i * 5, 16));
  return (
    <svg width={170} height={110}>
      <rect x={2} y={2} width={166} height={106} rx={12} fill="none" stroke={grey} strokeWidth={3} pathLength={1} strokeDasharray={`${frameT} 2`} />
      <line x1={2} y1={28} x2={2 + 166 * frameT} y2={28} stroke={grey} strokeWidth={3} />
      {[16, 28, 40].map((cx) => (
        <circle key={cx} cx={cx} cy={15} r={3.5} fill={grey} opacity={frameT} />
      ))}
      <rect x={18} y={44} width={70 * bars[0]} height={12} rx={6} fill={C.coral} />
      <rect x={18} y={68} width={124 * bars[1]} height={8} rx={4} fill={grey} />
      <rect x={18} y={86} width={92 * bars[2]} height={8} rx={4} fill={grey} />
    </svg>
  );
};
