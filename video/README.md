# Vídeos — Opus SoftWorks

Vídeos verticais (9:16, 1080×1920) feitos com [Remotion](https://www.remotion.dev/),
na linguagem do site publicado (opussoftworks.com.br): fundo off-white
pontilhado, tipografia sans forte em preto, laranja `#ff6039` como única ênfase.

| Composição | Duração | FPS | O que é |
| --- | --- | --- | --- |
| `OpusLaunch` | 30s (900 frames) | 30 | Vídeo de lançamento, com trilha |
| `OpusPromo` | 30s (1800 frames) | 60 | Promo que percorre as seções do site, sem áudio |

## OpusLaunch — roteiro

| Tempo | Cena (`src/launch/`) | Texto na tela |
| --- | --- | --- |
| 0–3s | `Intro` | OPUS SOFTWORKS (máscara + linha de medida) |
| 3–7s | `Statement` | Resultado não é ~~sorte~~ (perde foco). **É entrega.** |
| 7–13s | `Pillars` | Tráfego. Sistemas. Sites. — blocos ligados por linhas com dados |
| 13–18s | `Pillars` | Três frentes. Uma estratégia. — os blocos se alinham numa estrutura |
| 18–24s | `Method` | Diagnóstico → Estratégia → Implementação → Otimização (ritmo crescente) |
| 24–28s | `Outcome` | Venda mais. Opere melhor. Cresça com clareza. |
| 28–30s | `CTA` | Vamos elevar o próximo passo? / Falar com um especialista ↗ |

As transições (`src/launch/lineMask.tsx`) são uma máscara que sobe atrás de
uma linha laranja enquanto a cena anterior perde o foco. Cada transição dura
12 frames e fica centrada na virada de cena, então os cortes caem exatamente
em 3s, 7s, 18s, 24s e 28s.

### Trilha

`public/audio/trilha.mp3` é gerada por `scripts/make-music.py` (numpy):
eletrônica minimalista a 120 BPM. Uma batida dura 0,5s, ou seja, 15 frames,
então os acentos coincidem com as cenas:
o impacto de 5s cai no "É entrega.", o arpejo entra com as linhas dos
pilares, os hi-hats aceleram no Método e um riser leva ao Outcome. Para
mexer na trilha, edite o script e rode `npm run music` (precisa de Python 3
com numpy e de ffmpeg).

### Locução

Grave a locução em `public/audio/locucao.mp3` (30s, começando no 0:00) e
renderize com `npm run render:locucao`. A trilha cai para 35% automaticamente.
Marcação sugerida:

| Tempo | Fala |
| --- | --- |
| 0:03–0:07 | Resultado não é sorte. É entrega. ("É entrega" no impacto de 0:05) |
| 0:07–0:12 | A Opus conecta tráfego, sistemas e sites |
| 0:12–0:18 | para transformar atenção em vendas, operações em controle e decisões em crescimento. |
| 0:18–0:24 | Primeiro, clareza. Depois, estratégia. E então, execução que continua melhorando. |
| 0:24–0:28 | Porque sua empresa não precisa de mais uma ferramenta. Precisa de um sistema que funcione. |
| 0:28–0:30 | Opus SoftWorks. |

O texto tem cerca de 70 palavras, o que dá umas 26s em ritmo natural, então
fica justo. Entre 24s e 28s são 16 palavras em 4s; se soar corrido, encurte
para "Sua empresa não precisa de mais uma ferramenta. Precisa de um sistema."

## Como usar

```bash
npm install
npm run studio          # preview/edição no navegador
npm run render          # out/opus-launch.mp4
npm run render:locucao  # out/opus-launch-locucao.mp4 (com public/audio/locucao.mp3)
npm run render:promo    # out/opus-promo.mp4
```

Se o Remotion não conseguir baixar o Chromium (rede restrita), aponte pra um já
instalado: `REMOTION_BROWSER_EXECUTABLE=/caminho/do/chrome npm run render`.

Para publicar em Instagram/TikTok, converta para faixa de cor padrão (TV):

```bash
ffmpeg -i out/opus-launch.mp4 -vf scale=in_range=pc:out_range=tv -pix_fmt yuv420p \
  -c:v libx264 -crf 17 -c:a aac -b:a 192k -movflags +faststart out/opus-launch-final.mp4
```

## Estrutura

- `src/launch/` — composição de lançamento (cenas, transição, `OpusLaunch.tsx`)
- `src/scenes/` + `src/OpusPromo.tsx` — composição promo
- `src/theme.ts` — cores amostradas do site, fontes e helper `s()`
- `src/components.tsx` — fundo pontilhado, wordmark, pílula de navegação
- `scripts/make-music.py` — gerador da trilha
