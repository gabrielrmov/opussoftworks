import { getLength } from "@remotion/paths";

/**
 * Geometria do canvas (coordenadas de mundo, em px na escala 1).
 *
 * Enquadramento: o foco da câmera vai pra SCREEN_FOCUS — centro horizontal
 * do quadro e centro vertical da safe zone (220 px livres no topo, 380
 * embaixo). Cada bloco é centrado pelo bounding box do próprio conteúdo e
 * tem no máximo MAX_W de largura: com a "respiração" da câmera (+3%) ainda
 * sobram ≥ 96 px de margem lateral.
 */
export const W = 1080;
export const H = 1920;
export const SAFE = { top: 220, bottom: H - 380 };
export const MARGIN_X = 96;
export const MAX_W = 860;
export const SCREEN_FOCUS = { x: W / 2, y: (SAFE.top + SAFE.bottom) / 2 }; // (540, 880)
export const LINE_W = 10;

/* ------------------------------- Hook ------------------------------- */
// Métricas da Inter Tight 700 (line-height 1), medidas na fonte:
// "É entrega." a 186 px vai de -108 a +108 do centro da linha; o meio da
// altura-x fica 0,089em abaixo do centro e o topo de "Resultado" a -0,362em.
// 180 px: "Resultado" em escala 1.15 (entrada) ainda cabe com > 96 px de margem.
const HOOK_SIZE = 180;
const ROWS = { resultado: 600, naoE: 790, sorte: 980 };
const STRIKE_Y = ROWS.sorte + 0.089 * HOOK_SIZE;
const ENTREGA_SIZE = 186;
const ENTREGA_HALF_W = 783 / 2;
const ENTREGA_HALF_H = 108;
const PAD = 24 + LINE_W / 2; // respiro de 24 px até a borda da linha
const ENTREGA_Y = STRIKE_Y + PAD + ENTREGA_HALF_H;
export const HOOK_L = {
  cx: W / 2,
  size: HOOK_SIZE,
  rows: ROWS,
  strikeY: STRIKE_Y,
  entrega: { y: ENTREGA_Y, size: ENTREGA_SIZE },
  box: {
    left: W / 2 - ENTREGA_HALF_W - PAD,
    right: W / 2 + ENTREGA_HALF_W + PAD,
    top: STRIKE_Y,
    bottom: ENTREGA_Y + ENTREGA_HALF_H + PAD,
  },
  /** foco da câmera com o bloco inteiro na tela (centro do bbox) */
  focusY: (ROWS.resultado - 0.362 * HOOK_SIZE + ENTREGA_Y + ENTREGA_HALF_H + PAD) / 2,
};

/* ------------------------------ Pilares ----------------------------- */
export const PILLARS_L = {
  cx: [1940, 3140, 4340],
  titleY: 470,
  titleSize: 176,
  ui: { top: 590, w: MAX_W, h: 840 },
  lineY: 1510,
  /** centro vertical do bbox (título → linha) */
  focusY: 955,
};

/* ------------------------------ Sistema ----------------------------- */
// Os três pilares lado a lado cabem em MAX_W.
const ROW_W = PILLARS_L.cx[2] - PILLARS_L.cx[0] + MAX_W;
export const SYSTEM_SCALE = MAX_W / ROW_W;
export const SYSTEM_ROW_SY = 1060; // centro da fileira na tela
export const SYSTEM_FOCUS = {
  x: PILLARS_L.cx[1],
  y: PILLARS_L.focusY - (SYSTEM_ROW_SY - SCREEN_FOCUS.y) / SYSTEM_SCALE,
};

/* ------------------------------ Método ------------------------------ */
const MX = 5600; // centro da coluna do método e do outcome
const COL_LEFT = MX - 427; // bbox de 854 px: nó (28) + respiro (52) + texto
export const METHOD_L = {
  cx: MX,
  lineX: COL_LEFT + 28,
  textX: COL_LEFT + 28 + 52,
  size: 118,
  steps: [1720, 2020, 2320, 2620],
};

/* ------------------------------ Outcome ----------------------------- */
export const OUTCOME_L = {
  cx: MX,
  textX: METHOD_L.textX,
  size: 124,
  rows: [3260, 3410, 3560, 3710],
  curveBottomY: 4040,
  curveEnd: { x: MX + MAX_W / 2, y: 3800 },
  focusY: 3650,
};

/* ---------------------------- Logo + CTA ---------------------------- */
// Logo + CTA ficam logo abaixo do outcome, no mesmo eixo: a transição é uma
// rolagem vertical (o outcome sobe enquanto o CTA entra por baixo). O
// wordmark nasce no alto da tela (y 480), com 839 px (~78% da largura),
// escrito pela linha; a pergunta e a URL já entram embaixo dele.
// LOGO_L é o foco da câmera (fixa até o fim).
export const WORDMARK = { revealSize: 124, revealW: 839, revealSy: 480, ctaSize: 80, ctaSy: 430 };
export const LOGO_L = { x: MX, y: OUTCOME_L.focusY + 1350 };

/** A câmera fica parada do logo até o fim: posições do CTA em pixels de tela. */
export const toWorld = (sx: number, sy: number) => ({
  x: LOGO_L.x + (sx - SCREEN_FOCUS.x),
  y: LOGO_L.y + (sy - SCREEN_FOCUS.y),
});
export const CTA_L = {
  questionSy: [700, 820],
  questionSize: 104,
  button: { sy: 1030, w: 800, h: 136, text: 48 },
  urlSy: 1190,
  urlSize: 44,
};

/** Pílula começando no fim reto do topo, à direita, e voltando a ele. */
export const pillPath = (cx: number, cy: number, w: number, h: number) => {
  const r = h / 2;
  const x0 = cx - w / 2 + r;
  const x1 = cx + w / 2 - r;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  return `M ${x1} ${top} L ${x0} ${top} A ${r} ${r} 0 0 0 ${x0} ${bottom} L ${x1} ${bottom} A ${r} ${r} 0 0 0 ${x1} ${top}`;
};

/** Contorno do botão do CTA (mundo). */
export const BUTTON_RECT = (() => {
  const c = toWorld(SCREEN_FOCUS.x, CTA_L.button.sy);
  return { cx: c.x, cy: c.y, w: CTA_L.button.w, h: CTA_L.button.h };
})();

/** Trecho que sai do fim do wordmark (já no topo do CTA) e desce até o botão. */
export const CTA_LINE_PATH = (() => {
  const a = toWorld(SCREEN_FOCUS.x + (WORDMARK.revealW * WORDMARK.ctaSize) / WORDMARK.revealSize / 2 + 16, WORDMARK.ctaSy);
  const c1 = toWorld(1000, WORDMARK.ctaSy);
  const c2 = toWorld(1000, CTA_L.button.sy - CTA_L.button.h / 2);
  const end = { x: BUTTON_RECT.cx + BUTTON_RECT.w / 2 - BUTTON_RECT.h / 2, y: BUTTON_RECT.cy - BUTTON_RECT.h / 2 };
  return `M ${a.x} ${a.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`;
})();

/* --------------------------- Linha principal -------------------------- */
const B = HOOK_L.box;
const R = 60; // raio das curvas
const [P1, P2, P3] = PILLARS_L.cx;
const half = PILLARS_L.ui.w / 2;
const LY = PILLARS_L.lineY;
const LX = METHOD_L.lineX;
const CE = OUTCOME_L.curveEnd;
const WM_LEFT = { x: LOGO_L.x - WORDMARK.revealW / 2 - 14, y: LOGO_L.y - (SCREEN_FOCUS.y - WORDMARK.revealSy) };

/**
 * A linha coral: uma única trajetória. Cada trecho termina num ponto com
 * nome, que o LINE_PROGRESS (timeline.ts) usa pra saber até onde desenhar.
 * No gancho ela sobe pela direita, risca "sorte." e fecha o retângulo de
 * "É entrega." (a lateral direita é a própria subida).
 */
const SEGMENTS: { name: string; d: string }[] = [
  { name: "start", d: `M ${B.right} 1760` },
  { name: "leadIn", d: `L ${B.right} 1300` },
  { name: "riseTop", d: `L ${B.right} ${B.top + R} Q ${B.right} ${B.top} ${B.right - R} ${B.top}` },
  { name: "strikeEnd", d: `L ${B.left + R} ${B.top}` },
  { name: "boxLeft", d: `Q ${B.left} ${B.top} ${B.left} ${B.top + R} L ${B.left} ${B.bottom - R} Q ${B.left} ${B.bottom} ${B.left + R} ${B.bottom}` },
  { name: "boxClose", d: `L ${B.right} ${B.bottom}` },
  { name: "p1Start", d: `L ${B.right + 220} ${B.bottom} C ${B.right + 420} ${B.bottom} ${P1 - half - 200} ${LY} ${P1 - half} ${LY}` },
  { name: "p1End", d: `L ${P1 + half} ${LY}` },
  { name: "p2Start", d: `L ${P2 - half} ${LY}` },
  { name: "p2End", d: `L ${P2 + half} ${LY}` },
  { name: "p3Start", d: `L ${P3 - half} ${LY}` },
  { name: "p3End", d: `L ${P3 + half} ${LY}` },
  { name: "methodCorner", d: `L ${LX - R} ${LY} Q ${LX} ${LY} ${LX} ${LY + R}` },
  ...METHOD_L.steps.map((y, i) => ({ name: `step${i}`, d: `L ${LX} ${y}` })),
  {
    name: "curveStart",
    d: `L ${LX} ${OUTCOME_L.curveBottomY - R} Q ${LX} ${OUTCOME_L.curveBottomY} ${LX + R} ${OUTCOME_L.curveBottomY}`,
  },
  { name: "curveEnd", d: `C ${LX + 380} ${OUTCOME_L.curveBottomY} ${CE.x - 300} ${CE.y + 130} ${CE.x} ${CE.y}` },
  { name: "logoAnchor", d: `C ${CE.x + 60} ${CE.y + 260} ${WM_LEFT.x - 220} ${WM_LEFT.y} ${WM_LEFT.x} ${WM_LEFT.y}` },
];

export const LINE_PATH = SEGMENTS.map((s) => s.d).join(" ");
export const LINE_LENGTH = getLength(LINE_PATH);

/** Comprimento acumulado da linha até cada ponto nomeado. */
export const WAYPOINTS: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let d = "";
  for (const s of SEGMENTS) {
    d = d ? `${d} ${s.d}` : s.d;
    out[s.name] = s.name === "start" ? 0 : getLength(d);
  }
  return out;
})();

/** Posição (comprimento) de cada nó do método na linha. */
export const STEP_LENGTHS = METHOD_L.steps.map((_, i) => WAYPOINTS[`step${i}`]);
