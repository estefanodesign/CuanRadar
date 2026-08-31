// CuanRadar — ScoreBadge (CuanScore, PRD §57)
// Badge ringkas + breakdown 6 faktor (opsional) — deterministik dari src/lib/scoring.ts.
import { SCORE_FACTOR_LABELS, scoreTone } from '../lib/format'
import type { ScoreFactor, ScoredResult } from '../types'

const TONES: Record<string, string> = {
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

interface ScoreBadgeProps {
  score: number
  /** Tampilkan breakdown 6 faktor di bawah badge (untuk halaman detail). */
  breakdown?: ScoredResult['breakdown']
}

export function ScoreBadge({ score, breakdown }: ScoreBadgeProps) {
  const tone = scoreTone(score)
  return (
    <div className="space-y-2">
      <span
        title={`CuanScore ${score}/100 — skor deterministik 6 faktor (bobot ${breakdown?.bobot_version ?? 'v1'})`}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${TONES[tone]}`}
      >
        CuanScore {score}
      </span>

      {breakdown ? (
        <div className="space-y-1.5">
          {(Object.keys(SCORE_FACTOR_LABELS) as ScoreFactor[]).map((f) => {
            const v = breakdown[f]
            const pct = Math.round(v * 100)
            const barTone = v >= 0.7 ? 'bg-emerald-500' : v >= 0.5 ? 'bg-amber-500' : 'bg-slate-600'
            return (
              <div key={f} className="flex items-center gap-2 text-[11px]">
                <span className="w-28 shrink-0 text-slate-400">{SCORE_FACTOR_LABELS[f]}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                  <div className={`h-full rounded-full ${barTone}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="w-8 shrink-0 text-right text-slate-500">{pct}</span>
              </div>
            )
          })}
          <p className="text-[10px] text-slate-600">
            Bobot {breakdown.bobot_version} · skor deterministik; faktor tanpa data dinilai netral (50).
          </p>
        </div>
      ) : null}
    </div>
  )
}
