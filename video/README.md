# Vídeo promocional — Opus Softworks

Vídeo vertical (9:16, 1080×1920), 30s a 60fps, feito com [Remotion](https://www.remotion.dev/).
Usa a mesma paleta (onyx + cobalt), as fontes (Inter + Space Grotesk) e a copy do site.

## Roteiro

| Tempo | Cena | Conteúdo |
| --- | --- | --- |
| 0–4s | Hook | "Resultado não é sorte. É entrega." |
| 3,5–7,5s | Problema | Três fornecedores que não conversam → uma operação só |
| 7–11,5s | 01 Tráfego pago | Gráfico de desempenho + lead, CPL, ROAS |
| 11–15,5s | 02 Gestão | Painel com vendas, estoque, financeiro, contratos |
| 15–19,5s | 03 Sites | Site → clique no WhatsApp → "novo lead recebido" |
| 19–24,5s | Processo | Diagnóstico → Plano → Execução → Resultado |
| 24–30s | CTA | Wordmark, "Diagnóstico gratuito", opussoftworks.com.br |

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
- `src/components.tsx` — fundo animado, wordmark, cards e ícones
- `src/scenes/` — uma cena por arquivo

O vídeo não tem trilha sonora; adicione com `<Audio src={staticFile("trilha.mp3")} />`
em `OpusPromo.tsx` ou na edição final.
