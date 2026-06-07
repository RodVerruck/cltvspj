/**
 * Parâmetros e Regras Fiscais Vigentes para o Ano-Calendário de 2026
 * 
 * Fontes Oficiais:
 * - Salário Mínimo 2026: Portaria Interministerial MPS/MF nº 13/2026
 * - INSS CLT: https://www.gov.br/inss/pt-br/assuntos/tabela-de-contribuicao-mensal
 * - IRPF 2026: https://www.gov.br/receitafederal/pt-br/assuntos/tabela-progressiva-mensal-irpf-2026
 * - Lei nº 15.270/2025 (Redutor IRPF e Dividendos): Legislação Federal (Planalto) - Lei nº 15.270/2025
 * - Simples Nacional (Anexo III) e MEI: Portal do Simples Nacional - Lei Complementar nº 123/2006
 * - Lucro Presumido: Regulamento do Imposto de Renda (RIR/2018)
 */

export const TAX_RULES_2026 = {
  // Salário Mínimo de Referência em 2026
  salaryMinimum: 1621.00,

  // INSS (Tabela de contribuição do segurado empregado, empregado doméstico e trabalhador avulso)
  inss: {
    ceiling: 8475.55,
    bands: [
      { limit: 1621.00, rate: 0.075 },
      { limit: 2902.84, rate: 0.09 },
      { limit: 4354.27, rate: 0.12 },
      { limit: 8475.55, rate: 0.14 }
    ]
  },

  // IRPF (Tabela básica mensal progressiva de 2026)
  irpf: {
    simplifiedDeduction: 607.20,
    faixas: {
      isencao: 2428.80,
      faixa2: { limit: 2826.65, rate: 0.075, deduction: 182.16 },
      faixa3: { limit: 3751.05, rate: 0.15, deduction: 394.16 },
      faixa4: { limit: 4664.68, rate: 0.225, deduction: 675.49 },
      faixa5: { rate: 0.275, deduction: 908.73 }
    }
  },

  // Lei 15.270/2025 (Redutor de imposto e dividendos)
  law15270: {
    exemptionLimit: 5000.00,
    reductionLimit: 7350.00,
    formula: {
      a: 978.62,
      b: 0.133145
    },
    dividendTaxRate: 0.10,
    dividendTaxLimit: 50000.00
  },

  // Simples Nacional - TI (Anexo III) e MEI
  simples: {
    meiTetoAnual: 81000.00,
    meiDasMensal: 86.05, // DAS MEI para prestador de serviços em 2026 (5% do SM + ISS R$ 5,00)
    anexo3Bands: [
      { limit: 180000, rate: 0.06, deduction: 0 },
      { limit: 360000, rate: 0.112, deduction: 9360 },
      { limit: 720000, rate: 0.135, deduction: 17640 },
      { limit: 1800000, rate: 0.16, deduction: 35640 },
      { limit: 3600000, rate: 0.21, deduction: 125640 },
      { limit: Infinity, rate: 0.33, deduction: 648000 }
    ],
    issSeparadoLimit: 3600000
  },

  // Lucro Presumido - TI
  presumido: {
    taxConsolidatedRate: 0.1433, // Carga base aproximada (IRPJ 4.8% + CSLL 2.88% + PIS 0.65% + COFINS 3% + ISS 3%)
    presumptionRate: 0.32, // Presunção de TI: 32%
    irpjAdditionalRate: 0.10, // Adicional de IRPJ: 10%
    irpjAdditionalLimit: 20000.00, // Parcela mensal de lucro presumido isenta de adicional
    inssPatronalRate: 0.20 // INSS Patronal de 20% sobre pró-labore
  }
};
