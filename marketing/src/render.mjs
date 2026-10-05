// Gera os PNGs 1080x1350 em ../posts a partir de posts.mjs + scenes.js.
// Uso (na pasta marketing/): npm i --no-save playwright-core three@0.169 && node src/render.mjs [n...]
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { posts } from './posts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const three = existsSync(join(root, 'node_modules/three')) ? '/node_modules/three' : '/src/node_modules/three';

// Grid: 1080x1350, margem 72. Topo: marca + numeração. Título centralizado.
// Objeto 3D em tela cheia (estúdio). Rodapé: texto curto à esquerda, pílula à direita.
const themes = {
  dark:  { fg:'#f4f3f0', mut:'rgba(244,243,240,.62)', logo:'opus-logo-white.png', vig:'rgba(0,0,0,.55)' },
  light: { fg:'#141414', mut:'rgba(20,20,20,.6)', logo:'opus-logo-black.png', vig:'rgba(60,50,40,.16)' },
};

const html = (p) => {
  const t = themes[p.theme], num = String(p.n).padStart(2, '0');
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/fonts.css">
<script type="importmap">{"imports":{"three":"${three}/build/three.module.js","three/addons/":"${three}/examples/jsm/"}}</script>
<style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;color:${t.fg};font-family:'Inter Tight',sans-serif;position:relative;overflow:hidden;background:${p.theme === 'dark' ? '#121212' : '#efeeeb'}}
canvas{position:absolute;inset:0;width:1080px;height:1350px}
.scrim{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(to top, ${p.theme === 'dark' ? 'rgba(14,14,14,.92)' : 'rgba(239,238,235,.94)'} 25%, transparent)}
.vig{position:absolute;inset:0;background:radial-gradient(120% 90% at 50% 62%, transparent 55%, ${t.vig} 100%)}
.grain{position:absolute;inset:0;opacity:${p.theme === 'dark' ? .09 : .07};mix-blend-mode:${p.theme === 'dark' ? 'screen' : 'multiply'}}
.top{position:absolute;top:64px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:center;font-size:17px;font-weight:500;letter-spacing:.14em;text-transform:uppercase}
.brand{display:flex;align-items:center;gap:2px}.brand .ic{height:54px;margin:-10px -4px -10px -10px}.brand .wm{height:24px}
.top .meta{color:${t.mut};display:flex;gap:18px;align-items:center}
.top .meta i{width:28px;height:1.5px;background:currentColor;display:inline-block}
header{position:absolute;top:186px;left:72px;right:72px;text-align:center}
.lead{font-size:29px;font-weight:400;color:${t.mut};letter-spacing:-.01em}
h1{margin-top:14px;font-weight:300;font-size:80px;line-height:1.06;letter-spacing:-.048em}
h1 em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;font-size:1.2em;letter-spacing:-.02em;line-height:.8}
h1 mark{background:#ff6039;color:#fff;font-family:'Instrument Serif',serif;font-style:italic;font-size:1.18em;letter-spacing:-.015em;
  padding:.02em .14em .06em .1em;border-radius:3px;line-height:.92;display:inline-block;margin-top:.1em}
footer{position:absolute;left:72px;right:72px;bottom:64px;display:flex;justify-content:space-between;align-items:flex-end}
.body{font-size:20px;line-height:1.36;color:${t.mut};max-width:330px;padding-top:16px;border-top:1.5px solid #ff6039}
.pill{display:inline-flex;gap:10px;align-items:center;border:1.5px solid ${t.fg};border-radius:999px;padding:13px 24px;font-size:15px;font-weight:600;letter-spacing:.16em;text-transform:uppercase}
.note{position:absolute;width:300px;padding:24px 26px 28px;background:#fdfdfb;color:#171717;font-size:22px;line-height:1.26;
  box-shadow:0 22px 40px rgba(0,0,0,${p.theme === 'dark' ? .5 : .16}), 0 2px 4px rgba(0,0,0,.12);
  clip-path:polygon(0 3%,8% 0,20% 2%,33% 0,47% 3%,60% 0,74% 2%,88% 0,100% 2%,99% 30%,100% 62%,98% 100%,84% 97%,70% 100%,55% 98%,40% 100%,26% 97%,12% 100%,0 98%,1% 64%,0 33%)}
.note b{font-weight:600;color:#ff6039}
</style></head><body>
<canvas id="c"></canvas>
<div class="vig"></div><div class="scrim"></div>
<svg class="grain" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>
<div class="top"><span class="brand"><img class="ic" src="/src/opus-icon-512.png"><img class="wm" src="/src/${t.logo}"></span><span class="meta">${p.pilar}<i></i>${num}</span></div>
<header><p class="lead">${p.lead}</p><h1>${p.title}</h1></header>
${p.note ? `<div class="note" style="left:${p.note.x}px;top:${p.note.y}px;transform:rotate(${p.note.r}deg)">${p.note.t}</div>` : ''}
<footer><p class="body">${p.body}</p><span class="pill">Leia a legenda <span>→</span></span></footer>
<script type="module">
import { render } from '/src/scenes.js';
await document.fonts.ready;
const c = document.getElementById('c'); c.width = 2160; c.height = 2700;
try { render(c, ${JSON.stringify(p.scene)}, { dark: ${p.theme === 'dark'} }); window.__done = 'ok'; }
catch (e) { window.__done = 'erro: ' + e.message + e.stack; }
</script></body></html>`;
};

const types = { '.js':'text/javascript', '.mjs':'text/javascript', '.css':'text/css', '.png':'image/png', '.ttf':'font/ttf', '.html':'text/html' };
let current = '';
const server = createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  if (u === '/post.html') { res.writeHead(200, { 'content-type':'text/html' }); return res.end(current); }
  const f = join(root, u);
  if (!f.startsWith(root) || !existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
}).listen(0);
const port = server.address().port;

const only = process.argv.slice(2).map(Number);
const browser = await chromium.launch({ executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args:['--no-sandbox','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport:{ width:1080, height:1350 } });
page.on('pageerror', e => console.error('pageerror', e.message));
for (const p of posts) {
  if (only.length && !only.includes(p.n)) continue;
  current = html(p);
  await page.goto(`http://localhost:${port}/post.html`);
  await page.waitForFunction(() => window.__done, null, { timeout: 300000, polling: 500 });
  const status = await page.evaluate(() => window.__done);
  const out = join(root, 'posts', `post-${String(p.n).padStart(2,'0')}.png`);
  await page.screenshot({ path: out });
  console.log(p.n, status, out);
}
await browser.close(); server.close();
