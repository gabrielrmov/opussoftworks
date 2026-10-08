import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {EASE_IN, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {KineticText} from '../kit/KineticText';

/** 05 — "Três frentes.": o fundo coral se divide em três faixas que abrem a tela. */
export const P05: React.FC<{dur: number}> = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.white, overflow: 'hidden'}}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: i * 360 - 1,
            top: 0,
            width: 362,
            height: 1920,
            background: C.coral,
            transform: `translateY(${(i % 2 ? 1 : -1) * prog(f, 30 + i * 2, 10, EASE_IN) * 1960}px)`,
          }}
        />
      ))}
      <div
        style={{
          position: 'absolute',
          top: 960,
          left: 540,
          transform: `translate(-50%, -50%) translateX(${40 - f * 2}px)`,
          fontFamily: FONT.title,
          fontWeight: 900,
          fontSize: 1500,
          lineHeight: 1,
          color: C.white,
          opacity: 0.12 * (1 - prog(f, 28, 6)),
        }}
      >
        3
      </div>
      <At y={880}>
        <KineticText text="Três" size={230} color={C.white} mode="slam" delay={2} stagger={2} exitAt={28} />
      </At>
      <At y={1100}>
        <KineticText text="frentes." size={130} color={C.white} delay={8} stagger={1.2} exitAt={29} />
      </At>
    </AbsoluteFill>
  );
};
