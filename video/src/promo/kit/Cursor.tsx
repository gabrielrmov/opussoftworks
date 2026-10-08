import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {CLAMP, EASE_IN_OUT, prog} from '../../lib/anim';
import {pulse} from './fx';

type Key = {f: number; x: number; y: number};

/** Cursor que percorre a tela e clica (afunda + onda coral na ponta). */
export const Cursor: React.FC<{keys: Key[]; clicks?: number[]; appear?: number; vanish?: number; size?: number}> = ({
  keys,
  clicks = [],
  appear = keys[0].f,
  vanish,
  size = 1,
}) => {
  const frame = useCurrentFrame();
  const fs = keys.map((k) => k.f);
  const x = keys.length > 1 ? interpolate(frame, fs, keys.map((k) => k.x), {...CLAMP, easing: EASE_IN_OUT}) : keys[0].x;
  const y = keys.length > 1 ? interpolate(frame, fs, keys.map((k) => k.y), {...CLAMP, easing: EASE_IN_OUT}) : keys[0].y;
  const opacity = prog(frame, appear, 6) * (vanish === undefined ? 1 : 1 - prog(frame, vanish, 6));
  if (opacity <= 0) return null;
  const press = Math.max(0, ...clicks.map((c) => pulse(frame, c, 4)));
  return (
    <>
      {clicks.map((c) => {
        const r = prog(frame, c, 16);
        if (r <= 0 || r >= 1) return null;
        return (
          <div
            key={c}
            style={{
              position: 'absolute',
              left: x - 80 * r,
              top: y - 80 * r,
              width: 160 * r,
              height: 160 * r,
              borderRadius: '50%',
              border: `4px solid ${C.coral}`,
              opacity: (1 - r) * opacity,
            }}
          />
        );
      })}
      <svg
        width={64 * size}
        height={84 * size}
        viewBox="0 0 32 42"
        style={{
          position: 'absolute',
          left: x - 3 * size,
          top: y - 2 * size,
          opacity,
          transform: `scale(${1 - 0.16 * press})`,
          transformOrigin: '6% 4%',
          filter: 'drop-shadow(0 6px 10px rgba(22,22,22,0.25))',
        }}
      >
        <path d="M2 1 L2 33 L10 26 L15.5 38 L21 35.5 L15.6 24 L26 24 Z" fill={C.graphite} stroke={C.white} strokeWidth={2} strokeLinejoin="round" />
      </svg>
    </>
  );
};
