import React from 'react';
import {interpolate, interpolateColors, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, FONT, LOGO_ASSETS, TYPE} from '../brand';
import {CLAMP, EASE_IN_OUT, EASE_OUT, clamp01, lerp, prog} from '../lib/anim';
import {Cubic, cubicLength, pt, segsLength, segsToD, straight} from '../lib/geometry';
import {INF_BOX, INF_FROM_CROSS, INF_FROM_RIGHT, INF_RIGHT_POINT, INF_STROKE, infinityToScreen, placeInfinity} from '../lib/infinity';
import {Stage} from './Stage';

type Props = {
  cx: number;
  cy: number;
  width: number;
  /** Linha coral herdada da cena anterior: ela percorre o símbolo e vira a máscara do logo. */
  leadIn: {x1: number; x2: number; y: number; width: number};
  wordmarkY: number;
  sloganY: number;
  ctaY: number;
  slogan: string;
  url: string;
};


export const LogoReveal: React.FC<Props> = ({cx, cy, width, leadIn, wordmarkY, sloganY, ctaY, slogan, url}) => {
  const frame = useCurrentFrame();
  const s = width / INF_BOX.width;

  // Caminho da linha: sublinhado → curva de entrada → contorno do infinito
  const R = infinityToScreen(cx, cy, width)(INF_RIGHT_POINT);
  const underline = straight(pt(leadIn.x1, leadIn.y), pt(leadIn.x2, leadIn.y));
  const connector: Cubic = [pt(leadIn.x2, leadIn.y), pt(leadIn.x2 + 170, leadIn.y), pt(R.x, R.y + 320), R];
  const loop = placeInfinity(INF_FROM_RIGHT, cx, cy, width);
  const lu = cubicLength(underline);
  const lc = cubicLength(connector);
  const total = lu + lc + segsLength(loop);
  const fUnderline = lu / total;
  const fLoop = (lu + lc) / total;
  const cometD = segsToD([underline, connector, ...loop]);

  const headAt = (f: number) => interpolate(f, [4, 58], [fUnderline, 1], {...CLAMP, easing: EASE_IN_OUT});
  const head = headAt(frame);
  const tail = interpolate(frame, [10, 52], [0, fLoop], {...CLAMP, easing: EASE_IN_OUT});
  const cometOpacity = 1 - prog(frame, 52, 14);
  const maskT = clamp01((headAt(frame - 3) - fLoop) / (1 - fLoop));

  // Logo: opacity 0→1, scale 0.94→1, símbolo revelado pela máscara
  const logoOpacity = prog(frame, 14, 22);
  const logoScale = lerp(0.94, 1, prog(frame, 14, 52, EASE_OUT));
  const maskFull = prog(frame, 60, 8);
  const wordmark = prog(frame, 62, 24);
  const sloganT = prog(frame, 80, 24);
  const urlT = prog(frame, 102, 18);
  const cta = prog(frame, 122, 24, EASE_IN_OUT);

  const loopLocal = segsToD(INF_FROM_RIGHT);
  const symbolD = segsToD(INF_FROM_CROSS, true);

  return (
    <>
      <Stage>
        <defs>
          <mask id="opus-symbol-mask" maskUnits="userSpaceOnUse" x={-200} y={-200} width={1015} height={790}>
            {maskT > 0.001 && (
              <path
                d={loopLocal}
                fill="none"
                stroke="#fff"
                strokeWidth={INF_STROKE * 1.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
                strokeDasharray={`${maskT} 2`}
              />
            )}
            <rect x={-200} y={-200} width={1015} height={790} fill="#fff" opacity={maskFull} />
          </mask>
        </defs>
        <g
          opacity={logoOpacity}
          transform={`translate(${cx} ${cy}) scale(${s * logoScale}) translate(${-INF_BOX.cx} ${-INF_BOX.cy})`}
        >
          <g mask="url(#opus-symbol-mask)">
            {LOGO_ASSETS.symbol ? (
              <image href={staticFile(LOGO_ASSETS.symbol)} x={0} y={0} width={INF_BOX.width} height={INF_BOX.height} />
            ) : (
              <path d={symbolD} fill="none" stroke={C.coral} strokeWidth={INF_STROKE} strokeLinejoin="round" />
            )}
          </g>
        </g>
        {cometOpacity > 0 && head - tail > 0.0005 && (
          <path
            d={cometD}
            fill="none"
            stroke={C.coral}
            strokeWidth={leadIn.width}
            strokeLinecap="round"
            strokeLinejoin="round"
            pathLength={1}
            strokeDasharray={`${head - tail} 3`}
            strokeDashoffset={-tail}
            opacity={cometOpacity}
          />
        )}
      </Stage>

      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: wordmarkY - 56,
          height: 112,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          opacity: wordmark,
          transform: `translateY(${(1 - wordmark) * 24}px)`,
        }}
      >
        {LOGO_ASSETS.wordmark ? (
          <Img src={staticFile(LOGO_ASSETS.wordmark)} style={{height: 92}} />
        ) : (
          <div style={{...TYPE.display, fontSize: 92, letterSpacing: '-0.005em'}}>
            <span style={{fontWeight: 700, color: C.coral}}>Opus</span>
            <span style={{fontWeight: 500, color: C.graphite}}>SoftWorks</span>
          </div>
        )}
      </div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          width: '100%',
          top: sloganY - 28,
          textAlign: 'center',
          fontFamily: FONT.text,
          fontSize: 42,
          lineHeight: '56px',
          color: C.g700,
          opacity: sloganT,
          transform: `translateY(${(1 - sloganT) * 22}px)`,
        }}
      >
        {slogan}
      </div>

      <div style={{position: 'absolute', left: (1080 - 620) / 2, top: ctaY - 60, width: 620, height: 120}}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 60,
            background: C.coral,
            clipPath: `inset(0 ${(1 - cta) * 50}% 0 ${(1 - cta) * 50}% round 60px)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            ...TYPE.label,
            fontWeight: 600,
            letterSpacing: '0.02em',
            fontSize: 42,
            color: interpolateColors(cta, [0, 1], [C.coral, C.white]),
            opacity: urlT,
          }}
        >
          {url}
        </div>
      </div>
    </>
  );
};
