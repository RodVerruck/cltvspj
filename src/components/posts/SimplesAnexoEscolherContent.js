import { useState } from 'react';
import Link from 'next/link';

// Importando componentes compartilhados
import TLDRCard from './TLDRCard';
import FatorRCard from './FatorRCard';
import ComparativaTable from './ComparativaTable';
import ProfissaoCard from './ProfissaoCard';
import ErroCard from './ErroCard';
import FAQ from './FAQ';
import StatHighlight from './StatHighlight';

export default function SimplesAnexoEscolherContent() {
  return (
    <>
      <section id="resumo" className="content-section">
        <TLDRCard />
      </section>

      <StatHighlight 
        number="R$ 5.000" 
        suffix="/mês" 
        label="Economia média saindo da CLT para PJ (com Fator R)" 
      />

      <div className="section-divider" />

      <section id="introducao" className="content-section">
        <p className="text-lg text-ink-muted mb-6">
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
                    <div className="step-rule-val">{'Fator R >= 28%'}</div>
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
          background: 'var(--money-light)',
          border: '0.5px solid var(--rule-strong)',
          borderLeft: '3px solid var(--money)',
          borderRadius: '0 10px 10px 0',
          padding: '16px 20px',
          margin: '20px 0',
          fontSize: 14,
          lineHeight: 1.6,
          color: 'var(--money)'
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
