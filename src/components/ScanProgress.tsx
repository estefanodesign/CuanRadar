// CuanRadar — ScanProgress (PRD §53–54, §62)
// Stepper state machine scan + pesan status. Menampilkan langkah yang selesai & yang aktif.
import { SCAN_STAGES, STAGE_LABELS, activeStage } from '../lib/scan'
import type { ScanState } from '../types'

export function ScanProgress({ state, candidates }: { state: ScanState; candidates: number }) {
  const current = activeStage(state)

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Memindai peluang reward…</p>
        <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] text-emerald-300">
          {state === 'cache_completed' ? '⚡ dari database' : state === 'completed' ? '✅ selesai' : '⏳ berjalan'}
        </span>
      </div>

      {/* Stepper */}
      <ol className="mt-4 space-y-2.5">
        {SCAN_STAGES.map((s) => {
          const idx = SCAN_STAGES.indexOf(s)
          const stateIdx = current === 'done' ? SCAN_STAGES.length : SCAN_STAGES.indexOf(current as typeof s)
          const isDone = current === 'done' || idx < stateIdx
          const isActive = current === s
          const meta = STAGE_LABELS[s]
          return (
            <li key={s} className={`flex items-center gap-3 ${isDone ? 'text-slate-200' : isActive ? 'text-emerald-300' : 'text-slate-600'}`}>
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                  isDone ? 'bg-emerald-500 text-slate-950' : isActive ? 'border border-emerald-500/50 text-emerald-300' : 'border border-slate-700 text-slate-500'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </span>
              <span className="text-sm">
                {meta.icon} {meta.label}
              </span>
            </li>
          )
        })}
      </ol>

      {state === 'failed' ? (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
          Scan gagal. Coba lagi nanti — hasil cache sebelumnya tetap aman (PRD §12).
        </p>
      ) : state === 'limited' ? (
        <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
          Data di kategori ini belum mencukupi jumlah minimum. Menampilkan hasil yang tersedia — tidak mengarang (PRD §13).
        </p>
      ) : state === 'cache_completed' ? (
        <p className="mt-3 text-[11px] text-slate-500">
          Data database sudah cukup — Quick Scan selesai tanpa pencarian web (database-first, PRD §11).{candidates ? ` · ${candidates} kandidat baru` : ''}
        </p>
      ) : null}

      {current !== 'done' && state !== 'failed' && state !== 'limited' ? (
        <p className="mt-3 text-[11px] text-slate-500">
          Ini mungkin memakan waktu sebentar pada pencarian pertama.
        </p>
      ) : null}
    </div>
  )
}
