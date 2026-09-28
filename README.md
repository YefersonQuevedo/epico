# Épico — la comunidad de fans de los musicales

Plataforma para fans de **EPIC: The Musical, Hamilton, SIX, Hadestown, Heathers, Ride the Cyclone** y más:
comunidades con subcomunidades y líderes, eventos con ubicación en mapa, venta de boletas con QR y pasarela de pagos.
Estilo visual inspirado en la serigrafía griega moderna (ultramar, nubes rosas, plumas ocre) con un panteón de dioses ilustrado.

## Funcionalidades

- **Comunidades** por musical y ciudad, con **subcomunidades** (por zona, coro, universidad…), **líderes** con rol, número y correo (público o privado) y enlaces a **WhatsApp, Discord, Telegram e Instagram**.
- **Registro de miembros**: los fans se unen dejando nombre y número, con autorización de datos; los líderes ven la lista y la descargan en CSV.
- **Eventos** en cualquier ciudad: buscador de lugares y selector de punto en el mapa (OpenStreetMap), cupos, precio o gratis, contacto y grupos.
- **Boletería**: carrito, checkout en 3 pasos, boletas con código QR, recuperación de boletas por correo + número de orden.
- **Pagos**: Stripe Payment Element (tarjeta y métodos locales) con verificación del pago en el servidor; sin llaves, modo demostración con tarjeta, PSE, Nequi y PayPal simulados.
- **Panel de líderes**: acceso con “llave de líder” (se entrega al crear la comunidad/evento; la llave de una comunidad principal administra también sus subcomunidades).
- **Legal**: Términos y condiciones (rol de intermediario, limitación de responsabilidad, contenido de terceros) y Política de tratamiento de datos (Ley 1581 de 2012). Las autorizaciones quedan registradas con fecha en la base de datos.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Framer Motion, React Router, TanStack Query, Zustand, React Hook Form + Zod, Radix UI, Leaflet, qrcode.react, Sonner |
| Backend | Node 22, Express 5, SQLite (`node:sqlite`, sin dependencias nativas), Zod, Helmet, rate limiting |
| Pagos | Stripe (`stripe`, `@stripe/react-stripe-js`) |

## Cómo correrlo

```bash
npm install
cp .env.example .env      # opcional: llaves de Stripe
npm run dev               # frontend en http://localhost:5173 + API en http://localhost:8787
```

La primera vez se crea `data/epico.db` con datos de ejemplo. La llave de líder de todas las comunidades de ejemplo es **`demo-lider`**
(cámbiala con `SEED_EDIT_KEY`). En modo demo, la tarjeta `4242 4242 4242 4242` se aprueba y `4000 0000 0000 0002` se rechaza.

Producción: `npm start` compila el frontend y lo sirve desde el mismo servidor Express.

### Variables de entorno

| Variable | Uso |
| --- | --- |
| `STRIPE_SECRET_KEY` | Activa los pagos reales (servidor). |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Llave pública de Stripe (la entrega el API al frontend). |
| `PAYMENTS_DEMO=false` | Desactiva el modo demo cuando no hay Stripe. |
| `DB_FILE` | Ruta de la base SQLite (por defecto `data/epico.db`). |
| `SEED_EDIT_KEY` | Llave de líder de los datos de ejemplo. |

## Antes de salir a producción

- Completa los datos de la empresa en `src/lib/legal.ts` (razón social, NIT, dirección, correos) y **haz revisar los textos legales por un abogado**.
- Usa HTTPS y un volumen persistente para `data/`.
- Si prefieres Wompi o Mercado Pago (muy usados en Colombia), la integración va en `server/index.js` (`/api/payments/intent` y la verificación en `/api/orders`).
- El buscador de lugares usa Nominatim (OpenStreetMap), que tiene límites de uso; para mucho tráfico usa un proveedor propio.

## Tráiler (promo de 30 s)

El video de `public/promo/epico-promo.mp4` se genera desde código, sin plantillas ni música de terceros:

- `promo/Promo.tsx`: composición animada a 1920×1080 que usa las mismas ilustraciones del sitio (héroe, panteón, signos) y capturas reales del producto (`promo/assets/`). Cada cuadro es una función pura del tiempo.
- `promo/music.py`: banda sonora original sintetizada (120 BPM, Re menor) con los golpes sincronizados al guion.
- `promo/render.mjs`: renderiza 900 cuadros con Playwright y los codifica con ffmpeg (H.264 + AAC).

```bash
pip install numpy scipy imageio-ffmpeg
npm run promo:music
npm run dev:web            # en otra terminal
npm run promo:render       # → promo/out/epico-promo.mp4
```

Vista previa en vivo: abre `http://localhost:5173/promo/index.html` y haz clic para sonar la música.
Hoja de revisión del panteón (los seis retratos en grande con sus atributos): `http://localhost:5173/promo/gods.html`.

## Estructura

```
server/            API (Express + SQLite): index.js, db.js, seed.js, util.js
src/art/           Ilustraciones SVG: Art.tsx (héroe, aves, nubes, plumas), Gods.tsx (panteón y signos)
src/components/    Layout, carrito, mapas, tarjetas, panteón, boletas
src/pages/         Inicio, eventos, comunidades, checkout, panel, legales
src/lib/           API, estado, formularios, pagos, formato
```

Épico es un proyecto de fans; no está afiliado a los creadores ni titulares de derechos de los musicales mencionados.
