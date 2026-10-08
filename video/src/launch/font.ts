import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** Fontes do site, locais (public/fonts, vindas do @fontsource). */
export const SANS = "Inter Tight";
export const SERIF = "Instrument Serif";
export const MONO = "JetBrains Mono";
/** compatibilidade com os componentes que importam FONT */
export const FONT = SANS;

const FILES = [
  { family: SANS, weight: "500", style: "normal", file: "inter-tight-latin-500-normal.woff2" },
  { family: SANS, weight: "700", style: "normal", file: "inter-tight-latin-700-normal.woff2" },
  { family: SANS, weight: "800", style: "normal", file: "inter-tight-latin-800-normal.woff2" },
  { family: SERIF, weight: "400", style: "normal", file: "instrument-serif-latin-400-normal.woff2" },
  { family: SERIF, weight: "400", style: "italic", file: "instrument-serif-latin-400-italic.woff2" },
  { family: MONO, weight: "500", style: "normal", file: "jetbrains-mono-latin-500-normal.woff2" },
];

/** Resolve quando todas as fontes estão prontas (pra medir texto com fitText). */
export const fontsLoaded = Promise.all(
  FILES.map((f) => loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style })),
);
