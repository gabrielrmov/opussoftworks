"""Gera a trilha (public/music.mp3) e os efeitos (public/sfx/*.wav) do OpusLaunch.

Trilha eletrônica minimalista a 120 BPM: 1 beat = 0,5 s = 15 frames a 30fps,
então os compassos batem com os keyframes de src/launch/timeline.ts.
Curva de energia (em segundos):
  0–4    punch      kick + baixo + palmas + stab no frame 0, sem fade-in
  4–17   groove     contínuo: + hats e arpejo
  17–23  build      riser, filtro abrindo, rufo acelerando
  23     drop       stab + crash junto com o impacto do logo (frame 690)
  23–25  cheio
  25–30  limpo      kick, baixo e pad; hit final em 29 s

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
DROP = 23.0
END_HIT = 29.0


def add(sig, start, gain=1.0, pan=0.0):
    i = int(round(start * SR))
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    L[i : i + len(sig)] += sig * gain * (1 - max(pan, 0))
    R[i : i + len(sig)] += sig * gain * (1 + min(pan, 0))


CHORDS = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]]  # Am F C G, 2 s cada


def chord_at(t):
    return CHORDS[int(t // 2.0) % 4]


def build(t):
    """0→1 ao longo do build (17–23 s)."""
    return float(np.clip((t - 17.0) / (DROP - 17.0), 0, 1))


def kick():
    n = int(0.42 * SR)
    t = t_of(n)
    body = np.sin(2 * np.pi * np.cumsum(48 + 120 * np.exp(-t / 0.035)) / SR) * env(n, 0.001, 0.17)
    return body + 0.08 * highpass(rng.standard_normal(n), 2500) * env(n, 0.0003, 0.003)


def hat(length=0.045):
    n = int(length * SR)
    return highpass(rng.standard_normal(n), 7000) * env(n, 0.0004, length / 4)


def clap():
    n = int(0.22 * SR)
    noise = highpass(rng.standard_normal(n), 1100)
    e = sum(env(n, 0.0005, 0.01) * (np.arange(n) >= int(d * SR)) for d in (0, 0.009, 0.018)) + env(n, 0.0005, 0.08)
    return noise * e


def snare(length=0.12):
    n = int(length * SR)
    t = t_of(n)
    return (0.6 * highpass(rng.standard_normal(n), 1500) + 0.4 * np.sin(2 * np.pi * 190 * t)) * env(n, 0.0005, length / 3)


def crash():
    n = int(2.5 * SR)
    return highpass(rng.standard_normal(n), 4500) * env(n, 0.002, 0.9)


def stab(t0, gain, length=0.9):
    n = int(length * SR)
    sig = sum(saw(midi(m + 12), n, 0.006) for m in chord_at(t0)) / 3
    sig += 0.5 * sum(saw(midi(m), n, 0.004) for m in chord_at(t0)) / 3
    add(lowpass(sig, 4200) * env(n, 0.002, length / 3), t0, gain)


K = kick()
CL = clap()

# Bateria
for b in range(int(DUR / BEAT)):
    t = b * BEAT
    if t >= END_HIT + 0.01:
        break
    if DROP - 0.5 <= t < DROP:  # meio beat de suspense antes do drop (o riser segura)
        continue
    clean = t >= 25.0
    add(K, t, 1.0 if t < 4 or DROP <= t < 25 else (0.8 if clean else 0.9))
    if b % 2 == 1 and not clean and t < DROP - 0.5:
        add(CL, t, 0.3 if t < 4 else 0.22)
    if b % 2 == 1 and DROP <= t < 25:
        add(CL, t, 0.3)

# Baixo (colcheias, mais forte no contratempo)
for k in range(int(DUR / (BEAT / 2))):
    t = k * BEAT / 2
    if t >= END_HIT or DROP - 0.5 <= t < DROP:
        continue
    root = chord_at(t)[0] - 24
    n = int(BEAT / 2 * SR * 0.92)
    sig = lowpass(np.sin(2 * np.pi * midi(root) * t_of(n)) + 0.35 * saw(midi(root), n), 380 + 300 * build(t))
    add(sig * env(n, 0.006, 0.12, s=0.35), t, (0.38 if k % 2 else 0.24) * (0.85 if t >= 25 else 1))

# Hats: contratempo a partir de 4 s; 16avos no build e no drop; leves no fim
for k in range(int(DUR / (BEAT / 4))):
    t = k * BEAT / 4
    if t >= END_HIT:
        continue
    pos = k % 4
    if 4.0 <= t < DROP - 0.5 and pos == 2:
        add(hat(0.06), t, 0.2, pan=0.2)
    if (17.0 <= t < DROP - 0.5 or DROP <= t < 25) and pos != 2:
        add(hat(), t, 0.06 + 0.08 * build(t) + (0.08 if t >= DROP else 0), pan=-0.2)
    if t >= 25 and pos == 2:
        add(hat(0.05), t, 0.1, pan=0.2)

# Rufo acelerando no fim do build (21–22,5 s)
t = 21.0
while t < DROP - 0.5:
    step = BEAT / 2 if t < 21.75 else BEAT / 4 if t < 22.25 else BEAT / 8
    add(snare(), t, 0.12 + 0.18 * (t - 21.0) / 1.5)
    t += step

# Arpejo: groove + build (filtro abrindo) + drop; some na parte limpa
ARP = [0, 7, 12, 7, 15, 12, 7, 3]
for k in range(int(DUR / (BEAT / 4))):
    t = k * BEAT / 4
    if not (4.0 <= t < 25.0) or DROP - 0.5 <= t < DROP:
        continue
    note = chord_at(t)[0] + 12 + ARP[k % len(ARP)]
    n = int(0.16 * SR)
    bright = 1400 + 1200 * np.clip((t - 4) / 13, 0, 1) + 5000 * build(t)
    sig = lowpass(saw(midi(note), n, 0.003), bright) * env(n, 0.002, 0.06)
    pan = 0.4 if k % 2 else -0.4
    g = 0.07 + 0.03 * build(t)
    add(sig, t, g, pan)
    add(sig, t + 0.375, g * 0.4, -pan)

# Pad: o tempo todo; abre no build e fica limpo no fim
for c in range(15):
    start = c * 2.0
    length = 2.3
    n = int(length * SR)
    sig = sum(saw(midi(m), n, 0.005) for m in chord_at(start)) / 3
    tt = start + t_of(n)
    cut = 600 + 1200 * np.clip((tt - 4) / 13, 0, 1) + 4000 * np.clip((tt - 17) / 6, 0, 1)
    cut = np.where(tt >= 25, 1800, cut)
    sig = lowpass(sig, cut)
    e = np.minimum(1, t_of(n) / 0.05) * np.clip((length - t_of(n)) / 0.3, 0, 1)
    add(sig * e, start, 0.12 + (0.05 if 17 <= start < 25 else 0))

# Riser (17 → 23 s)
n = int((DROP - 17.0) * SR)
x = t_of(n) / (DROP - 17.0)
add(lowpass(rng.standard_normal(n), 300 + 9000 * x**2) * x**2.2, 17.0, 0.42)

# Acentos: punch no 0, drop no 23, hit final no 29
stab(0.0, 0.45)
stab(DROP, 0.5)
add(crash(), DROP, 0.18)
stab(END_HIT, 0.45, length=1.0)
add(K, END_HIT, 1.0)
add(crash(), END_HIT, 0.14)

# Automação de volume: dá a curva de energia (punch → groove → build → drop → limpo).
t = t_of(N)
AUTOMATION = [(0, 1.0), (3.9, 1.0), (4.1, 0.62), (17.0, 0.62), (DROP - 0.05, 1.25), (25.0, 1.15), (25.3, 0.5), (END_HIT - 0.05, 0.5), (END_HIT, 1.0), (DUR, 1.0)]
gain = np.interp(t, [p[0] for p in AUTOMATION], [p[1] for p in AUTOMATION])
# o build sobe em curva exponencial, não linear
in_build = (t >= 17.0) & (t < DROP)
gain[in_build] = 0.62 * (1.25 / 0.62) ** (((t[in_build] - 17.0) / (DROP - 17.0)) ** 1.6)

# Master: saturação suave, ataque de 5 ms, cauda até o fim
mix = np.tanh(np.stack([L, R], axis=1) * gain[:, None] * 1.1)
mix *= np.clip(t / 0.005, 0, 1)[:, None]
mix *= np.clip((DUR - t) / 0.25, 0, 1)[:, None]
mix = normalize_peak(mix, 0.9)
tmp = os.path.join(ROOT, "out", "music.wav")
os.makedirs(os.path.dirname(tmp), exist_ok=True)
write_wav(tmp, mix)

# Normaliza em -14 LUFS sem achatar a curva: mede, aplica ganho fixo e limita o pico.
meas = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af", "ebur128", "-f", "null", "-"], capture_output=True, text=True).stderr
integrated = float(meas.split("Integrated loudness:")[1].split("I:")[1].split("LUFS")[0])
gain_db = -14.0 - integrated
subprocess.run(
    ["ffmpeg", "-loglevel", "error", "-y", "-i", tmp, "-af", f"volume={gain_db:.2f}dB,alimiter=limit=0.78:level=false",
     "-ar", "44100", "-c:a", "libmp3lame", "-b:a", "256k", os.path.join(ROOT, "public", "music.mp3")],
    check=True,
)
print(f"ok: public/music.mp3 (ganho {gain_db:+.1f} dB) + public/sfx/*.wav")
