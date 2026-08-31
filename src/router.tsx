import { lazy, Suspense, type ReactNode } from 'react'
import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'

// Landing page (publik) & AppLayout (area aplikasi)
const LandingPage = lazy(() => import('./pages/LandingPage').then((m) => ({ default: m.LandingPage })))
const AppLayout = lazy(() => import('./components/AppLayout').then((m) => ({ default: m.AppLayout })))

// Code-split per halaman (budget JS awal < 150 kB gzip — ARCHITECTURE §8)
const DashboardPage = lazy(() => import('./pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ScanPage = lazy(() => import('./pages/ScanPage').then((m) => ({ default: m.ScanPage })))
const RewardsPage = lazy(() => import('./pages/RewardsPage').then((m) => ({ default: m.RewardsPage })))
const ComparePage = lazy(() => import('./pages/ComparePage').then((m) => ({ default: m.ComparePage })))
const SavedPage = lazy(() => import('./pages/SavedPage').then((m) => ({ default: m.SavedPage })))
const ProfilePage = lazy(() => import('./pages/ProfilePage').then((m) => ({ default: m.ProfilePage })))
const LoginPage = lazy(() => import('./pages/LoginPage').then((m) => ({ default: m.LoginPage })))

function AppSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<p className="py-10 text-center text-sm text-slate-500">Memuat…</p>}>{children}</Suspense>
}

const rootRoute = createRootRoute({
  component: () => (
    <AppSuspense>
      <Outlet />
    </AppSuspense>
  ),
})

const landingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })

const appRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AppLayout,
})

const appIndexRoute = createRoute({ getParentRoute: () => appRoute, path: '/', component: DashboardPage })
const appScanRoute = createRoute({ getParentRoute: () => appRoute, path: '/scan', component: ScanPage })
const appRewardsRoute = createRoute({ getParentRoute: () => appRoute, path: '/rewards', component: RewardsPage })
const appCompareRoute = createRoute({ getParentRoute: () => appRoute, path: '/compare', component: ComparePage })
const appSavedRoute = createRoute({ getParentRoute: () => appRoute, path: '/saved', component: SavedPage })
const appProfileRoute = createRoute({ getParentRoute: () => appRoute, path: '/profile', component: ProfilePage })
const appLoginRoute = createRoute({ getParentRoute: () => appRoute, path: '/login', component: LoginPage })

const routeTree = rootRoute.addChildren([
  landingRoute,
  appRoute.addChildren([
    appIndexRoute,
    appScanRoute,
    appRewardsRoute,
    appCompareRoute,
    appSavedRoute,
    appProfileRoute,
    appLoginRoute,
  ]),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
