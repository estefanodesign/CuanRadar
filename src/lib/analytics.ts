// CuanRadar — Analytics (BUILD 5, opsional via PostHog)
// Tanpa VITE_POSTHOG_KEY → semua no-op. posthog-js dimuat DINAMIS (code-split) hanya saat key ada,
// sehingga tidak membebani bundle awal (perf, ARCHITECTURE §8).
const KEY = import.meta.env.VITE_POSTHOG_KEY as string | undefined
const HOST = (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ?? 'https://us.i.posthog.com'

let ready = false
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let ph: any = null

export async function initAnalytics(): Promise<void> {
  if (!KEY || ready) return
  try {
    const mod = await import('posthog-js')
    ph = mod
    mod.default.init(KEY, { api_host: HOST, capture_pageview: false, autocapture: false })
    ready = true
  } catch {
    /* analytics nonaktif — jangan crash */
  }
}

/** Catat event (no-op bila analytics nonaktif). */
export function capture(event: string, props?: Record<string, unknown>): void {
  if (!ready || !ph) return
  ph.default.capture(event, props)
}
