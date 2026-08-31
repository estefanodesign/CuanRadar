// CuanRadar — Sumber data platform (BUILD 2: Supabase dengan fallback seed F0)
// UI memakai data dari tabel reward_apps (Supabase); bila belum dikonfigurasi/gagal,
// fallback jujur ke data kurasi lokal F0 (provenance 'seed').
import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { isSupabaseConfigured, supabase } from './supabase'
import { getSeedPlatforms } from './seed'
import type { Platform } from '../types'

export type PlatformSource = 'supabase' | 'seed'

const SELECT =
  'id,slug,name,category,developer,website,google_play,app_store,status,reward_types,payout_methods,min_payout_idr,risk_level,verification_status,last_verified_at,notes'

export interface PlatformsState {
  platforms: Platform[]
  source: PlatformSource
  loading: boolean
}

export function usePlatforms(): PlatformsState {
  const seed = useMemo(() => getSeedPlatforms(), [])
  const configured = isSupabaseConfigured()

  const query = useQuery({
    queryKey: ['platforms'],
    queryFn: async (): Promise<{ platforms: Platform[]; source: PlatformSource }> => {
      if (!supabase) throw new Error('supabase-not-configured')
      const { data, error } = await supabase
        .from('reward_apps')
        .select(SELECT)
        .order('name', { ascending: true })
      if (error) throw error
      return { platforms: (data ?? []) as unknown as Platform[], source: 'supabase' }
    },
    enabled: configured,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  })

  if (!configured) return { platforms: seed, source: 'seed', loading: false }
  if (query.isLoading) return { platforms: seed, source: 'seed', loading: true }
  if (query.error || !query.data) return { platforms: seed, source: 'seed', loading: false }
  return { platforms: query.data.platforms, source: query.data.source, loading: false }
}
