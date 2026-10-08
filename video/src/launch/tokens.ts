import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** Cores do site. */
export const COLOR = {
  paper: "#F5F5F3",
  ink: "#121214",
  coral: "#FF6039",
  navy: "#0B1530",
  white: "#FFFFFF",
  grey: "#A3A3A0", // palavra "apagada" antes do risco
  dot: "rgba(22, 93, 252, 0.34)", // grade de pontos do hero do site
};

export const W = 1080;
export const H = 1920;
/** Margem lateral de texto e safe zone vertical (Reels/TikTok). */
export const MARGIN = 84;
export const SAFE = { top: 220, bottom: H - 380 };
export const TEXT_W = W - MARGIN * 2; // 912

/** Fontes do site, locais (@fontsource), carregadas antes do render. */
export const SANS = "Inter Tight";
export const SERIF = "Instrument Serif";
export const MONO = "JetBrains Mono";

const FONTS = [
  { family: SANS, weight: "500", style: "normal", file: "inter-tight-latin-500-normal.woff2" },
  { family: SANS, weight: "700", style: "normal", file: "inter-tight-latin-700-normal.woff2" },
  { family: SANS, weight: "800", style: "normal", file: "inter-tight-latin-800-normal.woff2" },
  { family: SERIF, weight: "400", style: "normal", file: "instrument-serif-latin-400-normal.woff2" },
  { family: SERIF, weight: "400", style: "italic", file: "instrument-serif-latin-400-italic.woff2" },
  { family: MONO, weight: "500", style: "normal", file: "jetbrains-mono-latin-500-normal.woff2" },
];
for (const f of FONTS) {
  loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style });
}
