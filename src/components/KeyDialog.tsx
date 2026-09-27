import * as Dialog from '@radix-ui/react-dialog'
import { Copy, KeyRound } from 'lucide-react'
import { toast } from 'sonner'

/** Muestra una sola vez la llave de líder/organizador para que la guarden. */
export function KeyDialog({ open, editKey, what, onClose }: { open: boolean; editKey: string; what: string; onClose: () => void }) {
  return (
    <Dialog.Root open={open} onOpenChange={(v) => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-sm" />
        <Dialog.Content className="wobble-2 fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 bg-paper p-8 print-shadow">
          <KeyRound className="size-10 text-terra" />
          <Dialog.Title className="h-display mt-3 text-2xl text-ultra">¡Listo! Guarda tu llave de líder</Dialog.Title>
          <Dialog.Description className="mt-2 text-ink/70">
            Con esta llave puedes editar {what}, ver los números de los miembros y agregar líderes desde cualquier dispositivo. Ya quedó guardada en este navegador,
            pero cópiala en un lugar seguro: no la volveremos a mostrar.
          </Dialog.Description>
          <div className="mt-5 flex items-center gap-2">
            <code className="input flex-1 select-all break-all font-mono text-sm">{editKey}</code>
            <button className="btn btn-gold !px-4" onClick={() => { navigator.clipboard.writeText(editKey); toast.success('Llave copiada') }} aria-label="Copiar llave">
              <Copy className="size-5" />
            </button>
          </div>
          <button className="btn btn-primary mt-6 w-full" onClick={onClose}>Ya la guardé</button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
