import { HOOK_L, LOGO_L, METHOD_L, OUTCOME_L, PILLARS_L, SYSTEM_FOCUS, SYSTEM_SCALE } from "./layout";

/**
 * Toda a coreografia do OpusLaunch em um lugar só.
 *
 * Ritmo: cada bloco entra com a câmera ainda assentando, segura o tempo de
 * leitura e sai (máscara) antes de a câmera partir — nos movimentos só a
 * linha coral atravessa a tela. Movimentos de câmera: 18 frames, in-out.
 * Nas pausas, um push-in de 1–3% mantém o quadro vivo.
 */
export const FPS = 30;
export const DURATION = 900;
export const MOVE = 18;

// ---------- Gancho (0–96) ----------
export const HOOK = {
  resultado: -10, // já quase inteira no frame 0
  naoE: 10,
  sorte: 22,
  grey: 38, // a linha passa riscando
  sorteOut: 44,
  entrega: 50,
  boxClosed: 76,
  exit: 80, // saídas terminam até a câmera partir
  moveFrom: 96,
};

// ---------- Pilares (114–290): os mockups ficam no mundo ----------
export const PILLAR_AT = [114, 184, 244] as const; // câmera assentou
export const TRAFEGO = { cursorFrom: 120, click: 134, leadsFrom: 140 };
export const SISTEMAS = { rowsFrom: 188, barsFrom: 200 };
export const SITES = { loadFrom: 240, loaded: 250, tap: 270 };

// ---------- Visão geral (290–350) ----------
export const SYSTEM = { zoomFrom: 290, zoomTo: 312, titleA: 308, titleB: 312, out: 336, moveFrom: 350 };

// ---------- Método (368–472) ----------
export const METHOD = { at: 368, steps: [372, 390, 408, 426] as const, exit: 456, moveFrom: 472 };

// ---------- Outcome (490–636) ----------
export const OUTCOME = { at: 490, lines: [488, 500, 512, 516] as const, curveFrom: 494, curveTo: 550, exit: 620, moveFrom: 636 };

// ---------- Logo (654–722) ----------
export const LOGO = {
  at: 654,
  /** a linha assenta no patamar e vira a base; o wordmark sobe de trás dela */
  baseTo: 668,
  reveal: 656,
  retract: 696,
  moveFrom: 700,
  moveTo: 722,
};

// ---------- CTA (710–900) ----------
export const CTA = {
  question: 710,
  pillFrom: 718,
  closed: 740,
  label: 742,
  url: 748,
  still: 766,
};

/**
 * Câmera: foco (x, y) no canvas e escala. Entre dois keyframes ela anda com
 * CAMERA_EASE; pares de keyframes no mesmo lugar = pausa com push-in leve.
 */
export type CamKey = { f: number; x: number; y: number; s: number };
const HX = HOOK_L.cx;
const [P1, P2, P3] = PILLARS_L.cx;
const PY = PILLARS_L.focusY;
const MX = METHOD_L.cx;
export const CAMERA: CamKey[] = [
  { f: 0, x: HX, y: HOOK_L.focusY, s: 1 },
  { f: HOOK.moveFrom, x: HX, y: HOOK_L.focusY, s: 1.025 },
  { f: PILLAR_AT[0], x: P1, y: PY, s: 1 },
  { f: PILLAR_AT[1] - MOVE, x: P1, y: PY, s: 1.012 },
  { f: PILLAR_AT[1], x: P2, y: PY, s: 1 },
  { f: PILLAR_AT[2] - MOVE, x: P2, y: PY, s: 1.012 },
  { f: PILLAR_AT[2], x: P3, y: PY, s: 1 },
  { f: SYSTEM.zoomFrom, x: P3, y: PY, s: 1.015 },
  { f: SYSTEM.zoomTo, x: SYSTEM_FOCUS.x, y: SYSTEM_FOCUS.y, s: SYSTEM_SCALE },
  { f: SYSTEM.moveFrom, x: SYSTEM_FOCUS.x, y: SYSTEM_FOCUS.y, s: SYSTEM_SCALE * 1.03 },
  { f: METHOD.at, x: MX, y: METHOD_L.focusY[0], s: 1 },
  { f: METHOD.moveFrom, x: MX, y: METHOD_L.focusY[1], s: 1.01 },
  { f: OUTCOME.at, x: MX, y: OUTCOME_L.focusY, s: 1 },
  { f: OUTCOME.moveFrom, x: MX, y: OUTCOME_L.focusY - 20, s: 1.02 },
  { f: LOGO.at, x: LOGO_L.x, y: LOGO_L.y, s: 1 },
  { f: DURATION, x: LOGO_L.x, y: LOGO_L.y, s: 1.03 },
];

/**
 * Quanto da linha coral já foi desenhado, por frame (`at` = ponto nomeado
 * em layout.ts). Entre dois pontos o desenho anda com IN_OUT.
 */
export const LINE_PROGRESS: { f: number; at: string }[] = [
  { f: 0, at: "leadIn" },
  { f: 30, at: "riseTop" },
  { f: 46, at: "strikeEnd" },
  { f: 62, at: "boxLeft" },
  { f: HOOK.boxClosed, at: "boxClose" },
  { f: HOOK.moveFrom, at: "boxClose" },
  { f: PILLAR_AT[0], at: "p1Start" },
  { f: PILLAR_AT[0] + 26, at: "p1End" },
  { f: PILLAR_AT[1] - MOVE, at: "p1End" },
  { f: PILLAR_AT[1], at: "p2Start" },
  { f: PILLAR_AT[1] + 26, at: "p2End" },
  { f: PILLAR_AT[2] - MOVE, at: "p2End" },
  { f: PILLAR_AT[2], at: "p3Start" },
  { f: PILLAR_AT[2] + 26, at: "p3End" },
  { f: SYSTEM.moveFrom, at: "p3End" },
  { f: SYSTEM.moveFrom + 10, at: "methodCorner" },
  ...METHOD.steps.map((f, i) => ({ f, at: `step${i}` })),
  { f: METHOD.moveFrom, at: "step3" },
  { f: OUTCOME.curveFrom, at: "curveStart" },
  { f: OUTCOME.curveTo, at: "curveEnd" },
  { f: OUTCOME.moveFrom, at: "curveEnd" },
  { f: LOGO.at - 4, at: "logoStart" },
  { f: LOGO.baseTo, at: "logoEnd" },
];

/**
 * Som: poucos efeitos, cada um com motivo (public/sfx/, frame, volume).
 * Sem tique em cada palavra.
 */
export const SFX: { file: string; f: number; volume?: number }[] = [
  { file: "impact.wav", f: 0, volume: 0.3 },
  { file: "tick.wav", f: HOOK.grey - 2, volume: 0.25 },
  { file: "impact.wav", f: HOOK.entrega },
  { file: "whoosh.wav", f: HOOK.moveFrom - 2 },
  { file: "click.wav", f: TRAFEGO.click },
  { file: "whoosh.wav", f: PILLAR_AT[1] - MOVE - 2, volume: 0.3 },
  { file: "tick.wav", f: SISTEMAS.rowsFrom, volume: 0.2 },
  { file: "whoosh.wav", f: PILLAR_AT[2] - MOVE - 2, volume: 0.3 },
  { file: "click.wav", f: SITES.tap },
  { file: "whoosh.wav", f: SYSTEM.zoomFrom - 2 },
  { file: "whoosh.wav", f: SYSTEM.moveFrom - 2 },
  ...METHOD.steps.map((f) => ({ file: "tick.wav", f, volume: 0.18 })),
  { file: "whoosh.wav", f: METHOD.moveFrom - 2, volume: 0.35 },
  { file: "whoosh.wav", f: OUTCOME.moveFrom - 2 },
  { file: "impact.wav", f: LOGO.reveal + 8 },
  { file: "click.wav", f: CTA.closed },
];

/** Slot da trilha: public/music.mp3 (opcional); o primeiro beat do arquivo cai no frame 0. */
export const MUSIC_FIRST_BEAT_MS = 0;
