import { fitText, measureText } from "@remotion/layout-utils";
import { MONO, SANS, SERIF } from "./font";

/**
 * Estilos de texto do site + medição com @remotion/layout-utils.
 * Só chamar depois do portão de fontes (OpusLaunch), senão a medida sai na fonte errada.
 */
export type Face = { fontFamily: string; fontWeight: number; fontStyle?: "italic"; letterSpacing: string };

/** Títulos do site: Inter Tight com tracking negativo. */
export const sans = (fontWeight = 700, letterSpacing = "-0.045em"): Face => ({ fontFamily: SANS, fontWeight, letterSpacing });
/** Display do site (h2 do CTA final): Instrument Serif. */
export const serif = (italic = true): Face => ({ fontFamily: SERIF, fontWeight: 400, letterSpacing: "-0.01em", ...(italic ? { fontStyle: "italic" as const } : {}) });
/** Eyebrow do site: maiúsculas espaçadas, coral. */
export const eyebrow: Face = { fontFamily: SANS, fontWeight: 500, letterSpacing: "0.14em" };
export const mono: Face = { fontFamily: MONO, fontWeight: 500, letterSpacing: "0em" };

const extra = (f: Face) => (f.fontStyle ? { fontStyle: f.fontStyle } : undefined);

/** Maior tamanho (até `max`) em que `text` cabe em `width`. */
export const fit = (text: string, width: number, face: Face, max: number) =>
  Math.min(
    max,
    Math.floor(
      fitText({
        text,
        withinWidth: width,
        fontFamily: face.fontFamily,
        fontWeight: face.fontWeight,
        letterSpacing: face.letterSpacing,
        additionalStyles: extra(face),
        validateFontIsLoaded: true,
      }).fontSize,
    ),
  );

/** Um tamanho só pra várias linhas (o da mais longa). */
export const fitAll = (texts: string[], width: number, face: Face, max: number) =>
  Math.min(...texts.map((t) => fit(t, width, face, max)));

export const widthOf = (text: string, size: number, face: Face) =>
  measureText({
    text,
    fontSize: size,
    fontFamily: face.fontFamily,
    fontWeight: face.fontWeight,
    letterSpacing: face.letterSpacing,
    additionalStyles: extra(face),
    validateFontIsLoaded: true,
  }).width;
