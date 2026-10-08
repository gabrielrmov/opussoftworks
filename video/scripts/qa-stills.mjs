/**
 * Renderiza um still a cada 0,5 s (15 frames) do OpusLaunch em out/qa/frames/.
 * Empacota o projeto uma vez só. Uso: node scripts/qa-stills.mjs
 */
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "out", "qa", "frames");
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(ROOT, "src", "index.ts"), publicDir: join(ROOT, "public") });
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE || null;
const composition = await selectComposition({ serveUrl, id: "OpusLaunch", browserExecutable });
const step = 15;
for (let frame = 0; frame < composition.durationInFrames; frame += step) {
  const output = join(OUT, `f${String(frame).padStart(3, "0")}.png`);
  await renderStill({ serveUrl, composition, frame, output, browserExecutable, imageFormat: "png" });
  process.stdout.write(`${frame} `);
}
console.log("\nok");
