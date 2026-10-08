# Vídeos — Opus SoftWorks

Vídeos verticais (9:16, 1080×1920) feitos com [Remotion](https://www.remotion.dev/),
na linguagem do site publicado (opussoftworks.com.br): fundo off-white
pontilhado, tipografia sans forte em preto, coral `#ff6039` como única ênfase.

| Composição | Duração | FPS | O que é |
| --- | --- | --- | --- |
| `OpusLaunch` | 30s (900 frames) | 30 | Lançamento: câmera seguindo a linha coral, com trilha e efeitos |
| `OpusPromo` | 30s (1800 frames) | 60 | Promo que percorre as seções do site, sem áudio |

## OpusLaunch — "a linha coral"

Não há cortes: uma câmera virtual (`src/launch/Camera.tsx`) anda, dá zoom e
faz pan por um canvas grande, seguindo uma única linha coral
(`CoralLine.tsx`). O motion blur (`@remotion/motion-blur`) só liga nos frames
em que a câmera se move (obturador de 90°, 45° nos zooms).

| Frames | Bloco | O que acontece |
| --- | --- | --- |
| 0–60 | `Hook` | "Resultado" entra em 1.15→1; a linha sobe pela direita e risca "sorte.", que sai em glitch |
| 60–120 | `Hook` | o risco vira o topo do retângulo de "É entrega." (24 px de respiro) e a linha sai pela direita |
| 120–270 | `Pillars` | anúncio da Opus → clique → contatos chegando; painel com Vendas, Estoque, Financeiro e Contratos; celular com "Sua empresa vendendo 24h" e "Pedir orçamento" |
| 270–345 | `System` | zoom out: os mockups viram três ícones grandes ligados pela linha |
| 345–495 | `Method` | a linha desce durante o movimento e vira a timeline; uma etapa acende por beat |
| 495–660 | `Outcome` | "Venda mais. / Opere melhor. / Cresça com clareza." e a curva de crescimento, sem números |
| 660–720 | `Logo` | rolagem até o CTA; a linha escreve o wordmark (78% da largura), impacto no frame 690 |
| 720–780 | `CTA` | o wordmark sobe pro topo; a linha sai dele e fecha o contorno do botão |
| 780–900 | `CTA` | parado, só o pulso do botão |

**Tudo que é tempo está em `src/launch/timeline.ts`**: beats das entradas,
keyframes da câmera (movimentos de no máximo 15 frames, com o conteúdo
seguinte entrando durante o movimento), quanto da linha está desenhado em
cada frame e os efeitos sonoros. A geometria está em `layout.ts`.

Regras de layout:

- o foco da câmera é o centro horizontal do quadro e o centro vertical da
  safe zone (220 px livres no topo, 380 embaixo);
- cada bloco é centrado pelo bounding box do próprio conteúdo, com no máximo
  860 px de largura. Com a "respiração" da câmera (+3%), sobram 96 px ou mais
  de cada lado;
- texto de 32 px ou mais na tela (mockups incluídos);
- o wordmark é um elemento só (`Wordmark.tsx`), igual ao do site.

### Fonte

Inter Tight via `@remotion/google-fonts` (`font.ts`), identificada comparando
o hero e o wordmark do site publicado. O render baixa a fonte do Google Fonts,
então precisa de acesso a `fonts.gstatic.com`.

### Áudio

- `public/music.mp3`: trilha procedural a 120 BPM, gerada por
  `scripts/make-audio.py`. A curva de energia é: punch (0–4 s), groove (4–17 s),
  build com riser, filtro abrindo e rufo (17–23 s), drop no 23 s junto com o
  logo, parte limpa (25–30 s) e um hit final no 29 s. A música sozinha fica
  em -14 LUFS. **É um placeholder**: para usar uma trilha licenciada, troque o
  arquivo mantendo o nome.
- `public/sfx/`: `tick` (palavras e etapas), `whoosh` (movimentos de câmera),
  `click`, `glitch` e `impact` ("Resultado", "É entrega." e o logo). Os
  momentos ficam em `SFX`, no `timeline.ts`.
- A mixagem acontece em `OpusLaunch.tsx`: ducking da música em cada efeito.
  A saída fica com pico real abaixo de -1 dBFS.

Para regenerar: `npm run audio` (Python 3 com numpy e ffmpeg).

### QA

`npm run qa` extrai um frame a cada 0,5 s do MP4 renderizado e gera:

- `out/qa/contact-sheet.png`, uma grade 10×6;
- `out/qa/report.txt`, com conteúdo a menos de 64 px das bordas e a
  ocupação de cada frame (alerta abaixo de 25%).

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
- `scripts/make-audio.py` — trilha e efeitos
- `scripts/contact-sheet.sh` — stills avulsos e contact sheet
- `scripts/qa.py` — QA do MP4 (contact sheet 10×6 e checagens)
