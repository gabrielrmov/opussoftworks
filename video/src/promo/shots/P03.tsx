import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {AnimatedCircle} from '../../components/AnimatedCircle';
import {Stage} from '../../components/Stage';
import {prog} from '../../lib/anim';
import {At} from '../kit/At';
import {Glow, IconTile} from '../kit/IconTile';
import {KineticText, WeightMorph} from '../kit/KineticText';
import {Shot} from '../kit/Shot';

/** 03 — "Conheça a OpusSoftWorks": o nome aperta o espaçamento e ganha peso, entre ícones desfocados. */
export const P03: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const sharp = prog(f, 12, 18);
  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill>
        <Glow x={540} y={960} size={900} opacity={0.12} />
        <Glow x={100} y={1700} size={500} opacity={0.2} />
        <IconTile glyph="infinity" x={190} y={1460} size={230} delay={2} rot={-10} blur={10} drift={0.8} variant="white" />
        <IconTile glyph="plus" x={900} y={520} size={110} delay={5} rot={12} blur={3} drift={0.4} />
        <IconTile glyph="cursor" x={860} y={1310} size={130} delay={8} rot={8} variant="white" drift={0.6} />
        <IconTile glyph="code" x={180} y={520} size={92} delay={6} rot={-8} blur={6} variant="white" drift={0.5} />
        <Stage>
          <AnimatedCircle cx={540} cy={990} r={620} fromR={80} delay={26} duration={34} strokeWidth={3} mode="ripple" opacity={0.5} />
          <AnimatedCircle cx={540} cy={990} r={620} fromR={80} delay={34} duration={34} strokeWidth={2} mode="ripple" opacity={0.35} />
        </Stage>
        <At y={880}>
          <KineticText text="Conheça a" size={52} family={FONT.text} weight={400} color={C.g500} mode="blur" delay={6} stagger={1} />
        </At>
        <At y={990} style={{filter: `blur(${(1 - sharp) * 14}px)`}}>
          <WeightMorph
            text="OpusSoftWorks"
            parts={[
              {text: 'Opus', color: C.coral, to: 800},
              {text: 'SoftWorks', to: 600},
            ]}
            size={112}
            from={300}
            to={800}
            start={12}
            duration={18}
            spacingFrom={0.35}
            spacingTo={-0.01}
          />
        </At>
      </AbsoluteFill>
      <AbsoluteFill style={{background: C.coral, opacity: 1 - prog(f, 0, 10)}} />
    </Shot>
  );
};
