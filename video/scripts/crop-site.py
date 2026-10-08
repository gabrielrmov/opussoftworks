"""Recorta da captura do site (public/site/opus-390.png) os pedaços usados no vídeo.

Lê os retângulos de public/site/opus-390.json (px CSS) e salva, na escala da
captura (deviceScaleFactor), os três cards de "Onde a Opus SoftWorks entra" e o
cabeçalho da seção. Rodar depois de `npm run capture`.
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent / "public" / "site"
data = json.loads((ROOT / "opus-390.json").read_text())
k = data["deviceScaleFactor"]
page = Image.open(ROOT / "opus-390.png").convert("RGB")


def crop(r, name):
    box = tuple(round(v * k) for v in (r["x"], r["y"], r["x"] + r["w"], r["y"] + r["h"]))
    page.crop(box).save(ROOT / name, optimize=True)
    print(name, box)


for i, c in enumerate(data["cards"]):
    crop(c["card"], f"card-{i + 1}.png")
crop(data["rects"]["solucoesHeader"], "section.png")
