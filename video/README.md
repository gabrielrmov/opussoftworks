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
(`CoralLine.tsx`) que nunca some. O motion blur (`@remotion/motion-blur`) só
liga nos frames em que a câmera está se movendo.

| Frames | Bloco | O que a linha faz |
| --- | --- | --- |
| 0–60 | `Hook` | sobe pela direita desde o frame 0 e risca "sorte." |
| 60–120 | `Hook` | vira o sublinhado de "É entrega." e sai do quadro |
| 120–270 | `Pillars` | passa pelos 3 pilares (anúncio + leads, painel, celular) |
| 270–360 | `System` | câmera abre: os três ligados, dados correndo pela linha |
| 360–510 | `Method` | fica vertical e vira a timeline das 4 etapas |
| 510–660 | `Outcome` | vira a curva de crescimento (sem números) |
| 660–780 | `Logo` | câmera recua mostrando o caminho inteiro; a linha fecha a pílula do wordmark |
| 780–900 | `CTA` | a pílula vira o contorno do botão; 4s parado, só o pulso |

**Tudo que é tempo está em `src/launch/timeline.ts`**: beats das entradas,
keyframes da câmera, quanto da linha está desenhado em cada frame e os efeitos
sonoros. A geometria do canvas fica em `layout.ts`. A regra é 120 BPM →
1 beat = 15 frames; use `beat(n)` para manter tudo no tempo da música.

Layout: o foco da câmera é o centro da safe zone (220 px livres no topo, 380
embaixo, 140 na direita), todo texto tem 44 px ou mais na tela e o wordmark é
um componente só (`Wordmark.tsx`), igual ao do site.

### Fonte

Inter Tight via `@remotion/google-fonts` (`font.ts`), identificada comparando
o hero e o wordmark do site publicado. O render baixa a fonte do Google Fonts,
então precisa de acesso a `fonts.gstatic.com`.

### Áudio

- `public/music.mp3`: trilha eletrônica minimalista a 120 BPM, gerada por
  `scripts/make-audio.py`. Entra forte no frame 0, pausa durante o zoom out
  (22–23,5 s) e volta no impacto do logo (frame 705). Normalizada em
  -14 LUFS. **É um placeholder procedural**: para usar uma trilha licenciada,
  basta substituir o arquivo (mesmo nome, 30 s, 120 BPM).
- `public/sfx/`: `whoosh` (viradas de câmera), `tick` (palavras e etapas),
  `click` (clique e toque nos pilares), `glitch` ("sorte.") e `impact`
  ("Resultado", "É entrega." e o logo). Os momentos estão em `SFX`, em
  `timeline.ts`.

Para regenerar: `npm run audio` (Python 3 com numpy e ffmpeg).

## Como usar

```bash
npm install
npm run studio   # preview/edição no navegador
npm run stills   # stills de revisão + out/contact-sheet.png
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
- `scripts/contact-sheet.sh` — stills de revisão e contact sheet
