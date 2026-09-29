/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Só definido no build do GitHub Pages (site em /<repo>/); vazio no
  // Cloudflare Pages e local.
  basePath: process.env.PAGES_BASE_PATH || "",
  images: {
    unoptimized: true,
  },
  // Some o indicador "Static route" que o Next mostra no canto da tela
  // durante o desenvolvimento. Só afeta o ambiente local, nunca aparece
  // em produção.
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
};

module.exports = nextConfig;
