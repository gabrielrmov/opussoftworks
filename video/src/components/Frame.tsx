import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {C, HAIRLINE} from '../brand';
import {CLAMP, EASE_IN_OUT, EASE_SINE, prog} from '../lib/anim';
import {lineD, pt} from '../lib/geometry';
import {TOP_RULE} from '../lib/layout';
import {SCENES} from '../timing';
import {AnimatedLine} from './AnimatedLine';
import {Stage} from './Stage';

/** Fundo global: branco → #F4F5F8 (após a íris da cena 01) → branco (após a abertura da cena 06). */
export const Backdrop: React.FC = () => {
  const frame = useCurrentFrame();
  const grey = frame >= SCENES.s1.duration && frame < SCENES.s7.from;
  return <AbsoluteFill style={{backgroundColor: grey ? C.g100 : C.white}} />;
};

/** Câmera 2D quase imperceptível: escala 1.00↔1.02 e ±10px em Y. Para por completo antes do respiro final. */
export const Camera: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const env = interpolate(frame, [0, 1200, 1290], [1, 1, 0], {...CLAMP, easing: EASE_SINE});
  const scale = 1 + 0.02 * env * (0.5 - 0.5 * Math.cos((2 * Math.PI * frame) / 360));
  const ty = -10 * env * Math.sin((2 * Math.PI * frame) / 540);
  return <AbsoluteFill style={{transform: `translateY(${ty}px) scale(${scale})`}}>{children}</AbsoluteFill>;
};

/** Fio editorial no topo, presente do board 02 ao 07. */
export const TopRule: React.FC = () => {
  const frame = useCurrentFrame();
  const head = prog(frame, SCENES.s2.from + 6, 30, EASE_IN_OUT);
  const tail = prog(frame, SCENES.s7.from + 118, 22, EASE_IN_OUT);
  return (
    <Stage>
      <AnimatedLine d={lineD(pt(TOP_RULE.x1, TOP_RULE.y), pt(TOP_RULE.x2, TOP_RULE.y))} window={[tail, head]} color={HAIRLINE} width={2} cap="butt" />
    </Stage>
  );
};
