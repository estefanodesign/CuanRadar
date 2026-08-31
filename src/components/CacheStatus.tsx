// CuanRadar — CacheStatus (PRD §36–37, Appendix A9)
// Menampilkan provenance "dari cache" + usia data + tombol muat ulang paksa (bypass cache).
// TTL baseline PRD §37: normal 72 jam, popular 24 jam, flash 6–24 jam, expired immediate.
import { useState } from 'react'
import { formatRelative } from '../lib/format'

interface CacheStatusProps {
  dataUpdatedAt: number // ms epoch; 0 = tidak diketahui (seed/fallback)
  source: 'supabase' | 'seed'
  onRefresh: () => void
}

export function CacheStatus({ dataUpdatedAt, source, onRefresh }: CacheStatusProps) {
  const [refreshing, setRefreshing] = useState(false)
  const ageMs = dataUpdatedAt > 0 ? Date.now() - dataUpdatedAt : null
  const stale = ageMs != null && ageMs > 24 * 60 * 60 * 1000 // >24 jam → tampil sebagai "usang"
  const sourceLabel = source === 'supabase' ? 'Supabase' : 'kurasi lokal'

  async function handleRefresh() {
    setRefreshing(true)
    try {
      await onRefresh()
    } finally {
      // cepat sembunyikan spinner; query invalidate sudah memicu refetch
      setTimeout(() => setRefreshing(false), 600)
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px]">
      <span className="text-slate-400">
        {ageMs == null ? 'Data katalog' : stale ? '⚠ Data katalog usang' : 'Data katalog'} ·{' '}
        {ageMs == null ? `dari ${sourceLabel}` : `diperbarui ${formatRelative(ageMs)}`}
      </span>
      <button
        type="button"
        onClick={handleRefresh}
        disabled={refreshing}
        className="ml-auto shrink-0 rounded-lg border border-slate-700 px-2 py-1 text-[11px] text-slate-200 transition hover:border-emerald-500/50 disabled:opacity-50"
      >
        {refreshing ? 'Memuat…' : '↻ Muat ulang'}
      </button>
    </div>
  )
}
