// CuanRadar — Saved apps (lokal sementara; sinkronisasi akun di Fase 2)
// BUILD 1: fitur simpan berfungsi lokal (localStorage) agar UX tervalidasi tanpa DB.

const KEY = 'cuanradar.saved.v1'

export function getSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : []
  } catch {
    return []
  }
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id)
}

export function toggleSaved(id: string): boolean {
  const current = getSavedIds()
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id]
  localStorage.setItem(KEY, JSON.stringify(next))
  return next.includes(id)
}
