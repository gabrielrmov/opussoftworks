import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {OpusLaunchFilm} from './Film';
import {DURATION, FPS, HEIGHT, WIDTH} from './timing';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="OpusLaunchFilm"
    component={OpusLaunchFilm}
    durationInFrames={DURATION}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
