import AnexoTable from './AnexoTable';
import InfoCallout from './InfoCallout';
import ProfissaoExemplo from './ProfissaoExemplo';
import StatHighlight from './StatHighlight';

export default function SimplesAnexoContent() {
  return (
    <>
      <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--ink2)', marginBottom: '1.2rem' }}>
        Uma das maiores vantagens de trabalhar como PJ no Brasil é a carga tributária reduzida pelo <strong>Simples Nacional</strong>. Mas o quanto você vai pagar depende do <strong>Anexo</strong> em que sua atividade se encaixa — e muita gente paga imposto errado por não saber disso.
      </p>

      <StatHighlight 
        number="R$ 5.000" 
        suffix="/mês" 
        label="Economia média saindo da CLT para PJ (com Fator R)" 
      />

      <div id="o-que-e-o-simples-nacional" className="section-divider" />
      <h2 className="section-h2">O que é o Simples Nacional?</h2>
      <p className="section-lead">Regime simplificado que unifica todos os impostos numa única guia mensal — o DAS.</p>
      <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--ink2)', marginBottom: '1rem' }}>
        Em vez de recolher vários impostos separados (IRPJ, CSLL, PIS, COFINS, ISS, etc.), você paga tudo numa única guia mensal. Podem usar o regime empresas com faturamento anual até <strong>R$ 4,8 milhões</strong> e a maioria das atividades de prestação de serviço.
      </p>

      <div id="os-anexos-do-simples-nacional" className="section-divider" />
      <h2 className="section-h2">Os Anexos do Simples Nacional</h2>
      <p className="section-lead">Para prestadores de serviço existem três anexos relevantes: III, IV e V.</p>

      <h3 className="section-h2" style={{ fontSize: 17, marginBottom: 8, borderBottom: 'none', paddingBottom: 0 }}>Anexo III — O mais vantajoso</h3>
      <InfoCallout type="success">
        <strong>Alíquota inicial: 6%</strong> (faturamento até R$ 180.000/ano) — desenvolvimento de software, design, consultoria em TI, análise de dados, agências de marketing digital.
      </InfoCallout>

      <AnexoTable
        headers={['Faturamento 12 meses', 'Alíquota Anexo III', 'Observação']}
        rows={[
          ['Até R$ 180.000', '6,00%', 'Início de atividade'],
          ['R$ 180.001 – R$ 360.000', '11,20%', ''],
          ['R$ 360.001 – R$ 720.000', '13,50%', ''],
          ['R$ 720.001 – R$ 1.800.000', '16,00%', ''],
        ]}
      />

      <h3 className="section-h2" style={{ fontSize: 17, marginBottom: 8, marginTop: 24, borderBottom: 'none', paddingBottom: 0 }}>Anexo IV — Médio</h3>
      <InfoCallout type="warning">
        <strong>Atenção:</strong> o Anexo IV (advocacia, medicina, engenharia) tem alíquota inicial de 4,5%, mas <strong>não inclui o INSS</strong> — você paga o INSS patronal separadamente (~20%), o que pode torná-lo mais caro que parece.
      </InfoCallout>

      <h3 className="section-h2" style={{ fontSize: 17, marginBottom: 8, marginTop: 24, borderBottom: 'none', paddingBottom: 0 }}>Anexo V — O mais caro</h3>
      <p style={{ fontSize: '0.97rem', lineHeight: 1.75, color: 'var(--ink2)', marginBottom: 8 }}>
        Alíquota inicial de <strong>15,5%</strong> — publicidade, auditoria, algumas consultorias. Se você cair aqui, vale considerar o <strong>Lucro Presumido</strong> como alternativa — ou usar o Fator R para migrar ao III.
      </p>

      <div id="como-saber-qual-anexo-e-o-seu" className="section-divider" />
      <h2 className="section-h2">Como saber qual Anexo é o seu?</h2>
      <p className="section-lead">A regra principal é o CNAE — mas o Fator R pode mudar tudo.</p>

      <div style={{ background: 'var(--white)', border: '0.5px solid var(--rule)', borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: 'var(--paper)', borderBottom: '0.5px solid var(--rule)' }}>
          <span style={{ fontSize: 10.5, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--ink4)' }}>Fórmula do Fator R</span>
          <span style={{ fontSize: 9.5, fontWeight: 500, padding: '3px 8px', background: 'var(--orange-light)', color: 'var(--orange)', borderRadius: 20, border: '0.5px solid var(--orange-border)' }}>Conceito central</span>
        </div>
        <div style={{ padding: '20px 20px 16px', borderBottom: '0.5px solid var(--rule)' }}>
          <div style={{ textAlign: 'center', padding: '18px 14px', background: 'var(--paper)', borderRadius: 9, border: '0.5px solid var(--rule)', marginBottom: 12 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 19, fontStyle: 'italic', color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, flexWrap: 'wrap' }}>
              <span>Fator R =</span>
              <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 13, paddingBottom: 3, borderBottom: '1.5px solid var(--ink3)', lineHeight: 1 }}>Folha de Pagamento (12 meses)</span>
                <span style={{ fontSize: 13, paddingTop: 4, lineHeight: 1 }}>Receita Bruta (12 meses)</span>
              </span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            <div style={{ background: 'var(--blue-light)', border: '0.5px solid var(--blue-border)', borderRadius: 7, padding: '11px 13px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 21, color: 'var(--blue)', marginBottom: 2 }}>≥ 28%</div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>Anexo III</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink4)' }}>Dev · Designer · Consultoria</div>
            </div>
            <div style={{ background: 'var(--orange-light)', border: '0.5px solid var(--orange-border)', borderRadius: 7, padding: '11px 13px' }}>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 21, color: 'var(--orange-mid)', marginBottom: 2 }}>{'< 28%'}</div>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--ink)', marginBottom: 2 }}>Anexo V</div>
              <div style={{ fontSize: 10.5, color: 'var(--ink4)' }}>Médico · Advogado · Arquiteto</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px 20px 0', background: 'var(--white)' }}>
          <p style={{
            fontSize: 13,
            color: 'var(--ink3)',
            lineHeight: 1.6,
            margin: 0,
            fontStyle: 'italic'
          }}>
            <strong>Por que isso existe?</strong> O governo criou o Fator R para incentivar
            empresas de serviços de alto valor intelectual a pagarem salários (pró-labore)
            e gerarem empregos. Se você 'valoriza' sua equipe (ou a si mesmo) pagando um
            pró-labore de pelo menos 28%, você é 'premiado' com a alíquota menor do Anexo III.
          </p>
        </div>

        <div style={{ padding: '14px 20px', background: 'var(--blue-light)', borderTop: '0.5px solid var(--blue-border)' }}>
          <p style={{ fontSize: 13, color: 'var(--blue-text)', lineHeight: 1.6, margin: 0 }}>
            <strong>Exemplo prático:</strong> faturamento R$ 15.000 · pró-labore R$ 4.500 (30%) → Fator R = 30% → <strong>Anexo III (6%)</strong>
          </p>
        </div>
      </div>

      <div id="exemplo-de-calculo-real-por-profissao" className="section-divider" />
      <h2 className="section-h2">Exemplos práticos por profissão</h2>
      <p className="section-lead">Números reais para você comparar com a sua situação.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 8 }}>
        <ProfissaoExemplo icon="💻" title="Desenvolvedor de Software" tag="Anexo III" faturamento="R$ 12.000" aliquota="6%" extra={{ label: 'Regime', val: 'Simples III' }} imposto="R$ 720" isGreen />
        <ProfissaoExemplo icon="⚖️" title="Advogado" tag="Anexo IV" faturamento="R$ 15.000" aliquota="4,5% + INSS" extra={{ label: 'Pró-labore', val: 'R$ 3.000' }} imposto="~R$ 1.275" isGreen={false} />
        <ProfissaoExemplo icon="📣" title="Consultor de Marketing" tag="Anexo V → III" faturamento="R$ 20.000" aliquota="6% c/ Fator R" extra={{ label: 'Economia', val: 'R$ 1.900/mês' }} imposto="R$ 1.200 vs R$ 3.100" isGreen />
        <ProfissaoExemplo icon="🏥" title="Médico" tag="Anexo IV" faturamento="R$ 25.000" aliquota="4,5% + INSS" extra={{ label: 'Pró-labore', val: 'R$ 5.000' }} imposto="~R$ 2.125" isGreen={false} />
      </div>

      <div id="como-o-imposto-e-calculado-na-pratica" className="section-divider" />
      <h2 className="section-h2">Como o imposto é calculado na prática</h2>
      <p style={{ fontSize: '0.97rem', lineHeight: 1.75, color: 'var(--ink2)', marginBottom: '1rem' }}>
        A alíquota efetiva não é simplesmente multiplicada pelo faturamento — existe uma fórmula com uma parcela a deduzir para suavizar a progressividade:
      </p>
      <div style={{ background: 'var(--blue-light)', border: '0.5px solid var(--blue-border)', borderLeft: '3px solid var(--blue)', borderRadius: '0 10px 10px 0', padding: '14px 18px', marginBottom: 16, fontFamily: 'var(--mono)', fontSize: 14, color: 'var(--blue-text)', lineHeight: 1.7 }}>
        Alíquota efetiva = (RBT12 × Alíquota nominal − PD) ÷ RBT12
      </div>
      <p style={{ fontSize: '0.93rem', lineHeight: 1.75, color: 'var(--ink2)', marginBottom: '1rem' }}>
        Onde <strong>RBT12</strong> = receita bruta dos últimos 12 meses e <strong>PD</strong> = parcela a deduzir conforme tabela do Anexo. Na prática, seu contador faz esse cálculo automaticamente.
      </p>

      <div id="simples-nacional-vs-lucro-presumido" className="section-divider" />
      <h2 className="section-h2">Simples Nacional vs Lucro Presumido</h2>
      <p className="section-lead">Para a maioria dos PJs iniciantes o Simples é melhor — mas acima de R$ 30k/mês vale simular.</p>
      <AnexoTable
        headers={['Regime', 'Quando vantajoso', 'Perfil']}
        rows={[
          ['Simples Nacional', 'Até ~R$ 30.000/mês', 'Maioria dos PJs'],
          ['Lucro Presumido', 'Acima de R$ 30–40k/mês', 'Faturamento alto'],
          ['Lucro Real', 'Muitas despesas dedutíveis', 'Empresas com custos'],
        ]}
      />
      <InfoCallout type="warning">
        Sempre consulte seu contador antes de mudar de regime tributário.
      </InfoCallout>

      <div id="resumo-o-que-voce-precisa-saber" className="section-divider" />
      <h2 className="section-h2">Resumo: o que você precisa saber</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '0.5px solid var(--rule)', borderRadius: 14, overflow: 'hidden', background: 'var(--white)', marginBottom: 8 }}>
        {[
          { icon: '✓', text: 'Simples Nacional é quase sempre o melhor regime para PJs que estão começando' },
          { icon: '✓', text: 'O Anexo III (6%) é o mais vantajoso — aplica-se para TI, design e consultoria' },
          { icon: '✓', text: 'O Fator R pode te ajudar a migrar do Anexo V para o III legalmente' },
          { icon: '✓', text: 'Ter um bom contador economiza muito mais do que o custo mensal dele' },
        ].map((item, i, arr) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 18px',
            borderBottom: i < arr.length - 1 ? '0.5px solid var(--rule2)' : 'none',
          }}>
            <span style={{ width: 20, height: 20, background: 'var(--blue)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: 'white', flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
            <span style={{ fontSize: 13.5, color: 'var(--ink2)', lineHeight: 1.6 }}>{item.text}</span>
          </div>
        ))}
      </div>

      <div className="section-divider" />
    </>
  );
}
