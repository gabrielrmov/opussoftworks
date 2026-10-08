import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {lerp} from '../../lib/anim';

/** Plano: fundo próprio + leve "push-in" de câmera durante o plano. */
export const Shot: React.FC<{bg: string; dur: number; children: React.ReactNode; push?: number}> = ({bg, dur, children, push = 0.035}) => {
  const frame = useCurrentFrame();
  const s = lerp(1, 1 + push, frame / dur);
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
