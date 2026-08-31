// CuanRadar — EstimationCalculator (PRD §30–31, Appendix A4)
// Kalkulator estimasi + input asumsi pengguna. Bila data offer belum ada, memakai nilai satuan yang
// tersedia (mis. min_payout_idr sebagai indikator) dan menandai hasil "*berdasarkan asumsi Anda*".
import { useMemo, useState } from 'react'
import { formatIDRFromSen } from '../lib/format'
import { estimateReward } from '../lib/estimate'
import type { Platform } from '../types'

interface EstimasiProps {
  platform: Platform
}

export function EstimationCalculator({ platform }: EstimasiProps) {
  // Nilai satuan (sen IDR) & durasi: dari reward_offers bila tersedia; saat ini belum di-seed,
  // jadi gunakan min_payout_idr sebagai nilai indikatif satuan. estimated_menit biasanya null.
  const valueSen = platform.min_payout_idr
  const minutesPerActivity = null // reward_offers.estimated_menit belum ter-seed
  const activityUnit = 'aktivitas'

  const [assumptionOn, setAssumptionOn] = useState(false)
  const [minutes, setMinutes] = useState(10)
  const [tasks, setTasks] = useState(3)

  const est = useMemo(
    () => estimateReward({ valueSenPerActivity: valueSen, minutesPerActivity, activityUnit }, assumptionOn ? { minutesPerTask: minutes, tasksPerDay: tasks } : null),
    [valueSen, assumptionOn, minutes, tasks],
  )

  return (
    <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-sm font-semibold">Estimasi reward</h2>

      {!est.perActivityLabel && !est.canEstimate ? (
        <p className="text-xs text-slate-500">Belum ada nilai satuan reward — estimasi belum dapat dihitung (tidak mengarang).</p>
      ) : (
        <div className="space-y-2">
          {est.perActivityLabel ? (
            <div className="flex justify-between gap-4 text-xs">
              <span className="text-slate-500">Nilai satuan</span>
              <span className="text-slate-200">{est.perActivityLabel}</span>
            </div>
          ) : null}

          {est.canEstimate ? (
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-800/50 p-3 text-xs">
              <div>
                <p className="text-slate-500">Per jam</p>
                <p className="font-semibold text-slate-200">{est.perHour != null ? formatIDRFromSen(est.perHour) : '—'}</p>
              </div>
              <div>
                <p className="text-slate-500">Per hari</p>
                <p className="font-semibold text-slate-200">{est.daily != null ? formatIDRFromSen(est.daily) : '—'}</p>
              </div>
              <div>
                <p className="text-slate-500">Per minggu</p>
                <p className="font-semibold text-slate-200">{est.weekly != null ? formatIDRFromSen(est.weekly) : '—'}</p>
              </div>
              <div>
                <p className="text-slate-500">Per bulan</p>
                <p className="font-semibold text-slate-200">{est.monthly != null ? formatIDRFromSen(est.monthly) : '—'}</p>
              </div>
            </div>
          ) : (
            <p className="rounded-xl border border-slate-700 bg-slate-800/40 px-3 py-2 text-xs text-slate-400">
              Monthly earning cannot be reliably estimated — data waktu per aktivitas belum tersedia (PRD §30).
            </p>
          )}

          {est.basedOn === 'assumption' ? (
            <p className="text-[11px] text-amber-300">⚠ Hasil di atas berdasarkan asumsi Anda — bukan angka resmi (PRD Appendix A4).</p>
          ) : null}

          {/* Toggle asumsi pengguna */}
          <button
            type="button"
            onClick={() => setAssumptionOn((v) => !v)}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-300 transition hover:border-emerald-500/50"
          >
            {assumptionOn ? 'Sembunyikan asumsi' : '🔧 Masukkan asumsi saya'}
          </button>

          {assumptionOn ? (
            <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
              <label className="block text-xs">
                <span className="text-slate-500">Menit per aktivitas</span>
                <input
                  type="number"
                  min={1}
                  value={minutes}
                  onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </label>
              <label className="block text-xs">
                <span className="text-slate-500">Aktivitas per hari</span>
                <input
                  type="number"
                  min={1}
                  value={tasks}
                  onChange={(e) => setTasks(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-2 py-1.5 text-sm text-slate-100 focus:border-emerald-500 focus:outline-none"
                />
              </label>
            </div>
          ) : null}
        </div>
      )}

      <p className="text-[11px] text-slate-600">Semua angka estimasi berlabel — bukan pendapatan terjamin (PRD §31).</p>
    </section>
  )
}
