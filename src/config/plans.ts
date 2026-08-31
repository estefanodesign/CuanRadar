// CuanRadar — Konfigurasi plan & kuota (MONETIZATION §3.1, disetujui founder)
// Kuota: Quick — Free 3, Pro 7, Pro+ 15 per hari
//        Deep  — Free 1, Pro 3, Pro+ 8 per hari
//        Compare — Free 4, Pro 8, Pro+ 16 offer

export type PlanId = 'free' | 'pro' | 'pro_plus'

export interface Plan {
  id: PlanId
  name: string
  priceMonthly: number | null // IDR per bulan; null = gratis
  priceAnnual: number | null
  quickPerDay: number
  deepPerDay: number
  compareOffers: number
  trackerLimit: number | null // null = tanpa batas
  alertLevel: 'mingguan' | 'real_time' | 'real_time_push'
  exportAllowed: 'none' | 'csv' | 'csv_api'
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: null,
    priceAnnual: null,
    quickPerDay: 3,
    deepPerDay: 1,
    compareOffers: 4,
    trackerLimit: 5,
    alertLevel: 'mingguan',
    exportAllowed: 'none',
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    priceMonthly: 39000,
    priceAnnual: 390000,
    quickPerDay: 7,
    deepPerDay: 3,
    compareOffers: 8,
    trackerLimit: null,
    alertLevel: 'real_time',
    exportAllowed: 'csv',
  },
  pro_plus: {
    id: 'pro_plus',
    name: 'Pro+',
    priceMonthly: 79000,
    priceAnnual: null,
    quickPerDay: 15,
    deepPerDay: 8,
    compareOffers: 16,
    trackerLimit: null,
    alertLevel: 'real_time_push',
    exportAllowed: 'csv_api',
  },
}

export const DEFAULT_PLAN: PlanId = 'free'

export function getPlan(id: PlanId): Plan {
  return PLANS[id]
}
