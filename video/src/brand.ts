import type React from 'react';

// Identidade visual OPUS SOFTWORKS — 60% branco · 30% grafite · 10% coral.
export const C = {
  coral: '#FF6039',
  graphite: '#161616',
  white: '#FFFFFF',
  g700: '#4A4A4A',
  g500: '#9C9C9C',
  g100: '#F4F5F8',
} as const;

// Cinza #9C9C9C em baixa opacidade: bordas, trilhos e linhas de apoio.
export const HAIRLINE = 'rgba(156, 156, 156, 0.42)';

export const FONT = {
  title: '"Exo 2", sans-serif',
  text: 'Rubik, sans-serif',
} as const;

export const TYPE = {
  display: {fontFamily: FONT.title, fontWeight: 800, letterSpacing: '-0.01em', lineHeight: 1.1},
  body: {fontFamily: FONT.text, fontWeight: 400, lineHeight: 1.2},
  label: {fontFamily: FONT.title, fontWeight: 700, letterSpacing: '0.08em', lineHeight: 1},
} satisfies Record<string, React.CSSProperties>;

/**
 * Arquivos oficiais do logo. Quando existirem, coloque-os em `video/public/brand/`
 * e informe o caminho relativo a `public/` (ex.: 'brand/opus-simbolo.svg').
 * Com o caminho preenchido, o LogoReveal usa o arquivo original; com `null`,
 * usa a reconstrução geométrica do símbolo feita a partir do storyboard.
 */
/**
 * Prints reais do site (página inteira) para as telas do plano "Sites" do promo.
 * Coloque os arquivos em `video/public/brand/site/` e informe o caminho
 * relativo a `public/`. `scroll` = fração da altura do print que a tela rola.
 * Com `null`, as telas mostram uma página-modelo desenhada em código.
 */
export const SITE_SCREENSHOTS: {desktop: string | null; mobile: string | null; desktopScroll: number; mobileScroll: number} = {
  desktop: null,
  mobile: null,
  desktopScroll: 0.45,
  mobileScroll: 0.55,
};

export const LOGO_ASSETS: {symbol: string | null; wordmark: string | null} = {
  symbol: 'brand/opus-simbolo.png',
  wordmark: null,
};
