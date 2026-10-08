/**
 * Toda a coreografia do OpusLaunch em um lugar só.
 *
 * Regra: 120 BPM → 1 beat = 15 frames a 30fps. Toda entrada importante cai
 * num múltiplo de 15 (use `beat(n)`); staggers de 3–5 frames ficam por
 * conta dos componentes.
 */
export const FPS = 30;
export const DURATION = 900;
export const BEAT = 15;
export const beat = (n: number) => n * BEAT;

// ---------- Hook (0–120) ----------
export const HOOK = {
  resultado: beat(0),
  nao: beat(1),
  e: beat(2),
  sorte: beat(3),
  /** glitch em "sorte." e risco coral chegando no beat seguinte */
  glitchFrom: beat(3) + 3,
  strikeFrom: beat(3) + 7,
  entrega: beat(4),
  underlineFrom: beat(5),
  underlineTo: beat(6) + 10,
} as const;

// ---------- Pilares (120–270) ----------
export const PILLAR_AT = [beat(8), beat(11), beat(14)] as const; // chegada da câmera em cada pilar
export const TRAFEGO = { cursorFrom: beat(8), click: beat(9), countFrom: beat(9) + 4, countTo: beat(10) + 10 };
export const SISTEMAS = { rowsFrom: beat(11), barsFrom: beat(12) };
export const SITES = { loadFrom: beat(13) + 10, loaded: beat(15), tap: beat(16) };

// ---------- Sistema (270–360) ----------
export const SYSTEM = { titleA: beat(19), titleB: beat(20), out: beat(23) };
export const SYSTEM_ZOOM = { from: beat(18), to: beat(20) };

// ---------- Método (360–510) ----------
export const METHOD_STEPS = [beat(25), beat(27), beat(29), beat(31)] as const;

// ---------- Outcome (510–660) ----------
export const OUTCOME_LINES = [beat(35), beat(37), beat(39)] as const;
export const OUTCOME_CURVE = { from: beat(35), to: beat(43) };

// ---------- Logo (660–780) ----------
export const LOGO = { connectFrom: beat(43), closeFrom: beat(46), closed: beat(47), hold: beat(50) };

// ---------- CTA (780–900) ----------
export const CTA_AT = beat(52); // 780: tudo no lugar, só o pulso se mexe

/**
 * Câmera: foco (x, y) em coordenadas do canvas e escala. Entre dois
 * keyframes a câmera anda com Easing.bezier(0.16, 1, 0.3, 1); keyframes
 * repetidos = câmera parada (com "respiração").
 */
export type CamKey = { f: number; x: number; y: number; s: number };
export const CAMERA: CamKey[] = [
  { f: 0, x: 500, y: 560, s: 1 },
  { f: beat(1), x: 500, y: 665, s: 1 },
  { f: beat(3), x: 500, y: 770, s: 1 },
  { f: beat(4), x: 500, y: 770, s: 1 },
  { f: beat(5), x: 500, y: 930, s: 1 },
  { f: beat(7), x: 500, y: 930, s: 1 },
  { f: beat(8), x: 1900, y: 1000, s: 1 },
  { f: beat(10), x: 1900, y: 1000, s: 1 },
  { f: beat(11), x: 3100, y: 1000, s: 1 },
  { f: beat(13), x: 3100, y: 1000, s: 1 },
  { f: beat(14), x: 4300, y: 1000, s: 1 },
  { f: beat(18), x: 4300, y: 1000, s: 1 },
  { f: beat(20), x: 3100, y: 38, s: 0.26 },
  { f: beat(23), x: 3100, y: 38, s: 0.26 },
  { f: beat(25), x: 5460, y: 1550, s: 1 },
  { f: beat(27), x: 5460, y: 1880, s: 1 },
  { f: beat(29), x: 5460, y: 2210, s: 1 },
  { f: beat(31), x: 5460, y: 2315, s: 1 },
  { f: beat(34), x: 5460, y: 2315, s: 1 },
  { f: beat(35), x: 5460, y: 4040, s: 1 },
  { f: beat(43), x: 5490, y: 4000, s: 1.02 },
  { f: beat(44), x: 5490, y: 4000, s: 1.02 },
  { f: beat(46), x: 3615, y: 2600, s: 0.123 },
  { f: beat(47), x: 6700, y: 3500, s: 0.85 },
  { f: beat(50), x: 6700, y: 3500, s: 0.85 },
  { f: beat(52), x: 6700, y: 4062, s: 0.8 },
  { f: DURATION, x: 6700, y: 4062, s: 0.8 },
];
/** A partir daqui a câmera não respira (CTA parado). */
export const CAMERA_STILL_FROM = CTA_AT;

/**
 * Quanto da linha coral já foi desenhado, por frame. `at` é o nome de um
 * ponto da linha (ver WAYPOINTS em layout.ts) e `t` vai de 0 a 1 dentro do
 * trecho que termina nesse ponto.
 */
export const LINE_PROGRESS: { f: number; at: string }[] = [
  { f: 0, at: "leadIn" },
  { f: HOOK.sorte, at: "riseTop" },
  { f: HOOK.entrega, at: "strikeEnd" },
  { f: HOOK.underlineFrom, at: "underlineStart" },
  { f: HOOK.underlineTo, at: "underlineEnd" },
  { f: PILLAR_AT[0], at: "p1Start" },
  { f: PILLAR_AT[0] + 30, at: "p1End" },
  { f: PILLAR_AT[1], at: "p2Start" },
  { f: PILLAR_AT[1] + 30, at: "p2End" },
  { f: PILLAR_AT[2], at: "p3Start" },
  { f: PILLAR_AT[2] + 30, at: "p3End" },
  { f: METHOD_STEPS[0] - 20, at: "methodCorner" },
  ...METHOD_STEPS.map((f, i) => ({ f, at: `step${i}` })),
  { f: OUTCOME_CURVE.from, at: "curveStart" },
  { f: OUTCOME_CURVE.to, at: "curveEnd" },
  { f: LOGO.closeFrom, at: "pillStart" },
];

/** Efeitos sonoros (arquivo em public/sfx/, frame de início, volume opcional — padrão em OpusLaunch.tsx). */
export const SFX: { file: string; f: number; volume?: number }[] = [
  { file: "impact.wav", f: HOOK.resultado },
  { file: "tick.wav", f: HOOK.nao },
  { file: "tick.wav", f: HOOK.e },
  { file: "glitch.wav", f: HOOK.sorte },
  { file: "impact.wav", f: HOOK.entrega },
  { file: "whoosh.wav", f: beat(4) - 4, volume: 0.3 },
  { file: "whoosh.wav", f: beat(7) - 2 },
  { file: "click.wav", f: TRAFEGO.click },
  { file: "whoosh.wav", f: beat(10) - 2 },
  { file: "tick.wav", f: SISTEMAS.rowsFrom },
  { file: "tick.wav", f: SISTEMAS.barsFrom },
  { file: "whoosh.wav", f: beat(13) - 2 },
  { file: "click.wav", f: SITES.tap },
  { file: "whoosh.wav", f: beat(18) - 2 },
  { file: "tick.wav", f: SYSTEM.titleA },
  { file: "tick.wav", f: SYSTEM.titleB },
  { file: "whoosh.wav", f: beat(23) - 2 },
  ...METHOD_STEPS.map((f) => ({ file: "tick.wav", f })),
  { file: "whoosh.wav", f: beat(34) - 2 },
  ...OUTCOME_LINES.map((f) => ({ file: "tick.wav", f })),
  { file: "whoosh.wav", f: beat(44) - 2 },
  { file: "whoosh.wav", f: beat(46) - 2 },
  { file: "impact.wav", f: LOGO.closed },
  { file: "whoosh.wav", f: beat(50) - 2, volume: 0.32 },
  { file: "tick.wav", f: CTA_AT },
];
