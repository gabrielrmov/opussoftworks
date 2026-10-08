import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {AnimatedLine} from '../../components/AnimatedLine';
import {Stage} from '../../components/Stage';
import {EASE_IN, EASE_OUT, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {pulse} from '../kit/fx';
import {KineticText} from '../kit/KineticText';

/** 11 — "Resultado não é sorte." cai; um painel coral bate com "É entrega." gigante. */
export const P11: React.FC<{dur: number}> = () => {
  const f = useCurrentFrame();
  const slam = 1 - prog(f, 46, 8, EASE_OUT);
  const leave = prog(f, 104, 10, EASE_IN);
  const shake = Math.sin(f * 2.4) * 14 * pulse(f, 63, 7);
  return (
    <AbsoluteFill style={{background: C.white, overflow: 'hidden'}}>
      <At y={800}>
        <KineticText text="Resultado" size={128} delay={0} stagger={1.2} exitAt={38} exitMode="drop" exitStagger={0.7} />
      </At>
      <At y={940}>
        <KineticText text="não é sorte." size={120} delay={6} stagger={1.1} exitAt={40} exitMode="drop" exitStagger={0.7} />
      </At>
      <AbsoluteFill style={{transform: `translateY(${slam * 2300 - leave * 2300}px) translateX(${shake}px)`}}>
        <div style={{position: 'absolute', left: -300, top: -200, width: 1680, height: 2400, background: C.coral, transform: `rotate(${-8 * slam}deg)`}} />
        <div
          style={{
            position: 'absolute',
            top: 960,
            left: 540,
            transform: `translate(-50%, -50%) translateX(${300 - f * 6}px)`,
            fontFamily: FONT.title,
            fontWeight: 900,
            fontSize: 560,
            lineHeight: 1,
            color: C.white,
            opacity: 0.1,
            whiteSpace: 'nowrap',
          }}
        >
          ENTREGA
        </div>
        <At y={780}>
          <KineticText text="É" size={210} color={C.white} mode="slam" delay={56} />
        </At>
        <At y={1000}>
          <KineticText text="entrega." size={190} color={C.white} mode="slam" delay={60} stagger={1.3} />
        </At>
        <Stage>
          <AnimatedLine d="M150 1135 C 380 1185, 700 1180, 935 1118" draw={[72, 14]} width={14} color={C.white} />
        </Stage>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
