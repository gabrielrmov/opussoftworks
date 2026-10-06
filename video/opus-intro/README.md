# Opus SoftWorks — vídeo de apresentação (15s, 1080x1920)

- `index.html` — o vídeo em HTML + GSAP. Abra num navegador e clique em **🔊 Assistir com som**
  (o navegador só libera áudio após um clique). Espaço pausa, R reinicia.
- `opus-intro.mp4` — versão renderizada (30 fps, H.264 + AAC, com trilha).
- `trilha.wav` — a trilha isolada (para editar em CapCut, Premiere etc.).
- `render.mjs` — re-renderiza o MP4: `node render.mjs 30 opus-intro.mp4 --wav` (precisa de Playwright e ffmpeg).

**Trilha:** composição original sintetizada em `assets/trilha.js` (120 BPM, I–V–vi–IV), sem
direitos de terceiros. Drop na entrada da cena 2, "whoosh" em cada transição, clique e acorde
final no botão "Seguir". Para usar uma música licenciada, coloque `assets/musica.mp3` — ela
substitui a trilha sintetizada no HTML e no render.

**Fotos:** coloque `assets/foto-1.jpg` (cena 2) e `assets/foto-2.jpg` (avatar final).
Se não existirem, o vídeo usa um placeholder com o símbolo da marca.

Os números dos infográficos (100%, 04 etapas, 100%) estão nos atributos `data-to`
de `index.html` — ajuste conforme os dados reais.
