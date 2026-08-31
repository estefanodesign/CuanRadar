// CuanRadar — Seed katalog ke Supabase (BUILD 1)
// Jalankan SETELAH migrasi 0001_init.sql & isi env:
//   SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (server-side only — JANGAN dipakai di frontend; AI_RULES §9)
// Usage: npm run db:seed
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !key) {
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY. Salin .env.example → .env dan isi.')
  process.exit(1)
}

const supabase = createClient(url, key, { auth: { persistSession: false } })
const seed = JSON.parse(readFileSync(join(__dirname, '..', 'data', 'seed-platforms.json'), 'utf8'))

let ok = 0
let fail = 0
for (const p of seed.platforms) {
  const row = {
    slug: p.slug,
    name: p.name,
    category: p.category,
    developer: p.developer,
    website: p.website,
    google_play: p.google_play,
    app_store: p.app_store,
    country: 'ID',
    status: p.status,
    reward_types: p.reward_types,
    payout_methods: p.payout_methods,
    min_payout_idr: p.min_payout_idr,
    risk_level: p.risk_level,
    verification_status: p.verification_status,
    notes: p.notes,
    last_verified_at: p.last_verified_at,
  }
  const { error } = await supabase.from('reward_apps').upsert(row, { onConflict: 'slug' })
  if (error) {
    fail += 1
    console.error(`GAGAL ${p.slug}: ${error.message}`)
  } else {
    ok += 1
    console.log(`OK ${p.slug}`)
  }
}

console.log(`\nSelesai: ${ok} berhasil, ${fail} gagal (total ${seed.platforms.length}).`)
if (fail > 0) process.exitCode = 1
