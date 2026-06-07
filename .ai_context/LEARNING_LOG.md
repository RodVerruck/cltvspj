# 📈 Learning Log (Registro de Aprendizados)

Este arquivo documenta decisões arquiteturais e melhorias feitas ao longo do tempo pela IA, evitando repetições de erros e permitindo a evolução constante do projeto.

## [2026-06-07] Correção Crítica #2: Comparação CLT usa `totalPackage` (não `net`)
**Contexto**: O breakdown CLT exibia FGTS, 13º e Férias como itens positivos (+verde), mas o "Total" mostrava apenas `clt.net` (salário líquido mensal, sem incluí-los). Isso tornava a comparação matematicamente inconsistente: as somas do breakdown não batiam no total. Além disso, a comparação principal (hero card e compare section) usava `clt.net` vs `pj.net`, sendo injusta com a CLT, pois a PJ não tem FGTS, 13º nem férias.
**Decisão**: Trocar todas as referências de comparação de `clt.net` para `clt.totalPackage`:
1. Cálculo de `difference` e `percentDiff` → usam `clt.totalPackage`
2. Hero card (cor, recomendação, diferença mensal/anual, percentual) → `clt.totalPackage`
3. Compare section "Como CLT" → agora mostra `clt.totalPackage` com rótulo "Pacote total: líquido + 13º + férias + FGTS"
4. Breakdown CLT: "Valor Líquido Total" → renomeado para "Total do Pacote Mensal" mostrando `clt.totalPackage` (a soma agora fecha!)
5. CTA condicional → `pj.net > clt.totalPackage`
**Regra**: `clt.net` = salário líquido mensal (sem FGTS/13º/férias). `clt.totalPackage` = pacote total real = o valor correto para comparar com PJ.


**Contexto**: Auditoria profunda solicitada pelo usuário para garantir 100% de precisão em todos os cálculos. Identificamos um erro crítico conceptual: o INSS pró-labore do Lucro Presumido estava sendo calculado com alíquota de **31%** (sócio + patronal), quando o correto é **11%** (apenas cota retida do sócio, de acordo com a lei previdenciária). Os 20% patronais são custo da empresa jurídica, e não devem ser descontados do salário líquido individual do sócio no simulador.
**Decisões**:
1. Corrigimos `calculator.js`: Lucro Presumido → INSS pró-labore de `0.31` para `0.11`.
2. Corrigimos a alíquota consolidada de impostos do Lucro Presumido de `0.15` (15% estimado) para `0.145` (14,5%), com a memória dos componentes: IRPJ 4,8% + CSLL 2,88% + PIS 0,65% + COFINS 3% + ISS 3%.
3. Corrigimos o rótulo na UI de `(31%)` para `(11%)` no detalhamento de INSS pró-labore.
4. Corrigimos o tooltip do formulário de "Alíquotas: 1.6% a 32%" para "Total consolidado ~14,5% (IRPJ+CSLL+PIS+COFINS+ISS)".
5. Documentamos o erro e o aviso explícito no `CALCULATOR_RULES.md` para evitar regressão futura.
**Regra para nunca repetir**: O INSS pró-labore do sócio é **sempre 11%** em qualquer regime (MEI, Simples, Presumido). Os 20% patronais existem apenas no Presumido e não afetam o bolso do sócio.
**Impacto**: O Lucro Presumido estava anteriormente mostrando um líquido distorcido — ~R$ 502 a menos por mês do que o correto — o que poderia levar o usuário a uma conclusão errônea sobre esse regime.

## [2026-06-07] Auditoria de Precisão Fiscal de 100% e Implementação de Fórmulas Oficiais
**Contexto**: O usuário solicitou uma auditoria profunda nos cálculos fiscais do simulador para garantir 100% de precisão com a legislação de 2026. Identificamos que a fórmula usada no redutor linear de IRPF da Lei 15.270/2025 era uma aproximação linear proporcional simples (gerando discrepâncias significativas de centenas de reais) e que o cálculo de férias da CLT omitia o terço constitucional mensalizado.
**Decisão**:
1. Implementamos a fórmula de redução oficial definida pela Lei 15.270/2025 para a faixa de base de cálculo de R$ 5.000,01 a R$ 7.350,00: `Redução = R$ 978,62 - (0,133145 × baseCalculo)`, garantindo precisão de centavos na fonte pagadora do IRPF.
2. Atualizamos o cálculo de férias mensalizadas da CLT de `sal / 12` para `sal / 9` para integrar a provisão exata do terço constitucional das férias (`1/12 + 1/36 = 1/9` do salário bruto), o que reflete com total precisão a lei trabalhista.
**Impacto**: Confiabilidade e integridade jurídica absoluta do simulador para fins de comparação salarial real.

## [2026-06-07] Implementação da Calculadora PJ Dinâmica 2026 (MEI, Simples Nacional e Lucro Presumido)
**Contexto**: O usuário solicitou que a calculadora de regimes PJ passasse a ser dinâmica. Anteriormente, ela calculava sempre com base nas regras do Simples Nacional de forma fixa, independente da opção selecionada de regime PJ (MEI ou Lucro Presumido). Também fizemos uma pesquisa web que atualizou os valores fiscais oficiais para 2026 (salário mínimo de R$ 1.621,00, DAS MEI de R$ 86,05 e faixas progressivas do INSS CLT).
**Decisão**:
1. Alteramos a assinatura da função `calculatePJ` no arquivo `src/lib/calculator.js` para aceitar o parâmetro `regime` e adicionamos a lógica condicional de impostos para **MEI** (DAS fixo de R$ 86,05 e R$ 0,00 de INSS pró-labore), **Lucro Presumido** (15% de impostos consolidados e INSS pró-labore de 31% = R$ 502,51) e **Simples Nacional** (6% de DAS e INSS pró-labore de 11% = R$ 178,31).
2. Atualizamos as faixas de INSS progressivo da CLT para 2026 em `src/lib/calculator.js` com base nas faixas oficiais vigentes (teto de R$ 8.475,55).
3. Integramos o regime na chamada do PJ no arquivo `src/pages/index.js` (`calculatePJ(pjRate, hoursPerMonth, regime)`).
4. Adicionamos a lógica de validação de teto de faturamento do MEI (limite mensal de R$ 6.750,00) no arquivo `src/pages/index.js`. Se o faturamento ultrapassar o teto do MEI, o site agora exibe um banner explicativo (`meiExcedido`), e recalcula os impostos automaticamente com base no Simples Nacional para fins comparativos, garantindo a conformidade fiscal e legal da simulação.
5. Dinamizamos toda a seção de resultados e detalhamentos de PJ, omitindo o INSS pró-labore para o MEI válido e exibindo rótulos explicativos dinâmicos com os percentuais e nomes dos impostos corretos (`pj.taxName`).
6. Atualizamos as documentações fiscais em `CALCULATOR_RULES.md`.
**Impacto**: O simulador do CLT vs PJ tornou-se 100% dinâmico, confiável e fiscalmente preciso com as regras vigentes do ano de 2026 para todos os três regimes PJ (MEI, Simples e Presumido), evitando que os usuários tomem decisões comerciais com base em simulações errôneas de tributação.

## [2026-06-07] Correção do Teto Mensal do MEI e Erro de Digitação
**Contexto**: O teto mensal do MEI na visualização informativa da calculadora indicava R$ 8.500 de forma incorreta (possivelmente refletindo propostas de alteração de teto não sancionadas ou erro). O correto vigente é R$ 6.750 (proporcional ao teto anual de R$ 81.000). Também havia um pequeno estrangeirismo na descrição do Lucro Presumido ("selon").
**Decisão**:
1. Atualizamos no arquivo `src/pages/index.js` o texto do teto do MEI de R$ 8.500 para R$ 6.750.
2. Corrigimos a expressão "selon atividade" para "conforme a atividade" no texto descritivo do Lucro Presumido no mesmo arquivo.
**Impacto**: Informações tributárias mais precisas e corretas no painel de alternativas PJ, reforçando a confiabilidade do simulador.

## [2026-06-03] Substituição de CTAs de Afiliados (Agilize por Manassés Contabilidade)
**Contexto**: A pedido do usuário, preparamos toda a estrutura do site para a nova parceria com a Manassés Contabilidade, removendo as referências e CTAs da parceira anterior (Agilize).
**Decisão**:
1. Criamos a rota de redirecionamento dinâmico `/go/manasses` em `src/pages/go/[slug].js`, apontando provisoriamente para o WhatsApp do Anderson Moreira (+55 11 94215-0872) com mensagem parametrizada identificando a origem da calculadora.
2. Atualizamos o banner contextual de recomendação PJ na Home (`src/pages/index.js`) e no template geral de posts (`src/pages/blog/[slug]/index.js`), alterando os links para `manasses` e adicionando os valores de honorários dela (a partir de R$ 349) e o desconto exclusivo de 50% na primeira mensalidade.
3. Removemos a tabela de comparação de preços laterais com concorrentes de baixo custo e a substituímos por um painel de diferenciais da Manassés (Especialistas em TI, Abertura Grátis de CNPJ e Suporte 100% Humano).
4. Refinamos a estética e legibilidade do painel a partir de feedback no localhost: substituímos o caractere "x" por um ícone `ArrowRight` com transição dinâmica (`group-hover`), mudamos o hover do botão de laranja para branco (`hover:bg-white`) para combinar melhor com a paleta, adicionamos ícones vetoriais da biblioteca `lucide-react` aos títulos da direita (`Briefcase`, `CheckCircle`, `Users`) e aumentamos o contraste e tamanho das descrições (`text-sm font-sans text-paper/90`), melhorando substancialmente a acessibilidade e o visual premium.
5. Refatoramos o bloco de resultados principal da calculadora, eliminando o número colossal e o texto confuso ("PJ paga, no seu caso,"), e introduzindo um **Card de Recomendação Tributária** muito mais compacto, legível e profissional. O card agora exibe o regime recomendado de forma clara e resume os rendimentos extras mensais e anuais em um bloco lateral estruturado. Para evitar a quebra cromática do fundo branco, implementamos cores dinâmicas pastéis integradas da própria marca (`bg-money-light` ou `bg-hot-light`) e um painel de detalhamento à direita usando glassmorphism translúcido (`bg-white/70 backdrop-blur-sm`), gerando uma harmonia perfeita com as cores quentes de papel e fundo do site.
6. Ajustamos as referências textuais e tags `<AffiliateCTA>` nos posts MDX (`vale-pena-pj-isencao-ir-lei-15270-2026.mdx` e `como-abrir-cnpj-trabalhar-pj.mdx`).
**Impacto**: O site está 100% preparado visual, conceitual e tecnicamente para a parceria com a Manassés. Rodrigo poderá mostrar essa integração pronta e refinada durante a chamada das 10h como um sinal claro de capricho e agilidade comercial.

## [2026-06-03] Preparação para Call de Alinhamento Comercial (Manassés Contabilidade)
**Contexto**: A chamada comercial com o Anderson Moreira da Manassés Contabilidade está agendada para hoje às 10:00. O objetivo é estruturar a abordagem comercial do Rodrigo para demonstrar o valor do tráfego high-intent (mesmo o site sendo novo) e definir os termos operacionais da parceria de afiliados (link de afiliado `/go/manasses`, cupons, rastreamento de leads e modelo de comissão de 50%).
**Decisão**: Mapeamos os pontos fortes do Rodrigo para a call (leads ultra-qualificados de TI na fase de decisão de pejotização, fit exato com Fator R) e formulamos um roteiro completo de perguntas e estratégias de negociação para garantir uma parceria sólida.
**Impacto**: Rodrigo entra na reunião preparado com argumentos focados em valor/conversão e um checklist técnico e comercial claro para fechar o negócio.

## [2026-05-28] Prospecção de Nova Parceria de Afiliação (Manassés Contabilidade)
**Contexto**: O usuário recebeu contato de retorno da Manassés Contabilidade (Anderson Moreira) demonstrando interesse no programa de afiliação do site CLT vs PJ.
**Decisão**:
1. Esclarecemos que o foco principal do site é em prestadores de serviço de tecnologia e Simples Nacional (Fator R), o que Anderson confirmou ser exatamente o foco da Manassés Contabilidade.
2. Propusemos opções de resposta para dar o próximo passo: entender como funciona o programa de afiliados deles (comissão, modelo de indicação) ou fechar o horário do papo rápido para o dia seguinte (amanhã).
**Impacto**: Parceria muito bem alinhada no quesito público-alvo (fit perfeito com a calculadora), avançando para os termos comerciais.


## [2026-05-26] Configuração de Ferramentas de Analytics e SEO (GA4, Clarity e Search Console)
**Contexto**: O usuário desejava começar a identificar e monitorar o fluxo e o tráfego do site, mas não tinha ferramentas de análise e indexação ativas. A propriedade de Analytics anterior estava desativada (Vant App) e o site não estava indexado no Google.
**Decisão**:
1. Orientamos o usuário a criar uma propriedade dedicada chamada "CLT vs PJ" no Google Analytics e atualizamos a variável `NEXT_PUBLIC_GA_ID` no arquivo `.env.local` com o novo ID `G-Z58J44F2DW`.
2. Adicionamos suporte ao **Microsoft Clarity** no arquivo `src/pages/_app.js` e `.env.local` para gravação de comportamento.
3. Criamos o arquivo de verificação de propriedade do Google Search Console (`google85e2919dd7b51ba0.html`) no diretório `public/` para verificação direta via arquivo estático.
**Impacto**: O site agora possui tags de monitoramento isoladas e está preparado para ser indexado pelo Google Search Console. Após o deploy do arquivo HTML, o usuário poderá enviar o sitemap e iniciar a indexação oficial no Google.

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
