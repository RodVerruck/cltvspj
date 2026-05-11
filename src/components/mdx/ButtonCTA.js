import Link from 'next/link';

export default function ButtonCTA({ href = '/', text = 'Calcular agora', note }) {
  return (
    <div className="my-20">
      <div className="flex flex-col items-center">
        <Link
          href={href}
          className="btn-super-cta"
        >
          {text}
          <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 8h10M9 4l4 4-4 4" />
          </svg>
        </Link>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b6357]/60 text-center">
          {note || 'Gratuita · resultado em 30 segundos'}
        </p>
      </div>
    </div>
  );
}