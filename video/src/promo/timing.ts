// Promo OPUS — ritmo de cortes rápidos (referência CENDAP). 1080×1920 · 30fps.
//
// Cada plano tem uma duração "de animação" e pausas de leitura (holds): depois
// que o texto termina de entrar, o tempo do plano desacelera para 15% durante
// `len` frames — o texto fica na tela, mas nada congela por completo.

export type Hold = {at: number; len: number};
export type ShotDef = {name: string; dur: number; holds: Hold[]};

export const HOLD_SPEED = 0.15;

export const SHOTS: ShotDef[] = [
  {name: '01 · Toda empresa quer crescer', dur: 66, holds: [{at: 44, len: 30}]},
  {name: '02 · Sem direção custa caro', dur: 98, holds: [{at: 25, len: 16}, {at: 54, len: 26}, {at: 84, len: 26}]},
  {name: '03 · Conheça a OpusSoftWorks', dur: 60, holds: [{at: 32, len: 30}]},
  {name: '04 · É direção', dur: 104, holds: [{at: 31, len: 26}, {at: 89, len: 32}]},
  {name: '05 · Três frentes', dur: 42, holds: [{at: 26, len: 24}]},
  {name: '06 · Tráfego', dur: 102, holds: [{at: 86, len: 30}]},
  {name: '07 · Sistemas', dur: 102, holds: [{at: 80, len: 30}]},
  {name: '08 · Sites', dur: 150, holds: [{at: 116, len: 28}]},
  {name: '09 · Tudo funciona junto', dur: 96, holds: [{at: 74, len: 30}]},
  {name: '10 · O método Opus', dur: 156, holds: [{at: 40, len: 22}, {at: 72, len: 22}, {at: 104, len: 22}, {at: 141, len: 26}]},
  {name: '11 · É entrega', dur: 114, holds: [{at: 28, len: 24}, {at: 86, len: 32}]},
  {name: '12 · Estratégia, aliada à execução', dur: 90, holds: [{at: 56, len: 30}]},
  {name: '13 · Marca', dur: 120, holds: [{at: 66, len: 26}]},
  {name: '14 · Site', dur: 66, holds: [{at: 44, len: 26}]},
  {name: '15 · Símbolo', dur: 84, holds: []},
];

/** Duração final (frames de vídeo) de um plano, contando as pausas. */
export const shotLength = (s: ShotDef) => s.dur + Math.round(s.holds.reduce((acc, h) => acc + h.len * (1 - HOLD_SPEED), 0));

/** Frame de vídeo → frame da animação do plano (desacelera dentro das pausas). */
export const remapFrame = (f: number, holds: Hold[]) => {
  let shift = 0;
  for (const h of holds) {
    const start = h.at + shift;
    if (f < start) break;
    if (f < start + h.len) return h.at + (f - start) * HOLD_SPEED;
    shift += h.len * (1 - HOLD_SPEED);
  }
  return f - shift;
};

export const PROMO_DURATION = SHOTS.reduce((acc, s) => acc + shotLength(s), 0);
