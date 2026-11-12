# Gera os efeitos sonoros de "O Porão" por síntese (sem baixar nada).
#   python3 tools/efeitos.py <duracao_em_segundos>
# Saída: public/sfx/*.wav e public/ambiente.wav
import math
import os
import sys
import wave

import numpy as np

SR = 44100
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = os.path.join(root, 'public', 'sfx')
os.makedirs(out, exist_ok=True)
rng = np.random.default_rng(7)


def save(path, x):
    x = np.asarray(x, dtype=np.float64)
    peak = np.max(np.abs(x)) or 1.0
    x = x / peak * 0.9
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    data = (x * 32767).astype('<i2').tobytes()
    with wave.open(path, 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data)


def t(d):
    return np.arange(int(d * SR)) / SR


def lowpass(x, cut):
    a = math.exp(-2 * math.pi * cut / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def bandnoise(d, lo, hi):
    n = rng.standard_normal(int(d * SR))
    return lowpass(n, hi) - lowpass(lowpass(n, hi), lo)


def env(tt, a, d):
    return np.minimum(1, tt / max(a, 1e-4)) * np.exp(-np.maximum(0, tt - a) / d)


# Batida na madeira (TOC)
tt = t(0.5)
knock = (np.sin(2 * np.pi * 110 * tt) * 0.9 + np.sin(2 * np.pi * 230 * tt) * 0.5) * env(tt, 0.002, 0.06)
knock += lowpass(rng.standard_normal(len(tt)), 1800) * env(tt, 0.001, 0.015) * 2
save(os.path.join(out, 'toc.wav'), knock)

# Quique de bolinha de borracha
tt = t(0.25)
bounce = np.sin(2 * np.pi * (320 - 200 * tt) * tt) * env(tt, 0.002, 0.04)
save(os.path.join(out, 'quique.wav'), bounce)

# Tique-taque do relógio (3 s)
tt = t(3.0)
clock = np.zeros_like(tt)
for i in range(6):
    s = int(i * 0.5 * SR)
    k = t(0.05)
    f = 2400 if i % 2 == 0 else 1900
    clock[s:s + len(k)] += np.sin(2 * np.pi * f * k) * env(k, 0.001, 0.008)
save(os.path.join(out, 'relogio.wav'), clock)

# Badalada grave (3 da manhã)
tt = t(3.4)
bell = sum(np.sin(2 * np.pi * f * tt) * a for f, a in [(196, 1), (392, 0.5), (523, 0.3), (659, 0.2)]) * env(tt, 0.005, 1.0)
save(os.path.join(out, 'badalada.wav'), bell)

# Fósforo riscando
tt = t(1.2)
strike = lowpass(rng.standard_normal(len(tt)), 5000) * env(tt, 0.01, 0.12)
crackle = (rng.random(len(tt)) > 0.997) * rng.standard_normal(len(tt)) * 1.5 * np.exp(-tt * 2)
fire = lowpass(rng.standard_normal(len(tt)), 600) * 0.25 * np.minimum(1, tt / 0.1)
save(os.path.join(out, 'fosforo.wav'), strike + crackle + fire)

# Sopro que apaga
tt = t(0.8)
blow = lowpass(rng.standard_normal(len(tt)), 900) * np.sin(np.pi * np.minimum(1, tt / 0.6)) ** 2
save(os.path.join(out, 'apagou.wav'), blow)

# Sussurro (ruído com sílabas)
tt = t(2.2)
hiss = bandnoise(2.2, 1500, 6000)
syl = np.clip(np.sin(2 * np.pi * 3.2 * tt) ** 2 * np.minimum(1, tt / 0.2) * np.clip((2.1 - tt) / 0.4, 0, 1), 0, 1)
save(os.path.join(out, 'sussurro.wav'), hiss * syl)

# Impacto de susto: estrondo grave + guincho dissonante
tt = t(3.4)
boom = np.sin(2 * np.pi * (60 - 25 * np.minimum(tt, 1)) * tt) * env(tt, 0.005, 0.9)
boom += lowpass(rng.standard_normal(len(tt)), 300) * env(tt, 0.002, 0.25) * 1.5
screech = sum(np.sin(2 * np.pi * f * tt + 3 * np.sin(2 * np.pi * 6 * tt)) for f in (880, 932, 1245)) * env(tt, 0.02, 0.6) * 0.18
save(os.path.join(out, 'susto.wav'), boom + screech)

# Batimento cardíaco (3,4 s)
tt = t(3.4)
heart = np.zeros_like(tt)
for b in np.arange(0, 3.2, 0.75):
    for off, a in [(0, 1), (0.18, 0.7)]:
        s = int((b + off) * SR)
        k = t(0.25)
        e = min(len(k), len(heart) - s)
        heart[s:s + e] += (np.sin(2 * np.pi * 50 * k) * env(k, 0.005, 0.07) * a)[:e]
save(os.path.join(out, 'coracao.wav'), heart)

# Grilos (até eles pararem): 12 s
tt = t(12.0)
gate = (np.sin(2 * np.pi * 28 * tt) > 0.2) * (np.sin(2 * np.pi * 1.1 * tt) > -0.1)
crick = np.sin(2 * np.pi * 4300 * tt) * gate * 0.4
gate2 = (np.sin(2 * np.pi * 31 * tt + 1) > 0.3) * (np.sin(2 * np.pi * 0.8 * tt + 2) > 0)
crick += np.sin(2 * np.pi * 3900 * tt) * gate2 * 0.25
save(os.path.join(out, 'grilos.wav'), lowpass(crick, 6000))

# Ambiente: drone grave e vento, a duração do filme toda
dur = float(sys.argv[1]) if len(sys.argv) > 1 else 90
tt = t(dur)
drone = (np.sin(2 * np.pi * 55 * tt) + np.sin(2 * np.pi * 55.7 * tt) + 0.5 * np.sin(2 * np.pi * 82.4 * tt)) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.07 * tt))
wind = lowpass(rng.standard_normal(len(tt)), 400) * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * tt + 1)) * 6
fade = np.minimum(1, tt / 2) * np.clip((dur - tt) / 2, 0, 1)
L = (drone + wind) * fade
R = (drone + np.roll(wind, 2000)) * fade
save(os.path.join(root, 'public', 'ambiente.wav'), np.stack([L, R], axis=1))
print('ok')
