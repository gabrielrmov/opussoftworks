export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION = 45 * FPS; // 1350

// Janelas de cada cena (frames globais). Cenas vizinhas se sobrepõem onde a
// transição pede que a saída de uma conviva com a entrada da outra.
export const SCENES = {
  s1: {from: 0, duration: 135}, //   0–4s   O início
  s2: {from: 120, duration: 150}, // 4–9s   O problema
  s3: {from: 270, duration: 120}, // 9–13s  A virada
  s4: {from: 390, duration: 210}, // 13–20s As três frentes
  s5: {from: 600, duration: 180}, // 20–26s Tudo funciona junto
  s6: {from: 780, duration: 180}, // 26–32s O método Opus
  s7: {from: 960, duration: 150}, // 32–37s A promessa
  s8: {from: 1110, duration: 240}, // 37–45s Revelação
} as const;
