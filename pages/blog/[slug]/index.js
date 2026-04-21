import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import { ArrowLeft, Calculator, List } from 'lucide-react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import AffiliateCTA from '../../../components/AffiliateCTA';
import PostContent from '../../../components/posts/PostContent';
import SimplesAnexoEscolherContent from '../../../components/posts/SimplesAnexoEscolherContent';
import SimplesAnexoContent from '../../../components/posts/SimplesAnexoContent';
import { SITE_URL } from '../../../lib/config';

/* ─────────────────────────────────────────
   COMPONENTE: TL;DR Hero Card
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   COMPONENTE: Fator R — fórmula + calculadora inline
───────────────────────────────────────── */
function FatorRCard() {
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
            <div className="threshold-who">Médico · Advogado · Arquiteto</div>
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

/* ─────────────────────────────────────────
   COMPONENTE: Tabela comparativa III vs V
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   COMPONENTE: Exemplo de profissão card
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   COMPONENTE: Erro comum card
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   COMPONENTE: FAQ accordion
───────────────────────────────────────── */
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

/* ─────────────────────────────────────────
   SLUGS com conteúdo customizado
   Adicione novos slugs aqui conforme necessário
───────────────────────────────────────── */
const CUSTOM_SLUGS = {
  'simples-nacional-pj-qual-anexo-escolher': [
    { id: 'resumo', title: 'Resumo rápido (TL;DR)' },
    { id: 'passo-a-passo', title: 'Passo a passo — 3 perguntas' },
    { id: 'fator-r', title: 'O que é o Fator R' },
    { id: 'comparativa', title: 'Anexo III vs Anexo V' },
    { id: 'profissoes', title: 'Exemplos por profissão' },
    { id: 'erros', title: 'Erros comuns' },
    { id: 'faq', title: 'Perguntas frequentes' },
  ],
  'simples-nacional-pj-qual-anexo': [
    { id: 'o-que-e-o-simples-nacional', title: 'O que é o Simples Nacional?' },
    { id: 'os-anexos-do-simples-nacional', title: 'Os Anexos do Simples Nacional' },
    { id: 'como-saber-qual-anexo-e-o-seu', title: 'Como saber qual Anexo é o seu?' },
    { id: 'exemplo-de-calculo-real-por-profissao', title: 'Exemplos por profissão' },
    { id: 'como-o-imposto-e-calculado-na-pratica', title: 'Como o imposto é calculado' },
    { id: 'simples-nacional-vs-lucro-presumido', title: 'Simples Nacional vs Lucro Presumido' },
    { id: 'resumo-o-que-voce-precisa-saber', title: 'Resumo final' },
  ],
};

/* Gera sumário dinamicamente a partir dos h2 do HTML para posts genéricos */
function extractToc(html) {
  if (!html) return [];
  const matches = [...html.matchAll(/<h2[^>]*id="([^"]*)"[^>]*>(.*?)<\/h2>/gi)];
  return matches.map(m => ({
    id: m[1],
    title: m[2].replace(/<[^>]+>/g, ''),
  }));
}

/* ─────────────────────────────────────────
   COMPONENTE: Conteúdo do post simples-nacional-pj-qual-anexo
   Markdown limpo convertido para React — sem JSX inline no .md
───────────────────────────────────────── */
function AnexoTable({ rows, headers }) {
  return (
    <div className="compare-wrap" style={{ marginBottom: 20 }}>
      <table className="compare-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`compare-th ${i === 1 ? 'compare-th--green' : ''}`}>
                {h}
                {i === 1 && <span className="compare-badge">Recomendado</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={`compare-td ${ci === 0 ? 'compare-td--label' : ci === 1 ? 'compare-td--green' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InfoCallout({ type = 'info', children }) {
  const styles = {
    info: { bg: 'var(--blue-light)', border: 'var(--blue-border)', color: 'var(--blue-text)', left: 'var(--blue)' },
    warning: { bg: 'var(--orange-light)', border: 'var(--orange-border)', color: 'var(--orange)', left: 'var(--orange-mid)' },
    success: { bg: 'var(--green-light)', border: 'var(--green-border)', color: 'var(--green)', left: 'var(--green)' },
  };
  const s = styles[type] || styles.info;
  return (
    <div style={{
      background: s.bg, border: `0.5px solid ${s.border}`,
      borderLeft: `3px solid ${s.left}`, borderRadius: '0 10px 10px 0',
      padding: '12px 16px', margin: '16px 0', color: s.color,
      fontSize: 13.5, lineHeight: 1.6, fontFamily: 'var(--sans)',
    }}>
      {children}
    </div>
  );
}

function ProfissaoExemplo({ icon, title, tag, faturamento, aliquota, extra, imposto, isGreen }) {
  return (
    <div style={{
      background: 'var(--white)', border: '0.5px solid var(--rule)',
      borderRadius: 10, padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', flex: 1 }}>{title}</span>
        <span style={{
          fontSize: 10.5, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
          background: isGreen ? 'var(--blue-light)' : 'var(--orange-light)',
          color: isGreen ? 'var(--blue-text)' : 'var(--orange)',
        }}>{tag}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Faturamento', val: faturamento },
          { label: 'Alíquota', val: aliquota },
          { label: extra.label, val: extra.val },
        ].map(s => (
          <div key={s.label} style={{ flex: 1 }}>
            <span style={{ fontSize: 9.5, color: 'var(--ink4)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</span>
            <span style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 400 }}>{s.val}</span>
          </div>
        ))}
      </div>
      <div style={{
        paddingTop: 10, borderTop: isGreen ? '0.5px solid var(--blue-border)' : '0.5px solid var(--orange-border)',
        fontSize: 12, color: isGreen ? 'var(--blue)' : 'var(--orange)',
        fontFamily: 'var(--sans)',
      }}>
        Imposto mensal: <strong>{imposto}</strong>
      </div>
    </div>
  );
}

function SimplesNacionalAnexoContent() {
  return (
    <>
      {/* Intro */}
      <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--ink2)', marginBottom: '1.2rem' }}>
        Uma das maiores vantagens de trabalhar como PJ no Brasil é a carga tributária reduzida pelo <strong>Simples Nacional</strong>. Mas o quanto você vai pagar depende do <strong>Anexo</strong> em que sua atividade se encaixa — e muita gente paga imposto errado por não saber disso.
      </p>

      {/* Seção 1 */}
      <div id="o-que-e-o-simples-nacional" className="section-divider" />
      <h2 className="section-h2">O que é o Simples Nacional?</h2>
      <p className="section-lead">Regime simplificado que unifica todos os impostos numa única guia mensal — o DAS.</p>
      <p style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--ink2)', marginBottom: '1rem' }}>
        Em vez de recolher vários impostos separados (IRPJ, CSLL, PIS, COFINS, ISS, etc.), você paga tudo numa única guia mensal. Podem usar o regime empresas com faturamento anual até <strong>R$ 4,8 milhões</strong> e a maioria das atividades de prestação de serviço.
      </p>

      {/* Seção 2 */}
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

      {/* Seção 3 */}
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
        <div style={{ padding: '14px 20px', background: 'var(--blue-light)', borderTop: '0.5px solid var(--blue-border)' }}>
          <p style={{ fontSize: 13, color: 'var(--blue-text)', lineHeight: 1.6, margin: 0 }}>
            <strong>Exemplo prático:</strong> faturamento R$ 15.000 · pró-labore R$ 4.500 (30%) → Fator R = 30% → <strong>Anexo III (6%)</strong>
          </p>
        </div>
      </div>

      {/* Seção 4 */}
      <div id="exemplo-de-calculo-real-por-profissao" className="section-divider" />
      <h2 className="section-h2">Exemplos práticos por profissão</h2>
      <p className="section-lead">Números reais para você comparar com a sua situação.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 8 }}>
        <ProfissaoExemplo icon="💻" title="Desenvolvedor de Software" tag="Anexo III" faturamento="R$ 12.000" aliquota="6%" extra={{ label: 'Regime', val: 'Simples III' }} imposto="R$ 720" isGreen />
        <ProfissaoExemplo icon="⚖️" title="Advogado" tag="Anexo IV" faturamento="R$ 15.000" aliquota="4,5% + INSS" extra={{ label: 'Pró-labore', val: 'R$ 3.000' }} imposto="~R$ 1.275" isGreen={false} />
        <ProfissaoExemplo icon="📣" title="Consultor de Marketing" tag="Anexo V → III" faturamento="R$ 20.000" aliquota="6% c/ Fator R" extra={{ label: 'Economia', val: 'R$ 1.900/mês' }} imposto="R$ 1.200 vs R$ 3.100" isGreen />
        <ProfissaoExemplo icon="🏥" title="Médico" tag="Anexo IV" faturamento="R$ 25.000" aliquota="4,5% + INSS" extra={{ label: 'Pró-labore', val: 'R$ 5.000' }} imposto="~R$ 2.125" isGreen={false} />
      </div>

      {/* Seção 5 */}
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

      {/* Seção 6 */}
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

      {/* Seção 7 */}
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

/* ─────────────────────────────────────────
   PÁGINA PRINCIPAL
───────────────────────────────────────── */
export default function Post({ post, relatedPosts }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  const isCustom = post.slug in CUSTOM_SLUGS;
  const tableOfContents = isCustom
    ? CUSTOM_SLUGS[post.slug]
    : extractToc(post.contentHtml);

  useEffect(() => {
    const onScroll = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      setReadingProgress(Math.min((window.scrollY / docH) * 100, 100));

      const current = tableOfContents.find(s => {
        const el = document.getElementById(s.id);
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top <= 120 && r.bottom >= 120;
      });
      if (current) setActiveSection(current.id);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Head>
        <title>{post.title} | CLT vs PJ</title>
        <meta name="description" content={post.description} />
      </Head>
      <Header />

      <main>
        {/* POST HEADER */}
        <div className="max-w-[1120px] mx-auto px-6 pt-16 pb-12 border-b border-rule">
          <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-8 flex items-center gap-2">
            <a href="/blog" className="hover:text-money transition-colors">Blog</a>
            <span className="text-ink-fade">·</span>
            <span>{post.readingTime || '5 min'} de leitura</span>
          </div>

          <h1 className="font-display text-[clamp(36px,5.5vw,64px)] leading-[1.05] tracking-[-0.02em] text-ink max-w-[22ch] text-balance mb-5">
            {post.title}
          </h1>

          <p className="text-lg text-ink-muted leading-relaxed mb-8 max-w-2xl">
            {post.description}
          </p>

          <div className="flex items-center gap-4 pt-6 mt-8 border-t border-rule font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
            <span>Atualizado {post.date}</span>
            <span>—</span>
            <span>Calculadora CLT vs PJ</span>
          </div>
        </div>

        {/* BODY */}
        <div className="pb-20 md:pb-28">
          <div className="max-w-[1120px] mx-auto px-6">
            <div className="post-content">
              {post.slug === 'simples-nacional-pj-qual-anexo-escolher' ? (
                <SimplesAnexoEscolherContent />
              ) : post.slug === 'simples-nacional-pj-qual-anexo' ? (
                <SimplesAnexoContent />
              ) : (
                <PostContent content={post.contentHtml} />
              )}
            </div>

            {/* CTA afiliado */}
            <AffiliateCTA
              partner="contabilizei"
              title="Decidiu virar PJ? Precisa de contador."
              description="A Contabilizei abre seu CNPJ, cuida do DAS mensal, pró-labore e obrigações fiscais. Plano a partir de R$ 89/mês."
              buttonText="Conhecer Contabilizei"
            />
          </div>
        </div>

        {/* POSTS RELACIONADOS */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="border-t border-rule py-16 bg-paper-dark">
            <div className="max-w-3xl mx-auto px-6 md:px-8">
              <div className="section-head mb-10">
                <span className="section-num">→</span>
                <h3 className="font-display text-2xl tracking-editorial text-ink">Continue lendo</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {relatedPosts.slice(0, 2).map((p, i) => (
                  <a key={p.slug} href={`/blog/${p.slug}`} className="group block">
                    <div
                      className="w-full h-32 rounded mb-4 overflow-hidden relative"
                      style={{
                        background: i === 0
                          ? 'linear-gradient(135deg, #0c4a3e 0%, #1a1614 100%)'
                          : 'linear-gradient(135deg, #c2410c 0%, #1a1614 100%)',
                      }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center font-display italic text-7xl text-paper/20">
                        {['§', '%'][i]}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-ink-muted tracking-wide mb-2 uppercase">
                      {p.date}
                    </div>
                    <h4 className="font-display text-xl tracking-editorial text-ink group-hover:text-money transition-colors leading-snug mb-2">
                      {p.title}
                    </h4>
                    <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

/* ─── getStaticPaths / getStaticProps (inalterados) ─── */
export async function getStaticPaths() {
  const posts = await getAllPosts();
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

// Forçando refresh - 23/03/2026
export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  const allPosts = await getAllPosts();

  // Filter related posts by shared tags, fallback to recent posts
  let relatedPosts = [];
  if (post?.tags?.length) {
    const withSharedTags = allPosts.filter(p =>
      p.slug !== params.slug &&
      p.tags?.some(tag => post.tags.includes(tag))
    );
    relatedPosts = withSharedTags.slice(0, 3);
  }

  // Fallback to recent posts if no shared tags found
  if (relatedPosts.length === 0) {
    relatedPosts = allPosts.filter(p => p.slug !== params.slug).slice(0, 3);
  }

  if (!post) return { notFound: true };
  return { props: { post, relatedPosts } };
}