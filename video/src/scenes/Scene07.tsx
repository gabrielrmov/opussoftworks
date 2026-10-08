import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C, TYPE} from '../brand';
import {AnimatedLine} from '../components/AnimatedLine';
import {AnimatedText} from '../components/AnimatedText';
import {MaskText} from '../components/MaskText';
import {Stage} from '../components/Stage';
import {TextBlock} from '../components/TextBlock';
import {EASE_OUT} from '../lib/anim';
import {lineD, pt} from '../lib/geometry';
import {PROMISE_LINE} from '../lib/layout';

const BIG = {...TYPE.display, fontSize: 108, color: C.graphite};

/** CENA 07 — A promessa (32–37s): tela limpa, tipografia grande, "É entrega." em destaque. */
export const Scene07: React.FC = () => (
  <AbsoluteFill>
    <TextBlock top={600}>
      <MaskText from="top" delay={6} duration={26} exitAt={124} style={BIG}>
        Resultado
      </MaskText>
      <MaskText from="top" delay={16} duration={26} exitAt={127} style={{...BIG, marginTop: 4}}>
        não é sorte.
      </MaskText>
      <AnimatedText text="É entrega." highlight={['entrega.']} delay={52} stagger={4} mode="scale" fontSize={156} exitAt={128} style={{marginTop: 70}} />
    </TextBlock>
    <Stage>
      <AnimatedLine
        d={lineD(pt(PROMISE_LINE.x1, PROMISE_LINE.y), pt(PROMISE_LINE.x2, PROMISE_LINE.y))}
        draw={[72, 26]}
        easing={EASE_OUT}
        width={PROMISE_LINE.width}
      />
    </Stage>
  </AbsoluteFill>
);
