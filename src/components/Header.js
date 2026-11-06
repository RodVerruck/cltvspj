import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-[10000] border-b border-rule bg-paper/90 backdrop-blur-md shadow-sm">
      <a href="#main-content" className="skip-link">
        Pular para o conteúdo principal
      </a>
      <nav aria-label="Navegação principal" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-3.5 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 group" aria-label="CLT vs PJ - Página inicial">
          <span className="font-display text-2xl md:text-[24px] tracking-tight text-ink">
            CLT <em className="italic text-ink-muted">vs</em> PJ
          </span>
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="hidden md:inline-block text-[13px] font-mono uppercase tracking-widest text-ink-muted hover:text-money transition-colors"
          >
            Calculadora
          </Link>
          <Link
            href="/blog"
            className="text-xs sm:text-[13px] font-mono uppercase tracking-widest text-ink-muted hover:text-money transition-colors py-1"
          >
            Blog
          </Link>
          <Link
            href="/#calc"
            className="bg-money hover:bg-ink text-paper px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            Calcular Agora
          </Link>
        </div>
      </nav>
    </header>
  );
}
