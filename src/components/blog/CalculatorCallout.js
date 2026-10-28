import Link from 'next/link';
import { Calculator, ArrowRight } from 'lucide-react';

export default function CalculatorCallout({
  title = "Quer comparar uma proposta diferente?",
  description = "Use a calculadora CLT vs PJ para simular seus números reais com salário bruto, benefícios, dependentes e faturamento PJ.",
  buttonText = "Simular na Calculadora",
  href = "/",
}) {
  return (
    <aside className="my-10 p-6 md:p-8 rounded-lg border border-rule bg-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 not-prose">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 font-mono text-[11px] uppercase tracking-wider text-money font-semibold">
          <Calculator className="w-4 h-4 text-money" aria-hidden="true" />
          <span>Simulador CLT vs PJ</span>
        </div>
        <h4 className="font-display text-xl md:text-2xl font-bold text-ink mb-1">{title}</h4>
        <p className="text-sm md:text-base text-ink-muted leading-relaxed">{description}</p>
      </div>
      <Link
        href={href}
        className="btn-primary inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium"
      >
        <span>{buttonText}</span>
        <ArrowRight className="w-4 h-4" aria-hidden="true" />
      </Link>
    </aside>
  );
}
