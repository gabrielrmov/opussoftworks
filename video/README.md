# Vídeos — Opus SoftWorks

Vídeos verticais (9:16, 1080×1920) feitos com [Remotion](https://www.remotion.dev/),
na linguagem do site publicado (opussoftworks.com.br): fundo off-white
pontilhado, tipografia sans forte em preto, coral `#ff6039` como única ênfase.

| Composição | Duração | FPS | O que é |
| --- | --- | --- | --- |
| `OpusLaunch` | 30s (900 frames) | 30 | Lançamento: câmera seguindo a linha coral, só com efeitos (trilha opcional) |
| `OpusPromo` | 30s (1800 frames) | 60 | Promo que percorre as seções do site, sem áudio |

## OpusLaunch — "a linha coral" (v3.2)

Uma câmera virtual (`src/launch/Camera.tsx`) percorre um canvas grande
seguindo uma única linha coral (`CoralLine.tsx`). A v3.2 mantém o roteiro e
o conteúdo da v3 e refaz a execução com uma linguagem de motion design
consistente:

- **três curvas, sempre do mesmo jeito** (`motion.ts`): expo-out pra tudo que
  entra, expo-in pra tudo que sai, in-out pro que viaja (câmera, linha,
  wordmark). Sem spring com overshoot, sem blur de entrada, sem pulso;
- **texto sobe de trás de uma máscara** (`reveal.tsx`), linha a linha, e sai
  do mesmo jeito antes de a câmera partir — nos movimentos só a linha
  atravessa a tela;
- **grid único**: tudo alinhado à esquerda na coluna de 860 px (x = 110);
  só o fechamento é centrado;
- **câmera**: movimentos de 18 frames em in-out, motion blur com obturador
  de 180° e 12 amostras (rastro contínuo, sem cópias), e um push-in de 1–3%
  nas pausas no lugar da "respiração";
- **linha limpa**: sem ponto brilhante na ponta, sem nós pulsando, sem
  "dados" correndo; a espessura compensa o zoom na visão geral;
- **mockups** com borda fina e sombra em camadas; microinterações sem
  ripple (cursor com in-out, checks que se desenham, barras que crescem);
- a visão geral mostra **os próprios três mockups** lado a lado (sem ícones);
- o wordmark **nasce de trás da linha**, que vira a linha de base dele, e o
  contorno do botão é desenhado a partir do topo, as duas metades juntas.

| Frames | Bloco | O que acontece |
| --- | --- | --- |
| 0–96 | `Hook` | "Resultado / não é / sorte."; a linha risca "sorte." e fecha a caixa de "É entrega." |
| 114–280 | `Pillars` | Tráfego (anúncio → clique → contatos), Sistemas (painel se organizando), Sites (celular → pedido) |
| 280–340 | `System` | a câmera abre nos três mockups ligados pela linha: "Três frentes. Uma estratégia." |
| 358–462 | `Method` | a linha desce como timeline: Diagnóstico, Estratégia, Implementação, Otimização |
| 480–630 | `Outcome` | "Venda mais. Opere melhor. Cresça com clareza." e a curva de crescimento |
| 648–716 | `Logo` | a curva assenta num patamar; o wordmark sobe de trás dela e vai pro topo |
| 704–760 | `CTA` | "Vamos elevar o próximo passo?"; a linha desenha o botão, que preenche |
| 760–900 | `CTA` | parado (só o push-in da câmera) |

**Tudo que é tempo está em `src/launch/timeline.ts`** (entradas, saídas,
keyframes da câmera, quanto da linha está desenhado por frame, efeitos). A
geometria está em `layout.ts`; estilos de texto e medição (`fitText`) em `type.ts`.

### Fonte

Inter Tight (500–800), local em `public/fonts` via `@remotion/fonts`. O vídeo
espera as fontes carregarem antes de medir e renderizar.

### Áudio

- **Trilha: slot.** Coloque uma música licenciada em `public/music.mp3`; o
  vídeo detecta o arquivo e toca com ducking nos efeitos. Ajuste
  `MUSIC_FIRST_BEAT_MS` em `timeline.ts`. Sem o arquivo, sai só com os efeitos.
- `public/sfx/`: poucos efeitos, cada um com motivo — `impact` ("É entrega.",
  logo), `whoosh` (movimentos), `click` (clique, toque, botão) e `tick`
  (risco, etapas). Regenerar: `npm run sfx`.

### QA

`npm run qa` extrai um frame a cada 0,5 s do MP4 e gera
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
- `scripts/make-sfx.py` — efeitos sonoros
- `scripts/contact-sheet.sh` — stills avulsos e contact sheet
- `scripts/qa.py` — QA do MP4 (contact sheet 10×6 e checagens)
