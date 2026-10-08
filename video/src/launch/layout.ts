import { getLength } from "@remotion/paths";

/**
 * Geometria do canvas (coordenadas de mundo, em px na escala 1).
 *
 * Grid único: tudo alinha à esquerda em x = 110 da tela (coluna de 860 px),
 * menos o fechamento (logo + CTA), que é centrado. O foco da câmera vai pra
 * SCREEN_FOCUS — centro horizontal do quadro e centro vertical da safe zone
 * (220 px livres no topo, 380 embaixo).
 */
export const W = 1080;
export const H = 1920;
export const SAFE = { top: 220, bottom: H - 380 };
export const MAX_W = 860;
export const SCREEN_FOCUS = { x: W / 2, y: (SAFE.top + SAFE.bottom) / 2 }; // (540, 880)
export const LINE_W = 10;

export const COLOR = {
  paper: "#FAFAFA",
  dot: "#DEDEDC",
  ink: "#171717",
  muted: "#5F5F5F",
  grey: "#A3A3A0",
  line: "#E6E6E4",
  fill: "#F3F3F2",
  coral: "#FF6039",
  white: "#FFFFFF",
};

/* ------------------------------- Gancho ------------------------------- */
// Métricas da Inter Tight 700 (line-height 1): "É entrega." a 186 px tem 783 px
// de largura e vai de -108 a +108 do centro; o meio da altura-x fica 0,089em
// abaixo do centro e o topo de "Resultado" a -0,362em.
const HX0 = W / 2 - MAX_W / 2; // 110
const HOOK_SIZE = 180;
const ROWS = { resultado: 600, naoE: 790, sorte: 980 };
const STRIKE_Y = ROWS.sorte + 0.089 * HOOK_SIZE;
const ENTREGA_SIZE = 186;
const ENTREGA_W = 783;
const ENTREGA_HALF_H = 108;
const PAD = 24 + LINE_W / 2; // 24 px de respiro até a borda da linha
const ENTREGA_Y = STRIKE_Y + PAD + ENTREGA_HALF_H;
export const HOOK_L = {
  cx: W / 2,
  x0: HX0,
  size: HOOK_SIZE,
  rows: ROWS,
  strikeY: STRIKE_Y,
  entrega: { y: ENTREGA_Y, size: ENTREGA_SIZE },
  // a caixa "pendura" pra fora do grid (alinhamento ótico: o texto fica em x0)
  box: { left: HX0 - PAD, right: HX0 + ENTREGA_W + PAD, top: STRIKE_Y, bottom: ENTREGA_Y + ENTREGA_HALF_H + PAD },
  focusY: (ROWS.resultado - 0.362 * HOOK_SIZE + ENTREGA_Y + ENTREGA_HALF_H + PAD) / 2,
};

/* ------------------------------- Pilares ------------------------------- */
export const PILLARS_L = {
  cx: [1940, 2940, 3940],
  titleY: 470,
  titleSize: 176,
  ui: { top: 590, w: MAX_W, h: 840 },
  lineY: 1510,
  focusY: 955,
};

/* -------------- Visão geral: a câmera abre e mostra os três -------------- */
const ROW_W = PILLARS_L.cx[2] - PILLARS_L.cx[0] + MAX_W;
export const SYSTEM_SCALE = MAX_W / ROW_W;
export const SYSTEM_ROW_SY = 1080; // centro da fileira na tela
export const SYSTEM_FOCUS = {
  x: PILLARS_L.cx[1],
  y: PILLARS_L.focusY - (SYSTEM_ROW_SY - SCREEN_FOCUS.y) / SYSTEM_SCALE,
};
export const SYSTEM_TITLE = { sy: [600, 730], size: 124 };

/* ------------------------------- Método ------------------------------- */
const MX = 5600; // eixo do método, do outcome e do fechamento
const COL_LEFT = MX - MAX_W / 2;
export const METHOD_L = {
  cx: MX,
  lineX: COL_LEFT + 28,
  textX: COL_LEFT + 80,
  textW: MAX_W - 80,
  size: 118,
  steps: [1720, 2020, 2320, 2620],
  focusY: [2150, 2190],
};

/* ------------------------------- Outcome ------------------------------- */
export const OUTCOME_L = {
  textX: METHOD_L.textX,
  size: 124,
  rows: [3260, 3410, 3560, 3700],
  curveBottomY: 4040,
  curveEnd: { x: MX + MAX_W / 2, y: 3800 },
  focusY: 3640,
};

/* ------------------------------ Logo + CTA ------------------------------ */
// Depois da curva de crescimento a linha segue pra direita e assenta num
// patamar: vira a linha de base do wordmark, que nasce de trás dela no centro
// da tela. A câmera só faz um pan horizontal; parada do logo ao fim.
export const LOGO_L = { x: MX + 1600, y: OUTCOME_L.focusY };
export const WORDMARK = { revealSize: 104, revealSy: 860, ctaSize: 84, ctaSy: 500 };

export const toWorld = (sx: number, sy: number) => ({
  x: LOGO_L.x + (sx - SCREEN_FOCUS.x),
  y: LOGO_L.y + (sy - SCREEN_FOCUS.y),
});
/** Linha de base do wordmark (tela): abaixo da descendente do "p". */
export const WM_BASELINE_SY = WORDMARK.revealSy + WORDMARK.revealSize / 2 + 30;
/** Borda de baixo da máscara do wordmark (tela). */
export const WM_MASK_BOTTOM_SY = WM_BASELINE_SY - LINE_W / 2 - 6;

export const CTA_L = {
  questionSy: [770, 890],
  questionMax: 104,
  button: { sy: 1100, w: 800, h: 136, text: 46 },
  urlSy: 1262,
  urlSize: 40,
};

export const BUTTON_RECT = (() => {
  const c = toWorld(SCREEN_FOCUS.x, CTA_L.button.sy);
  return { cx: c.x, cy: c.y, w: CTA_L.button.w, h: CTA_L.button.h };
})();

/** As duas metades do contorno do botão, do meio do topo até o meio de baixo. */
export const BUTTON_HALVES = (() => {
  const { cx, cy, w, h } = BUTTON_RECT;
  const r = h / 2;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  const x0 = cx - w / 2 + r;
  const x1 = cx + w / 2 - r;
  return [
    `M ${cx} ${top} L ${x1} ${top} A ${r} ${r} 0 0 1 ${x1} ${bottom} L ${cx} ${bottom}`,
    `M ${cx} ${top} L ${x0} ${top} A ${r} ${r} 0 0 0 ${x0} ${bottom} L ${cx} ${bottom}`,
  ];
})();

/* ----------------------------- Linha principal ----------------------------- */
const B = HOOK_L.box;
const R = 60;
const [P1, P2, P3] = PILLARS_L.cx;
const half = MAX_W / 2;
const LY = PILLARS_L.lineY;
const LX = METHOD_L.lineX;
const CE = OUTCOME_L.curveEnd;
const UY = toWorld(0, WM_BASELINE_SY).y;
const BASE_LEFT = toWorld(HX0, 0).x;
const BASE_RIGHT = toWorld(W - HX0, 0).x;

/**
 * A linha coral: uma trajetória só, sem enfeite na ponta. Sobe pela direita
 * no gancho, risca "sorte." e fecha a caixa de "É entrega."; corre por baixo
 * dos três pilares; desce como a timeline do método; vira a curva de
 * crescimento; e assenta num patamar, a linha de base do wordmark.
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
  { name: "curveStart", d: `L ${LX} ${OUTCOME_L.curveBottomY - R} Q ${LX} ${OUTCOME_L.curveBottomY} ${LX + R} ${OUTCOME_L.curveBottomY}` },
  { name: "curveEnd", d: `C ${LX + 380} ${OUTCOME_L.curveBottomY} ${CE.x - 300} ${CE.y + 130} ${CE.x} ${CE.y}` },
  { name: "logoStart", d: `C ${CE.x + 260} ${CE.y - 90} ${BASE_LEFT - 300} ${UY} ${BASE_LEFT} ${UY}` },
  { name: "logoEnd", d: `L ${BASE_RIGHT} ${UY}` },
];

export const LINE_PATH = SEGMENTS.map((s) => s.d).join(" ");
export const LINE_LENGTH = getLength(LINE_PATH);

export const WAYPOINTS: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  let d = "";
  for (const s of SEGMENTS) {
    d = d ? `${d} ${s.d}` : s.d;
    out[s.name] = s.name === "start" ? 0 : getLength(d);
  }
  return out;
})();

export const STEP_LENGTHS = METHOD_L.steps.map((_, i) => WAYPOINTS[`step${i}`]);
