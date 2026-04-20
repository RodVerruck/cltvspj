# Estrutura do Projeto CLT vs PJ

## 📋 Visão Geral
Projeto Next.js 14 com calculadora comparativa entre regimes CLT e PJ, blog com 5 artigos e monetização configurada.

## 🏗️ Arquitetura

### Stack Tecnológico
- **Framework**: Next.js 14 (Pages Router)
- **UI**: React 18 + Tailwind CSS
- **Ícones**: Lucide React
- **Blog**: MDX + Gray Matter + Remark/Rehype
- **Monetização**: Google AdSense

### 📁 Estrutura de Arquivos

```
cltvspj/
├── pages/
│   ├── _app.js                 # Configuração do app Next.js
│   ├── _document.js            # Configuração do documento HTML
│   ├── index.js                # Calculadora principal (456 linhas)
│   ├── sitemap.xml.js          # Sitemap dinâmico
│   ├── test.js                 # Arquivo de teste
│   └── blog/
│       ├── index.js            # Listagem de posts do blog
│       └── [slug]/
│           └── index.js        # Página individual do post
├── components/
│   ├── AdSense.js              # Componente de anúncios (633 bytes)
│   ├── Footer.js               # Footer do site (920 bytes)
│   ├── Header.js               # Header com navegação (1.4KB)
│   └── posts/
│       ├── PostCard.js         # Card de post na listagem
│       └── PostContent.js      # Renderizador de conteúdo MDX
├── lib/
│   ├── config.js               # Configurações gerais (URL do site)
│   └── posts.ts                # Lógica de parsing e gestão de posts (2.3KB)
├── posts/                      # Conteúdo MDX dos artigos
│   ├── clt-ou-pj-qual-vale-mais.mdx
│   ├── como-calcular-salario-pj.mdx
│   ├── pj-para-desenvolvedores.mdx
│   ├── como-abrir-cnpj.mdx
│   └── simples-nacional-anexo-escolher.mdx
├── public/                     # Assets estáticos
├── styles/
│   ├── globals.css             # Estilos globais Tailwind
│   └── blog.css                # Estilos específicos do blog
└── arquivos de configuração Next.js/Tailwind
```

## 🔧 Funcionalidades Principais

### 1. Calculadora (pages/index.js)
- **Estado**: React hooks para salário, benefícios, taxa PJ, horas/mês
- **Cálculos**:
  - INSS progressivo (4 faixas)
  - IRPF com dedução INSS
  - Cálculo PJ com Simples Nacional
  - Comparação de valores líquidos
- **Benefícios considerados**: VR, VT, Plano Saúde, Seguro Vida

### 2. Sistema de Blog
- **Posts MDX**: Frontmatter com metadata + conteúdo MDX
- **Parsing**: Gray Matter para frontmatter, Remark/Rehype para MDX
- **Roteamento**: Next.js dynamic routes [slug]
- **SEO**: Meta tags dinâmicas por post

### 3. Componentes Reutilizáveis
- **Header**: Navegação responsive com logo
- **Footer**: Links e informações
- **AdSense**: Integração com Google AdSense
- **PostCard**: Preview de artigos na listagem
- **PostContent**: Renderização segura de MDX

## 📊 Lógica de Negócio

### Cálculos CLT
```javascript
// INSS: 7.5% a 14% (até R$ 8.157,41)
// IRPF: 7.5% a 27.5% (base dedutível)
// Salário líquido = Salário - INSS - IRPF + Benefícios
```

### Cálculos PJ
```javascript
// Taxa horária = (Salário alvo / horas mês)
// Faturamento mensal = Taxa × horas
// Simples Nacional: ~15,5% total (anexo V serviços)
// Líquido PJ = Faturamento - 15,5%
```

## 🎯 Pontos de Extensão

### Para Adicionar Novos Posts
1. Criar arquivo .mdx em `/posts/`
2. Adicionar frontmatter com title, description, date, slug
3. Sistema automaticamente detecta e renderiza

### Para Modificar Cálculos
- Editar funções `calculateINSS()`, `calculateCLT()`, `calculatePJ()` em `pages/index.js`
- Atualizar alíquotas e faixas conforme legislação

### Para Nova Monetização
- Componentes em `/components/`
- Configuração AdSense em `AdSense.js`
- Espaços estratégicos nos posts MDX

## 📈 Performance e SEO
- Next.js SSG para posts estáticos
- Sitemap.xml automático
- Meta tags otimizadas
- Imagens otimizadas (se usar next/image)
- Tailwind CSS purgado em build

## 🔐 Configurações de Deploy
- Ambiente: Vercel (recomendado)
- Variáveis de ambiente: SITE_URL
- Build estático otimizado
- CDN automático Vercel

---

Este resumo contém toda a arquitetura e lógica do projeto sem expor o código completo. Ideal para compartilhar com IA para entendimento estrutural.
