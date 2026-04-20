export default function AffiliateCTA({
  partner,
  title,
  description,
  buttonText = 'Saiba mais',
  variant = 'default',
}) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`
        my-8 border-l-4 border-money bg-paper-dark px-6 py-5
        ${isCompact ? 'flex items-center gap-6' : ''}
      `}
    >
      <div className="flex-1">
        <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-ink-muted mb-2">
          Recomendação editorial
        </div>
        <h4 className={`font-display text-ink leading-tight ${isCompact ? 'text-xl' : 'text-2xl'} mb-2`}>
          {title}
        </h4>
        {!isCompact && description && (
          <p className="text-sm text-ink-muted leading-relaxed mb-4 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      <div className={isCompact ? 'flex-shrink-0' : ''}>
        <a
          href={`/go/${partner}`}
          rel="sponsored nofollow"
          className="inline-flex items-center gap-2 bg-ink hover:bg-money text-paper px-5 py-2.5 rounded text-sm font-medium transition-colors whitespace-nowrap"
        >
          {buttonText}
          <span>×</span>
        </a>
      </div>
      {!isCompact && (
        <p className="text-[11px] text-ink-fade mt-3 italic">
          Link de parceria. Não muda o preço pra você.
        </p>
      )}
    </div>
  );
}
