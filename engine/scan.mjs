// CuanRadar — engine/scan.mjs
// Orkestrator scan (PRD §11–18): database-first → cache-first → AI-second → search-on-demand.
// Limit keras per PRD §13 (Quick) & §18 (Deep); state & biaya dicatat (PRD §43).
import { getAIProvider, getSearchProvider, SEARCH_QUERIES } from './providers.mjs'
import { checkSufficiency } from './sufficiency.mjs'
import { extractRewardApps } from './extraction.mjs'

export const LIMITS = {
  quick: { searchQueries: 2, rawCandidates: 10, extraction: 7, verification: 3, aiRetries: 1 },
  deep: { searchQueries: 6, rawCandidates: 30, afterFilter: 10, verification: 5, premiumVerification: 2, aiRetries: 2 },
}

function dedupByDomain(items) {
  const seen = new Set()
  const out = []
  for (const it of items) {
    const key = String(it.name || '').toLowerCase().trim()
    if (key && !seen.has(key)) {
      seen.add(key)
      out.push(it)
    }
  }
  return out
}

async function discovery({ category, deep }) {
  const search = getSearchProvider()
  const ai = getAIProvider()
  const limits = deep ? LIMITS.deep : LIMITS.quick
  const queries = category === 'all' ? Object.values(SEARCH_QUERIES) : [SEARCH_QUERIES[category] ?? SEARCH_QUERIES.lainnya]
  const usedQueries = queries.slice(0, limits.searchQueries)

  const stats = { searchRequests: 0, aiRequests: 0, rawCandidates: 0, candidates: 0 }

  const rawResults = []
  for (const q of usedQueries) {
    stats.searchRequests += 1
    const results = await search.search(q, { limit: deep ? 10 : 5 })
    rawResults.push(...results)
    if (rawResults.length >= limits.rawCandidates) break
  }
  stats.rawCandidates = rawResults.length

  const apps = await extractRewardApps(ai, rawResults, { retries: limits.aiRetries, tier: 'cheap' })
  stats.aiRequests += 1

  const candidates = dedupByDomain(apps).slice(0, deep ? limits.afterFilter : limits.extraction)
  stats.candidates = candidates.length

  return { candidates, stats, source: 'search' }
}

/**
 * Quick Scan (PRD §11): DB-first — tidak menyentuh search/AI bila data cukup.
 * @param {{category: string, counts: Record<string, number>}} input
 */
export async function runQuickScan({ category, counts }) {
  const sufficiency = checkSufficiency(counts, category)
  if (sufficiency.sufficient) {
    return { source: 'database', state: 'cache_completed', sufficiency, candidates: [], stats: { searchRequests: 0, aiRequests: 0 } }
  }
  const result = await discovery({ category, deep: false })
  return { ...result, state: 'completed', sufficiency }
}

/** Deep Scan (PRD §17): discovery penuh untuk peluang baru. */
export async function runDeepScan({ category }) {
  return discovery({ category, deep: true })
}
