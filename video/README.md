# Filme de lançamento — OPUS SOFTWORKS

Motion design do storyboard oficial, construído em Remotion (React + SVG).
1080×1920 (9:16) · 30 fps · 45 s · 1350 frames.

Nenhuma imagem do storyboard é usada no vídeo: cada elemento de cada quadro
existe no código e tem animação própria.

## Como rodar

```bash
cd video
pnpm install
pnpm studio   # preview interativo com timeline
pnpm render   # gera out/opus-launch-film.mp4
```

## Estrutura

| Cena | Frames | Arquivo | Transição de saída |
| --- | --- | --- | --- |
| 01 O início | 0–135 | `scenes/Scene01.tsx` | o círculo maior se preenche e vira o fundo |
| 02 O problema | 120–270 | `scenes/Scene02.tsx` | os cards seguem para a cena 03 |
| 03 A virada | 270–390 | `scenes/Scene03.tsx` | a linha atravessa a tela e os cards viram nós; os três ramos viram os ícones |
| 04 As três frentes | 390–600 | `scenes/Scene04.tsx` | os cards recolhem para os ícones |
| 05 Tudo funciona junto | 600–780 | `scenes/Scene05.tsx` | a rede converge para um ponto central |
| 06 O método Opus | 780–960 | `scenes/Scene06.tsx` | a linha se expande e abre a tela branca |
| 07 A promessa | 960–1110 | `scenes/Scene07.tsx` | o sublinhado coral continua na cena 08 |
| 08 Revelação | 1110–1350 | `scenes/Scene08.tsx` | a linha desenha o símbolo e vira sua máscara; os 2 s finais ficam parados |

Componentes reutilizáveis em `src/components/`: `AnimatedText`, `MaskText`,
`ServiceCard`, `AnimatedLine`, `AnimatedCircle`, `ConnectedNode`,
`MethodTimeline`, `LogoReveal`, `InfinityShape`, `SceneTransition`
(além de `ThreadArc`, `ProblemCard`, `TextBlock` e `Frame` com câmera, fundo
e fio do topo).

Identidade em `src/brand.ts` (cores, fontes) e posições lidas do storyboard
em `src/lib/layout.ts`. As fontes Exo 2 e Rubik estão em `public/fonts/`
(Google Fonts, licença OFL).

## Logo oficial

O repositório não tem o arquivo do logo da OPUS, então o símbolo e o
wordmark foram reconstruídos a partir do storyboard. Para usar o arquivo
original, coloque-o em `public/brand/` e preencha `LOGO_ASSETS` em
`src/brand.ts`: o `LogoReveal` passa a usar o arquivo, com a mesma máscara.
