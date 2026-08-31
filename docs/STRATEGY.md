# CuanRadar — Strategi Produk & Bisnis

*Revisi: v1.1 (menyatu dengan audit PRD) · Living document*

## 1. Visi & Misi

- **Visi:** Menjadi sumber tepercaya #1 di Indonesia untuk menjawab: "Di mana setiap menit saya bisa mendapatkan uang dengan aman dan jujur?"
- **Misi:** Mengubah informasi reward yang tersebar, cepat berubah, dan penuh klaim palsu menjadi data terverifikasi, terukur, dan transparan.
- **Tagline:** *"Setiap menit waktu Anda berharga."*

## 2. Masalah & Peluang

| Aspek | Fakta |
|---|---|
| Informasi tersebar | Reward dibagikan lewat TikTok, YouTube, Facebook, website, komunitas, referral, iklan — pengguna mencari sendiri-sendiri. |
| Cepat berubah | Reward hari ini belum tentu berlaku besok. |
| Sulit dibandingkan | Rp5.000/task vs 5% cashback vs Rp20.000/minggu tidak bisa dibandingkan tanpa memahami aktivitas & effort. |
| Banyak klaim tidak jelas | Tidak semua reward resmi, masih aktif, tersedia di Indonesia, atau mudah dicairkan. |
| Ekspektasi berlebihan | Banyak klaim "pasti dapat Rp500.000/bulan" — CuanRadar menolak pola ini; semua angka berlabel *estimated*, bukan *guaranteed*. |
| Scam nyata | Klaim payout aplikasi drama pendek (mis. Melolo, ReelRich) dipertanyakan media; modus penipuan berkedok "cuan" terus bermunculan. Ini justru menegaskan kebutuhan produk: verifikasi & risiko yang transparan. |

## 3. Positioning

**CuanRadar adalah:** Reward Discovery & Recommendation Platform — pembantu pribadi penemuan peluang reward.

**CuanRadar BUKAN:** e-commerce · digital wallet · bank · platform investasi · aplikasi pinjaman · aplikasi mining · platform earning langsung. CuanRadar tidak pernah meminta password/OTP/PIN aplikasi lain, tidak membaca saldo, tidak melakukan transaksi, withdrawal, atau earning task otomatis.

**Diferensiasi:**
1. CuanScore berbasis rubrik publik & deterministik (6 faktor).
2. Kalkulator ekonomi per waktu (cuan/jam, cuan/menit) dengan asumsi transparan.
3. Dua sumbu penilaian terpisah: verifikasi informasi vs risiko platform (anti-scam).
4. Provenance hasil scan ditampilkan (database terverifikasi vs hasil baru).
5. Mobile-first PWA yang hemat biaya (database/cache-first, AI sebagai pelengkap).

## 4. Persona

| Persona | Kebutuhan utama |
|---|---|
| Mahasiswa / Gen-Z | Cuan sampingan 5–30 menit/hari dari HP; butuh daftar aman & cepat dibanding. |
| Ibu rumah tangga | Memaksimalkan cashback & poin dari belanja rutin. |
| Pekerja / karyawan | Memanfaatkan waktu luang & transaksi harian (e-wallet, belanja, telepon). |
| Power user reward | Butuh data banding antar-platform & alert perubahan syarat. |

## 5. Core Loop

`USER → SCAN → DISCOVER → FILTER → VERIFY → CALCULATE → RANK → RECOMMEND → USER CHOOSES → OPEN OFFICIAL APP`

## 6. KPI Strategis

- Platform terpantau: 30 (F1) → 50+ (F2) → 100+ (F3).
- % offer terverifikasi payout: ≥30% di akhir F2.
- **Akurasi anti-scam:** false-positive verifikasi <10% (offer ternyata EXPIRED ≤30 hari setelah diverifikasi); false-negative scam <1%.
- MAU & retensi: 10k MAU di akhir F2; churn <8%.
- AI cost: total ≤ US$10/bulan pilot (dipecah LLM US$7 / Search US$3 — lihat PRD §40–42).
- Trust: NPS ≥40 di F3.

## 7. Model Bisnis (Ringkas)

Detail di [`MONETIZATION.md`](MONETIZATION.md). Inti: F1 tanpa iklan + afiliasi berlabel; F2 iklan native + afiliasi; F3 premium + B2B. Aturan permanen: **tidak ada pay-for-rank**, semua link referral berlabel, audit berkala bahwa skor tidak terpengaruh komersial.

## 8. Batas (Non-Goals Pilot)

Automated earning · automated referral · integrasi akun pihak ketiga · payment system · transaksi wallet · browsing agent otomatis · pencarian AI tanpa batas · native mobile app · social network · marketplace antar-pengguna · personalisasi lanjutan · subscription kompleks · multi-country · multilingual. (PRD §65.)
