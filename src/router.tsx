import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import EventNew from './pages/EventNew'
import Communities from './pages/Communities'
import CommunityDetail from './pages/CommunityDetail'
import CommunityNew from './pages/CommunityNew'
import Checkout from './pages/Checkout'
import MyTickets from './pages/MyTickets'
import Panel from './pages/Panel'
import { Privacy, Terms } from './pages/Legal'
import NotFound from './pages/NotFound'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/eventos', element: <Events /> },
      { path: '/eventos/nuevo', element: <EventNew /> },
      { path: '/eventos/:id', element: <EventDetail /> },
      { path: '/comunidades', element: <Communities /> },
      { path: '/comunidades/nueva', element: <CommunityNew /> },
      { path: '/comunidades/:slug', element: <CommunityDetail /> },
      { path: '/checkout', element: <Checkout /> },
      { path: '/mis-boletas', element: <MyTickets /> },
      { path: '/panel', element: <Panel /> },
      { path: '/terminos', element: <Terms /> },
      { path: '/privacidad', element: <Privacy /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
