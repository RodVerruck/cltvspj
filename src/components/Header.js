import Link from 'next/link';

export default function Header() {
  return (
    <nav className="sticky top-0 z-[10000] border-b border-rule bg-paper/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 border-[1.5px] border-ink rounded-full inline-flex items-center justify-center text-[12px] font-bold font-sans group-hover:bg-ink group-hover:text-paper transition-all">×</span>
          <span className="font-display text-2xl md:text-[24px] tracking-tight text-ink">
            CLT <em className="italic text-ink-muted">vs</em> PJ
          </span>
        </Link>

        <div className="hidden md:flex gap-8">
          <Link href="/" className="text-[13px] font-mono uppercase tracking-widest text-ink-muted hover:text-money transition-colors">
            Calculadora
          </Link>
          <Link href="/blog" className="text-[13px] font-mono uppercase tracking-widest text-ink-muted hover:text-money transition-colors">
            Blog
          </Link>
        </div>

        <Link
          href="/#calc"
          className="bg-money hover:bg-ink text-paper px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          Calcular Agora
        </Link>
      </div>
    </nav>
  );
}
