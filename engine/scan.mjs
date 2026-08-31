// CuanRadar — engine/scan.mjs (SERVER-SIDE, BUILD 3)
// Orkestrator scan (PRD §11–18): cache-first → database-first → AI-second → search-on-demand.
// Limit keras per PRD §13 (Quick) & §18 (Deep); budget (PRD §40–41); biaya dicatat (PRD §43).
import { getAIProvider, getSearchProvider, SEARCH_QUERIES } from './providers.mjs'
import { checkSufficiency } from './sufficiency.mjs'
import { extractRewardApps } from './extraction.mjs'
import { cacheKey, getCache, setCache, TTL_MS } from './cache.mjs'
import { BudgetGovernor, estimateLlmCost, estimateSearchCost } from './budget.mjs'
import { scorePlatform } from './scoring.mjs'

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

function normalizeName(s) {
  return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function estimateTokens(text) {
  return Math.ceil(String(text || '').length / 4)
}

/**
 * Quick Scan (PRD §11): cache → DB sufficiency → (bila kurang) discovery terbatas.
 * @param {{category: string, counts: Record<string, number>, existingNames?: string[], filters?: object}} input
 */
export async function runQuickScan({ category, counts, existingNames = [], filters = {} }) {
  const key = cacheKey({ category, scanType: 'quick', filters })
  const cached = getCache(key, TTL_MS.normal)
  if (cached) {
    return {
      ...cached,
      source: 'cache',
      state: 'cache_completed',
      sufficiency: checkSufficiency(counts, category),
    }
  }

  const sufficiency = checkSufficiency(counts, category)
  if (sufficiency.sufficient) {
    const result = {
      source: 'database',
      state: 'cache_completed',
      sufficiency,
      candidates: [],
      stats: { searchRequests: 0, aiRequests: 0, costLlmUsd: 0, costSearchUsd: 0 },
    }
    setCache(key, result)
    return result
  }
  return discovery({ category, deep: false, existingNames })
}

/** Deep Scan (PRD §17): discovery penuh; dicekal oleh Budget Governor bila perlu (PRD §41). */
export async function runDeepScan({ category, existingNames = [], governor }) {
  const status = (governor ?? new BudgetGovernor()).status()
  if (!status.canDeepScan) {
    return {
      source: 'database',
      state: 'limited',
      reason: `Budget Governor: ${status.mode} (${status.totalPct}%)`,
      candidates: [],
      stats: { searchRequests: 0, aiRequests: 0, costLlmUsd: 0, costSearchUsd: 0 },
      budget: status,
    }
  }
  return discovery({ category, deep: true, existingNames, budget: status })
}

async function discovery({ category, deep, existingNames = [], budget }) {
  const search = getSearchProvider()
  const ai = getAIProvider()
  const limits = deep ? LIMITS.deep : LIMITS.quick
  const queries = category === 'all' ? Object.values(SEARCH_QUERIES) : [SEARCH_QUERIES[category] ?? SEARCH_QUERIES.lainnya]
  const usedQueries = queries.slice(0, limits.searchQueries)

  let inputTokens = 0
  let outputTokens = 0
  const rawResults = []
  for (const q of usedQueries) {
    const results = await search.search(q, { limit: deep ? 10 : 5 })
    rawResults.push(...results)
    if (rawResults.length >= limits.rawCandidates) break
  }

  const promptSource = rawResults.map((r) => `${r.title}\n${r.url}\n${r.snippet || ''}`).join('\n')
  inputTokens += estimateTokens(promptSource)
  const apps = await extractRewardApps(ai, rawResults, { retries: limits.aiRetries, tier: 'cheap' })
  outputTokens += estimateTokens(JSON.stringify(apps))

  // Dedup antar-kandidat + terhadap katalog yang sudah ada (BUILD 3: hindari duplikat Melolo/ReelRich)
  const existing = new Set(existingNames.map(normalizeName))
  const deduped = dedupByDomain(apps)
    .filter((c) => !existing.has(normalizeName(c.name)))
    .slice(0, deep ? limits.afterFilter : limits.extraction)

  // Skor deterministik per kandidat (server = sumber kebenaran; client hanya fallback)
  const candidates = deduped.map((c) => ({ ...c, score: scorePlatform(c).score }))

  const stats = {
    searchRequests: usedQueries.length,
    aiRequests: 1,
    inputTokens,
    outputTokens,
    costLlmUsd: Math.round(estimateLlmCost({ inputTokens, outputTokens }) * 1000000) / 1000000,
    costSearchUsd: Math.round(estimateSearchCost(usedQueries.length) * 1000000) / 1000000,
    rawCandidates: rawResults.length,
    candidates: candidates.length,
  }

  return { candidates, stats, source: 'search', budget }
}
