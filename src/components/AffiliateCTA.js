import { ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AffiliateCTA({
  partner = 'manasses',
  title = 'Quer validar esse número com contador?',
  description,
  buttonText = 'Falar com Especialista',
  variant = 'default',
}) {
  const isCompact = variant === 'compact';

  return (
    <article className="editorial-breakout my-12 md:my-16 rounded-2xl bg-white border-2 border-money/25 p-6 sm:p-8 md:p-10 shadow-[0_12px_40px_-15px_rgba(12,74,62,0.12)] relative overflow-hidden text-left font-sans not-prose">
      {/* Faixa decorativa superior esmeralda */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-money via-[#146b5a] to-money" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 relative z-10">
        <div className="max-w-2xl">
          {/* Header com Selos de Confiança */}
          <div className="flex items-center gap-2.5 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-money font-bold bg-money/10 px-2.5 py-1 rounded">
              <ShieldCheck className="w-3.5 h-3.5 text-money flex-shrink-0" />
              Recomendação Editorial · Parceria Oficial
            </span>
            <span className="inline-flex items-center font-mono text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded shadow-sm">
              🎁 50% OFF na 1ª Mensalidade
            </span>
          </div>

          {/* Título Principal */}
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-ink !mt-0 !mb-3 tracking-tight leading-tight">
            {title}
          </h3>

          {/* Descrição em Sans-Serif legível */}
          {description && (
            <p className="text-sm md:text-base text-ink-muted leading-relaxed font-sans !mt-0 !mb-5 max-w-2xl">
              {description}
            </p>
          )}

          {/* 3 Benefícios Escaneáveis com Checks */}
          {!isCompact && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-sans text-ink">
              <div className="flex items-center gap-2 bg-paper/70 border border-rule/60 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                <span className="font-medium">Especialista TI & Fator R</span>
              </div>
              <div className="flex items-center gap-2 bg-paper/70 border border-rule/60 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                <span className="font-medium">Abertura ou Migração</span>
              </div>
              <div className="flex items-center gap-2 bg-paper/70 border border-rule/60 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                <span className="font-medium">Direto no WhatsApp</span>
              </div>
            </div>
          )}
        </div>

        {/* Coluna de Ação */}
        <div className="flex flex-col items-stretch sm:items-center lg:items-end gap-2 flex-shrink-0 lg:border-l lg:border-rule/60 lg:pl-8">
          <a
            href={`/go/${partner}`}
            rel="sponsored nofollow"
            className="group inline-flex items-center justify-center gap-2.5 bg-money hover:bg-[#0a3d33] text-white px-8 py-3.5 sm:py-4 rounded-xl font-sans font-bold text-base transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg text-center w-full sm:w-auto"
          >
            <span>{buttonText}</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <span className="text-[11px] font-sans text-ink-fade text-center lg:text-right">
            Atendimento rápido · Link de parceria oficial
          </span>
        </div>
      </div>
    </article>
  );
}
