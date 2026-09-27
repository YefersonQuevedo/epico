import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, MessageCircle, Send, Users } from 'lucide-react'
import clsx from 'clsx'
import { toast } from 'sonner'
import { MusicalIcon } from '../art/Art'
import { Sign } from '../art/Gods'
import { dayNum, fmtDate, money, monthShort } from '../lib/format'
import { musicalById } from '../lib/musicals'
import { useStore } from '../lib/store'
import type { Community, FanEvent, SocialLinks as Links } from '../lib/types'

export const FEE_RATE = 0.05

export function SectionTitle({ kicker, title, children, align = 'left' }: { kicker: string; title: ReactNode; children?: ReactNode; align?: 'left' | 'center' }) {
  return (
    <div className={clsx('mb-10', align === 'center' && 'mx-auto max-w-2xl text-center')}>
      <p className={clsx('kicker flex items-center gap-2', align === 'center' && 'justify-center')}>
        <Sign id="laurel" className="size-6 text-feather" /> {kicker}
      </p>
      <h2 className="h-display mt-1 text-4xl text-ultra sm:text-5xl">{title}</h2>
      {children && <p className="mt-4 text-lg text-ink/70">{children}</p>}
    </div>
  )
}

export function PageHeader({ kicker, title, children, art }: { kicker: string; title: ReactNode; children?: ReactNode; art?: ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b-2 border-ink/10 bg-paper-2/60">
      <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-14 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <p className="kicker">{kicker}</p>
          <h1 className="h-display mt-1 text-4xl text-ultra sm:text-6xl">{title}</h1>
          {children && <div className="mt-4 max-w-2xl text-lg text-ink/70">{children}</div>}
        </div>
        {art && <div className="hidden md:block">{art}</div>}
      </div>
    </section>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  )
}

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.6 1.2a18.3 18.3 0 0 0-5.6 0L8.6 3a19.7 19.7 0 0 0-4.9 1.4C.6 9 0 13.6.3 18.1a19.9 19.9 0 0 0 6 3l1.3-2a12.9 12.9 0 0 1-2-1l.5-.4a14.2 14.2 0 0 0 12 0l.5.4a12.9 12.9 0 0 1-2 1l1.3 2a19.8 19.8 0 0 0 6-3c.5-5.2-.8-9.7-3.6-13.7zM8.5 15.3c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4zm7 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4z" />
    </svg>
  )
}

export function SocialLinks({ links, size = 'md' }: { links: Partial<Links>; size?: 'sm' | 'md' }) {
  const items = [
    { key: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="size-4" />, cls: 'bg-[#1f8f4e] text-paper' },
    { key: 'discord', label: 'Discord', icon: <DiscordIcon className="size-4" />, cls: 'bg-[#4f55c9] text-paper' },
    { key: 'telegram', label: 'Telegram', icon: <Send className="size-4" />, cls: 'bg-[#2a8bc2] text-paper' },
    { key: 'instagram', label: 'Instagram', icon: <InstagramIcon className="size-4" />, cls: 'bg-terra text-paper' },
  ] as const
  const present = items.filter((i) => links[i.key])
  if (!present.length) return null
  return (
    <div className="flex flex-wrap gap-2">
      {present.map((i) => (
        <a
          key={i.key}
          href={links[i.key]!}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className={clsx('wobble inline-flex items-center gap-2 font-bold transition hover:-translate-y-0.5', i.cls, size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm')}
        >
          {i.icon} {i.label}
        </a>
      ))}
    </div>
  )
}

export function EventCard({ e, index = 0 }: { e: FanEvent; index?: number }) {
  const m = musicalById(e.musical)
  const addToCart = useStore((s) => s.addToCart)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const left = Math.max(0, e.capacity - e.sold)
  const pct = Math.min(100, (e.sold / e.capacity) * 100)

  const add = () => {
    const ok = addToCart({ eventId: e.id, title: e.title, price: e.price, date: e.date, city: e.city, musical: e.musical }, 1, left)
    if (ok) setCartOpen(true)
    else toast('Llegaste al máximo de boletas disponibles para este evento')
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 3) * 0.08 }}
      className="group flex flex-col overflow-hidden bg-paper-2 wobble-2 transition hover:-translate-y-1"
      style={{ boxShadow: `6px 6px 0 ${m.color}` }}
    >
      <Link to={`/eventos/${e.id}`} className="relative flex h-36 items-end justify-between p-4" style={{ background: m.color, color: m.fg }}>
        <MusicalIcon id={m.id} className="absolute -right-4 -top-4 size-36 opacity-25 transition group-hover:rotate-6" />
        <div className="wobble bg-paper px-3 py-2 text-center text-ink">
          <div className="h-display text-3xl leading-none">{dayNum(e.date)}</div>
          <div className="text-xs font-extrabold uppercase tracking-widest text-terra">{monthShort(e.date)}</div>
        </div>
        <span className="chip bg-paper/90 text-ink">{e.type}</span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-extrabold uppercase tracking-widest text-terra">{m.name}</p>
        <h3 className="mt-1 font-display text-xl font-bold leading-tight">
          <Link to={`/eventos/${e.id}`} className="hover:text-ultra">{e.title}</Link>
        </h3>
        <ul className="mt-3 space-y-1 text-sm text-ink/70">
          <li className="flex items-center gap-2"><MapPin className="size-4 text-ultra" /> {e.city} · {e.venue}</li>
          <li className="flex items-center gap-2 capitalize"><CalendarDays className="size-4 text-ultra" /> {fmtDate(e.date, e.time, "EEE d MMM · h:mm a")}</li>
          <li className="flex items-center gap-2"><Users className="size-4 text-ultra" /> {e.communityName ?? e.organizer}</li>
        </ul>
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-ink/10">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: pct > 85 ? '#c2462f' : '#2536b8' }} />
          </div>
          <p className="mt-1 text-xs text-ink/60">{left ? `Quedan ${left} de ${e.capacity} cupos` : 'Sin cupos disponibles'}</p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <strong className="text-xl">{money(e.price)}</strong>
          <button className="btn btn-primary !px-5 !py-2 text-sm" onClick={add} disabled={!left}>
            {!left ? 'Agotado' : e.price ? 'Comprar' : 'Reservar'}
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export function CommunityCard({ c, index = 0 }: { c: Community; index?: number }) {
  const m = musicalById(c.musical)
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: (index % 3) * 0.08 }}
      className="wobble-2 relative flex flex-col overflow-hidden p-6 transition hover:-translate-y-1"
      style={{ background: m.color, color: m.fg, boxShadow: '6px 6px 0 #141a4d' }}
    >
      <MusicalIcon id={m.id} className="absolute -bottom-6 -right-6 size-32 opacity-20" />
      <p className="text-xs font-extrabold uppercase tracking-widest opacity-80">{m.name} · {c.city}</p>
      <h3 className="h-display mt-2 text-2xl leading-tight">
        <Link to={`/comunidades/${c.slug}`} className="after:absolute after:inset-0">{c.name}</Link>
      </h3>
      {c.parentName && <p className="mt-1 text-sm opacity-80">Subcomunidad de {c.parentName}</p>}
      <p className="mt-3 line-clamp-2 text-sm opacity-90">{c.description}</p>
      <dl className="mt-5 grid grid-cols-3 gap-2 text-center">
        {[
          ['Fans', c.memberCount.toLocaleString('es-CO')],
          ['Subgrupos', c.subCount],
          ['Eventos', c.eventCount],
        ].map(([k, v]) => (
          <div key={k} className="wobble bg-paper/90 py-2 text-ink">
            <dd className="text-lg font-extrabold">{v}</dd>
            <dt className="text-[10px] font-bold uppercase tracking-wider opacity-70">{k}</dt>
          </div>
        ))}
      </dl>
      <div className="relative z-10 mt-4 flex gap-2">
        {c.whatsapp && <span className="chip bg-[#1f8f4e] text-paper">WhatsApp</span>}
        {c.discord && <span className="chip bg-[#4f55c9] text-paper">Discord</span>}
        {c.telegram && <span className="chip bg-[#2a8bc2] text-paper">Telegram</span>}
      </div>
    </motion.article>
  )
}

export function Consent({ id, register, error, children }: { id: string; register: object; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-3 text-sm">
        <input id={id} type="checkbox" className="mt-0.5 size-5 shrink-0 accent-ultra" {...register} />
        <span>{children}</span>
      </label>
      {error && <p className="error mt-1 pl-8">{error}</p>}
    </div>
  )
}

export function Field({ label, error, children, hint, className }: { label: string; error?: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={clsx('field', className)}>
      <span>{label}</span>
      {children}
      {hint && !error && <span className="text-xs font-medium text-ink/50">{hint}</span>}
      {error && <span className="error">{error}</span>}
    </label>
  )
}

export function Loading({ label = 'Cargando…' }: { label?: string }) {
  return (
    <div className="grid place-items-center py-24" role="status">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2.4, ease: 'linear' }}>
        <MusicalIcon id="epic" className="size-14 text-ultra" />
      </motion.div>
      <p className="mt-3 font-hand text-2xl text-terra">{label}</p>
    </div>
  )
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="wobble-2 mx-auto max-w-lg bg-paper-2 p-10 text-center">
      <p className="font-hand text-3xl text-terra">{title}</p>
      {children && <div className="mt-3 text-ink/70">{children}</div>}
    </div>
  )
}
