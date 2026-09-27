import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MusicalIcon } from '../art/Art'
import { money, monthShort, dayNum } from '../lib/format'
import { musicalById } from '../lib/musicals'
import { useStore } from '../lib/store'
import { FEE_RATE } from './ui'

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, setQty, removeFromCart } = useStore()
  const navigate = useNavigate()
  const subtotal = cart.reduce((s, l) => s + l.price * l.qty, 0)
  const fee = Math.round(subtotal * FEE_RATE)

  return (
    <Dialog.Root open={cartOpen} onOpenChange={setCartOpen}>
      <AnimatePresence>
        {cartOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount>
              <motion.aside
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-paper shadow-2xl"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              >
                <div className="flex items-center justify-between bg-ultra px-6 py-5 text-paper">
                  <div>
                    <p className="font-hand text-xl text-feather">tu carrito</p>
                    <Dialog.Title className="h-display text-2xl">Boletas</Dialog.Title>
                  </div>
                  <Dialog.Close className="rounded-full p-2 hover:bg-paper/10" aria-label="Cerrar carrito"><X /></Dialog.Close>
                </div>
                <Dialog.Description className="sr-only">Revisa las boletas antes de pagar</Dialog.Description>

                <div className="flex-1 space-y-3 overflow-y-auto p-6">
                  {cart.length === 0 && (
                    <div className="py-16 text-center">
                      <p className="font-hand text-3xl text-terra">Aún no hay boletas</p>
                      <p className="mt-2 text-ink/60">Explora los eventos y elige tu próxima función.</p>
                      <button className="btn btn-gold mt-6" onClick={() => { setCartOpen(false); navigate('/eventos') }}>Ver eventos</button>
                    </div>
                  )}
                  {cart.map((l) => {
                    const m = musicalById(l.musical)
                    return (
                      <div key={l.eventId} className="wobble-2 flex gap-4 bg-paper-2 p-4">
                        <div className="wobble grid w-16 shrink-0 place-items-center py-2" style={{ background: m.color, color: m.fg }}>
                          <MusicalIcon id={m.id} className="size-7" />
                          <span className="text-xs font-bold uppercase">{dayNum(l.date)} {monthShort(l.date)}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-bold">{l.title}</p>
                          <p className="text-sm text-ink/60">{l.city} · {money(l.price)}</p>
                          <div className="mt-2 flex items-center gap-2">
                            <button className="rounded-full border-2 border-ink/20 p-1 hover:bg-ink hover:text-paper" onClick={() => setQty(l.eventId, l.qty - 1)} aria-label="Quitar una"><Minus className="size-3.5" /></button>
                            <span className="w-6 text-center font-bold">{l.qty}</span>
                            <button className="rounded-full border-2 border-ink/20 p-1 hover:bg-ink hover:text-paper" onClick={() => setQty(l.eventId, l.qty + 1)} aria-label="Agregar una"><Plus className="size-3.5" /></button>
                            <button className="ml-auto p-1 text-terra" onClick={() => removeFromCart(l.eventId)} aria-label="Eliminar"><Trash2 className="size-4" /></button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {cart.length > 0 && (
                  <div className="border-t-2 border-ink/10 p-6">
                    <dl className="space-y-1 text-sm">
                      <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
                      <div className="flex justify-between text-ink/60"><dt>Tarifa de servicio ({FEE_RATE * 100}%)</dt><dd>{money(fee)}</dd></div>
                      <div className="flex justify-between pt-2 text-lg font-extrabold"><dt>Total</dt><dd>{money(subtotal + fee)}</dd></div>
                    </dl>
                    <button className="btn btn-primary mt-4 w-full" onClick={() => { setCartOpen(false); navigate('/checkout') }}>
                      Ir a pagar
                    </button>
                  </div>
                )}
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
