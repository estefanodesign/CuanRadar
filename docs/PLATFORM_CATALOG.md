# CuanRadar — Katalog Platform

*Revisi: v1.1 · Living document · Daftar awal untuk pilot (pre-seed F0)*

## 1. Taksonomi & Aturan

**Empat kategori:** Entertainment · Shopping · Digital Wallet · Kategori Lainnya.

**Aturan allowlist (kunci):**
- Platform hanya masuk katalog lewat **allowlist** — tidak ada auto-listing dari hasil AI tanpa review (PRD Appendix A6).
- Setiap platform wajib punya data minimal: nama, developer/company_identity, kategori, website resmi, store URL, jenis reward, metode payout, minimum payout, `risk_level` (hasil rubrik, bukan tebakan), `last_verified_at`.
- **Dilarang masuk katalog:** investasi/staking/mining berjanji return, pinjaman predator, gambling (PRD Appendix A8).
- Status platform: `MVP` (wajib terisi di F1) · `Fase 2` (target berikutnya) · `Pantau-saja` (belum dievaluasi penuh).
- `risk_level` di tabel ini adalah **estimasi awal untuk kurasi** — wajib diverifikasi lewat rubrik 8 pemeriksaan sebelum publish (`docs/VALIDATION_RUBRIC.md`).

## 2. Entertainment

| Platform | Jenis Reward | Metode Payout | Risk (est.) | Status |
|---|---|---|---|---|
| Melolo | Saldo (nonton drama pendek) | DANA | Sedang–Tinggi (payout belum konsisten terbukti) | MVP |
| ReelRich | Saldo (nonton drama pendek) | DANA | Sedang–Tinggi | MVP |
| SnackVideo | Koin/voucher | Voucher/poin | Sedang | Fase 2 |
| TikTok (coin/affiliate) | Koin, komisi | Saldo/voucher | Rendah–Sedang | Fase 2 |
| Aplikasi baca novel berhadiah (Fizzo & sejenis) | Saldo/poin | E-wallet | Sedang–Tinggi | Fase 2 |
| Aplikasi kuis/game kasual berhadiah | Saldo/voucher | E-wallet | Sedang | Fase 2 |
| Watch/read-to-earn baru yang muncul | Bervariasi | Bervariasi | **Tugas radar: deteksi dini + evaluasi** | Pantau-saja |

## 3. Shopping

| Platform | Jenis Reward | Metode Payout | Risk (est.) | Status |
|---|---|---|---|---|
| Shopee (Shopee Points/Coins) | Poin, cashback koin | Potongan transaksi | Rendah | MVP |
| Tokopedia (Poin) | Poin, voucher | Potongan transaksi | Rendah | MVP |
| Blibli (rewards/cashback) | Poin/cashback | Potongan transaksi | Rendah | MVP |
| Lazada (LazCoins) | Koin | Potongan transaksi | Rendah | Fase 2 |
| TikTok Shop | Voucher/cashback | Potongan transaksi | Rendah–Sedang | Fase 2 |
| JD.id & marketplace lain | Poin | Potongan transaksi | Rendah | Fase 2 |

## 4. Digital Wallet

| Platform | Jenis Reward | Metode Payout | Risk (est.) | Status |
|---|---|---|---|---|
| ShopeePay | Cashback, koin | Saldo ShopeePay | Rendah | MVP |
| GoPay | GoPay Coins, promo | Saldo GoPay | Rendah | MVP |
| DANA | DANA Points, promo | Saldo DANA | Rendah | MVP |
| OVO | OVO Points | Potongan/saldo | Rendah | MVP |
| LinkAja | Poin | Potongan/saldo | Rendah | MVP |
| SeaBank, Jago, Jenius, Blu | Bunga/cashback | Rekening | Rendah | Fase 2 |
| Flip, Nobu (cashback debit) | Cashback | Rekening | Rendah | Fase 2 |

**Batasan wallet:** CuanRadar tidak pernah mengakses akun wallet pengguna, membaca saldo, atau melakukan transaksi (PRD §9, §48).

## 5. Kategori Lainnya (rekomendasi — allowlist)

| Platform | Jenis Reward | Metode Payout | Risk (est.) | Status |
|---|---|---|---|---|
| Telkomsel Poin | Poin → voucher/saldo | Voucher | Rendah | Fase 2 |
| myXL / XL Rewards | Poin → voucher | Voucher | Rendah | Fase 2 |
| IM3 / Tri Poin | Poin → voucher | Voucher | Rendah | Fase 2 |
| MyPertamina | Poin → voucher | Voucher | Rendah | Fase 2 |
| GarudaMiles | Miles | Tiket/upgrade | Rendah | Fase 2 |
| Supermiles (GoTo) | Poin | Voucher/saldo | Rendah | Fase 2 |
| GrabRewards | Poin | Voucher/saldo | Rendah | Fase 2 |
| Survey berbayar (Rakuten Insight, Toluna, Views, Populix) | Saldo/voucher per survei | E-wallet/bank | Rendah–Sedang (likuiditas rendah) | Fase 2 |
| Poin kartu bank (myBCA, Livin', BRImo, CIMB Niaga) | Poin | Potongan tagihan/voucher | Rendah | Fase 2 (segmen lanjutan) |
| Convert pulsa (kategori aplikasi konversi pulsa → uang) | Uang | E-wallet/bank | Sedang (perlu verifikasi ketat) | Pantau-saja |

## 6. Prosedur Penambahan Platform

1. Kandidat dari AI Scan / komunitas / editor masuk **review queue**.
2. Evaluasi rubrik 8 pemeriksaan (VALIDATION_RUBRIC.md) → tentukan `risk_level` & `verification_status`.
3. Verifikasi payout (`payout_reports` minimal 1 sumber independen untuk status VERIFIED).
4. Setujui oleh editor → publish dengan `last_verified_at`.
5. Re-verifikasi terjadwal (30 hari) + laporan komunitas meng-update status.

*Tabel di atas adalah titik awal kurasi, bukan hasil verifikasi final.*
