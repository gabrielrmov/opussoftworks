import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {CLAMP, EASE_IN, EASE_OUT, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {KineticText} from '../kit/KineticText';
import {RayBurst} from '../kit/RayBurst';
import {Shot} from '../kit/Shot';

/** 02 — "Mas crescer / sem direção / custa caro." em painéis que invadem a tela + explosão de raios. */
export const P02: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const coral = 1 - prog(f, 26, 9, EASE_OUT);
  const dark = 1 - prog(f, 58, 9, EASE_OUT);
  return (
    <Shot bg={C.white} dur={dur}>
      <At y={900}>
        <KineticText text="Mas crescer" size={124} delay={0} stagger={1.3} />
      </At>
      <AbsoluteFill style={{transform: `translateX(${coral * 1100}px)`, background: C.coral, borderRadius: '110px 0 0 110px'}}>
        <At y={960}>
          <KineticText text="sem direção" size={128} color={C.white} mode="slam" delay={32} stagger={1.2} />
        </At>
      </AbsoluteFill>
      <AbsoluteFill style={{transform: `translateY(${dark * 1950}px)`, background: C.graphite, borderRadius: '110px 110px 0 0'}}>
        <At y={960}>
          <KineticText text="custa caro." size={132} color={C.coral} delay={63} stagger={1.2} />
        </At>
      </AbsoluteFill>
      {f >= 86 && (
        <RayBurst
          scale={interpolate(f, [86, 98], [0.15, 1.8], {...CLAMP, easing: EASE_IN})}
          rotate={f * 3}
          opacity={prog(f, 86, 3)}
        />
      )}
      <AbsoluteFill style={{background: C.coral, opacity: prog(f, 94, 4)}} />
    </Shot>
  );
};
