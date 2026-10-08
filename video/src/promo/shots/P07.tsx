import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand';
import {clamp01, lerp, prog} from '../../lib/anim';
import {Cursor} from '../kit/Cursor';
import {BOUNCE, snap} from '../kit/fx';
import {Glyph, GlyphName} from '../kit/Glyph';
import {Shot} from '../kit/Shot';
import {CheckBadge, Skel, Toggle} from '../kit/UI';
import {FrontLabel} from './Labels';

const CARD = {x: 140, y: 470, w: 800, h: 620};
const ROWS: {glyph: GlyphName; w: number}[] = [
  {glyph: 'trend', w: 300},
  {glyph: 'sistemas', w: 230},
  {glyph: 'sites', w: 270},
];
const CLICKS = [22, 32, 42];
const rowY = (i: number) => CARD.y + 190 + i * 130;
const TOGGLE_X = CARD.x + CARD.w - 48 - 56;

/** 07 — SISTEMAS: painel em que o cursor liga as automações, uma a uma. Automação. */
export const P07: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = snap(f, fps, 0);
  return (
    <Shot bg={C.g100} dur={dur} ambient="grey" seed="p07">
      <AbsoluteFill>
        <div
          style={{
            position: 'absolute',
            left: CARD.x,
            top: CARD.y,
            width: CARD.w,
            height: CARD.h,
            borderRadius: 44,
            background: C.white,
            boxShadow: '0 40px 90px rgba(22,22,22,0.10)',
            transform: `scale(${lerp(0.7, 1, t)}) rotate(${lerp(7, 0, t)}deg)`,
            filter: t < 0.98 ? `blur(${(1 - clamp01(t)) * 12}px)` : undefined,
            opacity: clamp01(t * 2),
          }}
        >
          <div style={{position: 'absolute', left: 48, top: 48, display: 'flex', gap: 22, alignItems: 'center'}}>
            <div style={{width: 84, height: 84, borderRadius: 24, background: C.coral, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Glyph name="sistemas" size={46} color={C.white} />
            </div>
            <div>
              <Skel w={260} h={20} color="rgba(22,22,22,0.85)" />
              <Skel w={170} h={14} style={{marginTop: 14}} />
            </div>
          </div>
          {ROWS.map((r, i) => (
            <div key={r.glyph} style={{position: 'absolute', left: 48, right: 48, top: rowY(i) - CARD.y - 46, height: 92, display: 'flex', alignItems: 'center', gap: 24}}>
              <div style={{width: 72, height: 72, borderRadius: 36, background: C.g100, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Glyph name={r.glyph} size={38} color={C.g700} />
              </div>
              <div style={{flex: 1}}>
                <Skel w={r.w} h={16} />
                <Skel w={r.w * 0.6} h={12} style={{marginTop: 12}} />
              </div>
              <Toggle on={prog(f, CLICKS[i], 6)} />
            </div>
          ))}
        </div>
        <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
          {CLICKS.map((c, i) => {
            const on = prog(f, c, 6);
            if (on <= 0) return null;
            const sx = TOGGLE_X + 60;
            const sy = rowY(i);
            const ex = CARD.x + CARD.w - 25;
            const ey = CARD.y + 15;
            const d = `M${sx} ${sy} C ${sx + 90} ${sy}, ${ex + 40} ${ey + 120}, ${ex} ${ey}`;
            const k = ((f - c) % 20) / 20;
            const qx = (1 - k) ** 3 * sx + 3 * (1 - k) ** 2 * k * (sx + 90) + 3 * (1 - k) * k ** 2 * (ex + 40) + k ** 3 * ex;
            const qy = (1 - k) ** 3 * sy + 3 * (1 - k) ** 2 * k * sy + 3 * (1 - k) * k ** 2 * (ey + 120) + k ** 3 * ey;
            return (
              <g key={c} opacity={on}>
                <path d={d} fill="none" stroke={C.coral} strokeWidth={3} strokeDasharray="6 10" opacity={0.5} />
                <circle cx={qx} cy={qy} r={8} fill={C.coral} />
              </g>
            );
          })}
        </svg>
        <div style={{position: 'absolute', left: CARD.x + CARD.w - 100, top: CARD.y - 60}}>
          <CheckBadge t={snap(f, fps, 48, BOUNCE)} draw={prog(f, 52, 10)} size={150} />
        </div>
        <Cursor
          keys={[
            {f: 8, x: 1000, y: 1500},
            {f: 20, x: TOGGLE_X + 20, y: rowY(0) + 8},
            {f: 30, x: TOGGLE_X + 20, y: rowY(1) + 8},
            {f: 40, x: TOGGLE_X + 20, y: rowY(2) + 8},
            {f: 54, x: 1020, y: 1320},
          ]}
          clicks={CLICKS}
          vanish={50}
        />
        <FrontLabel kicker="SISTEMAS" word="Automação" y={1270} delay={56} />
      </AbsoluteFill>
    </Shot>
  );
};
