// Panteón: bustos de dioses griegos en el estilo plano de la serigrafía,
// cada uno con su atributo (rayo, tridente, búho, granada, caduceo, flores).
import type { ReactNode, SVGProps } from 'react'
import { C } from './Art'

export type GodId = 'zeus' | 'poseidon' | 'athena' | 'hades' | 'hermes' | 'persephone'

export interface God {
  id: GodId
  name: string
  title: string
  saga: string
  bg: string
  fg: string
}

export const GODS: God[] = [
  { id: 'zeus', name: 'Zeus', title: 'Rey del Olimpo', saga: 'Thunder Saga · EPIC', bg: C.feather, fg: C.ink },
  { id: 'poseidon', name: 'Poseidón', title: 'Señor de los mares', saga: 'Ocean Saga · EPIC', bg: C.soft, fg: C.ink },
  { id: 'athena', name: 'Atenea', title: 'Diosa de la sabiduría', saga: 'Wisdom Saga · EPIC', bg: C.cloud, fg: C.ink },
  { id: 'hades', name: 'Hades', title: 'Rey del inframundo', saga: 'Hadestown · Underworld Saga', bg: C.ink, fg: C.paper },
  { id: 'hermes', name: 'Hermes', title: 'Mensajero y narrador', saga: 'Hadestown · Circe Saga', bg: C.terra, fg: C.paper },
  { id: 'persephone', name: 'Perséfone', title: 'Reina de la primavera', saga: 'Hadestown', bg: C.ultra, fg: C.paper },
]

// --- piezas comunes -------------------------------------------------------
// Busto de perfil mirando a la izquierda (viewBox 0 0 200 240)
const BUST =
  'M78 70C78 44 100 30 124 34c26 4 38 28 34 54-2 16-8 28-12 40l4 22c25 8 50 22 50 50v40H20c0-35 20-60 60-72 12-4 18-10 20-18-8-2-16-4-20-8-4-3-4-8-2-11-4-2-4-6-1-9-3-2-3-5 0-8-5-2-11-6-15-10 6-8 10-16 14-24 1-4 2-7 2-10z'

function Face({ line = C.featherLight, beard = false }: { line?: string; beard?: boolean }) {
  return (
    <g stroke={line} strokeWidth="2.6" fill="none" strokeLinecap="round">
      <path d="M82 80q11-7 23-2" />
      <path d="M84 88q8-5 17 0M86 92h13" />
      <path d="M129 94c11 0 13 19 0 21" />
      {!beard && <path d="M72 118h9" />}
      <path d="M60 212c30-14 70-16 104-4" opacity=".7" />
    </g>
  )
}

function Beard({ fill, curl }: { fill: string; curl: string }) {
  return (
    <g>
      <path d="M78 104c-10 18-10 48 6 66 18 20 52 16 64-10 4-14 0-30-8-42-12 10-34 14-50 4-4-6-8-12-12-18z" fill={fill} />
      <g stroke={curl} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M86 132q6-6 12 0t12 0M92 148q6-6 12 0t12 0M100 164q6-6 12 0t12 0M120 136q5-5 10 0" />
      </g>
      {/* bigote */}
      <path d="M68 116c8-6 18-4 24 2-8 4-16 4-24-2z" fill={fill} />
    </g>
  )
}

function Panel({ bg, children, ...p }: SVGProps<SVGSVGElement> & { bg: string; children: ReactNode }) {
  return (
    <svg viewBox="-24 -110 248 350" {...p}>
      <rect x="-24" y="-110" width="248" height="350" fill={bg} />
      {/* halo con rayos */}
      <g opacity=".22" stroke={C.paper} strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d="M118 -52v-26" transform={`rotate(${i * 20} 118 76)`} />
        ))}
      </g>
      <circle cx="118" cy="76" r="104" fill={C.paper} opacity=".14" />
      {children}
    </svg>
  )
}

// --- dioses ----------------------------------------------------------------
function Zeus() {
  return (
    <>
      {/* nube detrás */}
      <path d="M10 70c-10-20 14-34 28-22 4-22 40-24 46-4 14-10 34 0 30 16" fill={C.paper} opacity=".7" />
      {/* rayo */}
      <path d="M176 20l-26 60h18l-22 62 44-78h-20l18-44z" fill={C.ultra} stroke={C.ink} strokeWidth="2" strokeLinejoin="round" />
      <path d={BUST} fill={C.ultra} />
      {/* cabello rizado */}
      <path d="M76 70c-6-24 16-42 40-40 30 2 46 28 40 58-2 14-8 24-10 36-10-8-12-22-14-36-6-18-26-24-46-18-4 0-8 0-10 0z" fill={C.deep} />
      <g fill={C.soft}>
        {[[96, 40], [112, 36], [128, 42], [142, 54], [150, 70], [150, 88]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" />)}
      </g>
      <Beard fill={C.paper} curl={C.soft} />
      {/* corona de laurel */}
      <g fill={C.featherLight} stroke={C.earth} strokeWidth="1">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <ellipse key={i} cx={84 + i * 12} cy={50 - Math.sin(i / 1.6) * 10} rx="7" ry="3.4" transform={`rotate(${-30 + i * 10} ${84 + i * 12} ${50 - Math.sin(i / 1.6) * 10})`} />
        ))}
      </g>
      <Face beard />
    </>
  )
}

function Poseidon() {
  return (
    <>
      {/* olas */}
      <g stroke={C.paper} strokeWidth="4" fill="none" strokeLinecap="round" opacity=".8">
        <path d="M0 200q12-12 24 0t24 0M0 220q12-12 24 0t24 0" />
      </g>
      {/* tridente */}
      <g stroke={C.cloudDeep} strokeWidth="6" strokeLinecap="round" fill="none">
        <path d="M178 240V40M162 70V40M194 70V40M162 70q16 12 32 0" />
      </g>
      <path d="M156 42l6-16 6 16zM172 36l6-18 6 18zM188 42l6-16 6 16z" fill={C.cloudDeep} />
      <path d={BUST} fill={C.ultra} />
      {/* cabello largo ondulado */}
      <path d="M76 66c0-26 26-40 50-34 30 8 40 40 32 70-4 20-2 40 6 60-22-6-30-28-30-50 0-22-10-38-34-42-10-2-18-2-24-4z" fill={C.deep} />
      <g stroke={C.soft} strokeWidth="2.6" fill="none" strokeLinecap="round">
        <path d="M130 50q10 10 4 22t4 22M144 60q10 12 4 26t6 26M118 44q12 4 18 14" />
      </g>
      <Beard fill={C.deep} curl={C.soft} />
      {/* corona de puntas */}
      <path d="M82 50l4-18 8 14 6-20 8 18 8-18 6 20 8-12 2 18q-26-8-50-2z" fill={C.feather} />
      <Face beard />
    </>
  )
}

function Athena() {
  return (
    <>
      {/* búho */}
      <g transform="translate(150 150)">
        <path d="M0 40c-4-26 2-44 20-44s24 18 20 44z" fill={C.earth} />
        <path d="M4 4l4-10 6 8M36 4l-4-10-6 8" fill={C.earth} />
        <circle cx="12" cy="10" r="7" fill={C.paper} />
        <circle cx="28" cy="10" r="7" fill={C.paper} />
        <circle cx="12" cy="10" r="3" fill={C.ink} />
        <circle cx="28" cy="10" r="3" fill={C.ink} />
        <path d="M18 16l2 5 2-5z" fill={C.feather} />
        <path d="M8 26q4 4 8 0t8 0 8 0" stroke={C.featherLight} strokeWidth="2" fill="none" />
      </g>
      {/* lanza */}
      <path d="M34 240L64 10" stroke={C.earth} strokeWidth="4" strokeLinecap="round" />
      <path d="M64 10l-8 22 12 2z" fill={C.feather} />
      <path d={BUST} fill={C.ultra} />
      {/* cabello bajo el casco */}
      <path d="M134 90c14 10 20 30 14 56-6 18 0 30 10 40-22 0-30-20-28-40 2-20 0-40 4-56z" fill={C.deep} />
      {/* casco corintio */}
      <path d="M74 74c-2-30 20-50 50-48 28 2 42 24 38 52l-6 24c-4-10-10-16-18-18l-2 16-10-2 2-22c-16-4-34-2-54-2z" fill={C.feather} />
      <path d="M78 66h78" stroke={C.earth} strokeWidth="3" />
      <path d="M92 76v12" stroke={C.earth} strokeWidth="3" strokeLinecap="round" />
      {/* penacho */}
      <path d="M96 30c10-26 50-34 74-14-10 2-16 6-20 14-4-8-12-10-20-8-10-6-24-4-34 8z" fill={C.terra} />
      <g stroke={C.cloud} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M104 22q10-8 22-8M120 14q14-4 26 2" />
      </g>
      <Face />
    </>
  )
}

function Hades() {
  return (
    <>
      {/* granada */}
      <g transform="translate(152 156)">
        <circle cx="18" cy="22" r="18" fill={C.terra} />
        <path d="M12 4l6 8 6-8-2 6h-8z" fill={C.terra} />
        <path d="M8 22q10 8 20 0" stroke={C.cloud} strokeWidth="2" fill="none" />
        <g fill={C.cloud}>{[[12, 28], [18, 30], [24, 28], [15, 24], [21, 24]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="1.6" />)}</g>
      </g>
      {/* llamas del inframundo */}
      <path d="M80 60c-10-20 4-34 10-50 4 14 12 18 12 30 6-14 16-20 18-34 6 16 8 26 4 38 8-8 16-10 20-22 4 18 0 30-8 40z" fill={C.terra} />
      <path d="M92 58c-2-12 4-20 8-30 2 10 8 14 6 24 4-8 10-12 12-20 4 12 2 20-4 28z" fill={C.feather} />
      <path d={BUST} fill={C.ultra} />
      <path d="M76 66c2-22 22-34 46-32 26 2 40 26 36 52-2 16-8 28-10 40-8-10-10-24-12-38-4-16-20-22-40-20-8 0-14-2-20-2z" fill={C.deep} />
      <Beard fill={C.deep} curl={C.terra} />
      <Face line={C.cloud} beard />
    </>
  )
}

function Hermes() {
  return (
    <>
      {/* caduceo */}
      <g transform="translate(160 26)">
        <path d="M14 214V10" stroke={C.feather} strokeWidth="4" strokeLinecap="round" />
        <circle cx="14" cy="8" r="6" fill={C.feather} />
        <path d="M2 16c10-8 16-2 12 6s-10 14 0 22 10 14 0 22-10 14 0 22M26 16c-10-8-16-2-12 6s10 14 0 22-10 14 0 22 10 14 0 22" stroke={C.cloud} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M14 22c-14-10-24-6-32-14 12 0 22 0 32 6M14 22c14-10 24-6 32-14-12 0-22 0-32 6" fill={C.paper} />
      </g>
      <path d={BUST} fill={C.ultra} />
      <path d="M76 70c0-24 20-38 44-36 26 2 40 26 36 50l-6 22c-6-10-8-24-14-34-10-10-30-10-50-2z" fill={C.deep} />
      {/* petaso alado */}
      <path d="M62 60c16-10 70-14 104-2-10 6-28 8-52 8s-40-2-52-6z" fill={C.feather} />
      <path d="M86 58c0-18 14-28 30-28s30 10 30 28z" fill={C.feather} />
      <g fill={C.paper} stroke={C.earth} strokeWidth="1.4">
        <path d="M144 44c12-16 30-24 50-24-8 6-12 10-14 16 6-2 10-2 14 0-8 4-14 8-18 14 4 0 8 0 10 2-14 6-28 4-42-8z" />
      </g>
      <g stroke={C.earth} strokeWidth="1.4" fill="none"><path d="M156 42q14-10 30-14M160 48q12-6 24-8" /></g>
      <Face />
    </>
  )
}

function Persephone() {
  return (
    <>
      {/* flores y hojas */}
      <g>
        {[[170, 60], [182, 120], [164, 180], [30, 40]].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-8" rx="5" ry="9" fill={i % 2 ? C.cloud : C.feather} transform={`rotate(${a})`} />)}
            <circle r="4" fill={C.terra} />
          </g>
        ))}
      </g>
      <path d={BUST} fill={C.cloud} />
      {/* cabello largo */}
      <path d="M74 70c-2-28 22-44 50-40 30 4 44 32 38 64-4 24 4 50 20 70-36 4-48-24-46-54 0-20-6-34-26-38-12-2-24-2-36-2z" fill={C.deep} />
      <g fill={C.featherLight}>{[[138, 120], [146, 140], [150, 160], [140, 100]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="2.6" />)}</g>
      {/* corona de flores */}
      <g>
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${86 + i * 14} ${42 - Math.sin(i / 1.3) * 8})`}>
            {[0, 90, 180, 270].map((a) => <ellipse key={a} cx="0" cy="-5" rx="3.4" ry="5.5" fill={i % 2 ? C.terra : C.paper} transform={`rotate(${a})`} />)}
            <circle r="2.6" fill={C.feather} />
          </g>
        ))}
      </g>
      <Face line={C.ultra} />
      <path d="M72 118h9" stroke={C.terra} strokeWidth="3" strokeLinecap="round" />
    </>
  )
}

const ART: Record<GodId, () => ReactNode> = { zeus: Zeus, poseidon: Poseidon, athena: Athena, hades: Hades, hermes: Hermes, persephone: Persephone }

export function GodPortrait({ id, bg, ...p }: SVGProps<SVGSVGElement> & { id: GodId; bg?: string }) {
  const god = GODS.find((g) => g.id === id)!
  const Art = ART[id]
  return (
    <Panel bg={bg ?? god.bg} role="img" aria-label={`${god.name}, ${god.title}`} preserveAspectRatio="xMidYMax slice" {...p}>
      <Art />
    </Panel>
  )
}

// --- signos mitológicos ----------------------------------------------------
export type SignId = 'bolt' | 'trident' | 'owl' | 'pomegranate' | 'caduceus' | 'lyre' | 'laurel' | 'eye' | 'helm' | 'wave' | 'sun' | 'ship'

const SIGN_PATHS: Record<SignId, ReactNode> = {
  bolt: <path d="M58 6L30 52h18L38 94l34-50H52z" fill="currentColor" stroke="none" />,
  trident: <><path d="M50 94V20M30 42V14M70 42V14M30 42q20 14 40 0" /><path d="M24 16l6-10 6 10M44 18l6-12 6 12M64 16l6-10 6 10" /></>,
  owl: <><path d="M26 86c-8-40 2-66 24-66s32 26 24 66z" /><circle cx="40" cy="42" r="8" /><circle cx="60" cy="42" r="8" /><path d="M48 52l2 6 2-6M30 22l-4-12 12 8M70 22l4-12-12 8" /></>,
  pomegranate: <><circle cx="50" cy="58" r="30" /><path d="M40 28l10-14 10 14M36 60q14 12 28 0" /></>,
  caduceus: <><path d="M50 94V10" /><path d="M36 26c12-10 20 0 14 10s-16 16 0 26 14 16 0 26M64 26c-12-10-20 0-14 10s16 16 0 26-14 16 0 26" /><path d="M50 18c-14-10-28-8-40-16M50 18c14-10 28-8 40-16" /></>,
  lyre: <><path d="M30 20c-12 24-8 50 8 64h24c16-14 20-40 8-64" /><path d="M26 22h48M40 30v52M50 30v52M60 30v52" /></>,
  laurel: <><path d="M50 92C22 80 14 50 24 22M50 92c28-12 36-42 26-70" /><path d="M24 34l-10-4M22 50l-10 0M26 66l-10 4M76 34l10-4M78 50l10 0M74 66l10 4" /></>,
  eye: <><path d="M8 50q42-40 84 0-42 40-84 0z" /><circle cx="50" cy="50" r="12" /><circle cx="50" cy="50" r="4" fill="currentColor" /></>,
  helm: <><path d="M24 84V48c0-24 12-38 26-38s26 14 26 38v36H58V58H42v26z" /><path d="M50 10c10-8 26-6 34 4" /></>,
  wave: <path d="M6 60q11-22 22 0t22 0 22 0 22 0M6 80q11-22 22 0t22 0 22 0 22 0M28 38q10-18 26-10" />,
  sun: <><circle cx="50" cy="50" r="18" /><path d="M50 8v14M50 78v14M8 50h14M78 50h14M20 20l10 10M70 70l10 10M80 20L70 30M30 70L20 80" /></>,
  ship: <><path d="M10 64h80l-12 20H24z" /><path d="M50 64V12M50 16l30 38H50M50 22L24 54h26" /></>,
}

export const SIGNS = Object.keys(SIGN_PATHS) as SignId[]

export function Sign({ id, className, title }: { id: SignId; className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" role={title ? 'img' : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      {SIGN_PATHS[id]}
    </svg>
  )
}

/** Retrato enmarcado para encabezados de página. */
export function GodFrame({ id, className = '' }: { id: GodId; className?: string }) {
  const god = GODS.find((g) => g.id === id)!
  return (
    <figure className={`relative ${className}`}>
      <div className="h-72 w-56 overflow-hidden" style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)', boxShadow: '8px 8px 0 #141a4d' }}>
        <GodPortrait id={id} className="size-full" />
      </div>
      <figcaption className="absolute -bottom-3 left-4 rounded-full bg-ink px-4 py-1 font-display text-sm font-bold tracking-widest text-feather">{god.name}</figcaption>
    </figure>
  )
}
