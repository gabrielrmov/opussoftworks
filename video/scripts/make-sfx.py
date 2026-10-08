"""Gera os efeitos (public/sfx/*.wav) do OpusLaunch: tick, click, whoosh e impact.

Não gera trilha: a música é um slot (public/music.mp3, opcional). Sem o
arquivo, o vídeo sai só com estes efeitos.

Uso: python3 scripts/make-sfx.py  (precisa de numpy)
"""
import os
import wave

import numpy as np

SR = 44100
rng = np.random.default_rng(11)
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")


def t_of(n):
    return np.arange(n) / SR


def env(n, a=0.002, d=0.2, s=0.0):
    t = t_of(n)
    attack = np.clip(t / max(a, 1e-6), 0, 1)
    return attack * (s + (1 - s) * np.exp(-np.maximum(t - a, 0) / max(d, 1e-6)))


def lowpass(x, cutoff):
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def highpass(x, cutoff):
    return x - lowpass(x, cutoff)






def write_wav(path, stereo):
    stereo = np.clip(stereo, -1, 1)
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((stereo * 32767).astype("<i2").tobytes())


def to_stereo(mono, width=0.0):
    return np.stack([mono * (1 - width), mono * (1 + width)], axis=1)


def normalize_peak(x, peak=0.89):
    return x / (np.max(np.abs(x)) + 1e-9) * peak


# ============================== EFEITOS ==============================
def sfx_tick():
    n = int(0.08 * SR)
    t = t_of(n)
    body = np.sin(2 * np.pi * 1900 * t) * env(n, 0.0005, 0.012) + 0.5 * np.sin(2 * np.pi * 3800 * t) * env(n, 0.0005, 0.006)
    click = highpass(rng.standard_normal(n), 3000) * env(n, 0.0003, 0.002)
    return normalize_peak(body + 0.6 * click, 0.8)


def sfx_click():
    n = int(0.12 * SR)
    out = np.zeros(n)
    for start, g in ((0, 1.0), (0.055, 0.6)):
        i = int(start * SR)
        m = int(0.03 * SR)
        k = highpass(rng.standard_normal(m), 1800) * env(m, 0.0003, 0.004) + np.sin(2 * np.pi * 1200 * t_of(m)) * env(m, 0.0003, 0.006)
        out[i : i + m] += g * k
    return normalize_peak(out, 0.85)


def sfx_whoosh():
    dur = 0.5
    n = int(dur * SR)
    t = t_of(n)
    noise = rng.standard_normal(n)
    sweep = 400 + 5200 * np.sin(np.pi * t / dur) ** 2
    band = lowpass(highpass(noise, sweep * 0.35), sweep)
    shape = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.6
    return normalize_peak(band * shape, 0.75)


def sfx_impact():
    n = int(1.4 * SR)
    t = t_of(n)
    boom = np.sin(2 * np.pi * np.cumsum(36 + 90 * np.exp(-t / 0.06)) / SR) * env(n, 0.001, 0.55)
    snap = highpass(rng.standard_normal(n), 1500) * env(n, 0.0005, 0.03)
    tail = lowpass(rng.standard_normal(n), 1800) * env(n, 0.002, 0.4) * 0.35
    return normalize_peak(np.tanh(1.6 * (boom + 0.6 * snap + tail)), 0.95)


os.makedirs(os.path.join(ROOT, "public", "sfx"), exist_ok=True)
for name, fn in (("tick", sfx_tick), ("click", sfx_click), ("whoosh", sfx_whoosh), ("impact", sfx_impact)):
    write_wav(os.path.join(ROOT, "public", "sfx", f"{name}.wav"), to_stereo(fn(), 0.25 if name == "whoosh" else 0.0))
