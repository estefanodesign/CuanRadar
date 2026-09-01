# CuanRadar — Roadmap & Milestone

*Revisi: v1.2 · Living document · Pemetaan Fase strategis (F0–F3) × BUILD*
*Revisi v1.2 (2026-08-31): BUILD 4–5 dieksekusi di dalam **Fase 1** (pilot + production readiness) → **Fase 2 dimulai dari BUILD 6**. BUILD 1–5 mengacu PRD §64; BUILD 6+ adalah perluasan roadmap (mengikuti prinsip PRD §64: perubahan fundamental PRD tetap butuh keputusan eksplisit).*

## Peta Fase

| Fase | BUILD | Durasi | Fokus |
|---|---|---|---|
| **F0 — Fondasi** | Persiapan | 2 minggu | Dokumen final, pre-seed katalog, rubrik, repo/CI, keputusan arsitektur |
| **F1 — Pilot MVP + Production** | **BUILD 1–5** | 8–12 minggu | Produk inti ujung-ke-ujung → production-ready (✅ selesai 2026-08-31) |
| **F2 — Growth** | **BUILD 6–7** | 3–4 bulan | Komunitas, monetisasi tahap 1, ekspansi katalog & platform |
| **F3 — Scale** | Lanjutan | 6+ bulan | PWA push, premium, B2B, kategori baru, ekspansi SEA |

## F0 — Fondasi (2 minggu) ✅

**Deliverable:** PRD v1.1 + dokumen final · rubrik validasi disepakati · pre-seed katalog 30 platform (`data/seed-platforms.json`) · repo + CI · cek trademark informal · keputusan stack final.

**Exit criteria:** Katalog seed lengkap (`risk_level` & `last_verified_at`); rubrik & arsitektur disetujui; CI hijau. *(Terpenuhi.)*

## F1 — Pilot MVP + Production (BUILD 1–5) ✅ (selesai 2026-08-31)

**BUILD 1 (Foundation):** UI mobile-first, auth (Supabase), database schema (entitas v1.1), navigation, profile, rewards foundation, saved apps, scan UI, credits, empty states, security, provider abstractions.

**BUILD 2 (AI Scan core):** SearchProvider, AIProvider, discovery, extraction, candidate filtering, deduplication, database population, Quick Scan cold start, review queue (v1.1), Discovery Lock per tipe scan, eksekusi via background queue/CLI → **edge function `scan`**.

**BUILD 3 (Intelligence):** verification (3 sumbu), reward calculation, estimation, recommendation scoring (6 faktor), reward history, cache + TTL, Budget Governor, cost tracking, fitur Compare, kalkulator asumsi pengguna, CuanScore & provenance di UI.

**BUILD 4 (Refinement):** review queue UI (kandidat menunggu tinjauan), prompt ekstraksi diperkuat, touch target ≥44px, reliability & edge cases.

**BUILD 5 (Production readiness):** security audit (bundle bersih secret), operational controls (Deep Scan wajib login, throttle tamu, dedup vs katalog+queue), sanitasi error server, analytics PostHog opsional (dynamic import), deploy live `cuanradar.pages.dev` + edge function, cost/performance optimization.

**Exit criteria:** 30 platform terpantau; scan ujung-ke-ujung (quick DB-first + deep discovery) bekerja; Lighthouse ≥90 *(belum diukur — checklist F2 awal)*; AI cost dalam target; soft-launch publik (`cuanradar.pages.dev`) untuk beta 100 pengguna; KPI pilot terukur (PRD §67 + v1.1). *(Mayoritas terpenuhi; Lighthouse & beta 100 pengguna menjadi gerbang awal F2.)*

## F2 — Growth (BUILD 6–7, 3–4 bulan)

**BUILD 6 (Komunitas & Monetisasi):**
- `payout_reports` & `community_reports` live dengan moderasi bertingkat (≥2 konfirmasi + editor).
- **Alur tinjauan editor** review_queue: approve → `reward_apps`, reject → discard (CLI/SQL/UI admin).
- **Pilot subscription Pro** (Rp39rb/bln, annual Rp390rb, QRIS/e-wallet via Midtrans/Xendit — `docs/MONETIZATION.md`) + alur upgrade di UI (pembayaran F2).
- Alert penawaran (email) · afiliasi berlabel + iklan native · re-verifikasi terjadwal (30 hari).
- Lighthouse ≥90 & aksesibilitas audit; seed `reward_offers` (estimated_menit, reward_value) → kalkulator `basedOn:'data'`.

**BUILD 7 (Ekspansi & Scale-up):**
- Ekspansi katalog & platform **50+** (aktifkan status `Fase 2` di katalog: telecom, survey, miles, kartu, dst.).
- Auth penuh: `scan_credits` per plan (Free/Pro/Pro+) & kuota real per user; staging/prod Supabase terpisah.
- Analytics aktif (PostHog key) + error monitoring; domain custom `cuanradar.id` + DNS Cloudflare.
- Guest quick scan eksperimen (opsional).

**Exit criteria F2:** 50+ platform; 10k MAU; ≥30% offer terverifikasi payout; false-positive <10%; false-negative <1%; churn <8%; biaya AI stabil; MRR mulai positif (Pro).

## F3 — Scale (6+ bulan)

**Deliverable:** PWA push notification & offline penuh · premium scaling (Pro+, annual) · B2B insights agregat anonim · kategori baru (telecom, survey, miles, kartu) · ekspansi regional (SEA) jika tervalidasi.

**Exit criteria:** MRR positif; kontrak B2B pertama; NPS ≥40.

## KPI per Fase (ringkas)

| KPI | F1 (selesai) | F2 | F3 |
|---|---|---|---|
| Platform terpantau | 30 | 50+ | 100+ |
| % offer terverifikasi payout | mulai diukur | ≥30% | ≥60% |
| False-positive verifikasi | <10% | <10% | <5% |
| False-negative scam | <1% | <1% | <0,5% |
| Scan completion rate | >90% | >90% | >95% |
| Avg Deep Scan cost | ≤US$0.01 | ≤US$0.01 | turun |
| MAU | 100 (beta) | 10k | 50k+ |
| NPS | — | mulai diukur | ≥40 |

## Aturan Perubahan

- **Build berikutnya tidak boleh mengubah fundamental PRD tanpa keputusan eksplisit** (PRD §64).
- **BUILD 6+ adalah perluasan roadmap** (PRD §64 hanya mendefinisikan BUILD 1–5) — isi F2/F3 mengikuti prinsip PRD & `docs/AI_RULES.md`; jika menyentuh fundamental PRD (model data, skor, kuota), catat sebagai revisi PRD yang disetujui.
- Setiap perubahan rubrik/bobot skor dicatat (`bobot_version`) dan diumumkan.
- Setiap fase punya gate review: lanjut / pivot / henti berdasarkan exit criteria di atas.
