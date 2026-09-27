import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Feather, Sparkles } from 'lucide-react'
import { Sun } from '../art/Art'
import { api, useCommunities, useInvalidate } from '../lib/api'
import { discordLink, mustAccept, nul, optionalPhone, whatsappLink } from '../lib/forms'
import { money } from '../lib/format'
import { MUSICALS } from '../lib/musicals'
import { useStore } from '../lib/store'
import { EVENT_TYPES, type MusicalId } from '../lib/types'
import { Consent, Field, PageHeader } from '../components/ui'
import { LocationPicker } from '../components/MapView'
import { KeyDialog } from '../components/KeyDialog'

const today = new Date().toISOString().slice(0, 10)

const schema = z.object({
  communityId: z.string(),
  title: z.string().trim().min(4, 'Mínimo 4 caracteres').max(100),
  musical: z.enum(MUSICALS.map((m) => m.id) as [MusicalId, ...MusicalId[]]),
  type: z.enum(EVENT_TYPES),
  description: z.string().max(2000),
  city: z.string().trim().min(2, 'Indica la ciudad'),
  venue: z.string().trim().min(2, 'Indica el lugar'),
  address: z.string().max(160),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  date: z.string().refine((d) => d >= today, 'La fecha debe ser hoy o futura'),
  time: z.string().regex(/^\d{2}:\d{2}$/, 'Hora inválida'),
  price: z.number({ error: 'Indica un precio (0 = gratis)' }).int().min(0).max(5_000_000),
  capacity: z.number({ error: 'Indica los cupos' }).int().min(1, 'Mínimo 1 cupo').max(100_000),
  organizer: z.string().trim().min(2, 'Indica quién organiza'),
  contactPhone: optionalPhone,
  whatsapp: whatsappLink,
  discord: discordLink,
  acceptTerms: mustAccept,
})
type Form = z.infer<typeof schema>

export default function EventNew() {
  const [params] = useSearchParams()
  const keys = useStore((s) => s.keys)
  const saveEventKey = useStore((s) => s.saveEventKey)
  const { data: all } = useCommunities()
  const mine = useMemo(() => all?.filter((c) => keys[c.id] || (c.parentId && keys[c.parentId])) ?? [], [all, keys])
  const navigate = useNavigate()
  const invalidate = useInvalidate()
  const [created, setCreated] = useState<{ id: string; editKey: string } | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: {
      communityId: params.get('community') ?? '',
      title: '', musical: 'epic', type: 'Sing-along', description: '', city: '', venue: '', address: '',
      lat: null, lng: null, date: '', time: '19:00', price: 0, capacity: 50, organizer: '', contactPhone: '', whatsapp: '', discord: '', acceptTerms: false,
    },
  })

  const [price, capacity, lat, lng, communityId] = watch(['price', 'capacity', 'lat', 'lng', 'communityId'])
  const gross = (price || 0) * (capacity || 0)

  const onCommunity = (id: string) => {
    setValue('communityId', id)
    const c = mine.find((x) => x.id === id)
    if (c) {
      setValue('organizer', c.name)
      setValue('musical', c.musical)
      setValue('city', c.city)
      if (c.whatsapp) setValue('whatsapp', c.whatsapp)
      if (c.discord) setValue('discord', c.discord)
    }
  }

  const onSubmit = async (f: Form) => {
    try {
      const c = mine.find((x) => x.id === f.communityId)
      const key = c ? keys[c.id] ?? (c.parentId ? keys[c.parentId] : null) : null
      const res = await api<{ id: string; editKey: string }>('/events', {
        key,
        body: {
          ...f,
          communityId: nul(f.communityId),
          contactPhone: nul(f.contactPhone),
          whatsapp: nul(f.whatsapp),
          discord: nul(f.discord),
        },
      })
      saveEventKey(res.id, res.editKey)
      invalidate()
      setCreated(res)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <>
      <PageHeader kicker="para organizadores" title="Organiza un evento" art={<Sun className="w-40" />}>
        Publica tu sing-along, watch party o función en cualquier ciudad. Marca el lugar en el mapa, define cupos y precio, y enlaza el grupo de tu gente.
      </PageHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr]" noValidate>
        <div className="space-y-10">
          <fieldset className="grid gap-5">
            <legend className="h-display mb-4 text-2xl text-ultra">1. El plan</legend>
            <Field label="¿A nombre de qué comunidad?" hint={mine.length ? undefined : 'Solo los líderes pueden publicar a nombre de una comunidad. Puedes publicarlo a título personal.'}>
              <select className="input" value={communityId} onChange={(e) => onCommunity(e.target.value)}>
                <option value="">A título personal</option>
                {mine.map((c) => <option key={c.id} value={c.id}>{c.name}{c.parentName ? ` (sub de ${c.parentName})` : ''}</option>)}
              </select>
            </Field>
            <Field label="Nombre del evento" error={errors.title?.message}>
              <input className="input" placeholder="EPIC Sing-Along: la Saga del Inframundo" {...register('title')} />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Musical" error={errors.musical?.message}>
                <select className="input" {...register('musical')}>{MUSICALS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
              </Field>
              <Field label="Tipo de plan" error={errors.type?.message}>
                <select className="input" {...register('type')}>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              </Field>
            </div>
            <Field label="Descripción" error={errors.description?.message}>
              <textarea className="input min-h-32" placeholder="¿Qué van a hacer? ¿Hay dress code? ¿Qué deben llevar?" {...register('description')} />
            </Field>
          </fieldset>

          <fieldset className="grid gap-5">
            <legend className="h-display mb-4 text-2xl text-ultra">2. Lugar y fecha</legend>
            <LocationPicker
              value={{ lat, lng }}
              onChange={(p) => {
                setValue('lat', p.lat)
                setValue('lng', p.lng)
                if (p.address) setValue('address', p.address)
                if (p.city) setValue('city', p.city, { shouldValidate: true })
              }}
            />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Nombre del lugar" error={errors.venue?.message}><input className="input" placeholder="Teatro, parque, bar, casa cultural…" {...register('venue')} /></Field>
              <Field label="Ciudad" error={errors.city?.message}><input className="input" placeholder="Ibagué" {...register('city')} /></Field>
            </div>
            <Field label="Dirección" error={errors.address?.message}><input className="input" placeholder="Cl. 10 #3-45" {...register('address')} /></Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Fecha" error={errors.date?.message}><input type="date" min={today} className="input" {...register('date')} /></Field>
              <Field label="Hora" error={errors.time?.message}><input type="time" className="input" {...register('time')} /></Field>
            </div>
          </fieldset>

          <fieldset className="grid gap-5">
            <legend className="h-display mb-4 text-2xl text-ultra">3. Boletas y contacto</legend>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Precio por boleta (COP)" hint="0 = evento gratuito con reserva" error={errors.price?.message}>
                <input type="number" min={0} step={1000} className="input" {...register('price', { valueAsNumber: true })} />
              </Field>
              <Field label="Cupos" error={errors.capacity?.message}>
                <input type="number" min={1} className="input" {...register('capacity', { valueAsNumber: true })} />
              </Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Organiza" error={errors.organizer?.message}><input className="input" placeholder="Tu nombre o el de tu grupo" {...register('organizer')} /></Field>
              <Field label="Teléfono de contacto (opcional)" error={errors.contactPhone?.message}><input className="input" placeholder="+57 300 123 4567" {...register('contactPhone')} /></Field>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Grupo de WhatsApp (opcional)" error={errors.whatsapp?.message}><input className="input" placeholder="https://chat.whatsapp.com/…" {...register('whatsapp')} /></Field>
              <Field label="Servidor de Discord (opcional)" error={errors.discord?.message}><input className="input" placeholder="https://discord.gg/…" {...register('discord')} /></Field>
            </div>
          </fieldset>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="wobble-2 bg-ultra p-7 text-paper" style={{ boxShadow: '8px 8px 0 #d8b77e' }}>
            <Feather className="size-8 text-feather" />
            <h2 className="h-display mt-3 text-2xl">Resumen para el organizador</h2>
            <dl className="mt-5 space-y-2 text-paper/90">
              <div className="flex justify-between"><dt>Ventas si llenas</dt><dd className="font-bold">{money(gross)}</dd></div>
              <div className="flex justify-between"><dt>Tarifa de servicio</dt><dd>La paga el comprador (5%)</dd></div>
              <div className="flex justify-between border-t border-paper/20 pt-2 text-lg"><dt>Recibes</dt><dd className="font-extrabold text-feather">{money(gross)}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-paper/60">Los desembolsos a organizadores se hacen según los términos de la pasarela de pagos configurada.</p>
            <div className="mt-6 rounded-2xl bg-paper p-4 text-ink">
              <Consent id="acceptTerms" register={register('acceptTerms')} error={errors.acceptTerms?.message}>
                Declaro que soy responsable de este evento, que cuento con los permisos del lugar y los derechos necesarios, y acepto los{' '}
                <Link to="/terminos" target="_blank" className="font-bold underline">Términos y condiciones</Link> y la{' '}
                <Link to="/privacidad" target="_blank" className="font-bold underline">Política de datos</Link>.
              </Consent>
            </div>
            <button type="submit" className="btn btn-gold mt-6 w-full text-lg" disabled={isSubmitting}>
              <Sparkles className="size-5" /> {isSubmitting ? 'Publicando…' : 'Publicar evento'}
            </button>
          </div>
        </aside>
      </form>

      <KeyDialog
        open={!!created}
        editKey={created?.editKey ?? ''}
        what="este evento"
        onClose={() => { const id = created!.id; setCreated(null); toast.success('Evento publicado'); navigate(`/eventos/${id}`) }}
      />
    </>
  )
}
