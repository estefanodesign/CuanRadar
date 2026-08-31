// CuanRadar — Loader data seed (data/seed-platforms.json, kurasi manual F0)
import seedRaw from '../../data/seed-platforms.json'
import type { Platform } from '../types'

// Seed JSON = kurasi manual F0; risk_level masih ESTIMASI awal (bukan hasil rubrik final).
// Saat Supabase terhubung (F1), data ini dipindah ke tabel reward_apps via scripts/seed-supabase.mjs.
interface SeedFile {
  meta: { version: number; country: string; generated_at: string }
  platforms: Platform[]
}

const seed: SeedFile = seedRaw as unknown as SeedFile

export function getSeedPlatforms(): Platform[] {
  return seed.platforms
}

export function getSeedPlatformById(id: string): Platform | undefined {
  return seed.platforms.find((p) => p.id === id)
}

export function getSeedMeta(): { version: number; generated_at: string } {
  return { version: seed.meta.version, generated_at: seed.meta.generated_at }
}
