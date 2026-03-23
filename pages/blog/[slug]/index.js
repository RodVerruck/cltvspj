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
