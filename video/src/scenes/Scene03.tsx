import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../brand';
import {AnimatedLine} from '../components/AnimatedLine';
import {MaskText} from '../components/MaskText';
import {ProblemCard} from '../components/ProblemCard';
import {Stage} from '../components/Stage';
import {Row, TextBlock} from '../components/TextBlock';
import {ThreadArc} from '../components/ThreadArc';
import {EASE_IN, EASE_IN_OUT, SPRING_SOFT, lerp, prog, sp} from '../lib/anim';
import {dist, lineD, pt} from '../lib/geometry';
import {S3_NODES} from '../lib/layout';
import {PROBLEM_CARDS, PROBLEM_END, problemCardPose} from './problemCards';

const {a: A, b: B, center: O, bottom: D} = S3_NODES;

// Linha que atravessa a tela passando pelos pontos onde a rede vai se formar.
const ENTRY = pt(-60, 470);
const EXIT = pt(1140, 470);
const CROSS_D = `M${ENTRY.x} ${ENTRY.y} L${A.x} ${A.y} L${O.x} ${O.y} L${B.x} ${B.y} L${EXIT.x} ${EXIT.y}`;
const legs = [dist(ENTRY, A), dist(A, O), dist(O, B), dist(B, EXIT)];
const total = legs.reduce((s, v) => s + v, 0);
const F_A = legs[0] / total;
const F_B = (legs[0] + legs[1] + legs[2]) / total;

// card da cena 02 → nó da rede, e o momento em que a linha passa por ele
const TARGETS = [A, B, O, D];
const MORPH_DELAY = [7, 17, 12, 20];
const NODE = 32;

/** CENA 03 — A virada (9–13s): uma linha atravessa a tela e organiza tudo numa rede. */
export const Scene03: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const head = prog(frame, 0, 26, EASE_IN_OUT);
  const trim = prog(frame, 32, 20, EASE_IN_OUT);
  const crossWindow: [number, number] = [trim * F_A, lerp(head, F_B, trim)];
  const split = frame >= 54; // a linha contínua vira três ramos independentes
  const branchTail = prog(frame, 98, 16, EASE_IN_OUT);
  const centerOut = prog(frame, 100, 12, EASE_IN);

  return (
    <AbsoluteFill>
      <Stage>
        <ThreadArc draw={[16, 44]} retract={[92, 22]} baseDeg={-2} />
        {!split && <AnimatedLine d={CROSS_D} window={crossWindow} width={6} />}
        {split && <AnimatedLine d={lineD(O, A)} window={[branchTail, 1]} width={6} />}
        {split && <AnimatedLine d={lineD(O, B)} window={[branchTail, 1]} width={6} />}
        <AnimatedLine d={lineD(O, D)} draw={[24, 20]} retract={[98, 16]} width={6} />
      </Stage>
      {PROBLEM_CARDS.map((c, i) => {
        const start = problemCardPose(i, PROBLEM_END, fps);
        const m = sp(frame, fps, MORPH_DELAY[i], SPRING_SOFT, 30);
        const target = TARGETS[i];
        const isCenter = target === O;
        return (
          <ProblemCard
            key={i}
            kind={c.kind}
            bars={[1, 1]}
            x={lerp(start.x, target.x, m)}
            y={lerp(start.y, target.y, m)}
            w={lerp(250, NODE, m)}
            h={lerp(290, NODE, m)}
            radius={lerp(22, NODE / 2, m)}
            rot={lerp(start.rot, 0, m)}
            bg={interpolateColors(m, [0.55, 0.8], [C.white, C.coral])}
            borderOpacity={1 - m}
            contentOpacity={1 - Math.min(1, m * 3)}
            opacity={isCenter ? 1 - centerOut : 1}
          />
        );
      })}
      <TextBlock top={1460}>
        <MaskText delay={40} exitAt={96} style={{...TYPE.body, fontSize: 66, color: C.graphite}}>
          O que falta não é
        </MaskText>
        <MaskText delay={48} exitAt={99} style={{...TYPE.body, fontSize: 66, color: C.graphite, marginTop: 6}}>
          fazer mais.
        </MaskText>
        <Row style={{...TYPE.display, fontSize: 96, marginTop: 22}}>
          <MaskText inline delay={60} exitAt={102} color={C.graphite}>
            É
          </MaskText>
          <MaskText inline delay={66} exitAt={102} color={C.coral}>
            direção.
          </MaskText>
        </Row>
      </TextBlock>
    </AbsoluteFill>
  );
};
