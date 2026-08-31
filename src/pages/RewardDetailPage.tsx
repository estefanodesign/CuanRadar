// CuanRadar — Reward Detail (PRD §56–57, §47)
// Info aplikasi, dua sumbu terpisah, CuanScore + breakdown, "Why recommended",
// link resmi prioritas (official → Play → App Store), dan peringatan blokir (RUBRIC §6).
import { useMemo, useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import { usePlatforms } from '../lib/platforms'
import { getSavedIds, toggleSaved } from '../lib/savedApps'
import { scorePlatform } from '../lib/scoring'
import { scoreTone } from '../lib/format'
import { Badge } from '../components/Badge'
import { ScoreBadge } from '../components/ScoreBadge'
import { ProvenanceBadge, type Provenance } from '../components/ProvenanceBadge'
import { WhyRecommended } from '../components/WhyRecommended'
import { EstimationCalculator } from '../components/EstimationCalculator'
import { EmptyState } from '../components/EmptyState'
import {
  CATEGORY_LABELS,
  STATUS_LABELS,
  formatDate,
  formatIDRFromSen,
  getPayoutMethodLabel,
  getRewardTypeLabel,
  getRiskLabel,
  getVerificationLabel,
} from '../lib/format'
import type { Platform } from '../types'

function officialLinks(p: Platform) {
  // Prioritas tautan resmi (PRD §47): official website → Google Play → App Store.
  return [
    { href: p.website, label: 'Situs resmi' },
    { href: p.google_play, label: 'Google Play' },
    { href: p.app_store, label: 'App Store' },
  ].filter((l): l is { href: string; label: string } => Boolean(l.href))
}

export function RewardDetailPage() {
  const { slug } = useParams({ strict: false })
  const { platforms, source } = usePlatforms()
  const [, setSavedVersion] = useState(0)
  const saved = getSavedIds()

  const platform = useMemo(
    () => platforms.find((p) => p.slug === slug || p.id === slug),
    [platforms, slug],
  )

  if (!platform) {
    return (
      <div className="space-y-4">
        <Link to="/app/rewards" className="text-xs text-emerald-300 hover:text-emerald-200">
          ← Kembali ke Rewards
        </Link>
        <EmptyState title="Aplikasi tidak ditemukan" description="Tautan mungkin kedaluwarsa atau aplikasi telah dihapus dari katalog." />
      </div>
    )
  }

  const scored = scorePlatform(platform)
  const savedNow = saved.includes(platform.id)
  const links = officialLinks(platform)
  // Katalog kurasi (seed/Supabase) = data yang telah dikurasi → provenance 'database' (Appendix A9).
  const provenance: Provenance = 'database'
  const blockedScam = platform.risk_level === 'terindikasi_scam'
  const blockedUnverified = platform.verification_status === 'unverified'

  return (
    <div className="space-y-5">
      <Link to="/app/rewards" className="text-xs text-emerald-300 hover:text-emerald-200">
        ← Kembali ke Rewards
      </Link>

      {/* Header aplikasi */}
      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-slate-100">{platform.name}</h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {CATEGORY_LABELS[platform.category]} · {STATUS_LABELS[platform.status]}
              {platform.developer ? ` · ${platform.developer}` : ''}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1.5">
            <ScoreBadge score={scored.score} breakdown={scored.breakdown} />
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

        {/* Dua sumbu terpisah (PRD Appendix A1) */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-slate-800 pt-3">
          <Badge tone={scoreTone(scored.breakdown.verification * 100)} title="Sumbu 1 — kebenaran informasi">
            {getVerificationLabel(platform.verification_status)}
          </Badge>
          <Badge
            tone={platform.risk_level === 'rendah' ? 'green' : platform.risk_level === 'sedang' ? 'amber' : 'red'}
            title="Sumbu 2 — keamanan platform"
          >
            {getRiskLabel(platform.risk_level)}
          </Badge>
          <span className="text-[11px] text-slate-500">terakhir diverifikasi {formatDate(platform.last_verified_at)}</span>
        </div>
      </section>

      {/* Peringatan blokir (RUBRIC §6) */}
      {blockedScam ? (
        <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-4">
          <p className="text-sm font-semibold text-red-300">⛔ Platform terindikasi scam</p>
          <p className="mt-1 text-xs leading-relaxed text-red-200/80">
            Diblokir dari rekomendasi dan hanya ditampilkan sebagai peringatan. Jangan transfer uang, jangan berikan data
            pribadi, dan jangan lakukan aktivitas berbayar pada platform ini.
          </p>
        </div>
      ) : blockedUnverified ? (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm font-semibold text-amber-300">⚠ Informasi belum terverifikasi</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-200/80">
            Klaim reward pada aplikasi ini belum cukup bukti. Tidak masuk rekomendasi utama (PRD §29) — verifikasi
            mandiri sebelum mulai.
          </p>
        </div>
      ) : null}

      {/* Mengapa direkomendasikan (PRD §57) */}
      <WhyRecommended platform={platform} />

      {/* Estimasi & kalkulator asumsi (PRD §30–31, A4) */}
      <EstimationCalculator platform={platform} />

      {/* Info tambahan */}
      <section className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold">Informasi</h2>
        <dl className="space-y-2 text-xs">
          {platform.min_payout_idr != null ? (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Minimum payout</dt>
              <dd className="text-slate-200">{formatIDRFromSen(platform.min_payout_idr)}</dd>
            </div>
          ) : (
            <div className="flex justify-between gap-4">
              <dt className="text-slate-500">Minimum payout</dt>
              <dd className="text-slate-400">Belum tercantum</dd>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Terakhir diverifikasi</dt>
            <dd className="text-slate-200">{formatDate(platform.last_verified_at)}</dd>
          </div>
          {platform.notes ? (
            <div className="rounded-xl bg-slate-800/50 px-3 py-2 leading-relaxed text-slate-300">{platform.notes}</div>
          ) : null}
        </dl>
      </section>

      {/* Tautan resmi (PRD §47) */}
      <section className="space-y-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <h2 className="text-sm font-semibold">Tautan resmi</h2>
        {links.length === 0 ? (
          <p className="text-xs text-slate-500">Belum ada tautan resmi tercatat untuk aplikasi ini.</p>
        ) : (
          links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-xl border border-slate-700 px-3 py-2.5 text-xs text-slate-200 transition hover:border-emerald-500/50"
            >
              <span>{l.label}</span>
              <span className="text-emerald-300">↗</span>
            </a>
          ))
        )}
        <p className="text-[10px] text-slate-600">
          Hanya tautan resmi (situs resmi, Google Play, App Store). Kami tidak menampilkan APK mirror atau unduhan tak
          dikenal (PRD §47).
        </p>
      </section>

      {/* Aksi */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => {
            toggleSaved(platform.id)
            setSavedVersion((v) => v + 1)
          }}
          className={`flex-1 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
            savedNow
              ? 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300'
              : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500'
          }`}
          aria-pressed={savedNow}
        >
          {savedNow ? '✓ Tersimpan' : 'Simpan aplikasi'}
        </button>
        {platform.website ? (
          <a
            href={platform.website}
            target="_blank"
            rel="noreferrer"
            className="flex-1 rounded-xl bg-emerald-500 px-3 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Buka aplikasi
          </a>
        ) : null}
      </div>

      <p className="text-[11px] leading-relaxed text-slate-600">
        Sumber data: {source === 'supabase' ? 'database terverifikasi (Supabase)' : 'katalog kurasi F0'}. Semua angka
        adalah estimasi berlabel dan dapat berubah sewaktu-waktu. CuanRadar bukan nasihat keuangan atau investasi. Skor
        dihitung deterministik dari data yang tersedia; faktor tanpa data dinilai netral.
      </p>
    </div>
  )
}
