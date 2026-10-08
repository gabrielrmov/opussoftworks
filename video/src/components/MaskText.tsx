import React from 'react';
import {useCurrentFrame} from 'remotion';
import {EASE_IN, EASE_OUT, prog} from '../lib/anim';

type Props = {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  /** Direção de entrada pela máscara. */
  from?: 'bottom' | 'top';
  /** Frame em que a linha sai pela máscara (para cima). */
  exitAt?: number;
  exitDuration?: number;
  color?: string;
  inline?: boolean;
  style?: React.CSSProperties;
};

/** Linha de texto revelada por máscara vertical (overflow + translateY). */
export const MaskText: React.FC<Props> = ({
  children,
  delay = 0,
  duration = 24,
  from = 'bottom',
  exitAt,
  exitDuration = 14,
  color,
  inline = false,
  style,
}) => {
  const frame = useCurrentFrame();
  const enter = prog(frame, delay, duration, EASE_OUT);
  const exit = exitAt === undefined ? 0 : prog(frame, exitAt, exitDuration, EASE_IN);
  const dir = from === 'top' ? -1 : 1;
  const y = (1 - enter) * 125 * dir - exit * 125;
  return (
    <div
      style={{
        display: inline ? 'inline-block' : 'block',
        overflow: 'hidden',
        padding: '0.12em 0 0.16em',
        margin: '-0.12em 0 -0.16em',
        color,
        ...style,
      }}
    >
      <div style={{transform: `translateY(${y}%)`, whiteSpace: 'nowrap'}}>{children}</div>
    </div>
  );
};
