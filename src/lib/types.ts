export type MusicalId = 'epic' | 'hamilton' | 'six' | 'hadestown' | 'heathers' | 'cyclone'

export interface Musical {
  id: MusicalId
  name: string
  tagline: string
  blurb: string
  color: string
  fg: string
}

export const EVENT_TYPES = ['Sing-along', 'Watch party', 'Cosplay', 'Meetup', 'Trivia', 'Función'] as const
export type EventType = (typeof EVENT_TYPES)[number]

export interface FanEvent {
  id: string
  communityId: string | null
  communityName: string | null
  communitySlug: string | null
  musical: MusicalId
  type: EventType
  title: string
  description: string
  city: string
  venue: string
  address: string
  lat: number | null
  lng: number | null
  date: string
  time: string
  price: number
  capacity: number
  sold: number
  organizer: string
  contactPhone: string | null
  whatsapp: string | null
  discord: string | null
  canEdit?: boolean
}

export interface SocialLinks {
  whatsapp: string | null
  discord: string | null
  instagram: string | null
  telegram: string | null
}

export interface Community extends SocialLinks {
  id: string
  slug: string
  parentId: string | null
  parentName: string | null
  parentSlug: string | null
  name: string
  musical: MusicalId
  city: string
  description: string
  memberCount: number
  subCount: number
  leaderCount: number
  eventCount: number
  createdAt: string
}

export interface Leader {
  id: string
  name: string
  role: string
  phone: string | null
  phoneVisible: boolean
  email: string | null
  publicPhone: boolean
}

export interface CommunityDetail extends Community {
  leaders: Leader[]
  children: Community[]
  events: FanEvent[]
  canEdit: boolean
}

export interface Member {
  name: string
  phone: string
  email: string | null
  consent_at: string
  created_at: string
}

export interface Ticket {
  code: string
  orderId: string
  eventId: string
  title: string
  date: string
  time: string
  city: string
  venue: string
  holder: string
  price: number
}

export interface Stats { events: number; cities: number; communities: number; members: number }
export interface AppConfig { stripe: boolean; publishableKey: string | null; demoPayments: boolean; feeRate: number }
