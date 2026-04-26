export default function AffiliateCTA({
  partner,
  title,
  description,
  buttonText = 'Saiba mais',
  variant = 'default',
}) {
  const isCompact = variant === 'compact';

  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-16 bg-money text-paper">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.15em] text-paper/50 block mb-3">Recomendação Editorial</span>
            <h3 className={`font-display text-2xl md:text-3xl text-paper leading-tight mb-3 ${isCompact ? 'text-xl' : ''}`}>
              {title}
            </h3>
            {!isCompact && description && (
              <p className="text-paper/75 leading-relaxed max-w-prose">
                {description}
              </p>
            )}
          </div>
          <div className="text-center md:text-left">
            <a
              href={`/go/${partner}`}
              rel="sponsored nofollow"
              className="inline-flex items-center gap-2 bg-paper text-money px-6 py-3 font-mono text-xs uppercase tracking-[0.1em] font-medium rounded transition-transform hover:translate-y-[-2px] mb-3"
            >
              {buttonText}
              <span>→</span>
            </a>
            {!isCompact && (
              <p className="text-xs text-paper/40 italic">
                Link de parceria. Não muda o preço pra você.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}