import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })

export const money = (n: number) => (n === 0 ? 'Gratis' : cop.format(n))
export const eventDate = (date: string, time: string) => parseISO(`${date}T${time}`)
export const fmtDate = (date: string, time: string, pattern = "EEEE d 'de' MMMM · h:mm a") =>
  format(eventDate(date, time), pattern, { locale: es })
export const dayNum = (date: string) => format(parseISO(date), 'd')
export const monthShort = (date: string) => format(parseISO(date), 'MMM', { locale: es }).replace('.', '')
export const uid = (p: string) => `${p}-${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`
