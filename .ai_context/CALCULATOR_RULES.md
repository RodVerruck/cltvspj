# 🧮 Regras da Calculadora (Taxas e Impostos 2026)

Este documento mantém as regras de negócios e os parâmetros fiscais oficiais de 2026 isolados em [2026.js](file:///c:/Projetos/cltvspj/src/lib/tax-rules/2026.js) e consumidos na lógica do [calculator.js](file:///c:/Projetos/cltvspj/src/lib/calculator.js).

## CLT

### 1. INSS (Vigente em 2026)
Tabela progressiva oficial (Portaria Interministerial MPS/MF nº 13/2026):
- Até R$ 1.621,00: 7,5%
- De R$ 1.621,01 até R$ 2.902,84: 9%
- De R$ 2.902,85 até R$ 4.354,27: 12%
- De R$ 4.354,28 até R$ 8.475,55 (Teto máximo): 14%

### 2. IRPF (Lei 15.270/2025 e Tabela 2026)
Tabela básica mensal progressiva de 2026 oficializada pela Receita Federal:
- Até R$ 2.428,80: Isento
- De R$ 2.428,81 até R$ 2.826,65: 7,5% (dedução R$ 182,16)
- De R$ 2.826,66 até R$ 3.751,05: 15,0% (dedução R$ 394,16)
- De R$ 3.751,06 até R$ 4.664,68: 22,5% (dedução R$ 675,49)
- Acima de R$ 4.664,68: 27,5% (dedução R$ 908,73)

**Deduções Legais de IRPF**:
- **INSS**: Cota retida do trabalhador.
- **Dependentes**: Dedução de **R$ 189,59** por dependente (vigente em 2026).
- **Pensão Alimentícia Judicial**: Deduzida da base de cálculo.

**Desconto Simplificado do IRPF**: R$ 607,20. O cálculo simula a dedução tradicional (INSS + dependentes + pensão) vs simplificada e escolhe a mais vantajosa (menor IRPF).

Mecanismo do redutor da Lei 15.270/2025:
- **Faixa 1**: Isenção total se o rendimento bruto for de até R$ 5.000,00.
- **Faixa 2**: Redutor linear para rendimentos brutos entre R$ 5.000,01 e R$ 7.350,00. A redução é calculada como `R$ 978,62 - (0,133145 x rendimentos tributáveis brutos)`. Ela é subtraída do imposto devido apurado na tabela tradicional.
- **Faixa 3**: Acima de R$ 7.350,00 de rendimento bruto, não há redução adicional (aplica-se a tabela tradicional pura).

### 3. PLR / Bônus Anual (Tributação Exclusiva)
A Participação nos Lucros ou Resultados segue uma tabela progressiva de tributação exclusiva na fonte:
- Até R$ 8.214,40: Isento
- De R$ 8.214,41 a R$ 9.922,28: 7,5% (dedução R$ 616,08)
- De R$ 9.922,29 a R$ 13.167,00: 15,0% (dedução R$ 1.360,25)
- De R$ 13.167,01 a R$ 16.380,38: 22,5% (dedução R$ 2.347,78)
- Acima de R$ 16.380,38: 27,5% (dedução R$ 3.166,80)

---

## PJ (Vigente em 2026)

O salário mínimo de referência para 2026 é de **R$ 1.621,00**, influenciando as contribuições previdenciárias e o DAS MEI.

### 1. Simples Nacional (Anexo III vs Anexo V)
- **Fator R**: Determinado pela relação entre a folha de pagamento (incluindo pró-labore e INSS patronal) e a receita bruta dos últimos 12 meses:
  - `fatorR = folha12Meses / receita12Meses` (ou baseado na anualização implícita do pró-labore e faturamento mensal).
  - Se `fatorR >= 0.28 (28%)`: A empresa enquadra-se no **Anexo III** (tributação inicia em 6,00%).
  - Se `fatorR < 0.28 (28%)`: A empresa enquadra-se no **Anexo V** (tributação inicia em 15,50%).
- **Tabela Anexo III**: Faixas de 6% a 33%.
- **Tabela Anexo V**: Faixas de 15,5% a 30,5%.
- **Configuração do Pró-labore**: O usuário pode parametrizar o pró-labore bruto como Mínimo (R$ 1.621,00), valores de mercado (R$ 3k, R$ 5k, R$ 8k) ou Personalizado. No modo padrão, o pró-labore é forçado para 28% do faturamento a fim de simular o Fator R ideal do Anexo III.
- **INSS Pró-labore**: Alíquota de **11%** (contribuinte individual) limitada ao teto do INSS.
- **IRPF Pró-labore**: Tributado normalmente com as deduções de dependentes e pensão judicial pessoal.
- **Cobrança Extra de ISS**: Se o faturamento anual (RBT12) ultrapassar R$ 3,6 milhões, o ISS (5%) é cobrado fora do DAS.

### 2. MEI (Microempreendedor Individual)
- Teto de Faturamento Anual: **R$ 81.000,00**.
- DAS MEI (Serviços): **R$ 86,05** fixos mensais (5% do SM = R$ 81,05 + R$ 5,00 de ISS).
- INSS Pró-labore: Não há.

### 3. Lucro Presumido
A tributação é calculada individualmente por componente e somada (com base de presunção de 32% para serviços de TI):
- **IRPJ**: 32% (presunção) × 15% = **4,80%** sobre faturamento.
- **CSLL**: 32% (presunção) × 9% = **2,88%** sobre faturamento.
- **PIS**: **0,65%** (cumulativo).
- **COFINS**: **3,00%** (cumulativo).
- **ISS**: **2,00% a 5,00%** (configurável pelo usuário na interface de acordo com a alíquota municipal).
- **Adicional de IRPJ**: **10%** sobre a parcela do lucro presumido (32% do faturamento) que exceder R$ 20.000,00 por mês.
- **INSS Patronal (Empresa)**: **20%** sobre o pró-labore de referência, saindo do caixa corporativo e reduzindo dividendos.
- **Premissa de Equipe**: O cálculo simula a tributação para empresas **sem funcionários** (não incidindo encargos como RAT, Terceiros/Sistema S e INSS patronal sobre salários).

### 4. Distribuição de Dividendos
- Considerada **100% isenta** de imposto de renda sob as regras vigentes do ano civil.
