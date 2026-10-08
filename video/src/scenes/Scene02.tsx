import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../brand';
import {MaskText} from '../components/MaskText';
import {ProblemCard} from '../components/ProblemCard';
import {Stage} from '../components/Stage';
import {TextBlock} from '../components/TextBlock';
import {EASE_IN_OUT, EASE_OUT, SPRING_SUBTLE, prog, sp} from '../lib/anim';
import {Pt, quadAt} from '../lib/geometry';
import {PROBLEM_CARDS, problemCardPose} from './problemCards';

type Side = 'left' | 'right' | 'top' | 'bottom';
const anchor = (p: {x: number; y: number}, side: Side): Pt =>
  side === 'left' ? {x: p.x - 125, y: p.y} : side === 'right' ? {x: p.x + 125, y: p.y} : side === 'top' ? {x: p.x, y: p.y - 145} : {x: p.x, y: p.y + 145};

// Ligações que nunca se completam: param no meio do caminho.
const LINKS: {from: number; fromSide: Side; to: number; toSide: Side; reach: number; delay: number; bend: number}[] = [
  {from: 0, fromSide: 'right', to: 1, toSide: 'left', reach: 0.62, delay: 44, bend: 40},
  {from: 0, fromSide: 'bottom', to: 2, toSide: 'top', reach: 0.56, delay: 50, bend: -30},
  {from: 1, fromSide: 'bottom', to: 3, toSide: 'top', reach: 0.5, delay: 56, bend: 36},
  {from: 2, fromSide: 'right', to: 3, toSide: 'left', reach: 0.46, delay: 62, bend: -34},
];

const TITLE = {...TYPE.display, fontSize: 86};

/** CENA 02 — O problema (4–9s): cards desconectados, linhas que não chegam. */
export const Scene02: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const poses = PROBLEM_CARDS.map((_, i) => problemCardPose(i, frame, fps));
  const out = prog(frame, 128, 18, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      <Stage>
        {LINKS.map((l, i) => {
          const a = anchor(poses[l.from], l.fromSide);
          const b = anchor(poses[l.to], l.toSide);
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
          const c = {x: mx + (-(b.y - a.y) / len) * l.bend, y: my + ((b.x - a.x) / len) * l.bend};
          const drawn = prog(frame, l.delay, 26, EASE_OUT) * l.reach * (1 - out);
          const end = quadAt(a, c, b, drawn);
          const dot = sp(frame, fps, l.delay + 20, SPRING_SUBTLE) * (1 - out);
          return (
            <g key={i}>
              {drawn > 0.002 && (
                <path
                  d={`M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`}
                  fill="none"
                  stroke={C.g500}
                  strokeOpacity={0.7}
                  strokeWidth={3}
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={`${drawn} 2`}
                />
              )}
              {dot > 0.01 && <circle cx={end.x} cy={end.y} r={8 * dot} fill={C.coral} />}
            </g>
          );
        })}
      </Stage>
      {poses.map((p, i) => {
        const c = PROBLEM_CARDS[i];
        return (
          <ProblemCard
            key={i}
            {...p}
            kind={c.kind}
            bars={[prog(frame, c.delay + 12, 18), prog(frame, c.delay + 17, 18)]}
          />
        );
      })}
      <TextBlock top={1450}>
        <MaskText delay={70} exitAt={130} style={{...TITLE, color: C.graphite}}>
          Mas crescer
        </MaskText>
        <MaskText delay={80} exitAt={133} style={{...TITLE, color: C.coral}}>
          sem direção
        </MaskText>
        <MaskText delay={90} exitAt={136} style={{...TITLE, color: C.graphite}}>
          custa caro.
        </MaskText>
      </TextBlock>
    </AbsoluteFill>
  );
};
