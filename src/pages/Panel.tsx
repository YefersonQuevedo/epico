import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { KeyRound, LogOut, Plus } from 'lucide-react'
import { GodFrame } from '../art/Gods'
import { api, useCommunities } from '../lib/api'
import { useStore } from '../lib/store'
import { CommunityCard, Field, PageHeader } from '../components/ui'

export default function Panel() {
  const keys = useStore((s) => s.keys)
  const saveKey = useStore((s) => s.saveKey)
  const forgetKey = useStore((s) => s.forgetKey)
  const { data: all } = useCommunities()
  const mine = all?.filter((c) => keys[c.id]) ?? []
  const [slug, setSlug] = useState('')
  const [key, setKey] = useState('')
  const [busy, setBusy] = useState(false)

  const verify = async (e: React.FormEvent) => {
    e.preventDefault()
    const c = all?.find((x) => x.slug === slug || x.id === slug)
    if (!c) return toast.error('Elige tu comunidad')
    setBusy(true)
    try {
      const { ok } = await api<{ ok: boolean }>(`/communities/${c.id}/verify`, { method: 'POST', key: key.trim() })
      if (!ok) throw new Error('La llave no corresponde a esa comunidad')
      saveKey(c.id, key.trim())
      setKey('')
      toast.success(`Acceso de líder activado para ${c.name}`)
    } catch (err) {
      toast.error((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader kicker="para líderes" title="Panel de líderes" art={<GodFrame id="hades" className="-rotate-2" />}>
        Administra tus comunidades: miembros y sus números, líderes, enlaces a WhatsApp y Discord, subcomunidades y eventos.
      </PageHeader>
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_2fr]">
        <form onSubmit={verify} className="wobble-2 grid gap-4 self-start bg-ultra p-7 text-paper" style={{ boxShadow: '8px 8px 0 #eeb1a3' }}>
          <KeyRound className="size-9 text-feather" />
          <h2 className="h-display text-2xl">Ingresar llave</h2>
          <p className="text-sm text-paper/75">Recibiste la llave al crear tu comunidad. La llave de una comunidad principal también da acceso a sus subcomunidades.</p>
          <Field label="Comunidad">
            <select className="input" value={slug} onChange={(e) => setSlug(e.target.value)}>
              <option value="">Selecciona…</option>
              {all?.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Llave de líder">
            <input className="input font-mono" type="password" autoComplete="off" value={key} onChange={(e) => setKey(e.target.value)} required />
          </Field>
          <button className="btn btn-gold" disabled={busy}>Activar acceso</button>
        </form>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="h-display text-3xl text-ultra">Mis comunidades</h2>
            <Link to="/comunidades/nueva" className="btn btn-ghost !py-2 text-sm"><Plus className="size-4" /> Nueva comunidad</Link>
          </div>
          {mine.length ? (
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              {mine.map((c, i) => (
                <div key={c.id} className="grid gap-2">
                  <CommunityCard c={c} index={i} />
                  <button onClick={() => forgetKey(c.id)} className="flex items-center gap-1 justify-self-end text-xs font-bold text-ink/50 hover:text-terra">
                    <LogOut className="size-3.5" /> Olvidar llave en este navegador
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-ink/60">Aún no administras comunidades desde este navegador. Crea una o ingresa tu llave.</p>
          )}
        </div>
      </div>
    </>
  )
}
