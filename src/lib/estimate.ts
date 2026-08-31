// CuanRadar — src/lib/estimate.ts
// Estimasi reward deterministik (PRD §30–31, Appendix A4). Kalkulasi = KODE, bukan LLM (PRD §22).
// Dua jalur:
//   1) Data lengkap (reward_offers punya nilai & estimated_menit) → hitung otomatis.
//   2) Data kurang → tampilkan nilai satuan + "Monthly earning cannot be reliably estimated";
//      tambah asumsi pengguna (menit/task, task/hari) untuk estimasi "*berdasarkan asumsi Anda*".
// Uang selalu integer minor unit (sen IDR) — ARCHITECTURE §3.

const SEN_PER_RUPIAH = 100

// Asumsi default bila pengguna belum mengisi (dipakai hanya ketika mode "asumsi pengguna" aktif,
// dan hasilnya diberi label "berdasarkan asumsi Anda" — bukan angka resmi).
const DEFAULT_MIN_PER_TASK = 10
const DEFAULT_TASKS_PER_DAY = 3

export interface EstimateInput {
  // Satuan reward (sen IDR per satuan aktivitas), dari reward_offers.reward_value.
  valueSenPerActivity: number | null
  // Waktu per aktivitas (menit), dari reward_offers.estimated_menit.
  minutesPerActivity: number | null
  // Nama satuan aktivitas (mis. "task", "kunjungan harian") — untuk copy.
  activityUnit: string | null
}

export interface EstimateAssumption {
  minutesPerTask: number
  tasksPerDay: number
}

export interface EstimateResult {
  perActivityLabel: string | null // "Rp5.000/task" bila nilai satuan ada
  daily: number | null // sen IDR
  weekly: number | null
  monthly: number | null
  perHour: number | null // sen IDR / jam (bila waktu cukup)
  canEstimate: boolean
  basedOn: 'data' | 'assumption' // sumber penghitungan
}

/** Nilai satuan bisa diestimasi bila nilai reward & durasi per aktivitas tersedia. */
export function canEstimateFromData(input: EstimateInput): boolean {
  return input.valueSenPerActivity != null && input.minutesPerActivity != null && input.minutesPerActivity > 0
}

/**
 * Hitung estimasi. Bila data cukup → basedOn='data'. Bila hanya nilai satuan ada (tanpa waktu) →
 * perActivityLabel diisi tapi daily/monthly null (canEstimate=false). Bila diberi asumsi pengguna →
 * hitung berdasarkan asumsi (label "berdasarkan asumsi Anda").
 */
export function estimateReward(
  input: EstimateInput,
  assumption: EstimateAssumption | null,
): EstimateResult {
  const perActivityLabel =
    input.valueSenPerActivity != null ? `Rp${Math.round(input.valueSenPerActivity / SEN_PER_RUPIAH)}/${input.activityUnit ?? 'aktivitas'}` : null

  // Jalur A — data lengkap: nilai + durasi nyata.
  if (canEstimateFromData(input)) {
    const perActivity = input.valueSenPerActivity!
    const minutes = input.minutesPerActivity!
    const perHour = Math.round(perActivity * (60 / minutes))
    return {
      perActivityLabel,
      daily: perActivity, // asumsi 1 aktivitas/hari; rincian per hari di bawah utk multi-task
      weekly: null,
      monthly: null,
      perHour,
      canEstimate: true,
      basedOn: 'data',
    }
  }

  // Jalur B — hanya nilai satuan (tanpa waktu): tampilkan satuan, tidak bisa proyeksi (PRD §30).
  if (input.valueSenPerActivity != null && !assumption) {
    return {
      perActivityLabel,
      daily: null,
      weekly: null,
      monthly: null,
      perHour: null,
      canEstimate: false,
      basedOn: 'data',
    }
  }

  // Jalur C — asumsi pengguna aktif: hitung dari nilai satuan + asumsi.
  if (input.valueSenPerActivity != null && assumption) {
    const perActivity = input.valueSenPerActivity
    const mins = assumption.minutesPerTask > 0 ? assumption.minutesPerTask : DEFAULT_MIN_PER_TASK
    const tasks = assumption.tasksPerDay > 0 ? assumption.tasksPerDay : DEFAULT_TASKS_PER_DAY
    const perHour = Math.round(perActivity * (60 / mins))
    const daily = perActivity * tasks
    const monthly = daily * 30
    return {
      perActivityLabel,
      daily,
      weekly: daily * 7,
      monthly,
      perHour,
      canEstimate: true,
      basedOn: 'assumption',
    }
  }

  // Tidak ada nilai satuan sama sekali → mustahil mengestimasi (jangan mengarang).
  return { perActivityLabel: null, daily: null, weekly: null, monthly: null, perHour: null, canEstimate: false, basedOn: 'data' }
}
