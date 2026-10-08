import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, TYPE} from '../brand';
import {AnimatedCircle} from '../components/AnimatedCircle';
import {AnimatedLine} from '../components/AnimatedLine';
import {ConnectedNode, NodeLook} from '../components/ConnectedNode';
import {InfinityShape} from '../components/InfinityShape';
import {MaskText} from '../components/MaskText';
import {ServiceIconName} from '../components/ServiceIcon';
import {Stage} from '../components/Stage';
import {Row, TextBlock} from '../components/TextBlock';
import {ThreadArc} from '../components/ThreadArc';
import {EASE_IN, EASE_IN_OUT, EASE_SINE, SPRING_SOFT, SPRING_SUBTLE, lerp, prog, sp} from '../lib/anim';
import {lerpPt, lineD, Pt} from '../lib/geometry';
import {S4_CARD, S4_CENTERS_Y, S5_CORE_R, S5_NODE_SIZE, S5_NODES} from '../lib/layout';

const O = S5_NODES.center;

const NODES: {icon: ServiceIconName; label: string; side: 'top' | 'bottom'; to: Pt; from: Pt; delay: number}[] = [
  {icon: 'trafego', label: 'TRÁFEGO', side: 'top', to: S5_NODES.top, from: {x: S4_CARD.tileX, y: S4_CENTERS_Y[0]}, delay: 0},
  {icon: 'sistemas', label: 'SISTEMAS', side: 'bottom', to: S5_NODES.left, from: {x: S4_CARD.tileX, y: S4_CENTERS_Y[1]}, delay: 5},
  {icon: 'sites', label: 'SITES', side: 'bottom', to: S5_NODES.right, from: {x: S4_CARD.tileX, y: S4_CENTERS_Y[2]}, delay: 10},
];

const tileLook = (pos: Pt): NodeLook => ({pos, size: S4_CARD.tile, radius: 22, fill: C.coral, stroke: C.coral, strokeWidth: 0, glyph: C.white});
const nodeLook = (pos: Pt): NodeLook => ({pos, size: S5_NODE_SIZE, radius: S5_NODE_SIZE / 2, fill: C.white, stroke: C.coral, strokeWidth: 6, glyph: C.coral});

const TEXT = {...TYPE.display, fontSize: 92};

/** CENA 05 — Tudo funciona junto (20–26s): as três frentes convergem para um centro. */
export const Scene05: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const core = sp(frame, fps, 16, SPRING_SUBTLE);
  const breath = 1 + 0.06 * prog(frame, 96, 54, EASE_SINE);
  const collapse = prog(frame, 152, 26, EASE_IN_OUT);
  const coreR = lerp(S5_CORE_R * core * breath, 18, collapse);
  const nodeOut = prog(frame, 150, 18, EASE_IN);

  return (
    <AbsoluteFill>
      <Stage>
        <ThreadArc draw={[34, 46]} retract={[136, 22]} baseDeg={-6} />
        {NODES.map((n, i) => {
          const dx = O.x - n.to.x;
          const dy = O.y - n.to.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const a = {x: n.to.x + ux * (S5_NODE_SIZE / 2 + 12), y: n.to.y + uy * (S5_NODE_SIZE / 2 + 12)};
          const b = {x: O.x - ux * (S5_CORE_R + 12), y: O.y - uy * (S5_CORE_R + 12)};
          return <AnimatedLine key={n.label} d={lineD(a, b)} draw={[30 + i * 4, 24]} retract={[148, 18]} width={6} />;
        })}
        <AnimatedCircle cx={O.x} cy={O.y} r={250} fromR={S5_CORE_R} delay={104} duration={40} strokeWidth={3} mode="ripple" opacity={0.4} />
        {core > 0.001 && <circle cx={O.x} cy={O.y} r={coreR} fill={C.coral} />}
        <InfinityShape
          cx={O.x}
          cy={O.y}
          width={168 * breath * core}
          color={C.white}
          strokeWidth={13}
          progress={prog(frame, 28, 30, EASE_IN_OUT)}
          opacity={1 - prog(frame, 148, 10)}
        />
      </Stage>

      {NODES.map((n) => {
        const t = sp(frame, fps, n.delay, SPRING_SOFT, 36);
        const pos = lerpPt(lerpPt(n.from, n.to, t), O, nodeOut * 0.35);
        return (
          <ConnectedNode
            key={n.label}
            from={tileLook(n.from)}
            to={nodeLook(pos)}
            t={t}
            icon={n.icon}
            scale={1 - nodeOut * 0.6}
            opacity={1 - nodeOut}
            label={n.label}
            labelT={prog(frame, 40 + n.delay, 20) * (1 - prog(frame, 146, 10, EASE_IN))}
            labelSide={n.side}
          />
        );
      })}

      <TextBlock top={1470}>
        <MaskText delay={58} exitAt={144} style={{...TYPE.body, fontSize: 66, color: C.graphite}}>
          É fazer tudo
        </MaskText>
        <Row style={{...TEXT, marginTop: 18}}>
          <MaskText inline delay={66} exitAt={147} color={C.graphite}>
            funcionar
          </MaskText>
          <MaskText inline delay={76} exitAt={147} color={C.coral}>
            junto.
          </MaskText>
        </Row>
      </TextBlock>
    </AbsoluteFill>
  );
};
