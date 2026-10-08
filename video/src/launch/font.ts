import { loadFont } from "@remotion/google-fonts/InterTight";

// Inter Tight: identificada comparando o hero e o wordmark do site publicado
// (o CSS de opussoftworks.com.br não estava acessível do ambiente de render).
export const { fontFamily: FONT } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
