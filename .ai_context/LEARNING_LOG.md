# 📈 Learning Log (Registro de Aprendizados)

Este arquivo documenta decisões arquiteturais e melhorias feitas ao longo do tempo pela IA, evitando repetições de erros e permitindo a evolução constante do projeto.

## [2026-05-26] Ativação de Tabelas Markdown (GFM) e Consistência Visual de Listas e Cabeçalhos
**Contexto**: O compilador de MDX não renderizava tabelas padrão do Markdown como tabelas HTML estruturadas no `mdxSource`, gerando blocos de texto cru quebrado nos posts. Adicionalmente, as listas (`li`) e outros elementos Markdown herdavam uma cor azulada inconsistente, e o título principal H1 aparecia repetido dentro da área de leitura do post (pois já estava no cabeçalho do Hero).
**Decisão**:
1. Ativamos o plugin `remarkGfm` dentro do método de serialização `serialize` em `src/lib/posts.ts` para converter tabelas Markdown em marcações HTML corretas.
2. Adicionamos estilização explícita em `blog.css` para as tags `table`, `th`, `td`, `ul` e `li` localizadas no contêiner `.post-content`, forçando as fontes, tamanhos e a cor de texto padrão do design system (`var(--ink)`).
3. Eliminamos as tags de cabeçalho H1 (`# ...`) do corpo dos posts em MDX ([clt-ou-pj-qual-vale-mais.mdx](file:///c:/cltvspj/posts/clt-ou-pj-qual-vale-mais.mdx), [como-abrir-cnpj-trabalhar-pj.mdx](file:///c:/cltvspj/posts/como-abrir-cnpj-trabalhar-pj.mdx), [como-calcular-salario-pj.mdx](file:///c:/cltvspj/posts/como-calcular-salario-pj.mdx) e [pj-para-desenvolvedores-vale-a-pena.mdx](file:///c:/cltvspj/posts/pj-para-desenvolvedores-vale-a-pena.mdx)), já que o título é exibido nativamente no bloco de Hero de cada post.
**Impacto**: O layout do blog foi restaurado com excelência visual e legibilidade premium. As tabelas agora aparecem com design de estilo de folha de dados (cabeçalhos em JetBrains Mono e fundos sombreados), as cores azuis indesejadas das listas foram totalmente neutralizadas para a cor preta/cinza do site, e o H1 duplicado sumiu, limpando a leitura do topo da página.

## [2026-05-26] Unificação de Posts do Simples Nacional e Centralização Tipográfica
**Contexto**: Havia dois posts no blog com URLs e conteúdos redundantes (`simples-nacional-pj-qual-anexo` e `simples-nacional-pj-qual-anexo-escolher`), o que gerava canibalização de SEO. Além disso, as variáveis globais de fontes do design system (`--f-display`, `--f-sans`, `--f-mono`) estavam restritas ao `blog.css`, criando risco de falhas tipográficas em páginas e componentes fora da rota do blog.
**Decisão**:
1. Unificamos todo o conteúdo conceitual e prático (passo a passo interativo, card da calculadora de Fator R, cartões de erro, FAQ e tabela comparativa) no componente `SimplesAnexoContent.js` sob a rota principal `/blog/simples-nacional-pj-qual-anexo`.
2. Deletamos o componente duplicado `SimplesAnexoEscolherContent.js` e o post redundante `simples-nacional-pj-qual-anexo-escolher.mdx`.
3. Configuramos redirecionamentos permanentes (status 301) no `next.config.js` para garantir que acessos à antiga URL `/blog/simples-nacional-pj-qual-anexo-escolher` sejam encaminhados para a página unificada.
4. Adicionamos as definições de variáveis CSS de fontes no `:root` de `globals.css` para centralizar a consistência da tipografia em todo o site.
**Impacto**: O blog agora possui um único artigo super completo, com alta densidade de conteúdo técnico e interativo, otimizando o posicionamento no Google e simplificando a navegação. A tipografia baseada nas fontes `Instrument Serif`, `Instrument Sans` e `JetBrains Mono` foi blindada de quebras em nível global do site, mantendo a harmonia visual em todas as páginas.

## [2026-05-26] Correção de Conflitos e Travas Inline no Layout de Posts
**Contexto**: O grid editorial de 1400px com coluna de texto de 850px em telas ultra-wide (definido em 11 de maio de 2026) não estava se aplicando na prática devido a duas travas rígidas de largura que limitavam a leitura, e o componente de CTA de afiliados sofria de perda de contraste de cores.
**Decisão**:
1. Removemos a classe Tailwind `max-w-[680px]` da tag `<article>` no template de posts (`src/pages/blog/[slug]/index.js`).
2. Removemos a propriedade inline `style={{ maxWidth: '896px' }}` do contêiner do renderizador MDX (`src/components/posts/PostContent.js`).
3. Deixamos a responsividade da largura de leitura totalmente a cargo das classes customizadas controladas centralizadamente por `.blog-content-column` em `blog.css`.
4. Adicionamos o modificador de importante (`!`) nas classes de cores de fonte em `src/components/AffiliateCTA.js` para impedir que seletores gerais de tag do CSS do blog (`.post-content h3` e `.post-content p`) forcem a cor de texto preta/cinza sobre o fundo verde do banner.
5. Identificamos que diversos componentes MDX de post (como TLDRCard, FatorRCard/Calculadora Fator R, ProfissaoCard, ErroCard, steps-list, e blocos de comparação) possuíam classes sem qualquer definição no CSS. Implementamos e adicionamos toda a estilização CSS desses componentes em `blog.css` para integrá-los à identidade visual premium.
6. Realizamos uma auditoria conceitual e fiscal no conteúdo do blog. Corrigimos enquadramentos incorretos nos exemplos e cards: advogados (que pertencem ao Anexo IV e não ao Anexo V sob Fator R) foram substituídos por Engenheiros no Anexo V; médicos e engenheiros (que pertencem ao Anexo V/III sob Fator R e não ao Anexo IV) foram devidamente reclassificados, e o exemplo prático de médico foi reajustado para demonstrar a otimização real promovida pelo Fator R.
7. Ajustamos a tipografia do título H1 nos posts individuais em `src/pages/blog/[slug]/index.js`. A combinação de peso 900 (`font-black`), itálico total e espaçamento de letras `-0.05em` (`tracking-tighter`) fazia com que as serifas da *Instrument Serif* colidissem, tornando as letras encavaladas e o título ilegível. Removemos o itálico global, adotamos peso 700 (`font-bold`), aumentamos a entrelinha para `leading-[1.15]` e aplicamos `tracking-editorial` (`-0.02em`), abrindo respiro aos caracteres.
**Impacto**: O layout ultra-wide editorial de 850px agora funciona perfeitamente em telas altas, a legibilidade visual da recomendação editorial foi plenamente restabelecida, todos os cartões e calculadoras inline são exibidos com excelente acabamento gráfico, o conteúdo de simulações do blog agora conta com precisão fiscal absoluta, e os títulos principais das matérias ganharam leitura limpa, leve e de alto nível estético.

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
