# CuanRadar — Model Monetisasi

*Revisi: v1.3 · Living document · Status keputusan: **DISETUJUI founder** (keputusan final)*
*Revisi v1.3: keputusan final — kuota Compare 4/8/16, Quick Scan 3/7/15, Deep Scan 1/3/8; harga anchor Pro Rp39.000/bln + annual Rp390.000; trial 3 hari + refund 7 hari; uji A/B Rp29.000 vs Rp39.000 di bulan pertama F2. Model pembayaran: bayar per periode via QRIS/e-wallet + opsi autodebit (lihat §4).*

## 1. Prinsip Etika (tidak bisa dinegosiasi)

1. **Tidak ada pay-for-rank** — peringkat/skor tidak pernah dapat dibeli.
2. **Semua tautan referral/afiliasi wajib berlabel** "tautan afiliasi" — tidak ada link tersembunyi.
3. **Konten partner wajib diberi label** visual dan tidak bercampur dengan hasil organik.
4. **Audit berkala** (bulanan): verifikasi bahwa skor & urutan tidak terpengaruh komersial; hasil audit dipublikasikan.
5. **Credit system adalah cost-control, bukan revenue** (PRD §39, direvisi v1.2 — lihat §3.3).
6. CuanRadar tidak menjual data pengguna; data payout sensitif tidak disimpan.
7. **Pro tidak pernah membeli posisi di ranking** — hanya membuka kapasitas (kuota scan, alert, tracker).

## 2. Tahapan Pendapatan

| Fase | Model | Keterangan |
|---|---|---|
| **F1 (MVP)** | Tanpa iklan; afiliasi berlabel OPSIONAL | Fokus membangun trust & data; link "Open" mengarah ke tautan resmi; komisi (bila ada) diungkapkan |
| **F2 (Growth)** | **Pilot subscription (Pro)** + afiliasi berlabel + iklan native | Subscription sebagai sumber pendapatan utama yang scalable; afiliasi & iklan sebagai pendukung |
| **F3 (Scale)** | Pro + Pro+ (power user) + B2B data insights | Ekspansi tier, annual plan, B2B insights agregat anonim untuk brand |

## 3. Subscription Plan

### 3.1 Tier & Kuota

Model kuota **harian** (lebih sederhana untuk pengguna daripada kuota bulanan), diinternal tetap memakai "credit" (1 Quick = 1 credit, 1 Deep = 5 credits):

| Fitur | **Free** | **Pro** | **Pro+** *(F3)* |
|---|---|---|---|
| Harga | Rp0 | **Rp39.000/bln** · **Rp390.000/thn** (≈Rp32.500/bln) | Rp79.000/bln |
| Quick Scan | 3×/hari | 7×/hari | 15×/hari |
| Deep Scan | 1×/hari | 3×/hari | 8×/hari |
| Tracker (saved apps + earning) | 5 entri | Tanpa batas | Tanpa batas |
| Alert penawaran | Email mingguan | Email real-time | Email + push real-time |
| Compare | 4 offer | 8 offer | 16 offer |
| Ekspor data | — | CSV bulanan | CSV + API |
| Batch/daily usage | 1×/bln | 5×/bln | 20×/bln |
| **Harga efektif** | Rp0 | ≈Rp1.300/hari | ≈Rp2.600/hari |

**Rasional harga & kuota:** produk niche utilitas → harga di bawah streaming, tapi cukup menutup biaya AI + margin (anchor Rp39rb/bln; analisis kewajaran di §3.4). **Strategi "generous":** Compare = komputasi murni (biaya marginal ~0) → dibuat besar (4/8/16) sebagai penarik perhatian pengguna Indonesia yang rajin mengerjakan reward; Quick Scan kebanyakan cache-hit (murah) → moderat (3/7/15); pembeda & cost driver utama tetap Deep Scan (1/3/8).

### 3.2 Benchmark Harga Indonesia (riset 2025)

| Layanan | Harga/bln | Sumber |
|---|---|---|
| WhatsApp Plus (aplikasi niche) | Rp13.900 | [sentrapos](http://www.sentrapos.co.id/whatsapp-plus-resmi-hadir-di-indonesia-harga-rp13900-fitur-premium/) |
| Viu / streaming video-musik | ±Rp39.000–59.000 | [tirto](https://tirto.id/biaya-langganan-platfrom-streaming-video-musik-lebaran-2025-g9U9) |
| Spotify | ±Rp54.990 | [tirto](https://tirto.id/biaya-langganan-platfrom-streaming-video-musik-lebaran-2025-g9U9) |
| Netflix (mobile) | ±Rp54.000–65.000 | [tirto](https://tirto.id/biaya-langganan-platfrom-streaming-video-musik-lebaran-2025-g9U9) |

**Kesimpulan benchmark:** rentang premium konsumen Indonesia Rp13.900–69.000. **Rp39.000/bln** berada di titik tengah bawah — cukup untuk niche utility dengan nilai "waktu = uang".

### 3.3 Rekonsiliasi dengan PRD §39 (direvisi v1.2)

PRD §39 (Free = 40 credits/bln, Quick ≤3/hari, Deep ≤1/hari) **diganti menjadi kuota harian per plan** di atas. Konsekuensi: Free kini = 90 Quick + 30 Deep per bulan (lebih besar dari 40 credits lama) — wajar karena Free adalah funnel menuju Pro, dan cost-control tetap dijaga oleh Budget Governor + rate limit teknis (5 scan/10 menit, PRD §44) yang TIDAK berubah.

### 3.4 Analisis Kewajaran Harga Rp39.000

**Estimasi potensi reward pengguna rajin Indonesia (konservatif, 2025):**

| Sumber | Estimasi/bln |
|---|---|
| Cashback & poin belanja (Shopee/Blibli/Tokopedia, belanja rutin) | Rp20.000–80.000 |
| Promo e-wallet (GoPay/ShopeePay/DANA/OVO) | Rp10.000–50.000 |
| Poin operator/miles (Telkomsel, MyPertamina, dll.) | Rp5.000–20.000 |
| Survey berbayar (sangat rajin, kuota terbatas) | Rp30.000–100.000 |
| Watch/read-to-earn (setelah validasi anti-scam) | Rp10.000–60.000 |
| **Total realistis** | **±Rp75.000–300.000** (median ±Rp150.000) |

**Nilai inkremental CuanRadar:** seleksi offer lebih baik + hemat waktu 15–30 mnt/hari + hindari scam → efek ±20–30% dari total reward = **±Rp15.000–90.000/bln** (median ±Rp30–45rb).

**Kesimpulan kewajaran Rp39.000:**
- **Wajar untuk segmen menengah-atas** (reward >Rp150rb/bln): nilai inkremental ≥ harga.
- **Terasa berat untuk earner rendah** (<Rp100rb/bln): nilai inkremental bisa < harga.
- Karena itu harga dibungkus pengurang risiko persepsi: **trial Pro 3 hari** + **refund 7 hari** + **annual Rp390.000 (≈Rp32.500/bln)**.
- **Rekomendasi:** pertahankan Rp39.000 sebagai anchor; di bulan pertama F2 jalankan **uji A/B Rp29.000 vs Rp39.000** (ukur konversi & churn); harga final ditentukan data. Menurunkan harga nanti (framing "promo peluncuran") lebih mudah daripada menaikkannya.

**Unit economics Deep Scan (pengaman margin):** Pro 3 Deep/hari × 30 hari = 90 × ±US$0.008–0.022 ≈ US$0.72–1.98 (~Rp12.000–33.000) vs revenue Rp39.000 → margin tipis di pemakaian maksimal. Karena itu batas Deep 3/hari + Budget Governor + KPI "biaya AI per subscriber ≤40% ARPU" wajib dipertahankan.

## 4. Metode Pembayaran — Riset & Rekomendasi (paling reliable untuk Indonesia)

### 4.1 Lanskap pembayaran Indonesia (temuan riset)

1. **QRIS** — standar nasional, scan & bayar, paling familiar; pembayaran **one-time** (tidak auto-recurring).
2. **E-wallet autodebit (tokenization)** — GoPay punya fitur repeat payment resmi ([gopay.com](https://www.gopay.com/en/benefits/possibility-repeat-payment)); Xendit/Midtrans mendukung subscription + tokenization e-wallet (GoPay/OVO/DANA/ShopeePay) ([Xendit Linking UI](https://help.xendit.co/hc/id/articles/20659355817369-Bagaimana-mengatur-metode-pembayaran-yang-ada-pada-Xendit-Linking-UI-dari-Subscriptions), [eWallet tokenization](https://help.xendit.co/hc/en-us/articles/11925080085017-What-is-eWallet-tokenization)). Autodebit sudah terbukti di pasar (contoh: BPJS via Xendit autodebet, Netflix via e-wallet ([disway](https://radarbanyumas.disway.id/ekonomi/read/133542/langganan-netflix-pakai-dompet-digital-gopay-dana-atau-ovo/15))).
3. **Virtual Account / bank transfer** — untuk pengguna non-e-wallet; kurang mulus untuk recurring.
4. **Merchant of Record global (Paddle/LemonSqueezy)** — TIDAK direkomendasikan: fokus kartu internasional, cakupan QRIS/e-wallet lokal minim, fee lebih tinggi.
5. **Gateway lokal:** Midtrans, Xendit, Tripay (QRIS + e-wallet + VA). Tripay populer untuk top-up one-time; Midtrans/Xendit punya API subscription/recurring yang proper.

### 4.2 Rekomendasi: model paling reliable + UX terbaik

**Model: "Langganan periode 30 hari — bayar dulu (QRIS/e-wallet one-time) + opsi autodebit e-wallet".**

| Kriteria | Autodebit murni | **Model rekomendasi (bayar per periode + opsi autodebit)** |
|---|---|---|
| Reliabilitas | Gagal bila saldo kosong, consent expired, limit e-wallet | Tinggi — pembayaran eksplisit tiap periode; kegagalan = reminder, bukan downgrade mendadak |
| UX Indonesia | Familiar untuk streaming | Paling familiar: pola "isi paket" seperti pulsa/QRIS |
| Kompleksitas teknis | Tokenization + retry + dunning | Sederhana: webhook pembayaran → aktivasi instan |
| Risiko churn tidak sengaja | Tinggi (gagal autodebit = diam-diam nonaktif) | Rendah (grace period + reminder) |

**Keputusan:**
1. **Pembayaran utama: QRIS + e-wallet (GoPay, OVO, DANA, ShopeePay, LinkAja) + VA** — one-time per periode 30 hari, aktivasi instan via webhook. Ini jalur paling reliable & familiar.
2. **Opsi auto-renew: autodebit e-wallet** (GoPay/OVO/DANA/ShopeePay via tokenization) — untuk pengguna yang mau; dengan disclosure jelas & cancel 2 klik di dalam app. Gagal autodebit → fallback ke reminder bayar manual (JANGAN langsung downgrade).
3. **Gateway: Midtrans ATAU Xendit** (dukungan QRIS + e-wallet + autodebit/tokenization) — keputusan final saat F2 berdasarkan fee & onboarding; Tripay cadangan untuk top-up kredit one-time.
4. **Web app = tidak kena Google Play Billing 30%** (bukan aplikasi yang didistribusikan via Play Store; PWA via browser bebas dari kewajiban Play Billing).

### 4.3 Alur teknis pembayaran

```
User pilih Pro → pilih periode (bulanan/tahunan) → pilih metode
  → QRIS: tampilkan QR (scan & bayar) | e-wallet: redirect ke app | VA: nomor VA
  → webhook gateway → aktivasi instan (≤30 dtk) → konfirmasi + benefit unlock
  → H-3 & H-1 sebelum habis: reminder (email/push) dengan tombol perpanjang 1 langkah
  → grace period 3 hari → downgrade otomatis ke Free; data tracker dipertahankan (read-only) 90 hari
```

## 5. Alur UX Subscription (Indonesia)

1. Tombol **"Upgrade ke Pro"** konsisten di Dashboard & saat limit scan tercapai (empty state = momen tepat).
2. Halaman pricing: Bahasa Indonesia, harga IDR, bandingkan Free vs Pro dalam tabel, tombol "Coba Pro 3 hari gratis" (opsional, sekali per akun).
3. Pembayaran: **QRIS sebagai metode default pertama** (paling familiar), lalu e-wallet, lalu VA.
4. Setelah bayar: animasi sukses + daftar benefit yang aktif; tidak ada delay.
5. Sebelum habis: reminder jelas ("Langganan Anda berakhir Jumat — perpanjang 1 langkah").
6. Setelah habis: tetap bisa akses data (read-only), upgrade lagi kapan saja tanpa kehilangan history.
7. Bahasa & satuan: selalu Rupiah, format Rp1.300/hari untuk menurunkan barrier psikologis.

## 6. KPI Monetisasi (F2)

- Konversi Free → Pro: target 3–5% dari MAU.
- **Uji A/B harga** Rp29.000 vs Rp39.000 di bulan pertama F2 — keputusan harga final berdasar data konversi & churn.
- Trial → bayar: ≥40% (bila trial dipakai).
- Churn bulanan: <8% (langganan); <15% (pembayar one-time per periode) → kurangi lewat reminder & grace period.
- ARPU: ≥Rp25.000/bln per subscriber.
- **Reliabilitas pembayaran:** % pembayaran sukses >95%; % autodebit gagal <5%; rata-rata waktu aktivasi ≤60 dtk.
- Biaya AI per subscriber ≤ 40% dari ARPU (Pro harus tetap profitable secara unit ekonomi).

## 7. Template Disclosure (wajib tampil)

- Halaman detail offer: *"Tautan ini adalah tautan afiliasi — CuanRadar dapat menerima komisi tanpa biaya tambahan bagi Anda. Komisi tidak memengaruhi peringkat."*
- Halaman About/Metodologi: *"Peringkat CuanRadar ditentukan oleh rubrik publik yang deterministik (6 faktor). Mitra tidak dapat membeli posisi."*
- Halaman pricing: *"Langganan Pro membuka kapasitas, bukan posisi. Peringkat tetap hasil rubrik yang sama untuk semua pengguna."*

## 8. Batasan

- Tidak ada iklan yang meniru tombol/aksi pengguna (dark pattern).
- Tidak ada "sponsored" di Top Recommendations tanpa label tegas.
- Platform berisiko tinggi / TERINDIKASI SCAM tidak pernah menjadi mitra berbayar.
- Jika konflik kepentingan muncul (afiliasi dengan platform yang sedang dinilai), skor platform itu ditandai dan audit independen dilakukan.
- Refund policy sederhana & transparan (mis. refund 7 hari bila layanan tidak sesuai, tanpa syarat berbelit).
