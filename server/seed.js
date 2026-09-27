import { db, tx } from './db.js'
import { hash } from './util.js'

// Llave de edición para los datos de ejemplo (para probar el panel de líderes).
export const SEED_KEY = process.env.SEED_EDIT_KEY || 'demo-lider'

export function seedIfEmpty() {
  const { n } = db.prepare('SELECT COUNT(*) AS n FROM communities').get()
  if (n > 0) return false
  const k = hash(SEED_KEY)

  const communities = [
    ['c_ithaca_bog', 'ithaca-fans-bogota', null, 'Ithaca Fans Bogotá', 'epic', 'Bogotá', 'La tripulación más grande de EPIC en Colombia. Sing-alongs mensuales, cosplay y maratones subtituladas.', 'https://chat.whatsapp.com/ejemplo-ithaca', 'https://discord.gg/ejemplo-ithaca', 'https://instagram.com/ithacafansbog', null, 1240],
    ['c_ithaca_norte', 'ithaca-fans-bogota-norte', 'c_ithaca_bog', 'Ithaca Norte · Usaquén', 'epic', 'Bogotá', 'Subcomunidad del norte de la ciudad: planes en Usaquén, Cedritos y Chía.', 'https://chat.whatsapp.com/ejemplo-norte', null, null, null, 180],
    ['c_sirenas', 'coro-de-sirenas', 'c_ithaca_bog', 'Coro de Sirenas', 'epic', 'Bogotá', 'El coro oficial de la comunidad: ensayos de armonías para los sing-alongs.', 'https://chat.whatsapp.com/ejemplo-sirenas', 'https://discord.gg/ejemplo-sirenas', null, null, 64],
    ['c_ithaca_med', 'ithaca-fans-medellin', null, 'Ithaca Fans Medellín', 'epic', 'Medellín', 'Fans de EPIC en el Valle de Aburrá.', 'https://chat.whatsapp.com/ejemplo-ithaca-med', 'https://discord.gg/ejemplo-ithaca-med', null, null, 540],
    ['c_riseup_med', 'rise-up-medellin', null, 'Rise Up Medellín', 'hamilton', 'Medellín', 'Hamilfans paisas: watch parties, karaoke y clubes de lectura de historia.', 'https://chat.whatsapp.com/ejemplo-riseup', 'https://discord.gg/ejemplo-riseup', 'https://instagram.com/riseupmed', null, 860],
    ['c_riseup_bog', 'rise-up-bogota', null, 'Rise Up Bogotá', 'hamilton', 'Bogotá', 'Trivia, karaoke y debates de gabinete.', null, 'https://discord.gg/ejemplo-riseupbog', null, 'https://t.me/ejemplo_riseupbog', 390],
    ['c_reinas', 'reinas-del-pacifico', null, 'Reinas del Pacífico', 'six', 'Cali', 'Seis reinas, muchas más fans. Cosplay, baile y pop histórico.', 'https://chat.whatsapp.com/ejemplo-reinas', null, 'https://instagram.com/reinasdelpacifico', null, 430],
    ['c_waitforme', 'wait-for-me-tolima', null, 'Wait for Me Tolima', 'hadestown', 'Ibagué', 'La ciudad musical de Colombia también baja a Hadestown. Acústicos y picnics.', 'https://chat.whatsapp.com/ejemplo-tolima', 'https://discord.gg/ejemplo-tolima', null, null, 210],
    ['c_bigfun', 'big-fun-barranquilla', null, 'Big Fun Barranquilla', 'heathers', 'Barranquilla', 'Proyecciones, pijamadas y karaoke de Heathers en la costa.', 'https://chat.whatsapp.com/ejemplo-bigfun', null, null, null, 320],
    ['c_cyclone', 'cyclone-kids', null, 'Cyclone Kids', 'cyclone', 'Bucaramanga', 'Teatro amateur y fans de Ride the Cyclone.', null, 'https://discord.gg/ejemplo-cyclone', null, null, 150],
    ['c_saga_eje', 'saga-del-eje', null, 'Saga del Eje', 'epic', 'Pereira', 'Fans de EPIC del Eje Cafetero (Pereira, Manizales, Armenia).', 'https://chat.whatsapp.com/ejemplo-eje', null, null, null, 275],
  ]
  const leaders = [
    ['l1', 'c_ithaca_bog', 'Valentina Ríos', 'Fundadora', '+57 300 000 0001', 'vale@ejemplo.co', 1],
    ['l2', 'c_ithaca_bog', 'Samuel Ortiz', 'Coordinador de eventos', '+57 300 000 0002', null, 0],
    ['l3', 'c_ithaca_norte', 'Laura Méndez', 'Líder de zona', '+57 300 000 0003', null, 1],
    ['l4', 'c_sirenas', 'Mateo Cárdenas', 'Director de coro', '+57 300 000 0004', null, 1],
    ['l5', 'c_riseup_med', 'Camila Restrepo', 'Fundadora', '+57 300 000 0005', 'cami@ejemplo.co', 1],
    ['l6', 'c_reinas', 'Daniela Mosquera', 'Reina mayor', '+57 300 000 0006', null, 1],
    ['l7', 'c_waitforme', 'Andrés Guzmán', 'Líder', '+57 300 000 0007', null, 1],
    ['l8', 'c_bigfun', 'Sofía Pérez', 'Líder', '+57 300 000 0008', null, 0],
    ['l9', 'c_cyclone', 'Juan Pablo Rueda', 'Director artístico', '+57 300 000 0009', null, 1],
    ['l10', 'c_ithaca_med', 'Isabella Gómez', 'Líder', '+57 300 000 0010', null, 1],
    ['l11', 'c_riseup_bog', 'Tomás Herrera', 'Presidente del gabinete', '+57 300 000 0011', null, 1],
    ['l12', 'c_saga_eje', 'Mariana López', 'Líder', '+57 300 000 0012', null, 1],
  ]
  const events = [
    ['e1', 'c_ithaca_bog', 'epic', 'Sing-along', 'EPIC Sing-Along: de Troya a Ítaca', 'Las nueve sagas completas con letras en pantalla, coros divididos por personaje y un final a todo pulmón.', 'Bogotá', 'Auditorio La Candelaria', 'Cl. 12 #2-50, La Candelaria', 4.5981, -74.0730, '2026-10-17', '19:00', 35000, 180, 124, 'Ithaca Fans Bogotá'],
    ['e2', 'c_riseup_med', 'hamilton', 'Watch party', 'Hamilton Watch Party + Karaoke', 'Proyección en pantalla grande y ronda de karaoke con el cast de fans. Trae tu tricornio.', 'Medellín', 'Casa Teatro El Poblado', 'Cra. 43 #9-40, El Poblado', 6.2088, -75.5673, '2026-10-24', '18:30', 25000, 90, 61, 'Rise Up Medellín'],
    ['e3', 'c_reinas', 'six', 'Cosplay', 'SIX: Noche de Reinas', 'Concurso de cosplay de las seis reinas, pasarela y DJ set con el álbum completo.', 'Cali', 'Teatrino Granada', 'Av. 9N #15-20, Granada', 3.4565, -76.5320, '2026-11-07', '20:00', 30000, 120, 40, 'Reinas del Pacífico'],
    ['e4', 'c_waitforme', 'hadestown', 'Meetup', 'Hadestown Acústico en el Parque', 'Picnic musical con guitarras y trombón. Trae manta, flores rojas y ganas de cantar.', 'Ibagué', 'Parque Centenario', 'Cl. 10 con Cra. 1', 4.4389, -75.2322, '2026-10-31', '16:00', 0, 60, 22, 'Wait for Me Tolima'],
    ['e5', 'c_ithaca_med', 'epic', 'Watch party', 'Maratón EPIC con subtítulos + trivia', 'La experiencia completa subtitulada al español, con pausas de trivia por saga y premios.', 'Medellín', 'Biblioteca EPM, sala 3', 'Cra. 54 #44-48', 6.2476, -75.5695, '2026-11-14', '15:00', 20000, 70, 58, 'Ithaca Fans Medellín'],
    ['e6', 'c_cyclone', 'cyclone', 'Función', 'Ride the Cyclone: Talent Show', 'Números del musical por teatro amateur y micrófono abierto para fans.', 'Bucaramanga', 'Teatro Corfescu', 'Cl. 36 #26-54', 7.1193, -73.1227, '2026-11-21', '19:30', 28000, 150, 33, 'Cyclone Kids'],
    ['e7', 'c_bigfun', 'heathers', 'Watch party', 'Heathers Sleepover Screening', 'Proyección en pijama con slushies y dress code de colores Heather.', 'Barranquilla', 'Cine Club Bellas Artes', 'Cra. 54 #68-196', 10.999, -74.802, '2026-10-30', '21:00', 18000, 80, 80, 'Big Fun Barranquilla'],
    ['e8', 'c_riseup_bog', 'hamilton', 'Trivia', 'Hamilton Trivia Night', 'Equipos de hasta 4 personas. Historia, letras y detrás de cámaras.', 'Bogotá', 'Bar La Revolución', 'Cra. 7 #57-10, Chapinero', 4.6486, -74.0628, '2026-12-05', '19:00', 15000, 64, 12, 'Rise Up Bogotá'],
    ['e9', 'c_saga_eje', 'epic', 'Cosplay', 'EPIC Cosplay: Poseidón vs. Odiseo', 'Duelos de cosplay en vivo, sesión de fotos temática y sing-along de la Ocean Saga.', 'Pereira', 'Centro Cultural Lucy Tejada', 'Cra. 10 #16-60', 4.8133, -75.6961, '2026-12-12', '17:00', 15000, 100, 47, 'Saga del Eje'],
    ['e10', 'c_sirenas', 'epic', 'Sing-along', 'Ensayo abierto: armonías de la Ocean Saga', 'Ensayo abierto del Coro de Sirenas. No necesitas experiencia, solo ganas.', 'Bogotá', 'Casa de la Cultura de Usaquén', 'Cra. 6 #119B-52', 4.6947, -74.0307, '2026-10-10', '10:00', 0, 40, 18, 'Coro de Sirenas'],
  ]

  tx(() => {
    const ic = db.prepare(`INSERT INTO communities (id, slug, parent_id, name, musical, city, description, whatsapp, discord, instagram, telegram, base_members, edit_key_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    for (const c of communities) ic.run(...c, k)
    const il = db.prepare(`INSERT INTO leaders (id, community_id, name, role, phone, email, public_phone) VALUES (?,?,?,?,?,?,?)`)
    for (const l of leaders) il.run(...l)
    const ie = db.prepare(`INSERT INTO events (id, community_id, musical, type, title, description, city, venue, address, lat, lng, date, time, price, capacity, sold, organizer, edit_key_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    for (const e of events) ie.run(...e, k)
  })
  return true
}
