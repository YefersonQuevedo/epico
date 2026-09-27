// Validaciones del lado del cliente para el modo demo. En producción, la tarjeta la
// captura el componente seguro de la pasarela (Stripe Payment Element) y nunca toca
// nuestro servidor.
export const digits = (s: string) => s.replace(/\D/g, '')

export function luhn(num: string) {
  const d = digits(num)
  if (d.length < 12) return false
  let sum = 0
  for (let i = 0; i < d.length; i++) {
    let n = +d[d.length - 1 - i]
    if (i % 2) { n *= 2; if (n > 9) n -= 9 }
    sum += n
  }
  return sum % 10 === 0
}

export function cardBrand(num: string) {
  const d = digits(num)
  if (/^4/.test(d)) return 'Visa'
  if (/^(5[1-5]|2[2-7])/.test(d)) return 'Mastercard'
  if (/^3[47]/.test(d)) return 'Amex'
  if (/^(36|38|30[0-5])/.test(d)) return 'Diners'
  return ''
}

export const formatCard = (v: string) => digits(v).slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
export const formatExp = (v: string) => {
  const d = digits(v).slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

export function expValid(exp: string) {
  const m = /^(\d{2})\/(\d{2})$/.exec(exp)
  if (!m || +m[1] < 1 || +m[1] > 12) return false
  return new Date(2000 + +m[2], +m[1], 1) > new Date()
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

/** Simula la respuesta de una pasarela: 4000 0000 0000 0002 es rechazada. */
export async function demoAuthorize(method: string, data: Record<string, string>) {
  await wait(1300)
  if (method === 'demo-card' && digits(data.number ?? '').endsWith('0002')) throw new Error('Tu banco rechazó la transacción. Prueba con otra tarjeta.')
  if (method === 'demo-nequi' && !/^3\d{9}$/.test(digits(data.phone ?? ''))) throw new Error('El número Nequi debe tener 10 dígitos y empezar por 3.')
}
