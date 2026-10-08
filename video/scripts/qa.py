"""QA do OpusLaunch: um frame a cada 0,5 s, contact sheet 10×6 e checagens.

Uso: python3 scripts/qa.py [out/opus-launch.mp4]

Gera out/qa/contact-sheet.png e out/qa/report.txt. Checagens automáticas:
  (a) borda: pixels de conteúdo (texto/UI escuro ou coral) a menos de 64 px
      das bordas — separa "tinta" (texto/UI) de "coral" (linha, que pode
      entrar/sair do quadro durante os movimentos);
  (c) ocupação: área do bounding box do conteúdo em relação à tela (< 25% = alerta).
(b) linha cruzando texto e (d) texto ≥ 32 px são conferidos no contact sheet
e nos frames em out/qa/frames/.
"""
import os
import subprocess
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
VIDEO = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "out", "opus-launch.mp4")
OUT = os.path.join(ROOT, "out", "qa")
FRAMES = os.path.join(OUT, "frames")
STEP = 15  # 0,5 s a 30 fps
EDGE = 64
os.makedirs(FRAMES, exist_ok=True)
for old in os.listdir(FRAMES):  # frames de um QA anterior não podem entrar no relatório
    os.remove(os.path.join(FRAMES, old))

subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-y", "-i", VIDEO, "-vf", f"select='not(mod(n\\,{STEP}))'", "-vsync", "vfr",
     os.path.join(FRAMES, "f%03d.png")],
    check=True,
)
files = sorted(f for f in os.listdir(FRAMES) if f.endswith(".png"))


def masks(img):
    a = np.asarray(img.convert("RGB")).astype(np.int16)
    r, g, b = a[..., 0], a[..., 1], a[..., 2]
    lum = 0.299 * r + 0.587 * g + 0.114 * b
    ink = lum < 100
    coral = (r > 200) & (g < 160) & (b < 130) & (r - g > 80)
    return ink, coral


def bbox_area(mask):
    rows = np.where(mask.sum(1) >= 3)[0]
    cols = np.where(mask.sum(0) >= 3)[0]
    if len(rows) == 0 or len(cols) == 0:
        return 0.0
    return (rows[-1] - rows[0]) * (cols[-1] - cols[0]) / mask.size


lines = ["frame  tempo  ocupação  borda-tinta  borda-coral  alertas"]
thumbs = []
for i, f in enumerate(files):
    n = i * STEP
    img = Image.open(os.path.join(FRAMES, f))
    ink, coral = masks(img)
    content = ink | coral
    occ = bbox_area(content)
    band = np.zeros_like(ink)
    band[:EDGE, :] = band[-EDGE:, :] = True
    band[:, :EDGE] = band[:, -EDGE:] = True
    e_ink = int((ink & band).sum())
    e_coral = int((coral & band).sum())
    alerts = []
    if occ < 0.25:
        alerts.append("OCUPAÇÃO<25%")
    if e_ink > 40:
        alerts.append("TEXTO/UI NA BORDA")
    lines.append(f"{n:5d}  {n / 30:5.1f}s  {occ * 100:6.1f}%  {e_ink:11d}  {e_coral:11d}  {' '.join(alerts)}")

    t = img.convert("RGB").resize((216, 384))
    d = ImageDraw.Draw(t)
    d.rectangle([0, 0, 216, 24], fill=(23, 23, 23))
    font = ImageFont.load_default()
    d.text((6, 6), f"{n}  {n / 30:.1f}s" + ("  !" if alerts else ""), fill=(255, 255, 255) if not alerts else (255, 96, 57), font=font)
    thumbs.append(t)

cols, rows = 10, 6
sheet = Image.new("RGB", (cols * 216, rows * 384), "white")
for k, t in enumerate(thumbs[: cols * rows]):
    sheet.paste(t, ((k % cols) * 216, (k // cols) * 384))
sheet.save(os.path.join(OUT, "contact-sheet.png"))
report = "\n".join(lines)
open(os.path.join(OUT, "report.txt"), "w").write(report + "\n")
print(report)
print(f"\n{os.path.join(OUT, 'contact-sheet.png')}")
