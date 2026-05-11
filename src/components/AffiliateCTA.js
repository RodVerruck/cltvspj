export default function AffiliateCTA({
  partner,
  title,
  description,
  buttonText = 'Saiba mais',
  variant = 'default',
}) {
  const isCompact = variant === 'compact';

  return (
    <div className="editorial-breakout py-24 md:py-32 bg-[#0c4a3e] text-[#f5f1e8] border-y border-[rgba(245,241,232,0.1)] shadow-inner">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="max-w-4xl mx-auto px-6 md:px-8 relative z-10 text-center">
        <span className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#f5f1e8]/40 font-bold block mb-8">Recomendação Editorial</span>
        
        <h3 className={`font-display text-5xl md:text-6xl lg:text-7xl text-[#f5f1e8] font-black italic tracking-tighter leading-[0.95] mb-10 max-w-3xl mx-auto`}>
          {title}
        </h3>
        
        {!isCompact && description && (
          <p className="text-xl md:text-2xl text-[#f5f1e8]/70 leading-relaxed font-serif italic mx-auto max-w-2xl mb-12">
            {description}
          </p>
        )}
        
        <div className="flex flex-col items-center">
          <a
            href={`/go/${partner}`}
            rel="sponsored nofollow"
            className="inline-flex items-center justify-center gap-4 bg-[#f5f1e8] text-[#0c4a3e] px-12 py-6 font-display italic text-2xl md:text-3xl font-black rounded-xl transition-all duration-300 hover:scale-105 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-[#f5f1e8]/20 hover:bg-white w-full max-w-[480px]"
          >
            {buttonText}
            <span className="text-2xl ml-2">→</span>
          </a>
          
          {!isCompact && (
            <p className="text-[10px] uppercase font-mono tracking-[0.2em] text-[#f5f1e8]/30 mt-10 font-bold">
              Link de parceria. Não muda o preço pra você.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}