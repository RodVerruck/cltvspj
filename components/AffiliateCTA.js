/**
 * Componente de CTA de afiliado reutilizável.
 * Usar dentro de posts MDX e em seções do site.
 *
 * Uso em MDX:
 *   <AffiliateCTA
 *     partner="contabilizei"
 *     title="Precisa de contador pra virar PJ?"
 *     description="A Contabilizei cuida de abertura de CNPJ, impostos e DAS. Plano a partir de R$ 89/mês."
 *     buttonText="Conhecer a Contabilizei"
 *   />
 */
export default function AffiliateCTA({
  partner,
  title,
  description,
  buttonText = 'Saiba mais',
  variant = 'default', // 'default' | 'compact'
}) {
  const isCompact = variant === 'compact';

  return (
    <div
      className={`
        my-6 rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50
        ${isCompact ? 'p-4' : 'p-6'}
      `}
    >
      <div className={isCompact ? 'flex items-center gap-4' : ''}>
        <div className="flex-1">
          <h4 className={`font-bold text-blue-900 ${isCompact ? 'text-base' : 'text-lg'}`}>
            {title}
          </h4>
          {!isCompact && description && (
            <p className="mt-2 text-sm text-blue-800">{description}</p>
          )}
        </div>
        <div className={isCompact ? '' : 'mt-4'}>
          <a
            href={`/go/${partner}`}
            rel="sponsored nofollow"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-sm transition-colors whitespace-nowrap"
          >
            {buttonText}
            <span>→</span>
          </a>
        </div>
      </div>
      {!isCompact && (
        <p className="text-xs text-blue-600 mt-3 opacity-80">
          Link de parceria. Não muda o preço pra você.
        </p>
      )}
    </div>
  );
}
