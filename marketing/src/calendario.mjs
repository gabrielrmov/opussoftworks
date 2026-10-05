// Gera ../CALENDARIO.md a partir de posts.mjs.
import { writeFileSync } from 'node:fs';
import { posts } from './posts.mjs';
const br = d => d.split('-').reverse().slice(0,2).join('/');
const plain = p => `${p.lead} — ${p.title}`.replace(/<br>/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();
const obj = { chess:'xadrez', button:'botão "Quero comprar" + cursor', puzzle:'quebra-cabeça', dice:'dados + caixa', coins:'pilhas de moedas', steps:'escada 01–04', stopwatch:'cronômetro', frozen:'balão congelado no gelo', calendar:'calendário', gears:'engrenagens', diamond:'diamante no pedestal', infinity:'infinito 3D' };
let md = `# Calendário de postagens — Opus SoftWorks (12/10 a 06/11/2026)

Feed do Instagram, 3 posts por semana (seg/qua/sex, às 12h), formato 4:5 (1080x1350).
Linha visual puxada da referência: logo no topo, frase de abertura + título com palavra em itálico serifado
e palavra-chave num bloco de destaque, objeto 3D em estúdio (luz de spot, sombra, profundidade de campo) como herói da peça, adesivos em estrela, bilhete de papel em 4 posts e "Leia a legenda".
Identidade Opus SoftWorks (opussoftworks.com.br): coral \`#ff6039\`, preto \`#171717\`, claro \`#fafafa\`,
Inter Tight + Instrument Serif itálico, símbolo do infinito. Alterna fundo escuro e claro pra formar o xadrez no grid.

| # | Data | Pilar | Objeto | Texto da peça | Peça |
|---|------|-------|--------|---------------|------|
${posts.map(p=>`| ${p.n} | ${p.dow} ${br(p.date)} | ${p.pilar} | ${obj[p.scene]} | ${plain(p)} | [post-${String(p.n).padStart(2,'0')}.png](posts/post-${String(p.n).padStart(2,'0')}.png) |`).join('\n')}

**Mix de pilares:** tráfego pago (2), sites (2), sistemas (2), autoridade e método (4), diagnóstico e conversão (2).

## Legendas

${posts.map(p=>`### ${p.n}. ${p.dow} ${br(p.date)} — ${plain(p)}

![post ${p.n}](posts/post-${String(p.n).padStart(2,'0')}.png)

${p.legenda.replace(/\n/g,'  \n')}

${p.hashtags}
`).join('\n')}
## Como editar

Textos ficam em \`src/posts.mjs\` e os objetos 3D em \`src/scenes.js\`. Depois de editar:

\`\`\`bash
npm i --no-save playwright-core three@0.169   # uma vez
node src/render.mjs [n...]                    # regera posts/*.png (todas ou só as indicadas)
node src/calendario.mjs           # regera este arquivo
\`\`\`
`;
writeFileSync(new URL('../CALENDARIO.md', import.meta.url), md);
