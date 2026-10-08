"""QA do OpusLaunch a partir dos stills de out/qa/frames (scripts/qa-stills.mjs).

Uso: python3 scripts/qa.py

Gera out/qa/contact-sheet.png (10×6) e out/qa/report.txt com:
  (a) margem: extremos horizontais do conteúdo (tudo que difere da cor de
      fundo da cena) contra a margem de 84 px; e se algo encosta na borda
      (cortado). O push-in do site (270–315) é ignorado de propósito;
  (b) círculo de caneta: centro do traço coral vs centro de "Venda é."
      (do opus-390.json), medido no still do frame 255;
  (d) cortes: todos os `from` de SCENES em múltiplos de 15.
(c) quebras de linha: todas as linhas são nowrap e as larguras foram medidas
em scripts/measure-text.py; confira no contact sheet.
"""
import json
import os
import re
import subprocess

import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
QA = os.path.join(ROOT, "out", "qa")
FRAMES = os.path.join(QA, "frames")
MARGIN = 84
TOL = 6  # câmera na mão (~3 px) + antialiasing

# Tempos direto do timeline.ts (via esbuild) pra não duplicar nada aqui.
tl_js = subprocess.run(
    [os.path.join(ROOT, "node_modules", ".bin", "esbuild"), os.path.join(ROOT, "src", "timeline.ts"), "--bundle", "--format=cjs", "--platform=node", "--log-level=error"],
    capture_output=True, text=True, check=True,
).stdout
TL = json.loads(subprocess.run(["node", "-e", tl_js + ";const m=module.exports;console.log(JSON.stringify({SCENES:m.SCENES,SITE:m.SITE,SLAMS:[m.ENTREGA.e,m.ENTREGA.entrega,m.LEAD.venda,m.SISTEMA.lines[2]]}))"], capture_output=True, text=True, check=True).stdout)
SCENES, SITE, SLAMS = TL["SCENES"], TL["SITE"], TL["SLAMS"]
META = json.load(open(os.path.join(ROOT, "public", "site", "opus-390.json")))


def scene_of(f):
    return next(k for k, s in SCENES.items() if s["from"] <= f < s["to"])


def content_mask(a):
    """Pixels que diferem da cor de fundo (cor mais comum do quadro)."""
    q = (a[::4, ::4] // 8).astype(np.int32)
    packed = (q[..., 0] << 10) | (q[..., 1] << 5) | q[..., 2]
    top = np.bincount(packed.ravel()).argmax()
    bg = np.array([(top >> 10) & 31, (top >> 5) & 31, top & 31]) * 8 + 4
    d = np.abs(a.astype(int) - bg).sum(-1)
    blue = (a[..., 2].astype(int) - a[..., 0].astype(int)) > 40  # pontos azuis da grade do site
    return (d > 200) & ~blue  # acima da vinheta e do grão


lines = ["frame  cena        x-min  x-max  alerta"]
files = sorted(f for f in os.listdir(FRAMES) if f.endswith(".png"))
thumbs = []
for name in files:
    f = int(re.findall(r"\d+", name)[0])
    img = Image.open(os.path.join(FRAMES, name)).convert("RGB")
    a = np.asarray(img)
    sc = scene_of(f)
    m = content_mask(a)
    # ignora grão/vinheta: só colunas com conteúdo de verdade
    cols = np.where(m[200:1600].sum(0) >= 6)[0]
    alerts = []
    if sc == "site":
        x0 = x1 = None
        if f < SITE["pushFrom"]:
            pass  # celular centralizado; o conteúdo é o próprio site
    elif len(cols):
        x0, x1 = int(cols.min()), int(cols.max())
        slamming = any(at <= f < at + 6 for at in SLAMS)
        entering = sc.startswith("method") and f < SCENES[sc]["from"] + 8
        if x0 < MARGIN - TOL or x1 > 1080 - MARGIN + TOL:
            alerts.append("slam (overshoot intencional)" if slamming else "numeral entrando" if entering else "FORA DA MARGEM")
        if (x0 <= 1 or x1 >= 1078) and not entering:
            alerts.append("CORTADO NA BORDA")
    else:
        x0 = x1 = None
    lines.append(f"{f:5d}  {sc:10s}  {str(x0):>5}  {str(x1):>5}  {' '.join(alerts)}")
    t = img.resize((216, 384))
    d = ImageDraw.Draw(t)
    d.rectangle([0, 0, 216, 22], fill=(18, 18, 20))
    d.text((6, 5), f"{f}  {f / 30:.1f}s" + ("  !" if any(a.isupper() for a in alerts) else ""), fill=(255, 96, 57) if any(a.isupper() for a in alerts) else (255, 255, 255), font=ImageFont.load_default())
    # guias da margem de 84 px
    d.line([(MARGIN * 0.2, 22), (MARGIN * 0.2, 384)], fill=(255, 0, 180), width=1)
    d.line([(216 - MARGIN * 0.2, 22), (216 - MARGIN * 0.2, 384)], fill=(255, 0, 180), width=1)
    thumbs.append(t)

sheet = Image.new("RGB", (10 * 216, 6 * 384), "white")
for k, t in enumerate(thumbs[:60]):
    sheet.paste(t, ((k % 10) * 216, (k // 10) * 384))
sheet.save(os.path.join(QA, "contact-sheet.png"))

# (b) círculo em "Venda é."
K = 560 / META["viewport"]["width"]
bezel, screen_w = 20, 560
phone_h = META["viewport"]["height"] * K + 2 * bezel
screen = ((1080 - (screen_w + 2 * bezel)) / 2 + bezel, (220 + 1540) / 2 - phone_h / 2 + bezel)
v = META["rects"]["vendaE"]
final_scroll = SITE["scroll"][-1]["y"]
cx = screen[0] + (v["x"] + v["w"] / 2) * K
cy = screen[1] + (v["y"] - final_scroll + v["h"] / 2) * K
circle_note = "sem still do frame 255"
p255 = os.path.join(FRAMES, "f255.png")
if os.path.exists(p255):
    a = np.asarray(Image.open(p255).convert("RGB")).astype(int)
    win = a[int(cy) - 90 : int(cy) + 90, int(cx) - 140 : int(cx) + 140]
    r, g, b = win[..., 0], win[..., 1], win[..., 2]
    coral = (r > 200) & (g < 150) & (b < 120) & (r - g > 90)
    ys, xs = np.where(coral)
    if len(xs):
        ccx = (xs.min() + xs.max()) / 2 + int(cx) - 140
        ccy = (ys.min() + ys.max()) / 2 + int(cy) - 90
        circle_note = f"centro do círculo ({ccx:.0f}, {ccy:.0f}) vs centro de 'Venda é.' ({cx:.0f}, {cy:.0f}) → desvio ({ccx - cx:+.0f}, {ccy - cy:+.0f}) px"
        crop = Image.open(p255).crop((int(cx) - 200, int(cy) - 130, int(cx) + 200, int(cy) + 130)).resize((800, 520))
        dd = ImageDraw.Draw(crop)
        dd.line([(400 - 10, 260), (400 + 10, 260)], fill=(0, 160, 255), width=2)
        dd.line([(400, 250), (400, 270)], fill=(0, 160, 255), width=2)
        crop.save(os.path.join(QA, "circle-check.png"))

# (d) cortes
cuts = [s["from"] for s in SCENES.values()]
bad = [c for c in cuts if c % 15]
lines += ["", f"(b) {circle_note}", f"(d) cortes: {cuts} → {'todos em múltiplos de 15' if not bad else 'FORA DO BEAT: ' + str(bad)}"]
report = "\n".join(lines)
open(os.path.join(QA, "report.txt"), "w").write(report + "\n")
print(report)
