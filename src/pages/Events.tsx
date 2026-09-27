import { useSearchParams, Link } from 'react-router-dom'
import { LayoutGrid, Map, Plus, Search } from 'lucide-react'
import clsx from 'clsx'
import { GodFrame } from '../art/Gods'
import { useCities, useEvents } from '../lib/api'
import { MUSICALS } from '../lib/musicals'
import { EVENT_TYPES } from '../lib/types'
import { Empty, EventCard, Loading, PageHeader } from '../components/ui'
import { EventsMap } from '../components/MapView'

export default function Events() {
  const [params, setParams] = useSearchParams()
  const f = {
    q: params.get('q') ?? '',
    city: params.get('city') ?? '',
    musical: params.get('musical') ?? '',
    type: params.get('type') ?? '',
  }
  const view = params.get('view') === 'map' ? 'map' : 'grid'
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }
  const { data: cities } = useCities()
  const { data, isLoading } = useEvents(f)

  return (
    <>
      <PageHeader kicker="elige tu próxima noche" title="Eventos" art={<GodFrame id="hermes" className="rotate-2" />}>
        Sing-alongs, watch parties, cosplay y funciones en todas las ciudades. Filtra por musical, ciudad o tipo de plan.
      </PageHeader>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="wobble-2 grid gap-3 bg-paper-2 p-4 md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="sr-only">Buscar</span>
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            <input className="input !pl-10" placeholder="Buscar evento, lugar u organizador" value={f.q} onChange={(e) => set('q', e.target.value)} />
          </label>
          <select className="input" value={f.musical} onChange={(e) => set('musical', e.target.value)} aria-label="Musical">
            <option value="">Todos los musicales</option>
            {MUSICALS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select className="input" value={f.city} onChange={(e) => set('city', e.target.value)} aria-label="Ciudad">
            <option value="">Todas las ciudades</option>
            {cities?.map((c) => <option key={c}>{c}</option>)}
          </select>
          <select className="input" value={f.type} onChange={(e) => set('type', e.target.value)} aria-label="Tipo">
            <option value="">Todo tipo de plan</option>
            {EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
          <div className="flex gap-1" role="group" aria-label="Vista">
            {(['grid', 'map'] as const).map((v) => (
              <button
                key={v}
                onClick={() => set('view', v === 'map' ? 'map' : '')}
                className={clsx('wobble grid size-12 place-items-center', view === v ? 'bg-ultra text-paper' : 'bg-paper')}
                aria-pressed={view === v}
                aria-label={v === 'map' ? 'Ver mapa' : 'Ver tarjetas'}
              >
                {v === 'map' ? <Map className="size-5" /> : <LayoutGrid className="size-5" />}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-ink/60">{data ? `${data.length} evento${data.length === 1 ? '' : 's'}` : ''}</p>
          <Link to="/eventos/nuevo" className="btn btn-gold !py-2 text-sm"><Plus className="size-4" /> Organizar evento</Link>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <Loading />
          ) : !data?.length ? (
            <Empty title="No hay eventos con esos filtros">
              ¿Por qué no organizas el primero? <Link to="/eventos/nuevo" className="font-bold text-ultra underline">Crear evento</Link>
            </Empty>
          ) : view === 'map' ? (
            <EventsMap events={data} />
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((e, i) => <EventCard key={e.id} e={e} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
