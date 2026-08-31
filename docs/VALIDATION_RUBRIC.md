# CuanRadar — Rubrik Validasi & Skor

*Revisi: v1.1 · Living document · Referensi: PRD §28, §29, §32–35, Appendix A1–A2*

## 1. Dua Sumbu Penilaian

| Sumbu | Field | Nilai | Menjawab pertanyaan |
|---|---|---|---|
| Informasi | `verification_status` | VERIFIED · PARTIALLY VERIFIED · UNVERIFIED | "Apakah data/klaim ini benar?" |
| Platform | `risk_level` | RENDAH · SEDANG · TINGGI · TERINDIKASI SCAM | "Apakah platform ini aman?" |
| Lifecycle | `offer_status` | ACTIVE · EXPIRED · SCHEDULED | "Apakah penawaran masih berlaku?" |

Keduanya ditampilkan terpisah di UI (badge informasi vs badge risiko).

## 2. Rubrik 8 Pemeriksaan → risk_level

Setiap pemeriksaan dinilai: **PASS / WARN / FAIL / UNKNOWN**. Nilai default UNKNOWN (tidak mengarang).

| # | Pemeriksaan | Contoh indikator |
|---|---|---|
| 1 | Identitas legal | Developer/badan usaha terdaftar, alamat & kontak jelas, privacy policy ada |
| 2 | Riwayat payout | Bukti payout nyata (verifikasi pengguna/komunitas), konsistensi waktu cair |
| 3 | Kewajaran ekonomi | Cuan/jam wajar; janji return investasi → langsung FAIL |
| 4 | Transparansi syarat | ToS jelas, minimum payout tercantum & wajar, syarat penarikan eksplisit |
| 5 | Metode pembayaran | Via e-wallet/bank resmi; pola "transfer manual admin" → WARN/FAIL |
| 6 | Reputasi komunitas | Keluhan Play Store/forum/media, laporan penipuan |
| 7 | Pola skema | Reward berbasis aktivitas nyata; ponzi/staking/mining → FAIL kritis |
| 8 | Privasi data | Izin aplikasi berlebihan, permintaan data sensitif → WARN/FAIL |

**Penentuan risk_level (operasional):**
- **TERINDIKASI SCAM** — ≥1 FAIL kritis (payout palsu, identitas palsu, pola ponzi, janji return investasi). Diblokir dari rekomendasi; hanya muncul sebagai peringatan.
- **TINGGI** — ≥2 FAIL non-kritis atau ≥1 WARN berulang (payout tidak konsisten, identitas tidak jelas).
- **SEDANG** — ada WARN namun tidak material (syarat kurang transparan, laporan sporadis).
- **RENDAH** — ≥6 PASS, 0 FAIL, tidak ada red flag.

## 3. Definisi verification_status

- **VERIFIED** — kombinasi: (a) sumber resmi/platform ATAU ≥2 sumber tepercaya independen yang sepakat, DAN (b) bila relevan, payout report terverifikasi ≥1, DAN (c) cek silang antar-sumber konsisten.
- **PARTIALLY VERIFIED** — sebagian field terkonfirmasi, sebagian belum (mis. nominal pasti, syarat belum jelas).
- **UNVERIFIED** — bukti tidak cukup; **tidak masuk Top Recommendations** (PRD §29); hanya tampil sebagai informasi dengan peringatan.

Sumber per field dicatat dengan hierarki (PRD §27): ★★★★★ Official · ★★★★ Official Store · ★★★ Trusted External · ★★ Community · ★ Unknown.

## 4. Prosedur Re-verifikasi

- Siklus: **30 hari** (reward normal), lebih sering untuk flash promotion.
- Trigger tambahan: laporan komunitas (≥2 konfirmasi), perubahan halaman promo resmi, scheduled daily job penandaan EXPIRED (PRD Appendix A9).
- Setiap perubahan status wajib menyimpan `verification_records` (siapa, metode, bukti ref, tanggal).

## 5. Recommendation Score — 6 Faktor (PRD §32)

| Faktor | Bobot | Cara hitung (deterministik, bukan LLM) |
|---|---|---|
| Reward Potential | 25% | Normalisasi nilai × frekuensi × earning ceiling; tipe reward (cash > points likuid > voucher) |
| Verification | 20% | VERIFIED=1.0 · PARTIALLY=0.6 · UNVERIFIED=0.2 |
| Reward / Effort | 20% | Nilai efektif per jam (hanya bila data cukup); tanpa data = netral (0.5) |
| Platform Risk | 15% | RENDAH=1.0 · SEDANG=0.7 · TINGGI=0.3 · SCAM=0 (tidak direkomendasikan) |
| Accessibility | 10% | Kemudahan mulai + metode payout (e-wallet umum > bank > voucher) |
| Reward Stability | 10% | Koefisien variasi reward_history; app baru = netral (0.5) |

- Total = Σ(bobot × nilai komponen), rentang 0–100.
- `bobot_version` dicatat agar skor historis dapat dijelaskan.
- Jika data tidak cukup untuk suatu komponen → pakai nilai netral (0.5), bukan nol — dan jangan mengarang.

## 6. Aturan Rekomendasi (PRD §29, dipertegas)

1. UNVERIFIED → tidak masuk Top Recommendations.
2. risk_level TERINDIKASI SCAM → tidak pernah muncul; hanya blokir + peringatan.
3. offer_status EXPIRED → tidak ditampilkan sebagai penawaran aktif.
4. Hasil selalu menampilkan provenance & `last_verified_at`.

## 7. Contoh Perhitungan

Offer: Shopee cashback 5% (syarat jelas, payout via ShopeePay, history 5%-5%-4%, verified).
- Reward Potential (nilai sedang, frekuensi tinggi, ceiling jelas): 0.85 → 21.25
- Verification: VERIFIED → 1.0 → 20
- Reward/Effort (5% tanpa belanja tambahan, effort rendah): 0.9 → 18
- Platform Risk: RENDAH → 1.0 → 15
- Accessibility: e-wallet umum → 0.9 → 9
- Stability: konsisten → 0.9 → 9
- **Total: 92.25 / 100** — layak Top Recommendations.
