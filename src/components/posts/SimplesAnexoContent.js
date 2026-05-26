import { useState } from 'react';
import Link from 'next/link';

// Importação dos componentes do design system do blog
import AnexoTable from './AnexoTable';
import InfoCallout from './InfoCallout';
import StatHighlight from './StatHighlight';
import TLDRCard from './TLDRCard';
import FatorRCard from './FatorRCard';
import ComparativaTable from './ComparativaTable';
import ProfissaoCard from './ProfissaoCard';
import ErroCard from './ErroCard';
import FAQ from './FAQ';

export default function SimplesAnexoContent() {
  return (
    <>
      {/* 1. Introdução & TLDR */}
      <section id="resumo" className="content-section">
        <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--ink-muted)', marginBottom: '2rem' }}>
          Uma das maiores vantagens de trabalhar como PJ no Brasil é a carga tributária reduzida pelo <strong>Simples Nacional</strong>. Mas o quanto você vai pagar depende do <strong>Anexo</strong> em que sua atividade se encaixa — e muita gente paga imposto errado por não saber disso.
        </p>
        
        <TLDRCard />
      </section>

      <StatHighlight 
        number="R$ 5.000" 
        suffix="/mês" 
        label="Economia média saindo da CLT para PJ (com Fator R)" 
      />

      <div className="section-divider" />

      {/* 2. O que é o Simples Nacional */}
      <section id="o-que-e-o-simples-nacional" className="content-section">
        <h2 className="section-h2">O que é o Simples Nacional?</h2>
        <p className="section-lead">Regime simplificado que unifica todos os impostos numa única guia mensal — o DAS.</p>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
          Em vez de recolher vários impostos separados (IRPJ, CSLL, PIS, COFINS, ISS, etc.), você paga tudo numa única guia mensal. Podem usar o regime empresas com faturamento anual até <strong>R$ 4,8 milhões</strong> e a maioria das atividades de prestação de serviço.
        </p>
      </section>

      <div className="section-divider" />

      {/* 3. Descubra em 3 perguntas */}
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
                    { label: 'Serviço', sub: 'Anexos III, IV ou V', items: ['Presta serviços intelectuais', 'Consultoria, tecnologia', 'Saúde, direito, engenharia'], highlight: true },
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
              content: <p className="step-body">O Fator R é a relação entre sua folha de pagamento (incluindo pró-labore e INSS) e seu faturamento acumulado. Esse percentual determina em qual anexo de serviços sua atividade se enquadra. Simule seus valores abaixo.</p>
            },
            {
              num: '3',
              title: 'Aplique a regra tributária',
              content: (
                <div className="step-rule-row">
                  <div className="step-rule step-rule--green">
                    <div className="step-rule-val">{'Fator R >= 28%'}</div>
                    <div className="step-rule-name">Anexo III</div>
                    <div className="step-rule-note">Alíquotas de 6% a 33%</div>
                  </div>
                  <div className="step-rule step-rule--orange">
                    <div className="step-rule-val">{'Fator R < 28%'}</div>
                    <div className="step-rule-name">Anexo V</div>
                    <div className="step-rule-note">Alíquotas de 15,5% a 30%</div>
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

      {/* 4. O que é o Fator R (Calculadora e Conceitos) */}
      <section id="fator-r" className="content-section">
        <h2 className="section-h2">O que é o Fator R?</h2>
        <p className="section-lead">O conceito central que define o seu anexo — e consequentemente sua carga tributária.</p>
        
        <FatorRCard />

        <div style={{ background: 'var(--surface)', border: '0.5px solid var(--rule)', borderRadius: 14, overflow: 'hidden', margin: '2.5rem 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--paper)', borderBottom: '0.5px solid var(--rule)' }}>
            <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink-fade)' }}>Fórmula do Fator R</span>
            <span style={{ fontSize: 9.5, fontWeight: 500, padding: '3px 8px', background: 'var(--hot-light)', color: 'var(--hot)', borderRadius: 20, border: '0.5px solid var(--rule-strong)' }}>Conceito fiscal</span>
          </div>
          <div style={{ padding: '24px 20px 20px', borderBottom: '0.5px solid var(--rule)' }}>
            <div style={{ textAlign: 'center', padding: '18px 14px', background: 'var(--paper)', borderRadius: 9, border: '0.5px solid var(--rule)', marginBottom: 12 }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontStyle: 'italic', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, flexWrap: 'wrap' }}>
                <span>Fator R =</span>
                <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, paddingBottom: 3, borderBottom: '1.5px solid var(--ink-muted)', lineHeight: 1 }}>Folha de Pagamento (últimos 12 meses)</span>
                  <span style={{ fontSize: 13, paddingTop: 4, lineHeight: 1 }}>Receita Bruta (últimos 12 meses)</span>
                </span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
              <div style={{ background: 'var(--money-light)', border: '0.5px solid var(--rule-strong)', borderRadius: 7, padding: '11px 13px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 21, color: 'var(--money)', marginBottom: 2 }}>≥ 28%</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>Anexo III</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-fade)' }}>Dev · Designer · Consultoria TI</div>
              </div>
              <div style={{ background: 'var(--hot-light)', border: '0.5px solid var(--rule-strong)', borderRadius: 7, padding: '11px 13px' }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 21, color: 'var(--hot)', marginBottom: 2 }}>{'< 28%'}</div>
                <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>Anexo V</div>
                <div style={{ fontSize: 10.5, color: 'var(--ink-fade)' }}>Médico · Arquiteto · Engenheiro</div>
              </div>
            </div>
          </div>
          <div style={{ padding: '16px 20px', background: 'var(--surface)' }}>
            <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
              <strong>Por que isso existe?</strong> O governo criou o Fator R para incentivar prestadores de serviços intelectuais a declararem salários (pró-labore), contribuírem para o INSS e gerarem empregos. Se a sua folha (incluindo pró-labore individual e INSS pago) atingir pelo menos 28% do faturamento da empresa, você tem o direito legal de migrar para a alíquota menor do Anexo III.
            </p>
          </div>
          <div style={{ padding: '14px 20px', background: 'var(--money-light)', borderTop: '0.5px solid var(--rule-strong)' }}>
            <p style={{ fontSize: 13, color: 'var(--money)', lineHeight: 1.6, margin: 0 }}>
              <strong>Exemplo prático:</strong> faturamento R$ 15.000 · pró-labore + INSS R$ 4.500 (30%) → Fator R = 30% → <strong>Anexo III (6%)</strong>.
            </p>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* 5. Os Anexos em detalhes */}
      <section id="os-anexos-do-simples-nacional" className="content-section">
        <h2 className="section-h2">Os Anexos do Simples Nacional</h2>
        <p className="section-lead">Para prestadores de serviço existem três anexos relevantes: III, IV e V.</p>

        <h3 className="section-h2" style={{ fontSize: 17, marginBottom: 8, borderBottom: 'none', paddingBottom: 0 }}>Anexo III — O mais vantajoso</h3>
        <InfoCallout type="success">
          <strong>Alíquota inicial: 6%</strong> (faturamento até R$ 180.000/ano) — desenvolvimento de software, design, consultoria em TI, análise de dados, marketing digital.
        </InfoCallout>

        <AnexoTable
          headers={['Faturamento 12 meses', 'Alíquota Anexo III', 'Observação']}
          rows={[
            ['Até R$ 180.000', '6,00%', 'Início de atividade'],
            ['R$ 180.001 – R$ 360.000', '11,20%', 'Faixa progressiva'],
            ['R$ 360.001 – R$ 720.000', '13,50%', 'Faixa progressiva'],
            ['R$ 720.001 – R$ 1.800.000', '16,00%', 'Faixa progressiva'],
          ]}
        />

        <h3 className="section-h2" style={{ fontSize: 17, marginBottom: 8, marginTop: 24, borderBottom: 'none', paddingBottom: 0 }}>Anexo IV — Médio</h3>
        <InfoCallout type="warning">
          <strong>Atenção:</strong> o Anexo IV (onde se enquadra **advocacia**) tem alíquota inicial baixa de 4,5%, mas <strong>não inclui o INSS patronal</strong>. Você deve pagar o INSS patronal de 20% sobre a folha separadamente, o que exige cálculos precisos antes da escolha.
        </InfoCallout>

        <h3 className="section-h2" style={{ fontSize: 17, marginBottom: 8, marginTop: 24, borderBottom: 'none', paddingBottom: 0 }}>Anexo V — O mais caro</h3>
        <p style={{ fontSize: '0.97rem', lineHeight: 1.75, color: 'var(--ink-muted)', marginBottom: 8 }}>
          Alíquota inicial de <strong>15,5%</strong> — publicidade, auditorias, medicina, engenharia (quando o Fator R estiver abaixo de 28%). Se você cair aqui, vale a pena planejar o pró-labore para subir ao Anexo III ou simular o enquadramento no **Lucro Presumido** para economizar impostos.
        </p>
      </section>

      <div className="section-divider" />

      {/* 6. Comparativo Anexo III vs Anexo V */}
      <section id="comparativa" className="content-section">
        <h2 className="section-h2">Comparativo Prático: Anexo III vs Anexo V</h2>
        <p className="section-lead">A diferença tributária direta no bolso do prestador de serviços.</p>
        
        <ComparativaTable />

        <div className="exemplo-real">
          <div className="exemplo-real-label">Exemplo real — faturamento mensal R$ 10.000</div>
          <div className="exemplo-real-cols">
            <div className="exemplo-col exemplo-col--green">
              <div className="exemplo-col-head">Anexo III · Fator R 30%</div>
              <div className="exemplo-col-val">R$ 600 de imposto</div>
              <div className="exemplo-col-note">Alíquota efetiva 6%</div>
            </div>
            <div className="exemplo-vs">vs</div>
            <div className="exemplo-col exemplo-col--orange">
              <div className="exemplo-col-head">Anexo V · Fator R 20%</div>
              <div className="exemplo-col-val">R$ 1.550 de imposto</div>
              <div className="exemplo-col-note">Alíquota efetiva 15,5% — R$ 950 a mais</div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* 7. Exemplos práticos por profissão */}
      <section id="profissoes" className="content-section">
        <h2 className="section-h2">Exemplos práticos por profissão</h2>
        <p className="section-lead">Cenários reais baseados no enquadramento e na aplicação das regras fiscais.</p>
        
        <div className="profissoes-grid">
          <ProfissaoCard icon="💻" title="Desenvolvedor de Software" fat="R$ 15.000" pro="R$ 5.000" frPct="33%" anexo="III" economia="R$ 1.425" />
          <ProfissaoCard icon="🎨" title="Designer Gráfico" fat="R$ 8.000" pro="R$ 2.500" frPct="31%" anexo="III" economia="R$ 760" />
          <ProfissaoCard icon="🏥" title="Médico" fat="R$ 25.000" pro="R$ 7.000" frPct="28%" anexo="III (Fator R)" economia="R$ 2.375" />
          <ProfissaoCard icon="📐" title="Engenheiro" fat="R$ 20.000" pro="R$ 4.000" frPct="20%" anexo="V" economia={null} />
        </div>
      </section>

      <div className="section-divider" />

      {/* 8. Como o imposto é calculado na prática */}
      <section id="como-o-imposto-e-calculado-na-pratica" className="content-section">
        <h2 className="section-h2">Como o imposto é calculado na prática</h2>
        <p style={{ fontSize: '0.97rem', lineHeight: 1.75, color: 'var(--ink-muted)', marginBottom: '1.2rem' }}>
          A alíquota efetiva a pagar não é simplesmente a multiplicação seca do faturamento. Existe uma fórmula progressiva federal com uma parcela dedutível por faixa de faturamento acumulado:
        </p>
        <div style={{ background: 'var(--money-light)', border: '0.5px solid var(--rule-strong)', borderLeft: '3px solid var(--money)', borderRadius: '0 10px 10px 0', padding: '14px 18px', marginBottom: 16, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--money)', lineHeight: 1.7 }}>
          Alíquota Efetiva = (RBT12 × Alíquota Nominal − Parcela a Deduzir) ÷ RBT12
        </div>
        <p style={{ fontSize: '0.93rem', lineHeight: 1.75, color: 'var(--ink-muted)', marginBottom: '1rem' }}>
          Onde <strong>RBT12</strong> representa a receita bruta acumulada da empresa nos últimos 12 meses anteriores ao período de apuração, e a **Parcela a Deduzir** é tabelada. Na prática do dia a dia, seu contador utiliza sistemas integrados para apurar essa alíquota mensal.
        </p>
      </section>

      <div className="section-divider" />

      {/* 9. Erros Comuns */}
      <section id="erros" className="content-section">
        <h2 className="section-h2">Erros comuns que custam caro</h2>
        <p className="section-lead">Preste atenção para evitar perdas financeiras na escolha e manutenção do CNPJ.</p>
        
        <div className="erros-grid">
          <ErroCard title="Usar Anexo V sendo Anexo III" problema="Dev pagando 15,5% quando poderia pagar 6% — faturamento corroído" solucao="Certifique-se do enquadramento no CNAE e regule o Fator R" />
          <ErroCard title="Não declarar pró-labore" problema="Sem folha e sem pró-labore, seu Fator R fica em 0%, caindo no Anexo V" solucao="Defina um pró-labore adequado mensalmente" />
          <ErroCard title="Negligenciar atividades do CNPJ" problema="Registrar CNAEs inadequados pode encarecer a guia tributária básica" solucao="Planeje as atividades com o contador antes da abertura" />
          <ErroCard title="Não recalcular mensalmente" problema="O Fator R considera os últimos 12 meses. Oscilações de receita afetam a alíquota" solucao="Monitore o pró-labore e a receita constantemente" />
        </div>
      </section>

      <div className="section-divider" />

      {/* 10. Simples Nacional vs Lucro Presumido */}
      <section id="simples-nacional-vs-lucro-presumido" className="content-section">
        <h2 className="section-h2">Simples Nacional vs Lucro Presumido</h2>
        <p className="section-lead">Para faturamentos iniciais, o Simples é ideal. Em receitas altas, vale analisar a alternativa.</p>
        
        <AnexoTable
          headers={['Regime Tributário', 'Quando vale a pena', 'Perfil ideal']}
          rows={[
            ['Simples Nacional', 'Faturamento até ~R$ 30.000 mensais', 'PJs iniciais e pequenas empresas'],
            ['Lucro Presumido', 'Faturamento acima de R$ 30.000 - R$ 40.000', 'TI/Consultoria de alta receita ou Anexo V sem Fator R'],
            ['Lucro Real', 'Geralmente inviável para PJs de serviços', 'Empresas de grande porte com altas despesas operacionais'],
          ]}
        />
        
        <InfoCallout type="warning">
          <strong>Atenção:</strong> A transição de regime e definição tributária final deve ser acompanhada e validada com seu profissional de contabilidade de confiança.
        </InfoCallout>
      </section>

      <div className="section-divider" />

      {/* 11. FAQ */}
      <section id="faq" className="content-section">
        <h2 className="section-h2">Perguntas frequentes (FAQ)</h2>
        <p className="section-lead">Esclareça suas dúvidas rápidas sobre o enquadramento no Simples Nacional.</p>
        
        <FAQ />
      </section>

      <div className="section-divider" />

      {/* 12. Resumo */}
      <section id="resumo-final" className="content-section">
        <h2 className="section-h2">Resumo: o que você precisa saber</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '0.5px solid var(--rule)', borderRadius: 14, overflow: 'hidden', background: 'var(--surface)', marginBottom: 8 }}>
          {[
            { icon: '✓', text: 'O Simples Nacional é o regime mais prático e econômico para quem inicia a jornada PJ.' },
            { icon: '✓', text: 'O Anexo III é o mais vantajoso, cobrando 6% de alíquota inicial para atividades de TI, design e consultoria.' },
            { icon: '✓', text: 'Você pode reduzir legalmente seu imposto do Anexo V para o Anexo III aplicando a regra do Fator R.' },
            { icon: '✓', text: 'Uma contabilidade estruturada economiza milhares de reais ao planejar pró-labore e emitir guias corretamente.' },
          ].map((item, i, arr) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
              borderBottom: i < arr.length - 1 ? '0.5px solid var(--rule)' : 'none',
            }}>
              <span style={{ width: 20, height: 20, background: 'var(--money)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <span style={{ fontSize: 13.5, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="section-divider" />
    </>
  );
}
