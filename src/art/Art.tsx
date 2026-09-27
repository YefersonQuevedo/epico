// Ilustraciones propias en SVG, inspiradas en la serigrafía griega moderna:
// formas planas de ultramar, nubes rosas, plumas ocre y motas "a mano".
import type { SVGProps } from 'react'
import type { MusicalId } from '../lib/types'

export const C = {
  paper: '#f3ede1',
  ink: '#141a4d',
  ultra: '#2536b8',
  deep: '#17217a',
  soft: '#7383d9',
  cloud: '#eeb1a3',
  cloudDeep: '#d98a7c',
  feather: '#d8b77e',
  featherLight: '#e6cc9c',
  earth: '#6e3b22',
  terra: '#c2462f',
}

/** Patrones y símbolos compartidos. Se monta una sola vez en el layout. */
export function ArtDefs() {
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <pattern id="spk-ultra" width="22" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">
          <rect width="22" height="16" fill={C.ultra} />
          <ellipse cx="5" cy="4" rx="3.2" ry="1.3" fill={C.featherLight} transform="rotate(-25 5 4)" />
          <ellipse cx="8.5" cy="5.6" rx="1.8" ry="0.8" fill={C.ink} transform="rotate(-25 8.5 5.6)" />
          <ellipse cx="16" cy="12" rx="3.2" ry="1.3" fill={C.featherLight} transform="rotate(-25 16 12)" />
        </pattern>
        <pattern id="spk-deep" width="18" height="14" patternUnits="userSpaceOnUse">
          <rect width="18" height="14" fill={C.deep} />
          <path d="M3 4q3-2 6 0M11 11q3-2 6 0" stroke={C.soft} strokeWidth="1.4" fill="none" strokeLinecap="round" />
        </pattern>
        <pattern id="spk-gold" width="16" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(12)">
          <rect width="16" height="12" fill={C.feather} />
          <path d="M2 3l4 1.5M10 9l4 1.5M9 2l2 2M3 9l1.5 2" stroke={C.ink} strokeWidth="1.5" strokeLinecap="round" />
        </pattern>
        <pattern id="spk-snake" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill={C.soft} />
          <circle cx="6" cy="6" r="4.4" fill={C.feather} />
          <circle cx="6" cy="6" r="1.7" fill={C.ink} />
          <circle cx="19" cy="19" r="4.4" fill={C.feather} />
          <circle cx="19" cy="19" r="1.7" fill={C.ink} />
          <path d="M16 5q3 2 6 0M3 18q3 2 6 0" stroke={C.ink} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </pattern>
        <pattern id="spk-cloud" width="30" height="20" patternUnits="userSpaceOnUse">
          <rect width="30" height="20" fill={C.cloud} />
          <path d="M4 8q4-4 8 0M19 17q4-4 8 0" stroke={C.cloudDeep} strokeWidth="1.3" fill="none" strokeLinecap="round" />
        </pattern>

        <symbol id="feather" viewBox="0 0 40 170">
          <path d="M20 170C7 120 5 60 20 0c15 60 13 120 0 170z" fill={C.feather} />
          <path d="M20 164V10" stroke={C.earth} strokeWidth="2" strokeLinecap="round" />
          <path
            d="M10 34l6 4M30 34l-6 4M9 52l6 4M31 52l-6 4M9 70l6 4M31 70l-6 4M10 88l6 4M30 88l-6 4M11 106l6 4M29 106l-6 4M13 124l5 4M27 124l-5 4"
            stroke={C.earth} strokeWidth="2.4" strokeLinecap="round"
          />
          <path d="M14 20l3 3M26 20l-3 3M8 44l3 2M32 44l-3 2" stroke={C.ultra} strokeWidth="1.6" strokeLinecap="round" />
        </symbol>

        <symbol id="bird" viewBox="0 0 220 150">
          {/* cola */}
          <path d="M128 82c24-10 52-26 86-34-10 18-9 38 2 58-30-2-60-10-88-16z" fill="url(#spk-ultra)" />
          <path d="M140 84l66-24M142 90l68 4M140 96l62 20" stroke={C.ink} strokeWidth="2" strokeLinecap="round" opacity=".7" />
          {/* ala trasera */}
          <path d="M74 70C80 36 112 12 160 4c-16 18-26 42-30 70z" fill="url(#spk-ultra)" />
          {/* cuerpo */}
          <path d="M40 72c22-18 74-18 96 2-14 24-64 30-92 14z" fill="url(#spk-ultra)" />
          {/* ala delantera */}
          <path d="M66 74c2-30 20-50 52-62-6 16-8 36-4 60z" fill={C.ultra} />
          <path d="M72 70c6-18 18-34 36-46M82 72c6-14 14-26 26-34M94 72c4-10 10-18 18-24" stroke={C.featherLight} strokeWidth="2.2" strokeLinecap="round" fill="none" strokeDasharray="4 6" />
          {/* cabeza */}
          <circle cx="40" cy="70" r="15" fill={C.ultra} />
          <path d="M26 66L8 71l19 5z" fill={C.feather} />
          <circle cx="36" cy="66" r="2.6" fill={C.paper} />
          <circle cx="36" cy="66" r="1.1" fill={C.ink} />
          {/* rama de olivo */}
          <path d="M12 72c-8-10-10-24-4-38" stroke={C.earth} strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M9 60c-6-2-9-6-9-10 5 0 9 4 9 10zM7 48c6-2 9-6 9-10-5 0-9 4-9 10zM8 38c-5-3-7-7-6-11 4 1 7 5 6 11z" fill={C.feather} />
        </symbol>
      </defs>
    </svg>
  )
}

export function Bird({ flip, ...p }: SVGProps<SVGSVGElement> & { flip?: boolean }) {
  return (
    <svg viewBox="0 0 220 150" aria-hidden="true" {...p}>
      <g transform={flip ? 'translate(220 0) scale(-1 1)' : undefined}>
        <use href="#bird" width="220" height="150" />
      </g>
    </svg>
  )
}

export function Cloud({ fill = C.cloud, ...p }: SVGProps<SVGSVGElement> & { fill?: string }) {
  return (
    <svg viewBox="0 0 320 170" aria-hidden="true" {...p}>
      <path
        d="M40 135c-34 0-44-40-14-54-8-34 36-54 60-36 8-40 72-46 88-10 16-30 74-24 78 16 36-6 56 34 32 56 24 18 4 56-30 48-16 28-66 28-82 8-24 20-74 20-86-4-18 12-46 0-46-24z"
        fill={fill}
      />
      <path d="M92 58c10-6 22-6 30 2M182 48c10-4 20-2 26 6M248 92c8 2 14 8 14 16M60 104c-8 4-12 10-10 18M140 128c10 6 24 6 34-2" stroke={C.earth} strokeWidth="3" fill="none" strokeLinecap="round" opacity=".55" />
    </svg>
  )
}

/** Greca griega — referencia a EPIC. */
export function Meander({ className = '', color = C.ultra }: { className?: string; color?: string }) {
  return (
    <svg className={className} height="22" width="100%" aria-hidden="true">
      <defs>
        <pattern id={`meander-${color.slice(1)}`} width="44" height="22" patternUnits="userSpaceOnUse">
          <path d="M0 20h40V2H8v12h24V8H16" fill="none" stroke={color} strokeWidth="3.2" strokeLinejoin="round" />
        </pattern>
      </defs>
      <rect width="100%" height="22" fill={`url(#meander-${color.slice(1)})`} />
    </svg>
  )
}

/** Figura principal: un héroe de perfil con corona de plumas, nube rosa, tridente, serpiente y aves. */
export function HeroArt(props: SVGProps<SVGSVGElement>) {
  const angles = [-62, -44, -26, -8, 10, 28, 46]
  return (
    <svg viewBox="0 0 620 580" role="img" aria-label="Ilustración: héroe de perfil con corona de plumas, aves y nube rosa" {...props}>
      {/* nube */}
      <g transform="translate(70 90) scale(1.25)">
        <path
          d="M40 135c-34 0-44-40-14-54-8-34 36-54 60-36 8-40 72-46 88-10 16-30 74-24 78 16 36-6 56 34 32 56 24 18 4 56-30 48-16 28-66 28-82 8-24 20-74 20-86-4-18 12-46 0-46-24z"
          fill={C.cloud}
        />
        <path d="M92 58c10-6 22-6 30 2M182 48c10-4 20-2 26 6M60 104c-8 4-12 10-10 18" stroke={C.cloudDeep} strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>

      {/* tridente */}
      <g stroke={C.cloudDeep} strokeWidth="9" strokeLinecap="round" fill="none">
        <path d="M540 470V70" />
        <path d="M510 130V70M570 130V70M510 130q30 22 60 0" />
      </g>
      <path d="M502 72l8-22 8 22zM532 64l8-26 8 26zM562 72l8-22 8 22z" fill={C.cloudDeep} />
      {/* serpiente enrollada al tridente */}
      <path d="M540 120c-30 14-30 30 0 40s30 26 0 40-30 30 0 40" stroke={C.cloud} strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M540 120c10-12 26-12 30-26" stroke={C.cloud} strokeWidth="8" fill="none" strokeLinecap="round" />

      {/* corona de plumas */}
      <g>
        {angles.map((a) => (
          <use key={a} href="#feather" x="366" y="8" width="64" height="170" preserveAspectRatio="none" transform={`rotate(${a} 398 178)`} />
        ))}
      </g>

      {/* figura */}
      <path
        d="M300 196c0-34 40-56 82-46 42 10 62 52 54 92-4 30-12 50-17 70 45 10 125 30 165 90l36 178H170c-10-90 20-160 100-190 30-10 50-20 55-40-15-5-35-8-43-16-8-6-8-14-4-18-6-4-6-10-2-14-4-3-4-8 0-11-6-3-16-9-20-15 6-12 16-24 22-36 4-12 8-20 12-26z"
        fill={C.ultra}
      />
      {/* cabello */}
      <path
        d="M298 196c0-40 52-66 104-50 44 14 60 64 44 108-4 14-10 26-12 46-14-10-20-30-24-50-10-30-36-48-78-52-14-1-26-1-34-2z"
        fill="url(#spk-deep)"
      />
      <path d="M320 170c20-10 50-12 72-2M332 184c24-6 50-2 70 12M360 158c24 0 50 14 64 36M404 210c10 14 16 30 16 48" stroke={C.soft} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* rasgos en línea ocre */}
      <g stroke={C.featherLight} strokeWidth="3.2" fill="none" strokeLinecap="round">
        <path d="M292 214c12-8 28-8 40-2" />
        <path d="M296 228c10-6 22-6 32 0M298 234h28" />
        <path d="M384 240c20-2 24 30 2 34" />
        <path d="M278 290h14" />
        <path d="M300 420c40-14 90-14 130 4" />
        <path d="M250 470c20-20 40-30 60-34" opacity=".6" />
      </g>
      <circle cx="388" cy="284" r="6" fill="none" stroke={C.feather} strokeWidth="3" />

      {/* piel de leopardo sobre el hombro */}
      <path d="M190 470c50-40 140-60 250-36-20 26-100 30-160 44-40 10-70 12-90-8z" fill="url(#spk-gold)" />
      <path d="M230 420c30-20 90-30 130-24-20 16-60 20-90 30-20 6-32 4-40-6z" fill="url(#spk-gold)" />

      {/* serpiente moteada */}
      <path d="M620 350c-60 20-120 50-130 110-8 50 60 70 130 40" stroke="url(#spk-snake)" strokeWidth="44" fill="none" strokeLinecap="round" />
      <path d="M620 350c-60 20-120 50-130 110-8 50 60 70 130 40" stroke={C.ink} strokeWidth="2" strokeDasharray="10 14" fill="none" opacity=".5" />

      {/* aves */}
      <g className="float">
        <use href="#bird" x="0" y="40" width="220" height="150" />
      </g>
      <g className="float" style={{ animationDelay: '-3s' }}>
        <use href="#bird" x="20" y="360" width="190" height="130" />
      </g>
    </svg>
  )
}

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 5, strokeLinecap: 'round', strokeLinejoin: 'round' } as const

/** Emblema dibujado a mano de cada musical. */
export function MusicalIcon({ id, className }: { id: MusicalId | string; className?: string }) {
  const common = { viewBox: '0 0 100 100', className, 'aria-hidden': true }
  switch (id) {
    case 'hamilton':
      return (
        <svg {...common} {...S}>
          <path d="M78 8C46 18 30 48 32 84c16-18 40-44 46-76z" />
          <path d="M34 80L60 30M40 64l14-4M46 50l14-4" />
          <path d="M32 84l-6 10" />
          <path d="M74 66l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z" strokeWidth={3} />
        </svg>
      )
    case 'six':
      return (
        <svg {...common} {...S}>
          <path d="M18 70l6-38 16 20 10-30 10 30 16-20 6 38z" />
          <path d="M18 80h64" />
          <circle cx="24" cy="28" r="3" />
          <circle cx="50" cy="18" r="3" />
          <circle cx="76" cy="28" r="3" />
          <path d="M40 62v-8M46 54l4 8 4-8M60 54v8" strokeWidth={3} />
        </svg>
      )
    case 'hadestown':
      return (
        <svg {...common} {...S}>
          <circle cx="50" cy="36" r="7" />
          <path d="M50 29c-4-14 10-14 0 0M57 36c14-4 14 10 0 0M50 43c4 14-10 14 0 0M43 36c-14 4-14-10 0 0" />
          <path d="M50 43v48M50 70c-10-2-16-10-18-18M50 78c10-2 16-10 18-18" />
        </svg>
      )
    case 'heathers':
      return (
        <svg {...common} {...S}>
          <path d="M30 86L66 30" />
          <rect x="52" y="12" width="36" height="16" rx="4" transform="rotate(33 70 20)" />
          <circle cx="24" cy="60" r="9" />
          <path d="M14 90h36" />
        </svg>
      )
    case 'cyclone':
      return (
        <svg {...common} {...S}>
          <path d="M4 80q24 0 34-22a16 16 0 1 1 22 0q10 22 36 22" />
          <path d="M16 80v14M30 72v22M70 72v22M84 80v14M40 58v36M60 58v36" />
        </svg>
      )
    default:
      return (
        <svg {...common} {...S}>
          <path d="M50 92V22" />
          <path d="M32 42V22M68 42V22M32 42q18 12 36 0" />
          <path d="M27 24l5-10 5 10M45 22l5-12 5 12M63 24l5-10 5 10" />
          <path d="M8 84q7-7 14 0t14 0 14 0 14 0 14 0 14 0" />
        </svg>
      )
  }
}

/** Sol/ojo decorativo con rayos, útil para estados vacíos y encabezados. */
export function Sun({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <g stroke={C.feather} strokeWidth="4" strokeLinecap="round">
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M50 6v12" transform={`rotate(${i * 30} 50 50)`} />
        ))}
      </g>
      <circle cx="50" cy="50" r="24" fill={C.cloud} />
      <path d="M36 50q14-12 28 0q-14 12-28 0z" fill={C.paper} />
      <circle cx="50" cy="50" r="5" fill={C.ultra} />
    </svg>
  )
}
