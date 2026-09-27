import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import { Search } from 'lucide-react'
import { money } from '../lib/format'
import { musicalById } from '../lib/musicals'
import type { FanEvent } from '../lib/types'

const COLOMBIA: [number, number] = [4.6, -74.1]

export function pinIcon(color = '#2536b8') {
  return L.divIcon({
    className: '',
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38],
    html: `<svg viewBox="0 0 34 44" width="34" height="44"><path d="M17 43C7 29 2 22 2 15a15 15 0 0 1 30 0c0 7-5 14-15 28z" fill="${color}" stroke="#141a4d" stroke-width="2"/><circle cx="17" cy="15" r="6" fill="#f3ede1"/><circle cx="17" cy="15" r="2.5" fill="#d8b77e"/></svg>`,
  })
}

const TILES = {
  url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
}

function FitBounds({ points }: { points: [number, number][] }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 14)
    else if (points.length > 1) map.fitBounds(L.latLngBounds(points), { padding: [40, 40] })
  }, [map, points])
  return null
}

export function EventsMap({ events, className = 'h-[520px]' }: { events: FanEvent[]; className?: string }) {
  const withPos = events.filter((e) => e.lat != null && e.lng != null)
  const points = withPos.map((e) => [e.lat!, e.lng!] as [number, number])
  return (
    <div className={`wobble-2 overflow-hidden print-shadow-ink ${className}`}>
      <MapContainer center={COLOMBIA} zoom={6} scrollWheelZoom={false} className="size-full">
        <TileLayer {...TILES} />
        <FitBounds points={points} />
        {withPos.map((e) => (
          <Marker key={e.id} position={[e.lat!, e.lng!]} icon={pinIcon(musicalById(e.musical).color)}>
            <Popup>
              <p className="!m-0 text-xs font-bold uppercase text-terra">{musicalById(e.musical).name}</p>
              <Link to={`/eventos/${e.id}`} className="font-display text-base font-bold">{e.title}</Link>
              <p className="!m-0">{e.venue} · {money(e.price)}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

function ClickToPlace({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({ click: (ev) => onPick(ev.latlng.lat, ev.latlng.lng) })
  return null
}

function FlyTo({ pos }: { pos: [number, number] | null }) {
  const map = useMap()
  useEffect(() => { if (pos) map.flyTo(pos, Math.max(map.getZoom(), 15)) }, [map, pos])
  return null
}

interface Picked { lat: number; lng: number; address?: string; city?: string }

/** Selector de ubicación: busca una dirección (OpenStreetMap) o haz clic en el mapa. */
export function LocationPicker({ value, onChange, hint }: { value: { lat: number | null; lng: number | null }; onChange: (p: Picked) => void; hint?: string }) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<{ display_name: string; lat: string; lon: string; address?: Record<string, string> }[]>([])
  const [loading, setLoading] = useState(false)
  const [fly, setFly] = useState<[number, number] | null>(null)
  const pos = value.lat != null && value.lng != null ? ([value.lat, value.lng] as [number, number]) : null

  async function search() {
    if (q.trim().length < 3) return
    setLoading(true)
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&accept-language=es&q=${encodeURIComponent(q)}`
      const res = await fetch(url)
      setResults(await res.json())
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        <input
          className="input"
          placeholder={hint ?? 'Busca el lugar: "Teatro Colón Bogotá"'}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); search() } }}
        />
        <button type="button" className="btn btn-primary !px-4" onClick={search} disabled={loading} aria-label="Buscar lugar">
          <Search className="size-5" />
        </button>
      </div>
      {results.length > 0 && (
        <ul className="wobble-2 max-h-48 overflow-auto bg-paper p-2 text-sm print-shadow">
          {results.map((r) => (
            <li key={r.lat + r.lon}>
              <button
                type="button"
                className="w-full rounded-lg px-3 py-2 text-left hover:bg-cloud/50"
                onClick={() => {
                  const lat = +r.lat, lng = +r.lon
                  const a = r.address ?? {}
                  onChange({ lat, lng, address: r.display_name.split(',').slice(0, 3).join(','), city: a.city || a.town || a.village || a.municipality })
                  setFly([lat, lng])
                  setResults([])
                }}
              >
                {r.display_name}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="wobble-2 h-72 overflow-hidden border-2 border-ink/15">
        <MapContainer center={pos ?? COLOMBIA} zoom={pos ? 15 : 5} className="size-full">
          <TileLayer {...TILES} />
          <ClickToPlace onPick={(lat, lng) => onChange({ lat, lng })} />
          <FlyTo pos={fly} />
          {pos && <Marker position={pos} icon={pinIcon()} />}
        </MapContainer>
      </div>
      <p className="text-xs text-ink/60">{pos ? `📍 ${pos[0].toFixed(5)}, ${pos[1].toFixed(5)} — haz clic en el mapa para ajustar.` : 'Haz clic en el mapa para marcar el punto exacto.'}</p>
    </div>
  )
}

export function SinglePin({ lat, lng, color }: { lat: number; lng: number; color?: string }) {
  return (
    <div className="wobble-2 h-72 overflow-hidden print-shadow-ink">
      <MapContainer center={[lat, lng]} zoom={15} scrollWheelZoom={false} className="size-full">
        <TileLayer {...TILES} />
        <Marker position={[lat, lng]} icon={pinIcon(color)} />
      </MapContainer>
    </div>
  )
}
