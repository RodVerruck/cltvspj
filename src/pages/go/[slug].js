import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';

// Centraliza todos os links de afiliado.
// Parceria ativa: Manassés Contabilidade (Anderson Moreira)
// Link de afiliado oficial recebido em junho/2026
const AFFILIATE_LINKS = {
  manasses: 'https://manassescontabilidade.com.br/orcamento/?ref=e150bfec6701708e9e17fdc38a6fc261',
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
