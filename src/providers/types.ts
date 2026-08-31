// CuanRadar — Abstraksi provider (PRD §19–20, §23; AI_RULES §18 Maintainability)
// BUILD 1 mendefinisikan kontrak; implementasi nyata hadir di BUILD 2.
// Tujuan: tidak mengunci aplikasi pada satu provider (deepseek / search provider).

export interface SearchResult {
  title: string
  url: string
  snippet: string
}

export interface SearchProvider {
  readonly name: string
  search(query: string, opts?: { limit?: number }): Promise<SearchResult[]>
}

export interface AIProvider {
  readonly name: string
  complete(prompt: string, opts?: { maxTokens?: number }): Promise<string>
}

// Model routing (PRD §23): cheap → mid → premium. Implementasi di BUILD 2.
export type ModelTier = 'cheap' | 'mid' | 'premium'
