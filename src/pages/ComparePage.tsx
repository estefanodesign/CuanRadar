// CuanRadar — Compare (PRD Appendix A5; kuota per plan: Free 4 / Pro 8 / Pro+ 16)
import { useState } from 'react'
import { getPlan, DEFAULT_PLAN } from '../config/plans'
import { getSeedPlatforms, getSeedPlatformById } from '../lib/seed'
import { CATEGORY_LABELS, getPayoutMethodLabel, getRiskLabel, getVerificationLabel } from '../lib/format'
import { EmptyState } from '../components/EmptyState'

export function ComparePage() {
  const plan = getPlan(DEFAULT_PLAN)
  const platforms = getSeedPlatforms()
  const [selected, setSelected] = useState<string[]>([])

  const toggle = (id: string) => {
    setSelected((cur) => {
      if (cur.includes(id)) return cur.filter((x) => x !== id)
      if (cur.length >= plan.compareOffers) return cur
      return [...cur, id]
    })
  }

  const items = selected.map((id) => getSeedPlatformById(id)).filter((p): p is NonNullable<typeof p> => Boolean(p))

  return (
    <div className="space-y-4">
      <section>
        <h1 className="text-xl font-bold">Compare</h1>
        <p className="text-sm text-slate-400">
          Bandingkan hingga {plan.compareOffers} aplikasi (batas plan {plan.name}).
        </p>
      </section>

      <div className="flex flex-wrap gap-1.5">
        {platforms.map((p) => {
          const active = selected.includes(p.id)
          const disabled = !active && selected.length >= plan.compareOffers
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => toggle(p.id)}
              disabled={disabled}
              className={`rounded-full border px-3 py-1 text-xs transition ${
                active
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                  : disabled
                    ? 'cursor-not-allowed border-slate-800 text-slate-600'
                    : 'border-slate-700 bg-slate-900 text-slate-300'
              }`}
            >
              {p.name}
            </button>
          )
        })}
      </div>

      {items.length === 0 ? (
        <EmptyState title="Pilih aplikasi untuk dibandingkan" description={`Anda dapat memilih hingga ${plan.compareOffers} aplikasi sekaligus.`} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full min-w-[560px] text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60">
                <th className="px-3 py-2 font-medium text-slate-500">Aspek</th>
                {items.map((p) => (
                  <th key={p.id} className="px-3 py-2 font-semibold text-slate-200">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {[
                { label: 'Kategori', render: (id: string) => CATEGORY_LABELS[getSeedPlatformById(id)?.category ?? 'lainnya'] },
                { label: 'Reward', render: (id: string) => getSeedPlatformById(id)?.reward_types.join(', ') ?? '—' },
                { label: 'Payout', render: (id: string) => (getSeedPlatformById(id)?.payout_methods ?? []).map(getPayoutMethodLabel).join(', ') || '—' },
                { label: 'Verifikasi', render: (id: string) => getVerificationLabel(getSeedPlatformById(id)?.verification_status ?? 'unverified') },
                { label: 'Risiko', render: (id: string) => getRiskLabel(getSeedPlatformById(id)?.risk_level ?? 'sedang') },
                { label: 'Terverif', render: (id: string) => getSeedPlatformById(id)?.last_verified_at.slice(0, 10) ?? '—' },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="px-3 py-2 font-medium text-slate-500">{row.label}</td>
                  {items.map((p) => (
                    <td key={p.id} className="px-3 py-2 text-slate-300">
                      {row.render(p.id)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
