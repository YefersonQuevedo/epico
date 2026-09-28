// Hoja de revisión del panteón: los seis retratos en grande con sus atributos.
import { createRoot } from 'react-dom/client'
import '@fontsource/cinzel/900.css'
import '@fontsource/karla/700.css'
import '../src/index.css'
import { ArtDefs } from '../src/art/Art'
import { GODS, GodPortrait } from '../src/art/Gods'

createRoot(document.getElementById('root')!).render(
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 600px)', gap: 16, padding: 16 }}>
    <ArtDefs />
    {GODS.map((g) => (
      <figure key={g.id} style={{ margin: 0 }}>
        <GodPortrait id={g.id} style={{ width: 600, height: 846, display: 'block' }} />
        <figcaption style={{ color: '#f3ede1', font: '700 18px Karla', padding: '8px 4px' }}>
          <b style={{ font: '900 26px Cinzel' }}>{g.name}</b> {g.greek} — {g.attributes.join(' · ')}
        </figcaption>
      </figure>
    ))}
  </div>,
)
