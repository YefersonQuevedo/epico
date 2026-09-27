import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Crown, MapPin, Megaphone, Play, ShieldCheck, Ticket, Users } from 'lucide-react'
import { Bird, C, Cloud, HeroArt, Meander, MusicalIcon, Sun } from '../art/Art'
import { useCommunities, useEvents, useStats } from '../lib/api'
import { MUSICALS } from '../lib/musicals'
import { CommunityCard, EventCard, SectionTitle } from '../components/ui'
import Pantheon from '../components/Pantheon'
import { SIGNS, Sign } from '../art/Gods'

function Hero() {
  const { data: s } = useStats()
  return (
    <section className="relative overflow-hidden">
      <Cloud className="pointer-events-none absolute -left-40 -top-6 w-80 opacity-40" />
      <Sign id="bolt" className="pointer-events-none absolute left-[46%] top-16 hidden size-12 rotate-12 text-feather lg:block" />
      <Sign id="eye" className="pointer-events-none absolute bottom-24 left-[44%] hidden size-14 text-cloud-deep lg:block" />
      <Sign id="laurel" className="pointer-events-none absolute right-6 top-8 hidden size-16 text-feather/70 lg:block" />
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
        <motion.div className="relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="kicker">fans · comunidades · boletas</p>
          <h1 className="h-display mt-2 text-5xl leading-[0.95] text-ultra sm:text-7xl">
            Cada ciudad merece su propia{' '}
            <span className="relative inline-block text-terra">
              odisea
              <svg viewBox="0 0 200 20" className="absolute -bottom-3 left-0 w-full" aria-hidden="true">
                <path d="M4 14C50 4 120 2 196 10" stroke={C.feather} strokeWidth="6" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg text-ink/75">
            Sing-alongs, watch parties y noches de cosplay de <b>EPIC</b>, <b>Hamilton</b>, <b>SIX</b>, <b>Hadestown</b> y más. Compra boletas en segundos, únete a
            tu comunidad o crea la tuya con subgrupos, líderes y enlaces a WhatsApp y Discord.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/eventos" className="btn btn-primary text-lg">Explorar eventos <ArrowRight className="size-5" /></Link>
            <Link to="/comunidades/nueva" className="btn btn-gold text-lg">Crear mi comunidad</Link>
          </div>
          <dl className="mt-10 grid max-w-lg grid-cols-4 gap-3">
            {[
              ['Eventos', s?.events],
              ['Ciudades', s?.cities],
              ['Grupos', s?.communities],
              ['Fans', s?.members?.toLocaleString('es-CO')],
            ].map(([k, v]) => (
              <div key={k as string} className="border-l-4 border-feather pl-3">
                <dd className="h-display text-2xl text-ultra sm:text-3xl">{v ?? '—'}</dd>
                <dt className="text-xs font-bold uppercase tracking-wider text-ink/60">{k}</dt>
              </div>
            ))}
          </dl>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.1 }}>
          <HeroArt className="mx-auto w-full max-w-[640px]" />
        </motion.div>
      </div>
    </section>
  )
}

function Marquee() {
  const names = [...MUSICALS.map((m) => m.name), 'Sing-alongs', 'Cosplay', 'Watch parties', 'Trivia']
  return (
    <div className="-rotate-1 overflow-hidden bg-ultra py-4 text-paper" aria-hidden="true">
      <div className="marquee flex w-max gap-10 whitespace-nowrap">
        {[...names, ...names].map((n, i) => (
          <span key={i} className="flex items-center gap-10 font-display text-2xl font-bold tracking-widest">
            {n}
            <Sign id={SIGNS[i % SIGNS.length]} className="size-8 text-feather" />
          </span>
        ))}
      </div>
    </div>
  )
}

function MusicalsGrid() {
  const navigate = useNavigate()
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <SectionTitle kicker="elige tu saga" title="Los musicales de la casa">
        Cada musical tiene su tribu. Encuentra eventos y comunidades del tuyo.
      </SectionTitle>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MUSICALS.map((m, i) => (
          <motion.button
            key={m.id}
            onClick={() => navigate(`/eventos?musical=${m.id}`)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 3) * 0.1 }}
            whileHover={{ y: -6, rotate: i % 2 ? 0.6 : -0.6 }}
            className="wobble-2 group relative min-h-64 overflow-hidden p-7 text-left"
            style={{ background: m.color, color: m.fg, boxShadow: `7px 7px 0 ${i % 2 ? C.ink : C.cloudDeep}` }}
          >
            <MusicalIcon id={m.id} className="absolute -right-8 -top-8 size-48 opacity-20 transition duration-500 group-hover:rotate-12 group-hover:scale-110" />
            <MusicalIcon id={m.id} className="size-14" />
            <p className="mt-6 font-hand text-2xl opacity-90">{m.tagline}</p>
            <h3 className="h-display text-3xl">{m.name}</h3>
            <p className="mt-2 max-w-xs text-sm opacity-85">{m.blurb}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-widest">
              Ver eventos <ArrowRight className="size-4 transition group-hover:translate-x-1" />
            </span>
          </motion.button>
        ))}
      </div>
    </section>
  )
}

function Upcoming() {
  const { data } = useEvents()
  return (
    <section className="bg-paper-2/70 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle kicker="lo que viene" title="Próximos eventos" />
          <Link to="/eventos" className="btn btn-ghost mb-10">Ver todos <ArrowRight className="size-4" /></Link>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {data?.slice(0, 6).map((e, i) => <EventCard key={e.id} e={e} index={i} />)}
        </div>
      </div>
    </section>
  )
}

function Watch() {
  const [play, setPlay] = useState(false)
  return (
    <section className="relative overflow-hidden bg-ultra py-24 text-paper">
      <Cloud className="absolute -right-20 top-6 w-80 opacity-90" />
      <Bird className="float absolute bottom-10 left-6 hidden w-40 md:block" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr]">
        <div>
          <p className="font-hand text-3xl text-feather">calienta la voz</p>
          <h2 className="h-display mt-1 text-4xl sm:text-5xl">EPIC: la experiencia completa, subtitulada</h2>
          <p className="mt-5 max-w-md text-paper/80">
            Antes del sing-along, repasa las nueve sagas con animatics de la comunidad y subtítulos en español. Luego busca el evento más cercano y ve a cantarlo en
            grupo.
          </p>
          <Link to="/eventos?musical=epic" className="btn btn-gold mt-8">Eventos de EPIC <ArrowRight className="size-4" /></Link>
        </div>
        <div className="wobble-2 relative aspect-video overflow-hidden bg-ultra-deep" style={{ boxShadow: `10px 10px 0 ${C.feather}` }}>
          {play ? (
            <iframe
              className="absolute inset-0 size-full"
              src="https://www.youtube-nocookie.com/embed/R7oZo7AAVyQ?start=3991&autoplay=1&cc_load_policy=1&cc_lang_pref=es"
              title="EPIC: The Musical — experiencia completa con subtítulos en español"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button onClick={() => setPlay(true)} className="group absolute inset-0 grid place-items-center" aria-label="Reproducir video">
              <MusicalIcon id="epic" className="absolute inset-0 m-auto size-3/4 text-ultra opacity-60" />
              <span className="relative grid size-24 place-items-center rounded-full bg-cloud text-ink transition group-hover:scale-110">
                <Play className="size-10 translate-x-0.5 fill-ink" />
              </span>
              <span className="absolute bottom-5 left-6 text-left">
                <span className="block h-display text-2xl">EPIC — The Musical</span>
                <span className="text-sm text-paper/70">Full experience · sub. español · YouTube</span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

function CommunitiesPreview() {
  const { data } = useCommunities({ parent: 'root' })
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionTitle kicker="tu tribu te espera" title="Comunidades activas">
          Con líderes, subgrupos por zona y enlaces directos a sus chats de WhatsApp, Discord y Telegram.
        </SectionTitle>
        <Link to="/comunidades" className="btn btn-ghost mb-10">Todas las comunidades <ArrowRight className="size-4" /></Link>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data?.slice(0, 6).map((c, i) => <CommunityCard key={c.id} c={c} index={i} />)}
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { icon: Users, title: 'Crea tu comunidad', text: 'Ponle nombre, ciudad y musical. Agrega líderes con sus números y enlaza tus grupos de WhatsApp, Discord o Telegram.' },
    { icon: Crown, title: 'Arma subcomunidades', text: 'Divide por zona, coro, cosplay o universidad. Cada subgrupo tiene sus propios líderes y chats.' },
    { icon: MapPin, title: 'Publica eventos con lugar', text: 'Marca el punto exacto en el mapa, define cupos y precio. Gratis o con boletería.' },
    { icon: Ticket, title: 'Vende boletas seguras', text: 'Pagos con tarjeta, PSE o Nequi a través de la pasarela. Boletas con código QR al instante.' },
  ]
  return (
    <section className="relative overflow-hidden bg-cloud/50 py-24">
      <Sun className="absolute -right-10 -top-10 w-56 opacity-70" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitle kicker="para organizadores" title="Tu comunidad, en cuatro pasos" align="center" />
        <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <motion.li
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="wobble-2 relative bg-paper p-7 print-shadow-ink"
            >
              <span className="h-display absolute right-5 top-3 text-5xl text-feather">{i + 1}</span>
              <s.icon className="size-9 text-ultra" />
              <h3 className="mt-4 font-display text-xl font-bold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink/70">{s.text}</p>
            </motion.li>
          ))}
        </ol>
        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <Link to="/comunidades/nueva" className="btn btn-primary text-lg"><Megaphone className="size-5" /> Crear comunidad</Link>
          <Link to="/eventos/nuevo" className="btn btn-gold text-lg">Organizar un evento</Link>
        </div>
        <p className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-2 text-center text-sm text-ink/60">
          <ShieldCheck className="size-4 shrink-0" /> Tus datos se tratan conforme a la Ley 1581 de 2012. <Link to="/privacidad" className="underline">Ver política</Link>
        </p>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Pantheon />
      <MusicalsGrid />
      <Meander className="opacity-40" />
      <Upcoming />
      <CommunitiesPreview />
      <Watch />
      <HowItWorks />
    </>
  )
}
