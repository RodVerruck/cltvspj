# 🧮 Regras da Calculadora (Taxas e Impostos 2026)

Este documento mantém as regras de negócios e os parâmetros fiscais oficiais de 2026 usados na lógica do [calculator.js](file:///c:/Projetos/cltvspj/src/lib/calculator.js).

## CLT

### 1. INSS (Vigente em 2026)
Tabela progressiva oficial (Portaria Interministerial MPS/MF nº 13/2026):
- Até R$ 1.621,00: 7,5%
- De R$ 1.621,01 até R$ 2.902,84: 9%
- De R$ 2.902,85 até R$ 4.354,27: 12%
- De R$ 4.354,28 até R$ 8.475,55 (Teto máximo): 14%

### 2. IRPF (Lei 15.270/2025)
Mudança fundamental aplicada a partir de 2026:
- **Faixa 1**: Isenção total até R$ 5.000,00 de base de cálculo.
- **Faixa 2**: Redutor linear entre R$ 5.000,01 e R$ 7.350,00. A fórmula reduz gradativamente o desconto da tabela tradicional.
- **Faixa 3**: Acima de R$ 7.350,00, aplica-se a tabela tradicional sem redutor.
*(Lógica codificada na função `aplicarRedutorLei15270`).*

## PJ (Vigente em 2026)

O salário mínimo de referência para 2026 é de **R$ 1.621,00**, influenciando as contribuições previdenciárias e o DAS MEI.

### 1. Simples Nacional (Anexo III)
- Alíquota base inicial: Calculada dinamicamente com base na RBT12 (Tabela Anexo III).
- **Fator R Obrigatório**: Para garantir enquadramento no Anexo III, o Pró-labore é forçado matematicamente para **28% do faturamento** (ou 1 salário mínimo, o que for maior).
- INSS Pró-labore: Alíquota de **11%** (cota retida do sócio) sobre o Pró-labore calculado.
- IRPF Pró-labore: Calculado sobre o pró-labore usando a tabela progressiva oficial e o Desconto Simplificado de R$ 607,20.
- **Cobrança Extra de ISS**: Se o faturamento anual (RBT12) ultrapassar R$ 3,6 milhões, o ISS (5%) é cobrado separadamente, fora do DAS.

### 2. MEI (Microempreendedor Individual)
- Teto de Faturamento Mensal Médio: **R$ 6.750,00** (anualizado em R$ 81.000,00).
- DAS MEI (Serviços): **R$ 86,05** fixos mensais (composto por 5% de INSS sobre salário mínimo de R$ 1.621,00 = R$ 81,05 + R$ 5,00 de ISS de serviço).
- INSS Pró-labore: Não há.

### 3. Lucro Presumido
Impostos por componente (base de presunção 32% para serviços de TI):
- **IRPJ**: 32% (presunção) × 15% = **4,80%** sobre a receita bruta
- **CSLL**: 32% (presunção) × 9% = **2,88%** sobre a receita bruta
- **PIS**: **0,65%** sobre a receita bruta (cumulativo)
- **COFINS**: **3,00%** sobre a receita bruta (cumulativo)
- **ISS**: **3,00%** sobre a receita bruta (média municipal para TI)
- **Base consolidada exata**: **14,33%**
- **Adicional de IRPJ**: **10%** sobre a parcela do lucro presumido (32% do faturamento) que exceder R$ 20.000,00 por mês.

INSS Pró-labore do sócio-administrador (fixado em 1 SM, R$ 1.621,00 para este regime):
- **Cota do Sócio**: **11%** 
- **Cota Patronal (Empresa)**: **20%** sobre o pró-labore. Calculado como despesa que reduz o fluxo de caixa final de dividendos da empresa.
- **Tributação de Dividendos (Lei 15.270/2025)**: IRRF de **10%** caso o valor líquido distribuído como dividendo (após impostos e pró-labore) ultrapasse R$ 50.000,00 no mês.

---
*Atualizado por IA em junho de 2026. Erro crítico corrigido: alíquota de INSS pró-labore do Lucro Presumido foi erroneamente calculada como 31% em versão anterior. O correto é 11% (apenas cota retida do sócio).*
