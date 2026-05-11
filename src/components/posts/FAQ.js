import { useState } from 'react';

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const items = [
    { q: 'Posso mudar de anexo no ano seguinte?', a: 'Sim. Você pode alterar o anexo em janeiro de cada ano, desde que a atividade exercida permita a opção pelo novo enquadramento.' },
    { q: 'E se meu Fator R variar durante o ano?', a: 'Use a média dos 12 meses anteriores para calcular o Fator R que valerá para o ano corrente. Revisões retroativas não são permitidas.' },
    { q: 'Tenho que comprovar o Fator R?', a: 'Sim. Mantenha os registros de folha de pagamento e faturamento mensais. Em caso de auditoria, esses documentos são obrigatórios.' },
    { q: 'E se eu errar o anexo?', a: 'Você pode retificar as apurações, mas estará sujeito a multas e juros sobre a diferença apurada. Consulte um contador antes de retificar.' },
  ];

  return (
    <div className="my-12 border-t border-rule">
      {items.map((item, i) => (
        <div key={i} className={`faq-item ${open === i ? 'faq-item--open' : ''}`}>
          <button 
            className="w-full flex items-center justify-between py-6 px-4 text-left hover:bg-paper-dark/20 transition-colors group" 
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span className="font-serif text-lg md:text-xl text-ink font-bold leading-tight group-hover:text-money transition-colors">
              {item.q}
            </span>
            <span className={`flex-shrink-0 ml-4 w-6 h-6 rounded-full border border-rule flex items-center justify-center font-mono text-xs transition-all duration-300 ${open === i ? 'bg-money text-paper border-money rotate-180' : 'text-ink-fade'}`}>
              {open === i ? '−' : '+'}
            </span>
          </button>
          <div className="faq-answer">
            <div className="pt-2 pb-8 text-ink-muted leading-relaxed text-base md:text-lg opacity-90">
              {item.a}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
