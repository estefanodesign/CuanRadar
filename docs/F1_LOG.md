# CuanRadar — Log Fase 1 · BUILD 1 (Foundation)

*Status: BERJALAN · Mulai: 2026-08-30 · Referensi: `docs/ROADMAP.md` (F1), `PRD-CuanRadar.md` §50–59, `docs/ARCHITECTURE.md`, `docs/AI_RULES.md`*

## Cakupan BUILD 1 (PRD §64)

UI · authentication · database · navigation · profile · rewards foundation · saved apps · scan UI · credits · empty states · security · provider abstractions.

## Status Tugas

| # | Tugas | Status | Catatan |
|---|---|---|---|
| 1 | Skeleton Vite+React+TS+TanStack+Tailwind | ✅ Selesai | F0; build hijau |
| 2 | Types inti & config plan | ✅ Selesai | `src/types.ts` (tiga sumbu status, currency sen IDR), `src/config/plans.ts` (kuota Free/Pro/Pro+) |
| 3 | Supabase client + Auth context | ✅ Selesai | `src/lib/supabase.ts` (graceful tanpa env), `src/lib/auth.tsx` (email OTP + Google) |
| 4 | Provider abstractions | ✅ Selesai | `src/providers/types.ts` + stub (`AIProvider`, `SearchProvider`) — implementasi nyata BUILD 2 |
| 5 | Navigasi mobile-first | ✅ Selesai | `src/components/Layout.tsx` — bottom nav 6 item (mobile) + top nav (md+) |
| 6 | Halaman | ✅ Selesai | Dashboard, Scan, Rewards, Compare, Saved, Profil, Login |
| 7 | Saved apps (lokal) | ✅ Selesai | localStorage sementara; sinkron akun di Fase 2 |
| 8 | Scan UI + credits + empty states | ✅ Selesai | Kuota harian tampil; hasil Quick Scan memakai data kurasi F0 (provenance jujur) |
| 9 | Schema Supabase + RLS | ✅ Selesai | `supabase/migrations/0001_init.sql` — 12 tabel, enum, RLS (katalog publik, data user owner-only, review queue deny-by-default) |
| 10 | Seed script | ✅ Selesai | `scripts/seed-supabase.mjs` (`npm run db:seed`) |
| 11 | Typecheck + build | ✅ Selesai | **Hijau** — typecheck bersih; build vite 8.2.2 (211 modul); initial JS gzip **145,96 kB** (< budget 150 kB) via code-split per halaman |
| 12 | Landing page + responsive penuh | ✅ Selesai | `/` = landing (hero, fitur, contoh hasil scan, cara kerja, harga, FAQ, footer); `/app/*` = aplikasi. Desktop (md+): sidebar kiri; mobile: bottom nav. Build ulang hijau (145,01 kB gzip) |

## Catatan BUILD 1

1. **Tanpa Supabase, aplikasi tetap jalan** — data katalog dari `data/seed-platforms.json` (kurasi F0), saved apps via localStorage; halaman Login/Profil menampilkan SetupNotice bila env kosong.
2. **Tidak ada hasil palsu** — Quick Scan menampilkan data seed dengan label "sumber: katalog kurasi F0"; Deep Scan menampilkan pesan "engine hadir di BUILD 2" (PRD §54: jangan mengisi hasil artificial).
3. **Score/rank belum dihitung** (`score: null`) — masuk BUILD 3 (deterministik 6 faktor).
4. **Keamanan**: service-role key hanya untuk script/edge function; RLS aktif sejak migrasi pertama (AI_RULES §6, §16).

## TODO setelah BUILD 1 (menuju BUILD 2)

- [ ] Buat project Supabase, jalankan migrasi `0001_init.sql`, isi `.env.local`, jalankan `npm run db:seed`.
- [ ] Hubungkan UI ke Supabase (reward_apps via client, ganti data lokal).
- [ ] BUILD 2: SearchProvider & AIProvider nyata (deepseek + search free-tier), discovery/extraction, Quick Scan cold start.
- [ ] BUILD 3: verifikasi tiga sumbu, kalkulasi & scoring 6 faktor, cache, Budget Governor, Compare penuh.
