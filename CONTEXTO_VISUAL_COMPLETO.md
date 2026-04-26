# 📋 Contexto Visual Completo - Blog CLT vs PJ

## 🎨 Overview do Design System

Este documento contém toda a estrutura visual, design system e implementação do blog CLT vs PJ para análise por IA.

---

## 🎯 Identidade Visual e Branding

### Paleta de Cores Principal
```css
/* Cores Base (Design System Editorial) */
--paper:        #f5f1e8;     /* Background principal */
--paper-dark:   #ebe5d6;     /* Background secundário */
--paper-darker: #ddd4c0;     /* Background terciário */
--ink:          #1a1614;     /* Texto principal */
--ink-muted:    #6b6357;     /* Texto secundário */
--ink-fade:     #a8a192;     /* Texto fraco */
--rule:         #d4cdbe;     /* Divisores */
--rule-strong:  #b8afa0;     /* Divisores fortes */
--surface:      #ffffff;     /* Cards e superfícies */
--money:        #0c4a3e;     /* Cor primária (verde) */
--money-light:  #e6efe9;     /* Verde claro */
--hot:          #c2410c;     /* Cor secundária (laranja) */
--hot-light:    #fce8dc;     /* Laranja claro */
```

### Tipografia
```css
/* Font Families */
--f-display:    'Instrument Serif', Georgia, serif;   /* Títulos */
--f-sans:       'Instrument Sans', system-ui, sans-serif;  /* Corpo */
--f-mono:       'JetBrains Mono', Consolas, monospace;     /* Código */
```

---

## 📱 Estrutura de Layout

### Header (Navegação)
- **Position**: Sticky top-0 com backdrop-blur-xl
- **Background**: paper/90 (90% opacity)
- **Border**: border-b border-rule
- **Padding**: py-4 px-6 (mobile), px-8 (desktop)
- **Layout**: Flex com Logo | Navegação | CTA
- **Logo**: "CLT vs PJ" com × (multiplicação) como ícone
- **Links**: Calculadora, Blog, Lei 15.270
- **CTA**: "Calcular ×" botão verde money

### Blog - Listagem (/blog)
```jsx
// Estrutura principal
<Container max-w-6xl>
  <Header brand-500 background>
    <Título Instrument Serif 2.4rem>
    <Badge>📚 Base de Conhecimento</Badge>
  </Header>
  
  <GridPosts>
    // Grid: repeat(auto-fill, minmax(290px, 1fr))
    // Gap: 1.1rem
    // Cards com topo gradiente brand-to-brand-mid
  </GridPosts>
</Container>
```

### Blog - Post Individual (/blog/[slug])
```jsx
// Layout Grid
<Grid template="220px | 1fr">
  <TOC_Sidebar sticky top-68px />
  <Main_Content>
    <Título clamp(26px, 3.5vw, 36px) />
    <Meta flex data + leitura />
    <Post_Content prose />
  </Main_Content>
</Grid>
```

---

## 🎨 Componentes Visuais

### 1. Cards de Posts (Blog Listing)
```jsx
<article className="post-card bg-surface border border-rule rounded-xl hover:translate-y-[-3px] transition-all">
  <div className="post-card-corner" /> {/* Canto superior esquerdo */}
  
  <div className="p-6">
    <Meta>
      <span className="eyebrow text-xs uppercase tracking-[0.12em]">
        5 min
      </span>
      <span className="text-sm text-ink-muted">
        15/03/2026
      </span>
    </Meta>
    
    <h2 className="font-display text-xl mb-3">
      <Link href="#" className="text-ink hover:text-money transition-colors">
        Título do Post
      </Link>
    </h2>
    
    <p className="text-ink-muted mb-4 line-clamp-3">
      Descrição do post...
    </p>
    
    <Link href="#" className="link-editorial text-sm">
      Ler mais →
    </Link>
  </div>
</article>
```

### 2. Componentes MDX Customizados

#### Callout (Alertas/Dicas)
```jsx
<div className="callout bg-money-light border-l-3 border-money p-5 rounded-r">
  <span className="callout-label font-mono text-xs uppercase">
    REGRA DE OURO
  </span>
  <p className="font-display italic text-money">
    Conteúdo do callout...
  </p>
</div>
```

#### Stat Band (Seção de Estatísticas)
```jsx
<div className="band-breakout bg-paper-dark border-t border-b border-rule-strong py-16">
  <div className="band-inner">
    <Grid template="1fr 1fr" gap-12>
      <Stat>
        <div className="stat-section-num font-mono text-xs">01</div>
        <div className="stat-number font-display">85%</div>
        <div className="stat-label font-mono text-xs">ECONOMIA</div>
        <p className="stat-desc font-display italic">
          Economia média com PJ
        </p>
      </Stat>
    </Grid>
  </div>
</div>
```

#### Quote Band (Citações em Destaque)
```jsx
<div className="band-breakout bg-ink text-paper py-20 text-center">
  <div className="band-inner">
    <span className="quote-mark font-display text-6xl opacity-25">"</span>
    <blockquote className="quote-text font-display italic max-w-22ch">
      "Citação em destaque..."
    </blockquote>
    <cite className="quote-attribution font-mono text-xs uppercase">
      — Autor
    </cite>
  </div>
</div>
```

#### CTA Band (Chamadas para Ação)
```jsx
<div className="band-breakout bg-money text-paper py-16 rounded">
  <div className="band-inner">
    <Grid template="1.3fr 1fr" gap-12 items-center>
      <div>
        <span className="cta-eyebrow font-mono text-xs uppercase">
          CALCULADORA
        </span>
        <h3 className="cta-title font-display">
          Compare CLT vs PJ
        </h3>
        <p className="cta-desc">
          Descubra qual regime compensa mais para você
        </p>
      </div>
      <div className="cta-action border-l border-paper/20 pl-10">
        <Link href="/" className="cta-button bg-paper text-money">
          Calcular Agora →
        </Link>
      </div>
    </Grid>
  </div>
</div>
```

---

## 📐 Sistema de Grid e Layout

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Containers
```css
/* Principais */
.max-w-6xl    /* 1120px - Desktop */
.max-w-4xl    /* 896px - Tablet */
.max-w-none   /* Full-width bands */

/* Blog Content */
.prose max-w-[680px] /* Conteúdo de posts */
```

### Grid Patterns
```css
/* Blog Listing */
.grid-posts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 1.1rem;
}

/* Post Layout */
.grid-post-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 3rem;
}

/* Stat Band */
.grid-stat {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

/* CTA Band */
.grid-cta {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 3rem;
}
```

---

## ✨ Animações e Micro-interações

### Padrões de Hover
```css
/* Cards */
.post-card:hover {
  transform: translateY(-3px);
  border-color: var(--money);
}

/* Links */
.link-editorial:hover {
  color: var(--ink);
}

/* Botões */
.cta-button:hover {
  transform: translateY(-2px);
}

/* Eyebrow dots */
.eyebrow-dot {
  animation: pulse 2s ease-in-out infinite;
}
```

### Transições
```css
/* Cores */
transition-colors 0.18s;

/* Transform */
transition-transform 0.15s;

/* All (botões) */
transition-all 0.18s;
```

---

## 🎯 Tokens CSS e Classes Utilitárias

### Classes Customizadas (globals.css)
```css
/* Editorial Components */
.eyebrow              /* Labels pequenos */
.section-head         /* Headers numerados */
.field-label          /* Labels de formulários */
.input-row           /* Inputs com underline */
.btn-money           /* Botão primário verde */
.link-editorial     /* Links sublinhados */
.bg-grid-pattern     /* Background grade */

/* Drop Cap */
.post-content > p:first-of-type::first-letter
```

### Classes Tailwind Customizadas
```css
/* Colors */
.paper, .paper-dark, .paper-darker
.ink, .ink-muted, .ink-fade
.rule, .rule-strong
.money, .money-light, .money-hover
.hot, .hot-light
.surface

/* Fonts */
.font-display (Instrument Serif)
.font-sans (Instrument Sans)
.font-mono (JetBrains Mono)

/* Letter Spacing */
.tracking-editorial (-0.02em)
.tracking-mono-wide (0.02em)
.tracking-label (0.12em)

/* Font Sizes */
.display-xl, .display-lg, .display-md, .display-sm
```

---

## 📱 Responsividade

### Mobile First Approach
```css
/* Base Mobile */
.grid { grid-template-columns: 1fr; }
.hidden-mobile { display: none; }

/* Tablet (768px+) */
@media (min-width: 768px) {
  .grid { grid-template-columns: 1fr 1fr; }
  .hidden-mobile { display: block; }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
  .max-w-6xl { margin: 0 auto; }
}
```

### Adaptações Específicas
- **Blog Posts**: Grid 1 coluna mobile → 2 colunas tablet → 3 colunas desktop
- **TOC Sidebar**: Hidden mobile → Visible tablet+
- **Navigation**: Hidden mobile → Flex desktop
- **Font Sizes**: clamp() para escalonamento fluido

---

## 🎨 Exemplos de Implementação

### Página de Blog Completa
```jsx
<BlogPage>
  <Header sticky />
  
  <main className="max-w-6xl mx-auto px-6 py-12">
    <BlogHeader>
      <div className="bg-money text-surface rounded-2xl p-12">
        <span className="eyebrow">
          <span className="eyebrow-dot" />
          BLOG
        </span>
        <h1 className="font-display text-5xl">
          Base de Conhecimento
        </h1>
        <p className="text-xl opacity-90">
          Guia completo sobre CLT vs PJ
        </p>
      </div>
    </BlogHeader>
    
    <PostsGrid>
      {posts.map(post => (
        <PostCard key={post.slug} post={post} />
      ))}
    </PostsGrid>
  </main>
  
  <Footer />
</BlogPage>
```

### Post Individual Completo
```jsx
<PostPage>
  <Header sticky />
  
  <main className="max-w-6xl mx-auto px-6 py-12">
    <div className="grid grid-cols-[220px_1fr] gap-12">
      <TOC_Sidebar>
        <nav className="sticky top-20">
          <h3 className="font-display text-lg mb-4">Índice</h3>
          <TOC_Links />
        </nav>
      </TOC_Sidebar>
      
      <article className="prose">
        <PostHeader>
          <h1 className="font-display text-4xl">
            {post.title}
          </h1>
          <PostMeta date={post.date} readTime={post.readTime} />
        </PostHeader>
        
        <PostContent content={post.content} />
      </article>
    </div>
  </main>
  
  <Footer />
</PostPage>
```

---

## 🔧 Configuração Técnica

### Tailwind Config
```js
module.exports = {
  theme: {
    extend: {
      colors: { /* paleta completa */ },
      fontFamily: { /* fontes custom */ },
      fontSize: { /* display sizes */ },
      letterSpacing: { /* tracking custom */ },
      typography: { /* prose plugin config */ }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
```

### CSS Variables
```css
:root {
  /* Todas as cores definidas como CSS vars */
  --paper: #f5f1e8;
  --ink: #1a1614;
  --money: #0c4a3e;
  /* ... */
}
```

---

## 📊 Estrutura de Arquivos Visual

```
styles/
├── globals.css     # Base styles + components
├── blog.css        # Blog-specific components + bands
└── (Tailwind output)

components/
├── Header.js       # Navegação sticky
├── Footer.js       # Footer global
├── posts/
│   ├── PostContent.js    # MDX renderer
│   ├── PostCard.js       # Blog listing cards
│   └── MDXPost.js        # Individual post
└── mdx/
    ├── Callout.js        # Alert boxes
    ├── StatBand.js       # Statistics sections
    ├── QuoteBand.js      # Quote sections
    ├── ButtonCTA.js      # CTA buttons
    └── InfoCard.js       # Information cards
```

---

## 🎯 Considerações de Design

### Hierarquia Visual
1. **Títulos**: Instrument Serif com tamanhos clamp()
2. **Corpo**: Instrument Sans 1.0625rem
3. **Meta**: Font mono pequeno
4. **CTAs**: Botões verde money com hover effects

### Contraste e Legibilidade
- **Papel**: #f5f1e8 (off-white) para reduzir fadiga
- **Tinta**: #1a1614 (dark brown) vs preto puro
- **Money**: #0c4a3e (verde escuro) para CTAs

### Espaçamento
- **Base**: 0.5rem (8px) → 4rem (64px)
- **Ritmo**: 1.5rem para parágrafos, 3rem para seções
- **Grid**: 48px base para backgrounds

---

Este documento contém toda a estrutura visual necessária para entender e analisar o design do blog CLT vs PJ. Ideal para compartilhar com IA para análise visual, sugestões de melhorias ou desenvolvimento de features.
