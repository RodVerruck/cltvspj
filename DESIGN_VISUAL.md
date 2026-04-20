# Design System e Visual do Projeto CLT vs PJ

## 🎨 Identidade Visual

### Paleta de Cores
- **Primária (Azul)**: `#1e40af` (brand-500) - Calculadora, headers, CTAs
- **Secundária (Laranja)**: `#ea580c` (accent-400) - Destaques, alertas, hover states
- **Neutros**: Escala de cinzas do Tailwind (gray-50 a gray-900)
- **Backgrounds**: 
  - Principal: `#f8fafc` (slate-50)
  - Cards: `#ffffff` (branco)
  - Acentos: `#eff6ff` (brand-50), `#fff7ed` (accent-50)

### Tipografia
- **Serif (Títulos)**: 'Instrument Serif', Georgia, serif
- **Sans (Corpo)**: 'DM Sans', system-ui, sans-serif  
- **Mono (Código)**: 'JetBrains Mono', 'Fira Code', monospace

## 📱 Layout e Estrutura

### Header (Todas páginas)
- **Sticky** com backdrop blur (10px)
- **Background**: rgba(248, 250, 252, 0.94)
- **Padding**: 14px 24px
- **Layout Flex**: Logo/Back | Navegação | CTA
- **Border-bottom**: 0.5px solid #e2e8f0
- **Z-index**: 90

### Página Inicial (Calculadora)
#### Hero Section
- **Background**: Gradiente brand-50 para white
- **Título**: Instrument Serif, clamp(2.5rem, 5vw, 3.5rem)
- **Descrição**: DM Sans 1.125rem, cor gray-600
- **Badge**: "CALCULADORA GRATUITA" em brand-500

#### Formulários (Grid 2 colunas)
- **Cards**: Background white, border border-gray-200, rounded-2xl
- **Padding**: 32px
- **Shadows**: shadow-md
- **Inputs**: 
  - Height: 48px (py-3 px-4)
  - Border: 2px solid border-gray-200
  - Focus: border-brand-400
  - Prefix "R$" nos campos monetários

#### Botão Principal
- **Gradiente**: from-orange-600 to-orange-500
- **Padding**: px-12 py-4
- **Shadow**: shadow-orange-500/30
- **Hover**: scale-105 + shadow-xl

#### Resultados
- **Cards**: background white, rounded-2xl, border border-gray-200
- **Grid**: 3 colunas (Desktop)
- **Valores**: font-bold text-2xl/3xl
- **Ícones**: Lucide React (24px)

### Blog

#### Listagem (/blog)
- **Container**: max-width 1100px, padding 2.5rem 1.5rem
- **Header**: 
  - Background brand-500 (azul)
  - Border-radius: 18px
  - Padding: 3.5rem 2rem
  - Título: Instrument Serif, 2.4rem
  - Badge: "📚 Base de Conhecimento"

- **Grid Posts**: 
  - Grid: repeat(auto-fill, minmax(290px, 1fr))
  - Gap: 1.1rem
  - Cards: background white, border-radius 14px
  - Hover: translateY(-3px) + border-blue-200
  - Top border: 2.5px gradient (brand to brand-mid)

#### Post Individual (/blog/[slug])
- **Layout**: Grid 220px | 1fr (Sidebar | Conteúdo)
- **TOC Sidebar**: 
  - Sticky: top 68px
  - Background white, border border-gray-200
  - Border-radius: 14px
  - Padding: 16px 14px

- **Conteúdo Principal**:
  - **Título**: Instrument Serif, clamp(26px, 3.5vw, 36px)
  - **Meta**: Flex com data e tempo de leitura
  - **Seções**: H2 em Instrument Serif 22px
  - **Componentes customizados**:
    - `.tldr-card`: Cards com stripe azul
    - `.anexo-grid`: Grid 5 colunas para anexos
    - `.step-item`: Steps numerados
    - `.formula-display`: Fórmulas matemáticas

### Footer (Todas páginas)
- **Background**: #0f172a (slate-900)
- **Padding**: 40px 24px 32px
- **Layout**: Flex space-between
- **Cores**: Texto rgba(255, 255, 255, 0.7)
- **Links**: Hover para white

## 🎯 Componentes Específicos

### Cards de Informação
- **Regra Ouro**: background brand-50, border brand-200
- **Alertas**: background amber-50, border amber-200
- **Dicas**: background green-50, border green-200

### Botões
- **Primário**: brand-500 background, white text
- **Secundário**: white background, brand-500 border
- **CTA**: padding 8px 16px, border-radius 7px

### Formulários
- **Inputs**: Height 48px, border-radius 8px
- **Labels**: font-size 0.875rem, color gray-700
- **Focus States**: border-brand-400, outline-none

### Ícones
- **Library**: Lucide React
- **Tamanhos**: 14px (small), 20px (medium), 24px (large)
- **Cores**: brand-500 (ativos), gray-400 (inativos)

## 📐 Responsividade

### Breakpoints (Tailwind)
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

### Adaptações
- **Calculadora**: Grid 1 coluna mobile
- **Blog**: Grid 1 coluna mobile, 2 colunas tablet
- **TOC**: Hidden mobile, inline tablet+
- **Font sizes**: clamp() para escalonamento fluido

## ✨ Animações e Transições

### Padrões
- **Hover**: transform 0.18s, border-color 0.18s
- **Focus**: outline-none, border-color 0.15s
- **Cards**: translateY(-3px) + shadow
- **Botões**: scale-105 + shadow-xl

### Micro-interações
- **Post cards**: Top border scaleX(0) → scaleX(1)
- **TOC items**: Background + border-left transitions
- **Inputs**: Background paper → white on focus

## 🎨 Tokens CSS (blog.css)

### Variáveis Customizadas
```css
--ink: #0f172a;          /* Texto principal */
--ink2: #334155;         /* Texto secundário */
--ink3: #64748b;         /* Texto terciário */
--ink4: #94a3b8;         /* Texto fraco */
--paper: #f8fafc;        /* Background */
--rule: #e2e8f0;         /* Divisores */
--blue: #1e40af;         /* Primária */
--orange: #9a3412;       /* Secundária */
--radius: 10px;          /* Border radius base */
```

## 🖼️ Exemplos de Componentes

### Card de Post (Blog)
```jsx
<article className="post-card">
  {/* Meta tags */}
  <div className="post-meta">
    <span className="post-tag">5 min</span>
    <span className="post-reading-time">15/03/2026</span>
  </div>
  
  {/* Título */}
  <h2 className="post-card-title">
    <a href="#">CLT ou PJ: Qual Vale Mais?</a>
  </h2>
  
  {/* Descrição */}
  <p className="post-description">
    Guia completo 2026 com cálculos atualizados...
  </p>
  
  {/* CTA */}
  <a href="#" className="read-more">
    Ler mais →
  </a>
</article>
```

### Card de Resultado (Calculadora)
```jsx
<div className="bg-white rounded-2xl shadow-md p-8 border border-gray-200">
  <div className="flex items-center gap-3 mb-6">
    <div className="p-3 bg-brand-50 rounded-xl">
      <TrendingUp className="text-brand-400" size={24} />
    </div>
    <h3 className="text-2xl font-bold text-gray-900">Resultado CLT</h3>
  </div>
  
  <div className="space-y-4">
    <div className="flex justify-between">
      <span className="text-gray-600">Salário Líquido</span>
      <span className="font-bold text-2xl">R$ 6.234,56</span>
    </div>
  </div>
</div>
```

---

Este documento cobre todo o sistema visual, layout e design do projeto. Ideal para compartilhar com designers ou desenvolvedores frontend que precisam entender a identidade visual sem acessar o código completo.
