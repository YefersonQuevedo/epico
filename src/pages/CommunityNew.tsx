import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useFieldArray, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Crown, Plus, Trash2, UsersRound } from 'lucide-react'
import { Bird } from '../art/Art'
import { api, useCommunity, useInvalidate } from '../lib/api'
import { discordLink, instagramLink, mustAccept, nul, optionalEmail, optionalPhone, telegramLink, whatsappLink } from '../lib/forms'
import { MUSICALS } from '../lib/musicals'
import { useStore } from '../lib/store'
import type { MusicalId } from '../lib/types'
import { Consent, Field, PageHeader } from '../components/ui'
import { KeyDialog } from '../components/KeyDialog'

const schema = z.object({
  name: z.string().trim().min(3, 'Mínimo 3 caracteres').max(80),
  musical: z.enum(MUSICALS.map((m) => m.id) as [MusicalId, ...MusicalId[]]),
  city: z.string().trim().min(2, 'Indica la ciudad'),
  description: z.string().max(1000),
  whatsapp: whatsappLink,
  discord: discordLink,
  instagram: instagramLink,
  telegram: telegramLink,
  leaders: z.array(z.object({
    name: z.string().trim().min(2, 'Nombre requerido'),
    role: z.string().trim().min(2, 'Rol requerido'),
    phone: optionalPhone,
    email: optionalEmail,
    publicPhone: z.boolean(),
  })).min(1, 'Agrega al menos un líder'),
  leadersConsent: mustAccept,
  acceptTerms: mustAccept,
})
type Form = z.infer<typeof schema>

export default function CommunityNew() {
  const [params] = useSearchParams()
  const parentSlug = params.get('parent')
  const { data: parent } = useCommunity(parentSlug)
  const keys = useStore((s) => s.keys)
  const saveKey = useStore((s) => s.saveKey)
  const navigate = useNavigate()
  const invalidate = useInvalidate()
  const [created, setCreated] = useState<{ id: string; slug: string; editKey: string } | null>(null)
  const isSub = !!parentSlug && !!parent

  const { register, control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({
    resolver: zodResolver(schema),
    values: {
      name: '', musical: parent?.musical ?? 'epic', city: parent?.city ?? '', description: '',
      whatsapp: '', discord: '', instagram: '', telegram: '',
      leaders: [{ name: '', role: isSub ? 'Líder de subgrupo' : 'Fundador/a', phone: '', email: '', publicPhone: true }],
      leadersConsent: false, acceptTerms: false,
    },
    resetOptions: { keepDirtyValues: true },
  })
  const { fields, append, remove } = useFieldArray({ control, name: 'leaders' })

  const onSubmit = async (f: Form) => {
    try {
      const parentKey = parent ? keys[parent.id] ?? (parent.parentId ? keys[parent.parentId] : null) : null
      const res = await api<{ id: string; slug: string; editKey: string }>('/communities', {
        key: parentKey,
        body: {
          name: f.name, musical: f.musical, city: f.city, description: f.description,
          whatsapp: nul(f.whatsapp), discord: nul(f.discord), instagram: nul(f.instagram), telegram: nul(f.telegram),
          parentId: parent?.id ?? null,
          leaders: f.leaders.map((l) => ({ ...l, phone: nul(l.phone), email: nul(l.email) })),
          acceptTerms: f.acceptTerms,
        },
      })
      saveKey(res.id, res.editKey)
      invalidate()
      setCreated(res)
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  return (
    <>
      <PageHeader
        kicker={isSub ? `subcomunidad de ${parent.name}` : 'reúne a tu gente'}
        title={isSub ? 'Nueva subcomunidad' : 'Crea tu comunidad'}
        art={<Bird className="float w-56" />}
      >
        {isSub
          ? 'Divide por zona, coro, universidad o interés. La subcomunidad tendrá sus propios líderes y chats, y los líderes principales también podrán administrarla.'
          : 'Registra tu grupo de fans con sus líderes y enlaces a WhatsApp, Discord, Telegram o Instagram. Luego podrás crear subcomunidades y publicar eventos.'}
      </PageHeader>

      {parentSlug && parent && !parent.canEdit && (
        <div className="mx-auto mt-8 max-w-3xl px-4">
          <div className="wobble-2 bg-cloud/60 p-5 text-sm">
            Solo los líderes de <b>{parent.name}</b> pueden crear subcomunidades. Si eres líder, entra al <Link className="font-bold underline" to="/panel">panel de líderes</Link> e ingresa tu llave.
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid max-w-4xl gap-12 px-4 py-12 sm:px-6" noValidate>
        <fieldset className="grid gap-5">
          <legend className="h-display mb-4 flex items-center gap-2 text-2xl text-ultra"><UsersRound className="size-6" /> La comunidad</legend>
          <Field label="Nombre" error={errors.name?.message}><input className="input" placeholder={isSub ? 'Ithaca Norte · Usaquén' : 'Ithaca Fans Ibagué'} {...register('name')} /></Field>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Musical principal" error={errors.musical?.message}>
              <select className="input" {...register('musical')}>{MUSICALS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}</select>
            </Field>
            <Field label="Ciudad" error={errors.city?.message}><input className="input" placeholder="Ibagué" {...register('city')} /></Field>
          </div>
          <Field label="Descripción" error={errors.description?.message}>
            <textarea className="input min-h-28" placeholder="¿Qué hacen? ¿Cada cuánto se reúnen? ¿Quién puede unirse?" {...register('description')} />
          </Field>
        </fieldset>

        <fieldset className="grid gap-5">
          <legend className="h-display mb-4 text-2xl text-ultra">Enlaces a sus grupos</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Grupo de WhatsApp" error={errors.whatsapp?.message}><input className="input" placeholder="https://chat.whatsapp.com/…" {...register('whatsapp')} /></Field>
            <Field label="Servidor de Discord" error={errors.discord?.message}><input className="input" placeholder="https://discord.gg/…" {...register('discord')} /></Field>
            <Field label="Grupo de Telegram" error={errors.telegram?.message}><input className="input" placeholder="https://t.me/…" {...register('telegram')} /></Field>
            <Field label="Instagram" error={errors.instagram?.message}><input className="input" placeholder="https://instagram.com/…" {...register('instagram')} /></Field>
          </div>
        </fieldset>

        <fieldset className="grid gap-5">
          <legend className="h-display mb-4 flex items-center gap-2 text-2xl text-ultra"><Crown className="size-6" /> Líderes</legend>
          {fields.map((f, i) => (
            <div key={f.id} className="wobble-2 relative grid gap-4 bg-paper-2 p-5 sm:grid-cols-2">
              <Field label="Nombre" error={errors.leaders?.[i]?.name?.message}><input className="input" {...register(`leaders.${i}.name`)} /></Field>
              <Field label="Rol" error={errors.leaders?.[i]?.role?.message}><input className="input" placeholder="Fundador/a, coordinador/a…" {...register(`leaders.${i}.role`)} /></Field>
              <Field label="Número (WhatsApp)" error={errors.leaders?.[i]?.phone?.message}><input className="input" placeholder="+57 300 123 4567" {...register(`leaders.${i}.phone`)} /></Field>
              <Field label="Correo" error={errors.leaders?.[i]?.email?.message}><input className="input" type="email" {...register(`leaders.${i}.email`)} /></Field>
              <label className="flex items-center gap-2 text-sm font-bold sm:col-span-2">
                <input type="checkbox" className="size-5 accent-ultra" {...register(`leaders.${i}.publicPhone`)} /> Mostrar el número públicamente
              </label>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(i)} className="absolute right-3 top-3 p-2 text-terra" aria-label="Quitar líder"><Trash2 className="size-4" /></button>
              )}
            </div>
          ))}
          {errors.leaders?.root?.message && <p className="error">{errors.leaders.root.message}</p>}
          <button type="button" className="btn btn-ghost justify-self-start" onClick={() => append({ name: '', role: 'Líder', phone: '', email: '', publicPhone: false })}>
            <Plus className="size-4" /> Agregar líder
          </button>
        </fieldset>

        <div className="wobble-2 grid gap-4 bg-cloud/40 p-6">
          <Consent id="leadersConsent" register={register('leadersConsent')} error={errors.leadersConsent?.message}>
            Declaro que cuento con la <b>autorización previa, expresa e informada</b> de cada líder registrado para compartir su nombre, número y correo en Épico, conforme a la{' '}
            <Link to="/privacidad" target="_blank" className="font-bold underline">Política de tratamiento de datos</Link> (Ley 1581 de 2012).
          </Consent>
          <Consent id="acceptTerms" register={register('acceptTerms')} error={errors.acceptTerms?.message}>
            Acepto los <Link to="/terminos" target="_blank" className="font-bold underline">Términos y condiciones</Link>. Entiendo que la comunidad, sus chats externos y su contenido son
            responsabilidad de sus líderes y no de Épico.
          </Consent>
        </div>

        <button type="submit" className="btn btn-primary w-full text-lg sm:w-auto sm:justify-self-end" disabled={isSubmitting || (!!parentSlug && !parent?.canEdit)}>
          {isSubmitting ? 'Creando…' : isSub ? 'Crear subcomunidad' : 'Crear comunidad'}
        </button>
      </form>

      <KeyDialog
        open={!!created}
        editKey={created?.editKey ?? ''}
        what="esta comunidad (y sus subcomunidades)"
        onClose={() => { const slug = created!.slug; setCreated(null); toast.success('Comunidad creada'); navigate(`/comunidades/${slug}`) }}
      />
    </>
  )
}
