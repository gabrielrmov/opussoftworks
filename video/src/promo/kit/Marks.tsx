import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C} from '../../brand';
import {EASE_IN, EASE_OUT, prog} from '../../lib/anim';

type MarkProps = {
  children: React.ReactNode;
  start: number;
  duration?: number;
  color?: string;
  /** Espessura em px. */
  thickness?: number;
  exitAt?: number;
};

const useDraw = (start: number, duration: number, exitAt?: number) => {
  const frame = useCurrentFrame();
  return {
    t: prog(frame, start, duration, EASE_OUT),
    out: exitAt === undefined ? 0 : prog(frame, exitAt, 8, EASE_IN),
  };
};

/** Sublinhado que mede a própria palavra: sempre com a largura exata do texto. `gap` em px abaixo da caixa do texto (deixe ~0,2× o tamanho da fonte para passar das letras que descem). */
export const Underline: React.FC<MarkProps & {gap?: number}> = ({children, start, duration = 12, color = C.coral, thickness = 10, gap = 30, exitAt}) => {
  const {t, out} = useDraw(start, duration, exitAt);
  return (
    <div style={{position: 'relative', display: 'inline-flex'}}>
      {children}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: `calc(100% + ${gap}px)`,
          height: thickness,
          borderRadius: thickness / 2,
          background: color,
          transform: `scaleX(${t})`,
          transformOrigin: 'left center',
          opacity: 1 - out,
        }}
      />
    </div>
  );
};

/** Risco sobre a palavra (riscar uma ideia), alinhado ao meio das letras minúsculas. */
export const Strike: React.FC<MarkProps> = ({children, start, duration = 10, color = C.coral, thickness = 12, exitAt}) => {
  const {t, out} = useDraw(start, duration, exitAt);
  return (
    <div style={{position: 'relative', display: 'inline-flex'}}>
      {children}
      <div
        style={{
          position: 'absolute',
          left: '-2%',
          width: '104%',
          top: '58%',
          height: thickness,
          marginTop: -thickness / 2,
          borderRadius: thickness / 2,
          background: color,
          transform: `scaleX(${t})`,
          transformOrigin: 'left center',
          opacity: 1 - out,
        }}
      />
    </div>
  );
};

/** Seta que se desenha sob a palavra, da esquerda para a direita (direção). */
export const ArrowUnder: React.FC<MarkProps & {gap?: number}> = ({children, start, duration = 16, color = C.coral, thickness = 10, gap = 34, exitAt}) => {
  const frame = useCurrentFrame();
  const {t, out} = useDraw(start, duration, exitAt);
  const head = prog(frame, start + duration - 4, 8, EASE_OUT);
  const hs = thickness * 3.4;
  return (
    <div style={{position: 'relative', display: 'inline-flex'}}>
      {children}
      <div style={{position: 'absolute', left: 0, right: hs * 0.35, top: `calc(100% + ${gap}px)`, height: hs, opacity: 1 - out}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: hs / 2 - thickness / 2,
            height: thickness,
            borderRadius: thickness / 2,
            background: color,
            transform: `scaleX(${t})`,
            transformOrigin: 'left center',
          }}
        />
        <svg
          width={hs}
          height={hs}
          viewBox="0 0 34 34"
          style={{position: 'absolute', right: -hs * 0.32, top: 0, opacity: head, transform: `translateX(${(head - 1) * 24}px)`}}
        >
          <polyline points="12,5 26,17 12,29" fill="none" stroke={color} strokeWidth={34 * (thickness / hs)} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
};
