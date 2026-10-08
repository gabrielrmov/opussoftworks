import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {AnimatedLine} from '../components/AnimatedLine';
import {ServiceCard, ServiceCardProps} from '../components/ServiceCard';
import {Stage} from '../components/Stage';
import {EASE_IN_OUT, prog} from '../lib/anim';
import {lineD, pt} from '../lib/geometry';
import {S3_NODES, S4_CARD, S4_CENTERS_Y} from '../lib/layout';

export const EXIT_S4 = 168;

// TRÁFEGO nasce do ramo esquerdo, SISTEMAS do ramo central, SITES do ramo direito.
export const SERVICES: Omit<ServiceCardProps, 'layer'>[] = [
  {title: 'TRÁFEGO', subtitle: 'Aquisição', icon: 'trafego', cy: S4_CENTERS_Y[0], enterFrom: 'left', delay: 10, origin: S3_NODES.a, originDelay: 0, exitAt: EXIT_S4},
  {title: 'SISTEMAS', subtitle: 'Automação', icon: 'sistemas', cy: S4_CENTERS_Y[1], enterFrom: 'center', delay: 20, origin: S3_NODES.bottom, originDelay: 4, exitAt: EXIT_S4},
  {title: 'SITES', subtitle: 'Presença', icon: 'sites', cy: S4_CENTERS_Y[2], enterFrom: 'right', delay: 30, origin: S3_NODES.b, originDelay: 8, exitAt: EXIT_S4},
];

const half = S4_CARD.tile / 2;
const SPINE_D = lineD(pt(S4_CARD.tileX, S4_CENTERS_Y[0] + half), pt(S4_CARD.tileX, S4_CENTERS_Y[2] - half));

/** CENA 04 — As três frentes (13–20s): três cards em sequência, ligados por uma linha coral. */
export const Scene04: React.FC = () => {
  const frame = useCurrentFrame();
  const head = prog(frame, 78, 28, EASE_IN_OUT);
  const converge = prog(frame, EXIT_S4 + 6, 20, EASE_IN_OUT);

  return (
    <AbsoluteFill>
      {SERVICES.map((s) => (
        <ServiceCard key={s.title} {...s} layer="body" />
      ))}
      <Stage>
        <AnimatedLine d={SPINE_D} window={[0.5 * converge, head - (head - 0.5) * converge]} width={6} />
      </Stage>
      {SERVICES.map((s) => (
        <ServiceCard key={s.title} {...s} layer="tile" />
      ))}
    </AbsoluteFill>
  );
};
