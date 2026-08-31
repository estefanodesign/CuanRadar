// CuanRadar — GovernorBanner (PRD §41)
// Menampilkan status Budget Governor di UI agar pengguna paham kenapa hasil kadang dari cache / Deep Scan dibatasi.
import type { GovernorState } from '../lib/scanCredits'
import { governorLabel } from '../lib/scanCredits'

export function GovernorBanner({ governor }: { governor: GovernorState }) {
  // Saat normal & tidak diketahui → tidak perlu banner (hindari noise).
  if (governor.tier === 'normal') return null

  const styles: Record<string, string> = {
    more_caching: 'border-slate-700 bg-slate-900/60 text-slate-300',
    limit_deep: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    emergency: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    no_new_deep: 'border-red-500/40 bg-red-500/10 text-red-300',
  }

  return (
    <div className={`rounded-xl border px-3 py-2 text-xs leading-relaxed ${styles[governor.tier]}`}>
      <span className="font-semibold">🛡️ Budget Governor — {governorLabel(governor.tier)}</span>
      <span className="ml-1 opacity-80">
        {governor.tier === 'more_caching' && 'Hasil diprioritaskan dari cache untuk menghemat biaya.'}
        {governor.tier === 'limit_deep' && 'Deep Scan dibatasi sementara; Quick Scan dari database tetap berjalan.'}
        {governor.tier === 'emergency' && 'Mode hemat penuh: hasil dari cache/database saja.'}
        {governor.tier === 'no_new_deep' && 'Tidak ada Deep Scan baru — hasil dari database/cache.'}
      </span>
      {governor.usedPercent != null ? <span className="ml-1 opacity-60">({governor.usedPercent}%)</span> : null}
    </div>
  )
}
