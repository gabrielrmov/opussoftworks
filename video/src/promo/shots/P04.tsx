import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../../brand';
import {EASE_OUT, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {exitStyle, snap} from '../kit/fx';
import {KineticText, WeightMorph} from '../kit/KineticText';
import {Shot} from '../kit/Shot';

const GUIDE = 'rgba(255, 96, 57, 0.55)';
const LEFT = 110;
const CAP = 901;
const BASE = 1006;

/** 04 — "O que falta não é fazer mais." → "É direção." com guias de tipografia (processo de design à vista). */
export const P04: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const strike = prog(f, 20, 7, EASE_OUT) * (1 - prog(f, 36, 4));
  const hLine = prog(f, 54, 10, EASE_OUT);
  const vLine = prog(f, 56, 10, EASE_OUT);
  const notes = prog(f, 64, 8);
  const box = snap(f, fps, 68);
  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill style={exitStyle(f, 86, 10, 'zoom', '62% 50%')}>
        <At y={800}>
          <KineticText text="O que falta" size={62} family={FONT.text} weight={500} color={C.g700} mode="rise" delay={0} stagger={1} exitAt={34} exitMode="up" />
        </At>
        <At y={910}>
          <KineticText text="não é fazer mais." size={96} delay={5} stagger={1} exitAt={36} exitMode="drop" exitStagger={0.3} />
        </At>
        <div style={{position: 'absolute', left: 398, top: 912, width: 522 * strike, height: 10, borderRadius: 5, background: C.coral}} />

        {/* guias de construção */}
        {[CAP, BASE].map((y, i) => (
          <div key={y} style={{position: 'absolute', top: y, left: i ? 1080 * (1 - hLine) : 0, width: 1080 * hLine, height: 2, background: GUIDE}} />
        ))}
        {[LEFT, 822].map((x, i) => (
          <div key={x} style={{position: 'absolute', left: x, top: i ? 0 : 1920 * (1 - vLine), height: 1920 * vLine, width: 2, background: GUIDE}} />
        ))}
        <div style={{position: 'absolute', left: LEFT + 14, top: CAP - 52, opacity: notes, fontFamily: FONT.text, fontWeight: 500, fontSize: 26, color: C.coral}}>
          ● Exo 2 · ExtraBold
        </div>
        <div style={{position: 'absolute', left: 640, top: BASE + 22, opacity: notes, display: 'flex', alignItems: 'center', gap: 10, fontFamily: FONT.text, fontWeight: 500, fontSize: 26, color: C.coral}}>
          <div style={{width: 24, height: 24, borderRadius: 5, background: C.coral}} />
          #FF6039
        </div>

        <div style={{position: 'absolute', left: LEFT, top: 960, transform: 'translateY(-50%)', display: 'flex', alignItems: 'flex-end', gap: 36}}>
          <KineticText text="É" size={150} delay={50} />
          <WeightMorph text="direção." size={150} from={200} to={800} start={53} duration={20} color={C.coral} />
        </div>
        {box > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: 222,
              top: CAP - 14,
              width: 604,
              height: BASE - CAP + 40,
              border: `2px solid ${C.coral}`,
              transform: `scale(${0.9 + 0.1 * box})`,
              opacity: Math.min(1, box * 2),
            }}
          >
            {[
              [-9, -9],
              [595, -9],
              [-9, BASE - CAP + 31],
              [595, BASE - CAP + 31],
            ].map(([x, y]) => (
              <div key={`${x}${y}`} style={{position: 'absolute', left: x, top: y, width: 14, height: 14, background: C.white, border: `2px solid ${C.coral}`}} />
            ))}
          </div>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{background: C.coral, opacity: prog(f, 90, 6)}} />
    </Shot>
  );
};
