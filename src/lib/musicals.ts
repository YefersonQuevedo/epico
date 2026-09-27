import type { Musical, MusicalId } from './types'

export const MUSICALS: Musical[] = [
  { id: 'epic', name: 'EPIC: The Musical', tagline: 'La odisea de Odiseo', blurb: 'Nueve sagas, un regreso a Ítaca. Troya, el Cíclope, Poseidón y un corazón que no se rinde.', color: '#2536b8', fg: '#f3ede1' },
  { id: 'hamilton', name: 'Hamilton', tagline: 'Rap, historia y revolución', blurb: 'Un inmigrante huérfano que escribe como si se le acabara el tiempo. Rise up.', color: '#d8b77e', fg: '#141a4d' },
  { id: 'six', name: 'SIX', tagline: 'Seis reinas, un concierto', blurb: 'Las esposas de Enrique VIII toman el micrófono y reescriben su historia en clave pop.', color: '#eeb1a3', fg: '#141a4d' },
  { id: 'hadestown', name: 'Hadestown', tagline: 'El camino al inframundo', blurb: 'Orfeo, Eurídice y un tren que baja a la fábrica de Hades. Una canción de amor antigua.', color: '#c2462f', fg: '#f3ede1' },
  { id: 'heathers', name: 'Heathers', tagline: 'Big fun en Westerberg High', blurb: 'Comedia oscura de secundaria: croquet, slushies y la búsqueda de ser alguien.', color: '#17217a', fg: '#f3ede1' },
  { id: 'cyclone', name: 'Ride the Cyclone', tagline: 'Un coro y una montaña rusa', blurb: 'Seis adolescentes, una máquina adivina y la oportunidad de volver a vivir.', color: '#7383d9', fg: '#141a4d' },
]

export const musicalById = (id: MusicalId | string) => MUSICALS.find((m) => m.id === id) ?? MUSICALS[0]
