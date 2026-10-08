# Vídeo promocional — Opus Softworks

Vídeo vertical (9:16, 1080×1920), 30s a 60fps, feito com [Remotion](https://www.remotion.dev/).
Segue a identidade do site publicado (opussoftworks.com.br): fundo claro
pontilhado, laranja `#ff6039`, wordmark OpusSoftWorks, seção navy com brilho
laranja e rodapé escuro. Fontes Inter + Instrument Serif, e a copy é a do site.

## Roteiro

| Tempo | Cena | Conteúdo |
| --- | --- | --- |
| 0–4s | Hero | "Resultado não é sorte. É entrega." + CTAs |
| 3,4–7,9s | Frentes | Foco alternando Tráfego → Sistemas → Sites |
| 7,3–15,3s | Soluções | Os três cards (01, 02, 03) empilhando |
| 14,7–19,7s | Processo | "Clareza antes de velocidade." com fundo ASCII |
| 19,1–24,6s | Método | Zoom em OPUS SOFTWORKS → "Um método, resultado visível." |
| 24–30s | Fechamento | "Vamos elevar o próximo passo?" + opussoftworks.com.br |

## Como usar

```bash
npm install
npm run studio   # preview/edição no navegador
npm run render   # gera out/opus-promo.mp4
```

Se o Remotion não conseguir baixar o Chromium (rede restrita), aponte pra um já
instalado: `REMOTION_BROWSER_EXECUTABLE=/caminho/do/chrome npm run render`.

## Estrutura

- `src/OpusPromo.tsx` — timeline das cenas e transições (duração total calculada)
- `src/theme.ts` — cores, fontes e helper `s()` (segundos → frames)
- `src/components.tsx` — fundo pontilhado, wordmark, pílula de navegação
- `src/scenes/` — uma cena por arquivo

O vídeo não tem trilha sonora; adicione com `<Audio src={staticFile("trilha.mp3")} />`
em `OpusPromo.tsx` ou na edição final.
