"""Gera a trilha do OpusLaunch: eletrônica minimalista em crescimento, 30s a 120 BPM.

Cada batida = 0,5s = 15 frames a 30fps, então os acentos caem nas viradas de cena:
  0–3s  Intro      pad + tique de precisão
  3–7s  Statement  + kick, impacto em 5s ("É entrega")
  7–13s Pillars    + arpejo (as linhas/dados) e kick 4x4
  13–18s           + baixo e palmas (os blocos se alinham)
  18–24s Method    hi-hats acelerando + riser até 24s
  24–28s Outcome   groove completo, filtro aberto
  28–30s CTA       batidas saem, acorde final e impacto

Uso: python3 scripts/make-music.py public/audio/trilha.wav
"""
import sys
import wave

import numpy as np

SR = 44100
DUR = 30.0
BPM = 120
BEAT = 60 / BPM
N = int(SR * DUR)
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)


def t_of(n):
    return np.arange(n) / SR


def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * gain * (1 + min(pan, 0))


def env(n, a=0.005, d=0.2, s=0.0, r=0.05, hold=None):
    """ADSR simples em amostras."""
    t = t_of(n)
    e = np.where(t < a, t / max(a, 1e-6), 1.0)
    dec = np.exp(-(t - a) / max(d, 1e-6))
    e = np.where(t >= a, s + (1 - s) * dec, e)
    if hold is not None:
        rel = np.clip(1 - (t - hold) / r, 0, 1)
        e = np.where(t > hold, e * rel, e)
    return e


def lowpass(x, cutoff):
    """Passa-baixa de um polo; cutoff pode ser escalar ou array."""
    cutoff = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def saw(freq, n, detune=0.0):
    t = t_of(n)
    out = np.zeros(n)
    for d in (-detune, 0, detune):
        ph = (t * freq * (1 + d)) % 1.0
        out += 2 * ph - 1
    return out / 3


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


# ---------- Pad (acompanha a música inteira, abrindo o filtro) ----------
CHORDS = [  # Am, F, C, G — 2 compassos (4s) cada
    [57, 60, 64],
    [53, 57, 60],
    [48, 55, 64],
    [55, 59, 62],
]
for k in range(8):
    start = k * 4.0
    if start >= DUR:
        break
    length = min(4.0, DUR - start) + 0.6
    n = int(length * SR)
    chord = CHORDS[k % 4]
    sig = sum(saw(midi(m), n, detune=0.004) for m in chord) / 3
    progress = np.clip((start + t_of(n)) / 24, 0, 1)
    sig = lowpass(sig, 350 + 2200 * progress**1.5)
    e = np.minimum(1, t_of(n) / 0.8) * np.clip((length - t_of(n)) / 0.6, 0, 1)
    add(sig * e, start, gain=0.24, pan=0)

# ---------- Tique de precisão (0–7s) ----------
for b in range(int(7 / BEAT)):
    n = int(0.03 * SR)
    tick = np.sin(2 * np.pi * 3200 * t_of(n)) * env(n, 0.001, 0.008)
    add(tick, b * BEAT, gain=0.10 if b % 2 == 0 else 0.06, pan=0.3 if b % 2 else -0.3)

# ---------- Kick ----------
def kick():
    n = int(0.45 * SR)
    t = t_of(n)
    f = 45 + 110 * np.exp(-t / 0.04)
    ph = 2 * np.pi * np.cumsum(f) / SR
    click = lowpass(rng.standard_normal(n), 3000) * env(n, 0.0005, 0.003)
    return np.sin(ph) * env(n, 0.001, 0.16) + 0.05 * click

K = kick()
t = 5.0
while t < 28.0:
    if t < 7.0:
        if abs((t - 5.0) % (2 * BEAT)) < 1e-6:
            add(K, t, gain=0.35)
    else:
        # cresce de 0,4 (7s) até 0,7 (18s)
        add(K, t, gain=0.4 + 0.3 * min(1.0, (t - 7.0) / 11.0))
    t += BEAT

# ---------- Impactos (5s "É entrega", 28s CTA) ----------
def impact():
    n = int(2.2 * SR)
    tt = t_of(n)
    boom = np.sin(2 * np.pi * (38 + 60 * np.exp(-tt / 0.08)) * tt) * env(n, 0.002, 0.7)
    noise = lowpass(rng.standard_normal(n), 2500) * env(n, 0.002, 0.35)
    return boom + 0.5 * noise

add(impact(), 5.0, gain=0.3)
add(impact(), 28.0, gain=0.42)

# ---------- Arpejo (as linhas de dados, 7–28s) ----------
ARP = [0, 7, 12, 15, 12, 7, 3, 7]
step = BEAT / 4
t = 7.0
i = 0
while t < 28.0:
    chord = CHORDS[int(t // 4.0) % 4]
    note = chord[0] + 12 + ARP[i % len(ARP)]
    n = int(0.22 * SR)
    sig = saw(midi(note), n, detune=0.002)
    sig = lowpass(sig, 1800 + 2600 * np.clip((t - 7) / 17, 0, 1))
    g = 0.05 + 0.05 * np.clip((t - 7) / 11, 0, 1)
    pan = 0.45 if i % 2 else -0.45
    add(sig * env(n, 0.002, 0.07), t, gain=g, pan=pan)
    add(sig * env(n, 0.002, 0.07), t + 3 * step, gain=g * 0.35, pan=-pan)  # eco
    t += step
    i += 1

# ---------- Baixo (13–28s) ----------
t = 13.0
while t < 28.0:
    root = CHORDS[int(t // 4.0) % 4][0] - 24
    n = int(BEAT / 2 * SR * 0.9)
    sig = np.sin(2 * np.pi * midi(root) * t_of(n)) + 0.3 * saw(midi(root), n)
    sig = lowpass(sig, 420)
    add(sig * env(n, 0.004, 0.18, s=0.4, r=0.03, hold=n / SR - 0.03), t, gain=0.32)
    t += BEAT / 2

# ---------- Palmas (13–28s, tempos 2 e 4) ----------
def clap():
    n = int(0.25 * SR)
    noise = rng.standard_normal(n)
    hp = noise - lowpass(noise, 1200)
    e = sum(env(n, 0.001, 0.012) * (np.arange(n) >= int(d * SR)) for d in (0, 0.01, 0.02)) + env(n, 0.001, 0.09)
    return hp * e

CL = clap()
t = 13.0 + BEAT
while t < 28.0:
    add(CL, t, gain=0.22)
    t += 2 * BEAT

# ---------- Hi-hats acelerando (18–28s) ----------
def hat(length=0.05):
    n = int(length * SR)
    noise = rng.standard_normal(n)
    return (noise - lowpass(noise, 7000)) * env(n, 0.0005, length / 4)

t = 18.0
k = 0
while t < 28.0:
    div = 2 if t < 20 else 4 if t < 24 else 4
    add(hat(), t, gain=0.16 if k % 2 == 0 else 0.10, pan=0.25)
    t += BEAT / div
    k += 1
# rolo de 32avos no fim do Method
t = 23.0
while t < 24.0:
    add(hat(0.03), t, gain=0.08 + 0.1 * (t - 23.0), pan=-0.2)
    t += BEAT / 8

# ---------- Riser (22–24s) ----------
n = int(2.0 * SR)
noise = rng.standard_normal(n)
cut = 300 + 6000 * (t_of(n) / 2.0) ** 2
riser = lowpass(noise, cut) * (t_of(n) / 2.0) ** 2
add(riser, 22.0, gain=0.35)

# ---------- Master ----------
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.1)
fade = np.clip((DUR - t_of(N)) / 1.2, 0, 1)[:, None]
fade_in = np.clip(t_of(N) / 0.3, 0, 1)[:, None]
mix *= fade * fade_in
mix /= np.max(np.abs(mix)) / 0.89

out = sys.argv[1] if len(sys.argv) > 1 else "trilha.wav"
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("ok", out)
