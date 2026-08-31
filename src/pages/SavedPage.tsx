// CuanRadar — Saved (PRD §50; lokal di BUILD 1, sinkron akun di Fase 2)
import { useMemo, useState } from 'react'
import { usePlatforms } from '../lib/platforms'
import { getSavedIds, toggleSaved } from '../lib/savedApps'
import { RewardCard } from '../components/RewardCard'
import { EmptyState } from '../components/EmptyState'
import type { Platform } from '../types'

export function SavedPage() {
  const [, setVersion] = useState(0)
  const saved = getSavedIds()
  const { platforms } = usePlatforms()
  const byId = useMemo(() => new Map(platforms.map((p) => [p.id, p])), [platforms])
  const items = saved.map((id) => byId.get(id)).filter((p): p is Platform => Boolean(p))

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-xl font-bold">Saved</h1>
        <p className="text-sm text-slate-400">
          Aplikasi favorit Anda. <span className="text-slate-600">Tersimpan lokal — sinkronisasi akun di Fase 2.</span>
        </p>
      </section>

      {items.length === 0 ? (
        <EmptyState title="Belum ada aplikasi tersimpan" description="Ketuk 'Simpan' pada kartu reward untuk memantau peluang favorit Anda." />
      ) : (
        <div className="space-y-3">
          {items.map((p) => (
            <RewardCard
              key={p.id}
              platform={p}
              saved={true}
              onToggleSave={() => {
                toggleSaved(p.id)
                setVersion((v) => v + 1)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
