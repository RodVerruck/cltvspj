import { useState } from 'react';
import Link from 'next/link';

function TLDRCard() {
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
          <Link href="#fator-r" className="btn-primary">
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

function FatorRCard() {
  const [fat, setFat] = useState('');
  const [pro, setPro] = useState('');

  const fr = fat && pro ? ((parseFloat(pro) / parseFloat(fat)) * 100) : null;
  const isGreen = fr !== null && fr >= 28;
  const isOrange = fr !== null && fr < 28;

  return (
    <div className="bg-money-light border border-money rounded-2xl p-8 my-12 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <span className="font-mono text-sm text-money font-semibold">Fórmula do Fator R</span>
        <span className="bg-money text-paper px-3 py-1 rounded-full text-xs font-medium">Conceito central</span>
      </div>

      <div className="mb-8">
        <div className="bg-paper border border-rule rounded-lg p-6 text-center">
          <div className="flex items-center justify-center gap-4 text-lg font-mono">
            <span className="text-ink">Fator R =</span>
            <div className="flex flex-col items-center">
              <span className="text-ink font-semibold">Folha de Pagamento</span>
              <div className="w-full h-0.5 bg-rule my-1"></div>
              <span className="text-ink font-semibold">Faturamento</span>
            </div>
            <span className="text-ink">×</span>
            <span className="text-ink font-semibold">100</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className={`p-4 rounded-lg border ${isGreen ? 'bg-money/10 border-money' : 'bg-paper border-rule'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isGreen ? 'bg-money' : 'bg-ink3'}`}></div>
              <span className={`font-mono font-bold ${isGreen ? 'text-money' : 'text-ink'}`}>>= 28%</span>
            </div>
            <div className={`font-semibold ${isGreen ? 'text-money' : 'text-ink'}`}>Anexo III</div>
            <div className="text-sm text-ink3 mt-1">Dev · Designer · Consultoria</div>
          </div>

          <div className={`p-4 rounded-lg border ${isOrange ? 'bg-hot-light border-hot' : 'bg-paper border-rule'}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isOrange ? 'bg-hot' : 'bg-ink3'}`}></div>
              <span className={`font-mono font-bold ${isOrange ? 'text-hot' : 'text-ink'}`}>< 28%</span>
            </div>
            <div className={`font-semibold ${isOrange ? 'text-hot' : 'text-ink'}`}>Anexo V</div>
            <div className="text-sm text-ink3 mt-1">Médico · Advogado · Arquiteto</div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-ink">Calcule o seu agora</h3>

        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center border-b border-rule py-2">
            <label className="text-ink font-medium">Faturamento mensal</label>
            <input
              type="number"
              placeholder="ex: 10000"
              value={fat}
              onChange={e => setFat(e.target.value)}
              className="text-right w-32 px-3 py-1 border border-rule rounded bg-paper text-ink font-mono"
            />
          </div>

          <div className="flex justify-between items-center border-b border-rule py-2">
            <label className="text-ink font-medium">Pró-labore mensal</label>
            <input
              type="number"
              placeholder="ex: 3000"
              value={pro}
              onChange={e => setPro(e.target.value)}
              className="text-right w-32 px-3 py-1 border border-rule rounded bg-paper text-ink font-mono"
            />
          </div>
        </div>

        <div className={`p-4 rounded-lg ${isGreen ? 'bg-money/10 border border-money' : isOrange ? 'bg-hot-light border border-hot' : 'bg-paper border border-rule'}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-sm text-ink3 mb-1">Seu Fator R</div>
              <div className={`text-2xl font-bold font-mono ${isGreen ? 'text-money' : isOrange ? 'text-hot' : 'text-ink'}`}>
                {fr !== null ? `${fr.toFixed(1)}%` : '—'}
              </div>
            </div>
            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${isGreen ? 'bg-money text-paper' : isOrange ? 'bg-hot text-paper' : 'bg-ink3 text-paper'}`}>
                {fr === null ? 'preencha acima' : isGreen ? 'Anexo III' : 'Anexo V'}
              </div>
              <div className="text-sm text-ink3 mt-2 max-w-xs">
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
    </div>
  );
}

function ComparativaTable() {
  const rows = [
    { label: 'Quando usar', iii: 'Fator R ≥ 28%', v: 'Fator R < 28%' },
    { label: 'Alíquota inicial', iii: '6%', v: '15%' },
    { label: 'Alíquota máxima', iii: '33%', v: '30%' },
    { label: 'Perfil típico', iii: 'Dev · Designer · Consultoria', v: 'Médico · Advogado · Arquiteto' },
    { label: 'Impacto anual', iii: 'Até R$ 10.800 a menos', v: 'Referência base' },
  ];
  return (
    <div className="compare-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th className="compare-th compare-th--neutral"></th>
            <th className="compare-th compare-th--green">
              Anexo III
              <span className="compare-badge">Recomendado</span>
            </th>
            <th className="compare-th compare-th--neutral">Anexo V</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.label}>
              <td className="compare-td compare-td--label">{r.label}</td>
              <td className="compare-td compare-td--green">{r.iii}</td>
              <td className="compare-td">{r.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfissaoCard({ icon, title, fat, pro, frPct, anexo, economia }) {
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

function ErroCard({ title, problema, solucao }) {
  return (
    <div className="erro-card">
      <div className="erro-head">
        <span className="erro-x">✕</span>
        <span className="erro-title">{title}</span>
      </div>
      <div className="erro-body">
        <div className="erro-row">
          <span className="erro-key">Problema</span>
          <span className="erro-val">{problema}</span>
        </div>
        <div className="erro-row">
          <span className="erro-key">Solução</span>
          <span className="erro-val erro-val--green">{solucao}</span>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q: 'Posso mudar de anexo no ano seguinte?', a: 'Sim. Você pode alterar o anexo em janeiro de cada ano, desde que a atividade exercida permita a opção pelo novo enquadramento.' },
    { q: 'E se meu Fator R variar durante o ano?', a: 'Use a média dos 12 meses anteriores para calcular o Fator R que valerá para o ano corrente. Revisões retroativas não são permitidas.' },
    { q: 'Tenho que comprovar o Fator R?', a: 'Sim. Mantenha os registros de folha de pagamento e faturamento mensais. Em caso de auditoria, esses documentos são obrigatórios.' },
    { q: 'E se eu errar o anexo?', a: 'Você pode retificar as apurações, mas estará sujeito a multas e juros sobre a diferença apurada. Consulte um contador antes de retificar.' },
  ];
  return (
    <div className="faq-list">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${open === i ? 'faq-item--open' : ''}`}>
          <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            <span>{item.q}</span>
            <span className="faq-chevron">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="faq-answer">{item.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function SimplesAnexoEscolherContent() {
  return (
    <>
      <section id="resumo" className="content-section">
        <TLDRCard />
      </section>

      <div className="section-divider" />

      <section id="introducao" className="content-section">
        <p className="text-lg text-muted-foreground mb-6">
          Sabemos que a sopa de letrinhas da Receita Federal pode assustar, mas vamos
          resolver isso juntos de forma simples. O Fator R é o conceito central que
          define o seu anexo, e entender ele pode economizar milhares de reais por ano.
        </p>
      </section>

      <div className="section-divider" />

      <section id="passo-a-passo" className="content-section">
        <h2 className="section-h2">Passo a passo: descubra seu anexo em 3 perguntas</h2>
        <div className="steps-list">
          {[
            {
              num: '1',
              title: 'Sua atividade é comércio, indústria ou serviço?',
              content: (
                <div className="step-cols">
                  {[
                    { label: 'Comércio', sub: 'Anexo I', items: ['Vende produtos prontos', 'Loja física ou online', 'Distribuidora, atacadista'] },
                    { label: 'Indústria', sub: 'Anexo II', items: ['Fabrica produtos', 'Transforma matéria-prima', 'Produção em série'] },
                    { label: 'Serviço', sub: 'Anexos III, IV ou V', items: ['Presta serviços intelectuais', 'Consultoria, tecnologia', 'Saúde, direito, arquitetura'], highlight: true },
                  ].map(c => (
                    <div key={c.label} className={`step-col ${c.highlight ? 'step-col--highlight' : ''}`}>
                      <div className="step-col-label">{c.label}</div>
                      <div className="step-col-sub">{c.sub}</div>
                      <ul className="step-col-list">
                        {c.items.map(item => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>
              )
            },
            {
              num: '2',
              title: 'Se é serviço, calcule seu Fator R',
              content: <p className="step-body">O Fator R é a relação entre sua folha de pagamento (pró-labore) e seu faturamento. Esse percentual determina qual anexo de serviços você enquadra. Veja a calculadora abaixo.</p>
            },
            {
              num: '3',
              title: 'Aplique a regra',
              content: (
                <div className="step-rule-row">
                  <div className="step-rule step-rule--green">
                    <div className="step-rule-val">Fator R ≥ 28%</div>
                    <div className="step-rule-name">Anexo III</div>
                    <div className="step-rule-note">Alíquotas de 6% a 33%</div>
                  </div>
                  <div className="step-rule step-rule--orange">
                    <div className="step-rule-val">{'Fator R < 28%'}</div>
                    <div className="step-rule-name">Anexo V</div>
                    <div className="step-rule-note">Alíquotas de 15% a 30%</div>
                  </div>
                </div>
              )
            },
          ].map(step => (
            <div key={step.num} className="step-item">
              <div className="step-num">{step.num}</div>
              <div className="step-content">
                <div className="step-title">{step.title}</div>
                {step.content}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />

      <section id="fator-r" className="content-section">
        <h2 className="section-h2">O que é o Fator R?</h2>
        <p className="section-lead">O conceito central que define o seu anexo — e consequentemente sua carga tributária.</p>
        <FatorRCard />
        <div className="context-box" style={{
          background: 'var(--blue-light)',
          border: '0.5px solid var(--blue-border)',
          borderLeft: '3px solid var(--blue)',
          borderRadius: '0 10px 10px 0',
          padding: '16px 20px',
          margin: '20px 0',
          fontSize: 14,
          lineHeight: 1.6,
          color: 'var(--blue-text)'
        }}>
          <strong>Por que isso existe?</strong> O governo criou o Fator R para incentivar
          empresas de serviços de alto valor intelectual a pagarem salários (pró-labore)
          e gerarem empregos. Se você 'valoriza' sua equipe (ou a si mesmo) pagando um
          pró-labore de pelo menos 28%, você é 'premiado' com a alíquota menor do Anexo III.
        </div>
      </section>

      <div className="section-divider" />

      <section id="comparativa" className="content-section">
        <h2 className="section-h2">Anexo III vs Anexo V</h2>
        <p className="section-lead">Para prestadores de serviço, esta comparação define a sua carga tributária anual.</p>
        <ComparativaTable />
        <div className="exemplo-real">
          <div className="exemplo-real-label">Exemplo real — faturamento R$ 10.000</div>
          <div className="exemplo-real-cols">
            <div className="exemplo-col exemplo-col--green">
              <div className="exemplo-col-head">Anexo III · Fator R 30%</div>
              <div className="exemplo-col-val">R$ 600 de imposto</div>
              <div className="exemplo-col-note">Alíquota 6%</div>
            </div>
            <div className="exemplo-vs">vs</div>
            <div className="exemplo-col exemplo-col--orange">
              <div className="exemplo-col-head">Anexo V · Fator R 20%</div>
              <div className="exemplo-col-val">R$ 1.500 de imposto</div>
              <div className="exemplo-col-note">Alíquota 15% — R$ 900 a mais</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section id="profissoes" className="content-section">
        <h2 className="section-h2">Exemplos práticos por profissão</h2>
        <div className="profissoes-grid">
          <ProfissaoCard icon="💻" title="Desenvolvedor de Software" fat="R$ 15.000" pro="R$ 5.000" frPct="33%" anexo="III" economia="R$ 1.350" />
          <ProfissaoCard icon="🎨" title="Designer Gráfico" fat="R$ 8.000" pro="R$ 3.000" frPct="37,5%" anexo="III" economia="R$ 720" />
          <ProfissaoCard icon="🏥" title="Médico" fat="R$ 25.000" pro="R$ 5.000" frPct="20%" anexo="V" economia={null} />
          <ProfissaoCard icon="⚖️" title="Advogado" fat="R$ 20.000" pro="R$ 4.000" frPct="20%" anexo="V" economia={null} />
        </div>
      </section>

      <div className="section-divider" />

      <section id="erros" className="content-section">
        <h2 className="section-h2">Erros comuns que custam caro</h2>
        <div className="erros-grid">
          <ErroCard title="Usar Anexo V sendo Anexo III" problema="Dev pagando 15% quando poderia pagar 6% — até 40% a mais" solucao="Calcule o Fator R antes de escolher o anexo" />
          <ErroCard title="Não declarar pró-labore" problema="Fator R fica 0%, enquadrando automaticamente no Anexo V" solucao="Defina e registre um pró-labore adequado" />
          <ErroCard title="Misturar atividades no CNPJ" problema="Comércio e serviço no mesmo CNPJ — anexo mais caro prevalece" solucao="Separe as atividades ou escolha a predominante" />
          <ErroCard title="Não recalcular anualmente" problema="Fator R muda com o tempo e o anexo pode mudar junto" solucao="Revise seu enquadramento todo janeiro" />
        </div>
      </section>

      <div className="section-divider" />

      <section id="faq" className="content-section">
        <h2 className="section-h2">Perguntas frequentes</h2>
        <FAQ />
      </section>

      <div className="section-divider" />
    </>
  );
}
