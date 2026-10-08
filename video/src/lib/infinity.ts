import {Cubic, mapSegs, Pt, pt, reverseCubic} from './geometry';

/**
 * Infinito assimétrico — linguagem geométrica do símbolo OPUS, reconstruída a
 * partir do storyboard (laço direito maior e mais alto, laço esquerdo mais baixo).
 * Caixa local: 0..615 × 0..390, cruzamento em (300, 205).
 */
export const INF_BOX = {width: 615, height: 390, cx: 307.5, cy: 195, drawnWidth: 535};

const X = pt(300, 205);
const T = pt(440, 40);
const R = pt(575, 190);
const B = pt(440, 340);
const T2 = pt(165, 80);
const L = pt(40, 215);
const B2 = pt(165, 350);

const s1: Cubic = [X, pt(360, 145), pt(365, 40), T];
const s2: Cubic = [T, pt(514.6, 40), pt(575, 107.2), R];
const s3: Cubic = [R, pt(575, 272.8), pt(514.6, 340), B];
const s4: Cubic = [B, pt(365, 340), pt(360, 265), X];
const s5: Cubic = [X, pt(240, 145), pt(235, 80), T2];
const s6: Cubic = [T2, pt(96, 80), pt(40, 140.4), L];
const s7: Cubic = [L, pt(40, 289.6), pt(96, 350), B2];
const s8: Cubic = [B2, pt(235, 350), pt(240, 265), X];

/** Traçado completo partindo do cruzamento (desenho contínuo do símbolo). */
export const INF_FROM_CROSS: Cubic[] = [s1, s2, s3, s4, s5, s6, s7, s8];

/** Traçado partindo da extremidade direita, subindo — por onde a linha coral entra. */
export const INF_FROM_RIGHT: Cubic[] = [s2, s1, s8, s7, s6, s5, s4, s3].map(reverseCubic);
export const INF_RIGHT_POINT = R;

/** Leva coordenadas locais do símbolo para a tela (centro + largura desejada). */
export const infinityToScreen = (cx: number, cy: number, width: number) => {
  const s = width / INF_BOX.drawnWidth;
  return (p: Pt): Pt => ({x: (p.x - INF_BOX.cx) * s + cx, y: (p.y - INF_BOX.cy) * s + cy});
};

export const placeInfinity = (segs: Cubic[], cx: number, cy: number, width: number) =>
  mapSegs(segs, infinityToScreen(cx, cy, width));
