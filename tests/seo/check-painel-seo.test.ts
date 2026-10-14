import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { verificar } from "@/scripts/check-painel-seo.mjs";

const NOINDEX = '<html><head><meta name="robots" content="noindex, nofollow"/></head></html>';
const dirs: string[] = [];

function fixture(opts: { noindex?: boolean; sitemap?: string; painel?: boolean; robots?: string } = {}) {
  const { noindex = true, sitemap = "<urlset><loc>https://x.com/</loc></urlset>", painel = true, robots = "User-Agent: *\nAllow: /\nDisallow: /painel\n" } = opts;
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-"));
  dirs.push(dir);
  const html = noindex ? NOINDEX : "<html><head></head></html>";
  if (painel) {
    fs.mkdirSync(path.join(dir, "painel"));
    fs.writeFileSync(path.join(dir, "painel.html"), html);
    fs.writeFileSync(path.join(dir, "painel", "entrar.html"), html);
  }
  fs.writeFileSync(path.join(dir, "sitemap.xml"), sitemap);
  fs.writeFileSync(path.join(dir, "robots.txt"), robots);
  return dir;
}

afterEach(() => {
  while (dirs.length) fs.rmSync(dirs.pop()!, { recursive: true, force: true });
});

describe("verificar", () => {
  it("retorna vazio para um build correto", () => {
    expect(verificar(fixture())).toEqual([]);
  });
  it("aponta página do painel sem noindex", () => {
    expect(verificar(fixture({ noindex: false })).length).toBeGreaterThan(0);
  });
  it("aponta sitemap que cita /painel", () => {
    const p = verificar(fixture({ sitemap: "<loc>https://x.com/painel</loc>" }));
    expect(p.some((x) => x.includes("sitemap"))).toBe(true);
  });
  it("aponta ausência de páginas do painel", () => {
    const p = verificar(fixture({ painel: false }));
    expect(p.some((x) => x.includes("nenhuma página"))).toBe(true);
  });
  it("aponta robots.txt sem Disallow /painel", () => {
    const p = verificar(fixture({ robots: "User-Agent: *\nAllow: /\n" }));
    expect(p.some((x) => x.includes("robots.txt"))).toBe(true);
  });
});
