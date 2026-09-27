import { z } from 'zod'

z.config(z.locales.es())

export const phoneRe = /^\+?[\d\s()-]{7,20}$/
export const optionalPhone = z.string().trim().refine((v) => !v || phoneRe.test(v), 'Teléfono inválido')
export const optionalEmail = z.string().trim().refine((v) => !v || z.email().safeParse(v).success, 'Correo inválido')
const link = (re: RegExp, msg: string) => z.string().trim().refine((v) => !v || re.test(v), msg)
export const whatsappLink = link(/^https:\/\/(chat\.whatsapp\.com|wa\.me|whatsapp\.com\/channel)\/\S+/, 'Usa un enlace de invitación: https://chat.whatsapp.com/…')
export const discordLink = link(/^https:\/\/(discord\.gg|discord\.com\/invite)\/\S+/, 'Usa un enlace de invitación: https://discord.gg/…')
export const instagramLink = link(/^https:\/\/(www\.)?instagram\.com\/\S+/, 'Usa https://instagram.com/tu_cuenta')
export const telegramLink = link(/^https:\/\/t\.me\/\S+/, 'Usa https://t.me/tu_grupo')
export const mustAccept = z.boolean().refine((v) => v, 'Debes aceptar para continuar')

/** Convierte '' en null para enviar al API. */
export const nul = (v: string | undefined | null) => (v && v.trim() ? v.trim() : null)
