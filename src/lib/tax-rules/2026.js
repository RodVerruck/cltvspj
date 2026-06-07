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
    dependentDeduction: 189.59, // Dedução mensal por dependente em 2026
    faixas: {
      isencao: 2428.80,
      faixa2: { limit: 2826.65, rate: 0.075, deduction: 182.16 },
      faixa3: { limit: 3751.05, rate: 0.15, deduction: 394.16 },
      faixa4: { limit: 4664.68, rate: 0.225, deduction: 675.49 },
      faixa5: { rate: 0.275, deduction: 908.73 }
    }
  },

  // Tabela especial de tributação do PLR (Participação nos Lucros ou Resultados) de 2026
  plr: {
    bands: [
      { limit: 8214.40, rate: 0.00, deduction: 0.00 },
      { limit: 9922.28, rate: 0.075, deduction: 616.08 },
      { limit: 13167.00, rate: 0.15, deduction: 1360.25 },
      { limit: 16380.38, rate: 0.225, deduction: 2347.78 },
      { limit: Infinity, rate: 0.275, deduction: 3166.80 }
    ]
  },

  // Lei 15.270/2025 (Redutor de imposto)
  law15270: {
    exemptionLimit: 5000.00,
    reductionLimit: 7350.00,
    formula: {
      a: 978.62,
      b: 0.133145
    }
    // Dividendos são considerados 100% isentos sob regras vigentes
  },

  // Simples Nacional - TI e MEI
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
    anexo5Bands: [
      { limit: 180000, rate: 0.155, deduction: 0 },
      { limit: 360000, rate: 0.18, deduction: 4500 },
      { limit: 720000, rate: 0.195, deduction: 9900 },
      { limit: 1800000, rate: 0.205, deduction: 17100 },
      { limit: 3600000, rate: 0.23, deduction: 62100 },
      { limit: Infinity, rate: 0.305, deduction: 540000 }
    ],
    issSeparadoLimit: 3600000
  },

  // Lucro Presumido - TI (Composição de alíquotas separadas para auditoria)
  presumido: {
    irpjRate: 0.0480, // IRPJ: 4.8% (15% sobre presunção de 32%)
    csllRate: 0.0288, // CSLL: 2.88% (9% sobre presunção de 32%)
    pisRate: 0.0065,  // PIS: 0.65%
    cofinsRate: 0.0300, // COFINS: 3.00%
    defaultIssRate: 0.0300, // ISS padrão: 3.00%
    presumptionRate: 0.32, // Presunção de TI: 32%
    irpjAdditionalRate: 0.10, // Adicional de IRPJ: 10%
    irpjAdditionalLimit: 20000.00, // Parcela mensal de lucro presumido isenta de adicional
    inssPatronalRate: 0.20 // INSS Patronal de 20% sobre pró-labore
  }
};
