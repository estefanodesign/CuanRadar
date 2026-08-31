// CuanRadar — AI Scan (PRD §52–54, §63; Appendix A9)
// BUILD 3: Quick Scan memakai state machine (PRD §62) + hasil DB-first nyata. Kuota dari scan_credits.
// Deep Scan (discovery/extraction AI) berjalan server-side — di sini menampilkan state & pesan jujur.
// Polling baca scan_history bila tersedia; fallback lokal bila server belum aktif (jujur, tidak mengarang).
import { useState } from 'react'
import { usePlatforms, useRefetchPlatforms } from '../lib/platforms'
import { useScanPoll, runQuickScanLocal, minNeeded, countByCategory } from '../lib/scan'
import { ScanControls, type ScanType } from '../components/ScanControls'
import { RewardCard } from '../components/RewardCard'
import { getSavedIds, toggleSaved } from '../lib/savedApps'
import { EmptyState } from '../components/EmptyState'
import { ScanProgress } from '../components/ScanProgress'
import { GovernorBanner } from '../components/GovernorBanner'
import { CacheStatus } from '../components/CacheStatus'
import { useScanCredits, useGovernor } from '../lib/scanCredits'
import { ProvenanceBadge } from '../components/ProvenanceBadge'
import type { Category } from '../types'

export function ScanPage() {
  const [scanType, setScanType] = useState<ScanType>('quick')
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [started, setStarted] = useState(false)
  const [, setSavedVersion] = useState(0)
  const saved = getSavedIds()
  const { platforms, source, dataUpdatedAt } = usePlatforms()
  const refetch = useRefetchPlatforms()
  const { credits } = useScanCredits()
  const governor = useGovernor(credits)

  // Polling abstraction: Quick Scan selesai sinkron; Deep Scan menunggu server (pollOnce → null sekarang).
  const initialPoll = started
    ? scanType === 'quick'
      ? runQuickScanLocal(platforms, category)
      : { id: `deep-${Date.now()}`, state: 'discovering' as const, source: 'database' as const, results: [], candidates: 0 }
    : null
  const { poll } = useScanPoll(initialPoll)

  const results = poll?.results ?? []
  const scanned = Boolean(poll)
  const done = poll ? poll.state === 'completed' || poll.state === 'cache_completed' || poll.state === 'failed' || poll.state === 'limited' : false
  const isDeepRunning = scanType === 'deep' && scanned && !done

  const available = countByCategory(platforms, category)
  const minNeededN = minNeeded(category)

  return (
    <div className="space-y-5">
      <section>
        <h1 className="text-xl font-bold">AI Scan</h1>
        <p className="text-sm text-slate-400">
          Sisa kuota hari ini: ⚡ {credits.quickRemaining} quick · 🔍 {credits.deepRemaining} deep
        </p>
      </section>

      <GovernorBanner governor={governor} />

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <ScanControls scanType={scanType} onScanTypeChange={setScanType} category={category} onCategoryChange={setCategory} />
        <button
          type="button"
          onClick={() => setStarted(true)}
          disabled={isDeepRunning}
          className="mt-4 w-full rounded-xl bg-emerald-500 px-3 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-60"
        >
          {isDeepRunning ? 'Memindai…' : scanType === 'quick' ? '⚡ SCAN' : '🔍 SCAN'}
        </button>
        <p className="mt-2 text-[11px] text-slate-500">
          Kecukupan data ({category === 'all' ? 'semua kategori' : category}): {available}/{minNeededN} platform ·{' '}
          {available >= minNeededN ? 'cukup — hasil dari database' : 'kurang — discovery otomatis via engine (BUILD 3)'}
        </p>
      </section>

      <CacheStatus dataUpdatedAt={dataUpdatedAt} source={source} onRefresh={refetch} />

      {!scanned ? (
        <EmptyState
          title="Mulai scan pertama Anda"
          description="Kami memeriksa peluang reward terkini. Scan pertama mungkin sedikit lebih lama."
        />
      ) : isDeepRunning ? (
        <>
          <ScanProgress state={poll?.state ?? 'discovering'} candidates={0} />
          <EmptyState
            title="Deep Scan berjalan server-side"
            description="Engine discovery & ekstraksi siap di engine/ (jalankan npm run scan:deep dengan kunci AI). Integrasi edge function penuh hadir di BUILD 3 — polling otomatis saat API aktif."
          />
        </>
      ) : done ? (
        results.length === 0 ? (
          <>
            {poll?.state === 'limited' ? <ScanProgress state="limited" candidates={0} /> : null}
            <EmptyState title="Belum ada peluang reward pada kategori ini" description="Coba kategori lain atau jalankan scan lagi nanti." />
          </>
        ) : (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                {poll?.state === 'cache_completed' ? `${results.length} peluang ditemukan` : `${results.length} peluang (hasil tersedia)`}
              </h2>
              <ProvenanceBadge provenance={poll?.source === 'search' ? 'search_new' : 'database'} />
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
                provenance={poll?.source === 'search' ? 'search_new' : 'database'}
              />
            ))}
            {poll?.source === 'search' ? (
              <p className="text-[11px] text-slate-500">Hasil dari pencarian baru — menunggu review sebelum dipublikasikan (PRD Appendix A6).</p>
            ) : null}
          </section>
        )
      ) : (
        <ScanProgress state={poll?.state ?? 'queued'} candidates={poll?.candidates ?? 0} />
      )}

      <p className="text-[11px] text-slate-600">
        Provenance: hasil dari database terverifikasi / cache akan ditandai otomatis saat engine scan aktif (PRD Appendix A9).
      </p>
    </div>
  )
}
