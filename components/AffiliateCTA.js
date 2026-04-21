export default function AffiliateCTA({
  partner,
  title,
  description,
  buttonText = 'Saiba mais',
  variant = 'default',
}) {
  const isCompact = variant === 'compact';

  return (
    <section className="align-full bg-money text-paper py-20 px-6 my-16">
      <div className="max-w-[1120px] mx-auto grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12 items-center">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-paper/60 mb-4 block">
            Recomendação Editorial
          </span>
          <h4 className={`font-display leading-[1.05] tracking-[-0.01em] mb-4 ${isCompact ? 'text-xl' : 'text-4xl'}`}>
            {title}
          </h4>
          {!isCompact && description && (
            <p className="text-paper/80 text-[15px] leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
        <div className="md:border-l border-paper/20 md:pl-10 flex flex-col items-start">
          <a
            href={`/go/${partner}`}
            rel="sponsored nofollow"
            className="bg-paper text-money px-6 py-3.5 rounded font-medium transition-transform hover:-translate-y-px inline-flex items-center gap-2 mb-4"
          >
            {buttonText}
            <span>→</span>
          </a>
          {!isCompact && (
            <p className="text-[11px] text-paper/50 italic">
              Link de parceria. Não muda o preço pra você.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}