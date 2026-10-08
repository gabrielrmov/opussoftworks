import { HOOK_L, LOGO_L, METHOD_L, PILLARS_L, SECTION_L, TOOL_L } from "./layout";

/**
 * Toda a coreografia do OpusLaunch em um lugar só.
 *
 * 120 BPM → 1 beat = 15 frames a 30fps: toda entrada importante cai num
 * múltiplo de 15 (`beat(n)`); staggers de 3–5 frames ficam nos componentes.
 * Movimentos de câmera: 15 frames, com o conteúdo seguinte entrando junto.
 */
export const FPS = 30;
export const DURATION = 900;
export const BEAT = 15;
export const beat = (n: number) => n * BEAT;

// ---------- Gancho (0–120) ----------
export const HOOK = {
  resultado: beat(0),
  nao: beat(1),
  e: beat(2),
  sorte: beat(3),
  /** "sorte." apaga quando o risco passa e sai antes de o retângulo fechar */
  grey: beat(3) + 6,
  sorteOut: beat(4) - 3,
  entrega: beat(4),
  boxClosed: beat(6) + 10,
} as const;

// ---------- Pilares: os cards reais do site (120–255) ----------
export const PILLAR_AT = [beat(8), beat(11), beat(14)] as const; // câmera chega
/** traço de caneta no negrito de cada card */
export const PILLAR_MARK = PILLAR_AT.map((f) => f + 18);

// ---------- Cabeçalho real da seção (255–345) ----------
export const SECTION = { at: beat(17), underline: beat(18) + 5 };

// ---------- Método (345–495) ----------
export const METHOD_MOVE = beat(22);
export const METHOD_STEPS = [beat(23), beat(25), beat(27), beat(29)] as const;

// ---------- "Sua empresa não precisa de mais uma ferramenta." (495–570) ----------
export const TOOL = { move: beat(32), lines: [beat(33), beat(33) + 4, beat(34), beat(34) + 4], strike: beat(35) + 5 };

// ---------- "Precisa de um sistema que funcione." (570–645) ----------
export const FUNCIONE = { move: beat(37), lines: [beat(38), beat(38) + 4], funcione: beat(39), underline: beat(40) };

// ---------- Logo (645–780) ----------
export const LOGO = {
  move: beat(43),
  /** a linha chega e escreve o wordmark; impacto no beat 46 (23 s) */
  drawFrom: beat(44),
  impact: beat(46),
  shrinkFrom: beat(47),
  shrinkTo: beat(48),
};

// ---------- CTA (780–900) ----------
export const CTA = {
  /** título do CTA do site entra quando o wordmark termina de subir */
  question: beat(47) + 8,
  url: beat(51) + 3,
  lineFrom: beat(48),
  pillFrom: beat(50),
  closed: beat(51),
  at: beat(52), // 780: tudo no lugar, parado
};

/**
 * Câmera: foco (x, y) no canvas. Entre dois keyframes ela anda com
 * CAMERA_EASE; keyframes repetidos = câmera parada (só a "mão" mexe).
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
  { f: beat(16), x: P3, y: PY, s: 1 },
  { f: beat(17), x: SECTION_L.cx, y: SECTION_L.focusY, s: 1 },
  { f: beat(22), x: SECTION_L.cx, y: SECTION_L.focusY, s: 1 },
  { f: beat(23), x: MX, y: METHOD_L.focusY - 60, s: 1 },
  { f: beat(32), x: MX, y: METHOD_L.focusY, s: 1 },
  { f: beat(33), x: MX, y: TOOL_L.focusY, s: 1 },
  { f: beat(37), x: MX, y: TOOL_L.focusY, s: 1 },
  { f: beat(38), x: MX, y: TOOL_L.funcioneFocusY, s: 1 },
  { f: beat(43), x: MX, y: TOOL_L.funcioneFocusY, s: 1 },
  { f: beat(44), x: LOGO_L.x, y: LOGO_L.y, s: 1 },
  { f: DURATION, x: LOGO_L.x, y: LOGO_L.y, s: 1 },
];
/** A partir daqui a câmera fica parada (CTA). */
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
  { f: PILLAR_AT[0] + 25, at: "p1End" },
  { f: PILLAR_AT[1], at: "p2Start" },
  { f: PILLAR_AT[1] + 25, at: "p2End" },
  { f: PILLAR_AT[2], at: "p3Start" },
  { f: PILLAR_AT[2] + 25, at: "p3End" },
  { f: SECTION.at, at: "secStart" },
  { f: SECTION.at + 25, at: "secEnd" },
  { f: METHOD_MOVE, at: "secEnd" },
  { f: METHOD_MOVE + 6, at: "methodCorner" },
  ...METHOD_STEPS.map((f, i) => ({ f, at: `step${i}` })),
  { f: TOOL.move, at: "step3" },
  { f: TOOL.lines[3], at: "toolEnd" },
  { f: FUNCIONE.lines[0], at: "funcioneEnd" },
  { f: LOGO.move, at: "funcioneEnd" },
  { f: LOGO.drawFrom, at: "logoAnchor" },
];

/** Efeitos (public/sfx/, frame, volume opcional — padrões em OpusLaunch.tsx). */
export const SFX: { file: string; f: number; volume?: number }[] = [
  { file: "impact.wav", f: HOOK.resultado },
  { file: "tick.wav", f: HOOK.nao },
  { file: "tick.wav", f: HOOK.e },
  { file: "tick.wav", f: HOOK.sorte },
  { file: "impact.wav", f: HOOK.entrega },
  ...PILLAR_AT.map((f) => ({ file: "whoosh.wav", f: f - 13 })),
  ...PILLAR_MARK.map((f) => ({ file: "tick.wav", f })),
  { file: "whoosh.wav", f: SECTION.at - 13 },
  { file: "whoosh.wav", f: METHOD_MOVE - 2 },
  ...METHOD_STEPS.map((f) => ({ file: "tick.wav", f })),
  { file: "whoosh.wav", f: TOOL.move - 2 },
  { file: "tick.wav", f: TOOL.strike },
  { file: "whoosh.wav", f: FUNCIONE.move - 2 },
  { file: "impact.wav", f: FUNCIONE.funcione, volume: 0.3 },
  { file: "whoosh.wav", f: LOGO.move - 2 },
  { file: "impact.wav", f: LOGO.impact },
  { file: "click.wav", f: CTA.closed },
];

/** Slot da trilha: public/music.mp3; o primeiro beat do arquivo cai no frame 0. */
export const MUSIC_FIRST_BEAT_MS = 0;
