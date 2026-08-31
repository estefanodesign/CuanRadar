**CuanRadar — Aturan AI & Rekayasa (Panduan Teknis)**

*Revisi: v3 · 2026-08-30 · Living document · Bahasa: Indonesia (konsisten dengan dokumen plan)*
*Referensi dokumen plan: `PRD-CuanRadar.md` v1.1 · `docs/ARCHITECTURE.md` v1.2 · `docs/VALIDATION_RUBRIC.md` · `docs/MONETIZATION.md` v1.3 · `docs/ROADMAP.md` · `docs/BUDGET.md`*
*Catatan sinkronisasi: saat dokumen referensi naik versi, perbarui daftar di atas dan §20 agar panduan ini selalu merujuk versi yang benar.*

---

# BAGIAN A — ATURAN INTI (Quick Rules)

## 1. Tujuan Proyek

CuanRadar adalah web-app discovery dan kalkulasi reward untuk pengguna Indonesia.

- Prefer teknologi yang stabil, matang, dan ringan.
- Jangan redesain arsitektur tanpa persetujuan eksplisit.
- Jangan mengganti teknologi yang sudah ada hanya karena ada yang lebih baru.
- Jangan pernah melakukan pencarian internet penuh jika data cache valid sudah tersedia.
- Jangan pernah meminta LLM melakukan kalkulasi yang bisa dikerjakan TypeScript dengan andal.
- Jangan pernah menampilkan klaim reward yang dihasilkan AI dan belum terverifikasi sebagai informasi terverifikasi.

## 2. Kualitas Data Reward

Setiap peluang reward menyimpan, bila tersedia:

- Nama aplikasi
- Kategori
- Tipe reward
- Nilai reward
- Syarat & ketentuan
- Minimum requirement
- Region/ketersediaan
- URL sumber
- Status verifikasi
- Timestamp verifikasi terakhir (`last_verified_at`)
- Data kalkulasi reward
- **Sumber & provenance** (hierarki sumber + asal data: database terverifikasi / cache / hasil baru)
- **Tiga sumbu status**: `verification_status`, `risk_level`, `offer_status` (detail di §20)

## 3. Aturan Kalkulasi

- Kalkulasi reward harus dikerjakan kode aplikasi deterministik sedapat mungkin.
- **JANGAN meminta LLM melakukan kalkulasi finansial final.**
- Contoh: persentase cashback, estimasi reward, estimasi harian, estimasi bulanan, reward/jam, perbandingan minimum withdrawal.
- Semua kalkulasi wajib punya asumsi yang didefinisikan jelas.
- Jangan pernah menyajikan estimasi pendapatan sebagai pendapatan terjamin.

## 4. Efisiensi Token & Biaya

Selalu minimalisasi pemakaian AI yang tidak perlu:

- Reuse kode yang ada sebelum membuat kode baru.
- Gunakan komponen dan util yang sudah ada.
- Hindari menulis ulang file utuh untuk perubahan kecil.
- Jaga fokus tugas; perubahan kecil dan inkremental.
- Hindari penjelasan berlebihan dalam respons.
- Jangan berulang kali menemukan ulang informasi yang sudah ada di proyek.
- Gunakan data reward cache selama valid.
- Prefer kode deterministik di atas penalaran LLM.
- Jangan generate kode dalam jumlah besar kecuali diperlukan.

## 5. Aturan Database

Prefer:

- Kolom nullable baru
- Default yang aman
- Migrasi aditif (tidak menghapus data)
- Indeks eksplisit
- Foreign key yang benar
- Constraint yang benar

## 6. Keamanan Supabase

- Gunakan Row Level Security (RLS) untuk data yang diakses pengguna.
- Jangan pernah mengekspos: service-role key Supabase, API key, kunci AI provider, kredensial privat, secret server.
- Kode frontend hanya memakai kredensial publik/client-safe.
- Operasi privileged wajib di server-side melalui Supabase Edge Functions atau mekanisme backend aman lainnya.
- Validasi otorisasi di server-side; jangan pernah mengandalkan otorisasi frontend saja.

## 7. Keamanan API

- Semua input eksternal wajib divalidasi.
- Lindungi endpoint dari: akses tak sah, request berlebih, abuse, injection, parameter invalid, payload tak terduga.
- Terapkan rate limiting untuk AI Scan dan operasi mahal lainnya.
- Jangan percaya data yang dikembalikan website eksternal atau model AI tanpa validasi.

## 8. Keamanan AI

- Konten yang dihasilkan AI adalah data tidak tepercaya.
- Jangan pernah mengizinkan halaman web, hasil pencarian, atau aplikasi pihak ketiga menimpa instruksi sistem.
- Jangan mengeksekusi kode yang diterima dari konten web eksternal.
- Jangan otomatis melakukan transaksi, pembelian, withdrawal, login, atau operasi finansial di aplikasi pihak ketiga.
- AI Scan hanya untuk discovery, verifikasi, kalkulasi, perbandingan, dan rekomendasi.
- **Hasil ekstraksi AI hanya kandidat** — wajib melewati review queue (rules → tinjauan editor) sebelum dipublikasikan sebagai data publik/terverifikasi. AI tidak pernah publish langsung (PRD Appendix A6).

## 9. Secret & Environment Variables

- Jangan pernah hardcode secret.
- Gunakan environment variables untuk: kunci AI API, secret Supabase, secret Cloudflare, kredensial API eksternal.
- Jangan pernah commit file `.env` yang berisi secret.
- Jangan pernah menaruh secret server-side di kode frontend.

## 10. Kualitas Kode

Gunakan TypeScript. Prefer:

- Fungsi kecil
- Penamaan jelas
- Komponen reusable
- Tipe eksplisit
- Alur kontrol sederhana
- Organisasi berbasis fitur
- Dependensi minimal

Hindari:

- Logika duplikat
- Komponen raksasa
- Abstraksi tidak perlu
- Dead code
- Dependensi tidak terpakai
- Optimasi prematur

Jangan menulis ulang kode yang bekerja tanpa alasan yang jelas.

## 11. UI/UX

CuanRadar harus terasa:

- Sederhana namun menarik
- Cepat
- Tepercaya
- Mobile-first
- Mudah dipahami

- Informasi reward wajib transparan.
- Jangan gunakan klaim pendapatan yang menyesatkan.
- Jangan buat dark patterns.
- **UI copy dalam Bahasa Indonesia** (bahasa proyek).
- **Tampilkan provenance hasil**: "database terverifikasi" vs "hasil pencarian baru — menunggu review" (PRD Appendix A9).
- **Tautan afiliasi/referral wajib berlabel** ("tautan afiliasi"); ranking tidak pernah dipengaruhi faktor komersial (MONETIZATION §1).

## 12. Penanganan Error

- Jangan pernah diam-diam mengabaikan error.
- Sediakan: pesan error ramah pengguna, logging server-side yang layak, perilaku fallback aman, retry hanya bila layak.
- Kegagalan AI/API tidak boleh merusak data reward.
- Jika AI Scan gagal, kembalikan hasil cache/terverifikasi sebelumnya bila aman.

## 13. Workflow Pengembangan

Sebelum mengimplementasikan fitur:

1. Inspeksi kode yang ada.
2. Identifikasi komponen/fungsi reusable.
3. Pahami struktur database terkait.
4. Buat perubahan terkecil yang sesuai.
5. Tes fungsionalitas yang terpengaruh.
6. Perbaiki error sebelum pindah ke pekerjaan lain.

Jangan mengubah file yang tidak terkait. Jangan mengubah banyak area arsitektur sekaligus dalam satu tugas.

## 14. Aturan Dependensi

Sebelum menambah dependensi:

1. Cek apakah fungsionalitas proyek yang ada bisa menyelesaikan masalah.
2. Cek apakah dependensi itu benar-benar diperlukan.
3. Prefer paket matang dan stabil.
4. Hindari dependensi yang hanya menyediakan fungsionalitas trivial.

Jangan install paket hanya karena populer atau direkomendasikan model AI.

## 15. Deployment

Arsitektur deployment yang dituju (docs/ARCHITECTURE.md §1):

```
Frontend       → Cloudflare Pages
Security/CDN   → Cloudflare
Backend/DB     → Supabase
API entry      → Supabase Edge Functions (hanya menerima & meng-enqueue — TIDAK mengeksekusi scan panjang)
Scan execution → background queue (pg-boss di Supabase) dengan staged jobs per tahap
Scheduled jobs → pg_cron di Supabase
```

Jangan memperkenalkan platform deployment lain kecuali diminta eksplisit.

## 16. Keselamatan Produksi

Sebelum fitur dianggap selesai:

- Cek autentikasi
- Cek otorisasi
- Cek RLS
- Cek validasi input
- Cek error handling API
- Cek rate limiting bila perlu
- Cek secret
- Cek keamanan migrasi database
- Cek responsivitas mobile
- Cek loading/error/empty states

Jangan pernah mengorbankan keamanan demi kecepatan pengembangan.

## 17. Disiplin Perubahan

Saat diminta memodifikasi fitur:

- Pertahankan fungsionalitas existing kecuali diminta mengubahnya.
- Jangan hapus fitur yang bekerja.
- Jangan redesain UI yang tidak terkait.
- Jangan ganti tech stack.
- Jangan ganti library tanpa justifikasi.
- Jangan buat implementasi duplikat.

Jika perubahan arsitektur benar-benar diperlukan, jelaskan alasannya sebelum melakukannya.

---

# BAGIAN B — STANDAR JANGKA PANJANG

## 18. Kesehatan & Keamanan Kode Jangka Panjang

Aplikasi harus dibangun sebagai produk jangka panjang yang terawat, bukan sekadar prototipe yang berfungsi. Bagian ini memperdalam aturan inti (cross-ref: §6, §7, §8, §9, §10, §12, §14, §16) dengan fokus pada hal yang belum tercakup.

### Clean Code (perdalam §10)

- Jaga kode bersih, mudah dibaca, prediktabel, dan terstruktur konsisten.
- Nama deskriptif untuk file, fungsi, variabel, komponen, objek database, dan endpoint API.
- Fungsi/komponen kecil dengan satu tanggung jawab; hindari nesting dalam; hindari duplikasi logika bisnis.
- Buat util/komponen reusable saat repetisi bermakna.
- Hapus dead code, import tak terpakai, variabel tak terpakai, kode debug sementara, komentar usang.
- Jangan tinggalkan TODO untuk isu keamanan/reliabilitas kritis kecuali didokumentasikan dan disetujui.
- Prefer kode sederhana dan eksplisit di atas kode "cerdas" atau abstraksi berlebihan.

### Maintainability

- Pertahankan pemisahan jelas: UI, logika bisnis, akses data, layanan eksternal, operasi sensitif keamanan.
- Jangan taruh logika bisnis di dalam komponen UI bila bisa dipisah bersih.
- Isolasi integrasi API eksternal di balik interface service yang terdefinisi.
- Jaga integrasi AI provider replaceable (abstraksi `AIProvider`) agar tidak terkunci satu provider.
- Hindari coupling tak perlu antar modul; pertahankan backward compatibility bila praktis.
- Pahami dependensi & side effect sebelum memodifikasi kode yang ada.

### Pencegahan Technical Debt

- Jangan gunakan hack sementara sebagai solusi permanen.
- Jangan suppress error hanya agar build lolos.
- Jangan nonaktifkan security check demi menyelesaikan masalah development.
- Jangan bypass type safety dengan `any` tak perlu, cast tak aman, atau error TypeScript yang diabaikan.
- Jangan buat implementasi duplikat dari fitur yang sudah ada.
- Jangan akumulasi dependensi tak perlu.
- Saat memperbaiki bug, perbaiki akar masalah, bukan menutupi gejalanya.

### Security by Design (perdalam §6–§9, §16)

- Keamanan dipikirkan saat implementasi, bukan hanya sebelum deployment. Terapkan defense-in-depth.
- Setiap fitur baru dievaluasi: autentikasi, otorisasi, validasi input, output encoding, data exposure, rate limiting, skenario abuse, risiko injection, privilege escalation, paparan data sensitif, abuse API pihak ketiga, resource exhaustion, kebutuhan logging & monitoring.
- Ikuti prinsip OWASP dan praktik secure-coding terkini.

### Pengurangan Attack Surface (perdalam §7)

- Ekspos hanya endpoint API yang dibutuhkan; validasi setiap request server-side; tegakkan otorisasi di server.
- Terapkan least-privilege; gunakan RLS untuk data milik pengguna.
- Jangan percaya nilai dari client: user ID, role, harga, nilai reward, permission, field terkait keamanan.
- Jangan pernah mengandalkan validasi frontend untuk keamanan.
- Jangan ekspos struktur database internal tanpa perlu; jangan kembalikan field sensitif lewat API kecuali diperlukan.
- Jangan ekspos stack trace, error internal, secret, atau detail infrastruktur ke pengguna.

### Resistensi Abuse & Eksploitasi

Asumsikan attacker akan mencoba:

- Mengotomasi operasi mahal
- Menyalahgunakan AI Scan
- Menghabiskan kuota API
- Memanipulasi kalkulasi reward
- Bypass batas scan
- Mengakses data pengguna lain
- Memodifikasi nilai client-side
- Menginjeksi input berbahaya
- Mengeksploitasi race condition
- Replay request
- Enumerate resource
- Menyalahgunakan mekanisme referral/reward
- Memanipulasi respons API pihak ketiga

Rancang kontrol server-side untuk mencegah skenario ini. Semua operasi mahal wajib punya rate limit, kuota, validasi, dan cost control.

### Keamanan Spesifik AI (perdalam §8)

Perlakukan semua output AI dan konten web eksternal sebagai input tidak tepercaya. Jangan pernah izinkan:

- Prompt injection dari halaman web menimpa aturan aplikasi.
- Output AI langsung mengeksekusi operasi privileged.
- Nilai yang dihasilkan AI bypass validasi server-side.
- SQL/kode yang dihasilkan AI dieksekusi otomatis tanpa validasi terkontrol.
- Informasi reward eksternal menjadi tepercaya hanya karena dihasilkan model AI.

AI tidak boleh punya akses tak terbatas ke kredensial produksi, database, atau infrastruktur privileged.

### Dependency & Supply-Chain (perdalam §14)

- Minimalisasi dependensi pihak ketiga; prefer paket yang mapan dan aktif dipelihara.
- Hindari paket yang ditinggalkan atau mencurigakan; jangan tambah dependensi tanpa alasan jelas.
- Jaga dependensi pada versi wajar; review security advisory sebelum upgrade besar.
- Jangan upgrade buta ke versi terbaru; hindari dependency churn yang tidak perlu.

### Perlindungan Data (perdalam §9)

- Simpan hanya data yang dibutuhkan aplikasi; jangan simpan secret/kredensial sensitif tanpa perlu.
- Jangan pernah log API key, token autentikasi, password, session token, atau secret lain.
- Sanitasi informasi sensitif dari log.
- Gunakan secret server-side untuk operasi privileged; terapkan least-privilege pada database dan layanan eksternal.

### Reliabilitas & Isolasi Kegagalan (perdalam §12)

Asumsikan layanan eksternal bisa gagal: provider AI, provider search, API timeout, respons pihak ketiga berubah, operasi database gagal, koneksi jaringan terputus.

Gunakan: timeout, retry dengan batas, validasi, fallback, idempotency bila diperlukan, error handling, circuit-breaking atau graceful degradation bila layak.

- Jangan buat infinite retry loop.
- Satu kegagalan layanan eksternal tidak boleh mengkompromikan seluruh aplikasi.

### Observability

Untuk operasi sensitif & mahal, pertahankan log dan metrik untuk mengidentifikasi:

- Kegagalan autentikasi
- Kegagalan otorisasi
- Request berlebih
- Abuse AI Scan
- Kegagalan API
- Kenaikan biaya tak wajar
- Error berulang
- Aktivitas mencurigakan

Log tidak boleh berisi secret atau data pribadi pengguna yang tidak perlu.

### Pre-Release Security Check (perdalam §16)

Sebelum fitur dianggap production-ready, verifikasi:

- Tidak ada secret terekspos
- Policy RLS benar
- Otorisasi ditegakkan server-side
- Input divalidasi
- Endpoint API terlindungi layak
- Operasi mahal punya rate limit & kuota
- Pesan error tidak membocorkan informasi internal
- Dependensi tidak membawa critical vulnerability yang diketahui
- Nilai client-side tidak bisa menimpa aturan bisnis server
- Output AI tidak bisa bypass kontrol keamanan aplikasi

### Prinsip Jangka Panjang

Setiap implementasi harus menjawab dua pertanyaan:

1. "Apakah ini bekerja benar hari ini?"
2. "Apakah ini tetap aman, dapat dipahami, dan terawat setelah codebase, pengguna, data, dependensi, dan attack surface bertumbuh?"

Prefer solusi yang tetap aman & terawat seiring evolusi CuanRadar. Jangan optimasi kecepatan jangka pendek dengan mengorbankan kualitas atau keamanan jangka panjang.

---

## 19. Aturan Final

Prioritas:

1. Correctness
2. Security
3. Reliability
4. Maintainability
5. Cost efficiency
6. Performance
7. Simplicity

Bangun solusi production-capable paling sederhana yang memenuhi kebutuhan. Jangan over-engineer pilot. Jangan menambah fungsionalitas yang tidak diminta.

---

## 20. Referensi Plan Wajib (untuk implementasi)

Aturan di bawah berasal dari plan yang disetujui (PRD v1.1 + docs/*). Kode wajib mengimplementasikannya; jangan menciptakan model alternatif.

### Model data & status

- **Tiga sumbu independen:** `verification_status` (VERIFIED / PARTIALLY VERIFIED / UNVERIFIED) · `risk_level` (RENDAH / SEDANG / TINGGI / TERINDIKASI_SCAM) · `offer_status` (ACTIVE / EXPIRED / SCHEDULED). Jangan digabung jadi satu field.
- TERINDIKASI_SCAM tidak pernah muncul di rekomendasi (blokir + peringatan saja). UNVERIFIED tidak masuk Top Recommendations (PRD §29).
- Hierarki sumber disimpan per klaim: ★★★★★ Official · ★★★★ Official Store · ★★★ Trusted External · ★★ Community · ★ Unknown (PRD §27).
- Entitas: `reward_apps`, `reward_offers`, `reward_sources`, `verification_records`, `reward_history`, `payout_reports`, `community_reports`, `review_queue_items`, `scan_history`, `scan_credits`, `user_preferences`, `user_saved_apps` (PRD §59).
- **Currency: simpan IDR sebagai integer minor unit (sen)** — jangan pernah floating point untuk uang (ARCHITECTURE §3).
- Bukti payout: `payout_reports` (≥1 laporan independen untuk klaim VERIFIED) dan `community_reports` dengan moderasi bertingkat (≥2 konfirmasi + editor) (PRD Appendix A2).

### Scoring (kode deterministik — VALIDATION_RUBRIC §5)

- **Enam faktor:** Reward Potential 25% · Verification 20% · Reward/Effort 20% · Platform Risk 15% · Accessibility 10% · Reward Stability 10%.
- Catat `bobot_version`; data kurang → netral (0,5), tidak pernah nol dan tidak pernah dikarang. Kalkulasi = kode, bukan LLM (PRD §22).

### Scan engine

- State machine: QUEUED → CHECKING_CACHE → DISCOVERING → FILTERING → EXTRACTING → VERIFYING → CALCULATING → RANKING → COMPLETED (atau CACHE_COMPLETED / LIMITED / FAILED) (PRD §62).
- Eksekusi: staged queue jobs (satu job per tahap: discovery → extraction → verification → scoring), BUKAN satu fungsi panjang — aman terhadap batas waktu eksekusi serverless (ARCHITECTURE §2).
- Discovery Lock TTL: Quick 60 dtk, Deep 10 menit, dengan lease + auto-release (PRD §16 v1.1).
- Concurrency: maksimal 5 Deep Scan; sisanya QUEUED atau dilayani cache (PRD §45).
- Rate limit: 1 scan aktif per user; 5 request scan / 10 menit (PRD §44).
- **Kuota per plan** (MONETIZATION §3.1): Quick — Free 3, Pro 7, Pro+ 15 per hari · Deep — Free 1, Pro 3, Pro+ 8 per hari · Compare — Free 4, Pro 8, Pro+ 16 offer.
- Cache key: `country-category-scan_type-filter_hash`; TTL: normal 72 jam, popular 24 jam, flash 6–24 jam, expired immediate (PRD §36–37); job terjadwal harian menandai EXPIRED.
- Budget Governor: 0–70% NORMAL · 70–85% MORE CACHING · 85–95% LIMIT DEEP SCAN · 95–100% EMERGENCY · 100% NO NEW DEEP SCAN (PRD §41).
- Budget dipecah LLM vs Search; log biaya per scan: search requests, AI requests, token, model, estimasi biaya, cache hit (PRD §40, §43).

### Konten & trust

- Review queue: ekstraksi AI → rules otomatis (skema, threshold, dedup) → tinjauan editor → publish. AI tidak pernah publish langsung (PRD Appendix A6).
- Siklus re-verifikasi: 30 hari; setiap record membawa `last_verified_at` (VALIDATION_RUBRIC §4).
- Konten terlarang di katalog: reward "investasi/staking/mining" berjanji return, pinjaman predator, gambling (PRD Appendix A8).
- Tampilkan provenance di UI; jangan pernah menyajikan klaim AI belum terverifikasi sebagai informasi terverifikasi (PRD §46, Appendix A9).
- Disclosure afiliasi & no pay-for-rank (MONETIZATION §1). Subscription Pro hanya membuka kapasitas, tidak pernah posisi ranking.
