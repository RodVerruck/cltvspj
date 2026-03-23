import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAllPosts, getPostBySlug } from '../../../lib/posts';
import { ArrowLeft, Calculator, List, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────
   COMPONENTE: TL;DR Hero Card
───────────────────────────────────────── */
function TLDRCard({ post }) {
  return (
    <div className="tldr-card">
      <div className="tldr-stripe" />
      <div className="tldr-inner">

        <div className="tldr-head">
          <div className="tldr-badge">
            <span className="tldr-dot" />
            Resumo rápido
          </div>
          <span className="tldr-time">Leitura: {post.readingTime || '5 min'}</span>
        </div>

        <p className="tldr-title">
          {post.excerpt || 'Entenda os principais pontos sobre este tema.'}
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
            Calcular meu cenário
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
   PÁGINA PRINCIPAL
───────────────────────────────────────── */
export default function Post({ post, relatedPosts }) {
  const [readingProgress, setReadingProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  const tableOfContents = [
    { id: 'resumo', title: 'Resumo rápido (TL;DR)' },
    { id: 'passo-a-passo', title: 'Passo a passo — 3 perguntas' },
    { id: 'fator-r', title: 'O que é o Fator R' },
    { id: 'comparativa', title: 'Anexo III vs Anexo V' },
    { id: 'profissoes', title: 'Exemplos por profissão' },
    { id: 'erros', title: 'Erros comuns' },
    { id: 'faq', title: 'Perguntas frequentes' },
  ];

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
        <title>{post.title} | Blog CLT ou PJ</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.tags?.join(', ')} />
        <link rel="canonical" href={`https://calculadora-cltvspj.vercel.app/blog/${post.slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
        <style>{STYLES}</style>
      </Head>

      <div className="page-root">
        {/* Barra de progresso */}
        <div className="progress-rail">
          <div className="progress-fill" style={{ width: `${readingProgress}%` }} />
        </div>

        {/* Header */}
        <header className="site-header">
          <Link href="/blog" className="header-back">
            <ArrowLeft size={16} />
            Voltar ao Blog
          </Link>
          <Link href="/" className="header-cta">
            <Calculator size={14} />
            Calculadora
          </Link>
        </header>

        <div className="post-layout">

          {/* ── Sumário lateral (desktop) ── */}
          <aside className="toc-sidebar">
            <div className="toc-wrap">
              <div className="toc-label">
                <List size={14} />
                Neste artigo
              </div>
              <nav>
                {tableOfContents.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`toc-item ${activeSection === s.id ? 'toc-item--active' : ''}`}
                  >
                    <span className="toc-num">{i + 1}</span>
                    <span className="toc-text">{s.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* ── Conteúdo principal ── */}
          <main className="post-main">

            {/* Breadcrumb */}
            <div className="breadcrumb">
              <Link href="/blog">Blog</Link>
              <span className="breadcrumb-sep">›</span>
              <span>{post.tags?.[0] || 'Artigo'}</span>
            </div>

            {/* Tags */}
            <div className="tag-row">
              {post.tags?.map(t => (
                <span key={t} className={`tag ${t === 'simples nacional' ? 'tag--main' : ''}`}>{t}</span>
              ))}
              <span className="tag-time">⏱ {post.readingTime}</span>
            </div>

            {/* Título */}
            <h1 className="post-title">
              {post.title}
            </h1>

            <div className="post-meta-row">
              <span>Equipe CLT ou PJ</span>
              <span className="meta-dot" />
              <span>5 min de leitura</span>
              <span className="meta-dot" />
              <span>Atualizado jan 2025</span>
            </div>

            {/* Sumário inline mobile */}
            <div className="toc-inline">
              <div className="toc-label"><List size={14} />Neste artigo</div>
              <nav className="toc-inline-grid">
                {tableOfContents.map((s, i) => (
                  <button key={s.id} onClick={() => scrollTo(s.id)} className="toc-inline-item">
                    <span>{i + 1}.</span> {s.title}
                  </button>
                ))}
              </nav>
            </div>

            {/* ── 1. TL;DR ── */}
            <section id="resumo" className="content-section">
              <TLDRCard post={post} />
            </section>

            <div className="section-divider" />

            {/* ── 2. Conteúdo Principal ── */}
            <section id="conteudo-principal" className="content-section">
              <h2 className="section-h2">{post.title}</h2>
              <article
                className="mdx-content"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            </section>

            <div className="section-divider" />

            {/* ── 3. Fator R ── */}
            <section id="fator-r" className="content-section">
              <h2 className="section-h2">Como calcular seu cenário PJ vs CLT</h2>
              <p className="section-lead">Use nossa calculadora interativa para comparar os custos e benefícios.</p>
              <FatorRCard />
            </section>

            <div className="section-divider" />

            {/* ── 4. Comparativa ── */}
            <section id="comparativa" className="content-section">
              <h2 className="section-h2">CLT vs PJ: Qual a melhor opção?</h2>
              <p className="section-lead">Compare os principais benefícios e custos de cada regime.</p>
              <ComparativaTable />
            </section>

            <div className="section-divider" />

            {/* ── 5. FAQ ── */}
            <section id="faq" className="content-section">
              <h2 className="section-h2">Perguntas frequentes</h2>
              <FAQ />
            </section>

            <div className="section-divider" />

            {/* ── CTA final ── */}
            <div className="bottom-cta">
              <div>
                <div className="bottom-cta-eyebrow">Calculadora gratuita</div>
                <div className="bottom-cta-title">Descubra seu anexo<br />e sua economia anual</div>
              </div>
              <Link href="/" className="btn-white">
                Calcular agora
                <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </Link>
            </div>

            {/* ── Afiliado ── */}
            <div className="affiliate-block">
              <div className="affiliate-inner">
                <div>
                  <div className="affiliate-title">Precisa abrir seu CNPJ?</div>
                  <div className="affiliate-desc">A Contasign cuida de toda a burocracia para você focar no que importa.</div>
                </div>
                <a href="https://contasign.com.br" target="_blank" rel="noopener noreferrer" className="btn-affiliate">
                  Abrir CNPJ →
                </a>
              </div>
              <div className="affiliate-disclaimer">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="8" cy="8" r="6" /><path d="M8 7v4M8 5.5v.5" /></svg>
                Parceria afiliada: ganhamos comissão, você não paga nada extra
              </div>
            </div>

            {/* ── Posts relacionados ── */}
            {relatedPosts?.length > 0 && (
              <section className="related-section">
                <h2 className="related-title">Continue lendo</h2>
                <div className="related-grid">
                  {relatedPosts.map(r => (
                    <a key={r.slug} href={`/blog/${r.slug}`} className="related-card">
                      <div className="related-tags">
                        {r.tags?.slice(0, 1).map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                      <h3 className="related-card-title">{r.title}</h3>
                      <span className="related-read">Ler artigo →</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            <p className="footnote">Este artigo tem fins informativos. Para decisões fiscais definitivas, consulte um contador.</p>

          </main>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────
   STYLES — injetado via <style> no Head
───────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --ink:   #1a1a18;
    --ink2:  #4a4a47;
    --ink3:  #8a8a86;
    --paper: #faf9f6;
    --white: #ffffff;
    --rule:  #e8e6e0;
    --green:       #1c5c3e;
    --green-light: #e8f4ed;
    --green-mid:   #4a9e6b;
    --green-border:#c3dece;
    --orange:       #92420e;
    --orange-light: #fef3ea;
    --orange-mid:   #e07a2f;
    --orange-border:#f0c8a0;
    --serif: 'Instrument Serif', Georgia, serif;
    --sans:  'DM Sans', system-ui, sans-serif;
    --radius: 12px;
    --radius-lg: 16px;
  }

  body { font-family: var(--sans); background: var(--paper); color: var(--ink); }

  /* ── Progress ── */
  .progress-rail { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 3px; background: var(--rule); }
  .progress-fill { height: 100%; background: var(--green); border-radius: 0 2px 2px 0; transition: width 0.2s; }

  /* ── Header ── */
  .site-header {
    position: sticky; top: 3px; z-index: 90;
    background: rgba(250,249,246,0.92); backdrop-filter: blur(10px);
    border-bottom: 0.5px solid var(--rule);
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 24px;
  }
  .header-back {
    display: flex; align-items: center; gap: 7px;
    font-size: 13px; color: var(--ink2); text-decoration: none;
    transition: color 0.15s;
  }
  .header-back:hover { color: var(--ink); }
  .header-cta {
    display: flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500;
    background: var(--green); color: white;
    padding: 8px 14px; border-radius: 8px; text-decoration: none;
    transition: background 0.15s;
  }
  .header-cta:hover { background: #174d34; }

  /* ── Layout ── */
  .page-root { min-height: 100vh; background: var(--paper); }
  .post-layout {
    max-width: 1080px; margin: 0 auto; padding: 0 24px 80px;
    display: grid; grid-template-columns: 220px 1fr; gap: 40px;
    align-items: start;
  }

  /* ── TOC sidebar ── */
  .toc-sidebar { display: block; }
  .toc-wrap {
    position: sticky; top: 70px;
    background: var(--white); border: 0.5px solid var(--rule);
    border-radius: var(--radius-lg); padding: 18px 16px;
    margin-top: 40px;
  }
  .toc-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 10px; font-weight: 500; letter-spacing: 0.07em;
    text-transform: uppercase; color: var(--ink3); margin-bottom: 12px;
  }
  .toc-item {
    display: flex; align-items: flex-start; gap: 8px;
    width: 100%; text-align: left; background: none; border: none;
    padding: 7px 10px; border-radius: 7px; cursor: pointer;
    border-left: 2px solid transparent; transition: all 0.15s;
  }
  .toc-item:hover { background: var(--paper); }
  .toc-item--active { background: var(--green-light); border-left-color: var(--green); }
  .toc-item--active .toc-text { color: var(--green); }
  .toc-num { font-size: 11px; color: var(--ink3); min-width: 16px; margin-top: 1px; }
  .toc-text { font-size: 12px; color: var(--ink2); line-height: 1.4; }

  /* ── TOC inline (mobile) ── */
  .toc-inline {
    display: none;
    background: var(--white); border: 0.5px solid var(--rule);
    border-radius: var(--radius-lg); padding: 16px 18px; margin-bottom: 28px;
  }
  .toc-inline-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 10px; }
  .toc-inline-item {
    font-size: 12px; color: var(--ink2); background: none; border: none;
    text-align: left; cursor: pointer; padding: 4px 0; line-height: 1.4;
  }
  .toc-inline-item:hover { color: var(--green); }

  /* ── Post main ── */
  .post-main { padding-top: 36px; min-width: 0; }

  .breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--ink3); margin-bottom: 16px; }
  .breadcrumb a { color: var(--green); text-decoration: none; }
  .breadcrumb-sep { opacity: 0.4; }

  .tag-row { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
  .tag {
    font-size: 10px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
    padding: 3px 9px; border-radius: 20px; border: 0.5px solid var(--rule); color: var(--ink2); background: var(--white);
  }
  .tag--main { background: var(--green); color: white; border-color: var(--green); }
  .tag-time { font-size: 11px; color: var(--ink3); display: flex; align-items: center; gap: 4px; }

  .post-title {
    font-family: var(--serif); font-size: clamp(28px, 4vw, 38px); font-weight: 400;
    line-height: 1.15; letter-spacing: -0.01em; color: var(--ink); margin-bottom: 14px;
  }
  .post-title em { font-style: italic; color: var(--green); }

  .post-meta-row {
    display: flex; align-items: center; gap: 12px;
    font-size: 12px; color: var(--ink3); margin-bottom: 28px;
    padding-bottom: 24px; border-bottom: 0.5px solid var(--rule);
  }
  .meta-dot { width: 3px; height: 3px; background: var(--rule); border-radius: 50%; }

  /* ── Sections ── */
  .content-section { margin-bottom: 0; }
  .section-divider { height: 0.5px; background: var(--rule); margin: 36px 0; }
  .section-h2 {
    font-family: var(--serif); font-size: 24px; font-weight: 400;
    color: var(--ink); margin-bottom: 6px; letter-spacing: -0.01em;
  }
  .section-lead { font-size: 14px; color: var(--ink3); margin-bottom: 20px; line-height: 1.6; }

  /* ── TL;DR Card ── */
  .tldr-card { background: var(--white); border: 0.5px solid var(--rule); border-radius: var(--radius-lg); overflow: hidden; }
  .tldr-stripe { height: 3px; background: linear-gradient(90deg, var(--green), var(--green-mid)); }
  .tldr-inner { padding: 22px 24px 24px; }
  .tldr-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .tldr-badge { display: flex; align-items: center; gap: 7px; font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--green); }
  .tldr-dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; }
  .tldr-time { font-size: 11px; color: var(--ink3); }
  .tldr-title { font-family: var(--serif); font-size: 18px; font-weight: 400; color: var(--ink); margin-bottom: 18px; line-height: 1.35; }

  .anexo-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin-bottom: 18px; }
  .anexo-pill { background: var(--paper); border: 0.5px solid var(--rule); border-radius: 8px; padding: 10px 8px; text-align: center; }
  .anexo-pill--green { background: var(--green-light); border-color: var(--green-border); }
  .anexo-pill--orange { background: var(--orange-light); border-color: var(--orange-border); }
  .anexo-num { display: block; font-family: var(--serif); font-size: 20px; font-style: italic; margin-bottom: 4px; color: var(--ink2); }
  .anexo-pill--green .anexo-num { color: var(--green); }
  .anexo-pill--orange .anexo-num { color: var(--orange); }
  .anexo-desc { font-size: 10px; color: var(--ink3); line-height: 1.35; }
  .anexo-pill--green .anexo-desc { color: #2a7a50; }
  .anexo-pill--orange .anexo-desc { color: var(--orange); }

  .regra-ouro { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: var(--green-light); border: 0.5px solid var(--green-border); border-radius: 8px; margin-bottom: 20px; }
  .regra-icon { width: 20px; height: 20px; background: var(--green); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .regra-text { font-size: 13px; color: var(--green); line-height: 1.55; }

  .tldr-cta-row { display: flex; align-items: center; gap: 12px; }
  .btn-primary { display: inline-flex; align-items: center; gap: 7px; background: var(--green); color: white; font-family: var(--sans); font-size: 13px; font-weight: 500; padding: 10px 18px; border-radius: 8px; text-decoration: none; transition: background 0.15s; }
  .btn-primary:hover { background: #174d34; }
  .tldr-cta-note { font-size: 11px; color: var(--ink3); }

  /* ── Steps ── */
  .steps-list { display: flex; flex-direction: column; gap: 0; }
  .step-item { display: flex; gap: 16px; padding: 20px 0; border-bottom: 0.5px solid var(--rule); }
  .step-item:last-child { border-bottom: none; }
  .step-num { width: 28px; height: 28px; border-radius: 50%; background: var(--green); color: white; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .step-content { flex: 1; }
  .step-title { font-size: 15px; font-weight: 500; color: var(--ink); margin-bottom: 12px; line-height: 1.4; }
  .step-body { font-size: 13px; color: var(--ink2); line-height: 1.6; }

  .step-cols { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  .step-col { background: var(--paper); border: 0.5px solid var(--rule); border-radius: 8px; padding: 12px 14px; }
  .step-col--highlight { background: var(--green-light); border-color: var(--green-border); }
  .step-col-label { font-size: 13px; font-weight: 500; color: var(--ink); margin-bottom: 2px; }
  .step-col--highlight .step-col-label { color: var(--green); }
  .step-col-sub { font-size: 10px; color: var(--ink3); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
  .step-col-list { list-style: none; padding: 0; }
  .step-col-list li { font-size: 12px; color: var(--ink2); padding: 2px 0; padding-left: 10px; position: relative; line-height: 1.4; }
  .step-col-list li::before { content: '–'; position: absolute; left: 0; color: var(--ink3); }

  .step-rule-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .step-rule { border-radius: 8px; padding: 14px 16px; border: 0.5px solid; }
  .step-rule--green { background: var(--green-light); border-color: var(--green-border); }
  .step-rule--orange { background: var(--orange-light); border-color: var(--orange-border); }
  .step-rule-val { font-family: var(--serif); font-size: 20px; font-weight: 400; margin-bottom: 3px; }
  .step-rule--green .step-rule-val { color: var(--green); }
  .step-rule--orange .step-rule-val { color: var(--orange); }
  .step-rule-name { font-size: 13px; font-weight: 500; color: var(--ink); margin-bottom: 2px; }
  .step-rule-note { font-size: 11px; color: var(--ink3); }

  /* ── Fator R card ── */
  .fatorr-wrap { border: 0.5px solid var(--rule); border-radius: var(--radius-lg); overflow: hidden; background: var(--white); }
  .fatorr-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 22px; background: var(--paper); border-bottom: 0.5px solid var(--rule); }
  .fatorr-label { font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink3); }
  .fatorr-badge { font-size: 10px; font-weight: 500; padding: 3px 9px; background: var(--orange-light); color: var(--orange); border-radius: 20px; border: 0.5px solid var(--orange-border); }

  .fatorr-formula-area { padding: 22px 22px 18px; border-bottom: 0.5px solid var(--rule); }
  .formula-display { text-align: center; padding: 20px 16px; background: var(--paper); border-radius: 10px; border: 0.5px solid var(--rule); margin-bottom: 14px; }
  .formula-eq { font-family: var(--serif); font-size: 20px; font-style: italic; color: var(--ink); display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; }
  .frac { display: inline-flex; flex-direction: column; align-items: center; gap: 0; }
  .frac-num { font-size: 14px; padding-bottom: 3px; border-bottom: 1.5px solid var(--ink2); line-height: 1; }
  .frac-den { font-size: 14px; padding-top: 4px; line-height: 1; }
  .formula-times { font-style: normal; opacity: 0.45; }

  .threshold-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .threshold-card { border-radius: 8px; padding: 12px 14px; border: 0.5px solid; }
  .threshold-card--green { background: var(--green-light); border-color: var(--green-border); }
  .threshold-card--orange { background: var(--orange-light); border-color: var(--orange-border); }
  .threshold-val { font-family: var(--serif); font-size: 22px; font-weight: 400; margin-bottom: 2px; }
  .threshold-card--green .threshold-val { color: var(--green); }
  .threshold-card--orange .threshold-val { color: var(--orange); }
  .threshold-name { font-size: 13px; font-weight: 500; color: var(--ink); margin-bottom: 2px; }
  .threshold-who { font-size: 11px; color: var(--ink3); }

  .fatorr-calc { padding: 20px 22px 22px; }
  .calc-label { font-size: 11px; font-weight: 500; letter-spacing: 0.07em; text-transform: uppercase; color: var(--ink3); margin-bottom: 12px; }
  .calc-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .input-group label { display: block; font-size: 11px; color: var(--ink3); margin-bottom: 5px; }
  .input-group input { width: 100%; height: 38px; border: 0.5px solid var(--rule); border-radius: 7px; padding: 0 12px; font-family: var(--sans); font-size: 14px; color: var(--ink); background: var(--paper); outline: none; transition: border-color 0.15s; }
  .input-group input:focus { border-color: var(--green-mid); background: var(--white); }

  .calc-result { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border-radius: 9px; border: 0.5px solid var(--rule); background: var(--paper); transition: all 0.25s; }
  .calc-result--green { background: var(--green-light); border-color: var(--green-border); }
  .calc-result--orange { background: var(--orange-light); border-color: var(--orange-border); }
  .result-label { font-size: 11px; color: var(--ink3); margin-bottom: 3px; }
  .result-val { font-family: var(--serif); font-size: 28px; font-weight: 400; color: var(--ink); transition: color 0.25s; }
  .result-val--green { color: var(--green); }
  .result-val--orange { color: var(--orange); }
  .result-anexo { font-size: 13px; font-weight: 500; padding: 5px 13px; border-radius: 20px; display: inline-block; transition: all 0.25s; }
  .result-anexo--neutral { background: var(--rule); color: var(--ink3); }
  .result-anexo--green { background: var(--green); color: white; }
  .result-anexo--orange { background: var(--orange-mid); color: white; }
  .result-note { font-size: 11px; color: var(--ink3); margin-top: 5px; }

  /* ── Compare table ── */
  .compare-wrap { border: 0.5px solid var(--rule); border-radius: var(--radius-lg); overflow: hidden; background: var(--white); }
  .compare-table { width: 100%; border-collapse: collapse; }
  .compare-th { padding: 12px 16px; font-size: 12px; font-weight: 500; color: var(--ink3); text-align: left; background: var(--paper); border-bottom: 0.5px solid var(--rule); }
  .compare-th--green { color: var(--green); background: var(--green-light); position: relative; }
  .compare-badge { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); font-size: 9px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; background: var(--green); color: white; padding: 2px 7px; border-radius: 20px; }
  .compare-td { padding: 11px 16px; font-size: 13px; color: var(--ink2); border-top: 0.5px solid var(--rule); vertical-align: middle; }
  .compare-td--label { font-size: 11px; font-weight: 500; color: var(--ink3); text-transform: uppercase; letter-spacing: 0.05em; background: var(--paper); }
  .compare-td--green { background: #f0f9f4; color: var(--green); font-weight: 500; }

  .exemplo-real { margin-top: 16px; border: 0.5px solid var(--rule); border-radius: var(--radius); overflow: hidden; }
  .exemplo-real-label { font-size: 11px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink3); padding: 10px 16px; background: var(--paper); border-bottom: 0.5px solid var(--rule); }
  .exemplo-real-cols { display: flex; align-items: center; gap: 0; }
  .exemplo-col { flex: 1; padding: 16px; }
  .exemplo-col--green { background: var(--green-light); }
  .exemplo-col--orange { background: var(--orange-light); }
  .exemplo-vs { font-size: 11px; color: var(--ink3); padding: 0 12px; flex-shrink: 0; }
  .exemplo-col-head { font-size: 11px; color: var(--ink3); margin-bottom: 4px; }
  .exemplo-col-val { font-family: var(--serif); font-size: 20px; color: var(--ink); margin-bottom: 2px; }
  .exemplo-col--green .exemplo-col-val { color: var(--green); }
  .exemplo-col--orange .exemplo-col-val { color: var(--orange); }
  .exemplo-col-note { font-size: 11px; color: var(--ink3); }

  /* ── Profissões ── */
  .profissoes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .profissao-card { background: var(--white); border: 0.5px solid var(--rule); border-radius: var(--radius); padding: 16px; }
  .profissao-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .profissao-icon { font-size: 16px; }
  .profissao-title { font-size: 13px; font-weight: 500; color: var(--ink); flex: 1; }
  .profissao-anexo-tag { font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 20px; }
  .profissao-anexo-tag--green { background: var(--green-light); color: var(--green); }
  .profissao-anexo-tag--orange { background: var(--orange-light); color: var(--orange); }
  .profissao-row { display: flex; gap: 8px; margin-bottom: 10px; }
  .profissao-stat { flex: 1; }
  .profissao-stat-label { font-size: 10px; color: var(--ink3); display: block; margin-bottom: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
  .profissao-stat-val { font-size: 13px; color: var(--ink); font-weight: 400; }
  .profissao-stat-val--green { color: var(--green); font-weight: 500; }
  .profissao-stat-val--orange { color: var(--orange); font-weight: 500; }
  .profissao-economia { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--green); padding-top: 10px; border-top: 0.5px solid var(--green-light); }

  /* ── Erros ── */
  .erros-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .erro-card { background: var(--white); border: 0.5px solid var(--rule); border-radius: var(--radius); overflow: hidden; }
  .erro-head { display: flex; align-items: center; gap: 8px; padding: 12px 14px; background: #fff5f5; border-bottom: 0.5px solid #fecaca; }
  .erro-x { width: 18px; height: 18px; background: #e24b4a; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; color: white; flex-shrink: 0; }
  .erro-title { font-size: 12px; font-weight: 500; color: #7f1d1d; line-height: 1.35; }
  .erro-body { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
  .erro-row { display: flex; flex-direction: column; gap: 2px; }
  .erro-key { font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; color: var(--ink3); }
  .erro-val { font-size: 12px; color: var(--ink2); line-height: 1.4; }
  .erro-val--green { color: var(--green); }

  /* ── FAQ ── */
  .faq-list { display: flex; flex-direction: column; gap: 0; border: 0.5px solid var(--rule); border-radius: var(--radius-lg); overflow: hidden; background: var(--white); }
  .faq-item { border-bottom: 0.5px solid var(--rule); }
  .faq-item:last-child { border-bottom: none; }
  .faq-question { width: 100%; text-align: left; background: none; border: none; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; cursor: pointer; font-family: var(--sans); font-size: 14px; font-weight: 500; color: var(--ink); transition: background 0.15s; }
  .faq-question:hover { background: var(--paper); }
  .faq-item--open .faq-question { color: var(--green); background: var(--green-light); }
  .faq-chevron { font-size: 18px; color: var(--ink3); flex-shrink: 0; line-height: 1; }
  .faq-answer { padding: 0 20px 16px; font-size: 13px; color: var(--ink2); line-height: 1.65; background: var(--white); }

  /* ── Bottom CTA ── */
  .bottom-cta { margin-top: 8px; border-radius: var(--radius-lg); background: var(--green); padding: 28px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
  .bottom-cta-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.55); margin-bottom: 6px; }
  .bottom-cta-title { font-family: var(--serif); font-size: 22px; font-weight: 400; font-style: italic; color: white; line-height: 1.25; }
  .btn-white { flex-shrink: 0; display: inline-flex; align-items: center; gap: 7px; background: white; color: var(--green); font-family: var(--sans); font-size: 13px; font-weight: 500; padding: 11px 20px; border-radius: 8px; text-decoration: none; transition: opacity 0.15s; white-space: nowrap; }
  .btn-white:hover { opacity: 0.9; }

  /* ── Affiliate ── */
  .affiliate-block { margin-top: 20px; border: 0.5px solid var(--rule); border-radius: var(--radius-lg); overflow: hidden; background: var(--white); }
  .affiliate-inner { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 22px; }
  .affiliate-title { font-size: 15px; font-weight: 500; color: var(--ink); margin-bottom: 4px; }
  .affiliate-desc { font-size: 13px; color: var(--ink3); line-height: 1.4; }
  .btn-affiliate { flex-shrink: 0; display: inline-flex; align-items: center; background: var(--ink); color: white; font-family: var(--sans); font-size: 13px; font-weight: 500; padding: 10px 18px; border-radius: 8px; text-decoration: none; white-space: nowrap; transition: opacity 0.15s; }
  .btn-affiliate:hover { opacity: 0.85; }
  .affiliate-disclaimer { display: flex; align-items: center; gap: 6px; padding: 10px 22px; background: var(--paper); border-top: 0.5px solid var(--rule); font-size: 11px; color: var(--ink3); }

  /* ── Related ── */
  .related-section { margin-top: 36px; padding-top: 28px; border-top: 0.5px solid var(--rule); }
  .related-title { font-family: var(--serif); font-size: 20px; font-weight: 400; color: var(--ink); margin-bottom: 16px; }
  .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
  .related-card { background: var(--white); border: 0.5px solid var(--rule); border-radius: var(--radius); padding: 16px; text-decoration: none; display: flex; flex-direction: column; gap: 8px; transition: border-color 0.15s, transform 0.15s; }
  .related-card:hover { border-color: var(--green-border); transform: translateY(-2px); }
  .related-card-title { font-size: 13px; font-weight: 500; color: var(--ink); line-height: 1.4; }
  .related-read { font-size: 12px; color: var(--green); margin-top: auto; }

  .footnote { font-size: 11px; color: var(--ink3); margin-top: 28px; text-align: center; line-height: 1.5; }

  /* ── Responsive ── */
  @media (max-width: 860px) {
    .post-layout { grid-template-columns: 1fr; }
    .toc-sidebar { display: none; }
    .toc-inline { display: block; }
    .profissoes-grid, .erros-grid { grid-template-columns: 1fr; }
    .related-grid { grid-template-columns: 1fr; }
    .step-cols { grid-template-columns: 1fr; }
    .bottom-cta { flex-direction: column; text-align: center; }
    .affiliate-inner { flex-direction: column; text-align: center; }
    .anexo-grid { grid-template-columns: repeat(3, 1fr); }
    .calc-inputs { grid-template-columns: 1fr; }
    .compare-badge { display: none; }
  }
  @media (max-width: 480px) {
    .post-layout { padding: 0 16px 60px; }
    .toc-inline-grid { grid-template-columns: 1fr; }
    .threshold-row, .step-rule-row { grid-template-columns: 1fr; }
    .exemplo-real-cols { flex-direction: column; }
    .exemplo-vs { padding: 6px 0; text-align: center; }
  }
`;

/* ─── getStaticPaths / getStaticProps (inalterados) ─── */
export async function getStaticPaths() {
  const posts = await getAllPosts();
  return {
    paths: posts.map(post => ({ params: { slug: post.slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  const allPosts = await getAllPosts();
  const relatedPosts = allPosts.filter(p => p.slug !== params.slug).slice(0, 3);
  if (!post) return { notFound: true };
  return { props: { post, relatedPosts } };
}
