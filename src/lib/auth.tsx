// CuanRadar — Auth context (Supabase Auth; graceful saat Supabase belum dikonfigurasi)
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'

interface AuthState {
  user: User | null
  loading: boolean
  configured: boolean
}

const AuthContext = createContext<AuthState>({ user: null, loading: false, configured: false })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: isSupabaseConfigured(),
    configured: isSupabaseConfigured(),
  })

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) {
      setState({ user: null, loading: false, configured: false })
      return
    }
    let mounted = true
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (mounted) setState({ user: data.session?.user ?? null, loading: false, configured: true })
      })
      .catch(() => {
        if (mounted) setState({ user: null, loading: false, configured: true })
      })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState({ user: session?.user ?? null, loading: false, configured: true })
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  return useContext(AuthContext)
}
