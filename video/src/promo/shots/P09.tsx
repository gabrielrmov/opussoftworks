import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../../brand';
import {OpusSymbol} from '../../components/OpusSymbol';
import {EASE_IN_OUT, clamp01, lerp, prog} from '../../lib/anim';
import {At} from '../kit/At';
import {Cursor} from '../kit/Cursor';
import {BOUNCE, exitStyle, snap} from '../kit/fx';
import {Glyph, GlyphName} from '../kit/Glyph';
import {KineticText} from '../kit/KineticText';
import {Shot} from '../kit/Shot';

const Y = 840;
const TILES: {glyph: GlyphName; dx: number}[] = [
  {glyph: 'trend', dx: -195},
  {glyph: 'sistemas', dx: 0},
  {glyph: 'sites', dx: 195},
];

/** 09 — Tudo funciona junto: o cursor toca o dock e as três frentes viram um só símbolo. */
export const P09: React.FC<{dur: number}> = ({dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dock = snap(f, fps, 0);
  const merge = prog(f, 34, 12, EASE_IN_OUT);
  const dockOut = prog(f, 40, 10, EASE_IN_OUT);
  const core = snap(f, fps, 45, BOUNCE);
  return (
    <Shot bg={C.white} dur={dur}>
      <AbsoluteFill style={exitStyle(f, 86, 10, 'zoom', '50% 44%')}>
        <div
          style={{
            position: 'absolute',
            left: 540 - 310,
            top: Y - 110,
            width: 620,
            height: 220,
            borderRadius: 70,
            background: C.g100,
            boxShadow: 'inset 0 0 0 2px rgba(156,156,156,0.25)',
            transform: `scale(${lerp(0.6, 1, dock) * (1 - dockOut * 0.6)}, ${lerp(0.6, 1, dock)})`,
            opacity: clamp01(dock * 2) * (1 - dockOut),
          }}
        />
        {merge < 1 &&
          TILES.map((t, i) => {
            const s = snap(f, fps, 4 + i * 3, BOUNCE);
            const x = 540 + t.dx * (1 - merge);
            return (
              <div
                key={t.glyph}
                style={{
                  position: 'absolute',
                  left: x - 76,
                  top: Y - 76,
                  width: 152,
                  height: 152,
                  borderRadius: 42,
                  background: C.white,
                  boxShadow: '0 14px 34px rgba(22,22,22,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${s * (1 - merge * 0.3)})`,
                  opacity: 1 - prog(f, 42, 4),
                }}
              >
                <Glyph name={t.glyph} size={80} color={C.coral} strokeWidth={5.5} />
              </div>
            );
          })}
        {core > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: 540 - 120,
              top: Y - 120,
              width: 240,
              height: 240,
              borderRadius: 66,
              background: C.white,
              boxShadow: '0 30px 60px rgba(22,22,22,0.14)',
              transform: `scale(${core})`,
            }}
          >
            <svg width={240} height={240} style={{position: 'absolute', inset: 0}}>
              <OpusSymbol cx={120} cy={120} width={184} progress={prog(f, 48, 16, EASE_IN_OUT)} />
            </svg>
          </div>
        )}
        <Cursor
          keys={[
            {f: 10, x: 920, y: 1350},
            {f: 27, x: 560, y: 870},
            {f: 40, x: 760, y: 1100},
          ]}
          clicks={[30]}
          vanish={38}
        />
        <At y={1180}>
          <KineticText text="Tudo funciona" size={100} delay={44} stagger={1} />
        </At>
        <At y={1340}>
          <KineticText text="junto." size={180} color={C.coral} mode="slam" delay={54} stagger={1.6} />
        </At>
      </AbsoluteFill>
    </Shot>
  );
};
