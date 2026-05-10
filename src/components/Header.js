import Link from 'next/link';

export default function Header() {
  return (
    <nav className="sticky top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="w-7 h-7 border-[1.5px] border-ink rounded-full inline-flex items-center justify-center text-[11px] font-medium font-sans">×</span>
          <span className="font-display text-xl md:text-[22px] tracking-editorial text-ink">
            CLT <em className="italic text-ink-muted">vs</em> PJ
          </span>
        </Link>

        <div className="hidden md:flex gap-7">
          <Link href="/" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
            Calculadora
          </Link>
          <Link href="/blog" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
            Blog
          </Link>
          <Link href="/blog/vale-pena-pj-isencao-ir-lei-15270-2026" className="text-sm font-medium text-ink-muted hover:text-ink transition-colors">
            Lei 15.270
          </Link>
        </div>

        <Link
          href="/#calc"
          className="bg-ink hover:bg-money text-paper px-4 py-2 rounded text-sm font-medium transition-colors whitespace-nowrap"
        >
          Calcular ×
        </Link>
      </div>
    </nav>
  );
}
