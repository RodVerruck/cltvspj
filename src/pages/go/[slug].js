import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

// Centraliza todos os links de afiliado.
// Atualizar os códigos de indicação/parceria aqui conforme forem aprovados.
const AFFILIATE_LINKS = {
  contabilizei: 'https://www.contabilizei.com.br/?indicacao=SUBSTITUIR_CODIGO',
  agilize: 'https://www.agilize.com.br/?parceiro=SUBSTITUIR_CODIGO',
  contasign: 'https://contasign.com.br/?ref=SUBSTITUIR_CODIGO',
  conube: 'https://conube.com.br/?ref=SUBSTITUIR_CODIGO',
  manasses: 'https://wa.me/5511942150872?text=Ol%C3%A1%20Anderson!%20Vim%20atrav%C3%A9s%20da%20calculadora%20CLT%20vs%20PJ%20e%20gostaria%20de%20tirar%20algumas%20d%C3%BAvidas%20sobre%20a%20abertura%20de%20CNPJ%20e%20contabilidade%20com%20o%20desconto%20de%20parceiro%20de%2050%25%20no%20primeiro%20m%C3%AAs.',
};

export default function Redirect() {
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (!slug) return;

    const targetUrl = AFFILIATE_LINKS[slug];

    if (!targetUrl) {
      router.replace('/');
      return;
    }

    // Dispara evento de tracking no Google Analytics (se configurado)
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'affiliate_click', {
        event_category: 'affiliate',
        event_label: slug,
        value: 1,
      });
    }

    // Redireciona após breve delay (100ms) pra garantir que o evento foi enviado
    const timeout = setTimeout(() => {
      window.location.href = targetUrl;
    }, 100);

    return () => clearTimeout(timeout);
  }, [slug, router]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Redirecionando…</p>
        </div>
      </div>
    </>
  );
}
