import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, Minus, Phone, Plus, Share2, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Bird, C, Cloud, MusicalIcon } from '../art/Art'
import { api, useEvent, useInvalidate } from '../lib/api'
import { fmtDate, money } from '../lib/format'
import { musicalById } from '../lib/musicals'
import { useStore } from '../lib/store'
import { Empty, Loading, SocialLinks } from '../components/ui'
import { SinglePin } from '../components/MapView'

export default function EventDetail() {
  const { id = '' } = useParams()
  const { data: e, isLoading, error } = useEvent(id)
  const [qty, setQty] = useState(1)
  const addToCart = useStore((s) => s.addToCart)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const eventKey = useStore((s) => s.eventKeys[id])
  const keys = useStore((s) => s.keys)
  const navigate = useNavigate()
  const invalidate = useInvalidate()

  if (isLoading) return <Loading />
  if (error || !e) return <div className="py-24"><Empty title="Evento no encontrado"><Link to="/eventos" className="underline">Volver a eventos</Link></Empty></div>

  const m = musicalById(e.musical)
  const left = Math.max(0, e.capacity - e.sold)
  const key = eventKey ?? (e.communityId ? keys[e.communityId] : undefined)

  const buy = () => {
    const ok = addToCart({ eventId: e.id, title: e.title, price: e.price, date: e.date, city: e.city, musical: e.musical }, qty, left)
    if (ok) setCartOpen(true)
    else toast('Ya tienes el máximo de boletas disponibles')
  }
  const share = async () => {
    const data = { title: e.title, text: `${e.title} · ${e.city}`, url: location.href }
    try {
      if (navigator.share) await navigator.share(data)
      else { await navigator.clipboard.writeText(location.href); toast.success('Enlace copiado') }
    } catch { /* cancelado */ }
  }
  const remove = async () => {
    if (!confirm('¿Eliminar este evento? Esta acción no se puede deshacer.')) return
    try {
      await api(`/events/${e.id}`, { method: 'DELETE', key })
      toast.success('Evento eliminado')
      invalidate()
      navigate('/eventos')
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  return (
    <>
      <section className="relative overflow-hidden" style={{ background: m.color, color: m.fg }}>
        <div className="absolute -right-6 top-6 hidden w-96 md:block">
          <Cloud className="w-full" fill={m.id === 'six' ? C.paper : C.cloud} />
          <Bird className="float absolute left-10 top-8 w-44" />
        </div>
        <MusicalIcon id={m.id} className="absolute -bottom-16 left-1/3 size-96 opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <Link to={`/eventos?musical=${m.id}`} className="chip bg-paper text-ink">{m.name}</Link>
          <span className="chip ml-2 bg-ink/20">{e.type}</span>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="h-display mt-5 max-w-3xl text-4xl sm:text-6xl">
            {e.title}
          </motion.h1>
          <p className="mt-4 flex items-center gap-2 text-lg capitalize opacity-90"><CalendarDays className="size-5" /> {fmtDate(e.date, e.time)}</p>
          <p className="mt-1 text-lg opacity-90">{e.venue} · {e.city}</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-10">
          <section>
            <h2 className="h-display text-2xl text-ultra">Sobre el evento</h2>
            <p className="mt-3 whitespace-pre-line text-lg text-ink/80">{e.description || 'El organizador aún no agregó descripción.'}</p>
          </section>

          <section>
            <h2 className="h-display text-2xl text-ultra">Lugar</h2>
            <p className="mt-2 font-bold">{e.venue}</p>
            <p className="text-ink/70">{e.address}{e.address ? ', ' : ''}{e.city}</p>
            {e.lat != null && e.lng != null && (
              <>
                <div className="mt-4"><SinglePin lat={e.lat} lng={e.lng} color={m.color} /></div>
                <a className="mt-3 inline-block text-sm font-bold text-ultra underline" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${e.lat},${e.lng}`}>
                  Cómo llegar →
                </a>
              </>
            )}
          </section>

          <section className="wobble-2 bg-paper-2 p-6">
            <h2 className="h-display text-2xl text-ultra">Organiza</h2>
            <p className="mt-2 flex items-center gap-2 font-bold"><Users className="size-5 text-terra" /> {e.organizer}</p>
            {e.communitySlug && (
              <Link to={`/comunidades/${e.communitySlug}`} className="mt-1 inline-block text-sm font-bold text-ultra underline">
                Ver comunidad {e.communityName}
              </Link>
            )}
            {e.contactPhone && <p className="mt-2 flex items-center gap-2 text-sm"><Phone className="size-4" /> {e.contactPhone}</p>}
            <div className="mt-4"><SocialLinks links={{ whatsapp: e.whatsapp, discord: e.discord }} /></div>
            <p className="mt-4 text-xs text-ink/55">
              Este evento es organizado por la comunidad o persona indicada. Épico actúa como plataforma intermediaria; consulta los{' '}
              <Link to="/terminos" className="underline">términos</Link>.
            </p>
          </section>

          {e.canEdit && (
            <section className="wobble-2 border-2 border-dashed border-terra p-6">
              <h2 className="h-display text-xl text-terra">Eres organizador de este evento</h2>
              <p className="mt-1 text-sm text-ink/70">Boletas vendidas: <b>{e.sold}</b> de {e.capacity}.</p>
              <button onClick={remove} className="btn btn-ghost mt-4 !border-terra !text-terra hover:!bg-terra hover:!text-paper"><Trash2 className="size-4" /> Eliminar evento</button>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="wobble-2 bg-paper p-7" style={{ boxShadow: `8px 8px 0 ${m.color}`, border: '2px solid #141a4d1a' }}>
            <p className="kicker">boletas</p>
            <p className="h-display text-4xl text-ultra">{money(e.price)}</p>
            {e.price > 0 && <p className="text-xs text-ink/60">+ 5% de tarifa de servicio</p>}
            <div className="mt-5">
              <div className="h-3 overflow-hidden rounded-full bg-ink/10">
                <div className="h-full rounded-full bg-ultra" style={{ width: `${Math.min(100, (e.sold / e.capacity) * 100)}%` }} />
              </div>
              <p className="mt-1 text-sm text-ink/70">{left ? `Quedan ${left} cupos` : 'Agotado'}</p>
            </div>
            {left > 0 && (
              <>
                <div className="mt-6 flex items-center justify-between">
                  <span className="font-bold">Cantidad</span>
                  <div className="flex items-center gap-3">
                    <button className="rounded-full border-2 border-ink/20 p-2 hover:bg-ink hover:text-paper" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Menos"><Minus className="size-4" /></button>
                    <span className="w-6 text-center text-xl font-extrabold">{qty}</span>
                    <button className="rounded-full border-2 border-ink/20 p-2 hover:bg-ink hover:text-paper" onClick={() => setQty((q) => Math.min(Math.min(10, left), q + 1))} aria-label="Más"><Plus className="size-4" /></button>
                  </div>
                </div>
                <button className="btn btn-primary mt-6 w-full text-lg" onClick={buy}>
                  {e.price ? `Comprar · ${money(e.price * qty)}` : 'Reservar gratis'}
                </button>
              </>
            )}
            <button onClick={share} className="btn btn-ghost mt-3 w-full"><Share2 className="size-4" /> Compartir</button>
          </div>
        </aside>
      </div>
    </>
  )
}
