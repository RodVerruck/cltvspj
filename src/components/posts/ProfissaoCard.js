export default function ProfissaoCard({ icon, title, fat, pro, frPct, anexo, economia }) {
  const isIII = anexo === 'III';
  return (
    <div className="profissao-card">
      <div className="profissao-head">
        <span className="profissao-icon">{icon}</span>
        <span className="profissao-title">{title}</span>
        <span className={`profissao-anexo-tag ${isIII ? 'profissao-anexo-tag--green' : 'profissao-anexo-tag--orange'}`}>
          Anexo {anexo}
        </span>
      </div>
      <div className="profissao-row">
        <div className="profissao-stat">
          <span className="profissao-stat-label">Faturamento</span>
          <span className="profissao-stat-val">{fat}</span>
        </div>
        <div className="profissao-stat">
          <span className="profissao-stat-label">Pró-labore</span>
          <span className="profissao-stat-val">{pro}</span>
        </div>
        <div className="profissao-stat">
          <span className="profissao-stat-label">Fator R</span>
          <span className={`profissao-stat-val ${isIII ? 'profissao-stat-val--green' : 'profissao-stat-val--orange'}`}>{frPct}</span>
        </div>
      </div>
      {economia && (
        <div className="profissao-economia">
          <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 2v12M4 6l4-4 4 4" /></svg>
          Economia: <strong>{economia}/mês</strong> vs Anexo V
        </div>
      )}
    </div>
  );
}
