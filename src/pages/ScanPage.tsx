// CuanRadar — AI Scan (PRD §52–54, §63)
// BUILD 1: UI + alur; hasil Quick Scan memakai data kurasi F0 (jujur, dengan provenance).
// Engine AI (discovery/extraction/verification) hadir di BUILD 2.
import { useState } from 'react'
import { getPlan, DEFAULT_PLAN } from '../config/plans'
import { getSeedPlatforms } from '../lib/seed'
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

  const results = hasScanned
    ? getSeedPlatforms().filter((p) => category === 'all' || p.category === category)
    : []

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
      </section>

      {!hasScanned ? (
        <EmptyState
          title="Mulai scan pertama Anda"
          description="Kami memeriksa peluang reward terkini. Scan pertama mungkin sedikit lebih lama."
        />
      ) : scanType === 'deep' ? (
        <EmptyState
          title="Deep Scan engine hadir di BUILD 2"
          description="Saat ini data berasal dari katalog kurasi F0. Engine discovery & ekstraksi otomatis sedang dibangun."
        />
      ) : results.length === 0 ? (
        <EmptyState title="Belum ada peluang reward pada kategori ini" description="Coba kategori lain atau jalankan scan lagi nanti." />
      ) : (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{results.length} peluang ditemukan</h2>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">sumber: katalog kurasi F0</span>
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
