import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../brand';
import {EASE_IN, SPRING_SUBTLE, clamp01, prog, sp} from '../lib/anim';

type Props = {
  text: string;
  color?: string;
  /** Palavras (exatas) que recebem a cor de destaque. */
  highlight?: string[];
  highlightColor?: string;
  delay?: number;
  stagger?: number;
  /** rise: palavras sobem em sequência · scale: a frase cresce (0.94→1) e as palavras surgem. */
  mode?: 'rise' | 'scale';
  fontSize?: number;
  exitAt?: number;
  style?: React.CSSProperties;
};

export const AnimatedText: React.FC<Props> = ({
  text,
  color = C.graphite,
  highlight = [],
  highlightColor = C.coral,
  delay = 0,
  stagger = 4,
  mode = 'rise',
  fontSize = 88,
  exitAt,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const phrase = sp(frame, fps, delay, SPRING_SUBTLE);
  const exit = exitAt === undefined ? 0 : prog(frame, exitAt, 14, EASE_IN);
  const scale = mode === 'scale' ? 0.94 + 0.06 * phrase : 1;

  return (
    <div
      style={{
        ...TYPE.display,
        fontSize,
        color,
        whiteSpace: 'nowrap',
        transform: `translateY(${-exit * 40}px) scale(${scale})`,
        transformOrigin: '0% 60%',
        opacity: 1 - exit,
        ...style,
      }}
    >
      {words.map((w, i) => {
        const s = sp(frame, fps, delay + i * stagger, SPRING_SUBTLE);
        const rise = mode === 'rise' ? (1 - s) * 0.45 : (1 - s) * 0.12;
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              marginRight: i < words.length - 1 ? '0.26em' : 0,
              color: highlight.includes(w) ? highlightColor : undefined,
              opacity: clamp01(s * 1.6),
              transform: `translateY(${rise}em)`,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};
