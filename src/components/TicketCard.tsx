import { QRCodeSVG } from 'qrcode.react'
import { MusicalIcon } from '../art/Art'
import { fmtDate } from '../lib/format'
import type { Ticket } from '../lib/types'

export function TicketCard({ t, musical = 'epic' }: { t: Ticket; musical?: string }) {
  return (
    <article className="relative flex overflow-hidden bg-paper print-shadow-ink" style={{ borderRadius: '22px 6px 22px 6px' }}>
      <div className="flex-1 p-5">
        <div className="flex items-center gap-2 text-ultra">
          <MusicalIcon id={musical} className="size-6" />
          <span className="font-display text-sm font-bold tracking-widest">ÉPICO · BOLETA</span>
        </div>
        <h3 className="h-display mt-2 text-xl leading-tight">{t.title}</h3>
        <p className="mt-1 text-sm capitalize text-ink/70">{fmtDate(t.date, t.time)}</p>
        <p className="text-sm text-ink/70">{t.venue} · {t.city}</p>
        <p className="mt-3 text-xs uppercase tracking-wider text-ink/50">Titular</p>
        <p className="font-bold">{t.holder}</p>
      </div>
      <div className="relative flex flex-col items-center justify-center gap-2 border-l-2 border-dashed border-ink/20 bg-paper-2 p-4">
        <span className="absolute -left-3 -top-3 size-6 rounded-full bg-paper-2" />
        <span className="absolute -bottom-3 -left-3 size-6 rounded-full bg-paper-2" />
        <QRCodeSVG value={`EPICO:${t.code}:${t.orderId}`} size={96} fgColor="#141a4d" bgColor="transparent" />
        <code className="text-xs font-bold">{t.code}</code>
      </div>
    </article>
  )
}
