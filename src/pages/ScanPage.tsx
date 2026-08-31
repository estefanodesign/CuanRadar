// CuanRadar — AI Scan (PRD §52–54, §63)
// BUILD 2: Quick Scan memakai data dari database (Supabase) dengan cek kecukupan (PRD §14 v1.1).
// Deep Scan (discovery/extraction AI) berjalan server-side via engine/ — integrasi edge function di BUILD 3.
import { useState } from 'react'
import { getPlan, DEFAULT_PLAN } from '../config/plans'
import { usePlatforms } from '../lib/platforms'
import { ScanControls, type ScanType } from '../components/ScanControls'
import { RewardCard } from '../components/RewardCard'
import { getSavedIds, toggleSaved } from '../lib/savedApps'
import { EmptyState } from '../components/EmptyState'
import type { Category } from '../types'

export function ScanPage() {
  const plan = getPlan(DEFAULT_PLAN)
  const [scanType, setScanType] = useState<ScanType>('quick')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [hasScanned, setHasScanned] = useState(false)
  const [, setSavedVersion] = useState(0)
  const saved = getSavedIds()
  const { platforms, source } = usePlatforms()

  const results = hasScanned
    ? platforms.filter((p) => category === 'all' || p.category === category)
    : []

  // Data sufficiency (PRD §14 v1.1): minimum per cakupan scan; "All" = 12 (4+4+2+2)
  const MIN_PER_CATEGORY: Record<Category, number> = { entertainment: 4, shopping: 4, wallet: 2, lainnya: 2 }
  const available = category === 'all' ? platforms.length : platforms.filter((p) => p.category === category).length
  const minNeeded = category === 'all' ? 12 : MIN_PER_CATEGORY[category]
  const sufficient = available >= minNeeded

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold">AI Scan</h1>
        <p className="text-sm text-slate-400">
          Sisa kuota hari ini: ⚡ {plan.quickPerDay} quick · 🔍 {plan.deepPerDay} deep
        </p>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <ScanControls scanType={scanType} onScanTypeChange={setScanType} category={category} onCategoryChange={setCategory} />
        <button
          type="button"
          onClick={() => setHasScanned(true)}
          className="mt-4 w-full rounded-xl bg-emerald-500 px-3 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
        >
          {scanType === 'quick' ? '⚡ SCAN' : '🔍 SCAN'}
        </button>
        <p className="mt-2 text-[11px] text-slate-500">
          Kecukupan data ({category === 'all' ? 'semua kategori' : category}): {available}/{minNeeded} platform ·{' '}
          {sufficient ? 'cukup — hasil dari database' : 'kurang — discovery otomatis via engine (BUILD 3)'}
        </p>
      </section>

      {!hasScanned ? (
        <EmptyState
          title="Mulai scan pertama Anda"
          description="Kami memeriksa peluang reward terkini. Scan pertama mungkin sedikit lebih lama."
        />
      ) : scanType === 'deep' ? (
        <EmptyState
          title="Deep Scan berjalan server-side"
          description="Engine discovery & ekstraksi siap di engine/ (jalankan npm run scan:deep dengan kunci AI). Integrasi edge function penuh hadir di BUILD 3."
        />
      ) : results.length === 0 ? (
        <EmptyState title="Belum ada peluang reward pada kategori ini" description="Coba kategori lain atau jalankan scan lagi nanti." />
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{results.length} peluang ditemukan</h2>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
              sumber: {source === 'supabase' ? 'database (Supabase)' : 'katalog kurasi F0'}
            </span>
          </div>
          {results.map((p) => (
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
        </section>
      )}

      <p className="text-[11px] text-slate-600">
        Provenance: hasil dari database terverifikasi / cache akan ditandai otomatis saat engine scan aktif (PRD Appendix A9).
      </p>
    </div>
  )
}
