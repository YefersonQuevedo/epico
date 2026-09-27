import { Link, useSearchParams } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { Cloud } from '../art/Art'
import { useCities, useCommunities } from '../lib/api'
import { MUSICALS } from '../lib/musicals'
import { CommunityCard, Empty, Loading, PageHeader } from '../components/ui'

export default function Communities() {
  const [params, setParams] = useSearchParams()
  const f = { q: params.get('q') ?? '', city: params.get('city') ?? '', musical: params.get('musical') ?? '', parent: params.get('all') ? '' : 'root' }
  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params)
    if (v) p.set(k, v)
    else p.delete(k)
    setParams(p, { replace: true })
  }
  const { data, isLoading } = useCommunities(f)
  const { data: cities } = useCities()

  return (
    <>
      <PageHeader kicker="encuentra a tu gente" title="Comunidades" art={<Cloud className="w-72" />}>
        Grupos de fans por musical y ciudad, con subcomunidades, líderes y enlaces a sus chats de WhatsApp, Discord y Telegram.
      </PageHeader>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="wobble-2 grid gap-3 bg-paper-2 p-4 md:grid-cols-[2fr_1fr_1fr_auto]">
          <label className="relative">
            <span className="sr-only">Buscar</span>
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink/40" />
            <input className="input !pl-10" placeholder="Buscar comunidad" value={f.q} onChange={(e) => set('q', e.target.value)} />
          </label>
          <select className="input" value={f.musical} onChange={(e) => set('musical', e.target.value)} aria-label="Musical">
            <option value="">Todos los musicales</option>
            {MUSICALS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select className="input" value={f.city} onChange={(e) => set('city', e.target.value)} aria-label="Ciudad">
            <option value="">Todas las ciudades</option>
            {cities?.map((c) => <option key={c}>{c}</option>)}
          </select>
          <label className="flex items-center gap-2 px-2 text-sm font-bold">
            <input type="checkbox" className="size-5 accent-ultra" checked={!f.parent} onChange={(e) => set('all', e.target.checked ? '1' : '')} />
            Incluir subcomunidades
          </label>
        </div>
        <div className="mt-6 flex justify-end">
          <Link to="/comunidades/nueva" className="btn btn-gold !py-2 text-sm"><Plus className="size-4" /> Crear comunidad</Link>
        </div>
        <div className="mt-6">
          {isLoading ? <Loading /> : !data?.length ? (
            <Empty title="Aún no hay comunidades aquí">
              Sé el primero: <Link to="/comunidades/nueva" className="font-bold text-ultra underline">crea la comunidad</Link> de tu ciudad.
            </Empty>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((c, i) => <CommunityCard key={c.id} c={c} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
