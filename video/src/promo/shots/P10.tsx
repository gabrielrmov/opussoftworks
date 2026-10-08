import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand';
import {clamp01, lerp, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {exitStyle, snap} from '../kit/fx';
import {Glyph, GlyphName} from '../kit/Glyph';
import {KineticText} from '../kit/KineticText';
import {Shot} from '../kit/Shot';

const STEPS: {n: string; name: string; glyph: GlyphName}[] = [
  {n: '01', name: 'Diagnóstico', glyph: 'search'},
  {n: '02', name: 'Estratégia', glyph: 'route'},
  {n: '03', name: 'Implementação', glyph: 'code'},
  {n: '04', name: 'Otimização contínua', glyph: 'loop'},
];
const AT = [20, 52, 84, 116];
const Y = 860;
const GAP = 135;
const X0 = 540 - 1.5 * GAP;

/** 10 — O método Opus: controle segmentado; a etapa ativa avança e o balão troca de nome. */
export const P10: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = snap(f, fps, 4);
  const idx = AT.slice(1).reduce((s, a) => s + snap(f, fps, a), 0);
  const activeX = X0 + idx * GAP;
  const tip = snap(f, fps, AT[0]);
  const fling = prog(f, 144, 12);

  return (
    <Shot bg={C.g100} dur={dur}>
      <AbsoluteFill style={exitStyle(f, 146, 10, 'blur')}>
        <At y={600}>
          <KineticText text="O MÉTODO OPUS" size={38} weight={700} color={C.g500} letterSpacing="0.2em" mode="rise" delay={0} stagger={0.7} />
        </At>

        <div
          style={{
            position: 'absolute',
            left: 540 - 300,
            top: Y - 75,
            width: 600,
            height: 150,
            borderRadius: 75,
            background: C.graphite,
            boxShadow: '0 30px 60px rgba(22,22,22,0.22)',
            transform: `translate(${(1 - enter) * -520 + fling * 700}px, ${(1 - enter) * 520 - fling * 500}px) rotate(${lerp(-30, 0, enter) + fling * 30}deg) scale(${lerp(0.5, 1, enter)})`,
            filter: enter < 0.97 || fling > 0 ? `blur(${(1 - clamp01(enter)) * 14 + fling * 20}px)` : undefined,
            opacity: clamp01(enter * 2),
          }}
        >
          <div style={{position: 'absolute', left: activeX - (540 - 300) - 58, top: 75 - 58, width: 116, height: 116, borderRadius: 58, background: C.coral, opacity: clamp01(tip * 2)}} />
          {STEPS.map((s, i) => {
            const near = clamp01(1 - Math.abs(idx - i)) * clamp01(tip * 2);
            return (
              <div key={s.n} style={{position: 'absolute', left: X0 + i * GAP - (540 - 300) - 55, top: 75 - 55, width: 110, height: 110, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Glyph name={s.glyph} size={56} color={interpolateColors(near, [0, 1], [C.g500, C.white])} strokeWidth={5} />
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: 'absolute',
            left: 540 - 330,
            top: Y + 130,
            width: 660,
            height: 116,
            transform: `scale(${tip * (1 - fling)})`,
            transformOrigin: `${activeX - 210}px 0`,
          }}
        >
          <div style={{position: 'absolute', left: activeX - 210 - 20, top: -16, width: 40, height: 40, background: C.coral, transform: 'rotate(45deg)', borderRadius: 6}} />
          <div style={{position: 'absolute', inset: 0, borderRadius: 58, background: C.coral, overflow: 'hidden', boxShadow: '0 20px 40px rgba(255,96,57,0.3)'}}>
            {STEPS.map((s, i) => (
              <div key={s.n} style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <KineticText text={s.name} size={50} weight={700} color={C.white} mode="rise" delay={AT[i] + 2} stagger={0.7} exitAt={AT[i + 1]} exitMode="up" exitStagger={0.3} />
              </div>
            ))}
          </div>
        </div>

        <div style={{position: 'absolute', left: 0, width: 1080, top: 1200, height: 300, overflow: 'hidden', opacity: 1 - fling}}>
          {STEPS.map((s, i) => (
            <At key={s.n} y={150}>
              <KineticText text={s.n} size={260} color={C.coral} mode="rise" delay={AT[i]} stagger={2} exitAt={AT[i + 1] ? AT[i + 1] - 2 : undefined} exitMode="up" />
            </At>
          ))}
        </div>
      </AbsoluteFill>
    </Shot>
  );
};
