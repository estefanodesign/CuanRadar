// CuanRadar — Supabase client (graceful saat belum dikonfigurasi)
// Kredensial dari env: VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (client-safe, PRD §48 / AI_RULES §9).
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anonKey)
}

export const supabase: SupabaseClient | null = isSupabaseConfigured() ? createClient(url!, anonKey!) : null
