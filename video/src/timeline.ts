/**
 * Tempos do OpusLaunch — tudo que é frame mora aqui.
 *
 * 30 fps, 120 BPM: 1 beat = 15 frames. Todo corte de cena cai num múltiplo
 * de 15 (checado em `assertCuts`, que roda ao carregar o módulo).
 */
export const FPS = 30;
export const DURATION = 900;
export const BEAT = 15;
export const beat = (n: number) => n * BEAT;

/** Cenas, em ordem; `from` é o corte de entrada. */
export const SCENES = {
  hook: { from: 0, to: 60 },
  entrega: { from: 60, to: 120 },
  site: { from: 120, to: 315 },
  lead: { from: 315, to: 420 },
  // Método: 4 cortes secos de ~37 frames. Pra cair em múltiplos de 15,
  // alternam 45 e 30 frames (média 37,5).
  method0: { from: 420, to: 465 },
  method1: { from: 465, to: 495 },
  method2: { from: 495, to: 540 },
  method3: { from: 540, to: 570 },
  tool: { from: 570, to: 645 },
  sistema: { from: 645, to: 735 },
  signature: { from: 735, to: 900 },
} as const;

export type SceneId = keyof typeof SCENES;

// ---- Gancho (off-white) ----
export const HOOK = { resultado: 0, naoE: 15, sorte: 30, strike: 40 };

// ---- "É / entrega." (coral) ----
export const ENTREGA = { e: 60, entrega: 64 };

// ---- Site real no celular ----
// scrollY em px CSS da página (viewport 390). Pausas entre os trechos.
export const SITE = {
  enter: 120,
  scroll: [
    { f: 120, y: 0 }, // hero
    { f: 150, y: 0 },
    { f: 177, y: 470 }, // "Três frentes"
    { f: 198, y: 470 },
    { f: 222, y: 650 }, // card 01 inteiro
  ],
  circleFrom: 236,
  circleTo: 250,
  pushFrom: 270,
  pushTo: 315,
  pushScale: 3.4,
};

// ---- "Lead não é resultado. Venda é." (azul-marinho) ----
export const LEAD = { label: 315, lead: 315, resultado: 330, venda: 360 };

// ---- Método (4 cortes) ----
export const METHOD = ["method0", "method1", "method2", "method3"] as const;

// ---- "Sua empresa não precisa de mais uma ferramenta." (off-white) ----
export const TOOL = { lines: [570, 585, 600, 615], strike: 628 };

// ---- "Precisa de um sistema que funcione." (coral) ----
export const SISTEMA = { lines: [645, 660, 675] };

// ---- Assinatura (off-white + grade de pontos) ----
export const SIGNATURE = { wordmark: 735, tagline: 750, underline: 765, button: 780, url: 795 };

/** Cortes para fundo coral levam 1–2 frames de flash branco. */
export const FLASH_AT = [SCENES.entrega.from, SCENES.method3.from, SCENES.sistema.from];

/* --------------------------------- áudio --------------------------------- */
/**
 * Slot da trilha: public/music.mp3. HAS_MUSIC é detectado em OpusLaunch.tsx
 * (getStaticFiles). MUSIC_FIRST_BEAT_MS = onde cai o primeiro beat dentro do
 * arquivo; o áudio é cortado ali pra esse beat bater no frame 0.
 */
export const MUSIC_FIRST_BEAT_MS = 0;

/* ------------------------------- checagem -------------------------------- */
export const CUTS = Object.values(SCENES).map((s) => s.from);
export const assertCuts = () => {
  const bad = CUTS.filter((f) => f % BEAT !== 0);
  const order = Object.values(SCENES);
  for (let i = 1; i < order.length; i++) {
    if (order[i].from !== order[i - 1].to) throw new Error(`Buraco/sobreposição entre cenas no frame ${order[i].from}`);
  }
  if (order[order.length - 1].to !== DURATION) throw new Error("A última cena não termina em DURATION");
  if (bad.length) throw new Error(`Cortes fora do beat: ${bad.join(", ")}`);
};
assertCuts();
