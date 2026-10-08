import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {OpusSymbol} from '../../components/OpusSymbol';
import {Stage} from '../../components/Stage';
import {EASE_IN_OUT, EASE_OUT, lerp, prog} from '../../lib/anim';

/** 15 — Assinatura: o símbolo se desenha sozinho e fica parado nos 2 segundos finais. */
export const P15: React.FC<{dur: number}> = () => {
  const f = useCurrentFrame();
  const s = lerp(0.9, 1, prog(f, 0, 24, EASE_OUT));
  return (
    <AbsoluteFill style={{background: C.white}}>
      <AbsoluteFill style={{transform: `scale(${s})`}}>
        <Stage>
          <OpusSymbol cx={540} cy={960} width={460} progress={prog(f, 0, 22, EASE_IN_OUT)} />
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
