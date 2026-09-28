import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GODS, GodPortrait, Sign } from '../art/Gods'
import { C, Meander } from '../art/Art'

const SLANT = 'polygon(16% 0, 100% 0, 84% 100%, 0 100%)'

/** Franja de dioses en paneles diagonales, a la manera de una portada de musical. */
export default function Pantheon() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper">
      <Meander color={C.feather} className="absolute inset-x-0 top-0 opacity-60" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-hand text-3xl text-feather">los dioses están mirando</p>
          <h2 className="h-display mt-1 text-4xl sm:text-6xl">El Olimpo canta contigo</h2>
          <p className="mt-4 text-paper/70">
            Rayos, tridentes, búhos y granadas: los personajes que cantamos en EPIC y Hadestown, pintados para esta casa de fans.
          </p>
        </div>
      </div>

      {/* escritorio: paneles diagonales que se expanden */}
      <div className="mt-12 hidden h-[460px] px-4 md:flex">
        {GODS.map((g, i) => (
          <motion.figure
            key={g.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className="group relative -mx-[2.2%] flex-1 cursor-default overflow-hidden transition-[flex-grow] duration-500 hover:flex-[1.9]"
            style={{ clipPath: SLANT }}
          >
            <GodPortrait id={g.id} className="absolute inset-0 size-full transition duration-700 group-hover:scale-105" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent px-[20%] pb-6 pt-20">
              <span className="block h-display text-2xl text-paper lg:text-3xl">{g.name}</span>
              <span className="block font-display text-sm text-paper/60" lang="grc">{g.greek}</span>
              <span className="mt-1 block text-xs font-bold uppercase tracking-widest text-feather">{g.title}</span>
              <span className="block max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100">
                <span className="mt-2 block text-sm text-paper/85">{g.domain}</span>
                <span className="mt-2 flex flex-wrap gap-1">
                  {g.attributes.map((a) => (
                    <span key={a} className="rounded-full bg-paper/15 px-2 py-0.5 text-[11px] font-bold text-paper">{a}</span>
                  ))}
                </span>
                <span className="mt-2 block text-xs font-bold text-cloud">{g.saga}</span>
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      {/* móvil: carrusel */}
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:hidden">
        {GODS.map((g) => (
          <figure key={g.id} className="wobble-2 relative h-96 w-64 shrink-0 snap-center overflow-hidden">
            <GodPortrait id={g.id} className="absolute inset-0 size-full" />
            <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 to-transparent p-4 pt-16">
              <span className="block h-display text-2xl">{g.name} <span className="font-display text-base font-normal text-paper/60" lang="grc">{g.greek}</span></span>
              <span className="block text-xs font-bold uppercase tracking-widest text-feather">{g.title}</span>
              <span className="mt-1 block text-[11px] text-paper/80">{g.attributes.join(' · ')}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="mx-auto mt-12 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-4 px-4 text-feather/80">
        {(['bolt', 'trident', 'owl', 'pomegranate', 'caduceus', 'lyre', 'helm', 'ship', 'eye'] as const).map((s) => (
          <Sign key={s} id={s} className="size-9 transition hover:-translate-y-1 hover:text-cloud" />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link to="/eventos?musical=epic" className="btn btn-gold">Únete a la odisea</Link>
      </div>
    </section>
  )
}
