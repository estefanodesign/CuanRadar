// CuanRadar — ProvenanceBadge (PRD Appendix A9)
// Menampilkan asal hasil: database terverifikasi / cache / hasil baru — menunggu review.
import { Badge } from './Badge'

export type Provenance = 'database' | 'cache' | 'search_new'

const META: Record<Provenance, { label: string; tone: 'green' | 'amber' | 'slate'; title: string }> = {
  database: {
    label: 'Database terverifikasi',
    tone: 'green',
    title: 'Hasil berasal dari database yang telah diverifikasi dan dikurasi.',
  },
  cache: {
    label: 'Dari cache',
    tone: 'slate',
    title: 'Hasil disajikan dari cache yang masih valid (belum kedaluwarsa TTL).',
  },
  search_new: {
    label: 'Hasil baru — menunggu review',
    tone: 'amber',
    title: 'Ditemukan oleh scan terbaru; belum dipublikasikan hingga melewati review queue (PRD Appendix A6).',
  },
}

export function ProvenanceBadge({ provenance }: { provenance: Provenance }) {
  const meta = META[provenance]
  return (
    <Badge tone={meta.tone} title={meta.title}>
      {meta.label}
    </Badge>
  )
}
