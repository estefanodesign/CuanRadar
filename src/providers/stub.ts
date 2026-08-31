// CuanRadar — Stub provider (BUILD 1 placeholder; BUILD 2 menghubungkan provider nyata)
import type { AIProvider, SearchProvider, SearchResult } from './types'

export class NotConfiguredError extends Error {
  constructor(what: string) {
    super(`${what} belum dikonfigurasi (hadir di BUILD 2)`)
    this.name = 'NotConfiguredError'
  }
}

export class StubSearchProvider implements SearchProvider {
  readonly name = 'stub-search'

  async search(_query: string): Promise<SearchResult[]> {
    throw new NotConfiguredError('SearchProvider')
  }
}

export class StubAIProvider implements AIProvider {
  readonly name = 'stub-ai'

  async complete(_prompt: string): Promise<string> {
    throw new NotConfiguredError('AIProvider')
  }
}

// Singleton stub — diganti provider nyata di BUILD 2 (deepseek / search free-tier).
export const searchProvider: SearchProvider = new StubSearchProvider()
export const aiProvider: AIProvider = new StubAIProvider()
