// Panteón: bustos de dioses griegos en el estilo plano de la serigrafía,
// con iconografía clásica fiel (atributos, vestimenta y rasgos de cada deidad).
import type { ReactNode, SVGProps } from 'react'
import { C } from './Art'

export type GodId = 'zeus' | 'poseidon' | 'athena' | 'hades' | 'hermes' | 'persephone'

export interface God {
  id: GodId
  name: string
  greek: string
  title: string
  domain: string
  attributes: string[]
  saga: string
  bg: string
  fg: string
}

export const GODS: God[] = [
  {
    id: 'zeus', name: 'Zeus', greek: 'Ζεύς', title: 'Rey de los dioses', domain: 'Señor del cielo, el rayo y la justicia',
    attributes: ['Rayo (keraunós)', 'Águila', 'Corona de roble'], saga: 'EPIC · Thunder Saga', bg: C.feather, fg: C.ink,
  },
  {
    id: 'poseidon', name: 'Poseidón', greek: 'Ποσειδῶν', title: 'Señor de los mares', domain: 'Dios del mar, los terremotos y los caballos',
    attributes: ['Tridente', 'Delfín', 'Diadema'], saga: 'EPIC · Ocean Saga', bg: C.soft, fg: C.ink,
  },
  {
    id: 'athena', name: 'Atenea', greek: 'Ἀθηνᾶ', title: 'Diosa de la sabiduría', domain: 'Sabiduría, estrategia y artes; protectora de Odiseo',
    attributes: ['Casco corintio', 'Égida con gorgoneion', 'Lanza y escudo', 'Búho', 'Olivo'], saga: 'EPIC · Wisdom Saga', bg: C.cloud, fg: C.ink,
  },
  {
    id: 'hades', name: 'Hades', greek: 'ᾍδης', title: 'Señor del inframundo', domain: 'Rey de los muertos y de las riquezas bajo la tierra',
    attributes: ['Bidente', 'Cerbero', 'Ciprés'], saga: 'Hadestown', bg: C.ink, fg: C.paper,
  },
  {
    id: 'hermes', name: 'Hermes', greek: 'Ἑρμῆς', title: 'Mensajero de los dioses', domain: 'Mensajero, guía de las almas y dios de los viajeros',
    attributes: ['Pétaso alado', 'Caduceo (kerykeion)', 'Sandalias aladas', 'Clámide'], saga: 'Hadestown · EPIC (Circe Saga)', bg: C.terra, fg: C.paper,
  },
  {
    id: 'persephone', name: 'Perséfone', greek: 'Περσεφόνη', title: 'Reina del inframundo', domain: 'Reina de los muertos y diosa de la primavera',
    attributes: ['Granada', 'Antorcha', 'Espigas de trigo', 'Narcisos'], saga: 'Hadestown', bg: C.ultra, fg: C.paper,
  },
]

// Tonos adicionales de la paleta
const T = { ...C, terraDeep: '#8e2f1f', night: '#0d1238', seaDeep: '#1b2a8f', leaf: '#6f7d3a' }

// --- anatomía --------------------------------------------------------------
// Perfiles mirando a la izquierda con la nariz "griega" (frente y nariz en línea).
const MALE =
  'M132 30C160 34 172 64 164 94c-4 18-12 30-14 42l2 26c28 8 60 24 72 52v26H-24v-26c24-28 74-38 122-38l-4-26c-8-4-14-10-17-18-4-3-5-7-3-10-3-2-3-6 0-8v-4c-4 0-8-1-10-4l8-14 6-32c6-20 28-32 54-30z'
const FEMALE =
  'M130 34C156 38 166 66 160 94c-4 18-12 30-14 42l4 34c26 8 54 22 64 46v24H-14v-18c24-26 64-36 112-38l-4-34c-8-4-12-10-14-17-4-3-5-6-3-9-3-2-3-6 0-8v-4c-4 0-7-2-9-5l7-15 5-30c6-18 26-30 50-28z'

type FaceKind = 'elder' | 'youth' | 'female'

/** Rasgos al estilo de la cerámica griega: ojo almendrado, ceja arqueada, oreja y boca. */
function Face({ kind, line = T.featherLight, ear = true, mouth = true }: { kind: FaceKind; line?: string; ear?: boolean; mouth?: boolean }) {
  const f = kind === 'female'
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {/* ojo almendrado con pupila */}
      <path d={f ? 'M83 81q8-6 17-1q-8 5-17 1z' : 'M80 80q8-7 18-1q-9 6-18 1z'} fill={T.paper} />
      <circle cx={f ? 91 : 89} cy={f ? 80.4 : 79.6} r="2.5" fill={T.ink} />
      <path d={f ? 'M82 81l-4-2' : 'M79 80l-4-1'} stroke={line} strokeWidth="2" />
      {/* ceja */}
      <path d={f ? 'M82 72q11-6 22-1' : 'M77 70q12-8 27-2'} stroke={line} strokeWidth={f ? 2.2 : 3.4} fill="none" />
      {/* aleta de la nariz */}
      <path d={f ? 'M71 105q4 1 6-2' : 'M67 104q4 1 7-2'} stroke={line} strokeWidth="2" fill="none" />
      {kind === 'elder' && <path d="M86 60q10-4 20 0M88 64q8-2 14 0" stroke={line} strokeWidth="1.8" fill="none" opacity=".8" />}
      {/* boca */}
      {mouth && (f ? <path d="M77 117q3-2 7 0q-3 2-7 0z" fill={T.terra} /> : <path d="M74 116h8" stroke={line} strokeWidth="2.4" />)}
      {/* oreja */}
      {ear && (
        <g stroke={line} strokeWidth="2.4" fill="none">
          <path d={f ? 'M128 88c10-1 12 17 1 21' : 'M130 84c11-1 14 20 1 23'} />
          <path d={f ? 'M130 93c3 1 4 7 1 9' : 'M132 90c4 1 5 8 1 10'} />
        </g>
      )}
    </g>
  )
}

/** Rizos en espiral ("caracol") típicos de la escultura arcaica. */
function Curls({ pts, r = 4.5, color = T.soft }: { pts: [number, number][]; r?: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round">
      {pts.map(([x, y], i) => (
        <path key={i} d={`M${x + r} ${y}a${r} ${r} 0 1 0-${r} ${r}a${r * 0.55} ${r * 0.55} 0 1 0 ${r * 0.1}-${r * 0.9}`} />
      ))}
    </g>
  )
}

/** Greca (meandro) a lo largo de una banda horizontal. */
function MeanderBand({ x, y, w, h = 10, color = T.paper, bg }: { x: number; y: number; w: number; h?: number; color?: string; bg?: string }) {
  const n = Math.floor(w / h)
  const u = h / 5
  return (
    <g>
      {bg && <rect x={x} y={y} width={w} height={h} fill={bg} />}
      <path
        d={Array.from({ length: n }, (_, i) => {
          const x0 = x + i * h
          return `M${x0} ${y + h - u}h${4 * u}v${-3 * u}h${-2 * u}v${u}`
        }).join('')}
        stroke={color}
        strokeWidth={u * 0.8}
        fill="none"
      />
    </g>
  )
}

/** Voluta de olas ("perro corredor"). */
function WaveScroll({ x, y, n, s = 12, color }: { x: number; y: number; n: number; s?: number; color: string }) {
  return (
    <path
      d={Array.from({ length: n }, (_, i) => `M${x + i * s * 1.6} ${y}c0-${s} ${s} -${s} ${s} -${s * 0.4}c0 ${s * 0.5}-${s * 0.6} ${s * 0.5}-${s * 0.5} 0`).join('')}
      stroke={color}
      strokeWidth="2.4"
      fill="none"
      strokeLinecap="round"
    />
  )
}

function Panel({ bg, children, ...p }: SVGProps<SVGSVGElement> & { bg: string; children: ReactNode }) {
  return (
    <svg viewBox="-24 -110 248 350" {...p}>
      <rect x="-24" y="-110" width="248" height="350" fill={bg} />
      <g opacity=".22" stroke={T.paper} strokeWidth="5" strokeLinecap="round">
        {Array.from({ length: 18 }, (_, i) => (
          <path key={i} d="M118 -52v-26" transform={`rotate(${i * 20} 118 76)`} />
        ))}
      </g>
      <circle cx="118" cy="76" r="104" fill={T.paper} opacity=".14" />
      {children}
    </svg>
  )
}

// --- atributos -------------------------------------------------------------
/** Keraunós: el rayo clásico de Zeus, un huso con puntas llameantes en ambos extremos. */
function Keraunos({ x, y, h, fill = T.ultra, line = T.paper }: { x: number; y: number; h: number; fill?: string; line?: string }) {
  const half = (dir: 1 | -1) => {
    const m = y + h / 2
    const tip = m - (dir * h) / 2
    const k = (v: number) => m - dir * v
    return (
      <g>
        <path d={`M${x - 8} ${k(8)}C${x - 14} ${k(h * 0.2)} ${x - 6} ${k(h * 0.36)} ${x} ${tip}C${x + 6} ${k(h * 0.36)} ${x + 14} ${k(h * 0.2)} ${x + 8} ${k(8)}z`} fill={fill} />
        {/* llamas laterales pegadas al huso, curvadas hacia la punta */}
        <path d={`M${x - 8} ${k(12)}C${x - 22} ${k(h * 0.16)} ${x - 20} ${k(h * 0.3)} ${x - 9} ${k(h * 0.4)}C${x - 14} ${k(h * 0.3)} ${x - 14} ${k(h * 0.2)} ${x - 6} ${k(16)}z`} fill={fill} />
        <path d={`M${x + 8} ${k(12)}C${x + 22} ${k(h * 0.16)} ${x + 20} ${k(h * 0.3)} ${x + 9} ${k(h * 0.4)}C${x + 14} ${k(h * 0.3)} ${x + 14} ${k(h * 0.2)} ${x + 6} ${k(16)}z`} fill={fill} />
        <path d={`M${x - 16} ${k(h * 0.22)}l-7 ${-dir * 4}M${x + 16} ${k(h * 0.22)}l7 ${-dir * 4}`} stroke={fill} strokeWidth="3" strokeLinecap="round" />
        <path d={`M${x} ${k(12)}l-4 ${-dir * 10} 6 ${-dir * 6}-5 ${-dir * 12} 5 ${-dir * 8}`} stroke={line} strokeWidth="1.8" fill="none" strokeLinejoin="round" />
      </g>
    )
  }
  return (
    <g>
      {half(1)}
      {half(-1)}
      <rect x={x - 9} y={y + h / 2 - 9} width="18" height="18" rx="4" fill={T.feather} stroke={fill} strokeWidth="3" />
      <path d={`M${x - 9} ${y + h / 2}h18`} stroke={fill} strokeWidth="2" />
    </g>
  )
}

function Eagle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* alas extendidas */}
      <path d="M40 30C24 10 6 4-10 6c10 6 16 12 20 20-8-2-14 0-18 4 10 0 20 4 28 10z" fill={T.earth} />
      <path d="M44 30C60 8 80 0 100 2c-10 6-18 14-22 22 8-2 16 0 20 4-12 0-24 4-32 10z" fill={T.earth} />
      <g stroke={T.featherLight} strokeWidth="1.4" fill="none">
        <path d="M2 10l10 10M10 8l8 12M76 8l-8 12M86 6l-10 12" />
      </g>
      {/* cuerpo, cabeza blanca y pico */}
      <path d="M34 28c6-4 14-4 18 2 4 10 0 22-8 28-8-6-14-18-10-30z" fill={T.earth} />
      <circle cx="36" cy="26" r="7" fill={T.paper} />
      <path d="M30 24l-7 3 6 3z" fill={T.feather} />
      <circle cx="35" cy="24.5" r="1.3" fill={T.ink} />
      {/* cola */}
      <path d="M40 56l-6 12h16l-6-12z" fill={T.earth} />
    </g>
  )
}

function OakWreath() {
  // hojas lobuladas de roble con bellotas, siguiendo la curva de la cabeza
  const pts: [number, number, number][] = [[84, 54, -40], [98, 44, -25], [114, 38, -10], [130, 36, 5], [146, 40, 20], [158, 50, 38], [166, 64, 60]]
  return (
    <g>
      <path d="M82 56C100 38 140 30 168 66" stroke={T.earth} strokeWidth="2.5" fill="none" />
      {pts.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
          <path d="M-9 0c-1-3 2-4 3-2 0-3 3-4 4-1 1-3 4-3 4 0 2-2 5-1 4 2 2 1 2 3 0 4 1 2-1 4-3 3-1 3-4 3-4 0-1 3-4 3-4 0-2 2-4 1-4-2z" fill={T.leaf} stroke={T.featherLight} strokeWidth=".8" />
          {i % 2 === 1 && (
            <g transform="translate(0 -8)">
              <ellipse cx="0" cy="0" rx="2.6" ry="3.4" fill={T.feather} />
              <path d="M-3-1h6v-2a3 2 0 0 0-6 0z" fill={T.earth} />
            </g>
          )}
        </g>
      ))}
    </g>
  )
}

function Trident({ x, y, h, color }: { x: number; y: number; h: number; color: string }) {
  return (
    <g stroke={color} strokeLinecap="round" fill="none">
      <path d={`M${x} ${y + h}V${y + 22}`} strokeWidth="6" />
      <path d={`M${x - 20} ${y + 42}V${y + 16}M${x + 20} ${y + 42}V${y + 16}M${x - 20} ${y + 42}q20 14 40 0`} strokeWidth="5" />
      {/* puntas con púas (barbas) */}
      <g fill={color} stroke="none">
        {[x - 20, x, x + 20].map((px) => (
          <path key={px} d={`M${px - 6} ${y + 20}l6-${px === x ? 26 : 20} 6 ${px === x ? 26 : 20}-3-3v6h-6v-6z`} />
        ))}
      </g>
      <path d={`M${x - 8} ${y + 64}h16`} strokeWidth="4" />
    </g>
  )
}

function Dolphin({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* delfín saltando: hocico, aleta dorsal, aleta pectoral y cola */}
      <path d="M0 30C4 26 10 22 16 18 30 6 56 2 76 10c10 4 16 12 20 18l12-8c-2 8-2 14 2 22l-14-8c-16 0-36 0-56 2-12 1-24 0-32-2z" fill={T.seaDeep} />
      <path d="M54 6c4-12 12-14 18-12-6 4-8 10-8 15z" fill={T.seaDeep} />
      <path d="M34 34c-2 8-8 12-14 12 4-4 6-8 6-11z" fill={T.seaDeep} />
      <path d="M10 32c20 0 50-2 82-2" stroke={T.paper} strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="18" cy="23" r="1.8" fill={T.paper} />
    </g>
  )
}

function Owl({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 48c-4-28 2-48 20-48s24 20 20 48c-6 6-34 6-40 0z" fill={T.earth} />
      <path d="M2 4l4-12 8 8M38 4l-4-12-8 8" fill={T.earth} />
      <g fill="none" stroke={T.featherLight} strokeWidth="1.4">
        <path d="M8 30q4 3 8 0t8 0 8 0M10 38q4 3 8 0t8 0" />
      </g>
      <circle cx="12" cy="14" r="7.5" fill={T.paper} />
      <circle cx="28" cy="14" r="7.5" fill={T.paper} />
      <circle cx="12" cy="14" r="3.4" fill={T.feather} />
      <circle cx="28" cy="14" r="3.4" fill={T.feather} />
      <circle cx="12" cy="14" r="1.6" fill={T.ink} />
      <circle cx="28" cy="14" r="1.6" fill={T.ink} />
      <path d="M18 20l2 6 2-6z" fill={T.feather} />
      <path d="M8 48v5M14 48v5M26 48v5M32 48v5" stroke={T.feather} strokeWidth="2" />
    </g>
  )
}

function OliveBranch({ x, y, s = 1, rot = 0 }: { x: number; y: number; s?: number; rot?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0C20 10 40 14 70 12" stroke={T.earth} strokeWidth="2.4" fill="none" />
      {[8, 20, 32, 44, 56].map((p, i) => (
        <g key={p}>
          <ellipse cx={p} cy={i % 2 ? 12 : 0} rx="8" ry="2.8" fill={T.leaf} transform={`rotate(${i % 2 ? 25 : -25} ${p} ${i % 2 ? 12 : 0})`} />
          {i % 2 === 0 && <ellipse cx={p + 4} cy={9} rx="2.6" ry="3.2" fill={T.ink} />}
        </g>
      ))}
    </g>
  )
}

function Gorgoneion({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      {/* cabellera de serpientes */}
      <g stroke={T.leaf} strokeWidth="2.4" fill="none" strokeLinecap="round">
        {Array.from({ length: 10 }, (_, i) => {
          const a = (i / 10) * Math.PI * 2
          const x0 = cx + Math.cos(a) * r
          const y0 = cy + Math.sin(a) * r
          const x1 = cx + Math.cos(a) * (r + 8)
          const y1 = cy + Math.sin(a) * (r + 8)
          return <path key={i} d={`M${x0} ${y0}Q${(x0 + x1) / 2 + Math.sin(a) * 5} ${(y0 + y1) / 2 - Math.cos(a) * 5} ${x1} ${y1}`} />
        })}
      </g>
      <circle cx={cx} cy={cy} r={r} fill={T.paper} stroke={T.ink} strokeWidth="1.6" />
      {/* ojos abiertos, colmillos y lengua */}
      <path d={`M${cx - r * 0.7} ${cy - r * 0.5}l${r * 0.5} ${r * 0.18}M${cx + r * 0.7} ${cy - r * 0.5}l${-r * 0.5} ${r * 0.18}`} stroke={T.ink} strokeWidth="1.8" />
      <circle cx={cx - r * 0.38} cy={cy - r * 0.15} r={r * 0.2} fill={T.paper} stroke={T.ink} strokeWidth="1.4" />
      <circle cx={cx + r * 0.38} cy={cy - r * 0.15} r={r * 0.2} fill={T.paper} stroke={T.ink} strokeWidth="1.4" />
      <circle cx={cx - r * 0.38} cy={cy - r * 0.15} r={r * 0.09} fill={T.ink} />
      <circle cx={cx + r * 0.38} cy={cy - r * 0.15} r={r * 0.09} fill={T.ink} />
      {/* boca abierta con colmillos y lengua fuera */}
      <path d={`M${cx - r * 0.6} ${cy + r * 0.22}q${r * 0.6} ${r * 0.55} ${r * 1.2} 0z`} fill={T.ink} />
      <path d={`M${cx - r * 0.45} ${cy + r * 0.24}l${r * 0.1} ${r * 0.24} ${r * 0.1}-${r * 0.24}M${cx + r * 0.25} ${cy + r * 0.24}l${r * 0.1} ${r * 0.24} ${r * 0.1}-${r * 0.24}`} fill={T.paper} />
      <path d={`M${cx - r * 0.15} ${cy + r * 0.36}q${r * 0.15} ${r * 0.75} ${r * 0.3} 0z`} fill={T.terra} />
    </g>
  )
}

function Cerberus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const head = (dx: number, dy: number, k: number) => (
    <g key={dx} transform={`translate(${dx} ${dy}) scale(${k})`}>
      <path d="M10 30C8 16 18 4 32 4c6 0 10 2 14 6l-2-12 10 10c6 6 8 14 6 22-8 8-18 12-30 12-10 0-16-4-20-12z" fill={T.night} stroke={T.soft} strokeWidth="1.4" />
      {/* hocico abierto con colmillos */}
      <path d="M12 26L-6 30l2 6 16-2" fill={T.night} stroke={T.soft} strokeWidth="1.4" />
      <path d="M-2 30l2 4 2-4M4 30l2 4 2-4" fill={T.paper} />
      <circle cx="24" cy="16" r="2.4" fill={T.terra} />
    </g>
  )
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* pecho y patas delanteras */}
      <path d="M2 76C2 52 26 38 46 38s42 12 44 38z" fill={T.night} stroke={T.soft} strokeWidth="1.4" />
      <path d="M22 76V60M62 76V58" stroke={T.soft} strokeWidth="1.4" />
      {/* collar con púas */}
      <path d="M12 46c20-8 50-8 70 0" stroke={T.feather} strokeWidth="5" fill="none" />
      <path d="M22 44l2-6 3 6M42 41l2-6 3 6M62 42l2-6 3 6" fill={T.feather} />
      {head(0, 8, 0.9)}
      {head(26, -8, 1)}
      {head(50, 10, 0.85)}
    </g>
  )
}

function Bident({ x, y, h, color }: { x: number; y: number; h: number; color: string }) {
  return (
    <g stroke={color} strokeLinecap="round" fill="none">
      <path d={`M${x} ${y + h}V${y + 40}`} strokeWidth="6" />
      <path d={`M${x - 14} ${y + 14}v18q14 14 28 0v-18`} strokeWidth="5" />
      <g fill={color} stroke="none">
        <path d={`M${x - 20} ${y + 16}l6-22 6 22z`} />
        <path d={`M${x + 8} ${y + 16}l6-22 6 22z`} />
      </g>
    </g>
  )
}

function Cypress({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g>
      <path d={`M${x} ${y}c-10 ${h * 0.3}-14 ${h * 0.6}-10 ${h}h20c4-${h * 0.4} 0-${h * 0.7}-10-${h}z`} fill={T.seaDeep} />
      <path d={`M${x} ${y + 12}v${h - 12}`} stroke={T.soft} strokeWidth="1.2" opacity=".6" />
    </g>
  )
}

function Kerykeion({ x, y, h }: { x: number; y: number; h: number }) {
  // vara con dos serpientes entrelazadas enfrentadas y alas en la punta
  const loops = 3
  const seg = (h - 60) / loops
  const snake = (dir: 1 | -1) =>
    `M${x} ${y + h - 20}` +
    Array.from({ length: loops }, (_, i) => {
      const y0 = y + h - 20 - i * seg
      return `C${x + dir * 18} ${y0 - seg * 0.25} ${x + dir * 18} ${y0 - seg * 0.75} ${x} ${y0 - seg}`
    }).join('') +
    `C${x - dir * 14} ${y + 40} ${x - dir * 16} ${y + 26} ${x - dir * 6} ${y + 22}`
  return (
    <g>
      <path d={`M${x} ${y + h}V${y + 8}`} stroke={T.feather} strokeWidth="5" strokeLinecap="round" />
      <circle cx={x} cy={y + 6} r="6" fill={T.feather} />
      {/* alas */}
      <path d={`M${x - 4} ${y + 18}c-10-12-24-16-36-12 8 2 12 6 14 10-6-2-10-1-12 2 10 0 22 2 34 4z`} fill={T.paper} />
      <path d={`M${x + 4} ${y + 18}c10-12 24-16 36-12-8 2-12 6-14 10 6-2 10-1 12 2-10 0-22 2-34 4z`} fill={T.paper} />
      <path d={snake(1)} stroke={T.cloud} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d={snake(-1)} stroke={T.featherLight} strokeWidth="4" fill="none" strokeLinecap="round" />
      <circle cx={x - 6} cy={y + 22} r="3.4" fill={T.cloud} />
      <circle cx={x + 6} cy={y + 22} r="3.4" fill={T.featherLight} />
    </g>
  )
}

function Talaria({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 30h44c6 0 10 4 10 8H2c-2 0-4-4-2-8z" fill={T.earth} />
      <path d="M10 30V14c0-4 6-6 10-2l6 18" fill={T.earth} />
      <path d="M8 16l4 4M8 22l4 4" stroke={T.feather} strokeWidth="1.6" />
      <path d="M18 14c8-12 22-16 34-14-6 4-8 8-8 12 4-2 8-2 12 0-8 2-14 6-18 10 4 0 6 2 6 4-12 2-22-2-26-12z" fill={T.paper} />
      <path d="M26 14l20-6M28 18l18-2" stroke={T.earth} strokeWidth="1" />
    </g>
  )
}

function Pomegranate({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {/* fruto partido con sus semillas */}
      <path d="M0 22C0 8 12 0 24 0s24 8 24 22c0 16-10 28-24 28S0 38 0 22z" fill={T.terra} />
      <path d="M18 0l-2-8 5 4 3-6 3 6 5-4-2 8z" fill={T.terra} />
      <path d="M8 22c0-8 7-13 16-13s16 5 16 13c0 10-7 18-16 18S8 32 8 22z" fill={T.paper} />
      <g fill={T.terraDeep}>
        {[[14, 16], [20, 14], [26, 14], [32, 17], [12, 23], [18, 21], [24, 21], [30, 23], [36, 24], [15, 29], [21, 28], [27, 28], [33, 30], [19, 34], [25, 35], [30, 35]].map(([a, b]) => (
          <ellipse key={`${a}${b}`} cx={a} cy={b} rx="2.3" ry="2.9" />
        ))}
      </g>
    </g>
  )
}

function Torch({ x, y, h, rot = 0 }: { x: number; y: number; h: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y + h})`}>
      <path d={`M${x} ${y + h}V${y + 24}`} stroke={T.earth} strokeWidth="6" strokeLinecap="round" />
      <path d={`M${x - 8} ${y + 26}h16l-3 10h-10z`} fill={T.feather} />
      <path d={`M${x} ${y - 30}c-14 16-16 34-8 54h16c8-20 4-38-8-54z`} fill={T.terra} />
      <path d={`M${x} ${y - 10}c-6 10-8 20-4 32h8c4-12 2-22-4-32z`} fill={T.feather} />
    </g>
  )
}

function Wheat({ x, y, h, rot = 0 }: { x: number; y: number; h: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y + h})`}>
      <path d={`M${x} ${y + h}V${y}`} stroke={T.feather} strokeWidth="2.4" />
      {Array.from({ length: 6 }, (_, i) => (
        <g key={i}>
          <ellipse cx={x - 5} cy={y + 6 + i * 8} rx="3.4" ry="6" fill={T.feather} transform={`rotate(-25 ${x - 5} ${y + 6 + i * 8})`} />
          <ellipse cx={x + 5} cy={y + 10 + i * 8} rx="3.4" ry="6" fill={T.feather} transform={`rotate(25 ${x + 5} ${y + 10 + i * 8})`} />
        </g>
      ))}
      <path d={`M${x} ${y}l-2-14M${x - 5} ${y + 4}l-8-12M${x + 5} ${y + 6}l8-12`} stroke={T.featherLight} strokeWidth="1.2" />
    </g>
  )
}

function Narcissus({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-6" rx="3.6" ry="6.4" fill={T.paper} transform={`rotate(${a})`} />
      ))}
      <circle r="3.8" fill={T.feather} />
      <circle r="1.8" fill={T.terra} />
    </g>
  )
}

// --- los dioses --------------------------------------------------------------
function Zeus() {
  return (
    <>
      <Eagle x={-18} y={-78} s={0.9} />
      <Keraunos x={196} y={-70} h={210} />
      <path d={MALE} fill={T.ultra} />
      {/* himatión sobre el hombro con pliegues y greca */}
      <path d="M150 158c26 6 60 24 74 56v26H44c34-22 70-50 106-82z" fill={T.terra} />
      <g stroke={T.terraDeep} strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M150 172c-20 20-44 40-70 58M168 176c-18 22-38 42-58 60M186 186c-14 20-28 38-42 52M204 198c-8 14-18 28-28 40" />
      </g>
      <path d="M150 158c-34 32-70 60-106 82" stroke={T.feather} strokeWidth="7" fill="none" />
      {/* cabello rizado */}
      <path d="M78 58C80 30 110 18 138 24c30 6 42 40 32 74-4 14-10 26-14 38-10-8-14-24-16-40-4-20-22-32-44-34-6 0-12-2-18-4z" fill={T.deep} />
      <Curls pts={[[84, 60], [94, 58], [140, 50], [152, 60], [160, 74], [162, 90], [158, 106], [150, 118], [120, 44], [104, 50]]} />
      {/* barba de rizos y bigote */}
      <path d="M128 100c4 22 2 46-12 64-12 16-32 18-40 2-6-14-4-28 0-40 12 2 28-2 40-14 6-4 10-8 12-12z" fill={T.deep} />
      <path d="M72 111c6-3 16-1 22 7-9 2-16 0-22-7z" fill={T.deep} />
      <Curls pts={[[86, 134], [98, 132], [110, 126], [120, 116], [84, 148], [96, 148], [108, 142], [118, 134], [92, 162], [104, 160], [114, 152]]} r={4} />
      <OakWreath />
      <Face kind="elder" mouth={false} />
    </>
  )
}

function Poseidon() {
  return (
    <>
      <Dolphin x={-20} y={-70} s={0.9} />
      <Trident x={186} y={-84} h={320} color={T.cloudDeep} />
      <g opacity=".7">
        <WaveScroll x={-20} y={40} n={3} s={12} color={T.paper} />
      </g>
      <path d={MALE} fill={T.ultra} />
      {/* himatión con cenefa de olas */}
      <path d="M152 164c26 6 58 22 72 50v26H70c26-18 56-44 82-76z" fill={T.featherLight} />
      <path d="M152 164c-26 32-56 58-82 76" stroke={T.seaDeep} strokeWidth="4" fill="none" />
      <WaveScroll x={96} y={236} n={6} s={10} color={T.seaDeep} />
      {/* cabello largo y mojado */}
      <path d="M78 58C84 28 120 16 148 28c28 12 34 52 26 84-4 18 4 44 16 66-24-2-38-22-40-46-2-26-8-48-30-60-12-6-26-10-42-14z" fill={T.deep} />
      <g stroke={T.soft} strokeWidth="2.2" fill="none" strokeLinecap="round">
        <path d="M136 44q12 12 6 26t6 28 4 26M150 52q14 14 8 30t8 32 6 30M122 40q14 4 22 16" />
      </g>
      {/* barba larga ondulada */}
      <path d="M130 102c6 26 4 54-4 78l-8 14-8-10-8 12-8-12-8 8c-6-18-10-40-8-64 14 2 32-4 42-16 6-4 10-6 12-10z" fill={T.deep} />
      <path d="M72 111c6-3 16-1 22 7-9 2-16 0-22-7z" fill={T.deep} />
      <g stroke={T.soft} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M84 136q6-6 12 0t12 0M88 152q6-6 12 0t12 0M92 168q6-6 12 0M100 182q5-5 10 0" />
      </g>
      {/* diadema (tenia) con cintas al viento */}
      <path d="M80 56c28-14 64-16 90 6" stroke={T.feather} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M170 62c10 8 8 22 18 34M168 66c6 12 2 24 8 36" stroke={T.feather} strokeWidth="3" fill="none" strokeLinecap="round" />
      <Face kind="elder" mouth={false} />
    </>
  )
}

function Athena() {
  return (
    <>
      <OliveBranch x={-24} y={-80} s={1.1} rot={18} />
      {/* escudo (aspís) con greca en el borde */}
      <circle cx="192" cy="120" r="78" fill={T.feather} />
      <circle cx="192" cy="120" r="66" fill="none" stroke={T.earth} strokeWidth="3" strokeDasharray="10 6" />
      <Owl x={170} y={90} s={0.95} />
      {/* lanza */}
      <path d="M-10 240L40-60" stroke={T.earth} strokeWidth="5" strokeLinecap="round" />
      <path d="M40-60l-10 26 14 3z" fill={T.ink} />
      <path d={FEMALE} fill={T.ultra} />
      {/* trenzas bajo el casco */}
      <path d="M132 76c18 18 24 50 16 78-4 18 2 32 14 42-24 0-34-20-32-42 2-28 0-52 2-78z" fill={T.deep} />
      <path d="M140 96q6 14 0 28t4 26M148 104q6 14 0 28" stroke={T.soft} strokeWidth="2" fill="none" />
      <path d="M86 66c-6 8-6 16-2 22 4-8 8-12 14-14z" fill={T.deep} />
      {/* casco corintio levantado sobre la frente */}
      <path d="M84 60C80 34 104 18 132 20c28 2 44 24 40 52-2 14-8 24-16 32-6-10-10-22-16-28L100 70c-6-2-12-6-16-10z" fill={T.feather} />
      {/* frente del casco levantada: abertura del ojo y protector nasal */}
      <path d="M90 44q9-6 18-1q-9 5-18 1z" fill={T.ink} />
      <path d="M84 56l-8 12 7 2 5-10z" fill={T.feather} stroke={T.earth} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M86 58c10-4 18-4 26 0" stroke={T.earth} strokeWidth="1.6" fill="none" />
      <path d="M150 64c8 14 8 28 2 40" stroke={T.earth} strokeWidth="2.4" fill="none" />
      <path d="M92 30c20-6 50-6 72 6" stroke={T.earth} strokeWidth="2" fill="none" />
      {/* cimera de crin sobre soporte */}
      <path d="M118 20v-8h10v8z" fill={T.earth} />
      <path d="M90 16C104-18 162-22 200 6c-12 2-20 8-24 16-10-12-30-16-48-12-14 2-26 4-38 6z" fill={T.terra} />
      <g stroke={T.cloud} strokeWidth="1.6" fill="none" strokeLinecap="round">
        <path d="M100 8q18-14 40-14M120 0q22-10 46-2M140-2q22-2 40 8M110 12q20-6 40-4" />
      </g>
      {/* égida de escamas con flecos de serpientes y gorgoneion */}
      <defs>
        <pattern id="aegis-scales" width="12" height="10" patternUnits="userSpaceOnUse">
          <rect width="12" height="10" fill={T.feather} />
          <path d="M0 10a6 6 0 0 1 12 0M-6 5a6 6 0 0 1 12 0M6 5a6 6 0 0 1 12 0" stroke={T.earth} strokeWidth="1.2" fill="none" />
        </pattern>
      </defs>
      <path d="M36 200c30-14 70-20 114-24 30 4 56 18 64 40v24H-14v-14c14-12 30-20 50-26z" fill="url(#aegis-scales)" />
      <g stroke={T.leaf} strokeWidth="2.4" fill="none" strokeLinecap="round">
        {[40, 62, 84, 108, 132, 156, 180].map((x, i) => (
          <path key={x} d={`M${x} ${196 - Math.sin(i / 2) * 8}q-4-8 2-12t2-10`} />
        ))}
      </g>
      <Gorgoneion cx={96} cy={214} r={15} />
      <circle cx="129" cy="126" r="3.4" fill="none" stroke={T.feather} strokeWidth="2" />
      <Face kind="female" line={T.featherLight} />
    </>
  )
}

function Hades() {
  return (
    <>
      <Cypress x={-6} y={-80} h={200} />
      <Cypress x={20} y={-40} h={160} />
      <Bident x={196} y={-86} h={326} color={T.feather} />
      <path d={MALE} fill={T.ultra} />
      {/* manto oscuro sobre ambos hombros, borde con greca */}
      <path d="M-24 214c24-28 74-38 122-38 20 0 40-6 54-14 28 8 60 24 72 52v26H-24z" fill={T.terraDeep} />
      <MeanderBand x={4} y={188} w={180} h={10} color={T.feather} />
      <g stroke={T.night} strokeWidth="2" fill="none" opacity=".6">
        <path d="M30 206c10 12 14 24 12 34M70 200c6 14 8 26 6 40M160 190c-4 16-4 32 0 50" />
      </g>
      {/* cabello y barba largos y lacios */}
      <path d="M78 58C80 28 112 16 140 24c28 8 38 42 30 76-4 18-2 40 6 60-20-2-28-18-30-40-2-24-10-44-32-54-12-4-24-6-36-8z" fill={T.night} />
      <g stroke={T.soft} strokeWidth="1.6" fill="none" opacity=".8">
        <path d="M140 40q10 30 6 60t8 50M152 46q8 30 4 60t8 48M128 36q8 20 8 34" />
      </g>
      <path d="M130 100c6 30 4 66-6 90-16 4-34 0-44-10-6-16-8-36-6-56 14 2 34-4 44-14 6-4 10-6 12-10z" fill={T.night} />
      <path d="M72 111c6-3 16-1 22 7-9 2-16 0-22-7z" fill={T.night} />
      <g stroke={T.soft} strokeWidth="1.6" fill="none" opacity=".8">
        <path d="M88 130v50M98 128v58M108 124v62M118 116v66" />
      </g>
      {/* diadema real */}
      <path d="M80 56c28-14 64-16 90 6" stroke={T.feather} strokeWidth="5" fill="none" />
      <path d="M92 50l4-10 4 8M114 44l4-12 4 12M136 44l4-10 4 10" fill={T.feather} />
      <Cerberus x={-24} y={168} s={0.95} />
      <Face kind="elder" line={T.cloud} mouth={false} />
    </>
  )
}

function Hermes() {
  return (
    <>
      <Talaria x={-18} y={-74} s={1.05} />
      <Kerykeion x={188} y={-92} h={330} />
      <path d={MALE} fill={T.ultra} />
      {/* clámide prendida con fíbula */}
      <path d="M100 186c34-10 70-18 104-2 10 8 18 18 20 30v26H56c14-20 28-38 44-54z" fill={T.feather} />
      <g stroke={T.earth} strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M120 196c-10 16-18 30-22 44M150 190c-8 18-12 34-12 50M180 190c-4 18-4 34 0 50" />
      </g>
      <path d="M56 240c14-20 28-38 44-54" stroke={T.earth} strokeWidth="3" fill="none" />
      <circle cx="104" cy="190" r="8" fill={T.terra} stroke={T.paper} strokeWidth="2" />
      <circle cx="104" cy="190" r="3" fill={T.paper} />
      {/* rizos cortos bajo el pétaso */}
      <path d="M82 70c-2-14 10-24 26-26 24-2 46 8 54 28 4 12 2 24-4 36-6-10-10-20-18-28-16-8-36-10-58-10z" fill={T.deep} />
      <Curls pts={[[86, 72], [96, 70], [150, 80], [156, 94], [146, 104]]} r={4} />
      {/* pétaso de ala ancha con alas */}
      <ellipse cx="120" cy="56" rx="66" ry="12" fill={T.paper} transform="rotate(-8 120 56)" />
      <path d="M86 52c0-22 16-34 36-34s34 12 34 30c-20 6-50 8-70 4z" fill={T.paper} />
      <path d="M88 50c22 4 46 2 66-4" stroke={T.earth} strokeWidth="2" fill="none" />
      <path d="M148 38c10-18 28-26 48-24-8 4-12 8-14 14 8-4 14-4 20-2-10 2-18 8-22 14 6 0 10 2 12 4-16 6-32 4-44-6z" fill={T.featherLight} stroke={T.earth} strokeWidth="1.2" />
      <path d="M156 34l30-12M160 40l26-6M162 46l20-2" stroke={T.earth} strokeWidth="1.1" />
      <Face kind="youth" />
    </>
  )
}

function Persephone() {
  return (
    <>
      <Torch x={16} y={-40} h={250} rot={-8} />
      <Pomegranate x={150} y={-70} s={1.1} />
      <Wheat x={206} y={-10} h={120} rot={8} />
      <Wheat x={190} y={10} h={110} rot={-4} />
      {/* velo */}
      <path d="M118 30c40-6 72 26 74 74 2 40 6 78 22 112v24H148c2-36 2-70-2-104 4-30 0-60-28-106z" fill={T.deep} />
      <g fill={T.soft}>
        {[[160, 80], [170, 120], [178, 160], [186, 200], [166, 196], [156, 140]].map(([x, y]) => (
          <path key={`${x}${y}`} d={`M${x} ${y}l2 5 5 1-4 3 1 5-4-3-4 3 1-5-4-3 5-1z`} />
        ))}
      </g>
      <path d={FEMALE} fill={T.cloud} />
      {/* quitón con greca en el escote */}
      <path d="M-14 222c24-26 64-36 112-38 22 0 38-6 52-14 26 8 54 22 64 46v24H-14z" fill={T.paper} />
      <MeanderBand x={10} y={190} w={170} h={10} color={T.ultra} bg={T.feather} />
      <g stroke={T.featherLight} strokeWidth="2" fill="none" opacity=".9">
        <path d="M40 206c6 12 8 24 6 34M80 202c4 12 6 26 4 38M140 200c-2 14-2 28 0 40" />
      </g>
      {/* collar de cuentas */}
      <g fill={T.terra}>
        {[92, 100, 108, 116, 124].map((x, i) => <circle key={x} cx={x} cy={164 + Math.sin(i / 1.3) * 4} r="2.6" />)}
      </g>
      {/* cabello ondulado sobre la frente */}
      <path d="M82 64c2-18 20-30 42-28 20 2 32 14 34 34-12-8-26-12-42-10-12 0-24 2-34 4z" fill={T.deep} />
      <path d="M84 66q10-8 20-2t20-4" stroke={T.soft} strokeWidth="2" fill="none" />
      {/* stéphane (diadema en creciente) */}
      <path d="M84 50c14-20 52-26 76-6-10 2-20 4-28 8-14-6-32-6-48-2z" fill={T.feather} />
      <g fill={T.terra}>
        {[100, 116, 132, 146].map((x) => <circle key={x} cx={x} cy={42 - (x > 120 ? 0 : 1)} r="2.2" />)}
      </g>
      {/* corona de narcisos */}
      {[[82, 58], [96, 40], [118, 30], [142, 32], [162, 46]].map(([x, y], i) => (
        <Narcissus key={i} x={x} y={y} s={i % 2 ? 0.9 : 1.05} />
      ))}
      <circle cx="129" cy="128" r="3.4" fill="none" stroke={T.feather} strokeWidth="2" />
      <Face kind="female" line={T.ultra} />
    </>
  )
}

const ART: Record<GodId, () => ReactNode> = { zeus: Zeus, poseidon: Poseidon, athena: Athena, hades: Hades, hermes: Hermes, persephone: Persephone }

export function GodPortrait({ id, bg, ...p }: SVGProps<SVGSVGElement> & { id: GodId; bg?: string }) {
  const god = GODS.find((g) => g.id === id)!
  const Art = ART[id]
  return (
    <Panel bg={bg ?? god.bg} role="img" aria-label={`${god.name} (${god.greek}), ${god.title}. Atributos: ${god.attributes.join(', ')}`} preserveAspectRatio="xMidYMax slice" {...p}>
      <Art />
    </Panel>
  )
}

// --- signos mitológicos ----------------------------------------------------
export type SignId = 'bolt' | 'trident' | 'owl' | 'pomegranate' | 'caduceus' | 'lyre' | 'laurel' | 'eye' | 'helm' | 'wave' | 'sun' | 'ship'

const SIGN_PATHS: Record<SignId, ReactNode> = {
  // keraunós: huso con puntas en ambos extremos
  bolt: (
    <>
      <path d="M50 8c-6 14-7 26-4 36h8c3-10 2-22-4-36zM50 92c-6-14-7-26-4-36h8c3 10 2 22-4 36z" fill="currentColor" />
      <path d="M44 38C32 30 28 20 32 12M56 38c12-8 16-18 12-26M44 62c-12 8-16 18-12 26M56 62c12 8 16 18 12 26" />
      <rect x="42" y="44" width="16" height="12" rx="3" />
    </>
  ),
  trident: <><path d="M50 94V20M30 42V14M70 42V14M30 42q20 14 40 0" /><path d="M24 16l6-10 6 10M44 18l6-12 6 12M64 16l6-10 6 10" /></>,
  owl: <><path d="M26 86c-8-40 2-66 24-66s32 26 24 66z" /><circle cx="40" cy="42" r="8" /><circle cx="60" cy="42" r="8" /><path d="M48 52l2 6 2-6M30 22l-4-12 12 8M70 22l4-12-12 8" /></>,
  pomegranate: <><circle cx="50" cy="58" r="30" /><path d="M40 28l4-12 6 8 6-8 4 12M36 60q14 12 28 0" /></>,
  caduceus: <><path d="M50 94V10" /><path d="M36 26c12-10 20 0 14 10s-16 16 0 26 14 16 0 26M64 26c-12-10-20 0-14 10s16 16 0 26-14 16 0 26" /><path d="M50 18c-14-10-28-8-40-16M50 18c14-10 28-8 40-16" /></>,
  lyre: <><path d="M30 20c-12 24-8 50 8 64h24c16-14 20-40 8-64" /><path d="M26 22h48M40 30v52M50 30v52M60 30v52" /></>,
  laurel: <><path d="M50 92C22 80 14 50 24 22M50 92c28-12 36-42 26-70" /><path d="M24 34l-10-4M22 50l-10 0M26 66l-10 4M76 34l10-4M78 50l10 0M74 66l10 4" /></>,
  eye: <><path d="M8 50q42-40 84 0-42 40-84 0z" /><circle cx="50" cy="50" r="12" /><circle cx="50" cy="50" r="4" fill="currentColor" /></>,
  // casco corintio de perfil: calota, nasal, abertura de ojo y cimera
  helm: <><path d="M22 86V52c0-22 14-36 32-36s28 14 28 34v36H62V64l-10 4v18z" /><path d="M36 50q8-6 16-2" /><path d="M28 16C40 0 70-2 88 12" /></>,
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
      <figcaption className="absolute -bottom-3 left-4 rounded-full bg-ink px-4 py-1 font-display text-sm font-bold tracking-widest text-feather">
        {god.name} <span className="font-sans font-normal text-paper/70">{god.greek}</span>
      </figcaption>
    </figure>
  )
}
