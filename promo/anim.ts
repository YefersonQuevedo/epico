// Utilidades de animación deterministas: todo depende solo del tiempo t (segundos).
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x))
export const lerp = (a: number, b: number, x: number) => a + (b - a) * x
export const prog = (t: number, a: number, b: number) => clamp((t - a) / (b - a))

export const ease = {
  linear: (x: number) => x,
  outCubic: (x: number) => 1 - (1 - x) ** 3,
  inCubic: (x: number) => x ** 3,
  inOutCubic: (x: number) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2),
  outExpo: (x: number) => (x >= 1 ? 1 : 1 - 2 ** (-10 * x)),
  inExpo: (x: number) => (x <= 0 ? 0 : 2 ** (10 * x - 10)),
  inOutExpo: (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 2 ** (20 * x - 10) / 2 : (2 - 2 ** (-20 * x + 10)) / 2),
  outBack: (x: number) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2,
  outElastic: (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : 2 ** (-10 * x) * Math.sin((x * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
}
export type Ease = keyof typeof ease

/** Interpola de `from` a `to` entre a y b con la curva indicada. */
export const tw = (t: number, a: number, b: number, from: number, to: number, e: Ease = 'outExpo') => lerp(from, to, ease[e](prog(t, a, b)))

/** Ruido pseudoaleatorio determinista. */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return s - Math.floor(s)
}

/** Sacudida de cámara que decae después de cada impacto. */
export function shake(t: number, hits: [number, number][]) {
  let x = 0, y = 0, r = 0
  for (const [ti, amp] of hits) {
    if (t < ti) continue
    const k = amp * Math.exp(-(t - ti) / 0.18)
    const f = Math.floor(t * 60)
    x += (hash(f + ti * 7) - 0.5) * 2 * k
    y += (hash(f * 1.3 + ti * 11) - 0.5) * 2 * k
    r += (hash(f * 0.7 + ti) - 0.5) * 0.4 * k * 0.1
  }
  return { x, y, r }
}
