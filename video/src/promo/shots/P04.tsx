import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {prog} from '../../lib/anim';
import {At} from '../kit/At';
import {exitStyle} from '../kit/fx';
import {KineticText, WeightMorph} from '../kit/KineticText';
import {Compass, TaskPile} from '../kit/Extras';
import {ArrowUnder, Strike} from '../kit/Marks';
import {Shot} from '../kit/Shot';

/** 04 — "O que falta não é / fazer mais." (riscado) → "É direção." com uma seta que aponta o caminho. */
export const P04: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill style={exitStyle(f, 94, 10, 'zoom', '50% 50%')}>
        <TaskPile frame={f} start={2} exitAt={34} />
        <At y={830}>
          <KineticText text="O que falta não é" size={64} family={FONT.text} weight={500} color={C.g700} mode="rise" delay={0} stagger={0.8} exitAt={34} exitMode="up" />
        </At>
        <At y={970}>
          <Strike start={21} exitAt={36}>
            <KineticText text="fazer mais." size={140} delay={5} stagger={1.2} exitAt={36} exitMode="drop" exitStagger={0.4} />
          </Strike>
        </At>

        <Compass x={540} y={640} r={100} frame={f} color={C.coral} settleAt={58} opacity={prog(f, 46, 8)} />
        <At y={930}>
          <ArrowUnder start={70} thickness={11} gap={30}>
            <div style={{display: 'flex', alignItems: 'flex-end', gap: 34}}>
              <KineticText text="É" size={156} delay={50} />
              <WeightMorph text="direção." size={156} from={200} to={800} start={53} duration={20} color={C.coral} />
            </div>
          </ArrowUnder>
        </At>
      </AbsoluteFill>
      <AbsoluteFill style={{background: C.coral, opacity: prog(f, 98, 6)}} />
    </Shot>
  );
};
