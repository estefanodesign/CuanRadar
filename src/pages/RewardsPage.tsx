// CuanRadar — Rewards (katalog platform, PRD §53/§55) + kandidat review queue (BUILD 4)
import { useMemo, useState } from 'react'
import { usePlatforms } from '../lib/platforms'
import { useReviewCandidates } from '../lib/reviewQueue'
import { RewardCard } from '../components/RewardCard'
import { getSavedIds, toggleSaved } from '../lib/savedApps'
import { EmptyState } from '../components/EmptyState'
import { ProvenanceBadge } from '../components/ProvenanceBadge'
import type { Category } from '../types'

const FILTERS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'Semua' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'lainnya', label: 'Lainnya' },
]

export function RewardsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [, setSavedVersion] = useState(0)
  const saved = getSavedIds()
  const { platforms: allPlatforms, source } = usePlatforms()
  const { candidates } = useReviewCandidates(10)

  const platforms = useMemo(() => {
    const q = query.trim().toLowerCase()
    return allPlatforms.filter((p) => {
      const okCategory = category === 'all' || p.category === category
      const okQuery = q === '' || p.name.toLowerCase().includes(q) || (p.developer ?? '').toLowerCase().includes(q)
      return okCategory && okQuery
    })
  }, [query, category, allPlatforms])

  return (
    <div className="space-y-4">
      <section>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Rewards</h1>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
            sumber: {source === 'supabase' ? 'database (Supabase)' : 'katalog kurasi F0'}
          </span>
        </div>
        <p className="text-sm text-slate-400">Katalog platform penghasil reward — kurasi manual F0.</p>
      </section>

      {candidates.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-amber-300">
              🔍 Kandidat baru — menunggu tinjauan ({candidates.length})
            </h2>
            <ProvenanceBadge provenance="search_new" />
          </div>
          {candidates.map((p) => (
            <RewardCard
              key={p.id}
              platform={p}
              saved={saved.includes(p.id)}
              onToggleSave={() => {
                toggleSaved(p.id)
                setSavedVersion((v) => v + 1)
              }}
              provenance="search_new"
            />
          ))}
          <p className="text-[11px] text-slate-500">
            Kandidat dari Deep Scan belum diverifikasi — tidak masuk rekomendasi sampai disetujui editor (PRD Appendix A6).
          </p>
        </section>
      ) : null}

      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari aplikasi atau pengembang…"
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
      />

      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setCategory(f.value)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              category === f.value
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-700 bg-slate-900 text-slate-400'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {platforms.length === 0 ? (
        <EmptyState title="Tidak ada hasil" description="Coba kata kunci atau kategori lain." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {platforms.map((p) => (
            <RewardCard
              key={p.id}
              platform={p}
              saved={saved.includes(p.id)}
              onToggleSave={() => {
                toggleSaved(p.id)
                setSavedVersion((v) => v + 1)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
