export default function AffiliateCTA({
  partner,
  title,
  description,
  buttonText = 'Saiba mais',
  variant = 'default',
}) {
  const isCompact = variant === 'compact';

  return (
    <div className="bg-money text-paper p-8 md:p-10 rounded-lg my-12 relative overflow-hidden">
      <div className="flex-1">
        <span className="font-mono text-xs text-paper/60 uppercase tracking-widest mb-4 block">
          Recomendação Editorial
        </span>
        <h4 className={`font-display text-paper leading-tight ${isCompact ? 'text-xl' : 'text-3xl md:text-4xl'} mb-4`}>
          {title}
        </h4>
        {!isCompact && description && (
          <p className="text-paper/80 text-[15px] leading-relaxed mb-8 max-w-2xl">
            {description}
          </p>
        )}
      </div>
      <div>
        <a
          href={`/go/${partner}`}
          rel="sponsored nofollow"
          className="bg-paper text-money px-6 py-3.5 font-medium rounded transition-transform hover:-translate-y-px inline-flex items-center gap-2"
        >
          {buttonText}
          <span>→</span>
        </a>
      </div>
      {!isCompact && (
        <p className="text-[11px] text-paper/50 mt-4 italic">
          Link de parceria. Não muda o preço pra você.
        </p>
      )}
    </div>
  );
}