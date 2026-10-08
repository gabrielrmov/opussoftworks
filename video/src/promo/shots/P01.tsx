import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {C, FONT} from '../../brand';
import {At} from '../kit/At';
import {exitStyle} from '../kit/fx';
import {Glow, IconTile} from '../kit/IconTile';
import {KineticText} from '../kit/KineticText';
import {Underline} from '../kit/Marks';
import {Shot} from '../kit/Shot';

/** 01 — Gancho: "Toda empresa quer crescer." com ícones de crescimento flutuando. */
export const P01: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill style={exitStyle(f, 56, 10, 'blur')}>
        <Glow x={120} y={280} size={560} />
        <Glow x={1000} y={1640} size={640} opacity={0.14} />
        <IconTile glyph="trend" x={250} y={560} size={180} delay={2} rot={-12} drift={0.6} />
        <IconTile glyph="target" x={860} y={650} size={124} delay={7} rot={10} blur={2} drift={0.9} />
        <IconTile glyph="bars" x={830} y={1390} size={150} delay={11} rot={8} drift={0.5} />
        <IconTile glyph="plus" x={220} y={1330} size={96} delay={15} rot={-6} blur={5} variant="white" drift={1} />
        <At y={890}>
          <KineticText text="Toda empresa" size={62} family={FONT.text} weight={500} mode="rise" delay={4} stagger={1} />
        </At>
        <At y={1005}>
          <Underline start={34} thickness={11} gap={26}>
            <KineticText text="quer crescer." size={118} color={C.coral} delay={12} stagger={1.6} />
          </Underline>
        </At>
      </AbsoluteFill>
    </Shot>
  );
};
