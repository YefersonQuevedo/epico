import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Menu, ShoppingBag, Ticket, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import clsx from 'clsx'
import { ArtDefs, Bird, Meander } from '../art/Art'
import { SIGNS, Sign } from '../art/Gods'
import { cartCount, useStore } from '../lib/store'
import CartDrawer from './CartDrawer'

const NAV = [
  { to: '/eventos', label: 'Eventos' },
  { to: '/comunidades', label: 'Comunidades' },
  { to: '/eventos/nuevo', label: 'Organizar' },
  { to: '/panel', label: 'Panel de líderes' },
]

export function Logo({ light }: { light?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2" aria-label="Épico, inicio">
      <Bird className="h-9 w-12 transition group-hover:-translate-y-0.5 group-hover:-rotate-6" />
      <span className={clsx('h-display text-2xl tracking-[0.12em]', light ? 'text-paper' : 'text-ultra')}>ÉPICO</span>
    </Link>
  )
}

function Navbar() {
  const [open, setOpen] = useState(false)
  const count = useStore(cartCount)
  const setCartOpen = useStore((s) => s.setCartOpen)
  const { pathname } = useLocation()
  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink/10 bg-paper/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Principal">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end
              className={({ isActive }) =>
                clsx('wobble px-4 py-2 text-sm font-bold transition', isActive ? 'bg-ultra text-paper' : 'hover:bg-cloud/60')
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/mis-boletas" className="wobble hidden items-center gap-2 px-3 py-2 text-sm font-bold hover:bg-cloud/60 sm:flex">
            <Ticket className="size-4" /> Mis boletas
          </Link>
          <button onClick={() => setCartOpen(true)} className="btn btn-primary relative !px-4 !py-2" aria-label={`Carrito, ${count} boletas`}>
            <ShoppingBag className="size-5" />
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -right-2 -top-2 grid size-6 place-items-center rounded-full bg-terra text-xs text-paper"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button className="p-2 lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menú" aria-expanded={open}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t-2 border-ink/10 lg:hidden"
          >
            <div className="grid gap-1 p-4">
              {[...NAV, { to: '/mis-boletas', label: 'Mis boletas' }].map((n) => (
                <NavLink key={n.to} to={n.to} end className={({ isActive }) => clsx('wobble px-4 py-3 font-bold', isActive ? 'bg-ultra text-paper' : 'bg-paper-2')}>
                  {n.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}

function Footer() {
  return (
    <footer className="mt-24 bg-ultra text-paper">
      <Meander color="#d8b77e" />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-md text-paper/80">
            La casa de los fans de los musicales en Latinoamérica. Comunidades, sing-alongs, watch parties y boletas, todo en un solo lugar.
          </p>
          <p className="mt-6 max-w-md text-xs text-paper/60">
            Épico es una plataforma hecha por y para fans. No está afiliada, patrocinada ni respaldada por los creadores, productores o titulares de derechos de
            EPIC: The Musical, Hamilton, SIX, Hadestown, Heathers, Ride the Cyclone ni ningún otro musical mencionado. Todas las marcas pertenecen a sus dueños.
          </p>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-feather">Explora</h3>
          <ul className="mt-3 grid gap-2 text-paper/85">
            <li><Link className="hover:text-cloud" to="/eventos">Eventos</Link></li>
            <li><Link className="hover:text-cloud" to="/comunidades">Comunidades</Link></li>
            <li><Link className="hover:text-cloud" to="/comunidades/nueva">Crear comunidad</Link></li>
            <li><Link className="hover:text-cloud" to="/eventos/nuevo">Organizar evento</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-feather">Legal</h3>
          <ul className="mt-3 grid gap-2 text-paper/85">
            <li><Link className="hover:text-cloud" to="/terminos">Términos y condiciones</Link></li>
            <li><Link className="hover:text-cloud" to="/privacidad">Política de tratamiento de datos</Link></li>
            <li><Link className="hover:text-cloud" to="/privacidad#derechos">Ejercer tus derechos (habeas data)</Link></li>
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-6 pb-8 text-feather/60">
        {SIGNS.map((id) => <Sign key={id} id={id} className="size-7" />)}
      </div>
      <div className="border-t border-paper/15 py-5 text-center text-xs text-paper/60">© {new Date().getFullYear()} Épico · Hecho con plumas, nubes y muchas ganas de cantar.</div>
    </footer>
  )
}

export default function Layout() {
  return (
    <>
      <ArtDefs />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ultra focus:p-3 focus:text-paper">
        Saltar al contenido
      </a>
      <Navbar />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <Toaster position="bottom-center" toastOptions={{ style: { background: '#141a4d', color: '#f3ede1', border: 'none', borderRadius: '18px 4px 18px 4px', fontFamily: 'Karla' } }} />
      <ScrollRestoration />
    </>
  )
}
