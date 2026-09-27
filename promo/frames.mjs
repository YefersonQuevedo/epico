// Captura cuadros sueltos para revisión: node promo/frames.mjs 1.0 3.2 ...
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
const times = process.argv.slice(2).map(Number)
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } })
const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()))
await p.goto('http://localhost:5173/promo/index.html?render', { waitUntil: 'networkidle' })
await p.evaluate(() => window.__ready)
for (const t of times) {
  await p.evaluate((t) => window.__setT(t), t)
  await p.screenshot({ path: `promo/out/f-${t.toFixed(2)}.png` })
}
console.log('errors', errs.slice(0, 5))
await b.close()
