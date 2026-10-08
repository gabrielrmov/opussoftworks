import React from 'react';
import {interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, HAIRLINE, TYPE} from '../brand';
import {EASE_IN, EASE_IN_OUT, SPRING_SOFT, SPRING_SUBTLE, clamp01, lerp, prog, sp} from '../lib/anim';
import {lineD, pt} from '../lib/geometry';
import {AnimatedLine} from './AnimatedLine';
import {Stage} from './Stage';

export type MethodStep = {n: string; short: string};

export const stepDelay = (i: number, first = 22, gap = 26) => first + i * gap;

type Props = {
  steps: MethodStep[];
  xs: number[];
  y: number;
  r?: number;
  first?: number;
  gap?: number;
  /** X de onde chega o ponto coral da cena anterior. */
  originX?: number;
  /** Frame em que a última etapa deixa de ser a ativa. */
  activeUntil?: number;
  exitAt?: number;
};

/** Timeline do método: linha desenhada, marcadores em sequência, linha ativa entre etapas. */
export const MethodTimeline: React.FC<Props> = ({
  steps,
  xs,
  y,
  r = 50,
  first = 22,
  gap = 26,
  originX,
  activeUntil = 128,
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const delays = steps.map((_, i) => stepDelay(i, first, gap));
  const exit = exitAt === undefined ? 0 : prog(frame, exitAt, 14, EASE_IN);
  const travel = sp(frame, fps, 0, SPRING_SOFT, 24);
  const dotX = originX === undefined ? xs[0] : lerp(originX, xs[0], travel);
  const firstPop = sp(frame, fps, delays[0], SPRING_SUBTLE);

  return (
    <>
      <Stage>
        <AnimatedLine d={lineD(pt(xs[0], y), pt(xs[xs.length - 1], y))} draw={[12, 26]} color={HAIRLINE} width={3} opacity={1 - exit} />
        {xs.slice(0, -1).map((x, i) => (
          <AnimatedLine
            key={i}
            d={lineD(pt(x + r, y), pt(xs[i + 1] - r, y))}
            draw={[delays[i] + 8, delays[i + 1] - delays[i] - 8]}
            width={5}
          />
        ))}
        {originX !== undefined && firstPop < 0.2 && <circle cx={dotX} cy={y} r={18} fill={C.coral} />}
      </Stage>
      {steps.map((step, i) => {
        const pop = sp(frame, fps, delays[i], SPRING_SUBTLE);
        if (pop <= 0.001) return null;
        const until = i < steps.length - 1 ? delays[i + 1] : activeUntil;
        const active = prog(frame, delays[i] + 2, 6) * (1 - prog(frame, until, 8));
        const out = exitAt === undefined ? 0 : prog(frame, exitAt + i * 2, 12, EASE_IN_OUT);
        const label = prog(frame, delays[i] + 6, 14);
        const size = r * 2;
        return (
          <React.Fragment key={step.n}>
            <div
              style={{
                position: 'absolute',
                left: xs[i] - r,
                top: y - r,
                width: size,
                height: size,
                borderRadius: r,
                background: interpolateColors(active, [0, 1], [C.white, C.coral]),
                boxShadow: `inset 0 0 0 5px ${C.coral}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `scale(${lerp(0.36, 1, pop) * (1 - out)})`,
                opacity: clamp01(pop * 3),
                ...TYPE.label,
                letterSpacing: '0.02em',
                fontSize: 30,
                color: interpolateColors(active, [0, 1], [C.coral, C.white]),
              }}
            >
              {step.n}
            </div>
            <div
              style={{
                position: 'absolute',
                left: xs[i] - 100,
                width: 200,
                top: y + r + 30,
                textAlign: 'center',
                ...TYPE.label,
                fontSize: 24,
                color: C.g700,
                opacity: label * (1 - exit),
                transform: `translateY(${(1 - label) * 16}px)`,
              }}
            >
              {step.short}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );
};
