import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {OpusLaunchFilm} from './Film';
import {OpusPromo} from './promo/PromoFilm';
import {PROMO_DURATION} from './promo/timing';
import {DURATION, FPS, HEIGHT, WIDTH} from './timing';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="OpusLaunchFilm"
      component={OpusLaunchFilm}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
    <Composition
      id="OpusPromo"
      component={OpusPromo}
      durationInFrames={PROMO_DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  </>
);
