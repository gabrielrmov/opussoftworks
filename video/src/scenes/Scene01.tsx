import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../brand';
import {AnimatedCircle} from '../components/AnimatedCircle';
import {MaskText} from '../components/MaskText';
import {SceneTransition} from '../components/SceneTransition';
import {Stage} from '../components/Stage';
import {TextBlock} from '../components/TextBlock';
import {ThreadArc} from '../components/ThreadArc';
import {SPRING_SUBTLE, lerp, prog, sp} from '../lib/anim';
import {S1_CENTER} from '../lib/layout';

const RING = 'rgba(156, 156, 156, 0.55)';

/** CENA 01 — O início (0–4s): o ponto de partida e os círculos que expandem. */
export const Scene01: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {x, y} = S1_CENTER;

  const appear = prog(frame, 5, 6);
  const grow = sp(frame, fps, 10, SPRING_SUBTLE, 18);
  const dotR = frame < 5 ? 0 : lerp(0, 10, appear) + 20 * grow;

  return (
    <AbsoluteFill>
      <Stage>
        <ThreadArc draw={[40, 52]} retract={[100, 22]} baseDeg={-4} />
        <AnimatedCircle cx={x} cy={y} r={415} fromR={300} delay={50} duration={40} color={RING} strokeWidth={3} />
        <AnimatedCircle cx={x} cy={y} r={250} fromR={150} delay={35} duration={35} color={RING} strokeWidth={3} />
        <AnimatedCircle cx={x} cy={y} r={90} fromR={30} delay={20} duration={25} strokeWidth={5} />
        <AnimatedCircle cx={x} cy={y} r={415} fromR={30} delay={26} duration={56} strokeWidth={2} mode="ripple" opacity={0.35} />
        {dotR > 0 && <circle cx={x} cy={y} r={dotR} fill={C.coral} />}
        <SceneTransition type="iris" start={106} duration={29} origin={S1_CENTER} fromSize={415} color={C.g100} />
      </Stage>
      <TextBlock>
        <MaskText delay={60} duration={26} exitAt={104} style={{...TYPE.display, fontSize: 92, color: C.graphite}}>
          Toda empresa
        </MaskText>
        <MaskText delay={75} duration={26} exitAt={108} style={{...TYPE.display, fontSize: 92, color: C.coral}}>
          quer crescer.
        </MaskText>
      </TextBlock>
    </AbsoluteFill>
  );
};
