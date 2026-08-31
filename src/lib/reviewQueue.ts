// CuanRadar — Review queue candidates (BUILD 4)
// Membaca kandidat hasil Deep Scan yang menunggu tinjauan (PRD Appendix A6) via edge function
// `scan` (aksi listCandidates) — tidak perlu policy RLS publik; dibaca server-side service role.
import { useQuery } from '@tanstack/react-query'
import { isSupabaseConfigured, supabase } from './supabase'
import type { Platform } from '../types'

export interface ReviewCandidate {
  id: string
  payload: Record<string, unknown>
  status: 'baru' | 'terverifikasi' | 'ditolak'
  created_at: string
}

function payloadToPlatform(item: ReviewCandidate): Platform | null {
  const p = item.payload
  if (!p || typeof p !== 'object') return null
  const name = typeof p.name === 'string' ? p.name : ''
  if (!name) return null
  const norm = name.toLowerCase().replace(/[^a-z0-9]/g, '')
  const category = ['entertainment', 'shopping', 'wallet', 'lainnya'].includes(p.category as string)
    ? (p.category as Platform['category'])
    : 'lainnya'
  return {
    id: `cand-${item.id ?? norm}`,
    slug: norm,
    name,
    category,
    developer: null,
    website: typeof p.website === 'string' && /^https?:\/\//.test(p.website) ? p.website : null,
    google_play: null,
    app_store: null,
    status: 'pantau',
    reward_types: (Array.isArray(p.reward_types) ? p.reward_types : []) as Platform['reward_types'],
    payout_methods: (Array.isArray(p.payout_methods) ? p.payout_methods : []) as Platform['payout_methods'],
    min_payout_idr: null,
    risk_level: 'sedang',
    verification_status: 'unverified',
    last_verified_at: item.created_at ?? new Date().toISOString(),
    notes: typeof p.notes === 'string' ? p.notes : 'Kandidat hasil Deep Scan — menunggu tinjauan editor (PRD Appendix A6).',
  }
}

/** Kandidat menunggu tinjauan (terbaru dulu). Kosong bila gagal/tidak dikonfigurasi (jangan crash). */
export function useReviewCandidates(limit = 10): { candidates: Platform[]; loading: boolean } {
  const configured = isSupabaseConfigured()
  const query = useQuery({
    queryKey: ['review-candidates', limit],
    queryFn: async (): Promise<Platform[]> => {
      if (!supabase) return []
      const { data, error } = await supabase.functions.invoke('scan', { body: { listCandidates: true, limit } })
      if (error) return []
      const rows = (data as { candidates?: ReviewCandidate[] } | null)?.candidates ?? []
      return rows.map(payloadToPlatform).filter((p): p is Platform => Boolean(p))
    },
    enabled: configured,
    retry: 1,
    staleTime: 60 * 1000,
  })
  return { candidates: query.data ?? [], loading: query.isLoading }
}
