import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Segundos → frames, pra escrever a timeline em tempo humano. */
export const s = (seconds: number) => Math.round(seconds * FPS);

// Paleta do site (app/css/style.css): um único accent cromático (cobalt).
export const C = {
  canvas: "#171721",
  card: "#1e1e2a",
  button: "#272735",
  slate: "#70707d",
  ash: "#c3c3cc",
  ivory: "#ededf3",
  cobalt: "#5266eb",
  cobaltSoft: "#6478f0",
  white: "#ffffff",
  line: "rgba(255,255,255,0.10)",
};

export const FONT_UI = "Inter";
export const FONT_DISPLAY = "Space Grotesk";

const fonts = [
  { family: FONT_UI, weight: "400", file: "inter-latin-400-normal.woff2" },
  { family: FONT_UI, weight: "500", file: "inter-latin-500-normal.woff2" },
  { family: FONT_UI, weight: "600", file: "inter-latin-600-normal.woff2" },
  { family: FONT_DISPLAY, weight: "500", file: "space-grotesk-latin-500-normal.woff2" },
  { family: FONT_DISPLAY, weight: "600", file: "space-grotesk-latin-600-normal.woff2" },
];

for (const f of fonts) {
  loadFont({
    family: f.family,
    url: staticFile(`fonts/${f.file}`),
    weight: f.weight,
  });
}
