# 🧮 Regras da Calculadora (Taxas e Impostos 2026)

Este documento mantém as regras de negócios e os parâmetros fiscais oficiais de 2026 usados na lógica do [calculator.js](file:///c:/Projetos/cltvspj/src/lib/calculator.js).

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

Desconto Simplificado do IRPF: R$ 607,20. O cálculo simula a dedução tradicional (INSS) vs simplificada e escolhe a mais vantajosa (menor IRPF).

Mecanismo do redutor da Lei 15.270/2025:
- **Faixa 1**: Isenção total se o rendimento bruto for de até R$ 5.000,00.
- **Faixa 2**: Redutor linear para rendimentos brutos entre R$ 5.000,01 e R$ 7.350,00. A redução é calculada como `R$ 978,62 - (0,133145 x rendimentos tributáveis brutos)`. Ela é subtraída do imposto devido apurado na tabela tradicional.
- **Faixa 3**: Acima de R$ 7.350,00 de rendimento bruto, não há redução adicional (aplica-se a tabela tradicional pura).
*(Lógica codificada em `calculateIRPF` e `aplicarRedutorLei15270`).*

## PJ (Vigente em 2026)

O salário mínimo de referência para 2026 é de **R$ 1.621,00**, influenciando as contribuições previdenciárias e o DAS MEI.

### 1. Simples Nacional (Anexo III)
- Alíquota base inicial: Calculada dinamicamente com base na RBT12 (Tabela Anexo III). O usuário pode fornecer o faturamento real acumulado dos últimos 12 meses; caso contrário, estima-se como `faturamentoMensal * 12`.
- **Fator R Obrigatório**: Para garantir enquadramento no Anexo III, o Pró-labore é forçado matematicamente para **28% do faturamento** (ou 1 salário mínimo, o que for maior).
- INSS Pró-labore: Alíquota de **11%** (cota retida do sócio contribuinte individual) sobre o Pró-labore calculado, limitada ao teto previdenciário.
- IRPF Pró-labore: Calculado sobre o pró-labore usando a tabela progressiva oficial e o Desconto Simplificado de R$ 607,20.
- **Cobrança Extra de ISS**: Se o faturamento anual (RBT12) ultrapassar R$ 3,6 milhões, o ISS (5%) é cobrado separadamente, fora do DAS.

### 2. MEI (Microempreendedor Individual)
- Teto de Faturamento Anual: **R$ 81.000,00**. A validação confronta esse limite com o faturamento anual real fornecido pelo usuário (RBT12) ou com a estimativa do faturamento mensal projetado (`faturamentoMensal * 12`) caso em branco.
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
- **Cota do Sócio**: **11%** sobre o pró-labore de referência. 
- **Cota Patronal (Empresa)**: **20%** sobre o pró-labore. Calculado como despesa que reduz o fluxo de caixa final de dividendos da empresa.
- **Tributação de Dividendos (Lei 15.270/2025)**: IRRF de **10%** aplicados sobre a **totalidade** do lucro distribuído (e não apenas sobre a parcela excedente) caso o valor mensal supere o limite de R$ 50.000,00 por CNPJ pagador (simplificação comparativa).

---
*Atualizado por IA em junho de 2026. Ajustes da Auditoria #10: redutor da Lei 15.270/2025 aplicado sobre o rendimento tributável bruto, tabela do IRPF de 2026 oficializada, INSS do pró-labore mantido em 11% conforme a legislação previdenciária e suporte a RBT12 real opcional na interface.*
