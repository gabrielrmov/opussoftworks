import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/** Inter Tight, a fonte do site, local (public/fonts, vinda do @fontsource). */
export const SANS = "Inter Tight";
/** compatibilidade com os componentes que importam FONT */
export const FONT = SANS;

const FILES = [
  { family: SANS, weight: "500", style: "normal", file: "inter-tight-latin-500-normal.woff2" },
  { family: SANS, weight: "600", style: "normal", file: "inter-tight-latin-600-normal.woff2" },
  { family: SANS, weight: "700", style: "normal", file: "inter-tight-latin-700-normal.woff2" },
  { family: SANS, weight: "800", style: "normal", file: "inter-tight-latin-800-normal.woff2" },
];

/** Resolve quando todas as fontes estão prontas (pra medir texto com fitText). */
export const fontsLoaded = Promise.all(
  FILES.map((f) => loadFont({ family: f.family, url: staticFile(`fonts/${f.file}`), weight: f.weight, style: f.style })),
);
