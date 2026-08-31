// CuanRadar — src/lib/scanCredits.ts
// Kuota real dari tabel `scan_credits` (Supabase) bila user login; fallback jujur ke config
// plan statis (DEFAULT_PLAN) bila belum login / belum sinkron. Kuota per hari per PRD §39 (v1.2).
// Budget Governor (PRD §41): status dari persentase penggunaan budget; untuk frontend diturunkan
// dari data kuota/penggunaan yang tersedia — bukan nilai biaya dollar (itu server-side).
import { useEffect, useState } from 'react'
import { useAuth } from './auth'
import { isSupabaseConfigured, supabase } from './supabase'
import { getPlan, DEFAULT_PLAN, type PlanId } from '../config/plans'
import type { ScanCreditsState } from '../types'

export type GovernorTier = 'normal' | 'more_caching' | 'limit_deep' | 'emergency' | 'no_new_deep'

export interface GovernorState {
  tier: GovernorTier
  usedPercent: number | null // 0–100; null = tidak diketahui
}

// Ambang governor (PRD §41).
export const GOVERNOR_THRESHOLDS: { tier: GovernorTier; min: number; max: number; label: string; hint: string }[] = [
  { tier: 'normal', min: 0, max: 70, label: 'Normal', hint: 'Scan berjalan seperti biasa.' },
  { tier: 'more_caching', min: 70, max: 85, label: 'Hemat (lebih banyak cache)', hint: 'Prioritas hasil cache — kurangi pencarian.' },
  { tier: 'limit_deep', min: 85, max: 95, label: 'Batasi Deep Scan', hint: 'Deep Scan dibatasi sementara.' },
  { tier: 'emergency', min: 95, max: 100, label: 'Mode darurat', hint: 'Deep Scan diblokir; hasil dari cache/database saja.' },
]

export function governorTier(usedPercent: number | null): GovernorTier {
  if (usedPercent == null) return 'normal'
  if (usedPercent >= 100) return 'no_new_deep'
  for (const t of GOVERNOR_THRESHOLDS) {
    if (usedPercent < t.max) return t.tier
  }
  return 'no_new_deep'
}

export function governorLabel(tier: GovernorTier): string {
  if (tier === 'no_new_deep') return 'Tidak ada Deep Scan baru'
  const t = GOVERNOR_THRESHOLDS.find((x) => x.tier === tier)
  return t?.label ?? 'Normal'
}

// ——— Kuota dari scan_credits (db) dengan fallback config ———
function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

async function fetchCredits(plan: PlanId): Promise<ScanCreditsState | null> {
  if (!supabase) return null
  const { data } = await supabase.from('scan_credits').select('plan, quick_used_today, deep_used_today, usage_date').maybeSingle()
  // plan di DB bisa lebih tinggi dari config default (mis. pro) — pakai plan row bila valid, else fallback.
  const effectivePlan: PlanId = (['free', 'pro', 'pro_plus'] as const).includes((data?.plan ?? '') as PlanId) ? (data!.plan as PlanId) : plan
  const cfg = getPlan(effectivePlan)
  const quickRemaining = Math.max(0, cfg.quickPerDay - (data?.quick_used_today ?? 0))
  const deepRemaining = Math.max(0, cfg.deepPerDay - (data?.deep_used_today ?? 0))
  return {
    plan: cfg.name,
    quickUsedToday: data?.quick_used_today ?? 0,
    quickRemaining,
    deepUsedToday: data?.deep_used_today ?? 0,
    deepRemaining,
    usageDate: data?.usage_date ?? todayISO(),
    source: 'db',
  }
}

/** Kuota harian: dari scan_credits bila user login & tersedia; kalau tidak, dari config plan (jujur). */
export function useScanCredits(): { credits: ScanCreditsState; loading: boolean; refresh: () => void } {
  const { user } = useAuth()
  const defaultPlan = getPlan(DEFAULT_PLAN)
  const [tick, setTick] = useState(0)
  const [credits, setCredits] = useState<ScanCreditsState>({
    plan: defaultPlan.name,
    quickUsedToday: 0,
    quickRemaining: defaultPlan.quickPerDay,
    deepUsedToday: 0,
    deepRemaining: defaultPlan.deepPerDay,
    usageDate: todayISO(),
    source: 'config',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    if (!isSupabaseConfigured() || !user) {
      setCredits({
        plan: defaultPlan.name,
        quickUsedToday: 0,
        quickRemaining: defaultPlan.quickPerDay,
        deepUsedToday: 0,
        deepRemaining: defaultPlan.deepPerDay,
        usageDate: todayISO(),
        source: 'config',
      })
      return
    }
    setLoading(true)
    const planFromMeta = (user.app_metadata?.plan ?? DEFAULT_PLAN) as PlanId
    fetchCredits(planFromMeta)
      .then((c) => {
        if (cancelled) return
        if (c) setCredits(c)
      })
      .catch(() => {
        /* fallback ke config bila gagal — jangan crash */
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [user, defaultPlan, tick])

  const refresh = () => setTick((t) => t + 1)

  return { credits, loading, refresh }
}

// ——— Governor dari persentase penggunaan (frontend) ———
// Memakai sisa kuota vs total sebagai proksi persentase penggunaan harian — bukan dollar.
// Ini deterministik & jujur untuk UI; biaya dollar sesungguhnya dihitung server-side (PRD §43).
export function useGovernor(credits: ScanCreditsState): GovernorState {
  const totalQuick = credits.quickRemaining + credits.quickUsedToday
  const totalDeep = credits.deepRemaining + credits.deepUsedToday
  const usedQuick = credits.quickUsedToday
  const usedDeep = credits.deepUsedToday
  // Harga relatif untuk menggambarkan "penggunaan": deep dianggap lebih mahal.
  const used = usedQuick + usedDeep * 5
  const total = totalQuick + totalDeep * 5
  const usedPercent = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0
  return { tier: governorTier(usedPercent), usedPercent }
}
