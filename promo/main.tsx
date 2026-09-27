import { createRoot } from 'react-dom/client'
import { flushSync } from 'react-dom'
import '@fontsource/cinzel/700.css'
import '@fontsource/cinzel/900.css'
import '@fontsource/caveat/700.css'
import '@fontsource/karla/400.css'
import '@fontsource/karla/700.css'
import '@fontsource/karla/800.css'
import '../src/index.css'
import Promo, { DURATION } from './Promo'

const root = createRoot(document.getElementById('root')!)
const render = (t: number) => flushSync(() => root.render(<Promo t={t} />))

declare global {
  interface Window { __setT: (t: number) => Promise<void>; __ready: Promise<void>; __duration: number }
}

window.__duration = DURATION
window.__setT = async (t) => { render(t) }
window.__ready = (async () => {
  render(0)
  await document.fonts.ready
  await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r }))))
})()

// Vista previa en tiempo real (sin ?render): reproduce en bucle con la música.
if (!new URLSearchParams(location.search).has('render')) {
  const audio = new Audio('./out/music.wav')
  let start = performance.now()
  document.body.addEventListener('click', () => { start = performance.now(); audio.currentTime = 0; audio.play() })
  const loop = () => {
    const t = ((performance.now() - start) / 1000) % DURATION
    render(t)
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
