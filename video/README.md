# Vídeos — Opus SoftWorks

Vídeos verticais (9:16, 1080×1920) feitos com [Remotion](https://www.remotion.dev/),
na linguagem do site publicado (opussoftworks.com.br): fundo off-white
pontilhado, tipografia sans forte em preto, coral `#ff6039` como única ênfase.

| Composição | Duração | FPS | O que é |
| --- | --- | --- | --- |
| `OpusLaunch` | 30s (900 frames) | 30 | Lançamento: site real + tipografia, cortes secos no beat |
| `OpusPromo` | 30s (1800 frames) | 60 | Promo que percorre as seções do site, sem áudio |

## OpusLaunch

Direção "anti-IA": material real do site, copy do site, cortes secos no beat e
acabamento de filmado. Tudo que é tempo está em **`src/timeline.ts`** (120 BPM,
1 beat = 15 frames; o módulo valida que todo corte cai em múltiplo de 15).

| Frames | Cena | Fundo |
| --- | --- | --- |
| 0–60 | "Resultado / não é / sorte." — uma palavra por beat; "sorte." apaga e é riscada à mão | off-white |
| 60–120 | "É / entrega." com slam e deriva de zoom | coral |
| 120–315 | o site real num celular, rolando hero → "Três frentes" → card 01; círculo de caneta em "Venda é." e push-in até 3.4× | off-white + pontos |
| 315–420 | "Lead não é / *resultado.*" + "Venda é." | azul-marinho |
| 420–570 | método: 4 cortes (45/30/45/30 frames) com numeral vazado, nome e subtítulo do site | off-white / preto / off-white / coral |
| 570–645 | "Sua empresa / não precisa / de mais uma / ferramenta." — "ferramenta." riscada | off-white |
| 645–735 | "Precisa de um / sistema que / *funcione.*" | coral |
| 735–900 | assinatura: wordmark, "Estratégia, aliada à execução.", botão e URL | off-white + pontos |

- **Site real:** `public/site/opus-390.png` é um screenshot full page feito
  pelo Playwright (390×844, deviceScaleFactor 3, página rolada inteira antes),
  com `npm run capture`. `opus-390.json` guarda as posições reais
  (getBoundingClientRect) usadas no círculo e no push-in. O header e o botão
  do WhatsApp são fixos no site: são capturados à parte e sobrepostos fixos na
  tela do celular. Pra capturar de outro endereço: `SITE_URL=... npm run capture`.
- **Copy:** toda tirada do site (`lib/landing-content.ts`,
  `components/landing/process.tsx` e `final-cta.tsx`).
- **Tipografia:** Inter Tight 500/700/800, Instrument Serif (normal e itálica)
  e JetBrains Mono, locais via `@fontsource` (`public/fonts`).
- **Larguras:** `scripts/measure-text.py` mede cada frase com as fontes e grava
  `src/launch/metrics.json`, que posiciona os riscos e sublinhados de caneta.
  Isso também prova que nada passa da margem de 84 px.
- **Acabamento:** grão `feTurbulence` com seed por frame (opacidade 0,09,
  multiply), câmera na mão (soma de senos) e vinheta leve (`src/launch/fx.tsx`).
  Traços de caneta: `src/launch/pen.tsx`.

### Áudio

Slot pronto, sem música gerada: coloque a trilha em `public/music.mp3`.
`HAS_MUSIC` detecta o arquivo sozinho (`getStaticFiles`). Se o primeiro beat
não estiver no início do arquivo, ajuste `MUSIC_FIRST_BEAT_MS` em
`src/timeline.ts`: o áudio é cortado ali para esse beat cair no frame 0.

### QA

`npm run qa` renderiza um still a cada 0,5 s (`scripts/qa-stills.mjs`) e gera
`out/qa/contact-sheet.png` (10×6) e `out/qa/report.txt` com:

- (a) os extremos do texto contra a margem de 84 px;
- (b) o desvio do círculo de caneta em relação ao centro de "Venda é."
  (`out/qa/circle-check.png`);
- (d) os cortes em múltiplos de 15.

## Como usar

```bash
npm install
npm run studio   # preview/edição no navegador
npm run capture  # screenshot do site real (Playwright) → public/site/
npm run qa       # stills a cada 0,5 s + out/qa/contact-sheet.png + report.txt
npm run render   # out/opus-launch.mp4 (H.264, CRF 18, yuv420p bt709)
npm run render:promo
```

Se o Remotion não conseguir baixar o Chromium (rede restrita), aponte pra um já
instalado: `REMOTION_BROWSER_EXECUTABLE=/caminho/do/chrome npm run render`.

## Estrutura

- `src/timeline.ts` — todos os tempos do OpusLaunch
- `src/launch/` — composição de lançamento (`OpusLaunch.tsx`, cenas em `scenes/`, caneta, acabamento)
- `src/scenes/` + `src/OpusPromo.tsx` — composição promo
- `src/theme.ts` — cores amostradas do site
- `scripts/capture-site.mjs` — captura do site com Playwright
- `scripts/measure-text.py` — larguras das frases → `src/launch/metrics.json`
- `scripts/qa-stills.mjs` + `scripts/qa.py` — QA (stills, contact sheet 10×6, checagens)
