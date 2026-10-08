import React from 'react';
import {AbsoluteFill} from 'remotion';
import {LogoReveal} from '../components/LogoReveal';
import {LOGO, PROMISE_LINE} from '../lib/layout';

/** CENA 08 — Revelação (37–45s): a linha coral desenha o símbolo; os 2s finais ficam parados. */
export const Scene08: React.FC = () => (
  <AbsoluteFill>
    <LogoReveal
      cx={LOGO.cx}
      cy={LOGO.cy}
      width={LOGO.width}
      leadIn={PROMISE_LINE}
      wordmarkY={1100}
      sloganY={1232}
      ctaY={1440}
      slogan="Estratégia, aliada à execução."
      url="opussoftworks.com.br"
    />
  </AbsoluteFill>
);
