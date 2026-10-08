import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {EASE_IN_OUT, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {exitStyle} from '../kit/fx';
import {KineticText} from '../kit/KineticText';
import {Shot} from '../kit/Shot';

const URL = 'opussoftworks.com.br';

/** 14 — O site é digitado e o botão coral (CTA do storyboard) se abre por trás dele. */
export const P14: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const pill = prog(f, 30, 12, EASE_IN_OUT);
  const caret = f < 30 && Math.floor(f / 6) % 2 === 0;
  return (
    <Shot bg={C.white} dur={dur} push={0.02}>
      <AbsoluteFill style={exitStyle(f, 58, 8, 'blur')}>
        <At y={960}>
          <KineticText text={URL} size={66} weight={700} color={C.coral} mode="type" delay={2} stagger={1.2} letterSpacing="0.01em" />
          <div style={{width: 6, height: 74, marginLeft: 6, background: C.coral, opacity: caret ? 1 : 0}} />
        </At>
        {/* a pílula abre do centro e, dentro dela, o mesmo texto já aparece em branco */}
        <AbsoluteFill style={{clipPath: `inset(0 ${540 - 400 + (1 - pill) * 400}px 0 ${540 - 400 + (1 - pill) * 400}px)`}}>
          <div
            style={{
              position: 'absolute',
              left: 540 - 400,
              top: 960 - 76,
              width: 800,
              height: 152,
              borderRadius: 76,
              background: C.coral,
              boxShadow: `0 24px 50px rgba(255,96,57,${0.3 * pill})`,
            }}
          />
          <At y={960}>
            <KineticText text={URL} size={66} weight={700} color={C.white} mode="type" delay={2} stagger={1.2} letterSpacing="0.01em" />
            <div style={{width: 6, height: 74, marginLeft: 6, opacity: 0}} />
          </At>
        </AbsoluteFill>
      </AbsoluteFill>
    </Shot>
  );
};
