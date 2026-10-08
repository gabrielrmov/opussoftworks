import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, TYPE} from '../brand';
import {AnimatedLine} from '../components/AnimatedLine';
import {MaskText} from '../components/MaskText';
import {MethodStep, MethodTimeline, stepDelay} from '../components/MethodTimeline';
import {SceneTransition} from '../components/SceneTransition';
import {Stage} from '../components/Stage';
import {TextBlock} from '../components/TextBlock';
import {EASE_IN_OUT, lerp, prog} from '../lib/anim';
import {lineD, pt} from '../lib/geometry';
import {S5_NODES, TEXT_X, TIMELINE} from '../lib/layout';

const STEPS: (MethodStep & {name: string})[] = [
  {n: '01', short: 'DIAG.', name: 'Diagnóstico'},
  {n: '02', short: 'ESTRAT.', name: 'Estratégia'},
  {n: '03', short: 'IMPL.', name: 'Implementação'},
  {n: '04', short: 'OTIM.', name: 'Otimização contínua'},
];

const EXIT = 146;
const {xs, y} = TIMELINE;
const FULL_D = lineD(pt(0, y), pt(1080, y));

/** CENA 06 — O método Opus (26–32s): a linha central vira a timeline das quatro etapas. */
export const Scene06: React.FC = () => {
  const frame = useCurrentFrame();
  const expand = prog(frame, EXIT + 4, 14, EASE_IN_OUT);
  const showFull = frame >= EXIT;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: TEXT_X,
          top: 660,
          ...TYPE.label,
          fontSize: 30,
          letterSpacing: '0.18em',
          color: C.g500,
        }}
      >
        <MaskText delay={6} exitAt={EXIT}>
          O MÉTODO OPUS
        </MaskText>
      </div>

      <MethodTimeline steps={STEPS} xs={xs} y={y} r={TIMELINE.r} originX={S5_NODES.center.x} exitAt={EXIT} />

      {showFull && (
        <Stage>
          <AnimatedLine d={FULL_D} window={[lerp(xs[0] / 1080, 0, expand), lerp(xs[3] / 1080, 1, expand)]} width={5} cap="butt" />
        </Stage>
      )}

      <TextBlock top={1240} gap={34}>
        {STEPS.map((s, i) => (
          <MaskText key={s.n} delay={stepDelay(i) + 10} exitAt={EXIT + i * 2}>
            <span style={{...TYPE.label, fontSize: 34, color: C.coral, display: 'inline-block', width: 90}}>{s.n}</span>
            <span style={{...TYPE.display, fontWeight: 700, fontSize: 62, color: C.graphite}}>{s.name}</span>
          </MaskText>
        ))}
      </TextBlock>

      <Stage>
        <SceneTransition type="split" start={EXIT + 12} duration={22} origin={pt(540, y)} color={C.white} />
      </Stage>
    </AbsoluteFill>
  );
};
