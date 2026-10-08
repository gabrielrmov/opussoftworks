import React from 'react';
import {useCurrentFrame} from 'remotion';
import {arcD} from '../lib/geometry';
import {THREAD} from '../lib/layout';
import {AnimatedLine} from './AnimatedLine';

const D = arcD(THREAD.center, THREAD.r, THREAD.fromDeg, THREAD.toDeg);

/** Fio condutor coral (arco do infinito) que atravessa os boards 01, 03 e 05. */
export const ThreadArc: React.FC<{draw: [number, number]; retract: [number, number]; spin?: number; baseDeg?: number}> = ({
  draw,
  retract,
  spin = 0.07,
  baseDeg = 0,
}) => {
  const frame = useCurrentFrame();
  const angle = baseDeg + frame * spin;
  return (
    <AnimatedLine
      d={D}
      draw={draw}
      retract={retract}
      width={6}
      transform={`rotate(${angle} ${THREAD.center.x} ${THREAD.center.y})`}
    />
  );
};
