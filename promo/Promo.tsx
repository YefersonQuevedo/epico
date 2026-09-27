// Promo de Épico — 30 s a 1920×1080. Todo el cuadro es función pura de t.
// Guion (120 BPM, 1 tiempo = 0,5 s):
//  0–2   Rayo: grecas, impacto y círculo de papel
//  2–6   Logo: nube, plumas, ave y letras con campanitas
//  6–10  Panteón: un dios por golpe de taiko + título
//  10–14 Musicales: barridos de color, uno por tiempo
//  14–20 Producto: navegador con el sitio real y tarjetas 3D
//  20–24 Comunidades: árbol de subcomunidades, líderes y chats + móvil
//  24–27 Mapa y cifras con redoble
//  27–30 Final: héroe, lema y llamado a la acción
import type { CSSProperties, ReactNode } from 'react'
import { ArtDefs, Bird, C, Cloud, HeroArt, Meander, MusicalIcon } from '../src/art/Art'
import { GODS, GodPortrait, SIGNS, Sign } from '../src/art/Gods'
import { MUSICALS } from '../src/lib/musicals'
import { clamp, ease, hash, lerp, prog, shake, tw } from './anim'
import homeFull from './assets/home-full.png'
import eventCard from './assets/event-card.png'
import communityCard from './assets/community-card.png'
import ticket from './assets/ticket.png'
import checkout from './assets/checkout.png'
import mobileCommunity from './assets/mobile-community.png'

export const DURATION = 30
const W = 1920
const H = 1080

const abs = (s: CSSProperties = {}): CSSProperties => ({ position: 'absolute', ...s })
const vis = (t: number, a: number, b: number) => t >= a && t < b

// ------------------------------------------------------------------ piezas
function Grain({ t }: { t: number }) {
  const f = Math.floor(t * 24)
  return (
    <div
      style={abs({
        inset: -200,
        pointerEvents: 'none',
        opacity: 0.07,
        mixBlendMode: 'multiply',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .08 0 0 0 0 .1 0 0 0 0 .3 0 0 0 .9 0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>\")",
        transform: `translate(${Math.floor(hash(f) * 200)}px, ${Math.floor(hash(f + 3) * 200)}px)`,
      })}
    />
  )
}

function Vignette() {
  return <div style={abs({ inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 62%, rgba(10,12,40,.22) 100%)' })} />
}

/** Texto con "mal registro" de serigrafía: sombra rosa desplazada. */
function Print({ children, color = C.ultra, shadow = C.cloud, off = 8, style }: { children: ReactNode; color?: string; shadow?: string; off?: number; style?: CSSProperties }) {
  return <span style={{ color, textShadow: `${off}px ${off}px 0 ${shadow}`, ...style }}>{children}</span>
}

/** Frase que aparece palabra por palabra desde una máscara. */
function Words({ text, t, at, step = 0.07, dur = 0.5, style, wordStyle }: { text: string; t: number; at: number; step?: number; dur?: number; style?: CSSProperties; wordStyle?: (i: number) => CSSProperties }) {
  const words = text.split(' ')
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', columnGap: '0.28em', ...style }}>
      {words.map((w, i) => {
        const p = ease.outExpo(prog(t, at + i * step, at + i * step + dur))
        return (
          <span key={i} style={{ display: 'inline-block', overflow: 'hidden', paddingBottom: '0.08em', verticalAlign: 'bottom' }}>
            <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 110}%) rotate(${(1 - p) * 6}deg)`, ...(wordStyle?.(i) ?? {}) }}>{w}</span>
          </span>
        )
      })}
    </div>
  )
}

function Chip({ children, bg, fg = C.paper, style }: { children: ReactNode; bg: string; fg?: string; style?: CSSProperties }) {
  return (
    <div style={{ background: bg, color: fg, padding: '14px 26px', borderRadius: '255px 18px 225px 18px / 18px 225px 18px 255px', font: '800 26px Karla', letterSpacing: '0.04em', boxShadow: `5px 5px 0 ${C.ink}`, whiteSpace: 'nowrap', ...style }}>
      {children}
    </div>
  )
}

// ------------------------------------------------------------------ escenas
function S0Bolt({ t }: { t: number }) {
  const draw = ease.inOutCubic(prog(t, 0.05, 0.9))
  const strike = ease.inExpo(prog(t, 0.72, 1.0))
  const burst = ease.outExpo(prog(t, 1.0, 1.7))
  const circle = ease.inOutExpo(prog(t, 1.35, 2.0))
  return (
    <div style={abs({ inset: 0, background: C.ink, overflow: 'hidden' })}>
      {/* grecas que se dibujan desde el centro */}
      {[-150, 150].map((y, i) => (
        <div key={y} style={abs({ left: 0, right: 0, top: H / 2 + y - 11, transform: `scaleX(${draw})`, transformOrigin: i ? '100% 50%' : '0 50%', opacity: 0.85 })}>
          <Meander color={C.feather} />
        </div>
      ))}
      <div style={abs({ left: 0, right: 0, top: H / 2 + 190, textAlign: 'center', font: '700 30px Cinzel', letterSpacing: `${tw(t, 0.2, 1.2, 1.4, 0.6)}em`, color: C.feather, opacity: tw(t, 0.2, 0.7, 0, 1) * (1 - burst * 0.6) })}>
        UNA ODISEA PARA FANS
      </div>
      {/* rayos del halo */}
      <svg viewBox="-500 -500 1000 1000" style={abs({ left: W / 2 - 700, top: H / 2 - 700, width: 1400, height: 1400, opacity: (1 - burst) * (t >= 1 ? 1 : 0), transform: `scale(${0.4 + burst * 1.4}) rotate(${burst * 30}deg)` })}>
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M0 -120V-420" stroke={i % 2 ? C.cloud : C.feather} strokeWidth="18" strokeLinecap="round" transform={`rotate(${i * 15})`} />
        ))}
      </svg>
      {/* el rayo */}
      <div
        style={abs({
          left: W / 2 - 170,
          top: H / 2 - 190,
          width: 340,
          height: 340,
          color: t >= 1.0 && t < 1.12 ? C.paper : C.feather,
          transform: `translateY(${(1 - strike) * -900}px) scale(${1 + (t > 1 ? Math.exp(-(t - 1) / 0.1) * 0.35 : 0)})`,
          filter: `drop-shadow(0 0 ${t > 1 ? 60 * Math.exp(-(t - 1) / 0.4) : 0}px ${C.feather})`,
        })}
      >
        <Sign id="bolt" className="size-full" />
      </div>
      {/* destello */}
      <div style={abs({ inset: 0, background: C.paper, opacity: t >= 1 ? Math.exp(-(t - 1) / 0.08) : 0 })} />
      {/* círculo de papel que abre la siguiente escena */}
      <div style={abs({ inset: 0, background: C.paper, clipPath: `circle(${circle * 1200}px at 50% 50%)` })} />
    </div>
  )
}

function S1Logo({ t }: { t: number }) {
  const cloud = ease.outBack(prog(t, 2.0, 2.7))
  const zoom = ease.inExpo(prog(t, 5.45, 6.0))
  const letters = 'ÉPICO'.split('')
  const angles = [-62, -44, -26, -8, 10, 28, 46]
  // trayectoria del ave: entra volando y aterriza a la izquierda del logo
  const bp = ease.inOutCubic(prog(t, 2.1, 3.7))
  const bx = lerp(-300, 300, bp)
  const by = 420 + Math.sin(bp * Math.PI * 2) * 90 * (1 - bp)
  const under = ease.inOutCubic(prog(t, 3.3, 3.9))
  return (
    <div style={abs({ inset: 0, background: C.paper, overflow: 'hidden' })}>
      <div style={abs({ inset: 0, transform: `scale(${1 + zoom * 7})`, transformOrigin: '1125px 520px', opacity: 1 - prog(t, 5.8, 6.0) })}>
        {/* plumas en abanico */}
        <svg viewBox="0 0 800 500" style={abs({ left: W / 2 - 400, top: -70, width: 800, height: 500 })}>
          {angles.map((a, i) => {
            const p = ease.outBack(prog(t, 2.15 + i * 0.06, 2.75 + i * 0.06))
            return <use key={a} href="#feather" x="362" y="90" width="76" height="280" preserveAspectRatio="none" transform={`translate(400 370) rotate(${a * p}) scale(${Math.max(0.001, p)}) translate(-400 -370)`} />
          })}
        </svg>
        {/* nube */}
        <div style={abs({ left: W / 2 - 560, top: 250, width: 1120, transform: `scale(${cloud}) rotate(${(1 - cloud) * -8}deg)`, transformOrigin: '50% 60%' })}>
          <Cloud style={{ width: '100%' }} />
        </div>
        {/* letras */}
        <div style={abs({ left: 0, right: 0, top: 360, display: 'flex', justifyContent: 'center', gap: 10, paddingLeft: 140 })}>
          {letters.map((l, i) => {
            const a = 2.5 + i * 0.125
            const p = ease.outBack(prog(t, a, a + 0.45))
            return (
              <span key={i} style={{ display: 'inline-block', font: '900 250px/1 Cinzel', transform: `translateY(${(1 - p) * -260}px) rotate(${(1 - p) * (i % 2 ? 18 : -18)}deg)`, opacity: prog(t, a, a + 0.08) }}>
                <Print off={10}>{l}</Print>
              </span>
            )
          })}
        </div>
        {/* pincelada */}
        <svg viewBox="0 0 900 40" style={abs({ left: W / 2 - 330, top: 640, width: 900, height: 40 })}>
          <path d="M6 28C200 6 520 4 894 18" stroke={C.feather} strokeWidth="14" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - under} />
        </svg>
        {/* ave */}
        <div style={abs({ left: bx, top: by, width: 230, transform: `rotate(${(1 - bp) * -14 + Math.sin(t * 9) * 3 * (1 - bp)}deg)` })}>
          <Bird flip style={{ width: '100%' }} />
        </div>
        <div style={abs({ left: 0, right: 0, top: 720, textAlign: 'center', font: '800 30px Karla', letterSpacing: `${tw(t, 4.0, 4.9, 1.1, 0.32)}em`, color: C.ink, opacity: tw(t, 4.0, 4.4, 0, 1) })}>
          LA CASA DE LOS FANS DE LOS MUSICALES
        </div>
        <div style={abs({ left: 0, right: 0, top: 780, textAlign: 'center', font: '700 46px Caveat', color: C.terra, opacity: tw(t, 4.4, 4.8, 0, 1), transform: `translateY(${tw(t, 4.4, 5, 20, 0)}px)` })}>
          fans · comunidades · boletas
        </div>
        {/* signos orbitando */}
        {(['trident', 'owl', 'lyre', 'laurel', 'eye', 'ship'] as const).map((s, i) => {
          const p = ease.outBack(prog(t, 3.0 + i * 0.1, 3.5 + i * 0.1))
          const ang = (i / 6) * Math.PI * 2 + t * 0.35
          return (
            <div key={s} style={abs({ left: W / 2 + Math.cos(ang) * 820 - 40, top: 470 + Math.sin(ang) * 400 - 40, width: 80, height: 80, color: i % 2 ? C.feather : C.cloudDeep, transform: `scale(${p}) rotate(${t * 20}deg)` })}>
              <Sign id={s} className="size-full" />
            </div>
          )
        })}
      </div>
      <div style={abs({ inset: 0, background: C.ink, opacity: prog(t, 5.75, 6.0) })} />
    </div>
  )
}

function S2Pantheon({ t }: { t: number }) {
  const pw = W / 6
  const push = tw(t, 6, 10, 1, 1.07, 'linear')
  const title = prog(t, 8.95, 9.4)
  return (
    <div style={abs({ inset: 0, background: C.ink, overflow: 'hidden' })}>
      <div style={abs({ inset: 0, transform: `scale(${push})` })}>
        {GODS.map((g, i) => {
          const a = 6.0 + i * 0.5
          const p = ease.outExpo(prog(t, a, a + 0.22))
          const out = ease.inExpo(prog(t, 9.55 + i * 0.05, 9.95))
          const dir = i % 2 ? 1 : -1
          const y = (1 - p) * dir * -1200 + out * dir * 1300
          const label = ease.outExpo(prog(t, a + 0.12, a + 0.5))
          return (
            <div key={g.id} style={abs({ left: i * pw - 60, top: -20, width: pw + 120, height: H + 40, transform: `translateY(${y}px)`, clipPath: 'polygon(20% 0, 100% 0, 80% 100%, 0 100%)' })}>
              <GodPortrait id={g.id} style={{ width: '100%', height: '100%', transform: `scale(${1.15 - p * 0.15 + (t - a) * 0.01})` }} />
              <div style={abs({ inset: 0, background: 'linear-gradient(to top, rgba(20,26,77,.92), transparent 45%)' })} />
              <div style={abs({ left: '24%', right: '10%', bottom: 90, opacity: label, transform: `translateY(${(1 - label) * 30}px)` })}>
                <div style={{ font: '900 50px Cinzel', color: C.paper }}>{g.name}</div>
                <div style={{ font: '800 16px Karla', letterSpacing: '0.2em', color: C.feather, textTransform: 'uppercase' }}>{g.saga}</div>
              </div>
              {/* destello de golpe */}
              <div style={abs({ inset: 0, background: C.paper, opacity: t >= a ? Math.exp(-(t - a) / 0.06) * 0.7 : 0 })} />
            </div>
          )
        })}
      </div>
      {/* título */}
      <div style={abs({ left: 0, right: 0, top: 380, height: 320, background: C.ink, transform: `scaleY(${ease.outExpo(title) * (1 - ease.inExpo(prog(t, 9.6, 9.95)))})`, display: 'grid', placeItems: 'center' })}>
        <div style={{ textAlign: 'center', transform: `scale(${tw(t, 8.95, 10, 1.25, 1, 'outCubic')})`, opacity: title }}>
          <div style={{ font: '700 44px Caveat', color: C.feather }}>los dioses están mirando</div>
          <div style={{ font: '900 128px/1 Cinzel', color: C.paper, letterSpacing: '0.02em' }}>
            <Print color={C.paper} shadow={C.terra} off={7}>EL OLIMPO CANTA CONTIGO</Print>
          </div>
        </div>
      </div>
    </div>
  )
}

function S3Musicals({ t }: { t: number }) {
  const outro = ease.inOutExpo(prog(t, 13.55, 14.0))
  return (
    <div style={abs({ inset: 0, background: C.ink, overflow: 'hidden' })}>
      {MUSICALS.map((m, k) => {
        const a = 10.0 + k * 0.5
        if (t < a - 0.12) return null
        const wipe = ease.outExpo(prog(t, a - 0.12, a + 0.18))
        const dir = k % 2 === 0
        const clip = dir
          ? `polygon(${-30 + wipe * 130}% 0, ${-30 + wipe * 130 + 30}% 0, ${-30 + wipe * 130}% 100%, ${-60 + wipe * 130}% 100%)`
          : ''
        const full = wipe >= 1
        const local = t - a + 0.12
        const name = ease.outExpo(prog(t, a - 0.12, a + 0.22))
        return (
          <div
            key={m.id}
            style={abs({
              inset: 0,
              background: m.color,
              color: m.fg,
              clipPath: full ? 'none' : dir ? `polygon(0 0, ${wipe * 130}% 0, ${wipe * 130 - 30}% 100%, 0 100%)` : `polygon(${100 - wipe * 130}% 0, 100% 0, 100% 100%, ${130 - wipe * 130}% 100%)`,
            })}
            data-clip={clip}
          >
            <div style={abs({ right: -80, top: 60, width: 960, height: 960, opacity: 0.22, transform: `rotate(${-8 + local * 12}deg) scale(${1.1 - name * 0.1})` })}>
              <MusicalIcon id={m.id} className="size-full" />
            </div>
            <div style={abs({ left: 150, top: 300, width: 220, height: 220, transform: `scale(${ease.outBack(prog(t, a - 0.12, a + 0.25))}) rotate(${(1 - name) * -40}deg)` })}>
              <MusicalIcon id={m.id} className="size-full" />
            </div>
            <div style={abs({ left: 150, top: 560, transform: `translateX(${(1 - name) * 400}px)`, opacity: name })}>
              <div style={{ font: '700 54px Caveat', opacity: 0.9 }}>{m.tagline}</div>
              <div style={{ font: '900 150px/1 Cinzel', whiteSpace: 'nowrap', textShadow: `8px 8px 0 ${k % 2 ? C.ink : C.cloudDeep}40` }}>{m.name}</div>
            </div>
            <div style={abs({ right: 120, bottom: 80, font: '900 60px Cinzel', opacity: 0.5 })}>0{k + 1}<span style={{ fontSize: 30 }}> / 06</span></div>
          </div>
        )
      })}
      {/* rejilla: 6 musicales, 1 comunidad */}
      {t >= 13.0 && (
        <div style={abs({ inset: 0, background: C.paper, clipPath: `circle(${ease.outExpo(prog(t, 13.0, 13.35)) * 1300}px at 50% 50%)` })}>
          <div style={abs({ left: 0, right: 0, top: 190, display: 'flex', justifyContent: 'center', gap: 28 })}>
            {MUSICALS.map((m, i) => {
              const p = ease.outBack(prog(t, 13.05 + i * 0.05, 13.4 + i * 0.05))
              return (
                <div key={m.id} style={{ width: 230, height: 300, background: m.color, color: m.fg, borderRadius: '20px 200px 20px 180px / 180px 20px 200px 20px', display: 'grid', placeItems: 'center', transform: `translateY(${(1 - p) * 200}px) scale(${p}) rotate(${(i - 2.5) * 3}deg)`, boxShadow: `7px 7px 0 ${C.ink}` }}>
                  <MusicalIcon id={m.id} className="size-32" />
                </div>
              )
            })}
          </div>
          <div style={abs({ left: 0, right: 0, top: 620, textAlign: 'center' })}>
            <Words text="6 musicales. Una sola comunidad." t={t} at={13.15} step={0.05} style={{ justifyContent: 'center', font: '900 96px Cinzel', color: C.ultra }} />
          </div>
        </div>
      )}
      <div style={abs({ inset: 0, background: C.paper, clipPath: `inset(${(1 - outro) * 100}% 0 0 0)` })} />
    </div>
  )
}

function BrowserFrame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{ background: C.paper, borderRadius: 22, overflow: 'hidden', boxShadow: `18px 18px 0 ${C.ultra}, 0 40px 80px rgba(20,26,77,.35)`, border: `3px solid ${C.ink}`, ...style }}>
      <div style={{ height: 48, background: '#ebe1cd', display: 'flex', alignItems: 'center', gap: 10, padding: '0 20px', borderBottom: `2px solid ${C.ink}22` }}>
        {[C.terra, C.feather, C.soft].map((c) => <span key={c} style={{ width: 16, height: 16, borderRadius: 99, background: c }} />)}
        <div style={{ marginLeft: 20, flex: 1, height: 28, borderRadius: 99, background: C.paper, font: '700 16px Karla', color: C.ink, display: 'flex', alignItems: 'center', padding: '0 16px', opacity: 0.8 }}>🔒 epico.co</div>
      </div>
      <div style={{ position: 'relative', overflow: 'hidden', height: 'calc(100% - 48px)' }}>{children}</div>
    </div>
  )
}

function S4Product({ t }: { t: number }) {
  const enter = ease.outExpo(prog(t, 14.0, 14.8))
  const leave = ease.inExpo(prog(t, 16.75, 17.25))
  const scroll = ease.inOutCubic(prog(t, 14.5, 16.9))
  const bw = 1300
  const scale = bw / 2160
  const callouts = [
    { at: 15.0, text: 'Sing-alongs', bg: C.ultra },
    { at: 15.5, text: 'Watch parties', bg: C.terra },
    { at: 16.0, text: 'Noches de cosplay', bg: C.feather, fg: C.ink },
  ]
  // constelación de tarjetas 17–20
  const heads = [
    { at: 17.0, text: 'Eventos en cualquier ciudad', focus: 0 },
    { at: 18.0, text: 'Boletas con QR al instante', focus: 1 },
    { at: 19.0, text: 'Paga con tarjeta, PSE o Nequi', focus: 2 },
  ]
  const cur = t >= 19 ? 2 : t >= 18 ? 1 : 0
  const cards = [
    { src: eventCard, w: 380, x: 930, y: 130, r: -6 },
    { src: ticket, w: 640, x: 900, y: 720, r: 3 },
    { src: checkout, w: 500, x: 1360, y: 100, r: 3, crop: true },
    { src: communityCard, w: 320, x: 1560, y: 560, r: -4 },
  ]
  const cardsIn = t >= 16.9
  const exit = ease.inExpo(prog(t, 19.6, 20.0))
  return (
    <div style={abs({ inset: 0, background: C.paper, overflow: 'hidden', perspective: 2200 })}>
      <div style={abs({ left: -40, right: -40, top: 60, opacity: 0.25, transform: `translateX(${-t * 40}px)` })}><Meander /></div>
      <div style={abs({ left: -40, right: -40, bottom: 60, opacity: 0.25, transform: `translateX(${t * 40 - 600}px)` })}><Meander /></div>
      {!cardsIn || leave < 1 ? (
        <div
          style={abs({
            left: (W - bw) / 2 - 140,
            top: 200,
            width: bw,
            height: 800,
            transform: `translate3d(${(1 - enter) * 300 - leave * 1400}px, ${(1 - enter) * 500}px, ${-leave * 800}px) rotateY(${lerp(-28, -9, enter) - leave * 30}deg) rotateX(${lerp(22, 5, enter)}deg)`,
            transformStyle: 'preserve-3d',
          })}
        >
          <BrowserFrame style={{ width: '100%', height: '100%' }}>
            <img src={homeFull} style={{ width: bw, display: 'block', transform: `translateY(${-scroll * 4600 * scale * 1.0}px)` }} />
          </BrowserFrame>
        </div>
      ) : null}
      {callouts.map((c) => {
        const p = ease.outBack(prog(t, c.at, c.at + 0.35))
        const o = 1 - ease.inExpo(prog(t, 16.7, 17.0))
        return (
          <div key={c.text} style={abs({ left: 1480, top: 300 + (c.at - 15) * 260, transform: `scale(${p}) rotate(${(c.at * 7) % 6 - 3}deg)`, opacity: o })}>
            <Chip bg={c.bg} fg={c.fg}>{c.text}</Chip>
          </div>
        )
      })}
      <div style={abs({ left: 120, top: 60, opacity: 1 - prog(t, 16.7, 16.9) })}>
        <Words text="Todo tu fandom en un solo lugar" t={t} at={14.3} step={0.06} style={{ font: '900 60px Cinzel', color: C.ultra, width: 1400 }} />
      </div>
      {cardsIn && (
        <>
          {cards.map((c, i) => {
            const a = 16.95 + i * 0.1
            const p = ease.outExpo(prog(t, a, a + 0.6))
            const focus = i === heads[cur].focus || (cur === 0 && i === 3)
            const f = ease.outCubic(prog(t, heads[cur].at, heads[cur].at + 0.3))
            const orbit = Math.sin(t * 1.2 + i) * 14
            const sc = focus ? lerp(0.92, 1.08, f) : lerp(1, 0.9, f)
            return (
              <div
                key={i}
                style={abs({
                  left: c.x,
                  top: c.y,
                  width: c.w,
                  zIndex: focus ? 5 : 1,
                  transform: `translate3d(${(1 - p) * 900 + exit * (i % 2 ? 1400 : -1400)}px, ${orbit + (1 - p) * 200}px, ${(1 - p) * -900}px) rotateY(${(1 - p) * -60 + orbit * 0.3}deg) rotate(${c.r}deg) scale(${sc})`,
                  filter: focus ? 'none' : `saturate(${lerp(1, 0.6, f)})`,
                  opacity: focus ? 1 : lerp(1, 0.75, f),
                  boxShadow: `10px 10px 0 ${focus ? C.terra : C.ink}`,
                  borderRadius: 18,
                  overflow: 'hidden',
                })}
              >
                {c.crop ? (
                  <div style={{ width: c.w, height: c.w * 1.02, overflow: 'hidden', background: C.paper }}>
                    <img src={c.src} style={{ width: c.w * (2160 / 930), maxWidth: 'none', transform: `translate(${-c.w * (250 / 930)}px, ${-c.w * (215 / 930)}px)` }} />
                  </div>
                ) : (
                  <img src={c.src} style={{ width: '100%', display: 'block' }} />
                )}
              </div>
            )
          })}
          {heads.map((h, i) => {
            const on = vis(t, h.at, h.at + 1)
            if (!on) return null
            return (
              <div key={h.text} style={abs({ left: 120, top: 330, width: 760, opacity: 1 - exit })}>
                <div style={{ font: '700 44px Caveat', color: C.terra, opacity: prog(t, h.at, h.at + 0.2) }}>0{i + 1} · {['eventos', 'boletería', 'pagos'][i]}</div>
                <Words text={h.text} t={t} at={h.at + 0.05} step={0.05} dur={0.38} style={{ font: '900 76px/1.08 Cinzel', color: C.ultra }} />
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}

function S5Community({ t }: { t: number }) {
  const inn = ease.outExpo(prog(t, 19.95, 20.5))
  const node = { x: 420, y: 470 }
  const subs = [
    { name: 'Ithaca Norte · Usaquén', x: 900, y: 330, at: 20.5 },
    { name: 'Coro de Sirenas', x: 900, y: 560, at: 20.7 },
  ]
  const leaders = [
    { i: 'VR', c: C.cloud, x: 880, y: 800, at: 21.0 },
    { i: 'SO', c: C.feather, x: 990, y: 830, at: 21.12 },
    { i: 'LM', c: C.cloud, x: 1100, y: 800, at: 21.24 },
    { i: 'MC', c: C.feather, x: 1210, y: 830, at: 21.36 },
  ]
  const chats = [
    { label: 'WhatsApp', bg: '#1f8f4e', at: 21.5 },
    { label: 'Discord', bg: '#4f55c9', at: 21.62 },
    { label: 'Telegram', bg: '#2a8bc2', at: 21.74 },
  ]
  const phone = ease.outExpo(prog(t, 20.8, 21.6))
  const scroll = ease.inOutCubic(prog(t, 21.8, 23.4))
  const out = ease.inOutExpo(prog(t, 23.55, 24.0))
  return (
    <div style={abs({ inset: 0, background: '#ebe1cd', overflow: 'hidden', clipPath: `circle(${inn * 2100}px at 20% 50%)` })}>
      <div style={abs({ left: -120, top: -80, width: 700, opacity: 0.5, transform: `translateX(${t * 10}px)` })}><Cloud style={{ width: '100%' }} /></div>
      <div style={abs({ left: 110, top: 70 })}>
        <div style={{ font: '700 44px Caveat', color: C.terra, opacity: prog(t, 20.1, 20.4) }}>tu tribu te espera</div>
        <Words text="Crea tu comunidad" t={t} at={20.15} style={{ font: '900 84px Cinzel', color: C.ultra }} />
        <div style={{ font: '700 28px Karla', color: C.ink, opacity: tw(t, 20.6, 21, 0, 0.75), marginTop: 6 }}>Subgrupos, líderes con sus números y chats — todo queda registrado.</div>
      </div>
      {/* ramas */}
      <svg width={W} height={H} style={abs({ inset: 0 })}>
        {subs.map((s) => (
          <path key={s.name} d={`M${node.x + 365} ${node.y + 20} C ${node.x + 440} ${node.y + 20}, ${s.x - 120} ${s.y + 40}, ${s.x} ${s.y + 40}`} stroke={C.ultra} strokeWidth="6" fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - ease.inOutCubic(prog(t, s.at - 0.25, s.at + 0.1))} strokeLinecap="round" />
        ))}
        <path d={`M${node.x + 170} ${node.y + 130} C ${node.x + 190} 840, 760 850, 850 845`} stroke={C.terra} strokeWidth="6" fill="none" strokeDasharray="1" pathLength={1} strokeDashoffset={1 - ease.inOutCubic(prog(t, 20.75, 21.05))} strokeLinecap="round" />
      </svg>
      <div style={abs({ left: node.x, top: node.y - 90, width: 360, transform: `scale(${ease.outBack(prog(t, 20.2, 20.6))}) rotate(-3deg)`, boxShadow: `10px 10px 0 ${C.ink}`, borderRadius: 18, overflow: 'hidden' })}>
        <img src={communityCard} style={{ width: '100%', display: 'block' }} />
      </div>
      {subs.map((s) => {
        const p = ease.outBack(prog(t, s.at, s.at + 0.4))
        return (
          <div key={s.name} style={abs({ left: s.x, top: s.y, transform: `scale(${p})`, transformOrigin: '0 50%' })}>
            <div style={{ background: C.ultra, color: C.paper, padding: '18px 30px', borderRadius: '20px 200px 20px 180px / 180px 20px 200px 20px', boxShadow: `6px 6px 0 ${C.feather}` }}>
              <div style={{ font: '800 14px Karla', letterSpacing: '0.2em', opacity: 0.75 }}>SUBCOMUNIDAD</div>
              <div style={{ font: '900 34px Cinzel' }}>{s.name}</div>
            </div>
          </div>
        )
      })}
      {leaders.map((l) => {
        const p = ease.outElastic(prog(t, l.at, l.at + 0.7))
        return (
          <div key={l.i} style={abs({ left: l.x, top: l.y, width: 96, height: 96, borderRadius: 99, background: l.c, border: `4px solid ${C.ink}`, display: 'grid', placeItems: 'center', font: '900 34px Cinzel', color: C.ink, transform: `scale(${p})` })}>
            {l.i}
          </div>
        )
      })}
      <div style={abs({ left: 880, top: 930, font: '800 18px Karla', letterSpacing: '0.2em', color: C.terra, opacity: prog(t, 21.2, 21.5) })}>LÍDERES</div>
      {chats.map((c, i) => {
        const p = ease.outExpo(prog(t, c.at, c.at + 0.4))
        return (
          <div key={c.label} style={abs({ left: 110 + i * 230, top: 930, transform: `translateY(${(1 - p) * 200}px) rotate(${(i - 1) * 4 * (1 - p)}deg)`, opacity: p })}>
            <Chip bg={c.bg}>{c.label}</Chip>
          </div>
        )
      })}
      {/* móvil */}
      <div style={abs({ left: 1440, top: 120, width: 380, height: 800, transform: `translateY(${(1 - phone) * 1000}px) rotate(${4 - phone * 2}deg)` })}>
        <div style={{ width: '100%', height: '100%', borderRadius: 56, background: C.ink, padding: 14, boxShadow: `14px 14px 0 ${C.terra}` }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', position: 'relative', background: C.paper }}>
            <img src={mobileCommunity} style={{ width: '100%', display: 'block', transform: `translateY(${-scroll * 60}px)` }} />
            <div style={abs({ top: 10, left: '50%', width: 110, height: 28, marginLeft: -55, borderRadius: 99, background: C.ink })} />
          </div>
        </div>
      </div>
      <div style={abs({ inset: 0, background: C.ultra, clipPath: `polygon(0 0, ${out * 140}% 0, ${out * 140 - 40}% 100%, 0 100%)` })} />
    </div>
  )
}

// Contorno simplificado de Colombia (lat, lng)
const COL: [number, number][] = [
  [12.4, -71.7], [11.1, -74.2], [10.4, -75.5], [9.0, -76.3], [8.6, -77.4], [7.2, -77.9], [5.5, -77.5], [3.8, -77.3], [2.5, -78.4], [1.4, -79.0],
  [0.8, -77.7], [0.3, -76.0], [-0.2, -74.8], [-1.0, -73.5], [-2.4, -72.0], [-4.2, -69.9], [-1.0, -69.4], [1.2, -69.8], [1.7, -67.3], [2.2, -67.5],
  [4.0, -67.8], [6.2, -67.4], [6.3, -69.4], [7.0, -70.1], [7.5, -72.4], [8.3, -72.4], [9.1, -72.9], [11.0, -72.7], [11.8, -71.3],
]
// nombre, lat, lng, desplazamiento de la etiqueta (dx, dy)
const CITIES: [string, number, number, number, number][] = [
  ['Barranquilla', 10.99, -74.8, 26, -22], ['Bucaramanga', 7.12, -73.12, 26, -22], ['Medellín', 6.24, -75.58, -150, -30], ['Pereira', 4.81, -75.69, -130, -26],
  ['Bogotá', 4.61, -74.08, 26, -10], ['Ibagué', 4.44, -75.23, -40, 40], ['Cali', 3.45, -76.53, -80, 30],
]

function S6Map({ t }: { t: number }) {
  const k = 52
  const ox = 1000, oy = 80
  const P = (lat: number, lng: number) => [ox + (lng + 79.2) * k, oy + (12.6 - lat) * k] as const
  const outline = COL.map(([a, b], i) => `${i ? 'L' : 'M'}${P(a, b).join(' ')}`).join(' ') + 'Z'
  const draw = ease.inOutCubic(prog(t, 23.9, 24.6))
  const build = prog(t, 25.0, 27.0)
  const zoom = 1 + ease.inExpo(build) * 0.12
  const stats: [string, number][] = [['eventos', 10], ['ciudades', 7], ['comunidades', 11], ['fans', 4659]]
  return (
    <div style={abs({ inset: 0, background: C.ultra, overflow: 'hidden' })}>
      <svg viewBox="-500 -500 1000 1000" style={abs({ left: 1300 - 900, top: 540 - 900, width: 1800, height: 1800, opacity: 0.12 + build * 0.25, transform: `rotate(${t * 12 + build * 90}deg)` })}>
        {Array.from({ length: 36 }, (_, i) => <path key={i} d="M0 -160V-500" stroke={C.paper} strokeWidth="14" transform={`rotate(${i * 10})`} />)}
      </svg>
      <div style={abs({ inset: 0, transform: `scale(${zoom})` })}>
        <svg width={W} height={H} style={abs({ inset: 0 })}>
          <defs>
            <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle cx="7" cy="7" r="2.6" fill={C.feather} opacity=".55" /></pattern>
          </defs>
          <path d={outline} fill="url(#dots)" stroke={C.feather} strokeWidth="5" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} opacity={0.35 + draw * 0.65} />
          {CITIES.map(([name, la, ln, dx, dy], i) => {
            const [x, y] = P(la, ln)
            const a = 24.2 + i * 0.12
            const p = ease.outBack(prog(t, a, a + 0.35))
            const ring = prog(t, a + 0.1, a + 0.9)
            return (
              <g key={name}>
                <circle cx={x} cy={y} r={10 + ring * 60} fill="none" stroke={C.cloud} strokeWidth="3" opacity={(1 - ring) * (t > a ? 1 : 0)} />
                <g transform={`translate(${x} ${y - (1 - p) * 120}) scale(${p})`}>
                  <path d="M0 0C-12-17-19-26-19-36a19 19 0 0 1 38 0c0 10-7 19-19 36z" fill={C.cloud} stroke={C.ink} strokeWidth="3" />
                  <circle cy="-36" r="7" fill={C.paper} />
                </g>
                <text x={x + dx} y={y + dy} fill={C.paper} opacity={prog(t, a + 0.15, a + 0.4)} style={{ font: '800 26px Karla' }}>{name}</text>
              </g>
            )
          })}
        </svg>
        <div style={abs({ left: 130, top: 150 })}>
          <div style={{ font: '700 50px Caveat', color: C.feather, opacity: prog(t, 24.0, 24.3) }}>de Barranquilla a Ibagué</div>
          <Words text="Cada ciudad, su odisea" t={t} at={24.05} style={{ font: '900 78px Cinzel', color: C.paper, width: 820 }} />
          <div style={{ marginTop: 50, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px 60px' }}>
            {stats.map(([label, n], i) => {
              const a = 24.35 + i * 0.15
              const v = Math.round(n * ease.outExpo(prog(t, a, a + 1.1)))
              return (
                <div key={label} style={{ borderLeft: `8px solid ${C.feather}`, paddingLeft: 22, opacity: prog(t, a, a + 0.2) }}>
                  <div style={{ font: '900 96px/1 Cinzel', color: C.feather }}>{v.toLocaleString('es-CO')}</div>
                  <div style={{ font: '800 22px Karla', letterSpacing: '0.2em', color: C.paper, textTransform: 'uppercase' }}>{label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* acumulación hacia el impacto */}
      <div style={abs({ inset: 0, background: C.paper, opacity: ease.inExpo(prog(t, 26.6, 27.0)) })} />
    </div>
  )
}

function S7Finale({ t }: { t: number }) {
  const slam = ease.outExpo(prog(t, 27.0, 27.5))
  const end = ease.inOutCubic(prog(t, 29.45, 30.0))
  return (
    <div style={abs({ inset: 0, background: C.paper, overflow: 'hidden' })}>
      <div style={abs({ left: -200, top: 20, width: 600, opacity: 0.55, transform: `translateX(${(t - 27) * 30}px)` })}><Cloud style={{ width: '100%' }} /></div>
      <div style={abs({ right: 40, top: 20, width: 900, height: 840, transform: `scale(${lerp(1.5, 1, slam)}) rotate(${(1 - slam) * 6}deg)`, transformOrigin: '60% 60%' })}>
        <HeroArt style={{ width: '100%', height: '100%' }} />
      </div>
      <div style={abs({ left: 130, top: 170, width: 1000 })}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, opacity: prog(t, 27.1, 27.4), transform: `translateY(${tw(t, 27.1, 27.6, -40, 0)}px)` }}>
          <Bird style={{ width: 110 }} />
          <span style={{ font: '900 64px Cinzel', letterSpacing: '0.12em', color: C.ultra }}>ÉPICO</span>
        </div>
        <Words
          text="Cada ciudad merece su propia odisea"
          t={t}
          at={27.3}
          step={0.09}
          style={{ font: '900 104px/1.02 Cinzel', color: C.ultra, marginTop: 30 }}
          wordStyle={(i) => (i === 5 ? { color: C.terra, textShadow: `6px 6px 0 ${C.feather}` } : {})}
        />
        <div style={{ marginTop: 50, display: 'flex', gap: 24, alignItems: 'center', transform: `scale(${ease.outBack(prog(t, 28.3, 28.75))})`, transformOrigin: '0 50%' }}>
          <div style={{ background: C.ultra, color: C.paper, font: '800 36px Karla', padding: '22px 44px', borderRadius: '255px 18px 225px 18px / 18px 225px 18px 255px', boxShadow: `6px 6px 0 ${C.cloud}` }}>Únete a la odisea →</div>
          <div style={{ font: '800 38px Karla', color: C.ink }}>epico.co</div>
        </div>
      </div>
      <div style={abs({ left: 0, right: 0, bottom: 60, display: 'flex', justifyContent: 'center', gap: 46, color: C.feather })}>
        {SIGNS.map((s, i) => {
          const p = ease.outBack(prog(t, 28.5 + i * 0.05, 28.9 + i * 0.05))
          return <div key={s} style={{ width: 56, height: 56, transform: `scale(${p}) translateY(${Math.sin(t * 3 + i) * 4}px)` }}><Sign id={s} className="size-full" /></div>
        })}
      </div>
      <div style={abs({ left: 0, right: 0, bottom: 20, textAlign: 'center', font: '700 14px Karla', color: C.ink, opacity: 0.45 * prog(t, 28.8, 29.2) })}>
        Proyecto de fans · sin afiliación con los creadores de los musicales mencionados
      </div>
      <div style={abs({ inset: 0, background: C.paper, opacity: t >= 27 ? Math.exp(-(t - 27) / 0.1) : 0 })} />
      <div style={abs({ inset: 0, background: C.ink, opacity: end })} />
    </div>
  )
}

export default function Promo({ t }: { t: number }) {
  const s = shake(t, [[1.0, 26], [6.0, 8], [6.5, 8], [7.0, 8], [7.5, 8], [8.0, 8], [8.5, 8], [10.0, 6], [14.0, 5], [27.0, 34]])
  const buildShake = t > 25 && t < 27 ? (hash(Math.floor(t * 60)) - 0.5) * 2 * prog(t, 25, 27) * 6 : 0
  return (
    <div style={{ width: W, height: H, position: 'relative', overflow: 'hidden', background: C.ink }}>
      <style>{'*{animation:none!important;transition:none!important}'}</style>
      <ArtDefs />
      <div style={abs({ inset: 0, transform: `translate(${s.x + buildShake}px, ${s.y}px) rotate(${s.r}deg)` })}>
        {vis(t, 0, 2.0) && <S0Bolt t={t} />}
        {vis(t, 2.0, 6.0) && <S1Logo t={t} />}
        {vis(t, 6.0, 10.0) && <S2Pantheon t={t} />}
        {vis(t, 10.0, 14.0) && <S3Musicals t={t} />}
        {vis(t, 14.0, 20.0) && <S4Product t={t} />}
        {vis(t, 19.95, 24.0) && <S5Community t={t} />}
        {vis(t, 24.0, 27.0) && <S6Map t={t} />}
        {vis(t, 27.0, 30.01) && <S7Finale t={t} />}
      </div>
      <Grain t={t} />
      <Vignette />
      {/* progreso sutil */}
      <div style={abs({ left: 0, bottom: 0, height: 5, width: `${clamp(t / DURATION) * 100}%`, background: C.feather, opacity: 0.8 })} />
    </div>
  )
}
