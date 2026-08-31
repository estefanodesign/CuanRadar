// CuanRadar — Login (Supabase Auth: email OTP + Google OAuth; PRD §48, AI_RULES §9)
import { useState, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { SetupNotice } from '../components/SetupNotice'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  if (!isSupabaseConfigured() || !supabase) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold">Masuk</h1>
        <SetupNotice />
      </div>
    )
  }

  async function handleEmail(e: FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setStatus('sending')
    setError(null)
    const { error: err } = await supabase.auth.signInWithOtp({ email })
    if (err) {
      setStatus('error')
      setError(err.message)
    } else {
      setStatus('sent')
    }
  }

  async function handleGoogle() {
    if (!supabase) return
    const { error: err } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } })
    if (err) {
      setStatus('error')
      setError(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="text-xl font-bold">Masuk ke CuanRadar</h1>
      <p className="text-sm text-slate-400">Simpan aplikasi favorit dan lacak cuan Anda. Gratis.</p>

      <form onSubmit={handleEmail} className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <label htmlFor="email" className="block text-xs font-medium text-slate-400">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nama@email.com"
          className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
        >
          {status === 'sending' ? 'Mengirim…' : 'Kirim kode masuk (OTP)'}
        </button>
        {status === 'sent' ? (
          <p className="text-xs text-emerald-300">Kode masuk terkirim ke email Anda. Periksa inbox & masukkan kode via tautan.</p>
        ) : null}
        {status === 'error' && error ? <p className="text-xs text-red-300">{error}</p> : null}
      </form>

      <div className="flex items-center gap-3 text-xs text-slate-600">
        <div className="h-px flex-1 bg-slate-800" />
        atau
        <div className="h-px flex-1 bg-slate-800" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm font-medium text-slate-200 transition hover:border-slate-500"
      >
        Lanjutkan dengan Google
      </button>

      <p className="text-[11px] text-slate-600">
        CuanRadar tidak pernah meminta password, OTP, atau PIN aplikasi lain (PRD §48).
      </p>
      <button
        type="button"
        onClick={() => void navigate({ to: '/app' })}
        className="text-xs text-emerald-300 hover:text-emerald-200"
      >
        ← Kembali ke Dashboard
      </button>
    </div>
  )
}
