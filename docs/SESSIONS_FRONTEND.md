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

## Sesi 3 — 2026-08-30 · Design System Industrial Skeuomorphism (Landing hybrid)

**Konteks:** User meminta integrasi design system **Industrial Skeuomorphism** ke codebase. Keputusan: cakupan **Landing dulu**; dependensi **lucide-react saja**, animasi & shadow CSS murni; tema **light sekarang + dark disiapkan**.

### Keputusan sesi

1. **Token terpusat** — `src/styles/design-system.css`: CSS custom properties untuk palet & shadow + register ke Tailwind v4 via `@theme`, sehingga utility `bg-background`, `text-foreground`, `border-border-shadow`, `bg-accent/12`, dll. berfungsi.
2. **Light + dark prep** — `:root` (light, aktif) & `:root.dark` (palet charcoal/slate technical, disiapkan — belum diaktifkan). Cahaya konsisten top-left 45°.
3. **Hybrid** — palet Industrial + aksen `#ff4757` menggantikan tema lama (jade/gold), **radar visual & fitur landing dipertahankan** (count-up, billing toggle, konten, struktur).
4. **Zero-dependency besar** — hanya `lucide-react` (installed) dipasang; util classes CSS (`ins-card`, `ins-btn`, `ins-led`, `ins-screws`, `ins-pipe`, `ins-mono-label`, dll.) yang menyediakan pola neumorphic, tak ada Framer Motion.
5. **Font** — Inter (sans) + JetBrains Mono (angka/metadata) menggantikan Orbitron/Exo 2 (`index.html`).

### Perubahan

| # | Perubahan | File | Ref |
|---|---|---|---|
| 1 | Design tokens + base + util classes industrial | `src/styles/design-system.css` (BARU) | token §2, komponen §3 |
| 2 | Entry styles → design-system | `src/index.css` | — |
| 3 | Font Inter + JetBrains Mono | `index.html` | typography §2 |
| 4 | Landing restyle hybrid (palet industrial + radar dipertahankan) | `src/pages/LandingPage.tsx` | §1, §3 |
| 5 | Dependensi | `package.json` (`lucide-react@1.38.0`) | icon §7 |

### Keputusan desain

- **Neumorphic dual-shadow** (card/floating/pressed/recessed) via CSS vars; interaksi: button `translate-y-[2px]` + shadow invert (pressed), card `hover:-translate-y-1` + naik ke shadow-floating. Easing mekanik `--ease-mech` (spring/bounce subtle).
- **Signature elements**: corner screws (`.ins-screws` radial), vent slots (`.ins-vents`), LED status (`.ins-led` + pulse + glow), mono-label uppercase, embossed heading, noise overlay di body, panel teknis gelap (`.ins-screen`) untuk stats, pipe fisik untuk "Cara Kerja".
- **Radar hybrid**: dipertahankan tapi palet aksen (#ff4757) — tetap GPU-friendly (transform/opacity), sesuai AI_RULES §11.
- **Aksesibilitas**: `--foreground-muted` = #4a5568 (WCAG AA); fokus `ring-2 ring-accent ring-offset`; touch target ≥48px via `.ins-btn` padding; kontras text muted disesuaikan.
- **Catatan penting**: ditemukan tema lama **jade/gold + radar** di `LandingPage.tsx`/`index.css` yang belum saya lihat di awal sesi (iteration eksternal). Diputuskan hybrid: ganti palet, pertahankan radar & fitur — tidak menghapus fitur bekerja (AI_RULES §17).

### Status implementasi

- [x] Design tokens terpusat + dark prep + util classes (`design-system.css`)
- [x] Font Inter + JetBrains Mono (`index.html`)
- [x] Landing restyle hybrid — radar & fitur dipertahankan
- [x] Typecheck + build hijau (227 modul; CSS gzip 6,50 kB); semua route smoke-tested 200, radar ter-embed di landing
- [x] `lucide-react` tersedia (belum dipakai di landing — siap untuk ikon di sesi berikutnya)

### Catatan lanjutan / untuk disambungkan

- Dark mode: aktifkan dengan menambah class `dark` pada `<html>` (token sudah siap di `:root.dark`).
- **KOREKSI (Sesi 6):** `lucide-react` yang disebut di sesi ini **di-uninstall** (masalah versi) & diganti SVG inline. Jangan pakai lucide-react.
- Halaman app (Dashboard/Scan/Detail/dll.) belum di-restyle ke Industrial — target sesi berikutnya (App shell & komponen inti).
- Terjadi perubahan eksternal tak terduga di repo (chunk `supabase`, `reviewQueue`, initial gzip berubah). Biarkan sebagai pekerjaan paralel; tidak disentuh.

---

## Sesi 4 — 2026-08-30 · Dark Mode Industrial Skeuomorphism

**Konteks:** Landing sudah restyle Industrial (Sesi 3). Sesi ini mengaktifkan **dark mode** yang token-nya sudah disiapkan di `design-system.css` (`:root.dark`).

### Keputusan sesi

1. **Mekanisme tema** — `ThemeProvider` (`src/lib/theme.tsx`): mode `light | dark | system`; persist ke `localStorage` (`cuanradar.theme.v1`); ikut preferensi OS saat `system` (listener `matchMedia`); tempel/reset class `dark` pada `<html>`; sinkronkan `<meta name="theme-color">` (browser chrome) agar konsisten dengan chassis (light `#e0e5ec` / dark `#1f2329`).
2. **Toggle** — `ThemeToggle.tsx`: saklar industrial (button pressed/recessed + LED), ikon lucide Sun/Moon/Monitor, tooltip + ARIA, cycle system→light→dark.
3. **Token dark** — di `design-system.css`: palet charcoal/slate (`--background:#1f2329`, `--surface:#262b31`, `--foreground:#e0e5ec`, `--foreground-muted:#a8b2d1`, `--accent:#ff4757`), neumorphic shadow terbalik (border-shadow gelap, border-light terang).
4. **Sapuan hardcode** — elemen yang menyandang nilai terang di light di-override saat dark: `ins-embossed` (highlight putih→gelap), `.ins-screws::after` & `.ins-vents` (highlight diredam), noise overlay opasitas turun (0.55→0.35), `ins-light` hotspot diredupkan.

### Perubahan

| # | Perubahan | File |
|---|---|---|
| 1 | ThemeProvider (light/dark/system + persist) | `src/lib/theme.tsx` (BARU) |
| 2 | ThemeToggle (saklar industri + LED + lucide) | `src/components/ThemeToggle.tsx` (BARU) |
| 3 | Bungkus app dengan ThemeProvider | `src/main.tsx` |
| 4 | Pasang toggle di header landing | `src/pages/LandingPage.tsx` |
| 5 | Override dark untuk elemen hardcoded | `src/styles/design-system.css` |
| 6 | Dependensi `lucide-react` (Sudah terpasang) | `package.json` |

### Keputusan desain

- **Dark bukan sekadar invert**: palet charcoal/slate technical (bukan hitam murni) agar tetap terkesan "material", lalu neumorphic shadow memakai pasangan gelap/terang (border-shadow `#101317` vs border-light `#2c333a`). Aksen `#ff4757` tetap = konsistensi brand.
- **Semua warna landing sudah token-based** (`bg-background`, `text-foreground`, `border-border-shadow`, `text-accent`), sehingga dark otomatis berlaku tanpa edit per komponen.
- **Aksesibilitas**: `--foreground-muted:#a8b2d1` (AA di dark); toggle punya label ARIA & tooltip; kontras LED tetap.
- **Persistensi** di localStorage sehingga pilihan pengguna tidak hilang saat navigasi/muat ulang.

### Status implementasi

- [x] ThemeProvider + ThemeToggle + wrap main + pasang di landing
- [x] Override dark untuk elemen hardcoded (embossed/screws/vents/noise/light)
- [x] Typecheck + build hijau (Landing gzip 6,28 kB; semua route smoke-tested 200 dengan dark bundle)

### Catatan lanjutan / untuk disambungkan

- **Sisa halaman app** (Dashboard/Scan/Detail/dll.) masih slate/emerald lama dan **belum** memakai token Industrial — dark toggle tidak akan memengaruhi halaman tersebut secara visual sampai di-restyle. Target: sesi berikutnya (App shell & komponen inti → Industrial + adaptif dark).
- **KOREKSI (Sesi 6):** `lucide-react` yang disebut di sesi ini **di-uninstall** & diganti SVG inline satu tombol toggle. Jangan pakai lucide-react.

---

## Sesi 5 — 2026-08-30 · Revisi Landing (nav floating + toggle mode)

**Konteks:** Hasil review di `http://localhost:5173/`. Dua revisi: header floating saat scroll, dan tombol theme diperkecil + ikon per tombol.

### Revisi

1. **Nav header floating** — header diubah dari `sticky` statis menjadi `fixed inset-x-0 top-0`; saat halaman digulir (`useScrolled(threshold=24)` via passive scroll listener) header "terangkat": transisi border-b + `bg-background/85` + `backdrop-blur-xl` + `shadow-sharp`. Padding mengecil (`py-4` → `py-2.5`) saat scrolled untuk efek menyusut. Hero diberi `pt-24`/`md:pt-32` agar konten tidak tertutup header fixed.
2. **Toggle mode diperkecil + ikon** — `ThemeToggle` dirombak dari satu tombol berubah-ikon menjadi **dua tombol eksklusif** (terang = `Sun`, gelap = `Moon`), ukuran kecil `h-6 w-6` dengan ikon `h-3 w-3`, `aria-pressed` menandai mode aktif, container `ins-card rounded-full p-0.5`. Saklar aktif memakai `ins-btn-primary`, non-aktif `ins-btn-ghost text-foreground-muted`.

### Perubahan

| # | Perubahan | File |
|---|---|---|
| 1 | Header floating + `useScrolled` + padding hero disesuaikan | `src/pages/LandingPage.tsx` |
| 2 | ThemeToggle dua tombol kecil + ikon Sun/Moon | `src/components/ThemeToggle.tsx` |

### Status implementasi

- [x] Header floating (fixed + naik saat scroll)
- [x] ThemeToggle diperkecil + ikon matahari/bulan per tombol
- [x] Typecheck + build hijau (Landing gzip 6,23 kB); landing smoke-tested 200

---

## Sesi 6 — 2026-08-30 · Perbaikan & Audit (lucide→SVG, toggle 1 tombol, fix header/radar, refactor `.ins-btn`)

**Konteks:** Review di `localhost:5173` melaporkan: (a) ikon light/dark tidak muncul, (b) header belum floating, (c) kotak muncul di sekitar radar, (d) tombol "lebih pendek" tidak efektif. Sesi ini memperbaiki akar masalah & merapikan file.

### ⚠️ KOREKSI catatan sesi 3 & 4 (penting — sebelumnya keliru)
- **Sesi 3 & 4 menyebut `lucide-react` dipakai & tersedia. Faktanya `lucide-react@1.38.0` bermasalah** (bukan versi upstream resmi; `npm view` gagal EPERM; dan ikon `Sun`/`Moon` tidak menghasilkan komponen SVG yang benar pada bundle — tanpa `<svg>` di output). **Diputuskan untuk UNINSTALL lucide-react dan mengganti ikon dengan SVG inline zero-dep.** Jadi semua referensi "lucide-react dipakai" di sesi 3/4 **tidak berlaku lagi**.

### Perbaikan

1. **Ikon light/dark tidak muncul** — akar masalah ganda:
   - `.ins-btn` menetapkan `padding: 0.8rem 1.5rem` yang menimpa utility `p-0`/`h-8 w-8` (specificity & urutan cascade; `.ins-btn` muncul setelah utility Tailwind) → tombol ikon jadi besar & isi terdesak tak terlihat.
   - `lucide-react` tidak menghasilkan SVG benar (lihat KOREKSI di atas).
   - **Fix:** (a) `ThemeToggle` → **satu tombol** (bukan dua) yang menampilkan ikon mode AKTIF (matahari=terang / bulan=gelap), toggle di klik; (b) sumber ikon → **SVG inline** `SunIcon`/`MoonIcon` dengan `width`/`height` eksplisit + `stroke=currentColor` (pasti ter-render); (c) tambah class `.ins-icon-btn` (padding:0, gap:0, border-radius:9999px) agar ukuran tombol ikon terkendali.
2. **Header belum floating** — aturan `body * { position: relative; }` (yang saya tulis di design-system) menimpa `position: fixed` pada `<header>` (specificity `body *` > `.fixed`) sehingga header jadi relative. **Fix:** hapus `body * { position: relative }` & `body #root` (diganti `#root { position: relative; z-index:1 }`).
3. **Kotak di sekitar radar** — wrapper radar `rounded-full ins-card` (border-radius `--radius-lg` 16px menimpa `rounded-full`, jadi rounded-square) + latar `inset-3 ... shadow-recessed`. **Fix:** kembalikan `RadarVisual` ke desain radar murni — container polos `relative`, hanya `radar-ring`×3 + `radar-sweep` + `radar-particle`×5 + `radar-center`. Tanpa `ins-card`, tanpa latar, tanpa label.
4. **Tombol "lebih pendek" tidak efektif** — `.ins-btn` padding `0.8rem 1.5rem` menimpa utility `py-1.5`/`py-2`. **Fix:** hapus `padding` dari `.ins-btn` default (padding kini diatur per tombol via `px-* py-*`), dan tambahkan `px-4 py-2` pada tombol CTA pricing yang sebelumnya tanpa px/py.

### Perubahan

| # | Perubahan | File |
|---|---|---|
| 1 | ThemeToggle → satu tombol, ikon SVG inline (Sun/Moon) | `src/components/ThemeToggle.tsx` |
| 2 | Tambah `.ins-icon-btn`; hapus `padding` dari `.ins-btn`; hapus `body *{position:relative}` | `src/styles/design-system.css` |
| 3 | RadarVisual kembali ke radar murni (tanpa kotak/shadow/label) | `src/pages/LandingPage.tsx` |
| 4 | Hapus duplikasi `style={{padding:0}}` (kini `ins-icon-btn`) | `src/components/ThemeToggle.tsx` |
| 5 | Uninstall `lucide-react` (problematic, tidak dipakai) | `package.json`, `package-lock.json` |

### Keputusan desain

- **Satu tombol toggle** lebih bersih daripada dua: menghemat ruang header & menghindari kebingungan dua state. Ikonnya merepresentasikan mode yang akan di-switch (matahari saat light → klik untuk gelap; bulan saat dark → klik untuk terang).
- **SVG inline > lucide-react** di project ini: zero-dependency, bundle lebih kecil, pasti ter-render, dan konsisten dgn keputusan "CSS murni" (tanpa Framer Motion / paket ikon eksternal).
- **`body * { position: relative }` adalah anti-pattern** — merusak `fixed`/`absolute` di seluruh pohon. Posisi diatur per elemen. (AI_RULES §10: hindari style global yang menimpa utility.)
- **Padding tombol dari utility, bukan dari class base** — idiomatis Tailwind & menghilangkan konflik cascade.

### Status implementasi

- [x] Toggle 1 tombol + SVG inline (Sun/Moon) — ikon ter-embed (verified di bundle: `stroke:currentColor`, `viewBox`)
- [x] `.ins-btn` tanpa padding; `.ins-icon-btn` untuk tombol ikon; hapus `body *{position:relative}`
- [x] RadarVisual kembali murni (no kotak/shadow)
- [x] Uninstall lucide-react
- [x] Typecheck + build hijau; semua route smoke-tested 200
- [x] Catatan sesi 3/4 dikoreksi (lucide-react tidak dipakai)

### Catatan penting untuk sesi lain

- **`lucide-react` TIDAK ADA di dependencies & TIDAK boleh dipakai** (masalah versi). Gunakan SVG inline untuk ikon.
- **Jangan pakai `body * { position: ... }`** — merusak positioning.
- Radio hero kini `RadarVisual` = ring murni; jangan menambah wrapper `ins-card`/latar di dalamnya (menimbulkan kotak).
- Halaman app (Dashboard/Scan/Detail/dll.) masih theme lama (slate/emerald) — belum Industrial; dark toggle tidak memengaruhi halaman itu sampai di-restyle. Target: sesi berikutnya.

---



