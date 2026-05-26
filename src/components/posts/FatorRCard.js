import { useState } from 'react';

export default function FatorRCard() {
  const [fat, setFat] = useState('');
  const [pro, setPro] = useState('');

  const fr = fat && pro ? ((parseFloat(pro) / parseFloat(fat)) * 100) : null;
  const isGreen = fr !== null && fr >= 28;
  const isOrange = fr !== null && fr < 28;

  return (
    <div className="fatorr-wrap">
      {/* Header */}
      <div className="fatorr-header">
        <span className="fatorr-label">Fórmula do Fator R</span>
        <span className="fatorr-badge">Conceito central</span>
      </div>

      {/* Fórmula tipográfica */}
      <div className="fatorr-formula-area">
        <div className="formula-display">
          <div className="formula-eq">
            <span>Fator R =</span>
            <span className="frac">
              <span className="frac-num">Folha de Pagamento</span>
              <span className="frac-bar" />
              <span className="frac-den">Faturamento</span>
            </span>
            <span className="formula-times">×</span>
            <span>100</span>
          </div>
        </div>

        {/* Limiares */}
        <div className="threshold-row">
          <div className="threshold-card threshold-card--green">
            <div className="threshold-val">≥ 28%</div>
            <div className="threshold-name">Anexo III</div>
            <div className="threshold-who">Dev · Designer · Consultoria</div>
          </div>
          <div className="threshold-card threshold-card--orange">
            <div className="threshold-val">{'< 28%'}</div>
            <div className="threshold-name">Anexo V</div>
            <div className="threshold-who">Médico · Engenheiro · Arquiteto</div>
          </div>
        </div>
      </div>

      {/* Calculadora inline */}
      <div className="fatorr-calc">
        <p className="calc-label">Calcule o seu agora</p>
        <div className="calc-inputs">
          <div className="input-group">
            <label>Faturamento mensal (R$)</label>
            <input
              type="number"
              placeholder="ex: 10000"
              value={fat}
              onChange={e => setFat(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Pró-labore mensal (R$)</label>
            <input
              type="number"
              placeholder="ex: 3000"
              value={pro}
              onChange={e => setPro(e.target.value)}
            />
          </div>
        </div>

        <div className={`calc-result ${isGreen ? 'calc-result--green' : isOrange ? 'calc-result--orange' : ''}`}>
          <div>
            <div className="result-label">Seu Fator R</div>
            <div className={`result-val ${isGreen ? 'result-val--green' : isOrange ? 'result-val--orange' : ''}`}>
              {fr !== null ? `${fr.toFixed(1)}%` : '—'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={`result-anexo ${isGreen ? 'result-anexo--green' : isOrange ? 'result-anexo--orange' : 'result-anexo--neutral'}`}>
              {fr === null ? 'preencha acima' : isGreen ? 'Anexo III' : 'Anexo V'}
            </div>
            <div className="result-note">
              {fr === null
                ? 'insira faturamento e pró-labore'
                : isGreen
                  ? 'Alíquota inicial de 6% — bem posicionado'
                  : 'Alíquota inicial de 15% — ajuste o pró-labore'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
