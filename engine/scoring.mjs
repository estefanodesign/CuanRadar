// CuanRadar — engine/scoring.mjs (SERVER-SIDE, BUILD 3)
// CuanScore deterministik 6 faktor — sumber kebenaran server (PRD §32, VALIDATION_RUBRIC §5).
// Client (src/lib/scoring.ts) memakai logika yang sama sebagai fallback/penjelas; saat API aktif,
// UI memakai skor dari server. Data kurang → netral 0.5 (tidak pernah nol, tidak dikarang — PRD §22).

export const SCORE_VERSION = 'v1-2026-08-30'

export const FACTOR_WEIGHTS = {
  reward_potential: 0.25,
  verification: 0.2,
  reward_effort: 0.2,
  platform_risk: 0.15,
  accessibility: 0.1,
  reward_stability: 0.1,
}

const REWARD_TYPE_POTENTIAL = {
  saldo: 0.8, cashback: 0.8, komisi: 0.8, poin: 0.6, koin: 0.55,
  voucher: 0.5, promo: 0.5, miles: 0.5, bunga: 0.4, task: 0.6,
}

const VERIFICATION_VALUE = { verified: 1.0, partially_verified: 0.6, unverified: 0.2 }

const RISK_VALUE = { rendah: 1.0, sedang: 0.7, tinggi: 0.3, terindikasi_scam: 0 }

const PAYOUT_ACCESS = {
  dana: 1.0, ovo: 1.0, gopay: 1.0, shopeepay: 1.0, linkaja: 1.0,
  bank: 0.8, bank_transfer: 0.8, potongan_transaksi: 0.6, saldo_app: 0.6, voucher: 0.5,
}

const NEUTRAL = 0.5

/**
 * @param {object} p — minimal: reward_types[], verification_status, risk_level, payout_methods[]
 * @param {{ rewardHistory?: number[], effortValue?: number|null }} extra — data lanjutan bila tersedia
 * @returns {{score: number, breakdown: object, version: string}}
 */
export function scorePlatform(p, { rewardHistory = [], effortValue = null } = {}) {
  const types = Array.isArray(p.reward_types) ? p.reward_types : []
  const payouts = Array.isArray(p.payout_methods) ? p.payout_methods : []

  const rewardPotential = types.length === 0
    ? NEUTRAL
    : Math.max(...types.map((t) => REWARD_TYPE_POTENTIAL[t] ?? NEUTRAL))

  const verification = VERIFICATION_VALUE[p.verification_status] ?? 0.2
  const platformRisk = RISK_VALUE[p.risk_level] ?? 0.7
  const accessibility = payouts.length === 0
    ? NEUTRAL
    : Math.max(...payouts.map((m) => PAYOUT_ACCESS[m] ?? NEUTRAL))

  // Stability: dari deret reward_history (koefisien variasi); tanpa data → netral.
  let rewardStability = NEUTRAL
  if (rewardHistory.length >= 3) {
    const mean = rewardHistory.reduce((a, b) => a + b, 0) / rewardHistory.length
    if (mean > 0) {
      const variance = rewardHistory.reduce((a, b) => a + (b - mean) ** 2, 0) / rewardHistory.length
      const cv = Math.sqrt(variance) / mean
      rewardStability = Math.max(0, Math.min(1, 1 - cv))
    }
  }

  // Reward/Effort: hanya bila data nilai efektif per jam tersedia; selain itu netral (PRD §34, §30).
  const rewardEffort = typeof effortValue === 'number' && Number.isFinite(effortValue)
    ? Math.max(0, Math.min(1, effortValue / 20000)) // skala rujukan: Rp20.000/jam = 1.0 (kalibrasi eksplisit)
    : NEUTRAL

  const breakdown = {
    reward_potential: round3(rewardPotential),
    verification: round3(verification),
    reward_effort: round3(rewardEffort),
    platform_risk: round3(platformRisk),
    accessibility: round3(accessibility),
    reward_stability: round3(rewardStability),
    bobot_version: SCORE_VERSION,
  }

  const score = Math.round(
    (FACTOR_WEIGHTS.reward_potential * breakdown.reward_potential +
      FACTOR_WEIGHTS.verification * breakdown.verification +
      FACTOR_WEIGHTS.reward_effort * breakdown.reward_effort +
      FACTOR_WEIGHTS.platform_risk * breakdown.platform_risk +
      FACTOR_WEIGHTS.accessibility * breakdown.accessibility +
      FACTOR_WEIGHTS.reward_stability * breakdown.reward_stability) * 100,
  )

  return { score, breakdown, version: SCORE_VERSION }
}

function round3(n) {
  return Math.round(n * 1000) / 1000
}
