"""Gera a trilha (public/music.mp3) e os efeitos (public/sfx/*.wav) do OpusLaunch.

Trilha eletrônica minimalista a 120 BPM: 1 beat = 0,5 s = 15 frames a 30fps,
então os compassos batem com os keyframes de src/launch/timeline.ts.
Entra forte no frame 0 (sem fade-in). Mapa (em segundos):
  0–4    Hook       kick 4x4 + baixo + stab de acorde no 0
  4–9    Pilares    + arpejo em 16avos
  9–12   Sistema    + pad abrindo
  12–17  Método     + hi-hats em 16avos e palmas, riser até 17
  17–22  Outcome    tudo, filtro aberto
  22–23,5 Zoom out  bateria sai, riser → volta no 23,5 (logo, frame 705)
  23,5–30 Logo/CTA  groove de novo, acorde final no 29,5

Uso: python3 scripts/make-audio.py  (precisa de numpy e ffmpeg)
"""
import os
import subprocess
import wave

import numpy as np

SR = 44100
BEAT = 0.5
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


def saw(freq, n, detune=0.0):
    t = t_of(n)
    return sum(2 * ((t * freq * (1 + d)) % 1.0) - 1 for d in (-detune, 0, detune)) / 3


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


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


def sfx_glitch():
    n = int(0.36 * SR)
    out = np.zeros(n)
    step = int(0.03 * SR)
    for k in range(0, n - step, step):
        if rng.random() < 0.75:
            seg = np.round(rng.standard_normal(step) * 3) / 3  # "bitcrush"
            f = rng.choice([300, 600, 1200, 2400])
            seg = seg * 0.5 + np.sign(np.sin(2 * np.pi * f * t_of(step)))
            out[k : k + step] = seg * env(step, 0.0005, 0.012)
    return normalize_peak(highpass(out, 200), 0.7)


os.makedirs(os.path.join(ROOT, "public", "sfx"), exist_ok=True)
for name, fn in (("tick", sfx_tick), ("click", sfx_click), ("whoosh", sfx_whoosh), ("impact", sfx_impact), ("glitch", sfx_glitch)):
    write_wav(os.path.join(ROOT, "public", "sfx", f"{name}.wav"), to_stereo(fn(), 0.25 if name == "whoosh" else 0.0))

# ============================== TRILHA ==============================
DUR = 30.0
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)


def add(sig, start, gain=1.0, pan=0.0):
    i = int(round(start * SR))
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * gain * (1 + min(pan, 0))


def section(t):
    """Quais camadas tocam no tempo t."""
    drums = not (22.0 <= t < 23.5) and t < 29.5
    return {
        "drums": drums,
        "arp": 4.0 <= t < 22.0 or 23.5 <= t < 29.5,
        "hat16": 12.0 <= t < 22.0,
        "clap": 12.0 <= t < 22.0 or 23.5 <= t < 26.0,
    }


CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G, 2 s cada


def chord_at(t):
    return CHORDS[int(t // 2.0) % 4]


def kick():
    n = int(0.42 * SR)
    t = t_of(n)
    body = np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-t / 0.035)) / SR) * env(n, 0.001, 0.17)
    return body + 0.08 * highpass(rng.standard_normal(n), 2500) * env(n, 0.0003, 0.003)


K = kick()
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    if section(t)["drums"]:
        add(K, t, 0.95 if b % 4 == 0 else 0.85)

# Baixo em colcheias (mais forte no contratempo, efeito de sidechain)
for k in range(int(DUR / (BEAT / 2))):
    t = k * BEAT / 2
    if not section(t)["drums"]:
        continue
    root = chord_at(t)[0] - 24
    n = int(BEAT / 2 * SR * 0.92)
    sig = lowpass(np.sin(2 * np.pi * midi(root) * t_of(n)) + 0.35 * saw(midi(root), n), 380)
    add(sig * env(n, 0.006, 0.12, s=0.35), t, 0.36 if k % 2 else 0.22)


def hat(length=0.045):
    n = int(length * SR)
    return highpass(rng.standard_normal(n), 7000) * env(n, 0.0004, length / 4)


for k in range(int(DUR / (BEAT / 4))):
    t = k * BEAT / 4
    sec = section(t)
    if sec["drums"] and k % 4 == 2:
        add(hat(0.06), t, 0.22, pan=0.2)
    if sec["hat16"] and k % 4 != 2:
        add(hat(), t, 0.09 + 0.05 * ((t - 12) / 10), pan=-0.2)


def clap():
    n = int(0.22 * SR)
    noise = highpass(rng.standard_normal(n), 1100)
    e = sum(env(n, 0.0005, 0.01) * (np.arange(n) >= int(d * SR)) for d in (0, 0.009, 0.018)) + env(n, 0.0005, 0.08)
    return noise * e


CL = clap()
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    if section(t)["clap"] and b % 2 == 1:
        add(CL, t, 0.24)

ARP = [0, 7, 12, 7, 15, 12, 7, 3]
for k in range(int(DUR / (BEAT / 4))):
    t = k * BEAT / 4
    if not section(t)["arp"]:
        continue
    note = chord_at(t)[0] + 12 + ARP[k % len(ARP)]
    n = int(0.16 * SR)
    bright = 1600 + 3200 * np.clip((t - 4) / 16, 0, 1)
    sig = lowpass(saw(midi(note), n, 0.003), bright) * env(n, 0.002, 0.06)
    pan = 0.4 if k % 2 else -0.4
    add(sig, t, 0.075, pan)
    add(sig, t + 0.375, 0.03, -pan)

for c in range(15):
    start = c * 2.0
    length = 2.3
    n = int(length * SR)
    sig = sum(saw(midi(m), n, 0.005) for m in chord_at(start)) / 3
    open_ = 0.3 + 0.7 * np.clip((start - 9) / 10, 0, 1)
    sig = lowpass(sig, 500 + 2600 * open_)
    e = np.minimum(1, t_of(n) / 0.05) * np.clip((length - t_of(n)) / 0.3, 0, 1)
    add(sig * e, start, 0.11 + 0.06 * open_)


def stab(t0, gain):
    n = int(0.9 * SR)
    sig = sum(saw(midi(m + 12), n, 0.006) for m in chord_at(t0)) / 3
    add(lowpass(sig, 3500) * env(n, 0.002, 0.25), t0, gain)


stab(0.0, 0.35)
stab(23.5, 0.35)
stab(29.5, 0.3)

for a, b in ((16.0, 17.0), (22.0, 23.5)):
    n = int((b - a) * SR)
    x = t_of(n) / (b - a)
    add(lowpass(rng.standard_normal(n), 300 + 7000 * x**2) * x**2, a, 0.32)

# Master: saturação suave, ataque de 5 ms (sem fade-in), cauda curta no fim
mix = np.tanh(np.stack([L, R], axis=1) * 1.25)
t = t_of(N)
mix *= np.clip(t / 0.005, 0, 1)[:, None]
mix *= np.clip((DUR - t) / 0.45, 0, 1)[:, None]
mix = normalize_peak(mix, 0.9)
tmp = os.path.join(ROOT, "out", "music.wav")
os.makedirs(os.path.dirname(tmp), exist_ok=True)
write_wav(tmp, mix)
subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1.0:LRA=9", "-ar", "44100",
     "-c:a", "libmp3lame", "-b:a", "256k", os.path.join(ROOT, "public", "music.mp3")],
    check=True,
)
print("ok: public/music.mp3 + public/sfx/*.wav")
