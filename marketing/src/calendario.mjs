// Gera ../CALENDARIO.md a partir de posts.mjs.
import { writeFileSync } from 'node:fs';
import { posts } from './posts.mjs';
const br = d => d.split('-').reverse().slice(0,2).join('/');
const plain = p => `${p.before} ${p.hl} ${p.after}`.replace(/\s+/g,' ').trim();
let md = `# Calendário de postagens — ELEVION (12/10 a 06/11/2026)

Feed do Instagram, 3 posts por semana (seg/qua/sex, às 12h), formato 4:5 (1080x1350).
Linha visual inspirada na referência (gancho curto + palavra-chave destacada + objeto central + "Leia a legenda"),
traduzida pra identidade ELEVION: onyx \`#171721\`, ivory \`#ededf3\`, cobalto \`#5266eb\`, Space Grotesk + Inter.
Alterna fundo escuro e claro pra formar o xadrez no grid.

| # | Data | Pilar | Formato | Gancho | Peça |
|---|------|-------|---------|--------|------|
${posts.map(p=>`| ${p.n} | ${p.dow} ${br(p.date)} | ${p.pilar} | ${p.formato} | ${plain(p)} | [post-${String(p.n).padStart(2,'0')}.png](posts/post-${String(p.n).padStart(2,'0')}.png) |`).join('\n')}

**Mix de pilares:** tráfego pago (2), sites (2), gestão (2), autoridade/processo/princípios (4), diagnóstico e conversão (2).

## Legendas

${posts.map(p=>`### ${p.n}. ${p.dow} ${br(p.date)} — ${plain(p)}

![post ${p.n}](posts/post-${String(p.n).padStart(2,'0')}.png)

${p.legenda.replace(/\n/g,'  \n')}

${p.hashtags}
`).join('\n')}
## Como editar

Texto e ilustrações ficam em \`src/posts.mjs\`. Depois de editar:

\`\`\`bash
npm i --no-save playwright-core   # uma vez
node src/render.mjs               # regera posts/*.png
node src/calendario.mjs           # regera este arquivo
\`\`\`
`;
writeFileSync(new URL('../CALENDARIO.md', import.meta.url), md);
