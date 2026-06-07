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
- Alíquota base inicial (via Fator R): **6%** sobre o faturamento total mensal.
- INSS Pró-labore: Calculado sobre 1 salário mínimo (R$ 1.621,00) com alíquota de **11%** (cota retida do sócio) = **R$ 178,31**.

### 2. MEI (Microempreendedor Individual)
- Teto de Faturamento Mensal Médio: **R$ 6.750,00** (anualizado em R$ 81.000,00).
- DAS MEI (Serviços): **R$ 86,05** fixos mensais (composto por 5% de INSS sobre salário mínimo de R$ 1.621,00 = R$ 81,05 + R$ 5,00 de ISS de serviço).
- INSS Pró-labore: Não há.

### 3. Lucro Presumido
- Impostos consolidados sobre faturamento: Alíquota média de **15,00%** (IRPJ, CSLL, PIS, COFINS e ISS municipal médio).
- INSS Pró-labore: Calculado sobre 1 salário mínimo (R$ 1.621,00) com alíquota de **31%** (11% retido do sócio + 20% patronal CPP) = **R$ 502,51**.

---
*Atualizado por IA em junho de 2026.*
