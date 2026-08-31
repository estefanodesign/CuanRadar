// CuanRadar — Util format & label (Bahasa Indonesia)
import type { PayoutMethod, RiskLevel, RewardType, VerificationStatus } from '../types'

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
