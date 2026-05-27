# 📈 Learning Log (Registro de Aprendizados)

Este arquivo documenta decisões arquiteturais e melhorias feitas ao longo do tempo pela IA, evitando repetições de erros e permitindo a evolução constante do projeto.

## [2026-05-26] Configuração de Ferramentas de Analytics (GA4 e Clarity)
**Contexto**: O usuário desejava começar a identificar e monitorar o fluxo e o tráfego do site, mas não tinha ferramentas de análise ativas. Identificamos que ele já possuía uma conta e propriedade configuradas no Google Analytics.
**Decisão**:
1. Obtivemos o ID de métricas real do Google Analytics (`G-EYNHF1X75P`) a partir de screenshot e atualizamos a variável de ambiente `NEXT_PUBLIC_GA_ID` no arquivo `.env.local`.
2. Adicionamos suporte nativo e flexível ao **Microsoft Clarity** no arquivo `src/pages/_app.js` e inicializamos a variável `NEXT_PUBLIC_CLARITY_ID` no arquivo `.env.local` para ativação simples sem necessidade de novas alterações no código-fonte.
**Impacto**: O projeto local agora está preparado para enviar dados para o GA4 e pré-configurado para gravação de comportamento do usuário via Microsoft Clarity. Ambos estão prontos para produção bastando replicar as chaves no painel da Vercel.

## [2026-05-26] Refatoração do Deck de Slides para Apresentação Institucional e Media Kit
**Contexto**: O usuário identificou que o formulário de afiliação da Agilize exige o envio de um link do Google Drive contendo uma "Apresentação institucional da sua empresa". A apresentação original estava formatada como uma proposta ativa de parceria exclusiva e integração especial, o que desviava do objetivo do cadastro de afiliação padrão.
**Decisão**:
1. Adaptamos o conteúdo e o copy do arquivo `public/apresentacao_parceiro_agilize.html` para transformá-lo em uma **Apresentação Institucional & Media Kit** do projeto CLT vs PJ.
2. Atualizamos o Slide 1 (Capa) para focar no CLT vs PJ como um simulador independente de pejotização e planejamento tributário assertivo.
3. Modificamos o Slide 3, substituindo o payload JSON (que parecia "defeito" visual para analistas não técnicos) por um painel de "Ficha de Lead Qualificado no CRM", apresentando de forma limpa as informações de nome, faturamento estimado e segmento obtidos na simulação.
4. Ajustamos a legibilidade tipográfica: aumentamos o contraste do texto de cor mutada (de `#6b6357` para `#4a4135`) e apagada (de `#a8a192` para `#7a7162`) e aumentamos o tamanho mínimo de fonte das descrições do Slide 2 de `10px/11px` para `12px` (`text-xs`), melhorando muito a leitura.
5. Reestruturamos o Slide 5 (Promoção Editorial) para focar puramente em "Como Promovemos a Agilize" (Calculadora e Artigos do Blog/SEO) através de um grid de duas colunas, removendo a seção de otimização de comissões/CPA a pedido do usuário.
**Impacto**: O documento institucional tornou-se ideal para submissão no formulário de afiliação da Agilize, com legibilidade aprimorada, visual polido sem códigos confusos e foco editorial na atração de leads, mantendo a consistência do design system do site.

## [2026-05-26] Resolução de Erro 404 no Servidor Dev e Descoberta de Diretórios Duplicados
**Contexto**: O usuário enfrentou erro 404 ao tentar acessar `http://localhost:3000/apresentacao_parceiro_agilize.html`.
**Decisão**:
1. Identificamos que o usuário possui duas pastas do mesmo projeto: a ativa e atualizada em `c:\cltvspj` (com estrutura `src/` de maio/2026) e uma antiga em `c:\Projetos\cltvspj` (com estrutura sem `src/` de março/2026).
2. O arquivo de apresentação comercial estava presente em `c:\Projetos\cltvspj\public\apresentacao_parceiro_agilize.html`, mas o servidor do Next.js estava rodando na pasta ativa `c:\cltvspj`, onde o arquivo não existia.
3. Copiamos o arquivo de apresentação para `c:\cltvspj\public\apresentacao_parceiro_agilize.html`.
**Impacto**: O localhost agora serve corretamente o arquivo na porta 3000. O usuário foi orientado a focar o desenvolvimento e abrir arquivos na pasta `c:\cltvspj` para evitar inconsistências.

## [2026-05-26] Desenvolvimento e Mapeamento de Deck de Apresentação Comercial (Agilize)
**Contexto**: O usuário possuía um arquivo HTML inicial de apresentação comercial para a empresa de contabilidade parceira Agilize e desejava melhorias estéticas e funcionais no documento para torná-lo um deck profissional. O arquivo original residia na pasta física de projetos mas fora do roteamento público, impossibilitando acesso prático pelo servidor Next.js.
**Decisão**:
1. Desenvolvemos uma aplicação interativa de slides em `apresentacao_parceiro_agilize.html` contendo transições controladas por teclado (setas, espaço) e botões visuais no rodapé da página.
2. Integramos um "Modo Impressão" (PDF) acionado via botão que desativa as transições de slides e empilha as páginas de forma limpa na proporção A4 Landscape, ideal para exportação em PDF (`Ctrl + P`).
3. Alinhamos a tipografia com o design system do site utilizando `Instrument Serif` (Display), `Instrument Sans` (Corpo) e a paleta oficial verde `money` e laranja `hot`.
4. Criamos um mockup de alta fidelidade simulando a interface da calculadora real CLT vs PJ e expandimos o conteúdo com dois slides comerciais ("Audiência e Tráfego Qualificado" e "Modelo de Parceria Ganha-Ganha").
5. Movemos o arquivo HTML para a pasta `public/` do Next.js para expô-lo de forma estática no roteamento do localhost.
**Impacto**: O deck comercial tornou-se uma ferramenta profissional altamente persuasiva e interativa para negociações de afiliados com a Agilize, disponível para visualização instantânea no servidor local e pronta para impressão.

## [2026-05-26] Remoção de Parcerias Afiliadas Inativas (Contabilizei)
**Contexto**: A parceria com a empresa de contabilidade online Contabilizei não foi concretizada pelo usuário, exigindo a remoção de todas as menções textuais e links de afiliados para evitar frustrações do usuário e cliques em links quebrados/não monetizados.
**Decisão**:
1. Substituímos a Contabilizei no CTA condicional da Home page ([index.js](file:///c:/cltvspj/src/pages/index.js)) pela parceira Agilize (com preço ajustado para R$ 99/mês) e alteramos a tabela comparativa lateral inserindo a Contasign no lugar.
2. Atualizamos o template principal de posts do blog ([index.js](file:///c:/cltvspj/src/pages/blog/%5Bslug%5D/index.js)) para apontar o AffiliateCTA padrão para a Agilize.
3. Removemos as menções textuais embutidas nos posts Markdown ([vale-pena-pj-isencao-ir-lei-15270-2026.mdx](file:///c:/cltvspj/posts/vale-pena-pj-isencao-ir-lei-15270-2026.mdx) e [como-abrir-cnpj-trabalhar-pj.mdx](file:///c:/cltvspj/posts/como-abrir-cnpj-trabalhar-pj.mdx)), trocando-as por parceiros ativos (Agilize e Conube).
**Impacto**: O site agora reflete apenas parcerias operacionais e ativas na calculadora e nos posts, mantendo a integridade comercial de links patrocinados.

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
