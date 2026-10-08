import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Backdrop, Camera, TopRule} from './components/Frame';
import {Scene01} from './scenes/Scene01';
import {Scene02} from './scenes/Scene02';
import {Scene03} from './scenes/Scene03';
import {Scene04} from './scenes/Scene04';
import {Scene05} from './scenes/Scene05';
import {Scene06} from './scenes/Scene06';
import {Scene07} from './scenes/Scene07';
import {Scene08} from './scenes/Scene08';
import {SCENES} from './timing';

const ORDER = [
  ['01 · O início', SCENES.s1, Scene01],
  ['02 · O problema', SCENES.s2, Scene02],
  ['03 · A virada', SCENES.s3, Scene03],
  ['04 · As três frentes', SCENES.s4, Scene04],
  ['05 · Tudo funciona junto', SCENES.s5, Scene05],
  ['06 · O método Opus', SCENES.s6, Scene06],
  ['07 · A promessa', SCENES.s7, Scene07],
  ['08 · Revelação', SCENES.s8, Scene08],
] as const;

/** Filme de lançamento OPUS SOFTWORKS — 1080×1920, 30fps, 45s. */
export const OpusLaunchFilm: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Camera>
      {ORDER.map(([name, {from, duration}, Scene]) => (
        <Sequence key={name} name={name} from={from} durationInFrames={duration}>
          <Scene />
        </Sequence>
      ))}
      <TopRule />
    </Camera>
  </AbsoluteFill>
);
