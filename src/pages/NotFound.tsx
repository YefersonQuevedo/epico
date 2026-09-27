import { Link } from 'react-router-dom'
import { Bird, Cloud } from '../art/Art'

export default function NotFound() {
  return (
    <div className="relative mx-auto grid max-w-3xl place-items-center px-4 py-28 text-center">
      <Cloud className="absolute top-10 w-80 opacity-60" />
      <Bird className="float relative w-40" />
      <p className="kicker relative mt-6">perdidos en el mar</p>
      <h1 className="h-display relative text-6xl text-ultra">404</h1>
      <p className="relative mt-3 text-lg text-ink/70">Esta página se fue con Poseidón. Volvamos a Ítaca.</p>
      <Link to="/" className="btn btn-primary relative mt-8">Volver al inicio</Link>
    </div>
  )
}
