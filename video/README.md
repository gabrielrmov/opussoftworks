# Vídeos — Opus SoftWorks

Vídeos verticais (9:16, 1080×1920) feitos com [Remotion](https://www.remotion.dev/),
na linguagem do site publicado (opussoftworks.com.br): fundo off-white
pontilhado, tipografia sans forte em preto, coral `#ff6039` como única ênfase.

| Composição | Duração | FPS | O que é |
| --- | --- | --- | --- |
| `OpusLaunch` | 30s (900 frames) | 30 | Lançamento: câmera seguindo a linha coral pelo conteúdo real do site |
| `OpusPromo` | 30s (1800 frames) | 60 | Promo que percorre as seções do site, sem áudio |

## OpusLaunch — "a linha coral" (v3.1)

Uma câmera virtual (`src/launch/Camera.tsx`) percorre um canvas grande
seguindo uma única linha coral (`CoralLine.tsx`). Nesta versão o foco foi
tirar a "cara de IA":

- **conteúdo real do site**: os cards de "Onde a Opus SoftWorks entra" e o
  cabeçalho da seção são recortes da página renderizada (Playwright), não
  mockups; todo o texto é a copy do site;
- **traço à mão**: a linha é reamostrada com ruído (`@remotion/noise`) e as
  marcações (círculo, sublinhado, risco) são traços de caneta animados com
  `evolvePath` (`@remotion/paths`) e um filtro de deslocamento que muda a
  cada 4 frames. Sem brilho, sem ponto na ponta, sem pulsos;
- **entradas secas** (6–8 frames, sem blur) e slam só nas frases de impacto;
- **câmera na mão** (ruído contínuo, ~3 px / 0,12°), grão e vinheta leves
  (`fx.tsx`) no lugar da "respiração";
- **fontes do site**, locais: Inter Tight, Instrument Serif e JetBrains Mono
  (`@remotion/fonts`, `public/fonts`). Os tamanhos são calculados com
  `fitText`/`measureText` (`@remotion/layout-utils`) depois de as fontes
  carregarem;
- motion blur (`@remotion/motion-blur`) só quando a câmera anda.

| Frames | Bloco | O que acontece |
| --- | --- | --- |
| 0–120 | `Hook` | "Resultado não é sorte." palavra por beat; a linha risca "sorte." e fecha o retângulo de "É entrega." |
| 120–255 | `Pillars` | as três frentes: título (copy do site) + o card real; a caneta marca o trecho em negrito ("Venda é.") |
| 255–330 | `Section` | o cabeçalho real "Três frentes, uma mesma estratégia."; a caneta sublinha "estratégia." |
| 330–480 | `Method` | a linha vira a timeline das quatro etapas, com o título e a frase de cada uma |
| 480–570 | `Tool` | "Sua empresa não precisa de mais uma ferramenta." — a caneta risca "ferramenta." |
| 570–645 | `Tool` | "Precisa de um sistema que *funcione.*" (serif coral, slam, sublinhado) |
| 645–720 | `Logo` | a linha escreve o wordmark; impacto no 690; ele sobe pro topo |
| 720–780 | `CTA` | "Estratégia, aliada à execução." e a linha contorna o botão; no clique ele vira a pílula preta do site |
| 780–900 | `CTA` | parado |

**Tudo que é tempo está em `src/launch/timeline.ts`** (beats a 120 BPM, keyframes
da câmera, quanto da linha está desenhado por frame, efeitos sonoros). A
geometria está em `layout.ts`; estilos de texto e medição em `type.ts`.

Regras de layout: foco da câmera no centro da safe zone (220 px livres no
topo, 380 embaixo); blocos com no máximo 860 px de largura; texto de 32 px ou
mais na tela (os cards reais ficam com o corpo em ~38 px).

### Conteúdo do site

`npm run capture` abre o site (`https://opussoftworks.com.br/`, ou outra URL
em `SITE_URL`) em 390×844 @3x com Playwright e salva `public/site/opus-390.png` +
`opus-390.json` (retângulos dos cards, dos trechos em negrito e do cabeçalho).
`npm run crop` gera os recortes usados no vídeo (`card-1..3.png`,
`section.png`). Precisa de um Chrome: `CHROME_PATH=/caminho/do/chrome`.

### Áudio

- **Trilha: slot.** Coloque uma música licenciada em `public/music.mp3`; o
  vídeo detecta o arquivo (`getStaticFiles`) e toca com ducking nos efeitos.
  Ajuste `MUSIC_FIRST_BEAT_MS` em `timeline.ts` pra o primeiro beat cair no
  frame 0. Sem o arquivo, sai só com os efeitos. Não há música sintética.
- `public/sfx/`: `tick` (palavras, etapas, caneta), `whoosh` (movimentos),
  `click` (botão) e `impact` ("Resultado", "É entrega.", logo). Regenerar:
  `npm run sfx` (Python 3 com numpy).

### QA

`npm run qa` extrai um frame a cada 0,5 s do MP4 renderizado e gera
`out/qa/contact-sheet.png` (grade 10×6) e `out/qa/report.txt` (conteúdo a
menos de 64 px das bordas e ocupação de cada frame).

## Como usar

```bash
npm install
npm run studio   # preview/edição no navegador
npm run stills   # stills avulsos + out/contact-sheet.png
npm run qa       # QA do MP4: out/qa/contact-sheet.png + report.txt
npm run render   # out/opus-launch.mp4 (H.264, CRF 18, yuv420p bt709)
npm run render:promo
```

`npm run stills` aceita frames: `npm run stills -- 0 90 720`.

Se o Remotion não conseguir baixar o Chromium (rede restrita), aponte pra um já
instalado: `REMOTION_BROWSER_EXECUTABLE=/caminho/do/chrome npm run render`.

## Estrutura

- `src/launch/` — composição de lançamento (`OpusLaunch.tsx`, `timeline.ts`,
  `layout.ts`, câmera, linha e um componente por bloco)
- `src/scenes/` + `src/OpusPromo.tsx` — composição promo
- `src/theme.ts` — cores amostradas do site
- `scripts/capture-site.mjs` + `scripts/crop-site.py` — captura e recortes do site
- `scripts/make-sfx.py` — efeitos sonoros
- `scripts/contact-sheet.sh` — stills avulsos e contact sheet
- `scripts/qa.py` — QA do MP4 (contact sheet 10×6 e checagens)
