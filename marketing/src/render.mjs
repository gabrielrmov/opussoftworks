// Gera os PNGs 1080x1350 em ../posts a partir de posts.mjs.
// Uso (na pasta marketing/): npm i --no-save playwright-core && node src/render.mjs
import { chromium } from 'playwright-core';
import { writeFileSync } from 'node:fs';
import { posts } from './posts.mjs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const themes = {
  dark:  { bg:'#171721', card:'#1e1e2a', fg:'#ededf3', mut:'#c3c3cc', line:'#3a3a4a', logo:'none' },
  light: { bg:'#f3f3f8', card:'#ffffff', fg:'#171721', mut:'#70707d', line:'#d6d7e3', logo:'invert(1)' },
};

const html = (p) => {
  const t = themes[p.theme];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@import url('fonts.css');
*{box-sizing:border-box;margin:0}
body{width:1080px;height:1350px;background:${t.bg};color:${t.fg};font-family:Inter,sans-serif;
 --acc:#5266eb;--card:${t.card};--fg:${t.fg};--mut:${t.mut};--line:${t.line};position:relative;overflow:hidden}
.glow{position:absolute;right:-220px;top:-220px;width:700px;height:700px;border-radius:50%;
 background:radial-gradient(closest-side,rgba(82,102,235,${p.theme==='dark'?.22:.14}),transparent)}
.wrap{position:absolute;inset:0;padding:80px 84px;display:flex;flex-direction:column}
.top{display:flex;justify-content:space-between;align-items:center}
.logo{height:46px;filter:${t.logo}}
.tag{font-size:21px;font-weight:500;letter-spacing:.18em;text-transform:uppercase;color:${t.mut}}
h1{margin-top:96px;font-family:'Space Grotesk',sans-serif;font-weight:300;font-size:92px;line-height:1.08;letter-spacing:-.02em}
h1 b{font-weight:500}
.hl{display:inline-block;background:#5266eb;color:#fff;font-weight:500;padding:0 22px 6px;border-radius:14px;margin:6px 0}
.art{flex:1;display:flex;align-items:center;justify-content:center;margin:20px 0}
.art svg{width:760px;height:auto;max-height:520px;font-family:Inter,sans-serif}
.foot{display:flex;justify-content:space-between;align-items:flex-end;gap:40px}
.body{font-size:27px;line-height:1.4;color:${t.mut};max-width:640px}
.pill{border:2px solid ${t.fg};border-radius:999px;padding:16px 30px;font-size:19px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;white-space:nowrap}
</style></head><body><div class="glow"></div><div class="wrap">
<div class="top"><img class="logo" src="elevion-logo-white.png"><span class="tag">${p.eyebrow}</span></div>
<h1>${p.before} <span class="hl">${p.hl}</span> ${p.after}</h1>
<div class="art"><svg viewBox="0 0 600 480">${p.art}</svg></div>
<div class="foot"><p class="body">${p.body}</p><span class="pill">Leia a legenda</span></div>
</div></body></html>`;
};

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox'] });
const page = await browser.newPage({ viewport:{ width:1080, height:1350 } });
for (const p of posts) {
  const f = join(here, `_post-${p.n}.html`);
  writeFileSync(f, html(p));
  await page.goto('file://' + f);
  await page.evaluate(() => document.fonts.ready);
  const out = join(here, '..', 'posts', `post-${String(p.n).padStart(2,'0')}.png`);
  await page.screenshot({ path: out });
  console.log(out);
}
await browser.close();
