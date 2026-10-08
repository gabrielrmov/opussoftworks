import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand';
import {EASE_IN, clamp01, prog} from '../../lib/anim';
import {BOUNCE, snap} from './fx';

export type Seg = {text: string; color?: string; weight?: number; family?: string};

type Props = {
  text?: string;
  segments?: Seg[];
  size: number;
  color?: string;
  weight?: number;
  family?: string;
  delay?: number;
  /** Frames entre uma letra e a próxima. */
  stagger?: number;
  /** pop: letras saltam girando · rise: sobem · blur: entram desfocadas · slam: batem grandes · type: digitação. */
  mode?: 'pop' | 'rise' | 'blur' | 'slam' | 'type';
  exitAt?: number;
  /** drop: caem com gravidade · blur: desfocam · up: sobem. */
  exitMode?: 'drop' | 'blur' | 'up';
  exitStagger?: number;
  letterSpacing?: string;
  style?: React.CSSProperties;
};

/** Tipografia cinética letra a letra — cada caractere tem a própria animação. */
export const KineticText: React.FC<Props> = ({
  text,
  segments,
  size,
  color = C.graphite,
  weight = 800,
  family = FONT.title,
  delay = 0,
  stagger = 1.4,
  mode = 'pop',
  exitAt,
  exitMode = 'blur',
  exitStagger = 0.8,
  letterSpacing = '-0.01em',
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const segs = segments ?? [{text: text ?? ''}];
  const chars = segs.flatMap((s) =>
    Array.from(s.text).map((ch) => ({ch, color: s.color ?? color, weight: s.weight ?? weight, family: s.family ?? family})),
  );

  return (
    <div style={{display: 'inline-flex', whiteSpace: 'pre', fontSize: size, lineHeight: 1.05, letterSpacing, ...style}}>
      {chars.map((c, i) => {
        const local = frame - delay - i * stagger;
        if (mode === 'type' && local < 0) return null;
        const t = mode === 'type' ? (local >= 0 ? 1 : 0) : snap(frame, fps, delay + i * stagger, mode === 'slam' ? BOUNCE : undefined);
        const side = i % 2 ? 1 : -1;
        let x = 0;
        let y = 0;
        let rot = 0;
        let scale = 1;
        let blur = 0;
        let opacity = clamp01(t * 2);
        if (mode === 'pop') {
          scale = 0.3 + 0.7 * t;
          y = (1 - t) * 0.45;
          rot = (1 - t) * 14 * side;
          blur = Math.max(0, 1 - t) * 8;
        } else if (mode === 'rise') {
          y = (1 - t) * 0.8;
          opacity = clamp01(t * 1.5);
        } else if (mode === 'blur') {
          blur = Math.max(0, 1 - t) * 18;
          scale = 1.25 - 0.25 * t;
          opacity = clamp01(t * 1.4);
        } else if (mode === 'slam') {
          scale = 2.2 - 1.2 * t;
          blur = Math.max(0, 1 - t) * 10;
          opacity = clamp01(t * 3);
        }
        if (exitAt !== undefined) {
          const e = prog(frame, exitAt + i * exitStagger, 10, EASE_IN);
          if (exitMode === 'drop') {
            y += e * 1.6;
            x += e * 0.1 * side;
            rot += e * 40 * side;
          } else if (exitMode === 'up') {
            y -= e * 0.9;
          } else {
            blur += e * 20;
            scale *= 1 + 0.3 * e;
          }
          opacity *= 1 - e;
        }
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontFamily: c.family,
              fontWeight: c.weight,
              color: c.color,
              opacity,
              transform: `translate(${x}em, ${y}em) rotate(${rot}deg) scale(${scale})`,
              filter: blur > 0.05 ? `blur(${blur}px)` : undefined,
              width: c.ch === ' ' ? '0.26em' : undefined,
            }}
          >
            {c.ch === ' ' ? '' : c.ch}
          </span>
        );
      })}
    </div>
  );
};

/** Texto cuja espessura e espaçamento mudam (fonte variável). */
export const WeightMorph: React.FC<{
  text: string;
  size: number;
  from: number;
  to: number;
  start: number;
  duration: number;
  color?: string;
  spacingFrom?: number;
  spacingTo?: number;
  style?: React.CSSProperties;
}> = ({text, size, from, to, start, duration, color = C.graphite, spacingFrom = 0, spacingTo = 0, style}) => {
  const frame = useCurrentFrame();
  const t = prog(frame, start, duration);
  return (
    <div
      style={{
        fontFamily: FONT.title,
        fontSize: size,
        lineHeight: 1.05,
        whiteSpace: 'nowrap',
        color,
        fontWeight: Math.round(from + (to - from) * t),
        letterSpacing: `${spacingFrom + (spacingTo - spacingFrom) * t}em`,
        opacity: clamp01(prog(frame, start - 4, 8)),
        ...style,
      }}
    >
      {text}
    </div>
  );
};
