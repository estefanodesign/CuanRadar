# CuanRadar

**Personal reward opportunity discovery assistant** untuk pengguna Indonesia.

CuanRadar membantu menemukan, membandingkan, memperkirakan, memverifikasi, dan memilih peluang reward (uang tunai, poin yang bisa diuangkan, voucher, cashback) dari berbagai platform — entertainment, shopping, digital wallet, dan kategori lainnya — sehingga **setiap menit waktu pengguna menjadi lebih berharga**.

> Status: **Tahap perencanaan / pre-development.** Dokumen di repo ini adalah fondasi yang disetujui untuk pengembangan bertahap (Fase 0–3).

## Prinsip Inti

1. **Integritas data** — semua angka punya asumsi tertulis, sumber, dan tanggal verifikasi (`last_verified_at`).
2. **Pemisahan editorial & komersial** — tidak ada pay-for-rank; link afiliasi selalu berlabel.
3. **Keselamatan pengguna** — validasi anti-scam adalah fitur kelas satu.
4. **Bukan nasihat keuangan/investasi** — platform investasi/staking/mining dilarang masuk katalog.
5. **Mobile-first & hemat biaya** — database-first → cache-first → AI-second → web-search-on-demand.

## Arsitektur Ringkas

**Discover/Tracking → Compare → Estimate → Verify → Choose**

Stack pilot: Vite + React + TypeScript + TanStack + Tailwind CSS (Cloudflare Pages) · Supabase (PostgreSQL + Auth + Edge Functions) · deepseek (AI, terabstraksi) · Search Provider (terabstraksi, free-tier dulu) · Cloudflare (CDN/WAF/DDoS/DNS). Eksekusi scan via background queue, bukan edge function sinkron.

## Dokumen (Indeks)

| Dokumen | Isi |
|---|---|
| [`PRD-CuanRadar.md`](PRD-CuanRadar.md) | Product Requirements Document — **v1.1** (baseline development; berisi revision log & appendix koreksi) |
| [`docs/STRATEGY.md`](docs/STRATEGY.md) | Visi, masalah & peluang, positioning, persona, diferensiasi, KPI strategis |
| [`docs/PLATFORM_CATALOG.md`](docs/PLATFORM_CATALOG.md) | Taksonomi 4 kategori + daftar platform per kategori (status, risiko, payout) + aturan allowlist |
| [`docs/VALIDATION_RUBRIC.md`](docs/VALIDATION_RUBRIC.md) | Rubrik 8 pemeriksaan → risk_level; definisi verification; rumus & bobot skor 6 faktor |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | Stack final, model data, API surface, state machine scan + queue, cache, keamanan, cost monitoring |
| [`docs/MONETIZATION.md`](docs/MONETIZATION.md) | Model pendapatan bertahap + aturan etika afiliasi |
| [`docs/BUDGET.md`](docs/BUDGET.md) | Estimasi biaya realistis pilot F0–F1 & run rate bulanan |
| [`docs/RISKS.md`](docs/RISKS.md) | Matriks risiko & mitigasi + checklist legal per fase |
| [`docs/ROADMAP.md`](docs/ROADMAP.md) | Fase F0–F3 × BUILD 1–5, milestone, kriteria exit, KPI |
| [`docs/F0_LOG.md`](docs/F0_LOG.md) | Log & status tugas Fase 0 (pre-seed, CI, trademark/domain) |
| [`docs/AI_RULES.md`](docs/AI_RULES.md) | Aturan AI & rekayasa untuk implementasi code (panduan teknis, Bahasa Indonesia) |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Strategi deployment per fase: preview → soft-launch → production (Cloudflare Pages + Supabase) |
| [`data/seed-platforms.json`](data/seed-platforms.json) | Pre-seed katalog: 30 platform, 4 kategori, risk_level & last_verified_at |

## Status Rencana & Asumsi

- **Disetujui:** PRD v1.1 + 8 dokumen pendukung (audit konseptual & integrasi strategi selesai). **Stack & Monetisasi final** — stack: Vite/Supabase/Cloudflare tanpa Next.js/Vercel (`docs/ARCHITECTURE.md` §1A); monetisasi: subscription-plan Pro disetujui (Rp39rb/bln, QRIS/e-wallet, kuota 3/7/15 & 4/8/16 — `docs/MONETIZATION.md` v1.3).
- **Fase 0 ✅:** pre-seed katalog **30 platform** selesai (`data/seed-platforms.json`), skeleton repo + CI, cek trademark informal bersih. Detail: `docs/F0_LOG.md`.
- **Fase 1 ✅ (BUILD 1–5, pilot production-ready):** landing + aplikasi responsive · UI terhubung Supabase (30 platform ter-seed) · engine scan DB-first + Deep Scan (edge function, review queue) · CuanScore & provenance · kuota server-side · review queue UI · production hardening (deep wajib login, throttle, analytics opsional) · **live di `cuanradar.pages.dev`**. Detail: `docs/F1_LOG.md`.
- **Fase 2 ⏳ (BUILD 6–7, berikutnya):** komunitas (payout_reports, moderasi), tinjauan editor, pilot subscription Pro (QRIS/e-wallet), ekspansi 50+ platform. Detail: `docs/ROADMAP.md`.
- **Asumsi terbuka:** (1) stack diadopsi dari PRD (Supabase + Cloudflare + Vite) — **Next.js/Vercel resmi ditutup untuk pilot** (keputusan founder: churn update & keterbatasan komersial Vercel); SEO di F2 via prerender/Astro bila diperlukan (lihat `docs/ARCHITECTURE.md` §1A); (2) auth di pilot dipertahankan (konsisten dengan credit & saved apps); (3) satu PRD kanonik (file root); (4) semua angka reward berlabel `last_verified_at` dan bisa usang — diungkapkan jujur; (5) cek trademark nama "CuanRadar" dilakukan di F0.
- **Bahasa:** Bahasa Indonesia (v1); Inggris untuk ekspansi (di luar cakupan pilot).

## Handover — Posisi Saat Ini & Item Terbuka (update 2026-08-31)

**Posisi:** F0 ✅ · **F1 (BUILD 1–5) ✅ selesai** — pilot production-ready, live di `cuanradar.pages.dev` (landing design system industrial + aplikasi, scan quick/deep via edge function, kuota server-side, review queue UI). **Berikutnya: F2 · BUILD 6** (komunitas & monetisasi — `docs/ROADMAP.md`).

**Terbuka / butuh tindakan user (F2):**
1. **Opsional:** key PostHog (`VITE_POSTHOG_KEY`, `VITE_POSTHOG_HOST`) di env Cloudflare Pages → analytics aktif.
2. **Opsional:** domain custom `cuanradar.id` + DNS Cloudflare (DEPLOYMENT §3.4).
3. **Tinjauan editor review queue**: kandidat menunggu approve/reject (BUILD 6).
4. **Lighthouse ≥90 & beta 100 pengguna** — gerbang awal F2.
5. **Credentials mesin**: git PAT `estefanodesign` (repo+workflow) & `.env` (Supabase/DeepSeek/Serper/Cloudflare) tersimpan lokal — jangan di-commit.

**Aturan kerja:** ikuti `docs/AI_RULES.md` (v3) — termasuk: jangan ubah stack tanpa persetujuan, jangan publish kandidat AI langsung (review queue dulu), uang = integer sen IDR, tiga sumbu status terpisah.

## Mulai dari Mana

1. Baca [`PRD-CuanRadar.md`](PRD-CuanRadar.md) (v1.1) sebagai baseline.
2. Baca [`docs/ROADMAP.md`](docs/ROADMAP.md) — posisi saat ini: **F1 selesai, lanjut F2 BUILD 6**.
3. Referensi teknis saat implementasi: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).
4. Log kerja terbaru: [`docs/F1_LOG.md`](docs/F1_LOG.md).

*Dokumen ini adalah living document — revisi dicatat dengan tanggal.*
