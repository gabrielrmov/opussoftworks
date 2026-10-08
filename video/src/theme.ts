import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

export const FPS = 60;
export const WIDTH = 1080;
export const HEIGHT = 1920;

/** Segundos → frames, pra escrever a timeline em tempo humano. */
export const s = (seconds: number) => Math.round(seconds * FPS);

// Cores amostradas do site publicado (opussoftworks.com.br).
export const C = {
  paper: "#fafafa",
  dot: "#d6d6d6",
  card: "#eeeeee",
  white: "#ffffff",
  border: "#e4e4e4",
  ink: "#171717",
  text: "#212121",
  muted: "#5f5f5f",
  orange: "#ff6039",
  plum: "#3a2440",
  navy: "#121d45",
  navyDeep: "#0a1330",
  night: "#0f0e13",
  nightLine: "rgba(255,255,255,0.05)",
  nightGlyph: "#19181f",
};

export const SANS = "Inter";
export const SERIF = "Instrument Serif";

const fonts = [
  ...["400", "500", "600", "700", "800"].map((weight) => ({
    family: SANS,
    weight,
    file: `inter-latin-${weight}-normal.woff2`,
  })),
  { family: SERIF, weight: "400", file: "instrument-serif-latin-400-normal.woff2" },
];

for (const f of fonts) {
  loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight });
}
