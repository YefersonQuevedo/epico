import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Ticket } from './types'

export interface CartLine { eventId: string; qty: number; title: string; price: number; date: string; city: string; musical: string }

interface State {
  cart: CartLine[]
  cartOpen: boolean
  tickets: Ticket[]
  /** llaves de líder por id de comunidad */
  keys: Record<string, string>
  /** llaves de edición por id de evento */
  eventKeys: Record<string, string>
  joined: string[]
  addToCart: (line: Omit<CartLine, 'qty'>, qty?: number, max?: number) => boolean
  setQty: (eventId: string, qty: number) => void
  removeFromCart: (eventId: string) => void
  clearCart: () => void
  setCartOpen: (v: boolean) => void
  addTickets: (t: Ticket[]) => void
  saveKey: (communityId: string, key: string) => void
  forgetKey: (communityId: string) => void
  saveEventKey: (eventId: string, key: string) => void
  markJoined: (communityId: string) => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],
      cartOpen: false,
      tickets: [],
      keys: {},
      eventKeys: {},
      joined: [],
      addToCart: (line, qty = 1, max = 10) => {
        const cur = get().cart.find((l) => l.eventId === line.eventId)?.qty ?? 0
        const next = Math.min(cur + qty, max, 10)
        if (next === cur) return false
        set((s) => ({
          cart: cur ? s.cart.map((l) => (l.eventId === line.eventId ? { ...l, qty: next } : l)) : [...s.cart, { ...line, qty: next }],
        }))
        return true
      },
      setQty: (eventId, qty) =>
        set((s) => ({ cart: qty <= 0 ? s.cart.filter((l) => l.eventId !== eventId) : s.cart.map((l) => (l.eventId === eventId ? { ...l, qty: Math.min(qty, 10) } : l)) })),
      removeFromCart: (eventId) => set((s) => ({ cart: s.cart.filter((l) => l.eventId !== eventId) })),
      clearCart: () => set({ cart: [] }),
      setCartOpen: (cartOpen) => set({ cartOpen }),
      addTickets: (t) => set((s) => ({ tickets: [...t, ...s.tickets.filter((x) => !t.some((y) => y.code === x.code))] })),
      saveKey: (id, key) => set((s) => ({ keys: { ...s.keys, [id]: key } })),
      forgetKey: (id) => set((s) => { const keys = { ...s.keys }; delete keys[id]; return { keys } }),
      saveEventKey: (id, key) => set((s) => ({ eventKeys: { ...s.eventKeys, [id]: key } })),
      markJoined: (id) => set((s) => ({ joined: s.joined.includes(id) ? s.joined : [...s.joined, id] })),
    }),
    { name: 'epico', partialize: ({ cartOpen: _c, ...rest }) => rest },
  ),
)

export const cartCount = (s: State) => s.cart.reduce((n, l) => n + l.qty, 0)
