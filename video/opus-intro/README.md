# Opus SoftWorks — vídeo de apresentação (15s, 1080x1920)

- `index.html` — o vídeo em HTML + GSAP (abra num navegador; Espaço pausa, R reinicia).
- `opus-intro.mp4` — versão renderizada (30 fps, H.264).
- `render.mjs` — re-renderiza o MP4: `node render.mjs` (precisa de Playwright e ffmpeg).

**Fotos:** coloque `assets/foto-1.jpg` (cena 2) e `assets/foto-2.jpg` (avatar final).
Se não existirem, o vídeo usa um placeholder com o símbolo da marca.

Os números dos infográficos (100%, 04 etapas, 100%) estão nos atributos `data-to`
de `index.html` — ajuste conforme os dados reais.
