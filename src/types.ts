// CuanRadar — Tipe data inti (selaras dengan PRD §25–28, §59 & VALIDATION_RUBRIC)

export type Category = 'entertainment' | 'shopping' | 'wallet' | 'lainnya'

export type CatalogStatus = 'mvp' | 'fase2' | 'pantau'

// Sumbu 2 — keamanan platform (VALIDATION_RUBRIC §2)
export type RiskLevel = 'rendah' | 'sedang' | 'tinggi' | 'terindikasi_scam'

// Sumbu 1 — kebenaran informasi (PRD §28)
export type VerificationStatus = 'verified' | 'partially_verified' | 'unverified'

// Sumbu 3 — siklus hidup offer (PRD §28)
export type OfferStatus = 'active' | 'expired' | 'scheduled'

export type RewardType = 'saldo' | 'cashback' | 'poin' | 'koin' | 'voucher' | 'miles' | 'promo' | 'komisi' | 'bunga' | 'task'

export type PayoutMethod =
  | 'dana'
  | 'ovo'
  | 'gopay'
  | 'shopeepay'
  | 'linkaja'
  | 'bank'
  | 'bank_transfer'
  | 'voucher'
  | 'saldo_app'
  | 'potongan_transaksi'

// Struktur reward_apps (PRD §25, §59) — cocok dengan data/seed-platforms.json
export interface Platform {
  id: string
  slug: string
  name: string
  category: Category
  developer: string | null
  website: string | null
  google_play: string | null
  app_store: string | null
  status: CatalogStatus
  reward_types: RewardType[]
  payout_methods: PayoutMethod[]
  min_payout_idr: number | null
  risk_level: RiskLevel
  verification_status: VerificationStatus
  last_verified_at: string
  notes: string | null
}

export interface RewardOffer {
  id: string
  platform_id: string
  title: string
  description: string | null
  reward_type: RewardType
  reward_value: number | null // integer minor unit (sen IDR) bila berupa nominal
  reward_unit: string | null
  currency: 'IDR'
  activity: string | null
  conditions: string[]
  min_activity: number | null
  max_reward: number | null
  min_withdrawal: number | null
  validity: string | null
  estimated_menit: number | null
  referral_url: string | null
  source: 'manual' | 'community' | 'auto'
  provenance: 'database' | 'cache' | 'search_new'
  offer_status: OfferStatus
  last_verified_at: string
}

export interface ScanRequest {
  type: 'quick' | 'deep'
  category: Category | 'all'
}

export interface ScanResultItem {
  platform_id: string
  rank: number
  score: number | null // null = skor belum dihitung (BUILD 3)
  verification: VerificationStatus
  risk_level: RiskLevel
  provenance: 'database' | 'cache' | 'search_new'
}
