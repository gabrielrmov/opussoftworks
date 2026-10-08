import React from 'react';
import {C} from '../../brand';
import {At} from '../kit/At';
import {KineticText} from '../kit/KineticText';

/** Par "frente + benefício" usado nos planos 06–08 (textos do board 04). */
export const FrontLabel: React.FC<{kicker: string; word: string; y: number; delay: number; exitAt?: number}> = ({kicker, word, y, delay, exitAt}) => (
  <>
    <At y={y}>
      <KineticText text={kicker} size={40} weight={700} color={C.coral} letterSpacing="0.22em" mode="rise" delay={delay} stagger={0.8} exitAt={exitAt} />
    </At>
    <At y={y + 112}>
      <KineticText text={word} size={124} delay={delay + 4} stagger={1.3} exitAt={exitAt} />
    </At>
  </>
);
