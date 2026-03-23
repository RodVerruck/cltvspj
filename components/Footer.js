import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="footer-logo">CLT ou PJ?</span>
            <p className="footer-tagline">Calculadora gratuita para comparar CLT e PJ no Brasil</p>
          </div>
          <nav className="footer-links">
            <Link href="/">Calculadora</Link>
            <Link href="/blog">Blog</Link>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} CLT ou PJ — Dados atualizados conforme legislação brasileira</p>
          <p className="footer-disclaimer">Esta é uma ferramenta de simulação. Consulte um contador para decisões financeiras importantes.</p>
        </div>
      </div>
    </footer>
  );
}
