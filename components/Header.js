import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calculator, ArrowLeft } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const isHome = router.pathname === '/';
  const isBlogPost = router.pathname.startsWith('/blog/') && router.pathname !== '/blog';

  return (
    <header className="site-header">
      {isBlogPost ? (
        <Link href="/blog" className="header-back">
          <ArrowLeft size={16} />
          <span>Voltar ao Blog</span>
        </Link>
      ) : !isHome ? (
        <Link href="/" className="header-back">
          <ArrowLeft size={16} />
          <span>Calculadora</span>
        </Link>
      ) : (
        <div className="header-logo">
          <Calculator size={22} />
          <span>CLT ou PJ?</span>
        </div>
      )}

      <nav className="header-nav">
        {!isHome && (
          <Link href="/" className="header-nav-link">
            Calculadora
          </Link>
        )}
        {isHome && (
          <Link href="/blog" className="header-nav-link">
            Blog
          </Link>
        )}
      </nav>

      {isHome ? (
        <Link href="/blog" className="header-cta">
          Blog
        </Link>
      ) : (
        <Link href="/" className="header-cta">
          <Calculator size={14} />
          Calcular
        </Link>
      )}
    </header>
  );
}
