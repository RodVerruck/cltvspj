import Link from 'next/link';

export default function ButtonCTA({ href = '/', text = 'Calcular agora', note }) {
  return (
    <div className="my-12 -mx-4 md:mx-0">
      <div className="band-cta">
        <div className="cta-grid">
          <div>
            <span className="cta-eyebrow">Ferramenta gratuita</span>
            <h3 className="cta-title">Calcule o seu caso agora.</h3>
            <p className="cta-desc">
              Nossa calculadora compara CLT e PJ com todos os descontos,
              benefícios e a nova isenção de IR da Lei 15.270/2025.
            </p>
          </div>
          <div className="cta-action">
            <Link href={href} className="cta-button">
              {text} →
            </Link>
            {note && <span className="cta-note">{note}</span>}
            {!note && <span className="cta-note">Gratuita · resultado em 30 segundos</span>}
          </div>
        </div>
      </div>
    </div>
  );
}