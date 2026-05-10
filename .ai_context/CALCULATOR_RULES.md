# 🧮 Regras da Calculadora (Taxas e Impostos)

Este documento mantém as regras de negócios usadas na lógica do `src/lib/calculator.js`.

## CLT

### 1. INSS (2026)*
Tabela progressiva (*valores estimados para validação*):
- Até R$ 1.518,00: 7,5%
- Até R$ 2.793,88: 9%
- Até R$ 4.190,83: 12%
- Até R$ 8.157,41 (Teto): 14%

### 2. IRPF (Lei 15.270/2025)
Mudança fundamental aplicada a partir de 2026:
- **Faixa 1**: Isenção total até R$ 5.000,00 de base de cálculo.
- **Faixa 2**: Redutor linear entre R$ 5.000,01 e R$ 7.350,00. A fórmula reduz gradativamente o desconto da tabela tradicional.
- **Faixa 3**: Acima de R$ 7.350,00, aplica-se a tabela tradicional sem redutor.
*(Lógica codificada na função `aplicarRedutorLei15270`).*

## PJ

### 1. Simples Nacional (Anexo III)
Usado como padrão de cálculo para serviços intelectuais (devs, consultores) assumindo o **Fator R** >= 28%:
- Alíquota base efetiva assumida na UI: **6%** sobre o faturamento total mensal.

### 2. Pró-Labore (INSS PJ)
- Obrigatório para o Fator R e contribuição previdenciária.
- Calculado sobre 1 salário mínimo (R$ 1.518,00) ou o faturamento (o que for menor).
- Alíquota retida na fonte: **11%** (quota do segurado).

---
*Atualizado por IA durante a refatoração do `index.js`.*
