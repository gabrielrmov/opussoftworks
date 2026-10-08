import { getLength } from "@remotion/paths";

/**
 * Geometria do canvas (coordenadas de mundo, em px na escala 1).
 * A tela mapeia o foco da câmera em SCREEN_FOCUS, o centro da safe zone:
 * 220 px livres no topo, 380 embaixo, 140 na direita (e 60 na esquerda).
 */
export const W = 1080;
export const H = 1920;
export const SAFE = { top: 220, bottom: H - 380, left: 60, right: W - 140 };
export const SCREEN_FOCUS = { x: (SAFE.left + SAFE.right) / 2, y: (SAFE.top + SAFE.bottom) / 2 }; // (500, 880)

export const HOOK_L = {
  x: 60,
  size: 196,
  rows: { resultado: 560, naoE: 770, sorte: 980 },
  strikeY: 996,
  entrega: { y: 1240, size: 196 },
  /** linha que já está subindo pela direita desde o frame 0 */
  leadX: 930,
  underlineY: 1372,
};

export const PILLARS_L = {
  cx: [1900, 3100, 4300],
  titleY: 520,
  titleSize: 176,
  ui: { top: 650, w: 880, h: 810 },
  lineY: 1560,
};

export const METHOD_L = { lineX: 5000, textX: 5034, size: 130, steps: [1820, 2150, 2480, 2810] };

export const OUTCOME_L = { textX: 5034, size: 130, rows: [3560, 3720, 3880, 4040] };

export const LOGO_L = { cx: 6700, cy: 3500, pill: { w: 980, h: 300 }, size: 120 };

/** Câmera do CTA — os elementos do CTA são posicionados em coordenadas de tela. */
export const CTA_CAM = { x: 6700, y: 4062, s: 0.8 };
export const toWorld = (sx: number, sy: number, cam = CTA_CAM) => ({
  x: cam.x + (sx - SCREEN_FOCUS.x) / cam.s,
  y: cam.y + (sy - SCREEN_FOCUS.y) / cam.s,
});
export const CTA_L = {
  wordmarkSy: 430,
  questionSy: [690, 830],
  questionSize: 120,
  button: { sy: 1090, w: 840, h: 168, text: 52 },
  urlSy: 1290,
  urlSize: 48,
};

/** Pílula (retângulo arredondado) começando no canto inferior esquerdo. */
export const pillPath = (cx: number, cy: number, w: number, h: number) => {
  const r = h / 2;
  const x0 = cx - w / 2 + r;
  const x1 = cx + w / 2 - r;
  const top = cy - h / 2;
  const bottom = cy + h / 2;
  return `M ${x0} ${bottom} L ${x1} ${bottom} A ${r} ${r} 0 0 0 ${x1} ${top} L ${x0} ${top} A ${r} ${r} 0 0 0 ${x0} ${bottom}`;
};

const [P1, P2, P3] = PILLARS_L.cx;
const half = PILLARS_L.ui.w / 2;
const LY = PILLARS_L.lineY;
export const CURVE_END = { x: 5920, y: 4200 };
const MX = METHOD_L.lineX;

/**
 * A linha coral: uma única trajetória. Cada trecho termina num ponto com
 * nome, que o LINE_PROGRESS (timeline.ts) usa pra saber até onde desenhar.
 */
const SEGMENTS: { name: string; d: string }[] = [
  { name: "start", d: `M ${HOOK_L.leadX} 1760` },
  { name: "leadIn", d: `L ${HOOK_L.leadX} 1200` },
  { name: "riseTop", d: `L ${HOOK_L.leadX} ${HOOK_L.strikeY + 60} Q ${HOOK_L.leadX} ${HOOK_L.strikeY} ${HOOK_L.leadX - 60} ${HOOK_L.strikeY}` },
  { name: "strikeEnd", d: `L 40 ${HOOK_L.strikeY}` },
  { name: "underlineStart", d: `L 40 ${HOOK_L.underlineY - 60} Q 40 ${HOOK_L.underlineY} 100 ${HOOK_L.underlineY}` },
  { name: "underlineEnd", d: `L 940 ${HOOK_L.underlineY}` },
  { name: "p1Start", d: `C 1160 ${HOOK_L.underlineY} 1240 ${LY} ${P1 - half} ${LY}` },
  { name: "p1End", d: `L ${P1 + half} ${LY}` },
  { name: "p2Start", d: `L ${P2 - half} ${LY}` },
  { name: "p2End", d: `L ${P2 + half} ${LY}` },
  { name: "p3Start", d: `L ${P3 - half} ${LY}` },
  { name: "p3End", d: `L ${P3 + half} ${LY}` },
  { name: "methodCorner", d: `L ${MX - 60} ${LY} Q ${MX} ${LY} ${MX} ${LY + 60}` },
  ...METHOD_L.steps.map((y, i) => ({ name: `step${i}`, d: `L ${MX} ${y}` })),
  { name: "curveStart", d: `L ${MX} 4500 Q ${MX} 4560 ${MX + 60} 4560` },
  { name: "curveEnd", d: `C 5400 4560 5650 4460 ${CURVE_END.x} ${CURVE_END.y}` },
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
  // O trecho até a pílula e a própria pílula são desenhados à parte (ver
  // CoralLine), porque acompanham a pílula quando ela vira o botão do CTA.
  out.pillStart = out.curveEnd;
  out.pillEnd = out.curveEnd;
  return out;
})();
