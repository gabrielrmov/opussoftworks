// Gera os PNGs 1080x1350 em ../posts a partir de posts.mjs + scenes.js.
// Uso (na pasta marketing/): npm i --no-save playwright-core three@0.169 && node src/render.mjs [n...]
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { posts } from './posts.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const three = existsSync(join(root, 'node_modules/three')) ? '/node_modules/three' : '/src/node_modules/three';

const themes = {
  dark:  { bg:'#151515', fg:'#f5f5f5', mut:'#a8a8a8', logo:'opus-logo-white.png', pill:'#f5f5f5',
           glow:'radial-gradient(900px 700px at 0% 0%, rgba(255,96,57,.32), transparent 70%), radial-gradient(700px 500px at 100% 100%, rgba(255,96,57,.10), transparent 70%)' },
  light: { bg:'#fafafa', fg:'#171717', mut:'#585858', logo:'opus-logo-black.png', pill:'#171717',
           glow:'radial-gradient(900px 700px at 50% 70%, #ffffff, transparent 70%), radial-gradient(600px 500px at 100% 0%, rgba(255,96,57,.10), transparent 70%)' },
};

const burst = ({ x, y, s, r }) => {
  const pts = Array.from({ length: 24 }, (_, i) => { const a = i * Math.PI / 12, rad = i % 2 ? 30 : 50; return `${50 + Math.cos(a) * rad},${50 + Math.sin(a) * rad}`; }).join(' ');
  return `<svg class="burst" style="left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;transform:rotate(${r}deg)" viewBox="0 0 100 100"><polygon points="${pts}" fill="#ff6039"/></svg>`;
};

const html = (p) => {
  const t = themes[p.theme];
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="/src/fonts.css">
<script type="importmap">{"imports":{"three":"${three}/build/three.module.js","three/addons/":"${three}/examples/jsm/"}}</script>
<style>
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;background:${t.bg};color:${t.fg};font-family:'Inter Tight',sans-serif;position:relative;overflow:hidden}
.glow{position:absolute;inset:0;background:${t.glow}}
.grain{position:absolute;inset:0;opacity:${p.theme === 'dark' ? .06 : .04};background-image:radial-gradient(${t.fg} 1px, transparent 1.2px);background-size:22px 22px}
canvas{position:absolute;left:0;width:1080px}
header{position:absolute;top:0;left:0;right:0;padding:70px 90px 0;text-align:center;z-index:2}
.brand{display:inline-flex;align-items:center;gap:6px}.brand .ic{height:78px;margin:-12px 0}.brand .wm{height:34px}
.lead{margin-top:56px;font-size:34px;font-weight:400;color:${t.mut};letter-spacing:-.01em}
h1{margin-top:14px;font-weight:300;font-size:86px;line-height:1.02;letter-spacing:-.035em}
h1 em{font-family:'Instrument Serif',serif;font-style:italic;font-weight:400;font-size:1.14em;letter-spacing:-.01em}
h1 mark{display:inline-block;background:#ff6039;color:#fff;font-family:'Instrument Serif',serif;font-style:italic;font-size:1.12em;letter-spacing:-.01em;
  padding:0 .2em .04em;line-height:1.05;border-radius:6px;transform:rotate(-2deg);margin:.08em .05em 0;box-shadow:0 10px 30px rgba(255,96,57,.28)}
footer{position:absolute;left:0;right:0;bottom:58px;text-align:center;z-index:2}
.body{font-size:24px;color:${t.mut};margin-bottom:18px}
.pill{display:inline-block;border:1.5px solid ${t.pill};border-radius:999px;padding:11px 26px;font-size:17px;font-weight:500;letter-spacing:.14em;text-transform:uppercase}
.note{position:absolute;z-index:3;width:330px;padding:26px 28px 30px;background:#fff;color:#171717;font-size:25px;line-height:1.25;
  box-shadow:0 18px 40px rgba(0,0,0,${p.theme === 'dark' ? .45 : .14});
  clip-path:polygon(0 3%,8% 0,20% 2%,33% 0,47% 3%,60% 0,74% 2%,88% 0,100% 2%,99% 30%,100% 62%,98% 100%,84% 97%,70% 100%,55% 98%,40% 100%,26% 97%,12% 100%,0 98%,1% 64%,0 33%)}
.note b{font-weight:600;color:#ff6039}
.burst{position:absolute;z-index:3;filter:drop-shadow(0 8px 16px rgba(255,96,57,.35))}
</style></head><body>
<div class="glow"></div><div class="grain"></div>
<header><span class="brand"><img class="ic" src="/src/opus-icon-512.png"><img class="wm" src="/src/${t.logo}"></span><p class="lead">${p.lead}</p><h1>${p.title}</h1></header>
<canvas id="c"></canvas>
${p.note ? `<div class="note" style="left:${p.note.x}px;top:${p.note.y}px;transform:rotate(${p.note.r}deg)">${p.note.t}</div>` : ''}
${p.bursts.map(burst).join('')}
<footer><p class="body">${p.body}</p><span class="pill">Leia a legenda</span></footer>
<script type="module">
import { render } from '/src/scenes.js';
await document.fonts.ready;
const top = document.querySelector('h1').getBoundingClientRect().bottom - 30;
const bottom = document.querySelector('footer').getBoundingClientRect().top - 8;
const c = document.getElementById('c'); c.style.top = top + 'px'; c.style.height = (bottom - top) + 'px';
c.width = 1080 * 2; c.height = Math.round((bottom - top) * 2);
try { render(c, ${JSON.stringify(p.scene)}, { dark: ${p.theme === 'dark'} }); window.__done = 'ok'; }
catch (e) { window.__done = 'erro: ' + e.message; }
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
  await page.waitForFunction(() => window.__done, null, { timeout: 120000 });
  const status = await page.evaluate(() => window.__done);
  const out = join(root, 'posts', `post-${String(p.n).padStart(2,'0')}.png`);
  await page.screenshot({ path: out });
  console.log(p.n, status, out);
}
await browser.close(); server.close();
