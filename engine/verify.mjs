// CuanRadar — engine/verify.mjs (SERVER-SIDE, BUILD 3)
// Rubrik 8 pemeriksaan (VALIDATION_RUBRIC §2) → risk_level (sumbu platform).
// Nilai default UNKNOWN → tidak mengarang; hasil 'fail' kritis langsung TERINDIKASI_SCAM.

export const CHECKS = [
  'identitas_legal',
  'riwayat_payout',
  'kewajaran_ekonomi',
  'transparansi_syarat',
  'metode_pembayaran',
  'reputasi_komunitas',
  'pola_skema',
  'privasi_data',
]

export const CHECK_LABELS = {
  identitas_legal: 'Identitas legal',
  riwayat_payout: 'Riwayat payout',
  kewajaran_ekonomi: 'Kewajaran ekonomi',
  transparansi_syarat: 'Transparansi syarat',
  metode_pembayaran: 'Metode pembayaran',
  reputasi_komunitas: 'Reputasi komunitas',
  pola_skema: 'Pola skema',
  privasi_data: 'Privasi data',
}

const SCORE = { pass: 1, warn: 0, fail: 0, unknown: 0 }
const isFail = (v) => v === 'fail'
const isWarn = (v) => v === 'warn'

/**
 * @param {Record<string, 'pass'|'warn'|'fail'|'unknown'>} checks
 * @returns {{risk_level: string, passes: number, warns: number, fails: number, unknown: number}}
 */
export function determineRiskLevel(checks) {
  const values = CHECKS.map((c) => checks[c] ?? 'unknown')
  const count = (pred) => values.filter(pred).length
  const fails = count(isFail)
  const warns = count(isWarn)
  const passes = count((v) => v === 'pass')
  const unknown = count((v) => v === 'unknown')

  // Fail kritis (VALIDATION_RUBRIC §2): ponzi/return investasi, payout palsu, identitas palsu
  const criticalFail = isFail(checks.pola_skema) || isFail(checks.riwayat_payout) || isFail(checks.identitas_legal)
  let risk_level = 'sedang' // default netral
  if (criticalFail) risk_level = 'terindikasi_scam'
  else if (fails >= 2) risk_level = 'tinggi'
  else if (warns >= 1) risk_level = 'sedang'
  else if (passes >= 6) risk_level = 'rendah'

  return { risk_level, passes, warns, fails, unknown }
}

/**
 * Isi awal rubrik dari field platform yang tersedia (sisa 'unknown' untuk tinjauan editor).
 * @param {object} p — {risk_level, verification_status, payout_methods[], notes, developer}
 */
export function autoChecksFromPlatform(p) {
  const checks = {}
  for (const c of CHECKS) checks[c] = 'unknown'
  checks.metode_pembayaran = Array.isArray(p.payout_methods) && p.payout_methods.length > 0 ? 'pass' : 'unknown'
  if (p.developer) checks.identitas_legal = 'pass' // identitas disebut (belum legalitas resmi)
  if (p.verification_status === 'verified') {
    checks.riwayat_payout = 'pass'
    checks.transparansi_syarat = 'pass'
  }
  return checks
}
