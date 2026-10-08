import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {AnimatedCircle} from '../../components/AnimatedCircle';
import {OpusSymbol} from '../../components/OpusSymbol';
import {Stage} from '../../components/Stage';
import {EASE_IN_OUT, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {Cursor} from '../kit/Cursor';
import {exitStyle, pulse} from '../kit/fx';
import {Glow} from '../kit/IconTile';
import {KineticText} from '../kit/KineticText';
import {Shot} from '../kit/Shot';

/** 13 — Marca: anéis, o infinito se desenha, wordmark e assinatura; o cursor clica na marca. */
export const P13: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const punch = 1 - 0.05 * pulse(f, 82, 5);
  return (
    <Shot bg={C.white} dur={dur} push={0.025}>
      <AbsoluteFill style={exitStyle(f, 110, 10, 'blur')}>
        <Glow x={540} y={900} size={820} opacity={0.12} />
        <Stage>
          <AnimatedCircle cx={540} cy={900} r={330} delay={0} duration={24} strokeWidth={3} opacity={0.5} />
          <AnimatedCircle cx={540} cy={900} r={460} delay={4} duration={24} strokeWidth={3} opacity={0.32} />
          <AnimatedCircle cx={540} cy={900} r={600} delay={8} duration={24} strokeWidth={3} opacity={0.2} />
          <OpusSymbol cx={540} cy={790} width={470} progress={prog(f, 6, 30, EASE_IN_OUT)} />
        </Stage>
        <At y={1060} style={{transform: `scale(${punch})`}}>
          <KineticText
            segments={[
              {text: 'Opus', color: C.coral, weight: 700},
              {text: 'SoftWorks', weight: 500},
            ]}
            size={104}
            mode="blur"
            delay={30}
            stagger={0.6}
          />
        </At>
        <At y={1160}>
          <KineticText text="Estratégia, aliada à execução." size={42} family={FONT.text} weight={400} color={C.g700} mode="rise" delay={44} stagger={0.4} />
        </At>
        <Cursor
          keys={[
            {f: 58, x: 960, y: 1520},
            {f: 78, x: 620, y: 1078},
            {f: 100, x: 900, y: 1400},
          ]}
          clicks={[82]}
          vanish={96}
        />
      </AbsoluteFill>
    </Shot>
  );
};
