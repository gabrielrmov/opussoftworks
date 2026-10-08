import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand';
import {AnimatedCircle} from '../../components/AnimatedCircle';
import {Stage} from '../../components/Stage';
import {CLAMP, EASE_IN_OUT, clamp01} from '../../lib/anim';
import {Laptop, Phone, SiteScreen} from '../kit/Devices';
import {exitStyle, snap} from '../kit/fx';
import {Shot} from '../kit/Shot';
import {FrontLabel} from './Labels';

/** 08 — SITES: notebook e celular entram com a página rolando. Presença. */
export const P08: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lap = snap(f, fps, 0);
  const ph = snap(f, fps, 8);
  const scrollD = interpolate(f, [26, 80], [0, 150], {...CLAMP, easing: EASE_IN_OUT});
  const scrollM = interpolate(f, [30, 84], [0, 330], {...CLAMP, easing: EASE_IN_OUT});
  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill style={exitStyle(f, 92, 10, 'blur')}>
        <Stage>
          <AnimatedCircle cx={1080} cy={140} r={330} mode="draw" delay={4} duration={30} strokeWidth={6} />
          <AnimatedCircle cx={0} cy={1780} r={260} mode="draw" delay={10} duration={30} strokeWidth={4} opacity={0.5} />
        </Stage>
        <div
          style={{
            position: 'absolute',
            left: 60,
            top: 560,
            transform: `translateX(${(1 - lap) * 1000}px)`,
            filter: lap < 0.98 ? `blur(${(1 - clamp01(lap)) * 18}px)` : undefined,
          }}
        >
          <Laptop width={720}>
            <SiteScreen variant="desktop" scroll={scrollD} />
          </Laptop>
        </div>
        <div
          style={{
            position: 'absolute',
            left: 720,
            top: 720,
            transform: `translateY(${(1 - ph) * 1200}px) perspective(1600px) rotateY(-20deg) rotateX(8deg) rotateZ(4deg)`,
          }}
        >
          <Phone width={270}>
            <SiteScreen variant="mobile" scroll={scrollM} />
          </Phone>
        </div>
        <FrontLabel kicker="SITES" word="Presença" y={1400} delay={44} />
      </AbsoluteFill>
    </Shot>
  );
};
