import {Cubic, mapSegs, Pt, pt, reverseCubic} from './geometry';

/**
 * Infinito assimétrico OPUS — linha central medida no arquivo oficial
 * (`public/brand/opus-simbolo.png`, 679×441 px): laço esquerdo pequeno,
 * laço direito grande, cruzamento em (222, 214). As coordenadas locais são as
 * mesmas pixels da imagem, então traço, máscara e arquivo coincidem.
 */
export const INF_BOX = {width: 679, height: 441, cx: 339.5, cy: 220.5, drawnWidth: 679};

/** Espessura do traço do símbolo oficial, em unidades locais. */
export const INF_STROKE = 66;

const X = pt(222, 214);
const TR = pt(530, 40);
const R = pt(640, 190);
const BR = pt(500, 388);
const TL = pt(85, 122);
const L = pt(40, 170);
const BL = pt(120, 249);

const s1: Cubic = [X, pt(366, 124), pt(420, 40), TR];
const s2: Cubic = [TR, pt(595, 40), pt(640, 105), R];
const s3: Cubic = [R, pt(640, 300), pt(595, 388), BR];
const s4: Cubic = [BR, pt(420, 388), pt(317, 302), X];
const s5: Cubic = [X, pt(156, 153), pt(130, 129), TL];
const s6: Cubic = [TL, pt(55, 117.5), pt(40, 135), L];
const s7: Cubic = [L, pt(40, 212), pt(72, 247), BL];
const s8: Cubic = [BL, pt(165, 249), pt(179.5, 240.5), X];

/** Traçado completo partindo do cruzamento (desenho contínuo do símbolo). */
export const INF_FROM_CROSS: Cubic[] = [s1, s2, s3, s4, s5, s6, s7, s8];

/** Traçado partindo da extremidade direita, subindo — por onde a linha coral entra. */
export const INF_FROM_RIGHT: Cubic[] = [s2, s1, s8, s7, s6, s5, s4, s3].map(reverseCubic);
export const INF_RIGHT_POINT = R;

/** Leva coordenadas locais do símbolo para a tela (centro + largura total desejada). */
export const infinityToScreen = (cx: number, cy: number, width: number) => {
  const s = width / INF_BOX.drawnWidth;
  return (p: Pt): Pt => ({x: (p.x - INF_BOX.cx) * s + cx, y: (p.y - INF_BOX.cy) * s + cy});
};

export const placeInfinity = (segs: Cubic[], cx: number, cy: number, width: number) =>
  mapSegs(segs, infinityToScreen(cx, cy, width));
