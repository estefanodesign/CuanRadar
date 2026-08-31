# CuanRadar — Risiko & Mitigasi

*Revisi: v1.1 · Living document*

## 1. Matriks Risiko

| # | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| 1 | Klaim hukum platform (trademark, konten) | Sedang | Nama dagang umum & fakta terverifikasi; halaman detail hanya fakta + tautan resmi; disclaimer afiliasi eksplisit; review legal sebelum publish konten berskala |
| 2 | Scraping melanggar ToS | Tinggi | Kebijakan: hanya halaman publik / sumber yang ToS-nya mengizinkan; TANPA bypass anti-bot; kurasi manual sebagai sumber utama; otomasi hanya monitoring halaman promo resmi (PRD §9, Appendix A9) |
| 3 | Akurasi data & payout | Tinggi | Setiap klaim berlabel `last_verified_at`; UNKNOWN jujur; kombinasi sumber resmi + payout reports + konfirmasi silang; re-verifikasi 30 hari; KPI false-positive <10%, false-negative <1% |
| 4 | Trust rusak (terlihat bias iklan) | Tinggi | Pemisahan editorial/komersial; label afiliasi; audit bulanan; publikasi metodologi; provenance di UI |
| 5 | Tanggung jawab atas keputusan pengguna | Sedang | Disclaimer "bukan nasihat keuangan/investasi"; semua angka = estimasi berlabel; larangan katalog investasi/staking/mining |
| 6 | Regulasi (UU PDP; OJK bila konten menyentuh instrumen keuangan) | Sedang–Tinggi | Minimalkan data pribadi; jangan simpan PIN/OTP/saldo; review hukum sebelum Build 1 (auth) & sebelum konten keuangan; kebijakan privasi publik |
| 7 | Kompetisi (situs daftar aplikasi) | Sedang | Diferensiasi: skor terverifikasi, kalkulator per-menit, dua sumbu penilaian, provenance, data payout |
| 8 | Kualitas UGC (laporan komunitas) | Sedang | Moderasi bertingkat (≥2 konfirmasi + editor); rate limit; verifikasi akun; sistem reputasi |
| 9 | Biaya AI melonjak | Sedang | Budget Governor 5 level; sub-budget LLM/Search; search free-tier; target cost per scan; monitoring per scan |
| 10 | Scan lock macet / duplikasi | Rendah | Discovery Lock per tipe scan + lease + auto-release; queue dengan retry & dead-letter |
| 11 | Prompt injection dari halaman web | Sedang | Web content = untrusted input; ekstraksi skema ketat; output divalidasi; truncate content; retry terbatas (PRD §46) |

## 2. Checklist Legal per Fase

**F0 — Fondasi**
- [ ] Cek trademark "CuanRadar" (nama & domain).
- [ ] Siapkan disclaimer produk (bukan nasihat keuangan/investasi) untuk semua halaman.

**F1 — Pilot MVP (sebelum Build 1: auth & profil)**
- [ ] Review UU PDP: data apa yang dikumpulkan, dasar hukum, kebijakan privasi, minimisasi data.
- [ ] Pastikan tidak ada penyimpanan PIN/OTP/saldo/data payout sensitif.
- [ ] Pastikan model kurasi manual (sumber utama) tidak melanggar ToS platform.

**F2 — Growth (komunitas, afiliasi, iklan)**
- [ ] Persetujuan hukum untuk program afiliasi & iklan; template disclosure final.
- [ ] Review UGC: ToS komunitas, syarat moderasi, mekanisme hapus konten.

**F3 — Scale (konten keuangan, B2B, internasional)**
- [ ] Bila konten menyentuh instrumen keuangan: review kewenangan/izin (OJK) & batasi jenis konten.
- [ ] B2B: pastikan data insights agregat & anonim (bukan data pribadi).

## 3. Prinsip saat Terjadi Insiden

1. Transparansi dulu: pengumuman publik bila ada data salah / status salah.
2. Koreksi data & tandai `last_verified_at` baru.
3. Pelajari pola → perbaiki rubrik/prosedur (living document).
4. Catat insiden di log revisi dokumen ini.
