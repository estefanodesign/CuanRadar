// CuanRadar — Landing page (tampilan awal untuk pengunjung)
// Responsive penuh: desktop multi-kolom, mobile stacked.
import { Link } from '@tanstack/react-router'
import { getSeedPlatforms } from '../lib/seed'
import { Badge } from '../components/Badge'
import { CATEGORY_LABELS, formatDate, getRiskLabel, getRewardTypeLabel, getVerificationLabel } from '../lib/format'
import { PLANS } from '../config/plans'
import type { Platform } from '../types'

const FEATURES = [
  { icon: '📡', title: 'Discover', desc: 'Pantau puluhan platform reward Indonesia — entertainment, shopping, wallet, dan lainnya dalam satu tempat.' },
  { icon: '⚖️', title: 'Compare', desc: 'Bandingkan cashback, poin, dan task secara berdampingan — hingga 16 aplikasi sekaligus.' },
  { icon: '🧮', title: 'Estimate', desc: 'Kalkulasi cuan per jam/menit dengan asumsi transparan. Bukan klaim "pasti dapat jutaan".' },
  { icon: '🛡️', title: 'Verify', desc: 'Dua sumbu penilaian: verifikasi informasi & penilaian risiko anti-scam per platform.' },
  { icon: '✅', title: 'Choose', desc: 'Rekomendasi jujur dari skor deterministik 6 faktor. Peringkat tidak bisa dibeli.' },
]

const STEPS = [
  { n: '1', title: 'Scan', desc: 'Jalankan Quick Scan harian gratis — langsung dapat peluang terbaik.' },
  { n: '2', title: 'Bandingkan', desc: 'Pilih aplikasi favorit dan lihat perbandingan reward, effort, dan risiko.' },
  { n: '3', title: 'Verifikasi', desc: 'Pastikan platform aman: cek status verifikasi & riwayat payout.' },
  { n: '4', title: 'Klaim', desc: 'Buka aplikasi resmi via tautan terverifikasi dan mulai kumpulkan cuan.' },
]

const FAQS = [
  { q: 'Apakah CuanRadar mengumpulkan uang untuk saya?', a: 'Tidak. CuanRadar adalah asisten penemuan peluang — Anda tetap mengerjakan reward di aplikasi aslinya. Kami hanya membantu memilih yang terbaik dan paling aman.' },
  { q: 'Apakah hasilnya dijamin?', a: 'Tidak ada jaminan pendapatan. Semua angka adalah estimasi berlabel, dengan asumsi transparan dan tanggal verifikasi.' },
  { q: 'Bagaimana CuanRadar menghasilkan uang?', a: 'Melalui langganan Pro dan tautan afiliasi berlabel. Peringkat tidak pernah dapat dibeli (no pay-for-rank).' },
  { q: 'Apa bedanya verifikasi dan risiko?', a: 'Verifikasi = apakah informasinya benar. Risiko = apakah platformnya aman (anti-scam). Keduanya ditampilkan terpisah.' },
]

function ScanResultCard({ p }: { p: Platform }) {
  const verTone = p.verification_status === 'verified' ? 'green' : p.verification_status === 'partially_verified' ? 'amber' : 'slate'
  const riskTone = p.risk_level === 'rendah' ? 'green' : p.risk_level === 'sedang' ? 'amber' : 'red'
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-slate-600">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-100">{p.name}</p>
          <p className="text-[11px] text-slate-500">{CATEGORY_LABELS[p.category]}</p>
        </div>
        <span className="text-slate-600">→</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {p.reward_types.slice(0, 3).map((t) => (
          <span key={t} className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[11px] text-emerald-300">
            {getRewardTypeLabel(t)}
          </span>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge tone={verTone}>{getVerificationLabel(p.verification_status)}</Badge>
        <Badge tone={riskTone}>{getRiskLabel(p.risk_level)}</Badge>
      </div>
      <p className="mt-2 text-[10px] text-slate-600">verif {formatDate(p.last_verified_at)}</p>
    </div>
  )
}

export function LandingPage() {
  const scanExample = getSeedPlatforms().filter((p) => p.status === 'mvp' || p.status === 'fase2').slice(0, 6)

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-base">📡</span>
            <span className="text-sm font-bold tracking-tight">CuanRadar</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#fitur" className="transition hover:text-slate-200">Fitur</a>
            <a href="#platform" className="transition hover:text-slate-200">Platform</a>
            <a href="#cara-kerja" className="transition hover:text-slate-200">Cara Kerja</a>
            <a href="#harga" className="transition hover:text-slate-200">Harga</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/app/login" className="rounded-lg px-3 py-1.5 text-sm text-slate-300 transition hover:text-slate-100">
              Masuk
            </Link>
            <Link to="/app" className="rounded-lg bg-emerald-500 px-3 py-1.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400">
              Coba Gratis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-slate-800">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-2 md:items-center md:py-20">
          <div>
            <p className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-300">
              30+ platform reward Indonesia terpantau
            </p>
            <h1 className="mt-4 text-3xl font-bold leading-tight md:text-4xl">
              Setiap menit waktu Anda <span className="text-emerald-400">berharga</span>.
            </h1>
            <p className="mt-3 text-slate-400">
              CuanRadar melacak, membandingkan, dan memverifikasi peluang reward terbaik dari entertainment, shopping,
              dan e-wallet — dengan kalkulasi cuan yang jujur dan perlindungan anti-scam.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Link
                to="/app"
                className="rounded-xl bg-emerald-500 px-5 py-3 text-center text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                ⚡ Coba Scan Gratis
              </Link>
              <a
                href="#platform"
                className="rounded-xl border border-slate-700 px-5 py-3 text-center text-sm font-medium text-slate-200 transition hover:border-slate-500"
              >
                Lihat contoh hasil
              </a>
            </div>
            <p className="mt-3 text-[11px] text-slate-600">
              Gratis selamanya untuk pemakaian dasar · tanpa kartu kredit · pembayaran QRIS/e-wallet bila upgrade
            </p>
          </div>
          {/* Mock scan preview */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-300">Hasil Quick Scan</p>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400">contoh</span>
            </div>
            <div className="mt-3 space-y-3">
              {scanExample.slice(0, 3).map((p) => (
                <ScanResultCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="fitur" className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold">Discover → Compare → Estimate → Verify → Choose</h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-400">
            Satu alur untuk mengubah informasi reward yang tersebar menjadi keputusan terbaik Anda.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-lg">{f.icon}</div>
                <h3 className="mt-3 text-sm font-semibold">{f.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{f.desc}</p>
              </div>
            ))}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-lg">📊</div>
              <h3 className="mt-3 text-sm font-semibold text-emerald-300">CuanScore</h3>
              <p className="mt-1 text-xs leading-relaxed text-emerald-200/70">
                Skor deterministik 6 faktor: potensi reward, verifikasi, effort, risiko, aksesibilitas, stabilitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform — contoh hasil scan */}
      <section id="platform" className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold">Contoh hasil scan</h2>
              <p className="mt-1 text-sm text-slate-400">
                Sebagian katalog kurasi kami. Jalankan Scan di aplikasi untuk hasil lengkap & terbaru.
              </p>
            </div>
            <Link to="/app/scan" className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200">
              Coba Scan gratis →
            </Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scanExample.map((p) => (
              <ScanResultCard key={p.id} p={p} />
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="cara-kerja" className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold">Cara kerja</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s) => (
              <div key={s.n} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-2xl font-bold text-emerald-400">{s.n}</p>
                <h3 className="mt-2 text-sm font-semibold">{s.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="harga" className="border-b border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold">Harga sederhana</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-slate-400">
            Mulai gratis. Upgrade hanya bila butuh kapasitas lebih — posisi ranking tidak pernah bisa dibeli.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {([PLANS.free, PLANS.pro, PLANS.pro_plus] as const).map((plan) => {
              const highlight = plan.id === 'pro'
              return (
                <div
                  key={plan.id}
                  className={`rounded-2xl border p-6 ${
                    highlight ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/60'
                  }`}
                >
                  {highlight ? (
                    <p className="mb-2 inline-flex rounded-full bg-emerald-500 px-2 py-0.5 text-[11px] font-semibold text-slate-950">
                      PALING POPULER
                    </p>
                  ) : null}
                  <h3 className="text-sm font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-bold">
                    {plan.priceMonthly ? `Rp${plan.priceMonthly.toLocaleString('id-ID')}` : 'Gratis'}
                    {plan.priceMonthly ? <span className="text-sm font-normal text-slate-400">/bln</span> : null}
                  </p>
                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li>⚡ {plan.quickPerDay}× Quick Scan/hari</li>
                    <li>🔍 {plan.deepPerDay}× Deep Scan/hari</li>
                    <li>⚖️ Compare hingga {plan.compareOffers} aplikasi</li>
                    <li>🔖 Tracker {plan.trackerLimit === null ? 'tanpa batas' : `${plan.trackerLimit} entri`}</li>
                    <li>🔔 Alert {plan.alertLevel === 'mingguan' ? 'mingguan' : plan.alertLevel === 'real_time' ? 'real-time (email)' : 'real-time (email + push)'}</li>
                  </ul>
                  <Link
                    to="/app"
                    className={`mt-5 block rounded-xl px-4 py-2.5 text-center text-sm font-semibold transition ${
                      highlight
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'border border-slate-700 text-slate-200 hover:border-slate-500'
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

      {/* FAQ */}
      <section className="border-b border-slate-800">
        <div className="mx-auto max-w-2xl px-4 py-14">
          <h2 className="text-center text-2xl font-bold">Pertanyaan umum</h2>
          <div className="mt-6 space-y-3">
            {FAQS.map((f) => (
              <details key={f.q} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                <summary className="cursor-pointer text-sm font-medium text-slate-200">{f.q}</summary>
                <p className="mt-2 text-xs leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-14 text-center">
          <h2 className="text-2xl font-bold">Mulai sekarang — gratis</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Setiap menit yang Anda habiskan untuk mencari reward adalah menit yang tidak menghasilkan. Biarkan CuanRadar yang mencarinya.
          </p>
          <Link
            to="/app"
            className="mt-6 inline-block rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            ⚡ Coba Scan Gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-sm">📡</span>
              <span className="text-sm font-bold">CuanRadar</span>
            </div>
            <nav className="flex flex-wrap gap-4 text-xs text-slate-400">
              <a href="#fitur" className="transition hover:text-slate-200">Fitur</a>
              <a href="#platform" className="transition hover:text-slate-200">Platform</a>
              <a href="#harga" className="transition hover:text-slate-200">Harga</a>
              <Link to="/app" className="transition hover:text-slate-200">Aplikasi</Link>
            </nav>
          </div>
          <p className="mt-6 text-[11px] leading-relaxed text-slate-600">
            Disclaimer: CuanRadar bukan nasihat keuangan atau investasi. Semua angka reward adalah estimasi berlabel dengan
            tanggal verifikasi, dan dapat berubah sewaktu-waktu. Peringkat ditentukan rubrik publik yang deterministik — mitra
            tidak dapat membeli posisi. © 2026 CuanRadar.
          </p>
        </div>
      </footer>
    </div>
  )
}
