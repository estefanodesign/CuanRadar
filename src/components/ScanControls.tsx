// CuanRadar — Kontrol Scan (PRD §52): tipe scan + kategori
import type { Category } from '../types'

export type ScanType = 'quick' | 'deep'

interface ScanControlsProps {
  scanType: ScanType
  onScanTypeChange: (t: ScanType) => void
  category: Category | 'all'
  onCategoryChange: (c: Category | 'all') => void
}

const CATEGORY_OPTIONS: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'wallet', label: 'Wallet' },
  { value: 'lainnya', label: 'Kategori lain' },
]

export function ScanControls({ scanType, onScanTypeChange, category, onCategoryChange }: ScanControlsProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        {(['quick', 'deep'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onScanTypeChange(t)}
            className={`flex min-h-11 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
              scanType === t
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-700 bg-slate-900 text-slate-300'
            }`}
          >
            {t === 'quick' ? '⚡ Quick Scan' : '🔍 Deep Scan'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {CATEGORY_OPTIONS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => onCategoryChange(c.value)}
            className={`rounded-full border px-3 py-1 text-xs transition ${
              category === c.value
                ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                : 'border-slate-700 bg-slate-900 text-slate-400'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}
