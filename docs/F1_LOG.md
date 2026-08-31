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

## BUILD 2 — Status (SELESAI, 2026-08-30)

| # | Tugas | Status | Catatan |
|---|---|---|---|
| 1 | Seed 30 platform ke Supabase | ✅ Selesai | `npm run db:seed` — 30 berhasil, 0 gagal |
| 2 | UI → Supabase (`reward_apps`) | ✅ Selesai | `src/lib/platforms.ts` (usePlatforms, fallback seed jujur); semua halaman memakai DB + label sumber |
| 3 | Provider nyata | ✅ Selesai | `engine/providers.mjs`: Brave/Serper (search) + DeepSeek (AI, routing cheap/mid/premium); stub bila kunci kosong |
| 4 | Engine discovery/extraction | ✅ Selesai | `engine/scan.mjs` (DB-first, limit PRD §13/§18, dedup), `engine/extraction.mjs` (JSON schema + sanitasi + retry terbatas), `engine/sufficiency.mjs` (PRD §14) |
| 5 | CLI scan | ✅ Selesai | `npm run scan:quick` / `scan:deep` (+ `--save` → review_queue_items) |
| 6 | Verifikasi end-to-end | ✅ Selesai | Quick Scan DB-first: data 30 platform, sufficiency 6/4 → `cache_completed`, 0 search/AI; build hijau (145,23 kB gzip) |

**Catatan:** Deep Scan discovery butuh `DEEPSEEK_API_KEY` + `SEARCH_PROVIDER`/`SEARCH_API_KEY` (free-tier Brave/Serper) — belum diisi user; engine menolak dengan pesan jelas (tidak mengarang, PRD §13/§18).

## TODO setelah BUILD 2 (menuju BUILD 3)

- [ ] Isi `DEEPSEEK_API_KEY` + `SEARCH_PROVIDER=brave|serper` + `SEARCH_API_KEY` di `.env`, lalu uji `npm run scan:deep -- --save`.
- [ ] BUILD 3: verifikasi tiga sumbu + rubrik 8 pemeriksaan, kalkulasi & scoring 6 faktor (deterministik), cache (key+TTL), Budget Governor, cost tracking per scan, alert.
- [ ] BUILD 3: integrasi edge function untuk scan via API (POST /api/scan → queue) — pengganti CLI.
- [ ] Deploy edge function & migrasi tambahan bila schema berubah.
