// CuanRadar — Theme provider (light / dark / system)
// Menempel class `dark` pada <html>, persist ke localStorage, dan ikuti preferensi OS saat mode 'system'.
// Token CSS sudah ada (design-system.css :root / :root.dark) — di sini hanya mekanisme aktivasi.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'cuanradar.theme.v1'

interface ThemeState {
  mode: ThemeMode
  /** Resolved theme yang aktif sekarang (light/dark) — untuk komponen ikon & ARIA. */
  resolved: 'light' | 'dark'
  setMode: (m: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeState | null>(null)

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches === true
}

function resolve(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') return systemPrefersDark() ? 'dark' : 'light'
  return mode
}

function applyToDom(resolved: 'light' | 'dark') {
  const root = document.documentElement
  if (resolved === 'dark') root.classList.add('dark')
  else root.classList.remove('dark')
  // Sinkronkan meta theme-color (browser chrome) agar konsisten dengan chassis.
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', resolved === 'dark' ? '#1f2329' : '#e0e5ec')
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof localStorage === 'undefined') return 'system'
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : 'system'
  })

  const [resolved, setResolved] = useState<'light' | 'dark'>(() => resolve(mode))

  useEffect(() => {
    setResolved(resolve(mode))
    applyToDom(resolve(mode))
  }, [mode])

  // Ikuti perubahan preferensi OS hanya saat mode = 'system'.
  useEffect(() => {
    if (mode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolved(resolve('system'))
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [mode])

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m)
    try {
      localStorage.setItem(STORAGE_KEY, m)
    } catch {
      /* localStorage penuh/blocked — abaikan, tetap in-memory */
    }
  }, [])

  const toggle = useCallback(() => {
    setMode(resolve(mode) === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  const value = useMemo<ThemeState>(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeState {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
