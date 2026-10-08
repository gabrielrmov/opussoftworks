import React from 'react';
import {TEXT_TOP, TEXT_W, TEXT_X} from '../lib/layout';

/** Bloco de texto alinhado à esquerda, na posição usada pelos boards. */
export const TextBlock: React.FC<{children: React.ReactNode; top?: number; gap?: number}> = ({
  children,
  top = TEXT_TOP,
  gap = 0,
}) => (
  <div style={{position: 'absolute', left: TEXT_X, top, width: TEXT_W, display: 'flex', flexDirection: 'column', gap}}>
    {children}
  </div>
);

/** Linha composta por palavras com máscaras independentes. */
export const Row: React.FC<{children: React.ReactNode; gap?: string; style?: React.CSSProperties}> = ({
  children,
  gap = '0.26em',
  style,
}) => <div style={{display: 'flex', alignItems: 'flex-end', columnGap: gap, ...style}}>{children}</div>;
