// CuanRadar — ThemeToggle (satu tombol switch light/dark)
// Tombol kompak bergaya industri (chassis + LED). Ikon menampilkan mode AKTIF (matahari=terang, bulan=gelap).
// SVG inline zero-dep, ukuran eksplisit lewat width/height attribute + stroke color agar pasti ter-render.
import { useTheme } from '../lib/theme'

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  )
}

export function ThemeToggle() {
  const { resolved, toggle } = useTheme()
  const isDark = resolved === 'dark'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      title={isDark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      className="ins-btn ins-icon-btn ins-btn-secondary h-8 w-8 rounded-full"
    >
      <span className="inline-flex items-center justify-center text-foreground">{isDark ? <MoonIcon /> : <SunIcon />}</span>
    </button>
  )
}
