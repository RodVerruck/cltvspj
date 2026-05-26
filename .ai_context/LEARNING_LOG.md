# 📈 Learning Log (Registro de Aprendizados)

Este arquivo documenta decisões arquiteturais e melhorias feitas ao longo do tempo pela IA, evitando repetições de erros e permitindo a evolução constante do projeto.

## [2026-05-26] Correção de Conflitos e Travas Inline no Layout de Posts
**Contexto**: O grid editorial de 1400px com coluna de texto de 850px em telas ultra-wide (definido em 11 de maio de 2026) não estava se aplicando na prática devido a duas travas rígidas de largura que limitavam a leitura, e o componente de CTA de afiliados sofria de perda de contraste de cores.
**Decisão**:
1. Removemos a classe Tailwind `max-w-[680px]` da tag `<article>` no template de posts (`src/pages/blog/[slug]/index.js`).
2. Removemos a propriedade inline `style={{ maxWidth: '896px' }}` do contêiner do renderizador MDX (`src/components/posts/PostContent.js`).
3. Deixamos a responsividade da largura de leitura totalmente a cargo das classes customizadas controladas centralizadamente por `.blog-content-column` em `blog.css`.
4. Adicionamos o modificador de importante (`!`) nas classes de cores de fonte em `src/components/AffiliateCTA.js` para impedir que seletores gerais de tag do CSS do blog (`.post-content h3` e `.post-content p`) forcem a cor de texto preta/cinza sobre o fundo verde do banner.
5. Identificamos que diversos componentes MDX de post (como TLDRCard, FatorRCard/Calculadora Fator R, ProfissaoCard, ErroCard, steps-list, e blocos de comparação) possuíam classes sem qualquer definição no CSS. Implementamos e adicionamos toda a estilização CSS desses componentes em `blog.css` para integrá-los à identidade visual premium.
**Impacto**: O layout ultra-wide editorial de 850px agora funciona perfeitamente em telas altas, a legibilidade visual da recomendação editorial foi plenamente restabelecida e todos os cartões, calculadoras inline e blocos de conteúdo são exibidos de forma rica, responsiva e com excelente acabamento tipográfico.

## [2026-05-11] Ultra-Wide Editorial Standard (1400px)
**Contexto**: O layout anterior (896px) com TOC fixo sofria de sobreposição visual quando componentes "full-width" eram usados dentro do grid.
**Decisão**: 
1. Expandimos o grid global para **1400px**.
2. Definimos a coluna de texto em **850px** com um gap de **80px** para o TOC.
3. Criamos a técnica de **"Editorial Breakout"** (calc(100% + 120px) com margin-left -60px) para permitir bandas de destaque sem sobrepor o sidebar.
**Impacto**: Visual muito mais imponente e premium, sem bugs de layout em resoluções altas. Adotado como padrão para todas as páginas de conteúdo.

## [2026-05-10] Padronização e Modernização do Blog
**Contexto**: O layout do blog estava estreito (680px) e o template `[slug]/index.js` continha conteúdo fixo para slugs específicos, gerando dívida técnica e erros de hidratação.
**Decisão**:
1. Expandimos a largura de leitura para **896px** (`max-w-4xl`), criando uma experiência mais editorial e premium.
2. Criamos uma biblioteca de componentes MDX em `src/components/posts/` (Cards, Tabelas, Calculadoras).
3. Unificamos o renderizador em `PostContent.js`, permitindo que todos os posts consumam esses componentes globalmente.
4. Simplificamos o template central, removendo centenas de linhas de código "hardcoded".
**Impacto**: O blog agora é 100% escalável. Novos posts são criados apenas via MDX, mantendo a consistência visual. Erros de hidratação foram resolvidos trocando tags `<p>` por `<div>` em componentes MDX dinâmicos.

## [2026-05-10] Refatoração Next.js + Contexto de IA (RAG)
**Contexto**: O arquivo `pages/index.js` estava enorme (500+ linhas) com mistura de UI e cálculo de impostos, dificultando testes e manutenção. O projeto estava na raiz sem a pasta `src/`.
**Decisão**:
1. Migramos `pages/`, `components/` e `lib/` para dentro de `src/`, seguindo a convenção moderna do Next.js.
2. Extraímos a lógica da calculadora (`calculateCLT`, `calculatePJ`, `calculateINSS`) para `src/lib/calculator.js`.
3. Criamos o `.ai_context/` para manter a memória persistente da IA, similar à arquitetura adotada em outros projetos (ex: RPA Monitor).
**Impacto**: O `index.js` encolheu ~100 linhas. As regras de imposto estão isoladas, prontas para TDD (Test Driven Development) no futuro.

---
*Para novas entradas, adicione sempre no topo com o formato `[YYYY-MM-DD] Título`.*
