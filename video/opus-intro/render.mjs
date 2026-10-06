// Renderiza index.html em MP4 1080x1920 quadro a quadro (timeline GSAP pausada + seek).
// Uso: node render.mjs [fps=30] [saida=opus-intro.mp4]
//      node render.mjs 30 opus-intro.mp4 --wav  -> também salva trilha.wav
//      node render.mjs --stills 0.5,1.2,3.0   -> só gera PNGs de conferência em ./frames
// Requer: playwright (Chromium) e ffmpeg no PATH.
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const stillsIdx = args.indexOf("--stills");
const stills = stillsIdx >= 0 ? args[stillsIdx + 1].split(",").map(Number) : null;
const fps = stills ? 30 : Number(args[0] || 30);
const out = stills ? null : (args[1] || join(root, "opus-intro.mp4"));

const types = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".woff2": "font/woff2" };
const server = createServer(async (req, res) => {
  try {
    const p = join(root, decodeURIComponent(new URL(req.url, "http://x").pathname));
    const body = await readFile(p.endsWith("/") ? join(p, "index.html") : p);
    res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" }).end(body);
  } catch { res.writeHead(404).end(); }
}).listen(0);
const port = server.address().port;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on("pageerror", e => console.error("pageerror:", e.message));
await page.goto(`http://localhost:${port}/index.html?render=1`);
await page.evaluate(() => window.__ready);
const duration = await page.evaluate(() => window.__duration);

if (stills) {
  await mkdir(join(root, "frames"), { recursive: true });
  for (const t of stills) {
    await page.evaluate(t => window.__seek(t), t);
    await page.screenshot({ path: join(root, "frames", `t${t.toFixed(2)}.png`) });
  }
} else {
  // Trilha: renderizada na própria página (OfflineAudioContext) e exportada como WAV
  const wavB64 = await page.evaluate(async () => {
    const bytes = new Uint8Array(window.OpusTrilha.toWav(await window.OpusTrilha.load()));
    let s = ""; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(s);
  });
  const wav = join(tmpdir(), `opus-trilha-${process.pid}.wav`);
  await writeFile(wav, Buffer.from(wavB64, "base64"));
  if (args.includes("--wav")) await writeFile(join(root, "trilha.wav"), Buffer.from(wavB64, "base64"));

  const total = Math.round(duration * fps);
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-i", "-", "-i", wav,
    "-map", "0:v", "-map", "1:a", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "slow",
    "-c:a", "aac", "-b:a", "192k", "-t", String(duration), "-movflags", "+faststart", out], { stdio: ["pipe", "inherit", "inherit"] });
  for (let i = 0; i < total; i++) {
    await page.evaluate(t => window.__seek(t), i / fps);
    const buf = await page.screenshot({ type: "png" });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
    if (i % fps === 0) process.stdout.write(`\r${(i / fps).toFixed(0)}s / ${duration}s`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on("close", r));
  await rm(wav, { force: true });
  console.log(`\nok → ${out}`);
}
await browser.close();
server.close();
