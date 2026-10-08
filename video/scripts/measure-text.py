"""Mede as frases do OpusLaunch com as fontes do site e grava src/launch/metrics.json.

Uso: python3 scripts/measure-text.py <pasta com os .ttf>

Precisa dos TTF (os mesmos desenhos dos woff2 do @fontsource):
  InterTight-800.ttf, InterTight-500.ttf, InstrumentSerif-ital-0.ttf,
  InstrumentSerif-ital-1.ttf, JetBrainsMono-wght-500.ttf
O PIL não aplica o kerning GPOS, então as larguras saem um pouco maiores que
no navegador — o que deixa a checagem de margem do lado seguro.
"""
import json
import os
import sys

from PIL import ImageFont

FONTS = sys.argv[1] if len(sys.argv) > 1 else "."
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "launch", "metrics.json")
FILES = {
    "sans800": "InterTight-800.ttf",
    "sans500": "InterTight-500.ttf",
    "serif": "InstrumentSerif-ital-0.ttf",
    "serifItalic": "InstrumentSerif-ital-1.ttf",
    "mono": "JetBrainsMono-wght-500.ttf",
}

# chave: (fonte, tamanho, letter-spacing em em, texto)
TEXTS = {
    "hook.resultado": ("sans800", 200, -0.04, "Resultado"),
    "hook.naoE": ("sans800", 200, -0.04, "não é"),
    "hook.sorte": ("sans800", 200, -0.04, "sorte."),
    "entrega.e": ("sans800", 250, -0.045, "É"),
    "entrega.entrega": ("sans800", 250, -0.045, "entrega."),
    "lead.lead": ("serif", 168, -0.01, "Lead não é"),
    "lead.resultado": ("serifItalic", 168, -0.01, "resultado."),
    "lead.venda": ("sans800", 220, -0.04, "Venda é."),
    "method.0": ("sans800", 148, -0.04, "Diagnóstico"),
    "method.1": ("sans800", 148, -0.04, "Estratégia"),
    "method.2": ("sans800", 148, -0.04, "Implementação"),
    "method.3a": ("sans800", 116, -0.04, "Otimização"),
    "method.3b": ("sans800", 116, -0.04, "contínua"),
    "method.3full": ("sans800", 116, -0.04, "Otimização contínua"),
    "numeral": ("sans800", 680, -0.06, "04"),
    "sub.0a": ("serifItalic", 76, -0.005, "Antes de propor,"),
    "sub.0b": ("serifItalic", 76, -0.005, "a gente entende."),
    "sub.1a": ("serifItalic", 76, -0.005, "Prioridade antes"),
    "sub.1b": ("serifItalic", 76, -0.005, "de execução."),
    "sub.2a": ("serifItalic", 76, -0.005, "Estratégia que"),
    "sub.2b": ("serifItalic", 76, -0.005, "sai do papel."),
    "sub.3a": ("serifItalic", 76, -0.005, "O trabalho não termina"),
    "sub.3b": ("serifItalic", 76, -0.005, "no lançamento."),
    "tool.0": ("sans800", 150, -0.04, "Sua empresa"),
    "tool.1": ("sans800", 150, -0.04, "não precisa"),
    "tool.2": ("sans800", 150, -0.04, "de mais uma"),
    "tool.3": ("sans800", 150, -0.04, "ferramenta."),
    "system.0": ("sans800", 130, -0.04, "Precisa de um"),
    "system.1": ("sans800", 130, -0.04, "sistema que"),
    "system.2": ("serifItalic", 250, -0.01, "funcione."),
    "sig.opus": ("sans800", 128, -0.035, "Opus"),
    "sig.softworks": ("sans500", 128, -0.035, "SoftWorks"),
    "sig.line1": ("serif", 92, -0.01, "Estratégia, aliada"),
    "sig.line2": ("serif", 92, -0.01, "à execução."),
    "sig.line2prefix": ("serif", 92, -0.01, "à "),
    "sig.execucao": ("serif", 92, -0.01, "execução."),
    "sig.button": ("sans500", 50, -0.01, "Falar com um especialista"),
    "sig.url": ("mono", 40, 0.0, "opussoftworks.com.br"),
    "label.opus": ("mono", 30, 0.14, "OPUS SOFTWORKS"),
    "label.trafego": ("mono", 30, 0.14, "01 — TRÁFEGO PAGO E AQUISIÇÃO"),
    "label.method": ("mono", 30, 0.14, "MÉTODO · 04 / 04"),
}


def measure(font_key, size, ls, text):
    f = ImageFont.truetype(os.path.join(FONTS, FILES[font_key]), size)
    width = f.getlength(text) + ls * size * max(0, len(text) - 1)
    ascent, descent = f.getmetrics()
    # CSS line-height:1 → caixa de altura = size; baseline medida do topo da caixa
    baseline = (size - (ascent + descent)) / 2 + ascent
    _, xt, _, xb = f.getbbox("x", anchor="ls")
    _, ct, _, _ = f.getbbox("H", anchor="ls")
    return {
        "width": round(width, 1),
        "size": size,
        "baseline": round(baseline, 1),  # do topo da caixa (line-height 1)
        "xMid": round(baseline + (xt + xb) / 2, 1),  # meio da altura-x, do topo da caixa
        "capTop": round(baseline + ct, 1),
    }


out = {k: measure(*v) for k, v in TEXTS.items()}
json.dump(out, open(OUT, "w"), indent=1, ensure_ascii=False)
for k, v in out.items():
    print(f"{k:22s} {v['width']:7.1f}px  size {v['size']}")
