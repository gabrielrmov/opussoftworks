import React from 'react';

export type ServiceIconName = 'trafego' | 'sistemas' | 'sites';

/** Ícones vetoriais das três frentes (traço simples, cor configurável). */
export const ServiceIcon: React.FC<{name: ServiceIconName; size: number; color: string; strokeWidth?: number}> = ({
  name,
  size,
  color,
  strokeWidth = 5,
}) => (
  <svg width={size} height={size} viewBox="0 0 60 60" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    {name === 'trafego' && (
      <>
        <polyline points="9,43 23,29 32,37 50,18" />
        <polyline points="37,18 50,18 50,31" />
      </>
    )}
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
  </svg>
);
