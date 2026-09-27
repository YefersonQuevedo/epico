import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Search } from 'lucide-react'
import { Bird } from '../art/Art'
import { useTicketLookup } from '../lib/api'
import { useStore } from '../lib/store'
import { Empty, PageHeader } from '../components/ui'
import { TicketCard } from '../components/TicketCard'

export default function MyTickets() {
  const tickets = useStore((s) => s.tickets)
  const addTickets = useStore((s) => s.addTickets)
  const lookup = useTicketLookup()
  const [email, setEmail] = useState('')
  const [order, setOrder] = useState('')

  const find = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const found = await lookup.mutateAsync({ email: email.trim(), order: order.trim() })
      if (!found.length) toast('No encontramos boletas con esos datos')
      else { addTickets(found); toast.success(`${found.length} boleta(s) recuperadas`) }
    } catch (err) {
      toast.error((err as Error).message)
    }
  }

  const upcoming = [...tickets].sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))

  return (
    <>
      <PageHeader kicker="tu pase de abordar" title="Mis boletas" art={<Bird className="float w-52" />}>
        Presenta el código QR en la entrada. Si compraste en otro dispositivo, recupera tus boletas con tu correo y número de orden.
      </PageHeader>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <form onSubmit={find} className="wobble-2 grid gap-3 bg-paper-2 p-4 sm:grid-cols-[1fr_1fr_auto]">
          <input className="input" type="email" required placeholder="Correo de la compra" value={email} onChange={(e) => setEmail(e.target.value)} aria-label="Correo" />
          <input className="input uppercase" required placeholder="Número de orden (ORD-…)" value={order} onChange={(e) => setOrder(e.target.value)} aria-label="Número de orden" />
          <button className="btn btn-primary" disabled={lookup.isPending}><Search className="size-4" /> Recuperar</button>
        </form>
        <div className="mt-10">
          {upcoming.length ? (
            <div className="grid gap-6 md:grid-cols-2">{upcoming.map((t) => <TicketCard key={t.code} t={t} />)}</div>
          ) : (
            <Empty title="Aún no tienes boletas">
              <Link to="/eventos" className="font-bold text-ultra underline">Encuentra tu próximo evento</Link>
            </Empty>
          )}
        </div>
      </div>
    </>
  )
}
