/**
 * Captura o site real da Opus SoftWorks para o vídeo de lançamento.
 *
 *   node scripts/capture-site.mjs                       # opussoftworks.com.br
 *   SITE_URL=http://127.0.0.1:4173 node scripts/capture-site.mjs
 *
 * Viewport de celular (390×844, deviceScaleFactor 3). Rola a página inteira
 * devagar pra disparar as animações de entrada, volta ao topo e tira um
 * screenshot full page. Salva também as posições reais (getBoundingClientRect,
 * em px de página) dos trechos que o vídeo usa: public/site/opus-390.json.
 *
 * Precisa de `playwright-core` (ou `playwright`) instalado e de um Chromium:
 * CHROME_PATH aponta pra um executável já instalado, se houver.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const { chromium } = await import("playwright-core").catch(() => import("playwright"));

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const URL = process.env.SITE_URL ?? "https://opussoftworks.com.br/";
const OUT = join(ROOT, "public", "site");
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ["--no-sandbox"],
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
});
await page.goto(URL, { waitUntil: "networkidle", timeout: 90_000 });
await page.evaluate(() => document.fonts.ready);

// Rola tudo devagar (dispara AOS/whileInView), depois volta ao topo.
await page.evaluate(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (let y = 0; y < document.documentElement.scrollHeight; y += 260) {
    window.scrollTo(0, y);
    await sleep(140);
  }
  window.scrollTo(0, document.documentElement.scrollHeight);
  await sleep(800);
  window.scrollTo(0, 0);
  await sleep(1500);
});

const meta = await page.evaluate(() => {
  const rect = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height };
  };
  const card01 = document.querySelector("#solucoes .rounded-2xl");
  return {
    url: location.href,
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    pageHeight: document.documentElement.scrollHeight,
    rects: {
      hero: rect(document.querySelector("#conteudo > *:first-child")),
      // cabeçalho da seção: "Onde a OPUS SOFTWORKS entra" → "Três frentes, uma mesma estratégia."
      solucoesHeader: rect(document.querySelector("#solucoes > div:first-of-type")),
      tresFrentes: rect(document.querySelector("#solucoes h2")),
      card01: rect(card01),
      vendaE: rect(card01?.querySelector("strong")),
    },
    // os três cards e o trecho em negrito de cada um
    cards: [...document.querySelectorAll("#solucoes .rounded-2xl")].slice(0, 3).map((c) => ({
      card: rect(c),
      title: c.querySelector("h3")?.textContent ?? null,
      emphasis: rect(c.querySelector("strong")),
      emphasisText: c.querySelector("strong")?.textContent ?? null,
      // uma caixa por linha do negrito (pode quebrar em duas)
      emphasisLines: [...(c.querySelector("strong")?.getClientRects() ?? [])].map((r) => ({
        x: r.left + window.scrollX,
        y: r.top + window.scrollY,
        w: r.width,
        h: r.height,
      })),
    })),
    vendaEText: card01?.querySelector("strong")?.textContent ?? null,
  };
});

// Elementos fixos (header, botão do WhatsApp): num full page eles ficariam
// "colados" no meio da página. Captura cada um à parte (na posição da tela,
// com a página no topo) e esconde antes do full page — o vídeo os sobrepõe
// fixos na tela do celular, como no aparelho.
const fixed = await page.evaluate(() => {
  const out = [];
  document.querySelectorAll("body *").forEach((el) => {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return;
    const r = el.getBoundingClientRect();
    if (r.width < 8 || r.height < 8 || r.bottom <= 0 || r.top >= window.innerHeight) return;
    // camadas de tela cheia (efeitos/cursor) não são UI: ficam de fora
    if (r.width >= window.innerWidth && r.height >= window.innerHeight) return;
    if (el.parentElement && getComputedStyle(el.parentElement).position === "fixed") return;
    const id = `fixed-${out.length}`;
    el.setAttribute("data-capture-fixed", id);
    out.push({ id, x: r.left, y: r.top, w: r.width, h: r.height });
  });
  return out;
});
for (const f of fixed) {
  await page.locator(`[data-capture-fixed="${f.id}"]`).screenshot({ path: join(OUT, `${f.id}.png`), omitBackground: true });
}
meta.fixed = fixed;
await page.addStyleTag({ content: "[data-capture-fixed]{display:none !important}" });
await page.waitForTimeout(300);

await page.screenshot({ path: join(OUT, "opus-390.png"), fullPage: true });
writeFileSync(join(OUT, "opus-390.json"), JSON.stringify(meta, null, 2) + "\n");
console.log(JSON.stringify(meta, null, 2));
await browser.close();
