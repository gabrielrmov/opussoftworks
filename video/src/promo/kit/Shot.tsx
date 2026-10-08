import React from 'react';
import {AbsoluteFill} from 'remotion';
import {lerp} from '../../lib/anim';
import {Ambient, AmbientVariant} from './Ambient';
import {useRealTime} from './RealTime';

/**
 * Plano: fundo próprio + fundo vivo + câmera contínua (push-in com leve deriva).
 * Fundo e câmera seguem o tempo real, então continuam vivos durante as pausas de leitura.
 */
export const Shot: React.FC<{
  bg: string;
  dur: number;
  children: React.ReactNode;
  push?: number;
  ambient?: AmbientVariant | 'none';
  seed?: string;
}> = ({bg, children, push = 0.05, ambient = 'light', seed}) => {
  const {frame, length} = useRealTime();
  const t = frame / Math.max(1, length);
  const s = lerp(1, 1 + push, t);
  const drift = Math.sin(frame / 45) * 6;
  return (
    <AbsoluteFill style={{background: bg, overflow: 'hidden'}}>
      {ambient !== 'none' && <Ambient variant={ambient} seed={seed} />}
      <AbsoluteFill style={{transform: `translateY(${drift}px) scale(${s})`}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
