// CuanRadar — engine/cache.mjs (SERVER-SIDE, BUILD 3)
// Cache scan: key `country-category-scan_type-filter_hash` (PRD §36) + TTL (PRD §37).
// Implementasi file sederhana di .cache/ (gitignored) — cukup untuk pilot; swap ke Redis bila perlu.

import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

// Gunakan process.cwd() (root proyek saat via npm scripts) — relatif terbukti stabil
// di semua environment; simpan di .cache/ (gitignored).
const CACHE_DIR = join(process.cwd(), '.cache')

export const TTL_MS = {
  normal: 72 * 60 * 60 * 1000, // 72 jam
  popular: 24 * 60 * 60 * 1000, // 24 jam
  flash: 6 * 60 * 60 * 1000, // 6–24 jam
  expired: 0, // immediate
}

export function cacheKey({ country = 'ID', category, scanType, filters = {} }) {
  const hash = createHash('sha1').update(JSON.stringify(filters)).digest('hex').slice(0, 8)
  return `${country}:${category}:${scanType}:${hash}`
}

function pathOf(key) {
  // Windows: ':' & karakter lain ilegal di nama file → sanitasi semua kecuali alfanumerik/_/-
  const safe = key.replace(/[^a-zA-Z0-9_-]/g, '_')
  return join(CACHE_DIR, `${safe}.json`)
}

/** @returns {object|null} data cache bila masih segar; null bila tidak ada/kedaluwarsa */
export function getCache(key, ttlMs = TTL_MS.normal) {
  const file = pathOf(key)
  if (!existsSync(file)) return null
  const stat = statSync(file)
  const age = Date.now() - stat.mtimeMs
  if (age > ttlMs) return null // ttl 0 = langsung kedaluwarsa (PRD §37: expired → immediate)
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

export function setCache(key, data) {
  // Selalu coba mkdir (idempotent) — menghindari kondisi dir "ada" tapi belum siap tulis
  mkdirSync(CACHE_DIR, { recursive: true })
  writeFileSync(pathOf(key), JSON.stringify(data))
}

export function ageOf(key) {
  const file = pathOf(key)
  if (!existsSync(file)) return null
  return Date.now() - statSync(file).mtimeMs
}
