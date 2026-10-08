import {pt} from './geometry';

// Coordenadas lidas do storyboard (quadro do celular escalado ~5,93× para 1080×1920).
export const TEXT_X = 100;
export const TEXT_W = 880;
export const TEXT_TOP = 1470;

export const S1_CENTER = pt(540, 680);

/** Fio condutor: arco coral recorrente nos boards 01, 03 e 05. */
export const THREAD = {center: pt(249, 634), r: 504, fromDeg: 200, toDeg: 12};

export const S3_NODES = {
  a: pt(220, 563),
  b: pt(860, 563),
  center: pt(540, 747),
  bottom: pt(540, 1103),
};

export const S4_CARD = {x: 100, w: 880, h: 236, tile: 112, tileX: 204};
export const S4_CENTERS_Y = [492, 866, 1245];

export const S5_NODES = {
  top: pt(540, 498),
  left: pt(214, 1109),
  right: pt(866, 1109),
  center: pt(540, 872),
};
export const S5_NODE_SIZE = 168;
export const S5_CORE_R = 128;

export const TIMELINE = {y: 872, xs: [190, 423, 657, 890], r: 50};

/** Linha de destaque sob "É entrega." — vira o fio que revela o logo. */
export const PROMISE_LINE = {x1: 100, x2: 840, y: 1130, width: 10};

export const LOGO = {cx: 540, cy: 676, width: 570};

export const TOP_RULE = {y: 280, x1: 100, x2: 980};
