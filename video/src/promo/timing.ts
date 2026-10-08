// Promo OPUS — ritmo de cortes rápidos (referência CENDAP). 1080×1920 · 30fps · 45s.
export const SHOTS = [
  ['01 · Toda empresa quer crescer', 66],
  ['02 · Sem direção custa caro', 60],
  ['03 · Conheça a OpusSoftWorks', 60],
  ['04 · É direção', 90],
  ['05 · Três frentes', 42],
  ['06 · Tráfego', 102],
  ['07 · Sistemas', 102],
  ['08 · Sites', 102],
  ['09 · Tudo funciona junto', 96],
  ['10 · O método Opus', 156],
  ['11 · É entrega', 114],
  ['12 · Estratégia, aliada à execução', 90],
  ['13 · Marca', 120],
  ['14 · Site', 66],
  ['15 · Símbolo', 84],
] as const;

export const PROMO_DURATION = SHOTS.reduce((s, [, d]) => s + d, 0); // 1350
