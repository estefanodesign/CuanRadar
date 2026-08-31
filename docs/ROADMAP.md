# CuanRadar — Roadmap & Milestone

*Revisi: v1.1 · Living document · Pemetaan Fase strategis (F0–F3) × BUILD PRD (1–5)*

## Peta Fase

| Fase | PRD BUILD | Durasi | Fokus |
|---|---|---|---|
| **F0 — Fondasi** | Persiapan | 2 minggu | Dokumen final, pre-seed katalog, rubrik, repo/CI, keputusan arsitektur |
| **F1 — Pilot MVP** | BUILD 1–3 | 8–12 minggu | Produk inti ujung-ke-ujung (scan → verifikasi → skor → rekomendasi) |
| **F2 — Growth** | BUILD 4–5 | 3–4 bulan | Kualitas, produksi, komunitas, alert, monetisasi tahap 1 |
| **F3 — Scale** | Lanjutan | 6+ bulan | PWA push, premium, B2B, kategori baru, ekspansi SEA |

## F0 — Fondasi (2 minggu)

**Deliverable:** PRD v1.1 + dokumen ini final · rubrik validasi disepakati · **pre-seed katalog 20–30 platform** (kurasi manual: Melolo, ReelRich, Shopee, Tokopedia, Blibli, ShopeePay, GoPay, DANA, OVO, LinkAja + sisanya dari `docs/PLATFORM_CATALOG.md`) · repo + CI · cek trademark & domain · keputusan stack final.

**Exit criteria:** Katalog seed lengkap dengan `risk_level` & `last_verified_at`; rubrik & arsitektur disetujui; CI hijau.

## F1 — Pilot MVP (8–12 minggu)

**BUILD 1 (Foundation):** UI mobile-first, auth (Supabase), database schema (termasuk entitas v1.1), navigation, profile, rewards foundation, saved apps, scan UI, credits, empty states, security, provider abstractions.

**BUILD 2 (AI Scan core):** SearchProvider, AIProvider, discovery, extraction, candidate filtering, deduplication, database population, Quick Scan cold start, review queue (v1.1), Discovery Lock per tipe scan, eksekusi via background queue.

**BUILD 3 (Intelligence):** verification (3 sumbu), reward calculation, estimation, recommendation scoring (6 faktor), reward history, cache + daily expiry job, Budget Governor, cost tracking, fitur Compare, kalkulator asumsi pengguna.

**Exit criteria:** 30 platform terpantau; scan ujung-ke-ujung bekerja; Lighthouse ≥90; AI cost dalam target; beta 100 pengguna; KPI pilot terukur (PRD §67 + v1.1).

## F2 — Growth (3–4 bulan)

**BUILD 4:** reliability, edge cases, security hardening, prompt optimization, UX refinement, guest quick scan eksperimen (opsional).

**BUILD 5:** production readiness — security audit, monitoring, deployment, analytics, operational controls, cost optimization.

**Fitur growth:** payout_reports & community_reports live dengan moderasi bertingkat · alert penawaran · afiliasi berlabel + iklan native · **pilot subscription Pro** (Rp39rb/bln, pembayaran QRIS/e-wallet, lihat `docs/MONETIZATION.md`) · re-verifikasi terjadwal.

**Exit criteria:** 50+ platform; 10k MAU; ≥30% offer terverifikasi payout; false-positive <10%; false-negative <1%; churn <8%; biaya AI stabil.

## F3 — Scale (6+ bulan)

**Deliverable:** PWA push notification & offline penuh · premium subscription · B2B insights agregat · kategori baru (telecom, survey, miles, kartu) · ekspansi regional (SEA) jika tervalidasi.

**Exit criteria:** MRR positif; kontrak B2B pertama; NPS ≥40.

## KPI per Fase (ringkas)

| KPI | F1 | F2 | F3 |
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
- Setiap perubahan rubrik/bobot skor dicatat (`bobot_version`) dan diumumkan.
- Setiap fase punya gate review: lanjut / pivot / henti berdasarkan exit criteria di atas.
