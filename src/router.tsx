import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import { Loading } from './components/ui'

// Cada página se carga bajo demanda (mapas y pagos solo cuando se necesitan).
const page = (load: () => Promise<{ default: React.ComponentType }>) => () => load().then((m) => ({ Component: m.default }))

export const router = createBrowserRouter([
  {
    element: <Layout />,
    hydrateFallbackElement: <Loading />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/eventos', lazy: page(() => import('./pages/Events')) },
      { path: '/eventos/nuevo', lazy: page(() => import('./pages/EventNew')) },
      { path: '/eventos/:id', lazy: page(() => import('./pages/EventDetail')) },
      { path: '/comunidades', lazy: page(() => import('./pages/Communities')) },
      { path: '/comunidades/nueva', lazy: page(() => import('./pages/CommunityNew')) },
      { path: '/comunidades/:slug', lazy: page(() => import('./pages/CommunityDetail')) },
      { path: '/checkout', lazy: page(() => import('./pages/Checkout')) },
      { path: '/mis-boletas', lazy: page(() => import('./pages/MyTickets')) },
      { path: '/panel', lazy: page(() => import('./pages/Panel')) },
      { path: '/terminos', lazy: () => import('./pages/Legal').then((m) => ({ Component: m.Terms })) },
      { path: '/privacidad', lazy: () => import('./pages/Legal').then((m) => ({ Component: m.Privacy })) },
      { path: '*', lazy: page(() => import('./pages/NotFound')) },
    ],
  },
])
