import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand';
import {AnimatedCircle} from '../../components/AnimatedCircle';
import {Stage} from '../../components/Stage';
import {CLAMP, EASE_IN_OUT, clamp01, lerp, prog} from '../../lib/anim';
import {Cursor} from '../kit/Cursor';
import {Glare, Laptop, laptopScreenWidth, Phone, phoneScreenWidth, SiteScreen} from '../kit/Devices';
import {snap} from '../kit/fx';
import {Shot} from '../kit/Shot';
import {FrontLabel} from './Labels';

const PHONE_W = 270;

/**
 * 08 — SITES: o celular entra sozinho, grande, girando em 3D sobre um disco coral;
 * a câmera abre, o notebook entra girando e as duas telas rolam o site. Presença.
 */
export const P08: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Fase A — celular protagonista
  const phIn = snap(f, fps, 0);
  // Fase B — abre o quadro: celular vai para a direita, notebook entra
  const open = prog(f, 40, 26, EASE_IN_OUT);
  const lapIn = snap(f, fps, 44);

  const bob = Math.sin(f / 16) * 7;
  const phX = lerp(540, 846, open);
  const phY = lerp(lerp(1500, 860, phIn), 930, open) + bob;
  const phScale = lerp(1.42, 1, open);
  const rotY = lerp(lerp(52, -16, phIn), -20, open);
  const rotX = lerp(lerp(18, 6, phIn), 8, open);
  const rotZ = lerp(lerp(-16, 2, phIn), 4, open);

  const disc = snap(f, fps, 2);
  const discR = lerp(330 * disc, 470, open);
  const discX = lerp(540, 470, open);
  const discY = lerp(860, 800, open);

  const mobile = interpolate(f, [8, 110], [0, 1], {...CLAMP, easing: EASE_IN_OUT});
  const desktop = interpolate(f, [70, 128], [0, 1], {...CLAMP, easing: EASE_IN_OUT});

  return (
    <Shot bg={C.white} dur={dur} push={0.03}>
      <AbsoluteFill>
        <Stage>
          <circle cx={discX} cy={discY} r={Math.max(0, discR)} fill={C.coral} opacity={lerp(1, 0.1, open)} />
          <AnimatedCircle cx={1080} cy={140} r={330} mode="draw" delay={30} duration={30} strokeWidth={6} />
          <AnimatedCircle cx={0} cy={1780} r={260} mode="draw" delay={40} duration={30} strokeWidth={4} opacity={0.5} />
        </Stage>

        {lapIn > 0.001 && (
          <div
            style={{
              position: 'absolute',
              left: 60,
              top: 540 + Math.sin(f / 20 + 1) * 5,
              transform: `translateX(${(1 - lapIn) * -1000}px) perspective(1800px) rotateY(${lerp(38, 0, clamp01(lapIn))}deg)`,
              filter: lapIn < 0.98 ? `blur(${(1 - clamp01(lapIn)) * 18}px)` : undefined,
            }}
          >
            <Laptop width={720}>
              <SiteScreen variant="desktop" progress={desktop} screenWidth={laptopScreenWidth(720)} />
              <Glare t={prog(f, 72, 20)} />
            </Laptop>
          </div>
        )}

        <div
          style={{
            position: 'absolute',
            left: phX - PHONE_W / 2,
            top: phY - (PHONE_W * 2.05) / 2,
            transform: `scale(${phScale}) perspective(1600px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
            filter: phIn < 0.97 ? `blur(${(1 - clamp01(phIn)) * 16}px)` : undefined,
          }}
        >
          <Phone width={PHONE_W}>
            <SiteScreen variant="mobile" progress={mobile} screenWidth={phoneScreenWidth(PHONE_W)} />
            <Glare t={prog(f, 16, 18)} />
          </Phone>
        </div>

        <Cursor
          keys={[
            {f: 74, x: 260, y: 1220},
            {f: 92, x: 430, y: 820},
            {f: 104, x: 600, y: 700},
            {f: 116, x: 610, y: 760},
            {f: 128, x: 620, y: 700},
          ]}
          vanish={132}
        />
        <FrontLabel kicker="SITES" word="Presença" y={1400} delay={92} />
      </AbsoluteFill>
    </Shot>
  );
};
