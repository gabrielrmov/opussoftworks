import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
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
import {SHOTS} from './timing';

const COMPONENTS = [P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12, P13, P14, P15];

/** Promo OPUS SOFTWORKS no ritmo da referência: 15 planos curtos, 45s. */
export const OpusPromo: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill style={{background: '#FFFFFF'}}>
      {SHOTS.map(([name, dur], i) => {
        const Shot = COMPONENTS[i];
        const seq = (
          <Sequence key={name} name={name} from={from} durationInFrames={dur}>
            <Shot dur={dur} />
          </Sequence>
        );
        from += dur;
        return seq;
      })}
    </AbsoluteFill>
  );
};
