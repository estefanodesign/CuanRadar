# CuanRadar — Strategi Deployment

*Revisi: v1.0 · 2026-08-30 · Living document · Referensi: `docs/ARCHITECTURE.md` (stack final), `docs/ROADMAP.md`, `docs/BUDGET.md`*

## 1. Kapan Deployment Dilakukan (per fase)

| Fase | Deployment | Tujuan |
|---|---|---|
| **F0** | — | Repo + CI (typecheck/build) saja; belum ada URL publik |
| **F1 (BUILD 1–3)** | **Preview otomatis** (Cloudflare Pages per commit/PR) | Developer & tester melihat hasil tiap perubahan; tanpa mengganggu pengguna |
| **Akhir F1** | **Soft-launch URL publik** (`cuanradar.pages.dev`) | Beta 100 pengguna (exit criteria F1) — data nyata, feedback awal |
| **F2 (BUILD 5 — DEPLOYMENT RESMI)** | **Production hardening**: domain custom, security audit, monitoring, analytics, cost controls | Siap untuk 10k MAU & monetisasi |
| **F3** | Scale: PWA push, payment gateway (Midtrans/Xendit), B2B | Pertumbuhan & pendapatan |

**Kesimpulan:** deployment resmi/production di **F2 · BUILD 5**, tetapi **deployment bertahap dimulai sejak F1** (preview) dan **soft-launch di akhir F1** untuk beta. Jangan menunggu BUILD 5 untuk pertama kali deploy — uji alur deploy sedini mungkin (prinsip: CI/CD sedini mungkin, hardening belakangan).

## 2. Di Mana Deployment (target sesuai keputusan stack — tanpa Next.js/Vercel)

| Layer | Target | Catatan |
|---|---|---|
| Frontend (SPA) | **Cloudflare Pages** | Free tier; global CDN (POP Indonesia); preview URL per PR |
| CDN/WAF/DDoS/DNS | **Cloudflare** | Sudah bagian dari Pages; custom domain di F2 |
| Backend/DB/Auth | **Supabase** (hosted Postgres) | **Pilih region Singapore saat buat project** (terdekat ke Indonesia; tidak bisa diubah setelah dibuat) |
| Edge Functions / API entry | Supabase Edge Functions | Hanya menerima & meng-enqueue scan (bukan eksekusi panjang) |
| Scan queue & scheduled jobs | pg-boss + pg_cron di Supabase Postgres | Tanpa platform tambahan |
| Source control & CI | **GitHub** + GitHub Actions | Sudah ada (typecheck+build); deploy dihubungkan ke Pages |
| AI & Search | deepseek + search free-tier (eksternal) | Via env/secrets, bukan "deployment" internal |
| Monitoring & Analytics | PostHog + Sentry (free tier) | F2 BUILD 5 |

## 3. Bagaimana Deployment Dilakukan

### 3.1 Alur utama (rekomendasi — paling sederhana & gratis)

```
Developer push ke GitHub
   ↓
GitHub Actions CI: npm ci → typecheck → build (gerbang kualitas, sudah ada)
   ↓
Cloudflare Pages Git integration (connect repo GitHub)
   ├─ branch main  → production (cuanradar.pages.dev / domain custom di F2)
   └─ pull request → preview URL otomatis (unlimited, gratis)
```

- **Frontend:** pakai **Git integration bawaan Cloudflare Pages** (build command `npm run build`, output `dist`) — tanpa API token, tanpa workflow tambahan; preview per-PR otomatis.
- **Database:** migrasi via `supabase/migrations/0001_init.sql` — SQL Editor dashboard ATAU `supabase db push` (supabase CLI) saat sudah dipasang.
- **Seed:** `npm run db:seed` (sekali, setelah migrasi).
- **Edge Functions (BUILD 2–3):** `supabase functions deploy` dari repo.

### 3.2 Environment variables & secrets (AI_RULES §9)

| Variabel | Di mana | Keterangan |
|---|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | **Cloudflare Pages → Settings → Environment variables** (production & preview) | Client-safe; **tidak di-commit** |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Secrets (edge functions) + `.env` lokal untuk script seed | **Server-side only; JANGAN pernah di frontend** |
| `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` | GitHub Secrets — **hanya bila** memilih deploy via wrangler-action (alternatif Git integration) | Tidak wajib untuk jalur rekomendasi |
| `VITE_POSTHOG_KEY` (dll.) | Cloudflare Pages env | F2 BUILD 5 |

### 3.3 Environments

- **Pilot (F1):** 1 Supabase project (dev = prod) — cukup & paling hemat untuk solo founder; **pisahkan staging/prod sebelum F2 monetisasi** agar upgrade tidak merusak data pengguna.
- **Cloudflare Pages:** production (main) + preview (PR) otomatis — gratis.
- **Rollback:** Cloudflare Pages menyimpan riwayat deployment → rollback 1 klik.

### 3.4 Regional & performa

- Supabase region **Singapore** (terdekat Indonesia); frontend dilayani CDN Cloudflare dari POP terdekat (LCP < 2,5 dtk di 4G tetap jadi target — ARCHITECTURE §8).
- Domain: rekomendasi **`.id`** (cuanradar.id) untuk pasar lokal + SEO; alternatif `.com`. Cek ketersediaan = TODO F0 yang belum dieksekusi.

### 3.5 Edge function `scan` (BUILD 3) — deploy & secrets

Frontend memanggil `supabase.functions.invoke('scan', …)` untuk Quick (DB-first server-side) & Deep Scan (discovery + review queue). Kuota dikonsumsi **server-side** saat scan berjalan (bukan klik).

```powershell
# sekali (login + link project)
npx supabase login
npx supabase link --project-ref <PROJECT_REF>   # dari Supabase dashboard → Settings → General

# deploy fungsi
npx supabase functions deploy scan

# set secrets (nilai sama dengan .env lokal Anda; service_role dari dashboard)
npx supabase secrets set DEEPSEEK_API_KEY=<key>
npx supabase secrets set SEARCH_PROVIDER=serper
npx supabase secrets set SEARCH_API_KEY=<key>
npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=<key>
```

> `SUPABASE_URL` & `SUPABASE_ANON_KEY` otomatis tersedia di runtime edge function. Jangan pernah menyimpan service_role di frontend (AI_RULES §9).

## 4. Checklist per Fase

**F1 (sekarang):**
- [ ] Buat project Cloudflare Pages, connect GitHub repo (build `npm run build`, output `dist`).
- [ ] Buat project Supabase **region Singapore**; jalankan migrasi + `npm run db:seed`; isi env Pages.
- [ ] Pastikan preview URL muncul tiap PR; UI memakai data Supabase (bukan seed lokal) — BUILD 2.

**Akhir F1 (soft-launch beta 100 user):**
- [ ] URL publik `cuanradar.pages.dev` aktif; disclaimers tampil; katalog 30 platform terverifikasi via rubrik.
- [ ] Logging scan & cost monitoring dasar aktif (PRD §43).

**F2 BUILD 5 (production hardening):**
- [ ] Security audit final (checklist AI_RULES §18 Pre-Release); secret review.
- [ ] Domain custom + SSL (Cloudflare); monitoring (PostHog/Sentry); analytics.
- [ ] Pisah staging/prod Supabase bila perlu; operational controls (rate limit, governor).

**F3:**
- [ ] Payment gateway (Midtrans/Xendit) server-side; PWA push; B2B.

## 5. Yang Perlu Disiapkan User (saya tidak bisa membuat akun/deploy dari environment ini)

1. Akun **GitHub** (repo sudah siap di lokal).
2. Akun **Cloudflare** → buat Pages project, connect repo.
3. Akun **Supabase** → buat project (region Singapore), salin URL/keys.
4. (Opsional, F2) Domain `cuanradar.id` + akun registrar.

Setelah akun tersedia, alur deploy di atas bisa aktif dalam hitungan menit — seluruh config sudah di repo.
