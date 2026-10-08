import { getLength } from "@remotion/paths";
import SITE from "../../public/site/opus-390.json";

/**
 * Geometria do canvas (coordenadas de mundo, em px na escala 1).
 *
 * O foco da câmera vai pra SCREEN_FOCUS — centro horizontal do quadro e
 * centro vertical da safe zone (220 px livres no topo, 380 embaixo). Cada
 * bloco é centrado pelo próprio conteúdo e tem no máximo MAX_W de largura.
 */
export const W = 1080;
export const H = 1920;
export const SAFE = { top: 220, bottom: H - 380 };
export const MAX_W = 860;
export const SCREEN_FOCUS = { x: W / 2, y: (SAFE.top + SAFE.bottom) / 2 }; // (540, 880)
export const LINE_W = 10;

/** Cores do site. O fundo é o mesmo #FAFAFA da página, pra os recortes reais se fundirem. */
export const COLOR = {
  paper: "#FAFAFA",
  ink: "#171717",
  muted: "#5F5F5F",
  grey: "#A3A3A0",
  coral: "#FF6039",
  white: "#FFFFFF",
  dot: "rgba(22, 93, 252, 0.30)",
};

/* ------------------------------- Gancho ------------------------------- */
// Métricas da Inter Tight 700 (line-height 1): "É entrega." a 186 px vai de
// -108 a +108 do centro; o meio da altura-x fica 0,089em abaixo do centro.
const HOOK_SIZE = 180;
const ROWS = { resultado: 600, naoE: 790, sorte: 980 };
const STRIKE_Y = ROWS.sorte + 0.089 * HOOK_SIZE;
const ENTREGA_SIZE = 186;
const ENTREGA_HALF_W = 783 / 2;
const ENTREGA_HALF_H = 108;
const PAD = 24 + LINE_W / 2; // 24 px de respiro até a borda da linha
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
  focusY: (ROWS.resultado - 0.362 * HOOK_SIZE + ENTREGA_Y + ENTREGA_HALF_H + PAD) / 2,
};

/* ------------------- Pilares: os cards reais do site ------------------- */
/** px de vídeo por px CSS do site (card de 342 px → 860 px). */
export const SITE_K = MAX_W / SITE.cards[0].card.w;
const CARD_TOP = 905;
export const PILLARS_L = {
  cx: [1940, 3140, 4340],
  labelTop: 400,
  /** base das duas linhas do título (o texto sobe a partir daqui) */
  headlineBottom: 865,
  cardTop: CARD_TOP,
  cardH: SITE.cards[0].card.h * SITE_K,
  lineY: 1480,
  focusY: 945,
};

/** Caixas (mundo) das linhas em negrito de cada card, a partir do getBoundingClientRect real. */
export const emphasisBoxes = (i: number) => {
  const c = SITE.cards[i];
  const left = PILLARS_L.cx[i] - MAX_W / 2;
  return c.emphasisLines.map((r) => ({
    x: left + (r.x - c.card.x) * SITE_K,
    y: CARD_TOP + (r.y - c.card.y) * SITE_K,
    w: r.w * SITE_K,
    h: r.h * SITE_K,
  }));
};

/* --------------- Cabeçalho real da seção ("Três frentes...") --------------- */
const HEADER = SITE.rects.solucoesHeader;
const SECTION_H = HEADER.h * SITE_K;
/** Recortes de public/site (gerados por scripts/crop-site.py a partir da captura). */
export const CROPS = {
  cards: SITE.cards.map((_, i) => `site/card-${i + 1}.png`),
  section: "site/section.png",
};
export const SECTION_L = {
  cx: 5540,
  focusY: 945,
  top: 945 - SECTION_H / 2,
  h: SECTION_H,
  /** h2 "Três frentes, uma mesma estratégia." dentro do recorte (mundo) */
  h2: (() => {
    const r = SITE.rects.tresFrentes;
    return { x: 5540 - MAX_W / 2 + (r.x - HEADER.x) * SITE_K, y: 945 - SECTION_H / 2 + (r.y - HEADER.y) * SITE_K, w: r.w * SITE_K, h: r.h * SITE_K };
  })(),
};

/* ------------------------------- Método ------------------------------- */
const MX = 6740;
const COL_LEFT = MX - MAX_W / 2;
export const METHOD_L = {
  cx: MX,
  lineX: COL_LEFT + 28,
  textX: COL_LEFT + 80,
  textW: MAX_W - 80,
  nameMax: 112,
  subSize: 48,
  steps: [1760, 2060, 2360, 2660],
  focusY: 2235,
};

/* ---------- "Sua empresa não precisa..." / "Precisa de um sistema..." ---------- */
export const TOOL_L = {
  textX: METHOD_L.textX,
  textW: METHOD_L.textW,
  // folga de 350 px depois do método: com a câmera aqui, a última etapa já saiu do quadro
  rows: [3370, 3510, 3650, 3790],
  rowMax: 136,
  focusY: 3640,
  // 250 px a mais de folga: com a câmera em "funcione." as linhas de cima já saíram do quadro
  funcioneRows: [4520, 4660],
  funcioneTop: 4810,
  funcioneMax: 230,
  funcioneFocusY: 4780,
  bottom: 5060,
};

/* ------------------------------ Logo + CTA ------------------------------ */
// O wordmark nasce no alto da tela (y 480), com ~78% da largura, escrito
// pela linha; a pergunta e a URL entram embaixo dele. Câmera fixa até o fim.
export const WORDMARK = { revealSize: 116, revealW: 839, revealSy: 480, ctaSize: 80, ctaSy: 430 };
export const LOGO_L = { x: MX, y: TOOL_L.funcioneFocusY + 1350 };

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

export const BUTTON_RECT = (() => {
  const c = toWorld(SCREEN_FOCUS.x, CTA_L.button.sy);
  return { cx: c.x, cy: c.y, w: CTA_L.button.w, h: CTA_L.button.h };
})();

/** Trecho que sai do fim do wordmark (já no topo do CTA) e fecha no botão. */
export const CTA_LINE_PATH = (() => {
  const a = toWorld(SCREEN_FOCUS.x + (WORDMARK.revealW * WORDMARK.ctaSize) / WORDMARK.revealSize / 2 + 16, WORDMARK.ctaSy);
  const c1 = toWorld(1000, WORDMARK.ctaSy);
  const c2 = toWorld(1000, CTA_L.button.sy - CTA_L.button.h / 2);
  const end = { x: BUTTON_RECT.cx + BUTTON_RECT.w / 2 - BUTTON_RECT.h / 2, y: BUTTON_RECT.cy - BUTTON_RECT.h / 2 };
  return `M ${a.x} ${a.y} C ${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`;
})();

/* ----------------------------- Linha principal ----------------------------- */
const B = HOOK_L.box;
const R = 60;
const [P1, P2, P3] = PILLARS_L.cx;
const half = MAX_W / 2;
const LY = PILLARS_L.lineY;
const LX = METHOD_L.lineX;
const SX = SECTION_L.cx;
const WM_LEFT = toWorld(SCREEN_FOCUS.x - WORDMARK.revealW / 2 - 18, WORDMARK.revealSy);

/**
 * A linha coral: uma trajetória só. Sobe pela direita no gancho, risca
 * "sorte." e fecha o retângulo de "É entrega."; passa por baixo dos três
 * cards e do cabeçalho real; desce como a timeline do método e pela margem
 * dos dois blocos finais; e chega no wordmark.
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
  { name: "secStart", d: `L ${SX - half} ${LY}` },
  { name: "secEnd", d: `L ${SX + half} ${LY}` },
  { name: "methodCorner", d: `L ${LX - R} ${LY} Q ${LX} ${LY} ${LX} ${LY + R}` },
  ...METHOD_L.steps.map((y, i) => ({ name: `step${i}`, d: `L ${LX} ${y}` })),
  { name: "toolEnd", d: `L ${LX} ${TOOL_L.rows[3] + 120}` },
  { name: "funcioneEnd", d: `L ${LX} ${TOOL_L.bottom}` },
  { name: "logoAnchor", d: `L ${LX} ${WM_LEFT.y - 140} C ${LX} ${WM_LEFT.y - 60} ${WM_LEFT.x} ${WM_LEFT.y - 60} ${WM_LEFT.x} ${WM_LEFT.y}` },
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
