// CuanRadar — CLI scan (server-side; BUILD 2–3)
// Usage:
//   npm run scan:quick -- --category shopping          # Quick Scan (cache → DB → discovery terbatas)
//   npm run scan:deep -- --category shopping           # Deep Scan (discovery penuh, budget gate)
//   tambah --save untuk mengirim kandidat ke review_queue_items (Supabase)
//   tambah --history untuk mencatat scan_history (dibaca UI useScanPoll)
// Env (dari .env): SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SEARCH_PROVIDER, SEARCH_API_KEY, DEEPSEEK_API_KEY.
import { runQuickScan, runDeepScan } from '../engine/scan.mjs'
import { getSearchProvider, getAIProvider } from '../engine/providers.mjs'
import { BudgetGovernor } from '../engine/budget.mjs'
import { createClient } from '@supabase/supabase-js'

const args = process.argv.slice(2)
const typeIndex = args.indexOf('--type')
const typeArg = typeIndex >= 0 ? args[typeIndex + 1] : undefined
const type = typeArg === 'deep' || args.includes('--deep') ? 'deep' : 'quick'
const category = (args[args.indexOf('--category') + 1] ?? 'shopping').toLowerCase()
const save = args.includes('--save')
const history = args.includes('--history')

const VALID_CATEGORIES = ['entertainment', 'shopping', 'wallet', 'lainnya', 'all']
if (!VALID_CATEGORIES.includes(category)) {
  console.error(`Kategori tidak valid: ${category}. Pilih: ${VALID_CATEGORIES.join(', ')}`)
  process.exit(1)
}

try {
  getSearchProvider()
  getAIProvider()
} catch (err) {
  console.error(`\n[PERINGATAN] ${err.message}`)
}

async function fetchCatalog() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (isi .env)')
  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase.from('reward_apps').select('category,name,slug')
  if (error) throw error
  const counts = { entertainment: 0, shopping: 0, wallet: 0, lainnya: 0 }
  const existingNames = []
  for (const row of data ?? []) {
    if (row.category in counts) counts[row.category] += 1
    existingNames.push(row.name, row.slug)
  }
  return { counts, existingNames, supabase }
}

async function main() {
  console.log(`\n=== CuanRadar Scan (${type}) — kategori: ${category} ===`)
  const { counts, existingNames, supabase } = await fetchCatalog()
  console.log(`Data saat ini:`, counts, `(All: ${Object.values(counts).reduce((a, b) => a + b, 0)})`)

  const governor = new BudgetGovernor()
  const result =
    type === 'quick'
      ? await runQuickScan({ category, counts, existingNames })
      : await runDeepScan({ category, existingNames, governor })

  console.log(`\nState: ${result.state ?? 'completed'} · Sumber: ${result.source}`)
  if (result.reason) console.log(`Alasan: ${result.reason}`)
  if (result.sufficiency) {
    console.log(`Kecukupan: ${result.sufficiency.available}/${result.sufficiency.needed} — ${result.sufficiency.sufficient ? 'CUKUP (hasil dari database)' : 'KURANG (discovery)'}`)
  }
  const s = result.stats ?? {}
  console.log(`Search: ${s.searchRequests ?? 0} · AI: ${s.aiRequests ?? 0} · Cost LLM: $${s.costLlmUsd ?? 0} · Search: $${s.costSearchUsd ?? 0}`)

  const budgetStatus = result.budget ?? governor.status()
  console.log(`Budget Governor: ${budgetStatus.mode} (${budgetStatus.totalPct}% — LLM ${budgetStatus.llmPct}% / Search ${budgetStatus.searchPct}%)`)

  if (result.candidates?.length) {
    console.log(`\nKandidat (${result.candidates.length}):`)
    for (const c of result.candidates) {
      console.log(`- ${c.name} [${c.category}] skor:${c.score ?? '—'} reward: ${c.reward_types.join(', ') || '—'} payout: ${c.payout_methods.join(', ') || '—'}`)
    }
  } else if (result.source === 'database' || result.source === 'cache') {
    console.log('\nData cukup — selesai tanpa search/AI (cache/database-first, PRD §11/§37).')
  } else {
    console.log('\nTidak ada kandidat baru (dedup vs katalog: X dicegah) — tidak mengarang (PRD §13/§18).')
  }

  // Catat scan_history agar UI (useScanPoll) melihat state nyata
  if (history) {
    const { error } = await supabase.from('scan_history').insert({
      scan_type: type,
      category: category === 'all' ? null : category,
      state: result.state ?? 'completed',
      credits_used: type === 'quick' ? 1 : 5,
      cost_llm_usd: s.costLlmUsd ?? 0,
      cost_search_usd: s.costSearchUsd ?? 0,
      cache_hit: result.source === 'cache',
      candidates: s.candidates ?? 0,
    })
    if (error) console.error(`Gagal catat scan_history: ${error.message}`)
    else console.log('\nscan_history tercatat (state: ' + (result.state ?? 'completed') + ').')
  }

  if (save && result.candidates?.length) {
    let ok = 0
    for (const c of result.candidates) {
      const { error } = await supabase.from('review_queue_items').insert({ kind: 'app', payload: c, status: 'baru' })
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
