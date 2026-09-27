import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AppConfig, Community, CommunityDetail, FanEvent, Member, Stats, Ticket } from './types'
import { useStore } from './store'

export class ApiError extends Error {
  constructor(public status: number, message: string, public field?: string) { super(message) }
}

export async function api<T>(path: string, opts: { method?: string; body?: unknown; key?: string | null } = {}): Promise<T> {
  const res = await fetch(`/api${path}`, {
    method: opts.method ?? (opts.body ? 'POST' : 'GET'),
    headers: {
      ...(opts.body ? { 'content-type': 'application/json' } : {}),
      ...(opts.key ? { 'x-edit-key': opts.key } : {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data.error ?? 'Algo salió mal', data.field)
  return data as T
}

export const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
})

type Filters = Record<string, string | undefined>
const qs = (f: Filters) => {
  const p = new URLSearchParams(Object.entries(f).filter(([, v]) => v) as [string, string][])
  const s = p.toString()
  return s ? `?${s}` : ''
}

export const useConfig = () => useQuery({ queryKey: ['config'], queryFn: () => api<AppConfig>('/config'), staleTime: Infinity })
export const useStats = () => useQuery({ queryKey: ['stats'], queryFn: () => api<Stats>('/stats') })
export const useCities = () => useQuery({ queryKey: ['cities'], queryFn: () => api<string[]>('/cities') })
export const useEvents = (f: Filters = {}) => useQuery({ queryKey: ['events', f], queryFn: () => api<FanEvent[]>(`/events${qs(f)}`) })
export const useCommunities = (f: Filters = {}) => useQuery({ queryKey: ['communities', f], queryFn: () => api<Community[]>(`/communities${qs(f)}`) })

/** Llave de líder guardada para una comunidad o cualquiera de sus padres. */
export function useKeyFor(ids: (string | null | undefined)[]) {
  const keys = useStore((s) => s.keys)
  for (const id of ids) if (id && keys[id]) return keys[id]
  return null
}

export function useEvent(id: string) {
  const key = useStore((s) => s.eventKeys[id] ?? null)
  const anyKeys = useStore((s) => s.keys)
  return useQuery({
    queryKey: ['event', id, key, Object.keys(anyKeys).length],
    queryFn: async () => {
      const e = await api<FanEvent>(`/events/${id}`, { key })
      if (!e.canEdit && e.communityId) {
        const ck = anyKeys[e.communityId]
        if (ck) return api<FanEvent>(`/events/${id}`, { key: ck })
      }
      return e
    },
  })
}

export function useCommunity(slug: string | null) {
  const keys = useStore((s) => s.keys)
  return useQuery({
    enabled: !!slug,
    queryKey: ['community', slug, keys],
    queryFn: async () => {
      const c = await api<CommunityDetail>(`/communities/${slug}`)
      const key = keys[c.id] ?? (c.parentId ? keys[c.parentId] : undefined)
      return key ? api<CommunityDetail>(`/communities/${slug}`, { key }) : c
    },
  })
}

export const useMembers = (id: string, key: string | null) =>
  useQuery({ queryKey: ['members', id], queryFn: () => api<Member[]>(`/communities/${id}/members`, { key }), enabled: !!key })

export function useInvalidate() {
  const qc = useQueryClient()
  return () => qc.invalidateQueries()
}

export const useTicketLookup = () =>
  useMutation({ mutationFn: ({ email, order }: { email: string; order: string }) => api<Ticket[]>(`/tickets${qs({ email, order })}`) })
