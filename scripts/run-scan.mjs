// CuanRadar — CLI scan (server-side; BUILD 2)
// Usage:
//   npm run scan:quick -- --category shopping          # Quick Scan (DB-first)
//   npm run scan:deep -- --category shopping           # Deep Scan (discovery penuh)
//   tambah --save untuk mengirim kandidat ke review_queue_items (Supabase)
// Env yang dibaca (dari .env): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEARCH_PROVIDER,
// SEARCH_API_KEY, DEEPSEEK_API_KEY (lihat .env.example).
import { runQuickScan, runDeepScan, LIMITS } from '../engine/scan.mjs'
import { getSearchProvider, getAIProvider } from '../engine/providers.mjs'
import { createClient } from '@supabase/supabase-js'

const args = process.argv.slice(2)
const typeIndex = args.indexOf('--type')
const typeArg = typeIndex >= 0 ? args[typeIndex + 1] : undefined
const type = typeArg === 'deep' || args.includes('--deep') ? 'deep' : 'quick'
const category = (args[args.indexOf('--category') + 1] ?? 'shopping').toLowerCase()
const save = args.includes('--save')

const VALID_CATEGORIES = ['entertainment', 'shopping', 'wallet', 'lainnya', 'all']
if (!VALID_CATEGORIES.includes(category)) {
  console.error(`Kategori tidak valid: ${category}. Pilih: ${VALID_CATEGORIES.join(', ')}`)
  process.exit(1)
}

// Cek ketersediaan provider (pesan jelas bila kunci belum diisi)
try {
  getSearchProvider()
  getAIProvider()
} catch (err) {
  console.error(`\n[PERINGATAN] ${err.message}\n(Scan tetap berjalan — bagian yang butuh provider akan gagal dengan jelas.)`)
}

// Hitung sufficiency dari database (PRD §14 v1.1)
async function fetchCounts() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (isi .env)')
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase.from('reward_apps').select('category')
  if (error) throw error
  const counts = { entertainment: 0, shopping: 0, wallet: 0, lainnya: 0 }
  for (const row of data ?? []) {
    if (row.category in counts) counts[row.category] += 1
  }
  return counts
}

async function main() {
  console.log(`\n=== CuanRadar Scan (${type}) — kategori: ${category} ===`)
  const counts = await fetchCounts()
  console.log(`Data saat ini:`, counts, `(All: ${Object.values(counts).reduce((a, b) => a + b, 0)})`)

  const result =
    type === 'quick' ? await runQuickScan({ category, counts }) : await runDeepScan({ category })

  console.log(`\nState: ${result.state ?? 'completed'} · Sumber: ${result.source} · Search: ${result.stats?.searchRequests ?? 0} · AI: ${result.stats?.aiRequests ?? 0}`)
  if (result.sufficiency) {
    console.log(`Kecukupan: ${result.sufficiency.available}/${result.sufficiency.needed} — ${result.sufficiency.sufficient ? 'CUKUP (hasil dari database)' : 'KURANG (discovery)'}`)
  }
  if (result.candidates?.length) {
    console.log(`\nKandidat (${result.candidates.length}):`)
    for (const c of result.candidates) {
      console.log(`- ${c.name} [${c.category}] reward: ${c.reward_types.join(', ') || '—'} payout: ${c.payout_methods.join(', ') || '—'}`)
    }
  } else if (result.source === 'database') {
    console.log('\nData database cukup — Quick Scan selesai tanpa search/AI (database-first, PRD §11).')
  } else {
    console.log('\nTidak ada kandidat baru ditemukan (jangan mengarang — PRD §13/§18).')
  }

  if (save && result.candidates?.length) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabase = createClient(url, key, { auth: { persistSession: false } })
    let ok = 0
    for (const c of result.candidates) {
      const { error } = await supabase.from('review_queue_items').insert({
        kind: 'app',
        payload: c,
        status: 'baru',
      })
      if (error) console.error(`Gagal simpan ${c.name}: ${error.message}`)
      else ok += 1
    }
    console.log(`\nReview queue: ${ok} kandidat disimpan (menunggu tinjauan — PRD Appendix A6).`)
  } else if (save) {
    console.log('\nTidak ada kandidat untuk disimpan.')
  }
}

main().catch((err) => {
  console.error(`\n[GAGAL] ${err.message}`)
  process.exitCode = 1
})
