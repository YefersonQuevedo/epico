import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { CalendarPlus, ChevronRight, Crown, Download, GitBranch, KeyRound, Phone, Plus, Trash2, UserPlus } from 'lucide-react'
import { Bird, C, Cloud, MusicalIcon } from '../art/Art'
import { api, useCommunity, useInvalidate, useMembers } from '../lib/api'
import { discordLink, instagramLink, mustAccept, nul, optionalEmail, optionalPhone, phoneRe, telegramLink, whatsappLink } from '../lib/forms'
import { musicalById } from '../lib/musicals'
import { useStore } from '../lib/store'
import type { CommunityDetail as CD } from '../lib/types'
import { CommunityCard, Consent, Empty, EventCard, Field, Loading, SocialLinks } from '../components/ui'

const joinSchema = z.object({
  name: z.string().trim().min(2, 'Escribe tu nombre'),
  phone: z.string().trim().regex(phoneRe, 'Número inválido'),
  email: optionalEmail,
  consent: mustAccept,
})

function JoinForm({ c }: { c: CD }) {
  const markJoined = useStore((s) => s.markJoined)
  const joined = useStore((s) => s.joined.includes(c.id))
  const invalidate = useInvalidate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof joinSchema>>({
    resolver: zodResolver(joinSchema),
    defaultValues: { name: '', phone: '', email: '', consent: false },
  })
  const onSubmit = async (f: z.infer<typeof joinSchema>) => {
    try {
      await api(`/communities/${c.id}/join`, { body: { ...f, email: nul(f.email) } })
      markJoined(c.id)
      invalidate()
      toast.success(`¡Bienvenido/a a ${c.name}!`)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (joined)
    return (
      <div className="text-center">
        <p className="font-hand text-3xl text-terra">¡Ya eres parte!</p>
        <p className="mt-2 text-sm text-ink/70">Entra a los chats de la comunidad:</p>
        <div className="mt-4 flex justify-center"><SocialLinks links={c} /></div>
      </div>
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4" noValidate>
      <Field label="Tu nombre" error={errors.name?.message}><input className="input" {...register('name')} /></Field>
      <Field label="Tu número (WhatsApp)" error={errors.phone?.message}><input className="input" placeholder="+57 300 123 4567" {...register('phone')} /></Field>
      <Field label="Correo (opcional)" error={errors.email?.message}><input type="email" className="input" {...register('email')} /></Field>
      <Consent id="join-consent" register={register('consent')} error={errors.consent?.message}>
        Autorizo a Épico y a los líderes de esta comunidad a tratar mis datos para contactarme sobre sus actividades, según la{' '}
        <Link to="/privacidad" target="_blank" className="font-bold underline">Política de datos</Link>.
      </Consent>
      <button className="btn btn-primary w-full" disabled={isSubmitting}><UserPlus className="size-5" /> Unirme</button>
    </form>
  )
}

const linksSchema = z.object({ whatsapp: whatsappLink, discord: discordLink, telegram: telegramLink, instagram: instagramLink, description: z.string().max(1000) })
const leaderSchema = z.object({ name: z.string().trim().min(2, 'Nombre requerido'), role: z.string().trim().min(2, 'Rol requerido'), phone: optionalPhone, email: optionalEmail, publicPhone: z.boolean() })

function AdminPanel({ c, editKey }: { c: CD; editKey: string }) {
  const invalidate = useInvalidate()
  const navigate = useNavigate()
  const forgetKey = useStore((s) => s.forgetKey)
  const { data: members } = useMembers(c.id, editKey)
  const [tab, setTab] = useState<'miembros' | 'enlaces' | 'lideres'>('miembros')

  const links = useForm<z.infer<typeof linksSchema>>({
    resolver: zodResolver(linksSchema),
    defaultValues: { whatsapp: c.whatsapp ?? '', discord: c.discord ?? '', telegram: c.telegram ?? '', instagram: c.instagram ?? '', description: c.description },
  })
  const leader = useForm<z.infer<typeof leaderSchema>>({
    resolver: zodResolver(leaderSchema),
    defaultValues: { name: '', role: 'Líder', phone: '', email: '', publicPhone: false },
  })

  const saveLinks = async (f: z.infer<typeof linksSchema>) => {
    try {
      await api(`/communities/${c.id}`, { method: 'PATCH', key: editKey, body: { whatsapp: nul(f.whatsapp), discord: nul(f.discord), telegram: nul(f.telegram), instagram: nul(f.instagram), description: f.description } })
      invalidate()
      toast.success('Cambios guardados')
    } catch (e) { toast.error((e as Error).message) }
  }
  const addLeader = async (f: z.infer<typeof leaderSchema>) => {
    try {
      await api(`/communities/${c.id}/leaders`, { key: editKey, body: { ...f, phone: nul(f.phone), email: nul(f.email) } })
      leader.reset()
      invalidate()
      toast.success('Líder agregado')
    } catch (e) { toast.error((e as Error).message) }
  }
  const removeLeader = async (id: string) => {
    if (!confirm('¿Quitar a este líder?')) return
    await api(`/communities/${c.id}/leaders/${id}`, { method: 'DELETE', key: editKey })
    invalidate()
  }
  const downloadCsv = async () => {
    const res = await fetch(`/api/communities/${c.id}/members?format=csv`, { headers: { 'x-edit-key': editKey } })
    const url = URL.createObjectURL(await res.blob())
    const a = Object.assign(document.createElement('a'), { href: url, download: `miembros-${c.slug}.csv` })
    a.click()
    URL.revokeObjectURL(url)
  }
  const removeCommunity = async () => {
    if (!confirm(`¿Eliminar "${c.name}" y todas sus subcomunidades? Esta acción no se puede deshacer.`)) return
    try {
      await api(`/communities/${c.id}`, { method: 'DELETE', key: editKey })
      forgetKey(c.id)
      invalidate()
      toast.success('Comunidad eliminada')
      navigate('/comunidades')
    } catch (e) { toast.error((e as Error).message) }
  }

  return (
    <section className="wobble-2 border-2 border-dashed border-ultra/40 bg-paper p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="h-display flex items-center gap-2 text-2xl text-ultra"><KeyRound className="size-6 text-terra" /> Panel de líderes</h2>
        <div className="flex flex-wrap gap-2">
          <Link to={`/eventos/nuevo?community=${c.id}`} className="btn btn-gold !py-2 text-sm"><CalendarPlus className="size-4" /> Publicar evento</Link>
          <Link to={`/comunidades/nueva?parent=${c.slug}`} className="btn btn-primary !py-2 text-sm"><GitBranch className="size-4" /> Crear subcomunidad</Link>
        </div>
      </div>
      <div className="mt-6 flex gap-2 border-b-2 border-ink/10" role="tablist">
        {(['miembros', 'enlaces', 'lideres'] as const).map((t) => (
          <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`-mb-0.5 border-b-4 px-4 py-2 text-sm font-bold capitalize ${tab === t ? 'border-ultra text-ultra' : 'border-transparent text-ink/60'}`}>
            {t === 'lideres' ? 'líderes' : t}
          </button>
        ))}
      </div>

      {tab === 'miembros' && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-ink/70">{members?.length ?? 0} registrados en la plataforma (con autorización de datos).</p>
            <button onClick={downloadCsv} className="btn btn-ghost !py-2 text-sm"><Download className="size-4" /> Descargar CSV</button>
          </div>
          <div className="mt-4 max-h-80 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-paper text-xs uppercase tracking-wider text-ink/60">
                <tr><th className="py-2">Nombre</th><th>Número</th><th>Correo</th><th>Fecha</th></tr>
              </thead>
              <tbody>
                {members?.map((m) => (
                  <tr key={m.phone} className="border-t border-ink/10">
                    <td className="py-2 font-bold">{m.name}</td>
                    <td><a className="text-ultra underline" href={`https://wa.me/${m.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">{m.phone}</a></td>
                    <td>{m.email ?? '—'}</td>
                    <td className="text-ink/60">{m.created_at.slice(0, 10)}</td>
                  </tr>
                ))}
                {!members?.length && <tr><td colSpan={4} className="py-6 text-center text-ink/50">Aún no hay miembros registrados por la plataforma.</td></tr>}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink/55">Usa estos datos solo para las finalidades autorizadas por cada miembro. Eres responsable de su buen uso.</p>
        </div>
      )}

      {tab === 'enlaces' && (
        <form onSubmit={links.handleSubmit(saveLinks)} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
          <Field label="WhatsApp" error={links.formState.errors.whatsapp?.message}><input className="input" {...links.register('whatsapp')} /></Field>
          <Field label="Discord" error={links.formState.errors.discord?.message}><input className="input" {...links.register('discord')} /></Field>
          <Field label="Telegram" error={links.formState.errors.telegram?.message}><input className="input" {...links.register('telegram')} /></Field>
          <Field label="Instagram" error={links.formState.errors.instagram?.message}><input className="input" {...links.register('instagram')} /></Field>
          <Field label="Descripción" className="sm:col-span-2"><textarea className="input min-h-24" {...links.register('description')} /></Field>
          <div className="flex flex-wrap justify-between gap-3 sm:col-span-2">
            <button type="button" onClick={removeCommunity} className="btn btn-ghost !border-terra !py-2 text-sm !text-terra hover:!bg-terra hover:!text-paper"><Trash2 className="size-4" /> Eliminar comunidad</button>
            <button className="btn btn-primary !py-2">Guardar cambios</button>
          </div>
        </form>
      )}

      {tab === 'lideres' && (
        <div className="mt-6 grid gap-6">
          <ul className="grid gap-2">
            {c.leaders.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 rounded-xl bg-paper-2 px-4 py-3 text-sm">
                <span><b>{l.name}</b> · {l.role} · {l.phone ?? 'sin número'} {l.publicPhone ? '(público)' : '(privado)'}</span>
                <button onClick={() => removeLeader(l.id)} className="p-1 text-terra" aria-label={`Quitar a ${l.name}`}><Trash2 className="size-4" /></button>
              </li>
            ))}
          </ul>
          <form onSubmit={leader.handleSubmit(addLeader)} className="grid gap-4 sm:grid-cols-2" noValidate>
            <Field label="Nombre" error={leader.formState.errors.name?.message}><input className="input" {...leader.register('name')} /></Field>
            <Field label="Rol" error={leader.formState.errors.role?.message}><input className="input" {...leader.register('role')} /></Field>
            <Field label="Número" error={leader.formState.errors.phone?.message}><input className="input" {...leader.register('phone')} /></Field>
            <Field label="Correo" error={leader.formState.errors.email?.message}><input className="input" {...leader.register('email')} /></Field>
            <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" className="size-5 accent-ultra" {...leader.register('publicPhone')} /> Número público</label>
            <button className="btn btn-primary !py-2 sm:justify-self-end"><Plus className="size-4" /> Agregar líder</button>
            <p className="text-xs text-ink/55 sm:col-span-2">Al agregar un líder declaras que te autorizó a publicar sus datos.</p>
          </form>
        </div>
      )}
    </section>
  )
}

export default function CommunityDetail() {
  const { slug = '' } = useParams()
  const { data: c, isLoading, error } = useCommunity(slug)
  const keys = useStore((s) => s.keys)
  if (isLoading) return <Loading />
  if (error || !c) return <div className="py-24"><Empty title="Comunidad no encontrada"><Link to="/comunidades" className="underline">Ver comunidades</Link></Empty></div>
  const m = musicalById(c.musical)
  const editKey = keys[c.id] ?? (c.parentId ? keys[c.parentId] : undefined)

  return (
    <>
      <section className="relative overflow-hidden" style={{ background: m.color, color: m.fg }}>
        <div className="absolute right-6 top-8 hidden w-80 md:block">
          <Cloud className="w-full" fill={m.id === 'six' ? C.paper : C.cloud} />
          <Bird className="float absolute -left-6 top-10 w-44" flip />
        </div>
        <MusicalIcon id={m.id} className="absolute -bottom-20 right-1/4 size-[26rem] opacity-10" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6">
          {c.parentSlug && (
            <Link to={`/comunidades/${c.parentSlug}`} className="mb-4 inline-flex items-center gap-1 text-sm font-bold opacity-80 hover:opacity-100">
              {c.parentName} <ChevronRight className="size-4" /> subcomunidad
            </Link>
          )}
          <p className="text-sm font-extrabold uppercase tracking-widest opacity-80">{m.name} · {c.city}</p>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="h-display mt-2 max-w-3xl text-4xl sm:text-6xl">{c.name}</motion.h1>
          <p className="mt-4 max-w-2xl text-lg opacity-90">{c.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              [c.memberCount.toLocaleString('es-CO'), 'fans'],
              [c.subCount, 'subcomunidades'],
              [c.leaderCount, 'líderes'],
              [c.eventCount, 'eventos'],
            ].map(([v, k]) => (
              <span key={k as string} className="wobble bg-paper px-4 py-2 text-ink"><b className="text-lg">{v}</b> <span className="text-sm">{k}</span></span>
            ))}
          </div>
          <div className="mt-6"><SocialLinks links={c} /></div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-14">
          {c.canEdit && editKey && <AdminPanel c={c} editKey={editKey} />}

          <section>
            <h2 className="h-display flex items-center gap-2 text-3xl text-ultra"><Crown className="size-7 text-feather" /> Líderes</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {c.leaders.map((l, i) => (
                <div key={l.id} className="wobble-2 flex items-center gap-4 bg-paper-2 p-4">
                  <div className="grid size-14 shrink-0 place-items-center rounded-full font-display text-xl font-black" style={{ background: i % 2 ? C.feather : C.cloud }}>
                    {l.name.split(' ').map((w) => w[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold">{l.name}</p>
                    <p className="text-sm text-terra">{l.role}</p>
                    {l.phone && (
                      l.phoneVisible
                        ? <a href={`https://wa.me/${l.phone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-ultra underline"><Phone className="size-3.5" /> {l.phone}</a>
                        : <p className="mt-1 flex items-center gap-1 text-sm text-ink/50"><Phone className="size-3.5" /> {l.phone}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="h-display flex items-center gap-2 text-3xl text-ultra"><GitBranch className="size-7 text-feather" /> Subcomunidades</h2>
              {c.canEdit && <Link to={`/comunidades/nueva?parent=${c.slug}`} className="btn btn-ghost !py-2 text-sm"><Plus className="size-4" /> Nueva</Link>}
            </div>
            {c.children.length ? (
              <div className="mt-5 grid gap-6 sm:grid-cols-2">{c.children.map((s, i) => <CommunityCard key={s.id} c={s} index={i} />)}</div>
            ) : (
              <p className="mt-3 text-ink/60">Aún no hay subcomunidades{c.canEdit ? '. Crea una por zona, coro o interés.' : '.'}</p>
            )}
          </section>

          <section>
            <h2 className="h-display text-3xl text-ultra">Próximos eventos</h2>
            {c.events.length ? (
              <div className="mt-5 grid gap-8 sm:grid-cols-2">{c.events.map((e, i) => <EventCard key={e.id} e={e} index={i} />)}</div>
            ) : (
              <p className="mt-3 text-ink/60">No hay eventos programados.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="wobble-2 bg-paper p-7" style={{ boxShadow: `8px 8px 0 ${m.color}`, border: '2px solid #141a4d1a' }}>
            <p className="kicker">únete</p>
            <h2 className="h-display text-2xl text-ultra">Entra a {c.name}</h2>
            <p className="mt-2 mb-5 text-sm text-ink/70">Regístrate para que los líderes te tengan en cuenta y recibe los enlaces a los chats.</p>
            <JoinForm c={c} />
          </div>
          {!c.canEdit && (
            <p className="text-center text-sm text-ink/60">¿Eres líder? <Link to="/panel" className="font-bold text-ultra underline">Ingresa tu llave</Link></p>
          )}
        </aside>
      </div>
    </>
  )
}
