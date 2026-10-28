import { SITE_URL } from '../config';

/**
 * Schema.org JSON-LD para a calculadora CLT x PJ (home).
 * Tipos: WebPage + WebApplication + Organization.
 * @see https://schema.org/WebApplication
 */
export function getCalculatorSchemaJsonLd() {
  const pageUrl = SITE_URL;
  const pageName = 'Calculadora CLT vs PJ 2026: Compare Salário Líquido e Benefícios';
  const pageDescription =
    'Simule e compare o salário líquido entre CLT e PJ em 2026 com todos os impostos (INSS, IRPF, Simples Nacional), benefícios e custos de contador.';

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${pageUrl}/#organization`,
        name: 'CLT ou PJ',
        url: pageUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${pageUrl}/og-image.png`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${pageUrl}/#website`,
        url: pageUrl,
        name: 'CLT ou PJ',
        description: pageDescription,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${pageUrl}/#organization` },
      },
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}/#webpage`,
        url: pageUrl,
        name: pageName,
        description: pageDescription,
        inLanguage: 'pt-BR',
        isPartOf: { '@id': `${pageUrl}/#website` },
        about: { '@id': `${pageUrl}/#calculator` },
        mainEntity: { '@id': `${pageUrl}/#calculator` },
      },
      {
        '@type': 'WebApplication',
        '@id': `${pageUrl}/#calculator`,
        name: 'Calculadora CLT x PJ 2026',
        url: pageUrl,
        description: pageDescription,
        applicationCategory: 'FinanceApplication',
        applicationSubCategory: 'TaxCalculator',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        softwareVersion: '2026',
        inLanguage: 'pt-BR',
        isAccessibleForFree: true,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'BRL',
          availability: 'https://schema.org/InStock',
        },
        featureList: [
          'Comparação de salário líquido CLT vs PJ',
          'Cálculo de INSS, IRPF e FGTS para CLT',
          'Simulação MEI, Simples Nacional e Lucro Presumido',
          'Análise de Fator R e enquadramento de anexo',
          'Benefícios, PLR, dependentes e pensão alimentícia',
        ],
        author: { '@id': `${pageUrl}/#organization` },
        publisher: { '@id': `${pageUrl}/#organization` },
        mainEntityOfPage: { '@id': `${pageUrl}/#webpage` },
      },
    ],
  };
}
