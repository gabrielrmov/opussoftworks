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
pnpm render:promo   # gera out/opus-promo.mp4
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

O símbolo usa o arquivo oficial `public/brand/opus-simbolo.png` (recortado com
fundo transparente a partir do PNG enviado), sem recolorir nem distorcer. A
linha central do infinito em `src/lib/infinity.ts` foi medida nesse arquivo,
então o traço coral que desenha o símbolo e a máscara de revelação
(`OpusSymbol`, `LogoReveal`) seguem exatamente a forma do logo. O wordmark
"OpusSoftWorks" continua tipografado em Exo 2 (não há arquivo do wordmark);
para usar um, preencha `LOGO_ASSETS.wordmark` em `src/brand.ts`.

## Promo (OpusPromo)

Segundo filme, no ritmo da referência enviada (promo da CENDAP): 15 planos curtos,
tipografia cinética letra a letra, painéis de cor, explosão de raios, cursor
clicando em elementos de interface, mockups de notebook/celular e assinatura
final. 1080×1920 · 30 fps · ~64 s. Código em `src/promo/` (kit em
`src/promo/kit/`, planos em `src/promo/shots/`, ordem e duração em
`src/promo/timing.ts`).

No plano "Sites", as telas do notebook e do celular rolam um print do site.
Para usar o site real, salve prints da página inteira (desktop ~1440 px de
largura e celular ~390 px) em `public/brand/site/` e preencha
`SITE_SCREENSHOTS` em `src/brand.ts`; sem prints, aparece uma página-modelo.

Cada plano tem pausas de leitura (`holds` em `timing.ts`): quando um texto
termina de entrar, o tempo do plano desacelera para 15% por alguns frames, para
que dê tempo de ler. Para dar mais ou menos tempo a um texto, ajuste o `len`
da pausa correspondente.

Os textos vêm do storyboard: "Toda empresa quer crescer.", "Mas crescer sem
direção custa caro.", "O que falta não é fazer mais. É direção.", as três frentes
(Tráfego/Aquisição, Sistemas/Automação, Sites/Presença), "Tudo funciona junto.",
as quatro etapas do método, "Resultado não é sorte. É entrega.", o slogan e o site.
