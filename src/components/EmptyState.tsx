// CuanRadar — Empty state (PRD §58: aplikasi tetap berfungsi saat data kosong; tidak crash)
import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 px-6 py-10 text-center">
      <div className="text-2xl">🗂️</div>
      <p className="text-sm font-medium text-slate-200">{title}</p>
      {description ? <p className="max-w-xs text-xs text-slate-400">{description}</p> : null}
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  )
}
