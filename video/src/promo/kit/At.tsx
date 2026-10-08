import React from 'react';

/** Posiciona o conteúdo centralizado em (x, y) do quadro 1080×1920. */
export const At: React.FC<{y: number; x?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  y,
  x = 540,
  children,
  style,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x - 540,
      width: 1080,
      top: y,
      height: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      ...style,
    }}
  >
    {children}
  </div>
);
