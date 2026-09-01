// CuanRadar — AppLayout (area aplikasi, PRD §50)
// Responsive penuh: desktop (md+) = sidebar kiri; mobile = top header + bottom nav.
import { Suspense, useEffect } from 'react'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useScanCredits } from '../lib/scanCredits'
import { useAuth } from '../lib/auth'
import { capture } from '../lib/analytics'

const NAV = [
  { path: '/app', label: 'Dashboard', icon: '🏠' },
  { path: '/app/scan', label: 'Scan', icon: '📡' },
  { path: '/app/rewards', label: 'Rewards', icon: '🎁' },
  { path: '/app/compare', label: 'Compare', icon: '⚖️' },
  { path: '/app/saved', label: 'Saved', icon: '🔖' },
  { path: '/app/profile', label: 'Profil', icon: '👤' },
] as const

function NavList({ pathname }: { pathname: string }) {
  return (
    <>
      {NAV.map((n) => {
        const active = pathname === n.path
        return (
          <Link
            key={n.path}
            to={n.path}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active ? 'bg-emerald-500/15 text-emerald-300' : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <span className="text-base">{n.icon}</span>
            <span>{n.label}</span>
          </Link>
        )
      })}
    </>
  )
}

export function AppLayout() {
  const { user, configured } = useAuth()
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const { credits } = useScanCredits()

  useEffect(() => {
    capture('page_view', { path: pathname })
  }, [pathname])

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-slate-950 p-4 md:flex">
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-base">📡</span>
          <span className="text-sm font-bold tracking-tight">CuanRadar</span>
        </Link>
        <nav className="mt-6 flex-1 space-y-1">
          <NavList pathname={pathname} />
        </nav>
        <div className="space-y-2 border-t border-slate-800 pt-3">
          <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs">
            <p className="text-slate-400">Plan {credits.plan}</p>
            <p className="font-semibold text-slate-200">
              ⚡ {credits.quickRemaining}/hari · 🔍 {credits.deepRemaining}/hari
            </p>
          </div>
          <Link to="/" className="block rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:text-slate-300">
            ← Beranda (landing)
          </Link>
        </div>
      </aside>

      <div className="md:pl-64">
        {/* Header mobile */}
        <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/90 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-md items-center justify-between px-4 py-3">
            <Link to="/app" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-base">📡</span>
              <span className="text-sm font-bold tracking-tight">CuanRadar</span>
            </Link>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-slate-300">{credits.plan}</span>
              {configured && user ? (
                <span className="max-w-[8rem] truncate text-slate-400">{user.email}</span>
              ) : (
                <Link to="/app/login" className="text-emerald-300 hover:text-emerald-200">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Top bar desktop */}
        <header className="hidden items-center justify-between border-b border-slate-800 px-8 py-3 md:flex">
          <p className="text-sm text-slate-400">
            Plan <span className="font-semibold text-slate-200">{credits.plan}</span> · ⚡ {credits.quickRemaining} quick/hari · 🔍{' '}
            {credits.deepRemaining} deep/hari
          </p>
          <div className="flex items-center gap-3 text-xs">
            {configured && user ? (
              <span className="max-w-[16rem] truncate text-slate-400">{user.email}</span>
            ) : (
              <Link to="/app/login" className="rounded-lg border border-slate-700 px-3 py-1.5 text-slate-200 transition hover:border-slate-500">
                Masuk
              </Link>
            )}
          </div>
        </header>

        <main className="mx-auto max-w-md px-4 pb-28 pt-4 md:max-w-3xl md:px-8 md:pb-10">
          <Suspense fallback={<p className="py-10 text-center text-sm text-slate-500">Memuat…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-800 bg-slate-950/95 backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-6">
          {NAV.map((n) => (
            <Link
              key={n.path}
              to={n.path}
              className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] transition ${
                pathname === n.path ? 'text-emerald-300' : 'text-slate-500'
              }`}
            >
              <span className="text-base leading-none">{n.icon}</span>
              <span>{n.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
