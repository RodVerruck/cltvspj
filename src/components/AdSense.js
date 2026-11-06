import { useEffect } from 'react';

export default function AdSense({ slot, format = 'auto', responsive = true }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        // Carrega o script sob demanda apenas quando um bloco de anúncio existir na tela
        if (!document.querySelector('script[src*="adsbygoogle.js"]')) {
          const script = document.createElement('script');
          script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2888261288759622';
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-2888261288759622"
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive.toString()}
    />
  );
}
