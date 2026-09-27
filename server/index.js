import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import Stripe from 'stripe'
import { z } from 'zod'
z.config(z.locales.es())
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { db, tx } from './db.js'
import { seedIfEmpty, SEED_KEY } from './seed.js'
import { EVENT_TYPES, FEE_RATE, MUSICAL_IDS, hash, id, keyMatches, newKey, slugify, ticketCode } from './util.js'

const PORT = Number(process.env.PORT || 8787)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null
const DEMO_PAYMENTS = !stripe && process.env.PAYMENTS_DEMO !== 'false'

if (seedIfEmpty()) console.log(`Base de datos creada con datos de ejemplo. Llave de líder de ejemplo: "${SEED_KEY}"`)

const app = express()
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors())
app.use(express.json({ limit: '200kb' }))
const writeLimiter = rateLimit({ windowMs: 60_000, limit: 40, standardHeaders: true, legacyHeaders: false })

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status }
}
const now = () => new Date().toISOString()
const today = () => new Date().toISOString().slice(0, 10)

// ---------- validación ----------
const opt = (schema) => z.union([schema, z.literal('').transform(() => null), z.null()]).optional().transform((v) => v ?? null)
const linkOf = (re, msg) => opt(z.url().refine((u) => re.test(u), msg))
const links = {
  whatsapp: linkOf(/^https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com\/channel)\//, 'Enlace de WhatsApp inválido'),
  discord: linkOf(/^https:\/\/(discord\.gg|discord\.com\/invite)\//, 'Enlace de Discord inválido'),
  instagram: linkOf(/^https:\/\/(www\.)?instagram\.com\//, 'Enlace de Instagram inválido'),
  telegram: linkOf(/^https:\/\/t\.me\//, 'Enlace de Telegram inválido'),
}
const phone = z.string().trim().regex(/^\+?[\d\s()-]{7,20}$/, 'Teléfono inválido')
const accepted = z.literal(true, { error: 'Debes aceptar para continuar' })

const leaderSchema = z.object({
  name: z.string().trim().min(2).max(80),
  role: z.string().trim().min(2).max(60).default('Líder'),
  phone: opt(phone),
  email: opt(z.email()),
  publicPhone: z.boolean().default(false),
})
const communityBase = {
  name: z.string().trim().min(3).max(80),
  musical: z.enum(MUSICAL_IDS),
  city: z.string().trim().min(2).max(60),
  description: z.string().trim().max(1000).default(''),
  ...links,
}
const communityCreate = z.object({
  ...communityBase,
  parentId: opt(z.string()),
  leaders: z.array(leaderSchema).min(1, 'Agrega al menos un líder').max(20),
  acceptTerms: accepted,
})
const communityPatch = z.object(communityBase).partial()

const eventBase = {
  musical: z.enum(MUSICAL_IDS),
  type: z.enum(EVENT_TYPES),
  title: z.string().trim().min(4).max(100),
  description: z.string().trim().max(2000).default(''),
  city: z.string().trim().min(2).max(60),
  venue: z.string().trim().min(2).max(100),
  address: z.string().trim().max(160).default(''),
  lat: opt(z.number().min(-90).max(90)),
  lng: opt(z.number().min(-180).max(180)),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  price: z.number().int().min(0).max(5_000_000),
  capacity: z.number().int().min(1).max(100_000),
  organizer: z.string().trim().min(2).max(80),
  contactPhone: opt(phone),
  whatsapp: links.whatsapp,
  discord: links.discord,
}
const eventCreate = z.object({ ...eventBase, communityId: opt(z.string()), acceptTerms: accepted })
  .refine((e) => e.date >= today(), { message: 'La fecha debe ser hoy o futura', path: ['date'] })
const eventPatch = z.object(eventBase).partial()

const itemsSchema = z.array(z.object({ eventId: z.string(), qty: z.number().int().min(1).max(10) })).min(1).max(20)
const orderSchema = z.object({
  items: itemsSchema,
  buyer: z.object({ name: z.string().trim().min(3).max(80), email: z.email(), phone: opt(phone) }),
  consent: accepted,
  method: z.enum(['free', 'stripe', 'demo-card', 'demo-pse', 'demo-nequi', 'demo-paypal']),
  paymentIntentId: opt(z.string()),
  last4: opt(z.string().regex(/^\d{4}$/)),
})
const joinSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone,
  email: opt(z.email()),
  consent: accepted,
})

// ---------- helpers de datos ----------
const getKey = (req) => req.get('x-edit-key') || ''

function communityChain(cid) {
  const chain = []
  let cur = cid
  while (cur && chain.length < 10) {
    const c = db.prepare('SELECT id, parent_id, edit_key_hash FROM communities WHERE id = ?').get(cur)
    if (!c) break
    chain.push(c)
    cur = c.parent_id
  }
  return chain
}
// La llave de una comunidad o de cualquiera de sus comunidades padre da acceso.
const canEditCommunity = (cid, key) => !!key && communityChain(cid).some((c) => keyMatches(key, c.edit_key_hash))
function canEditEvent(ev, key) {
  if (!key) return false
  if (keyMatches(key, ev.edit_key_hash)) return true
  return ev.community_id ? canEditCommunity(ev.community_id, key) : false
}
function requireCommunity(idOrSlug) {
  const c = db.prepare('SELECT * FROM communities WHERE id = ? OR slug = ?').get(idOrSlug, idOrSlug)
  if (!c) throw new HttpError(404, 'Comunidad no encontrada')
  return c
}
function requireEvent(eid) {
  const e = db.prepare('SELECT * FROM events WHERE id = ?').get(eid)
  if (!e) throw new HttpError(404, 'Evento no encontrado')
  return e
}

const maskPhone = (p) => (p ? p.replace(/\d(?=(?:\D*\d){2})/g, (d, i) => (i < 6 ? d : '•')) : null)

const COMMUNITY_SELECT = `
  SELECT c.*, p.name AS parent_name, p.slug AS parent_slug,
    c.base_members + (SELECT COUNT(*) FROM members m WHERE m.community_id = c.id) AS member_count,
    (SELECT COUNT(*) FROM communities s WHERE s.parent_id = c.id) AS sub_count,
    (SELECT COUNT(*) FROM leaders l WHERE l.community_id = c.id) AS leader_count,
    (SELECT COUNT(*) FROM events e WHERE e.community_id = c.id AND e.date >= date('now')) AS event_count
  FROM communities c LEFT JOIN communities p ON p.id = c.parent_id`

function publicCommunity(c) {
  return {
    id: c.id, slug: c.slug, parentId: c.parent_id, parentName: c.parent_name ?? null, parentSlug: c.parent_slug ?? null,
    name: c.name, musical: c.musical, city: c.city, description: c.description,
    whatsapp: c.whatsapp, discord: c.discord, instagram: c.instagram, telegram: c.telegram,
    memberCount: c.member_count, subCount: c.sub_count, leaderCount: c.leader_count, eventCount: c.event_count,
    createdAt: c.created_at,
  }
}

const EVENT_SELECT = `SELECT e.*, c.name AS community_name, c.slug AS community_slug FROM events e LEFT JOIN communities c ON c.id = e.community_id`
function publicEvent(e) {
  return {
    id: e.id, communityId: e.community_id, communityName: e.community_name ?? null, communitySlug: e.community_slug ?? null,
    musical: e.musical, type: e.type, title: e.title, description: e.description,
    city: e.city, venue: e.venue, address: e.address, lat: e.lat, lng: e.lng,
    date: e.date, time: e.time, price: e.price, capacity: e.capacity, sold: e.sold,
    organizer: e.organizer, contactPhone: e.contact_phone, whatsapp: e.whatsapp, discord: e.discord,
  }
}

function quote(items) {
  const lines = items.map(({ eventId, qty }) => {
    const e = requireEvent(eventId)
    return { event: e, qty, lineTotal: e.price * qty }
  })
  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0)
  const fee = Math.round(subtotal * FEE_RATE)
  return { lines, subtotal, fee, total: subtotal + fee }
}

// ---------- rutas ----------
const api = express.Router()

api.get('/config', (_req, res) => {
  res.json({
    stripe: !!stripe,
    publishableKey: stripe ? process.env.VITE_STRIPE_PUBLISHABLE_KEY || null : null,
    demoPayments: DEMO_PAYMENTS,
    feeRate: FEE_RATE,
  })
})

api.get('/stats', (_req, res) => {
  const q = (sql) => Object.values(db.prepare(sql).get())[0]
  res.json({
    events: q(`SELECT COUNT(*) FROM events WHERE date >= date('now')`),
    cities: q(`SELECT COUNT(DISTINCT city) FROM events`),
    communities: q(`SELECT COUNT(*) FROM communities`),
    members: q(`SELECT (SELECT COALESCE(SUM(base_members),0) FROM communities) + (SELECT COUNT(*) FROM members)`),
  })
})

api.get('/cities', (_req, res) => {
  const rows = db.prepare(`SELECT city FROM events UNION SELECT city FROM communities ORDER BY city`).all()
  res.json(rows.map((r) => r.city))
})

// Comunidades
api.get('/communities', (req, res) => {
  const { musical, city, q, parent } = req.query
  const where = []
  const args = []
  if (musical) { where.push('c.musical = ?'); args.push(musical) }
  if (city) { where.push('c.city = ?'); args.push(city) }
  if (q) { where.push('(c.name LIKE ? OR c.description LIKE ?)'); args.push(`%${q}%`, `%${q}%`) }
  if (parent === 'root') where.push('c.parent_id IS NULL')
  else if (parent) { where.push('c.parent_id = ?'); args.push(parent) }
  const rows = db.prepare(`${COMMUNITY_SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY member_count DESC`).all(...args)
  res.json(rows.map(publicCommunity))
})

api.get('/communities/:slug', (req, res) => {
  const base = requireCommunity(req.params.slug)
  const c = db.prepare(`${COMMUNITY_SELECT} WHERE c.id = ?`).get(base.id)
  const canEdit = canEditCommunity(c.id, getKey(req))
  const leaders = db.prepare('SELECT * FROM leaders WHERE community_id = ? ORDER BY created_at').all(c.id).map((l) => ({
    id: l.id, name: l.name, role: l.role,
    phone: canEdit || l.public_phone ? l.phone : maskPhone(l.phone),
    phoneVisible: !!(canEdit || l.public_phone),
    email: canEdit ? l.email : null,
    publicPhone: !!l.public_phone,
  }))
  const children = db.prepare(`${COMMUNITY_SELECT} WHERE c.parent_id = ? ORDER BY member_count DESC`).all(c.id).map(publicCommunity)
  const events = db.prepare(`${EVENT_SELECT} WHERE e.community_id IN (SELECT id FROM communities WHERE id = ? OR parent_id = ?) AND e.date >= date('now') ORDER BY e.date, e.time`).all(c.id, c.id).map(publicEvent)
  res.json({ ...publicCommunity(c), leaders, children, events, canEdit })
})

api.post('/communities', writeLimiter, (req, res) => {
  const data = communityCreate.parse(req.body)
  if (data.parentId) {
    requireCommunity(data.parentId)
    if (!canEditCommunity(data.parentId, getKey(req))) throw new HttpError(403, 'Solo los líderes de la comunidad principal pueden crear subcomunidades')
  }
  let slug = slugify(`${data.name}-${data.city}`)
  if (db.prepare('SELECT 1 FROM communities WHERE slug = ?').get(slug)) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`
  const cid = id('c')
  const editKey = newKey()
  tx(() => {
    db.prepare(`INSERT INTO communities (id, slug, parent_id, name, musical, city, description, whatsapp, discord, instagram, telegram, edit_key_hash, terms_accepted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
      .run(cid, slug, data.parentId, data.name, data.musical, data.city, data.description, data.whatsapp, data.discord, data.instagram, data.telegram, hash(editKey), now())
    const il = db.prepare('INSERT INTO leaders (id, community_id, name, role, phone, email, public_phone) VALUES (?,?,?,?,?,?,?)')
    for (const l of data.leaders) il.run(id('l'), cid, l.name, l.role, l.phone, l.email, l.publicPhone ? 1 : 0)
  })
  res.status(201).json({ id: cid, slug, editKey })
})

api.patch('/communities/:id', writeLimiter, (req, res) => {
  const c = requireCommunity(req.params.id)
  if (!canEditCommunity(c.id, getKey(req))) throw new HttpError(403, 'Llave de líder inválida')
  const data = communityPatch.parse(req.body)
  const cols = Object.keys(data)
  if (cols.length) db.prepare(`UPDATE communities SET ${cols.map((k) => `${k} = ?`).join(', ')} WHERE id = ?`).run(...cols.map((k) => data[k]), c.id)
  res.json({ ok: true })
})

api.delete('/communities/:id', writeLimiter, (req, res) => {
  const c = requireCommunity(req.params.id)
  if (!canEditCommunity(c.id, getKey(req))) throw new HttpError(403, 'Llave de líder inválida')
  db.prepare('DELETE FROM communities WHERE id = ?').run(c.id)
  res.json({ ok: true })
})

api.post('/communities/:id/verify', (req, res) => {
  const c = requireCommunity(req.params.id)
  res.json({ ok: canEditCommunity(c.id, getKey(req)) })
})

api.post('/communities/:id/leaders', writeLimiter, (req, res) => {
  const c = requireCommunity(req.params.id)
  if (!canEditCommunity(c.id, getKey(req))) throw new HttpError(403, 'Llave de líder inválida')
  const l = leaderSchema.parse(req.body)
  const lid = id('l')
  db.prepare('INSERT INTO leaders (id, community_id, name, role, phone, email, public_phone) VALUES (?,?,?,?,?,?,?)').run(lid, c.id, l.name, l.role, l.phone, l.email, l.publicPhone ? 1 : 0)
  res.status(201).json({ id: lid })
})

api.delete('/communities/:id/leaders/:leaderId', writeLimiter, (req, res) => {
  const c = requireCommunity(req.params.id)
  if (!canEditCommunity(c.id, getKey(req))) throw new HttpError(403, 'Llave de líder inválida')
  db.prepare('DELETE FROM leaders WHERE id = ? AND community_id = ?').run(req.params.leaderId, c.id)
  res.json({ ok: true })
})

api.post('/communities/:id/join', writeLimiter, (req, res) => {
  const c = requireCommunity(req.params.id)
  const m = joinSchema.parse(req.body)
  db.prepare(`INSERT INTO members (id, community_id, name, phone, email, consent_at) VALUES (?,?,?,?,?,?)
    ON CONFLICT (community_id, phone) DO UPDATE SET name = excluded.name, email = excluded.email, consent_at = excluded.consent_at`)
    .run(id('m'), c.id, m.name, m.phone, m.email, now())
  res.status(201).json({ ok: true, whatsapp: c.whatsapp, discord: c.discord, telegram: c.telegram })
})

api.get('/communities/:id/members', (req, res) => {
  const c = requireCommunity(req.params.id)
  if (!canEditCommunity(c.id, getKey(req))) throw new HttpError(403, 'Llave de líder inválida')
  const rows = db.prepare('SELECT name, phone, email, consent_at, created_at FROM members WHERE community_id = ? ORDER BY created_at DESC').all(c.id)
  if (req.query.format === 'csv') {
    const cell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const csv = ['nombre,telefono,email,autorizacion_datos,fecha_registro', ...rows.map((r) => [r.name, r.phone, r.email, r.consent_at, r.created_at].map(cell).join(','))].join('\n')
    res.type('text/csv').attachment(`miembros-${c.slug}.csv`).send('﻿' + csv)
    return
  }
  res.json(rows)
})

// Eventos
api.get('/events', (req, res) => {
  const { musical, city, type, q, community, past } = req.query
  const where = past ? [] : [`e.date >= date('now')`]
  const args = []
  if (musical) { where.push('e.musical = ?'); args.push(musical) }
  if (city) { where.push('e.city = ?'); args.push(city) }
  if (type) { where.push('e.type = ?'); args.push(type) }
  if (community) { where.push('e.community_id = ?'); args.push(community) }
  if (q) { where.push('(e.title LIKE ? OR e.venue LIKE ? OR e.organizer LIKE ? OR e.city LIKE ?)'); args.push(...Array(4).fill(`%${q}%`)) }
  const rows = db.prepare(`${EVENT_SELECT} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY e.date, e.time`).all(...args)
  res.json(rows.map(publicEvent))
})

api.get('/events/:id', (req, res) => {
  const e = db.prepare(`${EVENT_SELECT} WHERE e.id = ?`).get(req.params.id)
  if (!e) throw new HttpError(404, 'Evento no encontrado')
  res.json({ ...publicEvent(e), canEdit: canEditEvent(e, getKey(req)) })
})

api.post('/events', writeLimiter, (req, res) => {
  const data = eventCreate.parse(req.body)
  if (data.communityId) {
    requireCommunity(data.communityId)
    if (!canEditCommunity(data.communityId, getKey(req))) throw new HttpError(403, 'Solo los líderes pueden publicar eventos a nombre de la comunidad')
  }
  const eid = id('e')
  const editKey = newKey()
  db.prepare(`INSERT INTO events (id, community_id, musical, type, title, description, city, venue, address, lat, lng, date, time, price, capacity, organizer, contact_phone, whatsapp, discord, edit_key_hash, terms_accepted_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .run(eid, data.communityId, data.musical, data.type, data.title, data.description, data.city, data.venue, data.address, data.lat, data.lng, data.date, data.time, data.price, data.capacity, data.organizer, data.contactPhone, data.whatsapp, data.discord, hash(editKey), now())
  res.status(201).json({ id: eid, editKey })
})

api.patch('/events/:id', writeLimiter, (req, res) => {
  const e = requireEvent(req.params.id)
  if (!canEditEvent(e, getKey(req))) throw new HttpError(403, 'Llave inválida')
  const data = eventPatch.parse(req.body)
  if (data.capacity !== undefined && data.capacity < e.sold) throw new HttpError(400, `Ya hay ${e.sold} boletas vendidas`)
  const map = { contactPhone: 'contact_phone' }
  const cols = Object.keys(data)
  if (cols.length) db.prepare(`UPDATE events SET ${cols.map((k) => `${map[k] || k} = ?`).join(', ')} WHERE id = ?`).run(...cols.map((k) => data[k]), e.id)
  res.json({ ok: true })
})

api.delete('/events/:id', writeLimiter, (req, res) => {
  const e = requireEvent(req.params.id)
  if (!canEditEvent(e, getKey(req))) throw new HttpError(403, 'Llave inválida')
  if (e.sold > 0 && db.prepare('SELECT 1 FROM tickets WHERE event_id = ?').get(e.id)) throw new HttpError(409, 'El evento tiene boletas vendidas; contacta a soporte para cancelarlo y reembolsar')
  db.prepare('DELETE FROM events WHERE id = ?').run(e.id)
  res.json({ ok: true })
})

// Pagos y órdenes
api.post('/checkout/quote', (req, res) => {
  const { subtotal, fee, total } = quote(itemsSchema.parse(req.body.items))
  res.json({ subtotal, fee, total })
})

api.post('/payments/intent', writeLimiter, async (req, res) => {
  if (!stripe) throw new HttpError(400, 'Stripe no está configurado')
  const { total } = quote(itemsSchema.parse(req.body.items))
  if (total <= 0) throw new HttpError(400, 'La orden es gratuita')
  const intent = await stripe.paymentIntents.create({
    amount: total * 100, // COP se expresa con dos decimales en Stripe
    currency: 'cop',
    automatic_payment_methods: { enabled: true },
    metadata: { items: JSON.stringify(req.body.items).slice(0, 480) },
  })
  res.json({ clientSecret: intent.client_secret, id: intent.id })
})

api.post('/orders', writeLimiter, async (req, res) => {
  const data = orderSchema.parse(req.body)
  const q = quote(data.items)

  let paymentRef = null
  if (q.total === 0) {
    if (data.method !== 'free') throw new HttpError(400, 'Método inválido para una orden gratuita')
  } else if (data.method === 'stripe') {
    if (!stripe || !data.paymentIntentId) throw new HttpError(400, 'Pago no verificado')
    const pi = await stripe.paymentIntents.retrieve(data.paymentIntentId)
    if (pi.status !== 'succeeded' || pi.amount !== q.total * 100) throw new HttpError(402, 'El pago no se completó')
    if (db.prepare('SELECT 1 FROM orders WHERE payment_ref = ?').get(pi.id)) throw new HttpError(409, 'Este pago ya fue usado')
    paymentRef = pi.id
  } else if (data.method.startsWith('demo-')) {
    if (!DEMO_PAYMENTS) throw new HttpError(400, 'Los pagos de demostración están desactivados')
    paymentRef = `demo_${data.method.slice(5)}${data.last4 ? '_' + data.last4 : ''}_${Date.now()}`
  } else {
    throw new HttpError(400, 'Método de pago inválido')
  }

  const orderId = 'ORD-' + Date.now().toString(36).toUpperCase()
  const tickets = tx(() => {
    for (const l of q.lines) {
      const fresh = db.prepare('SELECT capacity, sold, title FROM events WHERE id = ?').get(l.event.id)
      if (fresh.sold + l.qty > fresh.capacity) throw new HttpError(409, `No quedan suficientes cupos para "${fresh.title}"`)
    }
    db.prepare('INSERT INTO orders (id, name, email, phone, subtotal, fee, total, method, payment_ref, status, consent_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
      .run(orderId, data.buyer.name, data.buyer.email.toLowerCase(), data.buyer.phone, q.subtotal, q.fee, q.total, data.method, paymentRef, 'paid', now())
    const it = db.prepare('INSERT INTO tickets (code, order_id, event_id, holder, price) VALUES (?,?,?,?,?)')
    const out = []
    for (const l of q.lines) {
      db.prepare('UPDATE events SET sold = sold + ? WHERE id = ?').run(l.qty, l.event.id)
      for (let i = 0; i < l.qty; i++) {
        const code = ticketCode()
        it.run(code, orderId, l.event.id, data.buyer.name, l.event.price)
        out.push({ code, orderId, eventId: l.event.id, title: l.event.title, date: l.event.date, time: l.event.time, city: l.event.city, venue: l.event.venue, holder: data.buyer.name, price: l.event.price })
      }
    }
    return out
  })
  res.status(201).json({ orderId, total: q.total, tickets })
})

api.get('/tickets', (req, res) => {
  const email = String(req.query.email || '').toLowerCase()
  const order = String(req.query.order || '').toUpperCase()
  if (!email || !order) throw new HttpError(400, 'Indica correo y número de orden')
  const rows = db.prepare(`SELECT t.code, t.order_id, t.event_id, t.holder, t.price, e.title, e.date, e.time, e.city, e.venue
    FROM tickets t JOIN orders o ON o.id = t.order_id JOIN events e ON e.id = t.event_id WHERE o.email = ? AND o.id = ?`).all(email, order)
  res.json(rows.map((r) => ({ code: r.code, orderId: r.order_id, eventId: r.event_id, holder: r.holder, price: r.price, title: r.title, date: r.date, time: r.time, city: r.city, venue: r.venue })))
})

api.use((_req, _res, next) => next(new HttpError(404, 'Ruta no encontrada')))

app.use('/api', api)

// En producción servimos el frontend compilado.
const dist = resolve('dist')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(resolve(dist, 'index.html')))
}

app.use((err, _req, res, _next) => {
  if (err instanceof z.ZodError) {
    const issue = err.issues[0]
    return res.status(400).json({ error: issue.message, field: issue.path.join('.'), issues: err.issues })
  }
  if (err instanceof HttpError) return res.status(err.status).json({ error: err.message })
  console.error(err)
  res.status(500).json({ error: 'Error interno del servidor' })
})

app.listen(PORT, () => console.log(`API de Épico en http://localhost:${PORT}`))
