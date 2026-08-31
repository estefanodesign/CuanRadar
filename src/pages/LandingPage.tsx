// CuanRadar — Landing page art-futuristik (Prompt_UI: Deep Sea Jade + Champagne Gold)
// Mobile-first penuh (375px → 768px → 1024px+); animasi hanya transform/opacity.
// Angka statistik JUJUR (bukan klaim palsu — PRD §3.5, AI_RULES §11): 30+ platform · 4 kategori ·
// 13+ kandidat menunggu kurasi · 30 hari siklus verifikasi.
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from '@tanstack/react-router'
import { getSeedPlatforms } from '../lib/seed'
import { CATEGORY_LABELS, getRewardTypeLabel } from '../lib/format'
import { PLANS } from '../config/plans'
import type { Platform } from '../types'

const FEATURES = [
  { icon: '📡', title: 'Deteksi Otomatis', desc: 'Radar memantau platform reward Indonesia — entertainment, shopping, wallet, dan lainnya — dalam satu layar.' },
  { icon: '⭕', title: 'Kurasi Cerdas', desc: 'Setiap peluang diverifikasi dua sumbu: kebenaran informasi & risiko anti-scam. Kandidat AI tak pernah langsung publish.' },
  { icon: '✓', title: 'Pilihan Tepat', desc: 'CuanScore 6 faktor yang deterministik — peringkat tidak bisa dibeli, keputusan jadi lebih mudah.' },
]

const STEPS = [
  { n: '01', title: 'Aktifkan Radar', desc: 'Jalankan Quick Scan gratis — otomatis, dari database terverifikasi.' },
  { n: '02', title: 'Terima Sinyal', desc: 'Dapatkan kandidat peluang terbaik dengan skor, verifikasi, dan risiko yang jelas.' },
  { n: '03', title: 'Kumpulkan Cuan', desc: 'Buka aplikasi resmi via tautan terverifikasi dan kumpulkan reward Anda.' },
]

const STATS = [
  { value: 30, suffix: '+', label: 'Platform Reward Dipantau' },
  { value: 4, suffix: '', label: 'Kategori Peluang' },
  { value: 13, suffix: '+', label: 'Kandidat Menunggu Kurasi' },
  { value: 30, suffix: ' hari', label: 'Siklus Verifikasi' },
]

const FAQS = [
  { q: 'Apakah CuanRadar mengumpulkan uang untuk saya?', a: 'Tidak. CuanRadar adalah asisten penemuan peluang — Anda tetap mengerjakan reward di aplikasi aslinya. Kami hanya membantu memilih yang terbaik dan paling aman.' },
  { q: 'Apakah hasilnya dijamin?', a: 'Tidak ada jaminan pendapatan. Semua angka adalah estimasi berlabel, dengan asumsi transparan dan tanggal verifikasi.' },
  { q: 'Bagaimana CuanRadar menghasilkan uang?', a: 'Melalui langganan Pro dan tautan afiliasi berlabel. Peringkat tidak pernah dapat dibeli (no pay-for-rank).' },
  { q: 'Apa bedanya verifikasi dan risiko?', a: 'Verifikasi = apakah informasinya benar. Risiko = apakah platformnya aman (anti-scam). Keduanya ditampilkan terpisah.' },
]

// ——— Count-up saat scroll (angka nyata; durasi 1 detik, easing cubic-out) ———
function useInView<T extends HTMLElement>(): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return [ref, inView]
}

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>()
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
    let raf = 0
    const start = performance.now()
    const duration = 1000
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration)
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, target])
  return (
    <span ref={ref} className="font-display text-3xl font-bold text-jade md:text-4xl">
      {value.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}

// ——— Visual Radar (lingkaran + grid tipis + partikel sonar; GPU-friendly) ———
const PARTICLES = [
  { left: '28%', top: '36%', delay: '0s' },
  { left: '62%', top: '30%', delay: '1.2s' },
  { left: '70%', top: '62%', delay: '2.4s' },
  { left: '38%', top: '70%', delay: '0.8s' },
  { left: '52%', top: '48%', delay: '3s' },
]

function RadarVisual() {
  return (
    <div className="relative mx-auto aspect-square w-[70vw] max-w-[420px]" aria-hidden>
      <div className="radar-ring inset-0" />
      <div className="radar-ring inset-[14%]" />
      <div className="radar-ring inset-[28%]" />
      <div className="radar-sweep" />
      {PARTICLES.map((p, i) => (
        <span key={i} className="radar-particle" style={{ left: p.left, top: p.top, animationDelay: p.delay }} />
      ))}
      <div className="radar-center" />
    </div>
  )
}

function PlatformChip({ p }: { p: Platform }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-xl border border-gold/25 bg-paper px-3 py-2.5 opacity-70 saturate-0 transition duration-200 ease-out hover:opacity-100 hover:saturate-100">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-jade-dark">{p.name}</p>
        <p className="text-[11px] text-jade/60">{CATEGORY_LABELS[p.category]}</p>
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-1">
        {p.reward_types.slice(0, 2).map((t) => (
          <span key={t} className="rounded-md bg-gold/15 px-1.5 py-0.5 text-[10px] font-medium text-gold">
            {getRewardTypeLabel(t)}
          </span>
        ))}
      </div>
    </div>
  )
}

export function LandingPage() {
  const platforms = getSeedPlatforms().slice(0, 12)
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly')

  return (
    <div className="min-h-dvh bg-cream text-jade-dark">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-gold/20 bg-jade text-cream">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold/20 text-base">📡</span>
            <span className="font-display text-sm font-bold tracking-widest text-gold">CUANRADAR</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-cream/80 md:flex">
            <a href="#fitur" className="transition hover:text-gold">Fitur</a>
            <a href="#cara-kerja" className="transition hover:text-gold">Cara Kerja</a>
            <a href="#platform" className="transition hover:text-gold">Platform</a>
            <a href="#harga" className="transition hover:text-gold">Harga</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app/login" className="rounded-full px-3 py-1.5 text-sm text-cream/80 transition hover:text-gold">
              Masuk
            </Link>
            <Link
              to="/app"
              className="rounded-full bg-gold px-4 py-1.5 text-sm font-semibold text-jade transition hover:bg-gold-soft"
            >
              Coba Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="border-b border-gold/20 bg-gradient-to-b from-jade via-jade to-cream text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:items-center md:pb-24 md:pt-16">
          <div>
            <p className="inline-flex rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              📡 Radar reward Indonesia · kurasi anti-scam
            </p>
            <h1 className="mt-5 font-display text-[42px] font-bold leading-tight tracking-wide text-cream md:text-[72px]">
              CUAN<span className="text-gold">RADAR</span>
            </h1>
            <p className="mt-2 font-display text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Setiap menit waktu Anda berharga
            </p>
            <p className="mt-4 max-w-md text-cream/80">
              Radar pintar yang menangkap peluang reward dari berbagai platform di Indonesia — otomatis,
              terkurasi, dan siap Anda pilih.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/app/scan"
                className="rounded-full bg-gold px-6 py-3 text-center text-sm font-semibold text-jade transition hover:bg-gold-soft"
              >
                Mulai Scan Peluang
              </Link>
              <a
                href="#platform"
                className="rounded-full border border-gold/50 px-6 py-3 text-center text-sm font-medium text-cream transition hover:border-gold hover:text-gold"
              >
                Lihat Sinyal
              </a>
            </div>
            <p className="mt-3 text-xs text-cream/50">Gratis selamanya untuk pemakaian dasar · tanpa kartu kredit</p>
          </div>
          <RadarVisual />
        </div>
      </section>

      {/* 2. Features */}
      <section id="fitur" className="border-b border-gold/20 bg-cream py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center font-display text-2xl font-bold tracking-wide text-jade md:text-3xl">
            RADAR YANG <span className="text-gold">BEKERJA</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-jade/70">
            Discover → Compare → Estimate → Verify → Choose — satu alur untuk keputusan terbaik.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-gold/30 bg-paper p-6 transition duration-200 ease-out hover:border-gold"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-gold/40 bg-gold/10 text-lg text-gold">
                  {f.icon}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-jade">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-jade/70">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="cara-kerja" className="border-b border-gold/20 bg-paper py-14">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-2xl font-bold tracking-wide text-jade md:text-3xl">
            CARA KERJA
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 ? (
                  <div className="absolute right-[-16px] top-6 hidden h-px w-8 bg-gold/50 md:block" />
                ) : null}
                <div className="flex flex-col items-center text-center">
                  <span className="font-display text-sm font-semibold tracking-widest text-gold">{s.n}</span>
                  <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-jade text-gold">
                    {i === 0 ? '📡' : i === 1 ? '📶' : '💰'}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-jade">{s.title}</h3>
                  <p className="mt-1 max-w-xs text-sm text-jade/70">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statistics (angka JUJUR) */}
      <section className="border-b border-gold/20 bg-jade py-14 text-cream">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <CountUp target={s.value} suffix={s.suffix} />
              <p className="mt-1 text-xs uppercase tracking-wider text-cream/60">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-md px-4 text-center text-[11px] text-cream/40">
          Angka berdasarkan data nyata katalog & review queue kami — bukan klaim marketing (PRD §3.5).
        </p>
      </section>

      {/* 5. Platform — contoh hasil scan */}
      <section id="platform" className="border-b border-gold/20 bg-cream py-14">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-wide text-jade">SINYAL DARI PLATFORM</h2>
              <p className="mt-1 text-jade/70">Contoh hasil scan katalog kurasi kami — jalankan Scan untuk hasil lengkap.</p>
            </div>
            <Link to="/app/scan" className="text-sm font-semibold text-gold transition hover:text-jade">
              Coba Scan gratis →
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.map((p) => (
              <PlatformChip key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Harga (pola: toggle Bulanan/Tahunan + 3 kartu, tengah highlight — warna CuanRadar jade/gold) */}
      <section id="harga" className="border-b border-gold/20 bg-jade-dark py-20 text-cream">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-2xl font-bold tracking-wide md:text-3xl">
            HARGA <span className="text-gold">SEDERHANA</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-cream/60">
            Mulai gratis. Upgrade hanya bila butuh kapasitas lebih — posisi ranking tidak pernah bisa dibeli.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="inline-flex rounded-full border border-gold/30 bg-jade p-1">
              {(['monthly', 'yearly'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBilling(b)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                    billing === b ? 'bg-gold text-jade' : 'text-cream/70 hover:text-gold'
                  }`}
                >
                  {b === 'monthly' ? 'Bulanan' : 'Tahunan (hemat 17%)'}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {([PLANS.free, PLANS.pro, PLANS.pro_plus] as const).map((plan) => {
              const highlight = plan.id === 'pro'
              const isYearly = billing === 'yearly'
              const price = isYearly ? (plan.priceAnnual ?? plan.priceMonthly) : plan.priceMonthly
              const period = isYearly && plan.priceAnnual ? '/thn' : '/bln'
              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border p-6 ${
                    highlight ? 'border-gold bg-jade-soft' : 'border-gold/25 bg-jade'
                  }`}
                >
                  {highlight ? (
                    <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-3 py-0.5 text-[11px] font-bold text-jade">
                      PALING POPULER
                    </p>
                  ) : null}
                  <h3 className="font-display text-sm font-bold tracking-wide">{plan.name.toUpperCase()}</h3>
                  <p className="mt-1 text-xs text-cream/60">
                    {plan.id === 'free' ? 'Untuk mulai mencoba' : plan.id === 'pro' ? 'Untuk pengejar cuan serius' : 'Untuk power user'}
                  </p>
                  <p className={`mt-3 text-3xl font-bold ${highlight ? 'text-gold' : 'text-cream'}`}>
                    {price ? `Rp${price.toLocaleString('id-ID')}` : 'Gratis'}
                    {price ? <span className="text-sm font-normal text-cream/60">{period}</span> : null}
                  </p>
                  <ul className={`mt-4 flex-1 space-y-2 text-sm ${highlight ? 'text-cream/85' : 'text-cream/70'}`}>
                    <li className="flex items-center gap-2"><span className="text-gold">✓</span> ⚡ {plan.quickPerDay}× Quick Scan/hari</li>
                    <li className="flex items-center gap-2"><span className="text-gold">✓</span> 🔍 {plan.deepPerDay}× Deep Scan/hari</li>
                    <li className="flex items-center gap-2"><span className="text-gold">✓</span> ⚖️ Compare hingga {plan.compareOffers} aplikasi</li>
                    <li className="flex items-center gap-2"><span className="text-gold">✓</span> 🔖 Tracker {plan.trackerLimit === null ? 'tanpa batas' : `${plan.trackerLimit} entri`}</li>
                    <li className="flex items-center gap-2"><span className="text-gold">✓</span> 🔔 Alert {plan.alertLevel === 'mingguan' ? 'mingguan' : plan.alertLevel === 'real_time' ? 'real-time' : 'real-time + push'}</li>
                  </ul>
                  <Link
                    to="/app"
                    className={`mt-6 block rounded-full px-4 py-2.5 text-center text-sm font-semibold transition ${
                      highlight
                        ? 'bg-gold text-jade hover:bg-gold-soft'
                        : 'border border-gold/40 text-cream hover:bg-gold hover:text-jade'
                    }`}
                  >
                    {plan.id === 'free' ? 'Mulai gratis' : 'Upgrade (Fase 2)'}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ (pola: heading + accordion bertumpuk, panah) */}
      <section id="faq" className="border-b border-gold/20 bg-jade-dark py-20 text-cream">
        <div className="mx-auto max-w-2xl px-4">
          <h2 className="text-center font-display text-2xl font-bold tracking-wide md:text-3xl">
            PERTANYAAN <span className="text-gold">UMUM</span>
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-2xl border border-gold/25 bg-jade px-5 py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-semibold text-cream">
                  {f.q}
                  <span className="text-gold transition-transform duration-200 ease-out group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA (pola: split — kiri teks+tombol, kanan grid 2×2 kartu benefit) */}
      <section className="bg-jade-dark py-20 text-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight md:text-3xl">
              SIAP MENANGKAP <span className="text-gold">SINYAL CUAN?</span>
            </h2>
            <p className="mt-2 text-cream/70">Bergabung dengan pengguna yang sudah mengoptimalkan waktu mereka.</p>
            <Link
              to="/app"
              className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-sm font-bold text-jade transition hover:bg-gold-soft"
            >
              Mulai Sekarang — Gratis
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '📊', title: 'CuanScore', desc: '6 faktor deterministik' },
              { icon: '🛡️', title: 'Anti-Scam', desc: 'Rubrik 8 pemeriksaan' },
              { icon: '🔔', title: 'Alert Real-time', desc: 'Peluang baru terpantau' },
              { icon: '🧭', title: '4 Kategori', desc: 'Entertainment · Shopping · Wallet · Lainnya' },
            ].map((b) => (
              <div key={b.title} className="rounded-2xl border border-gold/25 bg-jade p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-lg">
                  {b.icon}
                </div>
                <p className="mt-3 text-sm font-semibold text-gold">{b.title}</p>
                <p className="mt-0.5 text-xs text-cream/60">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-jade-dark py-10 text-cream/70">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold/20 text-sm">📡</span>
              <span className="font-display text-sm font-bold tracking-widest text-gold">CUANRADAR</span>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm">
              <a href="#fitur" className="transition hover:text-gold">Tentang</a>
              <a href="#cara-kerja" className="transition hover:text-gold">Cara Kerja</a>
              <Link to="/app" className="transition hover:text-gold">Aplikasi</Link>
              <a href="#harga" className="transition hover:text-gold">Harga</a>
              <a href="#faq" className="transition hover:text-gold">FAQ</a>
            </nav>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-cream/40">
            Disclaimer: CuanRadar bukan nasihat keuangan atau investasi. Semua angka reward adalah estimasi berlabel
            dengan tanggal verifikasi dan dapat berubah. Peringkat ditentukan rubrik publik yang deterministik — mitra
            tidak dapat membeli posisi.
          </p>
          <p className="mt-3 text-xs font-semibold text-gold/80">© 2026 CuanRadar. Waktu Anda Berharga.</p>
        </div>
      </footer>
    </div>
  )
}
