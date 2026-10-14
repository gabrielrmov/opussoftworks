import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

function htmlsDoPainel(outDir) {
  const achados = [];
  const raiz = path.join(outDir, "painel.html");
  if (fs.existsSync(raiz)) achados.push(raiz);
  const percorrer = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) percorrer(p);
      else if (e.name.endsWith(".html")) achados.push(p);
    }
  };
  percorrer(path.join(outDir, "painel"));
  return achados;
}

const temNoindex = (html) =>
  (html.match(/<meta\b[^>]*>/gi) ?? []).some(
    (m) => /name=["']robots["']/i.test(m) && /noindex/i.test(m),
  );

const ler = (arquivo) => (fs.existsSync(arquivo) ? fs.readFileSync(arquivo, "utf8") : null);

export function verificar(outDir) {
  const problemas = [];
  const paginas = htmlsDoPainel(outDir);
  if (paginas.length === 0) {
    problemas.push("nenhuma página do painel encontrada no build");
  }
  for (const pagina of paginas) {
    if (!temNoindex(fs.readFileSync(pagina, "utf8"))) {
      problemas.push(`${path.relative(outDir, pagina)}: sem meta robots noindex`);
    }
  }
  const sitemap = ler(path.join(outDir, "sitemap.xml"));
  if (sitemap?.includes("/painel")) problemas.push("sitemap.xml cita /painel");
  const robots = ler(path.join(outDir, "robots.txt"));
  if (robots === null || !/^Disallow:\s*\/painel\b/im.test(robots)) {
    problemas.push("robots.txt sem Disallow: /painel");
  }
  return problemas;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const problemas = verificar(process.argv[2] ?? "out");
  if (problemas.length === 0) console.log("ok");
  else {
    for (const p of problemas) console.error(p);
    process.exit(1);
  }
}
