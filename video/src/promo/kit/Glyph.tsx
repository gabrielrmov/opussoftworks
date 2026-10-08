import React from 'react';
import {OpusSymbol} from '../../components/OpusSymbol';

export type GlyphName =
  | 'trend'
  | 'target'
  | 'bars'
  | 'search'
  | 'route'
  | 'code'
  | 'loop'
  | 'plus'
  | 'check'
  | 'sistemas'
  | 'sites'
  | 'cursor'
  | 'infinity';

/** Ícones vetoriais de traço (viewBox 60×60). */
export const Glyph: React.FC<{name: GlyphName; size: number; color: string; strokeWidth?: number}> = ({name, size, color, strokeWidth = 5}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {name === 'trend' && (
      <>
        <polyline points="9,43 23,29 32,37 50,18" />
        <polyline points="37,18 50,18 50,31" />
      </>
    )}
    {name === 'target' && (
      <>
        <circle cx="30" cy="30" r="20" />
        <circle cx="30" cy="30" r="10.5" />
        <circle cx="30" cy="30" r="2.5" fill={color} />
      </>
    )}
    {name === 'bars' && (
      <>
        <line x1="13" y1="46" x2="13" y2="36" />
        <line x1="24" y1="46" x2="24" y2="28" />
        <line x1="35" y1="46" x2="35" y2="21" />
        <line x1="46" y1="46" x2="46" y2="13" />
      </>
    )}
    {name === 'search' && (
      <>
        <circle cx="26" cy="26" r="14" />
        <line x1="36.5" y1="36.5" x2="49" y2="49" />
      </>
    )}
    {name === 'route' && (
      <>
        <circle cx="14" cy="45" r="4.5" />
        <circle cx="46" cy="15" r="4.5" />
        <path d="M19 45 C 42 45, 18 15, 41 15" strokeDasharray="5 6" />
      </>
    )}
    {name === 'code' && (
      <>
        <polyline points="21,18 9,30 21,42" />
        <polyline points="39,18 51,30 39,42" />
        <line x1="33" y1="13" x2="27" y2="47" />
      </>
    )}
    {name === 'loop' && (
      <>
        <path d="M47 33 A17 17 0 1 1 42 18" />
        <polyline points="43,7 43,19 31,19" />
      </>
    )}
    {name === 'plus' && (
      <>
        <line x1="30" y1="13" x2="30" y2="47" />
        <line x1="13" y1="30" x2="47" y2="30" />
      </>
    )}
    {name === 'check' && <polyline points="15,31 26,42 46,19" />}
    {name === 'sistemas' && (
      <>
        <rect x="9" y="9" width="17" height="17" rx="4" />
        <rect x="34" y="9" width="17" height="17" rx="4" />
        <rect x="9" y="34" width="17" height="17" rx="4" />
        <circle cx="42.5" cy="42.5" r="8.5" />
      </>
    )}
    {name === 'sites' && (
      <>
        <rect x="7" y="11" width="46" height="38" rx="6" />
        <line x1="7" y1="22" x2="53" y2="22" />
        <line x1="16" y1="33" x2="34" y2="33" />
      </>
    )}
    {name === 'infinity' && <OpusSymbol cx={30} cy={30} width={58} />}
    {name === 'cursor' && <path d="M17 10 L17 46 L26 37 L32 50 L38 47 L32 34 L44 34 Z" fill={color} />}
  </svg>
);
