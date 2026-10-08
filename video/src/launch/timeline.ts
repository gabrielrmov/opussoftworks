import { HOOK_L, LOGO_L, METHOD_L, OUTCOME_L, PILLARS_L, SYSTEM_FOCUS, SYSTEM_SCALE } from "./layout";

/**
 * Toda a coreografia do OpusLaunch em um lugar só.
 *
 * Regras: 120 BPM → 1 beat = 15 frames a 30fps; toda entrada importante cai
 * num múltiplo de 15 (use `beat(n)`), com staggers de 3–5 frames nos
 * componentes. Movimentos de câmera duram no máximo 15 frames e o conteúdo
 * seguinte já entra no início do movimento.
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
  /** glitch em "sorte." enquanto o risco passa; ela sai antes do retângulo fechar */
  glitchFrom: beat(3) + 3,
  sorteOut: beat(4) - 3,
  entrega: beat(4),
  boxClosed: beat(6) + 10,
} as const;

// ---------- Pilares (120–270) ----------
export const PILLAR_AT = [beat(8), beat(11), beat(14)] as const; // chegada da câmera em cada pilar
export const TRAFEGO = { cursorFrom: beat(8), click: beat(9), leadsFrom: beat(9) + 6 };
export const SISTEMAS = { rowsFrom: beat(11) - 5, barsFrom: beat(12) - 5 };
export const SITES = { loadFrom: beat(13) + 3, loaded: beat(14), tap: beat(16), sent: beat(16) + 6 };

// ---------- Sistema (270–345) ----------
export const SYSTEM_ZOOM = { from: beat(18), to: beat(19) };
export const SYSTEM = { titleA: beat(18), titleB: beat(18) + 9, out: beat(23) };

// ---------- Método (345–495) ----------
export const METHOD_MOVE = beat(23);
export const METHOD_STEPS = [beat(23), beat(24), beat(26), beat(28)] as const;

// ---------- Outcome (495–660) ----------
export const OUTCOME_MOVE = beat(33);
export const OUTCOME_LINES = [beat(33), beat(35), beat(37)] as const;
export const OUTCOME_CURVE = { from: beat(33), to: beat(43) };

// ---------- Logo (660–780) ----------
export const LOGO = {
  move: beat(44),
  /** a linha escreve o wordmark já durante o movimento; impacto no beat 46 (23 s) */
  drawFrom: beat(44),
  impact: beat(46),
  shrinkFrom: beat(47),
  shrinkTo: beat(48),
};

// ---------- CTA (780–900) ----------
export const CTA = {
  /** pergunta e URL entram junto com o movimento, embaixo do wordmark */
  question: beat(44) + 3,
  url: beat(44) + 8,
  lineFrom: beat(48),
  pillFrom: beat(50),
  closed: beat(51),
  at: beat(52), // 780: tudo no lugar, só o pulso se mexe
};

/**
 * Câmera: foco (x, y) em coordenadas do canvas e escala. Entre dois
 * keyframes a câmera anda com CAMERA_EASE (motion.ts); keyframes
 * repetidos = câmera parada (com "respiração").
 */
export type CamKey = { f: number; x: number; y: number; s: number };
const HX = HOOK_L.cx;
const [P1, P2, P3] = PILLARS_L.cx;
const PY = PILLARS_L.focusY;
const MX = METHOD_L.cx;
export const CAMERA: CamKey[] = [
  { f: 0, x: HX, y: HOOK_L.rows.resultado, s: 1 },
  { f: beat(1), x: HX, y: (HOOK_L.rows.resultado + HOOK_L.rows.naoE) / 2, s: 1 },
  { f: beat(3), x: HX, y: HOOK_L.rows.naoE, s: 1 },
  { f: beat(4), x: HX, y: HOOK_L.focusY, s: 1 },
  { f: beat(7), x: HX, y: HOOK_L.focusY, s: 1 },
  { f: beat(8), x: P1, y: PY, s: 1 },
  { f: beat(10), x: P1, y: PY, s: 1 },
  { f: beat(11), x: P2, y: PY, s: 1 },
  { f: beat(13), x: P2, y: PY, s: 1 },
  { f: beat(14), x: P3, y: PY, s: 1 },
  { f: beat(18), x: P3, y: PY, s: 1 },
  { f: beat(19), x: SYSTEM_FOCUS.x, y: SYSTEM_FOCUS.y, s: SYSTEM_SCALE },
  { f: beat(23), x: SYSTEM_FOCUS.x, y: SYSTEM_FOCUS.y, s: SYSTEM_SCALE },
  { f: beat(24), x: MX, y: 2120, s: 1 },
  { f: beat(33), x: MX, y: 2220, s: 1 },
  { f: beat(34), x: MX, y: OUTCOME_L.focusY, s: 1 },
  { f: beat(44), x: MX, y: OUTCOME_L.focusY - 40, s: 1 },
  { f: beat(45), x: LOGO_L.x, y: LOGO_L.y, s: 1 },
  { f: DURATION, x: LOGO_L.x, y: LOGO_L.y, s: 1 },
];
/** A partir daqui a câmera não respira (CTA parado). */
export const CAMERA_STILL_FROM = CTA.at;

/**
 * Quanto da linha coral já foi desenhado, por frame (`at` = ponto nomeado
 * em layout.ts). Entre dois pontos o desenho anda com EASE.
 */
export const LINE_PROGRESS: { f: number; at: string }[] = [
  { f: 0, at: "leadIn" },
  { f: HOOK.sorte, at: "riseTop" },
  { f: HOOK.entrega, at: "strikeEnd" },
  { f: beat(5), at: "boxLeft" },
  { f: HOOK.boxClosed, at: "boxClose" },
  { f: PILLAR_AT[0], at: "p1Start" },
  { f: PILLAR_AT[0] + 30, at: "p1End" },
  { f: PILLAR_AT[1], at: "p2Start" },
  { f: PILLAR_AT[1] + 30, at: "p2End" },
  { f: PILLAR_AT[2], at: "p3Start" },
  { f: PILLAR_AT[2] + 40, at: "p3End" },
  { f: METHOD_MOVE, at: "p3End" },
  { f: METHOD_MOVE + 3, at: "methodCorner" },
  { f: METHOD_MOVE + 5, at: "step0" },
  { f: METHOD_MOVE + 9, at: "step3" },
  { f: OUTCOME_MOVE, at: "step3" },
  { f: OUTCOME_CURVE.from + 12, at: "curveStart" },
  { f: OUTCOME_CURVE.to, at: "curveEnd" },
  { f: LOGO.move, at: "curveEnd" },
  { f: LOGO.move + 10, at: "logoAnchor" },
];

/** Efeitos (public/sfx/, frame de início, volume opcional — padrões em OpusLaunch.tsx). */
export const SFX: { file: string; f: number; volume?: number }[] = [
  { file: "impact.wav", f: HOOK.resultado },
  { file: "tick.wav", f: HOOK.nao },
  { file: "tick.wav", f: HOOK.e },
  { file: "glitch.wav", f: HOOK.sorte },
  { file: "impact.wav", f: HOOK.entrega },
  { file: "whoosh.wav", f: beat(7) - 3 },
  { file: "click.wav", f: TRAFEGO.click },
  { file: "tick.wav", f: TRAFEGO.leadsFrom },
  { file: "whoosh.wav", f: beat(10) - 3 },
  { file: "tick.wav", f: SISTEMAS.rowsFrom },
  { file: "tick.wav", f: SISTEMAS.barsFrom },
  { file: "whoosh.wav", f: beat(13) - 3 },
  { file: "click.wav", f: SITES.tap },
  { file: "whoosh.wav", f: SYSTEM_ZOOM.from - 3 },
  { file: "tick.wav", f: SYSTEM.titleA },
  { file: "tick.wav", f: SYSTEM.titleB },
  { file: "whoosh.wav", f: METHOD_MOVE - 3 },
  ...METHOD_STEPS.map((f) => ({ file: "tick.wav", f })),
  { file: "whoosh.wav", f: OUTCOME_MOVE - 3 },
  ...OUTCOME_LINES.map((f) => ({ file: "tick.wav", f })),
  { file: "whoosh.wav", f: LOGO.move - 3 },
  { file: "tick.wav", f: CTA.question },
  { file: "tick.wav", f: CTA.url },
  { file: "impact.wav", f: LOGO.impact },
  { file: "whoosh.wav", f: LOGO.shrinkFrom - 2, volume: 0.3 },
  { file: "click.wav", f: CTA.closed },
];
