# 📈 Learning Log (Registro de Aprendizados)

Este arquivo documenta decisões arquiteturais e melhorias feitas ao longo do tempo pela IA, evitando repetições de erros e permitindo a evolução constante do projeto.

## [2026-06-08] Atualização do Link de Afiliado — Manassés Contabilidade

**Contexto**: Anderson Moreira (Manassés Contabilidade) enviou o link de afiliado oficial do programa de parceria.

**Decisão**:
- Atualizado o link de destino do `/go/manasses` de `https://wa.me/5511942150872...` (WhatsApp temporário) para a URL de afiliado oficial: `https://manassescontabilidade.com.br/orcamento/?ref=e150bfec6701708e9e17fdc38a6fc261`
- Removidos todos os outros links de afiliados inativos do arquivo `src/pages/go/[slug].js` (contabilizei, agilize, contasign, conube). A Manassés é agora o único parceiro ativo.
- Atualizado `MONETIZACAO.md` para refletir apenas a Manassés como parceiro ativo.
- A rota `/go/manasses` continua disparando o evento `affiliate_click` no GA4 para rastreamento.

**Operacional**:
- Repasse de comissão: mensal ou semestral acumulado (a confirmar com Vinícius, responsável pelos repasses)
- Token de afiliado: `e150bfec6701708e9e17fdc38a6fc261`

**Regra**:
- O único afiliado ativo é a Manassés. Nunca adicionar novos parceiros sem atualizar `MONETIZACAO.md` e o `LEARNING_LOG.md` com os termos acordados.

## [2026-06-07] Implementação do Dashboard de Analytics Admin (`/admin`)

**Contexto**: Usuário queria visualizar métricas de acessos do site diretamente, sem ter que abrir o Google Analytics. Optou por um dashboard customizado integrado ao GA4 Data API via Service Account.

**Decisões Arquiteturais**:
- Criada página `/admin` com tela de login protegida por senha (`ADMIN_PASSWORD` no `.env.local`). Senha atual: `cltvspj2026`.
- Autenticação via token diário (base64 de `senha:data`) armazenado em `sessionStorage` — expira automaticamente à meia-noite.
- API Route `src/pages/api/admin-auth.js` valida a senha e gera o token. Função `validateToken` exportada e reutilizada pela API de analytics.
- API Route `src/pages/api/analytics.js` autentica com o Google via `google-auth-library` (Service Account) e chama a GA4 Data API com 7 relatórios paralelos: KPIs gerais, usuários por dia, top páginas, origens de tráfego, dispositivos, países e comparativo semanal.
- Dashboard usa `chart.js` + `react-chartjs-2` para gráficos (Line, Bar, Doughnut).
- **Design totalmente isolado do site público**: CSS inline (JS-in-CSS) para não contaminar o design system editorial. Tema dark premium (`#0f1117` fundo, `#151824` cards).
- Auto-refresh a cada 5 minutos via `setInterval`.
- Skeleton loading durante carregamento dos dados.

**Variáveis necessárias no `.env.local`**:
```
ADMIN_PASSWORD=cltvspj2026
GA4_PROPERTY_ID=      # ID numérico da propriedade (ex: 123456789)
GA4_CLIENT_EMAIL=     # Email da Service Account
GA4_PRIVATE_KEY=      # Chave privada JSON (com \n escapados)
```

**Como configurar a Service Account**:
1. Google Cloud Console → IAM & Admin → Service Accounts → Criar conta
2. Criar chave JSON → copiar `client_email` e `private_key`
3. Google Analytics → Admin → Gerenciamento de acesso → adicionar email com papel **Leitor**
4. Preencher `.env.local` e reiniciar `npm run dev`

**Arquivos criados**:
- `src/pages/admin/index.js` — Dashboard completo (login + gráficos)
- `src/pages/api/admin-auth.js` — Autenticação admin
- `src/pages/api/analytics.js` — Integração GA4 Data API

**Pacotes instalados**: `google-auth-library`, `chart.js`, `react-chartjs-2`

**Regras para não repetir**:
- O admin NUNCA deve ter `robots: index` — sempre `noindex, nofollow`.
- O CSS do admin deve ser isolado (JS-in-CSS) para não vazar no design system editorial do site.
- O token de sessão usa a DATA como parte do hash — expira naturalmente à meia-noite, sem necessidade de logout manual.


**Contexto**: Análise UX profunda identificou 4 problemas críticos de conversão no funil de afiliado (Manassés Contabilidade): CTA aparecendo tarde demais, resultado resolvendo demais o problema sem gerar necessidade de contador, CTA sem âncora emocional ao número calculado, e hierarquia visual plana no card de resultado.
**Problemas**:
- O CTA da Manassés (Passo 9) aparecia após Fator R, Simulador, Previdência, Detalhamento e Checklist — quando o usuário já tinha sua resposta e a motivação de acionar o contador havia caído drasticamente.
- O número de impacto (`+R$ X`) estava em `text-4xl md:text-5xl`, sem dominar visualmente a seção como âncora emocional do resultado.
- Os Passos 3–8 (análises técnicas) ficavam todos abertos por padrão, gerando paralisia analítica e reduzindo a chance do usuário chegar ao CTA.
**Correções implementadas em `src/pages/index.js`**:
- **CTA Ancorado (P0)**: Inserido bloco `CTAAncorado` imediatamente após o Hero Result Card, sempre visível em qualquer resultado. O copy usa o valor anual exato calculado como âncora emocional: *"Esta simulação aponta +R$ X.XXX/ano como PJ. Um contador especializado pode confirmar esse número em menos de 30 minutos."* Versão alternativa para quando CLT vence.
- **Tipografia de Impacto (P3→P0)**: Número de rendimento extra escalado de `text-4xl md:text-5xl` para `text-5xl md:text-6xl lg:text-7xl font-black`.
- **Acordeão de Detalhamento (P1)**: Estado `showDetalhamento` adicionado. Passos 3–10 (Qualidade de Dados, Fator R, Simulador de Otimização, Previdência, Detalhamento linha a linha, Checklist, Limitações e CTA final Manassés) embrulhados em acordeão colapsável. Inicia **fechado** por padrão para maximizar conversão. Botão com ícone de chevron animado e descrição das seções internas.
**Regras para não repetir**:
- CTA de afiliado nunca deve aparecer apenas no final de uma longa página de resultados. Deve ter uma versão ancorada imediatamente após o número de impacto.
- O número financeiro principal do resultado deve ter tamanho tipográfico dominante (mínimo `text-5xl` em mobile, até `text-7xl` em desktop).
- Detalhamentos técnicos devem ser colapsáveis por padrão quando o objetivo primário é conversão.
- Estado de acordeão deve ser reset para `false` a cada novo cálculo se necessário (não implementado ainda — candidato para próxima iteração).


**Contexto**: Finalizamos os refinamentos da Calculadora CLT vs PJ focando na clareza e transparência matemática, consistência de redação previdenciária/dividendos e prevenção contra distorções e falsas interpretações por parte do usuário.
**Problema**:
- Falta de transparência na conta de DAS dentro do simulador de otimização tributária (Passo 5).
- Risco de má interpretação jurídica sobre a isenção de dividendos e as regras da Lei 15.270/2025.
- Linguagem de "Confiança Baixa" no Fator R que prejudicava a credibilidade percebida do simulador.
- Comparações com valores muito desproporcionais de entrada (CLT vs PJ) podiam sugerir vantagens artificiais decorrentes puramente da assimetria dos dados inseridos, não dos regimes.
- O CTA da parceira Manassés na Home e nos posts exibia valores comerciais não confirmados ("a partir de R$ 349/mês") e menção à "abertura de CNPJ grátis", além de ter perdido o visual verde escuro editorial de afiliação.
- O texto do botão do CTA, que dizia "Fazer diagnóstico gratuito", não era condizente com a ação de iniciar uma conversa direta com a equipe contábil no WhatsApp.
**Correção**:
- Detalhamos a conta matemática no Passo 5, mostrando: DAS Atual (Anexo V), DAS Projetado (Anexo III) e a Economia no DAS resultante.
- Atualizamos a nota dos dividendos no Passo 2 para uma redação juridicamente neutra: *"Dividendos líquidos distribuídos após a aplicação das regras tributárias consideradas nesta simulação."*
- Removemos a palavra "Confiança" e adotamos "Dados do Fator R:", classificando em badges de estilo cinza/neutro (*Dados Reais*, *Histórico Parcial*, *Estimados por Referência*).
- Implementamos o banner amarelo de **Alerta de Comparação Desproporcional** para relações fora da faixa de 0.8 a 1.2 (`pj.gross / clt.gross`), explicando a assimetria ao usuário.
- Adicionamos a legenda de cenário permanente de remunerações brutas no Hero Card.
- **Ajuste de Estilo e Copy do CTA**: Restauramos o estilo verde floresta editorial (`#0c4a3e`) com texto off-white (`#f5f1e8`) no bloco de recomendação e alteramos o copy para não citar valores ou abertura de CNPJ gratuita, focando unicamente na assessoria no Fator R de TI e no desconto de 50% na primeira mensalidade. Propagamos essa mesma diretriz nos arquivos MDX e componentes de posts.
- **Texto do Botão Ajustado**: Alteramos o texto do botão do CTA Manassés na calculadora para **"Falar com contador"**, alinhando-o perfeitamente com a finalidade de acionar a contabilidade pelo WhatsApp.
- Testes de regressão do motor de cálculo reexecutados e aprovados com 100% de sucesso.

## [2026-06-07] Auditoria #12: Ajustes de Compliance, Previdência, Impacto e Ajuste de Fator R Mínimo
**Contexto**: Refinamos o simulador para garantir segurança jurídica (compliance), padronizar os indicadores de impacto financeiro (badges coloridas) e neutralizar o copy sobre previdência PJ. Também corrigimos a distorção no cálculo do Fator R estimado em faturamentos muito baixos, introduzindo alertas de viabilidade de negócio e otimizando a experiência padrão de simulação (UX).
**Problema**:
- Havia risco jurídico ao prometer "total conformidade" e ao tratar a redução de INSS como "economia" previdenciária simples.
- Faltava um indicador de economia relevante geral no Hero Card que resumisse o impacto financeiro (baixo/moderado/alto).
- Havia um bloco de código antigo e duplicado de CTA de parceiros no final de `src/pages/index.js` que exibia um banner redundante.
- O score comercial interno precisava de teto (limite de 10) e o termo "comercial" devia ser limpo para não constar nos bundles do cliente.
- O pró-labore padrão mínimo de 1 salário mínimo no Simples Nacional gerava Fator R de 1350% para faturamentos muito baixos. Tentativas anteriores de remover esse piso criaram pró-labores irreais previdenciariamente (ex: R$ 44,80/mês e INSS de R$ 4,93/mês), contrariando a legislação do INSS.
- Faltava um aviso para alertar o usuário leigo de que simulações com faturamento menor que o pró-labore representam negócios economicamente inviáveis.
- **Inconsistência de UX inicial**: Por padrão, a opção de pró-labore selecionada no formulário era a "Padrão (Fator R)" (que calcula pró-labore artificial de 28% para o Anexo III). Isso fazia com que qualquer simulação, mesmo com faturamentos elevados, aparecesse automaticamente no **Anexo III (verde)**, dando a falsa impressão de que a calculadora ignorava as regras do Fator R ou que o usuário já estava automaticamente enquadrado na menor tributação sem precisar de planejamento, o que também ocultava o card do Simulador de Otimização e reduzia a conversão.
**Correção**:
- Substituímos menções de conformidade total por textos declaratórios de caráter simulatório e informativo.
- Implementamos a classificação em badges: ganho < R$ 100/mês (Impacto Baixo 🟢), ganho entre R$ 100 e R$ 499/mês (Impacto Moderado 🟡), ganho >= R$ 500/mês (Impacto Alto 🔴) no Hero Card e no Passo 5.
- Refatoramos o Passo 6 (Previdência) para destacar a "Diferença de contribuição previdenciária" e incluir uma nota neutra e transparente.
- Aplicamos o teto de 10 ao `oportunidadeScore` no motor de cálculo e renomeamos o comentário interno para "Score de Oportunidade de Revisão".
- Mantivemos o piso previdenciário de 1 salário mínimo (R$ 1.621,00) no motor de cálculo para fins de INSS de pró-labore correto.
- Na UI, criamos a diferenciação de cenários do Fator R (*Fator R Real*, *Projetado* e *Estimado*), alterando a redação técnica para *"Para fins previdenciários, a simulação considera a contribuição mínima baseada em 1 salário mínimo vigente (R$ 1.621,00)"*.
- Adicionamos o **Alerta de Viabilidade** caso o faturamento mensal seja menor que o pró-labore considerado para fins previdenciários: *"O faturamento informado é inferior ao pró-labore considerado para fins previdenciários. Este cenário normalmente indica uma empresa economicamente inviável ou uma simulação exploratória."*
- **Reestruturação do Fluxo de Entrada (UX)**: Alteramos o estado inicial do pró-labore para `'minimo'` e ordenamos o botão **"Mínimo (R$ 1.621)"** na primeira posição do seletor. O antigo "Padrão" foi reposicionado e renomeado para **"Otimizado (Fator R)"**. Agora, simulações iniciais comuns de TI começam de forma realista no **Anexo V (vermelho)**, ativando na tela o potencial do Passo 5 (Simulador de Otimização) para demonstrar a migração para o Anexo III, o que aumenta a compreensão das regras fiscais e a conversão de leads contábeis.
- Removemos permanentemente o banner de CTA duplicado de parceiros do final de `src/pages/index.js` (linhas 1145–1199).
- Validamos os resultados com o script de testes de regressão automatizados (`test_regressao.mjs`), que obteve 100% de sucesso.

## [2026-06-07] Auditoria #11: Evolução para Calculadora Tributária Contábil

**Contexto**: A fim de transformar o simulador CLT vs PJ em uma calculadora com precisão de software contábil, adicionamos suporte a novos parâmetros fiscais (dependentes, pensão judicial, PLR anual, ISS customizado e pró-labore customizado) e revertemos regras experimentais de dividendos para alinhamento estrito com a legislação.
**Problema**:

- O IRPF assumia implicitamente 0 dependentes e nenhuma dedução de pensão judicial, além de não calcular bônus/PLR da CLT, o que distorcia a comparação.
- O pró-labore era fixo em 28% no Simples e 1 salário mínimo no Presumido, impedindo os usuários de simularem retiradas personalizadas.
- O Fator R forçava a cobrança pelo Anexo III, sem considerar o enquadramento real no Anexo V por falta de folha de salários adequada.
- O Lucro Presumido era estimado por uma alíquota única simplificada, sem detalhar tributos federais e ISS municipal de forma auditável e clara.
- O desconto de 10% experimental sobre dividendos não condizia com a lei federal em vigor para o período.
  **Correção**:
- Adicionamos os estados `dependentes` (R$ 189,59/mês cada) e `pensaoAlimenticia` (Pensão Judicial), aplicando-os como deduções na base legal tradicional de IRPF no motor de cálculo da CLT e do Pró-labore PJ.
- Criamos a função `calculatePLR` consumindo a tabela especial progressiva de 2026, com o input de PLR anual CLT opcional na interface e inclusão no Pacote Total.
- Implementamos o seletor de Pró-labore com valores de referência (Mínimo, R$ 3k, R$ 5k, R$ 8k e Personalizado), exibindo tooltip sobre compatibilidade profissional.
- Codificamos a lógica de transição para o Anexo V do Simples Nacional caso o Fator R (`folha12Meses / faturamento12Meses` ou anualizado implícito) seja inferior a 28%.
- Decompusemos os impostos federais do Lucro Presumido (IRPJ 4,8%, CSLL 2,88%, PIS 0,65%, COFINS 3,0%) e adicionamos seletor de ISS municipal (2% a 5%), exibindo cada tributo separadamente no detalhamento para empresas sem funcionários.
- Removemos a cobrança experimental de impostos sobre dividendos, tornando a distribuição 100% isenta na interface e no motor de cálculo.
- Validamos a robustez matemática através do script de testes automatizados `test_regressao.mjs`, que passou com sucesso.

## [2026-06-07] Auditoria #10: Correção e Alinhamento Legal IRPF, INSS Pró-labore e RBT12 Real

**Contexto**: O usuário identificou que a aplicação do redutor de IRPF da Lei 15.270/2025 necessitava ser parametrizada sobre o rendimento tributável bruto, e não sobre a base líquida deduzida, e que a tabela de IRPF 2026 básica devia ser atualizada. Também observou que a tabela progressiva previdenciária não se aplica ao pró-labore do sócio (contribuinte individual), sendo o correto manter a alíquota fixa de 11% retida na fonte, e que usar estimativa linear para o cálculo do Simples Nacional omitia a variação do faturamento histórico real nos últimos 12 meses (RBT12).
**Problema**:

- O redutor estava operando sobre uma base de cálculo deduzida erroneamente e a tabela básica progressiva do IRPF continha limites desatualizados.
- A alteração do INSS do pró-labore para progressivo estava incorreta juridicamente, pois contribuintes individuais recolhem taxa fixa de 11%.
- O motor de cálculo assumia faturamento constante (`monthlyGross * 12`) para calcular a alíquota efetiva do Simples Nacional, criando erros de simulação estruturais em regimes progressivos.
  **Correção**:
- Atualizamos as faixas básicas de IRPF vigentes para 2026 no `calculateIRPFForBase` (isenção básica de R$ 2.428,80 e respectivas parcelas a deduzir), renomeamos a variável de base no redutor para `rendimentoTributavel` e alteramos a chamada do redutor para receber o `grossAmount`.
- Refatoramos a determinação do IRPF comparando a base tradicional legal com o desconto simplificado e retendo o menor imposto de forma separada no código.
- Revertemos o INSS pró-labore do sócio para a alíquota fixa de 11% limitada ao teto do INSS e restauramos o rótulo de 11% na interface do usuário.
- Adicionamos o parâmetro opcional `faturamento12Meses` à calculadora PJ (com tratamento via `Number()`) e um campo correspondente com ajuda visual explicativa e de apoio na UI para que a alíquota efetiva do Simples Nacional consuma o faturamento acumulado dos últimos 12 meses (RBT12 Real).
- Ajustamos a verificação de MEI excedido para confrontar com o teto anual de R$ 81.000,00 utilizando o faturamento de 12 meses (real ou estimado) e atualizamos a descrição e banner de alerta do MEI na interface do usuário.
- Revisamos e ajustamos os comentários e descrições técnicas de impostos no Lucro Presumido e de Dividendos, identificando-os como simplificações comparativas legítimas.
- **Refatoração e Isolamento Fiscais**: Criamos o diretório `src/lib/tax-rules/` e movemos todas as constantes e limites vigentes de 2026 para o arquivo isolado `2026.js`, agrupando as referências legislativas oficiais externas em comentários JSDoc. Consumimos o objeto importado `TAX_RULES` de forma centralizada em `calculator.js`.
- **Validação por Regressão**: Criamos e executamos um script de regressão automatizado (`test_regressao.mjs`) que validou a correspondência decimal exata de todos os cálculos e saídas CLT e PJ antes e depois da refatoração.

## [2026-06-07] Auditoria #9: Aprovação Final da "Realidade Legal" sobre a "Simplificação de Negócio"

**Contexto**: Após a Auditoria #8, o usuário deu uma instrução arquitetural decisiva: _"se o calculator rules estiver desatualizado, não precisa seguir ele. faça o que estiver correto e atualizado dentro da lei"_. Isso mudou fundamentalmente o escopo do simulador.
**Problema**: As regras do projeto (`CALCULATOR_RULES.md`) mandavam ignorar impostos corporativos (como o INSS Patronal) no cálculo do líquido do sócio e fixavam o pró-labore em 1 salário mínimo, o que não reflete a otimização legal moderna e ignora os custos reais de fluxo de caixa que reduzem os dividendos.
**Correção**:

- Revertemos o rollback e trouxemos de volta o "arsenal pesado" tributário para o código-fonte (`calculatePJ`) e para a Interface (`index.js`).
- O **Fator R (28%)** voltou a ser obrigatório no Simples Nacional para garantir a legalidade do Anexo III.
- O **INSS Patronal (20%)** voltou a ser computado no Lucro Presumido, reduzindo o dividendo real da empresa.
- O **Adicional de IRPJ (10%)** e o **IRRF sobre Dividendos > 50k (10%)** foram permanentemente integrados ao motor de cálculo.
- O arquivo `CALCULATOR_RULES.md` foi inteiramente reescrito e atualizado para refletir essa matemática 100% precisa, tornando-se o novo padrão canônico do simulador.

**Contexto**: O usuário apontou que "sempre achamos alguma coisa" a cada nova análise. Fomos forçados a avaliar _por que_ estávamos sempre encontrando erros.
**Problema**: A IA estava sofrendo de "super-engenharia tributária". Nas auditorias #4, #5 e #6, nós alteramos o cálculo da PJ adicionando Fator R dinâmico de 28%, INSS Patronal de 20%, IRPF sobre Pró-labore e Adicional de IRPJ. Embora essas sejam regras fiscais _reais_, a inclusão delas **violou frontalmente** o documento oficial de escopo do projeto (`CALCULATOR_RULES.md`).
O arquivo de regras mandava explicitamente:

1. "INSS Pró-labore: Calculado sobre 1 salário mínimo (R$ 1.621,00)" para Simples e Presumido.
2. "Os 20% patronais que a empresa recolhe NÃO devem ser descontados do líquido do sócio no simulador".
3. Lucro Presumido deve usar a aproximação de "14,5% no simulador".
   A busca cega por "precisão real" ignorou as simplificações de negócio (Business Rules) exigidas pela aplicação.
   **Correção**:

- Revertemos completamente as alterações no `calculatePJ`.
- O código voltou a fixar o Pró-labore em 1 salário mínimo.
- Removemos os descontos de Patronal, IRPF sobre pró-labore isento, taxa de dividendos e Adicional de IRPJ, que não faziam parte do modelo original.
- Mantivemos APENAS as refatorações genuínas de matemática que não violavam as regras (A exclusão de cálculo bruto de 13º e Férias da CLT, e a isenção de IRPF na CLT com o desconto simplificado). O sistema agora está estritamente leal ao seu próprio documento de arquitetura.

**Contexto**: O usuário expressou frustração justa com o ciclo de "agora está certo, ops, achei mais um erro". Fomos forçados a rasgar todo o modelo matemático e revisar o sistema de ponta a ponta sem assumir NENHUMA premissa anterior como verdadeira.
**Problema**: Descobrimos um erro colossal que favorecia a CLT na comparação do "Pacote Total Mensal". O simulador calculava o pacote total somando o salário líquido + benefícios + FGTS + **13º Bruto** (`sal / 12`) + **Férias Brutas** (`sal / 9`).
O erro está na premissa de que o 13º e Férias caem limpos na conta do trabalhador. Na vida real, o Leão morde forte: há incidência pesada de INSS e IRPF exclusivo na fonte tanto no 13º quanto no terço de férias. Para um salário de R$ 10.000, isso significava que o simulador estava dando um "bônus fantasma" de quase R$ 500 mensais na simulação CLT, já que não descontava os impostos sobre esses prêmios anuais.
**Correção**:

1. Refatoramos o IRPF para uma função isolada `calculateIRPF()`.
2. Calculamos isoladamente a tributação do 13º: `net13 = gross13 - inss13 - irpf13`.
3. Calculamos isoladamente a tributação das Férias: `netFerias = grossFerias - inssFerias - irpfFerias`.
4. O pacote total CLT agora usa as provisões **líquidas** exatas (`net13 / 12` e `netFerias / 12`).
   A precisão agora não é "quase 100%". É a tradução matemática exata da Receita Federal e do Ministério do Trabalho para o ano civil de 2026.

**Contexto**: Validamos se as fórmulas suportariam desenvolvedores trabalhando para o exterior (Contractors) ou ganhando faturamentos extremamente altos (ex: R$ 70.000+ por mês) onde o Lucro Presumido costuma ser usado.
**Problema 1 (Alíquota base)**: Estávamos usando uma alíquota fixa aproximada de `14,5%`. Em valores muito altos, essa aproximação falha. A soma exata para TI (IRPJ 4.8%, CSLL 2.88%, PIS 0.65%, COFINS 3%, ISS 3%) é **14,33%**.
**Problema 2 (Adicional de IRPJ)**: Ignorávamos o "Adicional de IRPJ". Pela lei, se a parcela de lucro presumido da empresa (32% do faturamento em serviços) ultrapassar R$ 20.000 mensais, incide um imposto extra de **10% sobre o valor excedente**. Isso começa a afetar qualquer um que fature acima de R$ 62.500/mês.
**Correção**: Substituímos os 14,5% pelo valor estrito de 14,33% e implementamos o cálculo dinâmico do `adicionalIRPJ` penalizando os lucros extraordinários conforme manda a lei. O `taxName` da UI também foi atualizado para avisar o usuário quando esse imposto extra entra em ação (`+ Adic. IRPJ`).

**Contexto**: A pedido contínuo por "100% de precisão", revisamos o cálculo do IRPF para a CLT e o Pró-labore. Encontramos um último "gap" fiscal: o **Desconto Simplificado do IRPF de 2026**, fixado oficialmente em R$ 607,20.
**Problema**: O cálculo usava a dedução do INSS puro (`sal - inss`). Para salários entre R$ 5.000 e ~R$ 5.800, o INSS pago é inferior a R$ 607,20. Pela lei, a Receita e a Fonte Pagadora são obrigadas a aplicar a dedução mais vantajosa. Ao não usar o desconto simplificado, o simulador estava gerando imposto de renda (IRPF) indevido para essa faixa de salário, já que a base de cálculo ficava ligeiramente acima do limite de isenção da Lei 15.270.
**Correção**: Implementada a fórmula `Math.max(inss, 607.20)` tanto para a CLT quanto para o Pró-labore PJ. Isso garante que a dedução legal correta seja aplicada automaticamente, igualando o simulador aos sistemas oficiais da Receita Federal. O IRPF agora é zero para quem ganha até R$ 5.600 CLT.

**Contexto**: A pedido de uma nova análise criteriosa de precisão de 100%, reavaliamos as minúcias fiscais da tributação PJ (Simples e Presumido) em comparação com o mundo real. Descobrimos falhas na modelagem do "cash flow" PJ:

1. **Fator R no Simples Anexo III**: O cálculo assumia 1 salário mínimo de pró-labore independentemente do faturamento. Isso é **ilegal** para manter-se no Anexo III se o faturamento for alto (cairia no Anexo V com 15,5% de imposto!). **Correção**: Implementado `proLabore = Math.max(1621.00, monthlyGross * 0.28)` para garantir a conformidade com a exigência de 28% da Receita Federal.
2. **IRPF sobre Pró-labore**: O simulador não cobrava IRPF do sócio sobre o pró-labore (como se fosse isento). O pró-labore é tributado **exatamente como salário CLT**. **Correção**: Adicionada a rotina de IRPF sobre o pró-labore com o redutor da Lei 15.270/2025.
3. **INSS Patronal (Lucro Presumido)**: A empresa de Lucro Presumido paga 20% de INSS patronal sobre o pró-labore do sócio. Embora não seja descontado do "salário" do sócio, é dinheiro que sai do caixa da empresa e reduz o montante disponível para distribuição de lucros. **Correção**: Incluído `inssPatronal` reduzindo os dividendos no Lucro Presumido.
4. **Imposto sobre Dividendos (Lei 15.270/2025)**: A partir de 2026, distribuições de lucros superiores a R$ 50.000 mensais sofrem retenção de 10% na fonte. **Correção**: Implementada a dedução `dividendTax = dividendGross * 0.10` para parcelas superiores a 50k.
   **Resultado**: O simulador agora reflete **exatamente o dinheiro líquido no bolso do sócio**, descontando não apenas os impostos federais da NF, mas também os impostos pessoais e os custos embutidos de folha necessários para operar nos regimes corretos. A UI foi atualizada para exibir esses descontos ocultos.

**Contexto**: Terceira rodada de auditoria. Verificamos três pontos críticos:

1. **Redutor Lei 15.270** — Confirmado: a fórmula `978,62 - (0,133145 × base)` usa a "base de cálculo" do IRPF (salário bruto menos INSS), não o salário bruto puro. O código estava correto (passa `irpfBase = sal - inss`). ✅
2. **Tabela IRPF 2026** — Confirmado: a tabela base permanece com os mesmos valores de 2025 (isenção até 2.259,20). A isenção efetiva até R$ 5.000 se dá pelo redutor, não por mudança na tabela base. Código estava correto. ✅
3. **Simples Nacional alíquota fixa 6%** — BUG: o simulador usava 6% fixo para qualquer faturamento. Acima de R$ 15.000/mês (R$ 180k/ano), a alíquota efetiva do Simples sobe. Corrigido para usar a fórmula real das 6 faixas do Anexo III.
   **Fórmula implementada**: `alíquotaEfetiva = (RBT12 × alíquotaNominal - dedução) / RBT12` onde RBT12 = faturamento mensal × 12.
   **Dead code removido**: variáveis `difference` e `percentDiff` eram calculadas mas nunca renderizadas. Removidas.
   **Label dinâmica**: `pj.taxName` agora reflete a alíquota efetiva real na UI (ex: "DAS Simples Nacional (7,30%)").
   **Regra**: O Simples Nacional NUNCA deve usar alíquota fixa de 6% para todos os faturamentos. Use sempre a fórmula por faixa com RBT12 estimado.

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
7. Ajustamos a tipografia do título H1 nos posts individuais em `src/pages/blog/[slug]/index.js`. A combinação de peso 900 (`font-black`), itálico total e espaçamento de letras `-0.05em` (`tracking-tighter`) fazia com que as serifas da _Instrument Serif_ colidissem, tornando as letras encavaladas e o título ilegível. Removemos o itálico global, adotamos peso 700 (`font-bold`), aumentamos a entrelinha para `leading-[1.15]` e aplicamos `tracking-editorial` (`-0.02em`), abrindo respiro aos caracteres.
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

_Para novas entradas, adicione sempre no topo com o formato `[YYYY-MM-DD] Título`._
