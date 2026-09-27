// Renderiza el promo cuadro a cuadro y lo codifica con la música.
// Requiere el servidor de Vite en :5173.  Uso: node promo/render.mjs
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'

const FPS = 30
const WORKERS = 4
const dir = 'promo/out/frames'
rmSync(dir, { recursive: true, force: true })
mkdirSync(dir, { recursive: true })

const b = await chromium.launch()
const total = await (async () => {
  const p = await b.newPage()
  await p.goto('http://localhost:5173/promo/index.html?render')
  const d = await p.evaluate(() => window.__duration)
  await p.close()
  return Math.round(d * FPS)
})()

const t0 = Date.now()
await Promise.all(
  Array.from({ length: WORKERS }, async (_, w) => {
    const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
    await p.goto('http://localhost:5173/promo/index.html?render', { waitUntil: 'networkidle' })
    await p.evaluate(() => window.__ready)
    for (let f = w; f < total; f += WORKERS) {
      await p.evaluate((t) => window.__setT(t), f / FPS)
      await p.screenshot({ path: `${dir}/${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 93 })
      if (w === 0 && f % 120 === 0) console.log(`cuadro ${f}/${total} · ${((Date.now() - t0) / 1000).toFixed(0)} s`)
    }
  }),
)
await b.close()

const ff = execFileSync('python3', ['-c', 'import imageio_ffmpeg as f; print(f.get_ffmpeg_exe())']).toString().trim()
execFileSync(ff, [
  '-y', '-loglevel', 'error',
  '-framerate', String(FPS), '-i', `${dir}/%04d.jpg`,
  '-i', 'promo/out/music.wav',
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-profile:v', 'high',
  '-c:a', 'aac', '-b:a', '192k',
  '-movflags', '+faststart', '-shortest',
  'promo/out/epico-promo.mp4',
])
console.log('listo: promo/out/epico-promo.mp4', ((Date.now() - t0) / 1000).toFixed(0), 's')
