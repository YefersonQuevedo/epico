"""Banda sonora original del promo de Épico (30 s, 120 BPM, Re menor).

Todo se sintetiza aquí: bombo, palmas, hi-hats, taikos, bajo, pads, arpegios,
melodía "heroica", campanas, risers, whooshes e impactos. Los golpes están
alineados con el guion de promo/timeline.ts (1 tiempo = 0,5 s).

Uso: python3 promo/music.py promo/out/music.wav
"""
import sys
import numpy as np
from scipy import signal
from scipy.io import wavfile

SR = 44100
DUR = 30.0
N = int(SR * DUR)
BEAT = 0.5
rng = np.random.default_rng(7)

L = np.zeros(N)
R = np.zeros(N)
WL = np.zeros(N)  # envío a reverb
WR = np.zeros(N)
SC = np.zeros(N)  # buses con sidechain (pad, bajo, arpegio)
SCR = np.zeros(N)


def midi(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def add(x, t0, gain=1.0, pan=0.0, rev=0.0, sc=False):
    """Suma la señal mono x en t0 (s) con paneo -1..1 y envío a reverb."""
    i = int(t0 * SR)
    if i >= N:
        return
    x = x[: N - i]
    gl = gain * np.cos((pan + 1) * np.pi / 4)
    gr = gain * np.sin((pan + 1) * np.pi / 4)
    if sc:
        SC[i:i + len(x)] += x * gl
        SCR[i:i + len(x)] += x * gr
    else:
        L[i:i + len(x)] += x * gl
        R[i:i + len(x)] += x * gr
    if rev:
        WL[i:i + len(x)] += x * gl * rev
        WR[i:i + len(x)] += x * gr * rev


def tt(d):
    return np.arange(int(d * SR)) / SR


def lp(x, fc, order=2):
    sos = signal.butter(order, min(fc, SR / 2 - 100), 'low', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def hp(x, fc, order=2):
    sos = signal.butter(order, fc, 'high', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], 'band', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def sweep_lp(x, f0, f1, block=512):
    """Pasa-bajos con frecuencia de corte que sube de f0 a f1 (exponencial)."""
    out = np.zeros_like(x)
    zi = np.zeros((1, 2))
    n = len(x)
    for s in range(0, n, block):
        k = s / max(1, n - 1)
        fc = f0 * (f1 / f0) ** k
        sos = signal.butter(2, min(fc, SR / 2 - 200), 'low', fs=SR, output='sos')
        out[s:s + block], zi = signal.sosfilt(sos, x[s:s + block], zi=zi)
    return out


def saw(f, t, detune=0.0):
    ph = (f * (1 + detune)) * t
    return 2 * (ph - np.floor(ph + 0.5))


# ---------------------------------------------------------------- percusión
def kick(g=1.0):
    t = tt(0.5)
    f = 45 + 110 * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t / 0.22)
    click = lp(rng.standard_normal(len(t)), 4000) * np.exp(-t / 0.004) * 0.4
    return np.tanh((x + click) * 1.6) * g


def clap():
    t = tt(0.35)
    n = bp(rng.standard_normal(len(t)), 900, 5000)
    env = np.zeros_like(t)
    for o in (0, 0.011, 0.022):
        env += (t >= o) * np.exp(-np.clip(t - o, 0, None) / 0.012)
    env += (t >= 0.03) * np.exp(-np.clip(t - 0.03, 0, None) / 0.12)
    return n * env * 0.8


def hat(open_=False):
    t = tt(0.3 if open_ else 0.08)
    x = hp(rng.standard_normal(len(t)), 7000)
    return x * np.exp(-t / (0.09 if open_ else 0.018)) * 0.35


def taiko(pitch=1.0):
    t = tt(1.2)
    f = (62 + 40 * np.exp(-t / 0.05)) * pitch
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.35)
    skin = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t / 0.05) * 0.5
    return np.tanh((body + skin) * 1.8)


def snare(g=1.0):
    t = tt(0.25)
    tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.05)
    n = bp(rng.standard_normal(len(t)), 1500, 9000) * np.exp(-t / 0.07)
    return (tone * 0.6 + n) * g


def crash():
    t = tt(2.6)
    x = hp(rng.standard_normal(len(t)), 5000) + 0.3 * bp(rng.standard_normal(len(t)), 3000, 8000)
    return x * np.exp(-t / 0.7) * 0.28


def impact(big=False):
    d = 3.0 if big else 1.8
    t = tt(d)
    f = 32 + 60 * np.exp(-t / 0.12)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.9 if big else 0.5))
    noise = lp(rng.standard_normal(len(t)), 2500) * np.exp(-t / 0.25) * 0.7
    metal = sum(np.sin(2 * np.pi * fr * t) * np.exp(-t / 0.6) for fr in (211, 367, 523, 811)) * 0.08
    return np.tanh((boom * 1.4 + noise + metal) * 1.3)


def riser(d, f0=200, f1=9000):
    t = tt(d)
    x = sweep_lp(rng.standard_normal(len(t)), f0, f1)
    tone = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (2.5 * t / d)) / SR) * 0.25
    env = (t / d) ** 2
    return (x * 0.6 + tone) * env


def whoosh(d=0.45, up=True):
    t = tt(d)
    x = sweep_lp(rng.standard_normal(len(t)), 300 if up else 6000, 6000 if up else 300)
    env = np.sin(np.pi * t / d) ** 2
    return x * env * 0.7


def blip(m, d=0.12):
    t = tt(d)
    return np.sin(2 * np.pi * midi(m) * t) * np.exp(-t / 0.04) * 0.5


# ---------------------------------------------------------------- tonales
def pluck(m, d=0.3):
    t = tt(d)
    f = midi(m)
    x = saw(f, t) + 0.5 * saw(f, t, 0.006)
    env = np.exp(-t / 0.11)
    bright = np.exp(-t / 0.06)
    return (lp(x, 4400) * bright + lp(x, 900) * (1 - bright)) * env * 0.35


def bass(m, d):
    t = tt(d)
    f = midi(m)
    x = saw(f, t) * 0.6 + np.sin(2 * np.pi * f * t) * 0.8
    env = np.minimum(1, t / 0.005) * np.exp(-t / (d * 1.2))
    return lp(x, 600) * env * 0.7


def pad(notes, d, cutoff=1400):
    t = tt(d)
    x = np.zeros(len(t))
    for m in notes:
        for dt in (-0.007, 0.0, 0.006):
            x += saw(midi(m), t, dt)
    x /= len(notes) * 3
    env = np.minimum(1, t / 0.35) * np.minimum(1, (d - t) / 0.3 + 0.001)
    return lp(x, cutoff, 2) * np.clip(env, 0, 1)


def lead(m, d, prev=None):
    t = tt(d + 0.08)
    f0 = midi(prev) if prev else midi(m)
    f = midi(m) + (f0 - midi(m)) * np.exp(-t / 0.03)
    f = f * (1 + 0.006 * np.sin(2 * np.pi * 5.5 * t) * np.clip((t - 0.15) / 0.2, 0, 1))
    ph = np.cumsum(f) / SR
    x = 2 * (ph - np.floor(ph + 0.5)) + 0.5 * np.sign(np.sin(2 * np.pi * ph * 0.5 * 2))
    env = np.minimum(1, t / 0.02) * np.clip((d + 0.08 - t) / 0.08, 0, 1)
    return bp(x, 400, 3200) * env * 0.28


def bell(m):
    t = tt(1.5)
    f = midi(m)
    x = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / dd) for r, a, dd in ((1, 1, 0.8), (2.76, 0.4, 0.3), (5.4, 0.2, 0.15)))
    return x * 0.18


# ---------------------------------------------------------------- arreglo
CH = {
    'Dm': [62, 65, 69], 'Bb': [62, 65, 70], 'F': [60, 65, 69], 'C': [60, 64, 67], 'Gm': [62, 67, 70], 'A': [61, 64, 69],
}
ROOT = {'Dm': 38, 'Bb': 34, 'F': 41, 'C': 36, 'Gm': 43, 'A': 45}
BARS = ['Dm', 'Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'F', 'C', 'Dm', 'Bb', 'F', 'Gm', 'A', 'Dm']


def inr(t, *ranges):
    return any(a <= t < b for a, b in ranges)


# Intro: riser → impacto del rayo (1,0 s) → swell invertido
add(riser(1.0, 150, 7000), 0.0, 0.5, rev=0.3)
add(impact(), 1.0, 0.9, rev=0.5)
add(crash(), 1.0, 0.7, pan=0.2, rev=0.3)
sw = riser(0.7, 400, 12000)
add(sw, 1.3, 0.35, rev=0.4)

# Pads (bus con sidechain)
for b in range(1, 15):
    name = BARS[b]
    t0 = b * 2.0
    cutoff = 900 + 250 * b
    add(pad([n - 12 for n in CH[name]] + CH[name], 2.05, cutoff), t0, 0.55, rev=0.35, sc=True)

# Sub drone de apertura
add(bass(38, 8.0) * 0.8, 2.0, 0.6, sc=True)

# Bajo en corcheas
for b in range(5, 14):
    if b == 10:  # breakdown
        continue
    r = ROOT[BARS[b]]
    for i in range(4 * 2):
        t0 = b * 2.0 + i * 0.25
        if t0 >= 27:
            break
        add(bass(r + (12 if i % 2 else 0), 0.24), t0, 0.85, sc=True)

# Arpegios
pattern = [0, 1, 2, 3, 2, 1, 3, 1]
for b in list(range(1, 3)) + list(range(5, 14)):
    notes = CH[BARS[b]] + [CH[BARS[b]][0] + 12]
    for i in range(16):
        t0 = b * 2.0 + i * 0.125
        if t0 >= 27:
            break
        g = 0.35 if b < 3 else 0.55
        add(pluck(notes[pattern[i % 8]] + 12), t0, g, pan=0.35 * np.sin(i), rev=0.25, sc=True)

# Campanitas: aparición de las letras del logo (corcheas 2,5–3,3) y pentatónica
for k, m in enumerate([86, 89, 93, 91, 96, 93, 98]):
    add(bell(m), 2.5 + k * 0.125, 0.8, pan=-0.6 + k * 0.2, rev=0.6)

# Whooshes de transición
for t0 in (5.55, 9.55, 13.6, 16.8, 19.6, 23.6):
    add(whoosh(0.45), t0, 0.55, pan=0.3, rev=0.2)
# Wipes de musicales (10,0–12,5)
for k in range(6):
    add(whoosh(0.3, up=k % 2 == 0), 10.0 + k * 0.5 - 0.12, 0.35, pan=-0.5 if k % 2 else 0.5)

# Taikos: un golpe por cada dios (6,0–8,5) + remate
for k in range(6):
    add(taiko(1.0 + 0.04 * (k % 3)), 6.0 + k * 0.5, 0.95, pan=(-0.3, 0.3)[k % 2], rev=0.35)
for t0, p in ((9.0, 1.2), (9.25, 1.1), (9.5, 1.0), (9.625, 1.0), (9.75, 0.95), (9.875, 0.9)):
    add(taiko(p), t0, 0.7, rev=0.3)
add(riser(1.0, 300, 10000), 9.0, 0.45, rev=0.3)

# Batería
kicks = []
for b16 in range(int(30 / 0.125)):
    t0 = b16 * 0.125
    beat = t0 / BEAT
    on_beat = abs(beat - round(beat)) < 1e-6
    if on_beat and (inr(t0, (10, 20), (22, 26.99)) or (inr(t0, (2, 6)) and t0 % 2.0 == 0)):
        add(kick(), t0, 0.95)
        kicks.append(t0)
    if on_beat and inr(t0, (10, 20), (22, 25)) and int(round(beat)) % 2 == 1:
        add(clap(), t0, 0.6, rev=0.25)
    if inr(t0, (10, 20), (22, 25)):
        open_ = abs((t0 % BEAT) - 0.25) < 1e-6
        add(hat(open_), t0, 0.5 if open_ else 0.35, pan=0.25)
    elif inr(t0, (6, 9)) and abs((t0 % BEAT) - 0.25) < 1e-6:
        add(hat(True), t0, 0.35, pan=0.25)

# Redoble de tensión 25–27
t0 = 25.0
while t0 < 27.0:
    k = (t0 - 25) / 2
    add(snare(0.25 + 0.6 * k), t0, 0.8, pan=0.1, rev=0.2)
    t0 += 0.25 if t0 < 26 else (0.125 if t0 < 26.5 else 0.0625)
add(riser(2.0, 200, 12000), 25.0, 0.55, rev=0.3)

# Platillos
for t0 in (2.0, 10.0, 14.0, 22.0):
    add(crash(), t0, 0.55, pan=-0.2, rev=0.3)

# Blips de interfaz (callouts del producto)
for t0, m in ((15.0, 84), (15.5, 88), (16.0, 91), (17.0, 86), (18.0, 89), (19.0, 93), (20.5, 81), (21.0, 84), (21.5, 88), (24.0, 86), (24.5, 89), (25.0, 93)):
    add(blip(m), t0, 0.5, pan=0.4, rev=0.3)

# Melodía heroica 14–24
MEL = [
    (14.0, 1, 69), (14.5, 0.5, 72), (14.75, 0.5, 74), (15.0, 1, 72), (15.5, 1, 69),
    (16.0, 1.5, 67), (16.75, 0.5, 72), (17.0, 1, 76), (17.5, 1, 74),
    (18.0, 1, 74), (18.5, 1, 77), (19.0, 0.5, 76), (19.25, 0.5, 74), (19.5, 1, 69),
    (20.0, 2, 70), (21.0, 1, 74), (21.5, 1, 72),
    (22.0, 1, 72), (22.5, 1, 69), (23.0, 2, 65),
]
prev = None
for t0, beats, m in MEL:
    add(lead(m, beats * BEAT), t0, 0.75, pan=-0.1, rev=0.35)
    add(lead(m - 12, beats * BEAT), t0, 0.35, pan=0.1, rev=0.2)
    prev = m

# Final 27: impacto enorme + acorde de Re menor abierto
add(impact(True), 27.0, 1.0, rev=0.6)
add(crash(), 27.0, 0.8, rev=0.4)
add(taiko(0.9), 27.0, 0.9, rev=0.4)
add(pad([50, 57, 62, 65, 69, 74, 76], 3.0, 3000), 27.0, 0.7, rev=0.6)
add(bass(38, 3.0), 27.0, 0.9)
for k, m in enumerate([74, 77, 81, 86]):
    add(bell(m), 27.0 + k * 0.125, 0.7, pan=-0.4 + k * 0.25, rev=0.7)

# ---------------------------------------------------------------- mezcla
tvec = np.arange(N) / SR
duck = np.ones(N)
for tk in kicks:
    i = int(tk * SR)
    seg = tvec[i:i + int(0.3 * SR)] - tk
    duck[i:i + len(seg)] = np.minimum(duck[i:i + len(seg)], 1 - 0.55 * np.exp(-seg / 0.09))
L += SC * duck
R += SCR * duck

# Reverb por convolución (IR estéreo decorrelacionada)
ir_t = tt(2.4)
irl = lp(rng.standard_normal(len(ir_t)), 6000) * np.exp(-ir_t / 0.55)
irr = lp(rng.standard_normal(len(ir_t)), 6000) * np.exp(-ir_t / 0.55)
irl /= np.sqrt(np.sum(irl ** 2))
irr /= np.sqrt(np.sum(irr ** 2))
L += signal.fftconvolve(WL, irl)[:N] * 0.55
R += signal.fftconvolve(WR, irr)[:N] * 0.55

mix = np.stack([L, R], axis=1)
mix = hp(mix.T, 28).T
# fade final
fade = np.clip((DUR - tvec) / 0.8, 0, 1)
mix *= fade[:, None]
# master: compresión suave + saturación + normalización
peak = np.max(np.abs(mix))
mix = np.tanh(mix / peak * 1.4) / np.tanh(1.4)
mix *= 0.89 / np.max(np.abs(mix))

out = sys.argv[1] if len(sys.argv) > 1 else 'music.wav'
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print('ok', out, f'{DUR}s')
