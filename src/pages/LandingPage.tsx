// CuanRadar — Landing (Industrial Skeuomorphism / hybrid radar)
// Palet Industrial (chassis #e0e5ec + aksen #ff4757 + neumorphic); radar visual & fitur dipertahankan.
// Mobile-first penuh (375px → 768px → 1024px+); animasi hanya transform/opacity (AI_RULES §11).
// Angka statistik JUJUR (bukan klaim palsu — PRD §3.5, AI_RULES §11).
import { useEffect, useRef, useState, type RefObject } from 'react'
import { Link } from '@tanstack/react-router'
import { getSeedPlatforms } from '../lib/seed'
import { CATEGORY_LABELS, getRewardTypeLabel } from '../lib/format'
import { PLANS } from '../config/plans'
import { capture } from '../lib/analytics'
import { ThemeToggle } from '../components/ThemeToggle'
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

// ——— Deteksi scroll untuk nav-header floating (muncul/terangkat saat halaman digulir) ———
function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
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
    <span ref={ref} className="font-mono text-3xl font-bold text-foreground ins-embossed md:text-4xl">
      {value.toLocaleString('id-ID')}
      {suffix}
    </span>
  )
}

// ——— Visual Radar (lingkaran + sweep + partikel sonar; palet Industrial, GPU-friendly) ———
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
    <div className="ins-card ins-screws flex items-center justify-between gap-2 px-4 py-3 opacity-80 saturate-0 transition duration-200 ease-out hover:opacity-100 hover:saturate-100">
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-foreground">{p.name}</p>
        <p className="ins-mono-label mt-0.5">{CATEGORY_LABELS[p.category]}</p>
      </div>
      <div className="flex shrink-0 flex-wrap justify-end gap-1">
        {p.reward_types.slice(0, 2).map((t) => (
          <span key={t} className="rounded-md bg-accent/12 px-1.5 py-0.5 text-[10px] font-bold text-accent">
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
  const scrolled = useScrolled()

  useEffect(() => {
    capture('landing_view')
  }, [])

  return (
    <div className="min-h-dvh bg-background text-foreground">
      {/* Header — floating: muncul/terangkat saat halaman digulir (bukan sticky statis) */}
      <header
        className={`fixed inset-x-0 top-0 z-30 transition-all duration-300 ${
          scrolled
            ? 'border-b border-border-shadow bg-background/85 shadow-[var(--shadow-sharp)] backdrop-blur-xl'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 md:px-12 ${
            scrolled ? 'py-2.5' : 'py-4'
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5">
            <span className="ins-btn-secondary flex h-9 w-9 items-center justify-center rounded-full">
              <span className="ins-led ins-led-green ins-led-pulse" />
            </span>
            <span className="font-mono text-sm font-bold tracking-widest text-foreground ins-embossed">CUANRADAR</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-foreground-muted md:flex">
            <a href="#fitur" className="transition hover:text-accent">Fitur</a>
            <a href="#cara-kerja" className="transition hover:text-accent">Cara Kerja</a>
            <a href="#platform" className="transition hover:text-accent">Platform</a>
            <a href="#harga" className="transition hover:text-accent">Harga</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/app/login" className="ins-btn ins-btn-ghost px-3 py-2 text-sm">
              Masuk
            </Link>
            <Link to="/app" className="ins-btn ins-btn-primary px-4 py-1.5 text-sm">
              Coba Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* 1. Hero */}
      <section className="ins-light border-b border-border-shadow">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-24 md:grid-cols-2 md:items-center md:px-12 md:pb-24 md:pt-32">
          <div>
            <p className="ins-card inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold text-accent">
              <span className="ins-led ins-led-red ins-led-pulse" />
              Radar reward Indonesia · kurasi anti-scam
            </p>
            <h1 className="mt-5 text-[42px] font-extrabold leading-tight tracking-tight text-foreground ins-embossed md:text-7xl">
              CUAN<span className="text-accent">RADAR</span>
            </h1>
            <p className="ins-mono-label mt-2 text-sm tracking-[0.2em] text-accent">Setiap menit waktu Anda berharga</p>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-foreground-muted">
              Radar pintar yang menangkap peluang reward dari berbagai platform di Indonesia — otomatis,
              terkurasi, dan siap Anda pilih.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link to="/app/scan" className="ins-btn ins-btn-primary px-6 py-2 text-sm">
                Mulai Scan Peluang
              </Link>
              <a href="#platform" className="ins-btn ins-btn-secondary px-6 py-2 text-sm">
                Lihat Sinyal
              </a>
            </div>
            <p className="ins-mono-label mt-4 text-xs text-foreground-muted">
              Gratis selamanya untuk pemakaian dasar · tanpa kartu kredit
            </p>
          </div>
          <RadarVisual />
        </div>
      </section>

      {/* 2. Features */}
      <section id="fitur" className="border-b border-border-shadow py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-12">
          <h2 className="ins-mono-label text-center text-2xl font-bold tracking-wide text-foreground md:text-3xl">
            RADAR YANG <span className="text-accent">BEKERJA</span>
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-foreground-muted">
            Discover → Compare → Estimate → Verify → Choose — satu alur untuk keputusan terbaik.
          </p>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="ins-card ins-screws p-6">
                <div className="ins-vents"><span /></div>
                <div className="ins-btn-secondary flex h-11 w-11 items-center justify-center rounded-xl text-lg">
                  {f.icon}
                </div>
                <h3 className="mt-3 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-foreground-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. How It Works */}
      <section id="cara-kerja" className="border-b border-border-shadow py-14">
        <div className="mx-auto max-w-5xl px-4 md:px-12">
          <h2 className="ins-mono-label text-center text-2xl font-bold tracking-wide text-foreground md:text-3xl">
            CARA KERJA
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={s.n} className="relative">
                {i < STEPS.length - 1 ? (
                  <div className="absolute right-[-16px] top-7 hidden w-8 md:block">
                    <div className="ins-pipe w-full" />
                  </div>
                ) : null}
                <div className="flex flex-col items-center text-center">
                  <span className="ins-mono-label text-sm text-accent">{s.n}</span>
                  <div className="ins-card mt-3 flex h-12 w-12 items-center justify-center rounded-full text-lg">
                    {i === 0 ? '📡' : i === 1 ? '📶' : '💰'}
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-foreground">{s.title}</h3>
                  <p className="mt-1 max-w-xs text-sm leading-relaxed text-foreground-muted">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statistics (angka JUJUR) — panel teknis gelap */}
      <section className="ins-screen border-y border-border-shadow py-14 text-foreground">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center md:grid-cols-4 md:px-12">
          {STATS.map((s) => (
            <div key={s.label}>
              <CountUp target={s.value} suffix={s.suffix} />
              <p className="ins-mono-label mt-1 text-xs text-muted-fg">{s.label}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 max-w-md px-4 text-center text-[11px] text-muted-fg">
          Angka berdasarkan data nyata katalog & review queue kami — bukan klaim marketing (PRD §3.5).
        </p>
      </section>

      {/* 5. Platform — contoh hasil scan */}
      <section id="platform" className="border-b border-border-shadow py-14">
        <div className="mx-auto max-w-6xl px-4 md:px-12">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground ins-embossed">SINYAL DARI PLATFORM</h2>
              <p className="mt-1 text-foreground-muted">Contoh hasil scan katalog kurasi kami — jalankan Scan untuk hasil lengkap.</p>
            </div>
            <Link to="/app/scan" className="ins-btn ins-btn-ghost px-4 py-2 text-sm">
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

      {/* Harga (toggle Bulanan/Tahunan + 3 kartu, tengah highlight) */}
      <section id="harga" className="border-b border-border-shadow py-16">
        <div className="mx-auto max-w-5xl px-4 md:px-12">
          <h2 className="ins-mono-label text-center text-2xl font-bold tracking-wide text-foreground md:text-3xl">
            HARGA <span className="text-accent">SEDERHANA</span>
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-foreground-muted">
            Mulai gratis. Upgrade hanya bila butuh kapasitas lebih — posisi ranking tidak pernah bisa dibeli.
          </p>

          <div className="mt-6 flex justify-center">
            <div className="ins-card inline-flex rounded-full p-1">
              {(['monthly', 'yearly'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBilling(b)}
                  className={`ins-btn rounded-full px-5 py-2 text-sm ${
                    billing === b ? 'ins-btn-primary' : 'ins-btn-ghost text-foreground-muted'
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
                  className={`ins-card ins-screws relative flex flex-col p-6 ${highlight ? 'ins-card-elevated' : ''}`}
                >
                  {highlight ? (
                    <p className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[11px] font-bold text-accent-fg">
                      PALING POPULER
                    </p>
                  ) : null}
                  <h3 className="ins-mono-label text-sm text-foreground">{plan.name.toUpperCase()}</h3>
                  <p className="mt-1 text-xs text-foreground-muted">
                    {plan.id === 'free' ? 'Untuk mulai mencoba' : plan.id === 'pro' ? 'Untuk pengejar cuan serius' : 'Untuk power user'}
                  </p>
                  <p className={`mt-3 font-mono text-3xl font-bold ${highlight ? 'text-accent' : 'text-foreground'}`}>
                    {price ? `Rp${price.toLocaleString('id-ID')}` : 'Gratis'}
                    {price ? <span className="text-sm font-normal text-foreground-muted">{period}</span> : null}
                  </p>
                  <ul className="mt-4 flex-1 space-y-2 text-sm text-foreground-muted">
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> ⚡ {plan.quickPerDay}× Quick Scan/hari</li>
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> 🔍 {plan.deepPerDay}× Deep Scan/hari</li>
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> ⚖️ Compare hingga {plan.compareOffers} aplikasi</li>
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> 🔖 Tracker {plan.trackerLimit === null ? 'tanpa batas' : `${plan.trackerLimit} entri`}</li>
                    <li className="flex items-center gap-2"><span className="text-accent">✓</span> 🔔 Alert {plan.alertLevel === 'mingguan' ? 'mingguan' : plan.alertLevel === 'real_time' ? 'real-time' : 'real-time + push'}</li>
                  </ul>
                  <Link
                    to="/app"
                    className={`ins-btn px-4 py-2 mt-6 text-sm ${highlight ? 'ins-btn-primary' : 'ins-btn-secondary'}`}
                  >
                    {plan.id === 'free' ? 'Mulai gratis' : 'Upgrade (Fase 2)'}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FAQ (accordion bertumpuk) */}
      <section id="faq" className="border-b border-border-shadow py-16">
        <div className="mx-auto max-w-2xl px-4 md:px-12">
          <h2 className="ins-mono-label text-center text-2xl font-bold tracking-wide text-foreground md:text-3xl">
            PERTANYAAN <span className="text-accent">UMUM</span>
          </h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="ins-card ins-screws group px-5 py-4">
                <summary className="flex cursor-pointer items-center justify-between gap-3 text-sm font-bold text-foreground">
                  {f.q}
                  <span className="text-accent transition-transform duration-200 ease-out group-open:rotate-180">▾</span>
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA (split: teks+tombol / grid benefit) */}
      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center md:px-12">
          <div>
            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground ins-embossed md:text-3xl">
              SIAP MENANGKAP <span className="text-accent">SINYAL CUAN?</span>
            </h2>
            <p className="mt-2 text-foreground-muted">Bergabung dengan pengguna yang sudah mengoptimalkan waktu mereka.</p>
            <Link to="/app" className="ins-btn ins-btn-primary mt-6 px-8 py-3 text-sm">
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
              <div key={b.title} className="ins-card ins-screws p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/12 text-lg">{b.icon}</div>
                <p className="mt-3 text-sm font-bold text-accent">{b.title}</p>
                <p className="mt-0.5 text-xs text-foreground-muted">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-border-shadow bg-surface py-10 text-foreground-muted">
        <div className="mx-auto max-w-6xl px-4 md:px-12">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="ins-btn-secondary flex h-7 w-7 items-center justify-center rounded-full">
                <span className="ins-led ins-led-green" />
              </span>
              <span className="font-mono text-sm font-bold tracking-widest text-foreground ins-embossed">CUANRADAR</span>
            </div>
            <nav className="flex flex-wrap gap-4 text-sm">
              <a href="#fitur" className="transition hover:text-accent">Tentang</a>
              <a href="#cara-kerja" className="transition hover:text-accent">Cara Kerja</a>
              <Link to="/app" className="transition hover:text-accent">Aplikasi</Link>
              <a href="#harga" className="transition hover:text-accent">Harga</a>
              <a href="#faq" className="transition hover:text-accent">FAQ</a>
            </nav>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-foreground-muted">
            Disclaimer: CuanRadar bukan nasihat keuangan atau investasi. Semua angka reward adalah estimasi berlabel
            dengan tanggal verifikasi dan dapat berubah. Peringkat ditentukan rubrik publik yang deterministik — mitra
            tidak dapat membeli posisi.
          </p>
          <p className="ins-mono-label mt-3 text-xs text-accent">© 2026 CuanRadar. Waktu Anda Berharga.</p>
        </div>
      </footer>
    </div>
  )
}
