import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand';
import {AnimatedCircle} from '../../components/AnimatedCircle';
import {Stage} from '../../components/Stage';
import {CLAMP, EASE_IN, EASE_IN_OUT, lerp, prog} from '../../lib/anim';
import {Cursor} from '../kit/Cursor';
import {BOUNCE, pulse, snap} from '../kit/fx';
import {Glow} from '../kit/IconTile';
import {Shot} from '../kit/Shot';
import {PillButton} from '../kit/UI';
import {FrontLabel} from './Labels';

const O = {x: 540, y: 860};
const TAIL = {x: 120, y: 1340};

/** 06 — TRÁFEGO: o botão é clicado e vira um alvo; a seta acerta o centro. Aquisição. */
export const P06: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = snap(f, fps, 0, BOUNCE);
  const press = pulse(f, 32, 4);
  const gone = prog(f, 37, 9, EASE_IN);
  const fly = interpolate(f, [50, 58], [0, 1], {...CLAMP, easing: EASE_IN});
  const tip = {x: lerp(TAIL.x - 300, O.x, fly), y: lerp(TAIL.y + 380, O.y, fly)};
  const ang = Math.atan2(O.y - TAIL.y, O.x - TAIL.x);
  const back = {x: tip.x - Math.cos(ang) * 230, y: tip.y - Math.sin(ang) * 230};
  const shake = Math.sin(f * 2.6) * 12 * pulse(f, 59, 7);

  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
        <Glow x={980} y={300} size={520} opacity={0.12} />
        <Stage>
          <AnimatedCircle cx={O.x} cy={O.y} r={320} delay={48} duration={14} strokeWidth={4} opacity={0.5} />
          <AnimatedCircle cx={O.x} cy={O.y} r={215} delay={44} duration={14} strokeWidth={6} opacity={0.75} />
          <AnimatedCircle cx={O.x} cy={O.y} r={112} delay={40} duration={14} strokeWidth={9} />
          <AnimatedCircle cx={O.x} cy={O.y} r={44} delay={42} duration={10} fill={C.coral} strokeWidth={0} />
          <AnimatedCircle cx={O.x} cy={O.y} r={460} fromR={60} delay={58} duration={22} strokeWidth={5} mode="ripple" opacity={0.7} />
          {fly > 0 && (
            <g opacity={1 - prog(f, 80, 8)}>
              <line x1={back.x} y1={back.y} x2={tip.x} y2={tip.y} stroke={C.graphite} strokeWidth={10} strokeLinecap="round" />
              <polygon
                points="0,0 -46,-22 -46,22"
                fill={C.graphite}
                transform={`translate(${tip.x + Math.cos(ang) * 10} ${tip.y + Math.sin(ang) * 10}) rotate(${(ang * 180) / Math.PI})`}
              />
              <polygon points="0,0 34,-20 22,0 34,20" fill={C.coral} transform={`translate(${back.x} ${back.y}) rotate(${(ang * 180) / Math.PI + 180})`} />
            </g>
          )}
        </Stage>
        {gone < 1 && (
          <div
            style={{
              position: 'absolute',
              left: O.x,
              top: O.y,
              transform: `translate(-50%, -50%) translateX(${(1 - enter) * -760}px) rotate(${lerp(-24, -5, enter) * (1 - prog(f, 18, 10, EASE_IN_OUT))}deg) scale(${1 - gone})`,
              opacity: 1 - gone,
            }}
          >
            <PillButton label="Tráfego" glyph="trend" height={160} press={press} />
          </div>
        )}
        <Cursor
          keys={[
            {f: 10, x: 930, y: 1450},
            {f: 29, x: 640, y: 900},
            {f: 46, x: 940, y: 1250},
          ]}
          clicks={[32]}
          vanish={44}
        />
        {Array.from({length: 12}, (_, i) => {
          const t = prog(f, 64 + i * 2.5, 14, EASE_IN);
          if (t <= 0 || t >= 1) return null;
          const a = (i / 12) * Math.PI * 2 + 0.4;
          const R = 760;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: O.x + Math.cos(a) * R * (1 - t) - 9,
                top: O.y + Math.sin(a) * R * (1 - t) - 9,
                width: 18,
                height: 18,
                borderRadius: 9,
                background: i % 3 ? C.coral : C.graphite,
                opacity: Math.min(1, t * 4) * (1 - t * t),
              }}
            />
          );
        })}
        <FrontLabel kicker="TRÁFEGO" word="Aquisição" y={1270} delay={62} />
      </AbsoluteFill>
    </Shot>
  );
};
