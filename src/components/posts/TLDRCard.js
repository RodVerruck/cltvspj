import Link from 'next/link';

export default function TLDRCard() {
  return (
    <div className="tldr-card">
      <div className="tldr-stripe" />
      <div className="tldr-inner">

        <div className="tldr-head">
          <div className="tldr-badge">
            <span className="tldr-dot" />
            Resumo rápido
          </div>
          <span className="tldr-time">Leitura: 40 seg</span>
        </div>

        <p className="tldr-title">
          Qual anexo usar depende da sua atividade — e, para serviços, do seu Fator&nbsp;R.
        </p>

        <div className="anexo-grid">
          {[
            { num: 'I', desc: 'Comércio — loja, e-commerce', highlight: false },
            { num: 'II', desc: 'Indústria — fábrica, produção', highlight: false },
            { num: 'III', desc: 'Serviços — Fator R ≥ 28%', highlight: 'green' },
            { num: 'IV', desc: 'Construção civil', highlight: false },
            { num: 'V', desc: 'Serviços — Fator R < 28%', highlight: 'orange' },
          ].map(a => (
            <div key={a.num} className={`anexo-pill ${a.highlight ? `anexo-pill--${a.highlight}` : ''}`}>
              <span className="anexo-num">{a.num}</span>
              <span className="anexo-desc">{a.desc}</span>
            </div>
          ))}
        </div>

        <div className="regra-ouro">
          <div className="regra-icon">
            <svg viewBox="0 0 12 12" width="10" height="10" fill="white">
              <path d="M6 1L7.3 4.6H11L8 6.9L9.1 10.5L6 8.2L2.9 10.5L4 6.9L1 4.6H4.7Z" />
            </svg>
          </div>
          <p className="regra-text">
            <strong>Regra de ouro:</strong> Prestadores de serviço devem calcular o Fator R.
            Se ≥ 28%, usam o Anexo III (alíquota inicial de 6%). Se &lt; 28%, caem no Anexo V
            (alíquota inicial de 15%) — <strong>até 40% mais caro.</strong>
          </p>
        </div>

        <div className="tldr-cta-row">
          <Link href="/" className="btn-primary">
            Calcular meu Fator R
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </Link>
          <span className="tldr-cta-note">Grátis · resultado em 30 segundos</span>
        </div>
      </div>
    </div>
  );
}
