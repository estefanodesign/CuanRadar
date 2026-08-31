# CuanRadar — Log Fase 0 (Fondasi)

*Status: BERJALAN · Target selesai: 2 minggu · Mulai: 2026-08-30 · Referensi: `docs/ROADMAP.md`*

## Tugas F0 & Status

| # | Tugas | Status | Catatan |
|---|---|---|---|
| 1 | Dokumen final (PRD v1.1 + 8 dokumen pendukung) | ✅ Selesai | Sebelum F0 |
| 2 | Rubrik validasi disepakati | ✅ Selesai | `docs/VALIDATION_RUBRIC.md` |
| 3 | Keputusan stack final | ✅ Selesai | Vite/Supabase/Cloudflare, tanpa Next.js/Vercel (`docs/ARCHITECTURE.md` §1A) |
| 4 | Keputusan monetisasi final | ✅ Selesai | `docs/MONETIZATION.md` v1.3 (Pro Rp39rb/bln) |
| 5 | **Pre-seed katalog** | ✅ Selesai | `data/seed-platforms.json` — **30 platform**, 4 kategori, `risk_level` estimasi + `last_verified_at` 2026-08-30 |
| 6 | **Skeleton repo + CI** | ✅ Selesai | Vite+React+TS+TanStack+Tailwind; **typecheck & build hijau lokal** (vite v8.2.2, JS gzip 92.9 kB); CI GitHub Actions siap (typecheck+build, node 24) |
| 7 | Cek trademark & domain | 🔄 Sebagian | **Informal: TIDAK ada konflik nama "CuanRadar"** (hanya mirip tak terkait: CueRadar, ChatRadar, ConvRadar). Formal DJKI + ketersediaan domain = TODO |
| 8 | Verifikasi harga vendor (Supabase, deepseek, search API) | ⏳ TODO | Estimasi budget 2025 — diverifikasi ulang sebelum F1 (BUDGET.md) |

## Temuan & Catatan F0

1. **Environment:** Node v24.20.0 · npm 11.19.0 · Vite 8.2.2 (2026-08-30). CI memakai Node 24. Catatan: sandbox lokal memblokir spawn proses Vite (EPERM) — build diverifikasi dengan izin penuh; di GitHub Actions tidak ada kendala ini.
2. **Trademark (informal):** pencarian web tidak menemukan produk "CuanRadar" yang sudah ada di ruang reward Indonesia. **TODO:** cek formal DJKI (Rp1,8jt/kelas bila lanjut) + cek ketersediaan domain (mis. cuanradar.id / cuanradar.com) saat akan go-live F2.
3. **Seed data:** 30 platform (Entertainment 5 · Shopping 6 · Wallet 10 · Lainnya 9). Semua `risk_level` adalah **estimasi awal** — wajib diverifikasi lewat rubrik 8 pemeriksaan sebelum publish (konsisten dengan prinsip "data yang dapat diverifikasi > asumsi").
4. **Estimasi harga** di dokumen berbasis data 2025 — tandai untuk re-verifikasi vendor saat F1 dimulai (terutama Supabase free limits & search API free tier).

## TODO F0 (sebelum F1)

- [ ] Cek ketersediaan domain & daftar (opsional di F0, wajib sebelum F2).
- [ ] Cek formal trademark DJKI (tunda ke F2 sesuai BUDGET.md).
- [ ] Verifikasi harga vendor & free-tier limits (Supabase, deepseek, Brave/Serper/Tavily).
- [ ] Inisialisasi git repo lokal & push ke GitHub; pastikan CI hijau di repo remote.
- [ ] Setup Supabase project (database schema awal) — mulai BUILD 1.
- [ ] Isi `last_verified_at`/status di seed setelah verifikasi rubrik pertama.
