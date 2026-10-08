import React from 'react';
import {AbsoluteFill, Freeze, useCurrentFrame} from 'remotion';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {linearTiming, springTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {slide} from '@remotion/transitions/slide';
import {C} from '../brand';
import {Grain} from './kit/Ambient';
import {RealTimeProvider} from './kit/RealTime';
import {barWipe, circleReveal, zoomThrough} from './kit/Transitions';
import {P01} from './shots/P01';
import {P02} from './shots/P02';
import {P03} from './shots/P03';
import {P04} from './shots/P04';
import {P05} from './shots/P05';
import {P06} from './shots/P06';
import {P07} from './shots/P07';
import {P08} from './shots/P08';
import {P09} from './shots/P09';
import {P10} from './shots/P10';
import {P11} from './shots/P11';
import {P12} from './shots/P12';
import {P13} from './shots/P13';
import {P14} from './shots/P14';
import {P15} from './shots/P15';
import {Hold, remapFrame, shotLength, SHOTS, TRANSITIONS} from './timing';

const COMPONENTS = [P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15];

const PRESENTATIONS = {
  zoom: () => zoomThrough(),
  slideUp: () => slide({direction: 'from-bottom'}),
  slideLeft: () => slide({direction: 'from-right'}),
  bar: () => barWipe(C.coral),
  circle: () => circleReveal(540, 900),
  fade: () => fade(),
} as const;

/** Aplica as pausas de leitura: o conteúdo do plano vê o tempo remapeado. */
const Retimed: React.FC<{holds: Hold[]; children: React.ReactNode}> = ({holds, children}) => {
  const frame = useCurrentFrame();
  return holds.length ? <Freeze frame={remapFrame(frame, holds)}>{children}</Freeze> : <>{children}</>;
};

const GrainLayer: React.FC = () => {
  const frame = useCurrentFrame();
  return <Grain frame={frame} opacity={0.06} />;
};

/** Promo OPUS SOFTWORKS: 15 planos com transições desenhadas, motion blur e pausas de leitura. */
export const OpusPromo: React.FC = () => (
  <AbsoluteFill style={{background: C.white}}>
    <CameraMotionBlur shutterAngle={180} samples={6}>
      <TransitionSeries>
        {SHOTS.flatMap((s, i) => {
          const Shot = COMPONENTS[i];
          const items = [
            <TransitionSeries.Sequence key={s.name} name={s.name} durationInFrames={shotLength(s)}>
              <RealTimeProvider length={shotLength(s)}>
                <Retimed holds={s.holds}>
                  <Shot dur={s.dur} />
                </Retimed>
              </RealTimeProvider>
            </TransitionSeries.Sequence>,
          ];
          const tr = TRANSITIONS[i];
          if (tr) {
            items.push(
              <TransitionSeries.Transition
                key={`${s.name}-t`}
                presentation={PRESENTATIONS[tr.kind]() as never}
                timing={tr.spring ? springTiming({config: {damping: 200}, durationInFrames: tr.frames}) : linearTiming({durationInFrames: tr.frames})}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
    </CameraMotionBlur>
    <GrainLayer />
  </AbsoluteFill>
);
