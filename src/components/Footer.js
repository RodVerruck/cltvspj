import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr] gap-8 md:gap-12 pb-10 border-b border-paper/15">
          <div className="col-span-2 md:col-span-1">
            <div className="font-display text-4xl leading-none mb-4 tracking-editorial">
              CLT <em className="italic text-hot-light">vs</em> PJ
            </div>
            <p className="text-sm text-paper/60 max-w-xs leading-relaxed">
              Calculadora tributária para profissionais brasileiros. Atualizada. Gratuita. Sem pegadinhas.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50 mb-4 font-medium">
              Ferramentas
            </h4>
            <Link href="/" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">Calculadora CLT × PJ</Link>
            <Link href="/" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">Simulador Fator R</Link>
            <Link href="/" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">MEI × Simples</Link>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50 mb-4 font-medium">
              Recursos
            </h4>
            <Link href="/blog" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">Blog</Link>
            <Link href="/blog/vale-pena-pj-isencao-ir-lei-15270-2026" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">Guia Lei 15.270</Link>
            <a href="#" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">Glossário</a>
          </div>

          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/50 mb-4 font-medium">
              Sobre
            </h4>
            <a href="#" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">Metodologia</a>
            <a href="#" className="block text-sm text-paper/85 hover:text-paper mb-2 transition-colors">Contato</a>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs text-paper/40 font-mono tracking-wide">
          <span> 2026 · Construído em Florianópolis</span>
          <span>v2.0 · ATUALIZADO LEI 15.270/2025</span>
        </div>
      </div>
    </footer>
  );
}
