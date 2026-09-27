import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { AnimatePresence, motion } from 'framer-motion'
import { Building2, CreditCard, Lock, ShieldCheck, Smartphone, Wallet } from 'lucide-react'
import clsx from 'clsx'
import { loadStripe } from '@stripe/stripe-js/pure'
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { Bird, Cloud } from '../art/Art'
import { api, useConfig, useInvalidate } from '../lib/api'
import { mustAccept, nul, optionalPhone } from '../lib/forms'
import { money } from '../lib/format'
import { cardBrand, demoAuthorize, digits, expValid, formatCard, formatExp, luhn } from '../lib/payments'
import { useStore } from '../lib/store'
import type { Ticket } from '../lib/types'
import { Consent, Empty, FEE_RATE, Field } from '../components/ui'
import { TicketCard } from '../components/TicketCard'

const buyerSchema = z.object({
  name: z.string().trim().min(3, 'Escribe tu nombre completo'),
  email: z.email('Correo inválido'),
  phone: optionalPhone,
  consent: mustAccept,
  terms: mustAccept,
})
type Buyer = z.infer<typeof buyerSchema>

const BANKS = ['Bancolombia', 'Banco de Bogotá', 'Davivienda', 'BBVA', 'Banco de Occidente', 'Banco Popular', 'Scotiabank Colpatria', 'Banco Caja Social', 'Nu Colombia', 'Lulo Bank']

type Method = 'demo-card' | 'demo-pse' | 'demo-nequi' | 'demo-paypal'
const METHODS: { id: Method; label: string; icon: typeof CreditCard }[] = [
  { id: 'demo-card', label: 'Tarjeta', icon: CreditCard },
  { id: 'demo-pse', label: 'PSE', icon: Building2 },
  { id: 'demo-nequi', label: 'Nequi', icon: Smartphone },
  { id: 'demo-paypal', label: 'PayPal', icon: Wallet },
]

function Steps({ step }: { step: number }) {
  return (
    <ol className="flex items-center gap-2 text-sm font-bold">
      {['Tus datos', 'Pago', 'Boletas'].map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={clsx('grid size-8 place-items-center rounded-full', step >= i + 1 ? 'bg-ultra text-paper' : 'bg-ink/10 text-ink/50')}>{i + 1}</span>
          <span className={clsx('hidden sm:inline', step >= i + 1 ? 'text-ink' : 'text-ink/40')}>{s}</span>
          {i < 2 && <span className="mx-1 h-0.5 w-8 bg-ink/15" />}
        </li>
      ))}
    </ol>
  )
}

/** Formulario de pago en modo demo (tarjeta, PSE, Nequi, PayPal). */
function DemoPayment({ total, onPaid }: { total: number; onPaid: (method: Method, last4?: string) => Promise<void> }) {
  const [method, setMethod] = useState<Method>('demo-card')
  const [card, setCard] = useState({ number: '', name: '', exp: '', cvc: '', installments: '1' })
  const [pse, setPse] = useState({ bank: '', personType: 'natural' })
  const [nequi, setNequi] = useState('')
  const [err, setErr] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [payErr, setPayErr] = useState('')
  const brand = cardBrand(card.number)

  const validate = () => {
    const e: Record<string, string> = {}
    if (method === 'demo-card') {
      if (!luhn(card.number)) e.number = 'Número de tarjeta inválido'
      if (!card.name.trim()) e.name = 'Nombre del titular requerido'
      if (!expValid(card.exp)) e.exp = 'Fecha inválida o vencida'
      if (digits(card.cvc).length !== (brand === 'Amex' ? 4 : 3)) e.cvc = 'CVC inválido'
    }
    if (method === 'demo-pse' && !pse.bank) e.bank = 'Elige tu banco'
    if (method === 'demo-nequi' && !/^3\d{9}$/.test(digits(nequi))) e.nequi = 'Número Nequi de 10 dígitos'
    setErr(e)
    return !Object.keys(e).length
  }

  const pay = async () => {
    setPayErr('')
    if (!validate()) return
    setBusy(true)
    try {
      await demoAuthorize(method, { number: card.number, phone: nequi })
      await onPaid(method, method === 'demo-card' ? digits(card.number).slice(-4) : undefined)
    } catch (e) {
      setPayErr((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <div className="mb-5 rounded-2xl bg-feather/40 p-4 text-sm">
        <b>Modo demostración:</b> no se realiza ningún cargo. Usa la tarjeta <code className="font-bold">4242 4242 4242 4242</code> (aprobada) o{' '}
        <code className="font-bold">4000 0000 0000 0002</code> (rechazada).
      </div>
      <div className="grid grid-cols-4 gap-2" role="tablist" aria-label="Método de pago">
        {METHODS.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={method === m.id}
            onClick={() => { setMethod(m.id); setErr({}); setPayErr('') }}
            className={clsx('wobble grid place-items-center gap-1 py-3 text-xs font-bold transition', method === m.id ? 'bg-ultra text-paper' : 'bg-paper-2 hover:bg-cloud/50')}
          >
            <m.icon className="size-5" /> {m.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4">
        {method === 'demo-card' && (
          <>
            <Field label="Número de tarjeta" error={err.number}>
              <div className="relative">
                <input className="input pr-24 font-mono" inputMode="numeric" autoComplete="cc-number" placeholder="4242 4242 4242 4242" value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} />
                {brand && <span className="chip absolute right-3 top-1/2 -translate-y-1/2 bg-ultra text-paper">{brand}</span>}
              </div>
            </Field>
            <Field label="Nombre del titular" error={err.name}>
              <input className="input" autoComplete="cc-name" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Vence" error={err.exp}><input className="input font-mono" inputMode="numeric" autoComplete="cc-exp" placeholder="MM/AA" value={card.exp} onChange={(e) => setCard({ ...card, exp: formatExp(e.target.value) })} /></Field>
              <Field label="CVC" error={err.cvc}><input className="input font-mono" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} value={card.cvc} onChange={(e) => setCard({ ...card, cvc: digits(e.target.value) })} /></Field>
              <Field label="Cuotas">
                <select className="input" value={card.installments} onChange={(e) => setCard({ ...card, installments: e.target.value })}>
                  {['1', '3', '6', '12', '24'].map((n) => <option key={n}>{n}</option>)}
                </select>
              </Field>
            </div>
          </>
        )}
        {method === 'demo-pse' && (
          <>
            <Field label="Banco" error={err.bank}>
              <select className="input" value={pse.bank} onChange={(e) => setPse({ ...pse, bank: e.target.value })}>
                <option value="">Selecciona tu banco</option>
                {BANKS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </Field>
            <Field label="Tipo de persona">
              <select className="input" value={pse.personType} onChange={(e) => setPse({ ...pse, personType: e.target.value })}>
                <option value="natural">Natural</option>
                <option value="juridica">Jurídica</option>
              </select>
            </Field>
            <p className="text-sm text-ink/60">Serás redirigido al portal de tu banco para autorizar el débito.</p>
          </>
        )}
        {method === 'demo-nequi' && (
          <Field label="Número Nequi" error={err.nequi} hint="Recibirás una notificación en la app para aprobar el pago.">
            <input className="input font-mono" inputMode="numeric" placeholder="300 123 4567" value={nequi} onChange={(e) => setNequi(e.target.value)} />
          </Field>
        )}
        {method === 'demo-paypal' && <p className="text-sm text-ink/60">Se abrirá la ventana de PayPal para iniciar sesión y confirmar el pago.</p>}
      </div>

      {payErr && <p className="mt-4 rounded-xl bg-terra/15 p-3 text-sm font-bold text-terra" role="alert">{payErr}</p>}
      <button onClick={pay} disabled={busy} className="btn btn-primary mt-6 w-full text-lg">
        {busy ? (
          <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 1.2 }}>Procesando pago…</motion.span>
        ) : (
          <><Lock className="size-5" /> Pagar {money(total)}</>
        )}
      </button>
    </div>
  )
}

/** Pago real con Stripe Payment Element (se activa al configurar las llaves). */
function StripeForm({ total, onPaid }: { total: number; onPaid: (paymentIntentId: string) => Promise<void> }) {
  const stripe = useStripe()
  const elements = useElements()
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const submit = async () => {
    if (!stripe || !elements) return
    setBusy(true)
    setErr('')
    const { error, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required', confirmParams: { return_url: location.href } })
    if (error) setErr(error.message ?? 'No se pudo procesar el pago')
    else if (paymentIntent?.status === 'succeeded') await onPaid(paymentIntent.id).catch((e) => setErr(e.message))
    setBusy(false)
  }
  return (
    <div>
      <PaymentElement />
      {err && <p className="mt-4 rounded-xl bg-terra/15 p-3 text-sm font-bold text-terra" role="alert">{err}</p>}
      <button onClick={submit} disabled={busy || !stripe} className="btn btn-primary mt-6 w-full text-lg"><Lock className="size-5" /> {busy ? 'Procesando…' : `Pagar ${money(total)}`}</button>
    </div>
  )
}

function StripePayment({ publishableKey, items, total, onPaid }: { publishableKey: string; items: { eventId: string; qty: number }[]; total: number; onPaid: (id: string) => Promise<void> }) {
  const stripePromise = useMemo(() => loadStripe(publishableKey), [publishableKey])
  const [secret, setSecret] = useState<string | null>(null)
  const [err, setErr] = useState('')
  useEffect(() => {
    let alive = true
    api<{ clientSecret: string }>('/payments/intent', { body: { items } })
      .then((r) => alive && setSecret(r.clientSecret))
      .catch((e) => alive && setErr(e.message))
    return () => { alive = false }
  }, [items])
  if (err) return <p className="text-terra">{err}</p>
  if (!secret) return <p className="text-ink/60">Conectando con la pasarela…</p>
  return (
    <Elements stripe={stripePromise} options={{ clientSecret: secret, locale: 'es', appearance: { theme: 'flat', variables: { colorPrimary: '#2536b8', colorBackground: '#f3ede1', colorText: '#141a4d', borderRadius: '12px', fontFamily: 'Karla, system-ui' } } }}>
      <StripeForm total={total} onPaid={onPaid} />
    </Elements>
  )
}

export default function Checkout() {
  const { cart, clearCart, addTickets } = useStore()
  const { data: config } = useConfig()
  const invalidate = useInvalidate()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [buyer, setBuyer] = useState<Buyer | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [orderId, setOrderId] = useState('')
  const [snapshot, setSnapshot] = useState(cart)

  const lines = step === 3 ? snapshot : cart
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0)
  const fee = Math.round(subtotal * FEE_RATE)
  const total = subtotal + fee
  const items = useMemo(() => cart.map(({ eventId, qty }) => ({ eventId, qty })), [cart])

  useEffect(() => {
    if (step === 3) clearCart()
  }, [step, clearCart])

  const form = useForm<Buyer>({ resolver: zodResolver(buyerSchema), defaultValues: { name: '', email: '', phone: '', consent: false, terms: false } })
  const { register, handleSubmit, formState: { errors } } = form

  const finish = async (b: Buyer, method: string, extra: { paymentIntentId?: string; last4?: string } = {}) => {
    const res = await api<{ orderId: string; tickets: Ticket[] }>('/orders', {
      body: { items, buyer: { name: b.name, email: b.email, phone: nul(b.phone) }, consent: b.consent, method, ...extra },
    })
    setSnapshot(cart)
    setTickets(res.tickets)
    setOrderId(res.orderId)
    addTickets(res.tickets)
    setStep(3) // el carrito se vacía en el efecto de abajo, ya con la confirmación en pantalla
    invalidate()
    toast.success(method === 'free' ? '¡Reserva confirmada!' : '¡Pago aprobado! Tus boletas están listas')
  }

  const toPayment = async (b: Buyer) => {
    setBuyer(b)
    if (total > 0) return setStep(2)
    try {
      await finish(b, 'free')
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (!cart.length && step !== 3)
    return (
      <div className="py-24">
        <Empty title="Tu carrito está vacío"><Link to="/eventos" className="font-bold text-ultra underline">Buscar eventos</Link></Empty>
      </div>
    )

  const musicalOf = (eventId: string) => snapshot.find((l) => l.eventId === eventId)?.musical

  return (
    <div className="relative overflow-hidden">
      <Cloud className="pointer-events-none absolute -right-24 top-0 w-96 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="kicker">pago seguro</p>
            <h1 className="h-display text-4xl text-ultra sm:text-5xl">{step === 3 ? '¡Nos vemos allá!' : 'Checkout'}</h1>
          </div>
          <Steps step={step} />
        </div>

        <AnimatePresence mode="wait">
          {step === 3 ? (
            <motion.div key="done" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
              <div className="wobble-2 flex flex-wrap items-center gap-6 bg-ultra p-8 text-paper">
                <Bird className="float w-32" />
                <div>
                  <p className="font-hand text-2xl text-feather">orden {orderId}</p>
                  <h2 className="h-display text-3xl">Tus boletas están listas</h2>
                  <p className="mt-1 text-paper/80">Guardamos una copia en "Mis boletas". Presenta el código QR en la entrada. Correo: {buyer?.email}</p>
                </div>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-2">{tickets.map((t) => <TicketCard key={t.code} t={t} musical={musicalOf(t.eventId)} />)}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={() => window.print()} className="btn btn-ghost">Imprimir</button>
                <button onClick={() => navigate('/mis-boletas')} className="btn btn-primary">Ir a mis boletas</button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
              <div className="wobble-2 bg-paper p-6 sm:p-8" style={{ border: '2px solid #141a4d1a' }}>
                {step === 1 && (
                  <form onSubmit={handleSubmit(toPayment)} className="grid gap-5" noValidate>
                    <h2 className="h-display text-2xl text-ultra">Tus datos</h2>
                    <Field label="Nombre completo" error={errors.name?.message}><input className="input" autoComplete="name" {...register('name')} /></Field>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Correo" hint="Aquí enviamos tus boletas" error={errors.email?.message}><input type="email" className="input" autoComplete="email" {...register('email')} /></Field>
                      <Field label="Celular (opcional)" error={errors.phone?.message}><input className="input" autoComplete="tel" {...register('phone')} /></Field>
                    </div>
                    <Consent id="terms" register={register('terms')} error={errors.terms?.message}>
                      Acepto los <Link to="/terminos" target="_blank" className="font-bold underline">Términos y condiciones</Link>. Entiendo que el evento lo realiza su organizador y que Épico actúa como
                      intermediario de la venta.
                    </Consent>
                    <Consent id="consent" register={register('consent')} error={errors.consent?.message}>
                      Autorizo el tratamiento de mis datos personales para gestionar mi compra y el acceso al evento, y su entrega al organizador para ese fin, según la{' '}
                      <Link to="/privacidad" target="_blank" className="font-bold underline">Política de datos</Link>.
                    </Consent>
                    <button className="btn btn-primary w-full text-lg">{total === 0 ? 'Confirmar reserva' : 'Continuar al pago'}</button>
                  </form>
                )}
                {step === 2 && (
                  <div>
                    <div className="mb-6 flex items-center justify-between">
                      <h2 className="h-display text-2xl text-ultra">Pago</h2>
                      <button className="text-sm font-bold text-ultra underline" onClick={() => setStep(1)}>← Editar datos</button>
                    </div>
                    {config?.stripe && config.publishableKey ? (
                      <StripePayment publishableKey={config.publishableKey} items={items} total={total} onPaid={(id) => finish(buyer!, 'stripe', { paymentIntentId: id })} />
                    ) : config?.demoPayments ? (
                      <DemoPayment total={total} onPaid={(method, last4) => finish(buyer!, method, { last4 })} />
                    ) : (
                      <p className="text-terra">Los pagos no están configurados en este servidor.</p>
                    )}
                  </div>
                )}
              </div>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="wobble-2 bg-paper-2 p-6">
                  <h2 className="h-display text-xl">Resumen</h2>
                  <ul className="mt-4 space-y-3">
                    {lines.map((l) => (
                      <li key={l.eventId} className="flex justify-between gap-3 text-sm">
                        <span><b>{l.qty}×</b> {l.title}</span>
                        <span className="shrink-0 font-bold">{money(l.price * l.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-5 space-y-1 border-t-2 border-ink/10 pt-4 text-sm">
                    <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                    <div className="flex justify-between text-ink/60"><dt>Tarifa de servicio</dt><dd>{money(fee)}</dd></div>
                    <div className="flex justify-between pt-2 text-xl font-extrabold"><dt>Total</dt><dd>{money(total)}</dd></div>
                  </dl>
                  <p className="mt-5 flex items-start gap-2 text-xs text-ink/60">
                    <ShieldCheck className="size-4 shrink-0 text-ultra" /> Pagos procesados por una pasarela certificada PCI DSS. Épico nunca almacena los datos de tu tarjeta.
                  </p>
                </div>
              </aside>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
