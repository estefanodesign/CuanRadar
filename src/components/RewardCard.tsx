// CuanRadar — Reward Card (PRD §55)
// Menampilkan dua sumbu terpisah: badge verifikasi (informasi) & badge risiko (platform).
// BUILD 3: + CuanScore, provenance per hasil (Appendix A9), tautan ke halaman detail.
import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import type { Platform } from '../types'
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  formatDate,
  getPayoutMethodLabel,
  getRewardTypeLabel,
  getRiskLabel,
  getVerificationLabel,
} from '../lib/format'
import { scorePlatform } from '../lib/scoring'
import { Badge } from './Badge'
import { ScoreBadge } from './ScoreBadge'
import { ProvenanceBadge, type Provenance } from './ProvenanceBadge'

interface RewardCardProps {
  platform: Platform
  saved: boolean
  onToggleSave: (id: string) => void
  /** Asal hasil (PRD Appendix A9). Default 'database' — hasil kurasi/DB terverifikasi. */
  provenance?: Provenance
}

export function RewardCard({ platform, saved, onToggleSave, provenance = 'database' }: RewardCardProps) {
  const riskTone = platform.risk_level === 'rendah' ? 'green' : platform.risk_level === 'sedang' ? 'amber' : 'red'
  const verTone = platform.verification_status === 'verified' ? 'green' : platform.verification_status === 'partially_verified' ? 'amber' : 'slate'
  const scored = useMemo(() => scorePlatform(platform), [platform])
  const detailPath = `/app/rewards/${platform.slug || platform.id}`

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link to={detailPath} className="block truncate text-sm font-semibold text-slate-100 transition hover:text-emerald-300">
            {platform.name}
          </Link>
          <p className="text-xs text-slate-500">
            {CATEGORY_LABELS[platform.category]} · {STATUS_LABELS[platform.status]}
            {platform.developer ? ` · ${platform.developer}` : ''}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <ScoreBadge score={scored.score} />
          <ProvenanceBadge provenance={provenance} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {platform.reward_types.map((t) => (
          <span key={t} className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300">
            {getRewardTypeLabel(t)}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {platform.payout_methods.map((m) => (
          <span key={m} className="rounded-md bg-slate-800 px-1.5 py-0.5 text-[11px] text-slate-300">
            {getPayoutMethodLabel(m)}
          </span>
        ))}
      </div>

      {platform.notes ? <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-400">{platform.notes}</p> : null}

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800 pt-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={verTone}>{getVerificationLabel(platform.verification_status)}</Badge>
          <Badge tone={riskTone}>{getRiskLabel(platform.risk_level)}</Badge>
          <span className="text-[11px] text-slate-500">verif {formatDate(platform.last_verified_at)}</span>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => onToggleSave(platform.id)}
            className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-200 transition hover:border-slate-500"
            aria-pressed={saved}
          >
            {saved ? '✓ Tersimpan' : 'Simpan'}
          </button>
          <Link
            to={detailPath}
            className="rounded-lg border border-emerald-500/40 px-2.5 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/15"
          >
            Detail
          </Link>
          <a
            href={platform.website ?? undefined}
            target="_blank"
            rel="noreferrer"
            className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition ${
              platform.website
                ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                : 'pointer-events-none bg-slate-800 text-slate-500'
            }`}
          >
            Buka
          </a>
        </div>
      </div>
    </article>
  )
}
