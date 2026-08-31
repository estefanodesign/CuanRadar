// CuanRadar — Notifikasi konfigurasi Supabase (dipakai saat env belum diisi)
export function SetupNotice() {
  return (
    <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-4 text-left">
      <p className="text-sm font-semibold text-sky-200">Supabase belum dikonfigurasi</p>
      <p className="mt-1 text-xs leading-relaxed text-sky-200/80">
        Fitur akun (auth, simpan, riwayat) aktif setelah project Supabase dibuat dan env diisi:
      </p>
      <ol className="mt-2 list-decimal space-y-1 pl-4 text-xs text-sky-200/80">
        <li>Buat project di supabase.com, salin URL & anon key ke <code className="rounded bg-slate-900 px-1">.env.local</code> (<code className="rounded bg-slate-900 px-1">VITE_SUPABASE_URL</code>, <code className="rounded bg-slate-900 px-1">VITE_SUPABASE_ANON_KEY</code>).</li>
        <li>Jalankan migrasi: <code className="rounded bg-slate-900 px-1">supabase/migrations/0001_init.sql</code>.</li>
        <li>Seed katalog: <code className="rounded bg-slate-900 px-1">npm run db:seed</code>.</li>
      </ol>
      <p className="mt-2 text-xs text-sky-200/80">
        Tanpa konfigurasi ini, aplikasi tetap berjalan dengan data katalog kurasi F0 (lokal).
      </p>
    </div>
  )
}
