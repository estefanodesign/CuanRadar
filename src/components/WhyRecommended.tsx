// CuanRadar — WhyRecommended (PRD §57: "Why is this recommended?")
// Daftar alasan deterministik dari data platform — bukan klaim LLM.
// Termasuk blokir tegas (RUBRIC §6): scam / expired / unverified tidak direkomendasikan.
import { formatIDRFromSen, getPayoutMethodLabel } from '../lib/format'
import type { Platform } from '../types'

const EWALLETS = new Set(['dana', 'ovo', 'gopay', 'shopeepay', 'linkaja'])

interface Reason {
  tone: 'good' | 'warn' | 'block'
  text: string
}

function buildReasons(p: Platform): Reason[] {
  const reasons: Reason[] = []

  // Sumbu 1 — verifikasi (informasi)
  if (p.verification_status === 'verified') reasons.push({ tone: 'good', text: 'Informasi reward terverifikasi' })
  else if (p.verification_status === 'partially_verified')
    reasons.push({ tone: 'warn', text: 'Terverifikasi sebagian — sebagian klaim belum dipastikan' })
  else reasons.push({ tone: 'warn', text: 'Belum terverifikasi — tidak masuk rekomendasi utama (PRD §29)' })

  // Sumbu 2 — risiko (platform)
  if (p.risk_level === 'rendah') reasons.push({ tone: 'good', text: 'Risiko platform rendah — track record payout baik' })
  else if (p.risk_level === 'sedang') reasons.push({ tone: 'warn', text: 'Risiko sedang — perhatikan syarat & ketentuan' })
  else if (p.risk_level === 'tinggi') reasons.push({ tone: 'warn', text: 'Risiko tinggi — payout belum terbukti konsisten' })
  else reasons.push({ tone: 'block', text: 'Terindikasi scam — DIBLOKIR dari rekomendasi (RUBRIC §6)' })

  // Payout
  const ewallets = p.payout_methods.filter((m) => EWALLETS.has(m))
  if (ewallets.length > 0) {
    reasons.push({ tone: 'good', text: `Payout via e-wallet umum (${ewallets.map(getPayoutMethodLabel).join(', ')})` })
  } else if (p.payout_methods.length > 0) {
    reasons.push({ tone: 'warn', text: `Payout via ${p.payout_methods.map(getPayoutMethodLabel).join(', ')}` })
  }

  if (p.min_payout_idr != null) {
    // min_payout_idr disimpan sebagai sen IDR (migrasi 0001_init.sql) → konversi ke rupiah sebelum tampil.
    reasons.push({ tone: 'good', text: `Minimum payout tercantum (${formatIDRFromSen(p.min_payout_idr)})` })
  } else {
    reasons.push({ tone: 'warn', text: 'Minimum payout belum tercantum — cek syarat sebelum mulai' })
  }

  reasons.push({ tone: 'good', text: 'Tersedia untuk pengguna Indonesia' })
  return reasons
}

export function WhyRecommended({ platform }: { platform: Platform }) {
  const reasons = buildReasons(platform)
  const blocked = platform.risk_level === 'terindikasi_scam'

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
      <h2 className="text-sm font-semibold">Mengapa aplikasi ini direkomendasikan?</h2>
      <ul className="mt-3 space-y-2">
        {reasons.map((r) => (
          <li key={r.text} className="flex items-start gap-2 text-xs leading-relaxed">
            <span
              className={`mt-0.5 shrink-0 ${
                r.tone === 'good' ? 'text-emerald-400' : r.tone === 'warn' ? 'text-amber-400' : 'text-red-400'
              }`}
            >
              {r.tone === 'good' ? '✓' : r.tone === 'warn' ? '⚠' : '⛔'}
            </span>
            <span className={r.tone === 'block' ? 'font-medium text-red-300' : 'text-slate-300'}>{r.text}</span>
          </li>
        ))}
      </ul>
      {blocked ? (
        <p className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] leading-relaxed text-red-200">
          Platform dengan indikasi scam tidak pernah direkomendasikan. Informasi ini ditampilkan hanya sebagai peringatan
          (PRD §28, RUBRIC §6).
        </p>
      ) : null}
    </section>
  )
}
