# Sintetiza os efeitos sonoros de "O Farol" (sem bibliotecas de áudio prontas, só numpy).
#   python3 tools/sfx_farol.py   ->  public/sfx-farol/*.wav
import os
import wave

import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'sfx-farol')
os.makedirs(OUT, exist_ok=True)
rng = np.random.default_rng(7)


def t_(d):
    return np.arange(int(d * SR)) / SR


def noise(d):
    return rng.standard_normal(int(d * SR))


def lowpass(x, fc):
    # filtro por FFT (corte suave)
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (f / fc) ** 4)
    return np.fft.irfft(X, len(x))


def bandpass(x, lo, hi):
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    X *= (1 / (1 + (lo / np.maximum(f, 1)) ** 4)) * (1 / (1 + (f / hi) ** 4))
    return np.fft.irfft(X, len(x))


def env(n, a, r, curva=2.0):
    e = np.ones(n)
    na, nr = int(a * SR), int(r * SR)
    if na:
        e[:na] = np.linspace(0, 1, na)
    if nr:
        e[-nr:] *= np.linspace(1, 0, nr) ** curva
    return e


def reverb(x, tempo=1.6, mix=0.3):
    n = int(tempo * SR)
    ir = rng.standard_normal(n) * np.exp(-np.linspace(0, 7, n))
    ir = lowpass(ir, 5000)
    m = len(x) + n
    y = np.fft.irfft(np.fft.rfft(x, m) * np.fft.rfft(ir, m), m)
    y /= np.max(np.abs(y)) + 1e-9
    out = np.zeros(len(x) + n)
    out[: len(x)] += x * (1 - mix)
    out += y * mix * np.max(np.abs(x))
    return out


def salva(nome, x, ganho=0.9):
    x = x / (np.max(np.abs(x)) + 1e-9) * ganho
    st = np.stack([x, x], 1)
    with wave.open(os.path.join(OUT, nome), 'wb') as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((st * 32767).astype(np.int16).tobytes())
    print(nome, f'{len(x) / SR:.1f}s')


# ---------- Ambientes ----------
def vento(d):
    n = noise(d)
    lfo = 0.55 + 0.45 * np.sin(2 * np.pi * 0.11 * t_(d)) * np.sin(2 * np.pi * 0.037 * t_(d) + 1)
    return lowpass(n, 500) * lfo


def grilos(d):
    t = t_(d)
    y = np.zeros(len(t))
    for k, (f, taxa, fase) in enumerate([(4300, 3.1, 0), (4700, 2.6, 1.3), (5100, 3.7, 2.1)]):
        trem = (np.sin(2 * np.pi * 42 * t) > 0.2).astype(float)
        pulso = (np.sin(2 * np.pi * taxa * t + fase) > 0.55).astype(float)
        y += np.sin(2 * np.pi * f * t) * trem * pulso * (0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t + k))
    return lowpass(y, 7000)


def agua(d):
    n = noise(d)
    t = t_(d)
    ondas = 0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 0.35 * t) * np.sin(2 * np.pi * 0.13 * t + 2))
    base = bandpass(n, 150, 1200) * ondas
    gotas = np.zeros(len(t))
    for _ in range(int(d * 3)):
        i = rng.integers(0, len(t) - 4000)
        f = rng.uniform(600, 1400)
        tt = t[:3000]
        gotas[i: i + 3000] += np.sin(2 * np.pi * (f + 2000 * tt) * tt) * np.exp(-tt * 40) * 0.25
    return base + gotas


def drone(d):
    t = t_(d)
    sub = np.zeros(len(t))
    for f, a in [(55, 1), (58.3, 0.7), (82.4, 0.5), (110.6, 0.3)]:
        sub += a * np.sin(2 * np.pi * f * t + 0.6 * np.sin(2 * np.pi * 0.2 * t))
    ar = lowpass(noise(d), 300) * 0.6
    cresce = np.linspace(0.35, 1, len(t)) ** 1.5
    return (sub + ar) * cresce * env(len(t), 2.0, 2.5)


# ---------- Efeitos ----------
def rosnado(d=1.7):
    t = t_(d)
    f0 = 70 + 25 * np.sin(2 * np.pi * 1.3 * t)
    serra = 2 * ((np.cumsum(f0) / SR) % 1) - 1
    aspero = serra * (0.6 + 0.4 * np.sign(np.sin(2 * np.pi * 23 * t)))
    y = lowpass(aspero, 900) + 0.5 * bandpass(noise(d), 200, 1500)
    return reverb(y * env(len(t), 0.25, 0.8), 1.2, 0.35)


def brilho(d=1.8):
    t = t_(d)
    y = np.zeros(len(t))
    for k, f in enumerate([1568, 1976, 2349, 2637, 3136, 3951]):
        st = k * 0.09
        tt = np.clip(t - st, 0, None)
        y += np.sin(2 * np.pi * f * tt) * np.exp(-tt * 4) * (t >= st)
    y += 0.15 * bandpass(noise(d), 6000, 12000) * env(len(t), 0.3, 1.2)
    return reverb(y, 1.8, 0.45)


def whoosh(d=1.0):
    t = t_(d)
    n = noise(d)
    y = np.zeros(len(t))
    blocos = 20
    for b in range(blocos):
        i0, i1 = b * len(t) // blocos, (b + 1) * len(t) // blocos
        fc = 300 + 3000 * np.sin(np.pi * b / blocos)
        y[i0:i1] = bandpass(n, fc * 0.5, fc * 1.5)[i0:i1]
    return y * np.sin(np.pi * t / d) ** 2


def passos(d=3.2, intervalo=0.42):
    t = t_(d)
    y = np.zeros(len(t))
    k = 0
    while k * intervalo < d - 0.2:
        i = int(k * intervalo * SR)
        tt = t[:4000]
        y[i: i + 4000] += lowpass(noise(4000 / SR), 600) * np.exp(-tt * 35) * (0.8 + 0.4 * rng.random())
        k += 1
    return reverb(y, 0.6, 0.2)


def sino(d=2.5, f=880):
    t = t_(d)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * 2.5) + 0.5 * np.sin(2 * np.pi * f * 2.76 * t) * np.exp(-t * 5) + 0.3 * np.sin(2 * np.pi * f * 5.4 * t) * np.exp(-t * 8)
    return reverb(y, 2.0, 0.4)


def caixinha(d=4.6):
    notas = [784, 988, 1175, 988, 1319, 1175, 988, 784, 880, 988]
    t = t_(d)
    y = np.zeros(len(t))
    for k, f in enumerate(notas):
        st = 0.2 + k * 0.4
        tt = np.clip(t - st, 0, None)
        y += (t >= st) * (np.sin(2 * np.pi * f * tt) + 0.3 * np.sin(2 * np.pi * 2 * f * tt)) * np.exp(-tt * 5)
    return reverb(y, 1.5, 0.35)


def apagao(d=2.6):
    t = t_(d)
    f = 220 * np.exp(-t * 1.6)
    zumbido = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.02, 1.5) * 0.6
    cliques = np.zeros(len(t))
    for k in range(6):
        i = int((0.05 + k * 0.14) * SR)
        cliques[i: i + 600] += noise(600 / SR) * np.exp(-np.arange(600) / 60)
    return reverb(zumbido + cliques * 1.2, 1.0, 0.3)


def boom(d=3.0):
    t = t_(d)
    f = 60 * np.exp(-t * 0.8) + 30
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 1.4) + 0.3 * lowpass(noise(d), 200) * np.exp(-t * 3)
    return reverb(y, 2.5, 0.4)


def coro(d=9.0):
    # "uuu" de várias vozes: acordes com vibrato e formantes
    t = t_(d)
    y = np.zeros(len(t))
    for k, f in enumerate([196, 247, 294, 392, 220, 330]):
        vib = 1 + 0.006 * np.sin(2 * np.pi * (5 + k * 0.3) * t + k)
        fase = 2 * np.pi * np.cumsum(f * vib) / SR
        voz = sum(np.sin(h * fase) / h for h in range(1, 8))
        y += voz * (0.7 + 0.3 * np.sin(2 * np.pi * 0.25 * t + k))
    y = bandpass(y, 180, 1100)
    return reverb(y * env(len(t), 1.2, 0.2), 2.2, 0.45)


def susto(d=3.0):
    t = t_(d)
    y = np.zeros(len(t))
    for f in [233, 247, 349, 370, 466, 494]:
        y += 2 * ((f * t) % 1) - 1
    y = lowpass(y, 3000) * np.exp(-t * 1.5) + boom(d)[: len(t)] * 0.8
    return reverb(y * env(len(t), 0.005, 1.5), 2.0, 0.4)


def coracao(d=10.0, bpm=78, acelera=1.25):
    t = t_(d)
    y = np.zeros(len(t))
    x = 0.0
    while x < d - 0.4:
        p = 60 / (bpm * (1 + (acelera - 1) * x / d))
        for dt, a in [(0, 1), (0.17, 0.7)]:
            i = int((x + dt) * SR)
            tt = t[:5000]
            if i + 5000 < len(t):
                y[i: i + 5000] += a * np.sin(2 * np.pi * 55 * tt) * np.exp(-tt * 18)
        x += p
    return lowpass(y, 300)


def desliga(d=2.5):
    t = t_(d)
    f = 900 * np.exp(-t * 2.5) + 40
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), 0.01, 1.8) + 0.4 * bandpass(noise(d), 300, 2000) * np.exp(-t * 4)
    return reverb(y, 2.5, 0.5)


salva('noite-rua.wav', vento(28.5) + 0.25 * grilos(28.5), 0.8)
salva('rio.wav', agua(40.0) + 0.5 * vento(40.0), 0.8)
salva('drone.wav', drone(26.5), 0.85)
salva('rosnado.wav', rosnado())
salva('brilho.wav', brilho())
salva('whoosh.wav', whoosh())
salva('passos.wav', passos())
salva('sino.wav', sino())
salva('caixinha.wav', caixinha())
salva('apagao.wav', apagao())
salva('boom.wav', boom())
salva('coro.wav', coro())
salva('susto.wav', susto())
salva('coracao.wav', coracao())
salva('desliga.wav', desliga())

# Converte para MP3 (menor) e apaga os WAV.
import subprocess
for f in sorted(os.listdir(OUT)):
    if f.endswith('.wav'):
        src = os.path.join(OUT, f)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-b:a', '160k', src[:-4] + '.mp3'], check=True)
        os.remove(src)
