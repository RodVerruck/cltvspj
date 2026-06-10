import { useEffect, useState } from 'react'
import '../styles/globals.css'
import '../styles/blog.css'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
  const [shouldTrack, setShouldTrack] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Verifica se está rodando localmente na sua máquina (desenvolvimento)
      const isLocal = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1' ||
                      window.location.hostname.startsWith('192.168.');
      
      // 2. Intercepta o parâmetro secreto de ativação pela URL (ex: ?admin=true)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true') {
        localStorage.setItem('disable_analytics', 'true');
        // Limpa o parâmetro da URL de forma elegante na barra de endereço
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
      }
      
      // 3. Verifica se existe o registro permanente no localStorage
      const isExcluded = localStorage.getItem('disable_analytics') === 'true';
      
      // Só rastreia se não for local E não estiver marcado para exclusão
      setShouldTrack(!isLocal && !isExcluded);
    }
  }, []);

  return (
    <>
      {shouldTrack && GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}
      {shouldTrack && CLARITY_ID && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window,document,"clarity","script","${CLARITY_ID}");
          `}
        </Script>
      )}
      <Component {...pageProps} />
    </>
  )
}