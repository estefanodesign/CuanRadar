// CuanRadar — src/lib/scoring.ts
// CuanScore: skema tunggal 6 faktor deterministik (PRD §32, VALIDATION_RUBRIC §5).
// Kalkulasi = KODE, bukan LLM (PRD §22). Data kurang → netral 0.5 (tidak pernah nol, tidak dikarang).
//
// CATATAN (BUILD 3 frontend): selama API scan/server belum memberi skor (ScanResultItem.score),
// UI menghitung skor sendiri dari field reward_apps yang tersedia. Saat backend aktif,
// UI beralih memakai skor server; modul ini menjadi fallback/penjelas breakdown.
import type { Platform, RewardType, PayoutMethod, ScoreFactor, ScoredResult } from '../types'

export const BOBOT_VERSION = 'v1-2026-08-30'

// Bobot 6 faktor (PRD §32) — tanpa bobot_version (metadata, bukan faktor)
export const FACTOR_WEIGHTS: Record<ScoreFactor, number> = {
  reward_potential: 0.25,
  verification: 0.2,
  reward_effort: 0.2,
  platform_risk: 0.15,
  accessibility: 0.1,
  reward_stability: 0.1,
}

// ——— Komponen 1: Reward Potential (PRD §33) ———
// Data seed belum punya reward_value/frekuensi/earning ceiling, jadi dinilai dari
// TIPE reward yang tersedia (cash > poin likuid > voucher). Nilai penuh menyusul
// saat reward_offers dibaca (BUILD 3 backend).
const REWARD_TYPE_POTENTIAL: Record<RewardType, number> = {
  saldo: 0.8, // cashlike
  cashback: 0.8,
  komisi: 0.8,
  poin: 0.6, // poin likuid
  koin: 0.55,
  voucher: 0.5,
  promo: 0.5,
  miles: 0.5,
  bunga: 0.4,
  task: 0.6,
}

function rewardPotential(types: RewardType[]): number {
  if (types.length === 0) return 0.5 // netral
  const vals = types.map((t) => REWARD_TYPE_POTENTIAL[t] ?? 0.5)
  return Math.max(...vals)
}

// ——— Komponen 2: Verification (RUBRIC §5) ———
function verificationValue(v: Platform['verification_status']): number {
  switch (v) {
    case 'verified':
      return 1.0
    case 'partially_verified':
      return 0.6
    default:
      return 0.2
  }
}

// ——— Komponen 3: Reward/Effort (PRD §34) ———
// Hanya bisa dihitung bila ada data nilai efektif per jam (estimated_menit + reward_value).
// Data seed belum memilikinya → netral 0.5 (jujur, tidak dikarang).
const REWARD_EFFORT_NEUTRAL = 0.5

// ——— Komponen 4: Platform Risk (RUBRIC §5) ———
function platformRiskValue(risk: Platform['risk_level']): number {
  switch (risk) {
    case 'rendah':
      return 1.0
    case 'sedang':
      return 0.7
    case 'tinggi':
      return 0.3
    case 'terindikasi_scam':
      return 0 // diblokir dari rekomendasi (RUBRIC §6)
  }
}

// ——— Komponen 5: Accessibility (PRD §32; e-wallet umum > bank > voucher) ———
const PAYOUT_ACCESS: Record<PayoutMethod, number> = {
  dana: 1.0,
  ovo: 1.0,
  gopay: 1.0,
  shopeepay: 1.0,
  linkaja: 1.0,
  bank: 0.8,
  bank_transfer: 0.8,
  potongan_transaksi: 0.6,
  saldo_app: 0.6,
  voucher: 0.5,
}

function accessibility(payouts: PayoutMethod[]): number {
  if (payouts.length === 0) return 0.5 // netral
  const vals = payouts.map((p) => PAYOUT_ACCESS[p] ?? 0.5)
  return Math.max(...vals)
}

// ——— Komponen 6: Reward Stability (PRD §35) ———
// Berasal dari reward_history (deret nilai). Belum tersedia di data seed → netral 0.5.
const REWARD_STABILITY_NEUTRAL = 0.5

/** Hitung CuanScore 0–100 + breakdown untuk satu platform (deterministik). */
export function scorePlatform(p: Platform): ScoredResult {
  const breakdown = {
    reward_potential: rewardPotential(p.reward_types),
    verification: verificationValue(p.verification_status),
    reward_effort: REWARD_EFFORT_NEUTRAL,
    platform_risk: platformRiskValue(p.risk_level),
    accessibility: accessibility(p.payout_methods),
    reward_stability: REWARD_STABILITY_NEUTRAL,
    bobot_version: BOBOT_VERSION,
  }
  const score = Math.round(
    (FACTOR_WEIGHTS.reward_potential * breakdown.reward_potential +
      FACTOR_WEIGHTS.verification * breakdown.verification +
      FACTOR_WEIGHTS.reward_effort * breakdown.reward_effort +
      FACTOR_WEIGHTS.platform_risk * breakdown.platform_risk +
      FACTOR_WEIGHTS.accessibility * breakdown.accessibility +
      FACTOR_WEIGHTS.reward_stability * breakdown.reward_stability) *
      100,
  )
  return { score, breakdown }
}
