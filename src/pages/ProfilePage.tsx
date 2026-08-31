// CuanRadar — Profil (PRD §50; plan & auth)
import { Link } from '@tanstack/react-router'
import { getPlan, DEFAULT_PLAN, PLANS } from '../config/plans'
import { useAuth } from '../lib/auth'
import { SetupNotice } from '../components/SetupNotice'
import { formatIDR } from '../lib/format'

export function ProfilePage() {
  const { user, loading, configured } = useAuth()
  const plan = getPlan(DEFAULT_PLAN)

  if (!configured) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Profil</h1>
        <SetupNotice />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Profil</h1>
        <p className="text-sm text-slate-400">Memuat…</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Profil</h1>

      {!user ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-center">
          <p className="text-sm text-slate-300">Masuk untuk menyinkronkan simpanan & melacak cuan Anda.</p>
          <Link
            to="/app/login"
            className="mt-3 inline-block rounded-xl bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Masuk / Daftar
          </Link>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-sm font-semibold">{user.email}</p>
          <p className="mt-1 text-xs text-slate-400">Terdaftar via {user.app_metadata?.provider ?? 'email'}</p>
        </div>
      )}

      <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Plan Anda: {plan.name}</p>
            <p className="text-xs text-slate-400">
              ⚡ {plan.quickPerDay} quick/hari · 🔍 {plan.deepPerDay} deep/hari · ⚖️ {plan.compareOffers} compare
            </p>
          </div>
        </div>
        <div className="mt-3 space-y-2 border-t border-slate-800 pt-3">
          {PLANS.pro.priceMonthly ? (
            <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 px-3 py-2.5">
              <div>
                <p className="text-sm font-semibold text-emerald-300">Pro</p>
                <p className="text-[11px] text-slate-400">Unlimited tracker · alert real-time · kuota lebih besar</p>
              </div>
              <p className="text-sm font-bold text-emerald-300">{formatIDR(PLANS.pro.priceMonthly)}/bln</p>
            </div>
          ) : null}
          <p className="text-[11px] text-slate-600">
            Pembayaran (QRIS/e-wallet) & aktivasi otomatis hadir di Fase 2. Pro hanya membuka kapasitas — tidak pernah posisi ranking.
          </p>
        </div>
      </section>
    </div>
  )
}
