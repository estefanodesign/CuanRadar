// CuanRadar — engine/calc.mjs (SERVER-SIDE, BUILD 3)
// Kalkulasi reward DETERMINISTIK (PRD §22, §30): hanya menghitung bila data cukup;
// bila kurang → { ok:false, reason:'insufficient' } — TIDAK membuat asumsi (PRD §30).

/**
 * @param {{rewardPerActivity?: number|null, activitiesPerDay?: number|null,
 *          minutesPerActivity?: number|null, daysPerWeek?: number}} input
 */
export function estimateEarnings({ rewardPerActivity, activitiesPerDay, minutesPerActivity, daysPerWeek = 7 }) {
  if (rewardPerActivity == null || activitiesPerDay == null || rewardPerActivity <= 0 || activitiesPerDay <= 0) {
    return { ok: false, reason: 'insufficient' }
  }
  const daily = rewardPerActivity * activitiesPerDay
  const weekly = daily * daysPerWeek
  const monthly = daily * 30 // bulan kalender 30 hari (asumsi tertulis)
  const perHour = minutesPerActivity != null && minutesPerActivity > 0
    ? (rewardPerActivity / minutesPerActivity) * 60
    : null
  return {
    ok: true,
    daily,
    weekly,
    monthly,
    perHour,
    assumptions: { rewardPerActivity, activitiesPerDay, minutesPerActivity, daysPerWeek, calendarDays: 30 },
  }
}

/** Nilai efektif per jam (untuk komponen Reward/Effort scoring) — hanya bila data cukup. */
export function rewardPerHour({ rewardPerActivity, minutesPerActivity }) {
  if (rewardPerActivity == null || minutesPerActivity == null || minutesPerActivity <= 0) return null
  return (rewardPerActivity / minutesPerActivity) * 60
}
