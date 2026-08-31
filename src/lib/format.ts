// CuanRadar — Util format & label (Bahasa Indonesia)
import type { PayoutMethod, RiskLevel, RewardType, ScoreFactor, VerificationStatus } from '../types'

// DB menyimpan uang sebagai integer minor unit (sen IDR) — ARCHITECTURE §3.
// Fungsi ini menerima nilai MAJOR (Rupiah) untuk keperluan tampilan.
export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
}

export function formatIDRFromSen(sen: number): string {
  return formatIDR(Math.round(sen / 100))
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

/** Format selisih milidetik menjadi "baru saja / X menit lalu / X jam lalu / X hari lalu". */
export function formatRelative(ms: number): string {
  const sec = Math.round(ms / 1000)
  if (sec < 60) return 'baru saja'
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} menit lalu`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} jam lalu`
  const day = Math.round(hr / 24)
  return `${day} hari lalu`
}

export const CATEGORY_LABELS: Record<string, string> = {
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  wallet: 'Wallet',
  lainnya: 'Kategori lain',
}

export const STATUS_LABELS: Record<string, string> = {
  mvp: 'MVP',
  fase2: 'Fase 2',
  pantau: 'Pantau',
}

export function getRewardTypeLabel(t: RewardType): string {
  const labels: Record<RewardType, string> = {
    saldo: 'Saldo',
    cashback: 'Cashback',
    poin: 'Poin',
    koin: 'Koin',
    voucher: 'Voucher',
    miles: 'Miles',
    promo: 'Promo',
    komisi: 'Komisi',
    bunga: 'Bunga',
    task: 'Task',
  }
  return labels[t] ?? t
}

export function getPayoutMethodLabel(m: PayoutMethod): string {
  const labels: Record<PayoutMethod, string> = {
    dana: 'DANA',
    ovo: 'OVO',
    gopay: 'GoPay',
    shopeepay: 'ShopeePay',
    linkaja: 'LinkAja',
    bank: 'Transfer bank',
    bank_transfer: 'Transfer bank',
    voucher: 'Voucher',
    saldo_app: 'Saldo aplikasi',
    potongan_transaksi: 'Potongan transaksi',
  }
  return labels[m] ?? m
}

export function getRiskLabel(r: RiskLevel): string {
  const labels: Record<RiskLevel, string> = {
    rendah: 'Risiko rendah',
    sedang: 'Risiko sedang',
    tinggi: 'Risiko tinggi',
    terindikasi_scam: 'Terindikasi scam',
  }
  return labels[r] ?? r
}

export function getVerificationLabel(v: VerificationStatus): string {
  const labels: Record<VerificationStatus, string> = {
    verified: 'Terverifikasi',
    partially_verified: 'Terverifikasi sebagian',
    unverified: 'Belum terverifikasi',
  }
  return labels[v] ?? v
}

// ——— CuanScore (BUILD 3) ———
export const SCORE_FACTOR_LABELS: Record<ScoreFactor, string> = {
  reward_potential: 'Potensi reward',
  verification: 'Verifikasi',
  reward_effort: 'Reward / effort',
  platform_risk: 'Risiko platform',
  accessibility: 'Aksesibilitas',
  reward_stability: 'Stabilitas reward',
}

/** Ringkas penilaian skor untuk aksesibilitas (0–100). */
export function scoreTone(score: number): 'green' | 'amber' | 'slate' {
  if (score >= 75) return 'green'
  if (score >= 50) return 'amber'
  return 'slate'
}
