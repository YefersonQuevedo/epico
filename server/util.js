import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'

export const MUSICAL_IDS = ['epic', 'hamilton', 'six', 'hadestown', 'heathers', 'cyclone']
export const EVENT_TYPES = ['Sing-along', 'Watch party', 'Cosplay', 'Meetup', 'Trivia', 'Función']
export const FEE_RATE = 0.05

export const hash = (s) => createHash('sha256').update(String(s)).digest('hex')
export const newKey = () => randomBytes(18).toString('base64url')
export const id = (p) => `${p}_${randomBytes(6).toString('hex')}`
export const ticketCode = () => 'EPC-' + randomBytes(4).toString('hex').toUpperCase()

export function keyMatches(key, storedHash) {
  if (!key || !storedHash) return false
  const a = Buffer.from(hash(key), 'hex')
  const b = Buffer.from(storedHash, 'hex')
  return a.length === b.length && timingSafeEqual(a, b)
}

export function slugify(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'comunidad'
}
