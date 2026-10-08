import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {AnimatedLine} from '../../components/AnimatedLine';
import {Stage} from '../../components/Stage';
import {At} from '../kit/At';
import {exitStyle} from '../kit/fx';
import {KineticText, WeightMorph} from '../kit/KineticText';
import {Shot} from '../kit/Shot';

/** 12 — Slogan: "Estratégia," ganha peso; "execução." entra em coral e é sublinhada. */
export const P12: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill style={exitStyle(f, 80, 10, 'shrink', '50% 50%')}>
        <At y={820}>
          <WeightMorph text="Estratégia," size={132} from={200} to={800} start={2} duration={22} spacingFrom={0.25} spacingTo={-0.01} />
        </At>
        <At y={955}>
          <KineticText text="aliada à" size={72} family={FONT.text} weight={400} color={C.g700} mode="rise" delay={18} stagger={1} />
        </At>
        <At y={1085}>
          <KineticText text="execução." size={150} color={C.coral} delay={26} stagger={1.4} />
        </At>
        <Stage>
          <AnimatedLine d="M215 1190 C 420 1225, 680 1225, 870 1178" draw={[44, 12]} width={12} />
        </Stage>
      </AbsoluteFill>
    </Shot>
  );
};
