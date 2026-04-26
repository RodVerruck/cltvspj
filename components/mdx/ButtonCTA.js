import Link from 'next/link';

export default function ButtonCTA({ href = '/', text = 'Calcular agora', note }) {
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 bg-[#0c4a3e] text-[#f5f1e8] my-12">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#f5f1e8]/50 block mb-3">Ferramenta gratuita</span>
            <h3 className="font-serif text-2xl md:text-3xl text-[#f5f1e8] leading-tight mb-3">Calcule o seu caso agora.</h3>
            <p className="text-[#f5f1e8]/75 leading-relaxed max-w-prose">
              Nossa calculadora compara CLT e PJ com todos os descontos,
              benefícios e a nova isenção de IR da Lei 15.270/2025.
            </p>
          </div>
          <div className="text-center md:text-left">
            <Link
              href={href}
              className="inline-flex items-center gap-2 bg-[#f5f1e8] text-[#0c4a3e] px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] font-medium rounded transition-transform hover:translate-y-[-2px] mb-3"
            >
              {text} →
            </Link>
            <p className="text-xs text-[#f5f1e8]/40 italic">
              {note || 'Gratuita · resultado em 30 segundos'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}