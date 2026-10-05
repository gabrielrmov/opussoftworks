// Renderiza cada <section class="slide"> de um HTML em PNG 1080x1350.
// Uso: node social/render.mjs social/post-01-apresentacao/carrossel.html
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const file = resolve(process.argv[2]);
const outDir = resolve(dirname(file), 'png');
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 1500 }, deviceScaleFactor: 1 });
await page.goto('file://' + file, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

const slides = await page.$$('section.slide');
for (let i = 0; i < slides.length; i++) {
  const name = `slide-${String(i + 1).padStart(2, '0')}.png`;
  await slides[i].screenshot({ path: resolve(outDir, name) });
  console.log('ok', name);
}
await browser.close();
