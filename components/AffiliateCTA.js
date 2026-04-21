export default function AffiliateCTA({
  partner,
  title,
  description,
  buttonText = 'Saiba mais',
  variant = 'default',
}) {
  const isCompact = variant === 'compact';

  return (
    <section className="band-breakout band-cta">
      <div className="band-inner cta-grid">
        <div>
          <span className="cta-label">Recomendação Editorial</span>
          <h4 className={`cta-title ${isCompact ? 'text-xl' : ''}`}>
            {title}
          </h4>
          {!isCompact && description && (
            <p className="cta-desc">
              {description}
            </p>
          )}
        </div>
        <div className="cta-action">
          <a
            href={`/go/${partner}`}
            rel="sponsored nofollow"
            className="cta-button"
          >
            {buttonText}
            <span>→</span>
          </a>
          {!isCompact && (
            <p className="cta-note">
              Link de parceria. Não muda o preço pra você.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}