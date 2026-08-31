// CuanRadar — Badge status (verifikasi & risiko; dua sumbu ditampilkan terpisah — PRD §28, Appendix A1)
import type { ReactNode } from 'react'

type Tone = 'green' | 'amber' | 'red' | 'slate'

const TONES: Record<Tone, string> = {
  green: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  red: 'bg-red-500/15 text-red-300 border-red-500/30',
  slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

interface BadgeProps {
  tone: Tone
  children: ReactNode
  title?: string
}

export function Badge({ tone, children, title }: BadgeProps) {
  return (
    <span
      title={title}
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  )
}
