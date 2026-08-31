# CuanRadar — Catatan Sesi Frontend (UI/UX)

*Mulai: 2026-08-30 · Tujuan: memudahkan pembaca kembali hasil percakapan khusus frontend/UI-UX. Dokumen ini hidup — setiap sesi Frontend menambah satu bagian.*

## Aturan Sesi

- Sesi **Frontend** hanya membahas UI/UX dan perubahan frontend (komponen, halaman, state, styling, data yang ditampilkan).
- Topik di luar itu (scoring engine server-side, migrasi DB, Budget Governor, edge function, dsb.) disebut hanya sebagai konteks "apa yang harus ditampilkan UI" — bukan dikerjakan di sini.
- Referensi: `PRD-CuanRadar.md` §50–58 + Appendix A1/A4/A5/A9 · `docs/VALIDATION_RUBRIC.md` §5 · `docs/AI_RULES.md` §11 · `docs/ARCHITECTURE.md` §8.

---

## Sesi 1 — 2026-08-30 · Detail + CuanScore + Provenance (prioritas A)

**Konteks:** F1 BUILD 1–2 selesai; UI membaca `reward_apps` dari Supabase (fallback seed F0 jujur). BUILD 3 di backend sedang berjalan (verifikasi 3 sumbu, scoring, cache, governor). Sesi ini menyiapkan sisi tampilan agar "intelligence" BUILD 3 terlihat user.

### Keputusan sesi

1. **Fokus prioritas A:** halaman Reward Detail (PRD §56), CuanScore 6 faktor (PRD §32 / RUBRIC §5), "Why recommended" (PRD §57), provenance per item (Appendix A9).
2. **Catatan sesi dibuat** di file ini (dokumentasi keputusan frontend per sesi).

### Perubahan yang direncanakan (BUILD 3 frontend)

| # | Perubahan | File | PRD ref |
|---|---|---|---|
| 1 | Tipe skor & breakdown | `src/types.ts` | §32, §63 |
| 2 | Modul scoring deterministik sisi-klien (6 faktor, bobot RUBRIC §5; data kurang → netral 0.5) | `src/lib/scoring.ts` (BARU) | §22, §32; RUBRIC §5 |
| 3 | Badge skor & breakdown bar | `src/components/ScoreBadge.tsx` (BARU) | §57 |
| 4 | Badge provenance ("database terverifikasi" / "dari cache" / "hasil baru — menunggu review") | `src/components/ProvenanceBadge.tsx` (BARU) | A9 |
| 5 | RewardCard diperluas: skor + provenance + tautan ke detail | `src/components/RewardCard.tsx` | §55, A9 |
| 6 | Halaman Reward Detail + "Why recommended" + alasan blokir (scam/expired/unverified) | `src/pages/RewardDetailPage.tsx` (BARU) + route `src/router.tsx` | §56–57 |
| 7 | Format helper tambahan (skor, faktor label) | `src/lib/format.ts` | — |

### Keputusan desain

- **Scoring sisi-klien bersifat sementara & jujur:** selama BUILD 3 backend belum memberi skor via API, UI menghitung skor deterministik sendiri dari field yang tersedia (`verification_status`, `risk_level`, `payout_methods`, `min_payout_idr`, `status`, `reward_types`). Faktor tanpa data → **netral 0.5** (tidak dikarang). Saat API scan/`GET /api/rewards` aktif, UI beralih memakai skor dari server (`ScanResultItem.score`), `scoring.ts` menjadi fallback.
- **Tiga sumbu tetap tampil terpisah** di kartu & detail: badge verifikasi (informasi) ≠ badge risiko (platform) — konsisten A1.
- **Provenance per kartu** ditambahkan; label global sumber di header halaman tetap dipertahankan.
- **Detail halaman** menampilkan: info aplikasi, reward types, payout, min payout, verifikasi, risiko, last_verified, skor + breakdown, "Why recommended", link resmi prioritas (official → Play → App Store, PRD §47), dan blokir tegas untuk TERINDIKASI_SCAM / EXPIRED / UNVERIFIED (RUBRIC §6) — ditampilkan sebagai peringatan, bukan rekomendasi.
- **Navigasi detail:** route `/app/rewards/:slug`; kartu dapat diklik (judul & tombol "Detail").
- **Belum dikerjakan di sesi ini** (untuk sesi berikutnya): Scan UX state machine + polling, kuota real dari `scan_credits`, indikator cache/TTL + forced refresh, banner Budget Governor, estimasi & kalkulator asumsi (A4), kandidat review queue di UI, audit touch target ≥44px.

### Status implementasi

- [x] `docs/SESSIONS_FRONTEND.md` (file ini)
- [x] Tipe skor/breakdown di `src/types.ts` (`ScoreFactor`, `ScoreBreakdown`, `ScoredResult`)
- [x] `src/lib/scoring.ts` — CuanScore deterministik 6 faktor (bobot RUBRIC §5, netral 0.5, `bobot_version`)
- [x] `ScoreBadge.tsx` (badge + breakdown bar) + `ProvenanceBadge.tsx` (database/cache/search_new)
- [x] `RewardCard.tsx` diperluas: CuanScore + provenance + tautan "Detail" & judul → `/app/rewards/:slug`
- [x] `RewardDetailPage.tsx` + route `/app/rewards/$slug` (`src/router.tsx`); berisi: dua sumbu terpisah, peringatan blokir scam/unverified (RUBRIC §6), WhyRecommended (PRD §57), tautan resmi prioritas (PRD §47), simpan/buka
- [x] Typecheck + build hijau (initial JS gzip 138,39 kB < 150 kB; detail ter-code-split 2,95 kB gzip)

### Catatan lanjutan

- `min_payout_idr` disimpan sebagai **sen IDR** (migrasi `0001_init.sql` line 32) → tampilan memakai `formatIDRFromSen`; seed saat ini semuanya null.
- Skor sisi-klien sementara: saat backend BUILD 3 memberi skor via API (`ScanResultItem.score`), UI harus memakai skor server; `scoring.ts` tetap dipakai untuk breakdown/penjelas.
- Belum dikerjakan (untuk sesi berikutnya): kandidat review queue di UI, audit touch target ≥44px.

---

## Sesi 2 — 2026-08-30 · Scan UX state machine + Kuota real + Estimasi (item 1–3)

**Konteks:** Prioritas A selesai (sesi 1). Sesi ini melengkapi BUILD 3 frontend: state machine scan, kuota real, cache/TTL + governor, dan estimasi & kalkulator asumsi.

### Keputusan sesi

1. **Item 1 — Scan UX state machine + polling**: Quick Scan berjalan nyata DB-first (PRD §11/§14) dengan stepper state machine (PRD §62). Deep Scan menampilkan state `discovering` + pesan jujur (engine server-side; polling otomatis saat edge function aktif). `useScanPoll` membaca `scan_history` bila tersedia; `pollOnce` masih `null` (API belum ada) — **antarmuka tetap sama saat API disambungkan**.
2. **Item 3 — Kuota real + cache/TTL + governor**: kuota dari tabel `scan_credits` (Supabase) bila user login → fallback config plan statis (`source: 'db' | 'config'`). Banner Budget Governor (PRD §41) dari persentase penggunaan harian. `CacheStatus` menampilkan usia data + tombol forced refresh (invalidate query, PRD §37).
3. **Item 2 — Estimasi & kalkulator asumsi (A4)**: `estimate.ts` deterministik; bila data offer belum ada → tampilkan nilai satuan + "cannot be reliably estimated" + input asumsi menit/task & task/hari → hasil berlabel "*berdasarkan asumsi Anda*".

### Perubahan

| # | Perubahan | File | PRD ref |
|---|---|---|---|
| 1 | Tipe & helper scan state machine | `src/types.ts`, `src/lib/scan.ts` (BARU) | §62, §14 |
| 2 | Stepper scan + pesan cold-start | `src/components/ScanProgress.tsx` (BARU) | §53–54 |
| 3 | ScanPage dirombak (state machine + polling + kuota + governor + cache) | `src/pages/ScanPage.tsx` | §52–54 |
| 4 | Kuota real `scan_credits` + governor | `src/lib/scanCredits.ts` (BARU) | §39, §41 |
| 5 | Banner Budget Governor | `src/components/GovernorBanner.tsx` (BARU) | §41 |
| 6 | Indikator cache/TTL + forced refresh | `src/lib/platforms.ts`, `src/components/CacheStatus.tsx` (BARU), `src/lib/format.ts` | §37, A9 |
| 7 | Estimasi deterministik + asumsi | `src/lib/estimate.ts` (BARU), `src/components/EstimationCalculator.tsx` (BARU) | §30–31, A4 |
| 8 | Terapkan kuota real di Dashboard & AppLayout | `src/pages/DashboardPage.tsx`, `src/components/AppLayout.tsx` | §51, §50 |
| 9 | Estimasi disisipkan di halaman detail | `src/pages/RewardDetailPage.tsx` | A4 |

### Keputusan desain

- **Quick Scan DB-first nyata di UI** (`runQuickScanLocal`): `cache_completed` bila data cukup, `limited` bila kurang — tidak mengarang (PRD §13/§15).
- **Deep Scan jujur**: `discovering` + pesan "server-side, integrasi edge function BUILD 3". Tidak memalsukan hasil.
- **Polling abstraction**: `useScanPoll` + `pollOnce()` → ganti isi `pollOnce` dengan `GET /api/scan/:id` saat API aktif. UI tidak perlu berubah.
- **Kuota real**: `useScanCredits()` membaca `scan_credits` (RLS pemilik) bila user login; fallback config statis. `source` membedakan agar UI jujur.
- **Governor**: diturunkan dari persentase penggunaan kuota harian (deep dianggap 5×) — deterministik & jujur sebagai proksi UI; biaya dollar sesungguhnya server-side (PRD §43).
- **Cache/TTL**: `usePlatforms` expose `dataUpdatedAt`; `CacheStatus` menampilkan usia & tombol Muat ulang (invalidate query). Label provenance per hasil tetap (A9).

### Status implementasi

- [x] Item 1: state machine + Quick Scan DB-first + polling (`scan.ts`, `ScanProgress.tsx`, `ScanPage.tsx`)
- [x] Item 3: kuota real + governor (`scanCredits.ts`, `GovernorBanner.tsx`), cache/TTL + forced refresh (`CacheStatus.tsx`, `platforms.ts`)
- [x] Item 2: estimasi & kalkulator asumsi (`estimate.ts`, `EstimationCalculator.tsx`, sisip di detail)
- [x] Terapkan kuota real di Dashboard & AppLayout
- [x] Typecheck + build hijau (225 modul; initial gzip 138,44 kB < 150 kB); semua route smoke-tested 200

### Catatan teknis / yang harus dihubungkan nanti

- `pollOnce()` di `scan.ts` masih `null` (edge function `GET /api/scan/:id` belum ada). Saat API aktif, ganti untuk mem-parsing state machine.
- `estimated_menit` & `reward_value` dari `reward_offers` belum di-seed; `EstimationCalculator` memakai `min_payout_idr` sebagai nilai satuan indikatif. Saat `reward_offers` ter-seed, sambungkan ke `EstimationCalculator` (nilai & durasi nyata → `basedOn: 'data'`).
- `scan_credits` perlu diisi/menjalankan RLS agar kuota real tampil; fallback config statis tetap jujur.

---


---
