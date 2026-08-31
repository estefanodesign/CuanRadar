// CuanRadar — engine/sufficiency.mjs
// Data sufficiency per cakupan scan (PRD §14 v1.1): per-kategori; "All" = 12.

export const MIN_PER_CATEGORY = { entertainment: 4, shopping: 4, wallet: 2, lainnya: 2 }
export const MIN_ALL = 12

/**
 * @param {Record<string, number>} counts jumlah platform valid per kategori
 * @param {'entertainment'|'shopping'|'wallet'|'lainnya'|'all'} category
 */
export function checkSufficiency(counts, category) {
  if (category === 'all') {
    const available = Object.keys(MIN_PER_CATEGORY).reduce((acc, k) => acc + (counts[k] ?? 0), 0)
    return { sufficient: available >= MIN_ALL, available, needed: MIN_ALL }
  }
  const min = MIN_PER_CATEGORY[category] ?? 0
  const available = counts[category] ?? 0
  return { sufficient: available >= min, available, needed: min }
}
