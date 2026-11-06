import Link from 'next/link';
import { ArrowRight, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import AffiliateCTA from '../AffiliateCTA';
import CalculatorCallout from '../blog/CalculatorCallout';
import { formatBRL, formatBRLShort } from '../../lib/comparativo/format';

export default function ComparativoBody({ scenario }) {
  const {
    cltGross,
    pjMonthlyGross,
    pjRate,
    hoursPerMonth,
    clt,
    pj,
    diffMonthly,
    diffAnnual,
    winner,
    contextNotes,
    richContent,
    related,
    breakEven,
  } = scenario;

  const winnerLabel = winner === 'pj' ? 'PJ' : 'CLT';
  const winnerColor = winner === 'pj' ? 'text-money' : 'text-hot';

  return (
    <>
      {/* 1. HERO RESULT CARD + PONTO DE EQUILÍBRIO */}
      <div className="editorial-breakout mb-8 p-8 md:p-10 rounded-xl border border-rule bg-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rule">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-money font-bold block mb-2">
              Resultado da simulação
            </span>
            <p className={`font-display text-4xl md:text-5xl font-bold mb-2 ${winnerColor}`}>
              {winnerLabel} leva vantagem
            </p>
            <p className="text-ink-muted text-base md:text-lg">
              Diferença de <strong className="text-ink">R$ {formatBRL(Math.abs(diffMonthly))}/mês</strong>
              {' '}(R$ {formatBRL(Math.abs(diffAnnual))}/ano) em relação ao pacote CLT completo.
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link href="/" className="btn-primary inline-flex items-center gap-2">
              Ajustar na calculadora completa
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        {/* Ponto de Equilíbrio PJ (Break-even) */}
        {breakEven && (
          <div className="mt-6 pt-2">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-money w-4 h-4" />
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-bold">
                Ponto de Equilíbrio PJ (Break-Even)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs">
              <div className="bg-paper/40 border border-rule/60 rounded-lg p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-1">
                  Faturamento PJ Mínimo
                </span>
                <span className="font-display text-2xl font-bold text-ink block">
                  R$ {formatBRL(breakEven.monthlyGross)}<span className="text-xs font-sans text-ink-muted font-normal">/mês</span>
                </span>
                <span className="text-[11px] text-ink-fade mt-1 block leading-tight">
                  Valor bruto para empatar com o pacote CLT de R$ {formatBRL(clt.totalPackage)}
                </span>
              </div>

              <div className="bg-paper/40 border border-rule/60 rounded-lg p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-1">
                  Valor Hora PJ Mínimo
                </span>
                <span className="font-display text-2xl font-bold text-ink block">
                  R$ {formatBRL(breakEven.hourlyRate)}<span className="text-xs font-sans text-ink-muted font-normal">/h</span>
                </span>
                <span className="text-[11px] text-ink-fade mt-1 block leading-tight">
                  Considerando {hoursPerMonth} horas trabalhadas no mês
                </span>
              </div>

              <div className="bg-paper/40 border border-rule/60 rounded-lg p-4">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block mb-1">
                  Multiplicador Recomendado
                </span>
                <span className="font-display text-2xl font-bold text-money block">
                  {breakEven.multiplier}x <span className="text-xs font-sans text-ink-muted font-normal">do salário CLT</span>
                </span>
                <span className="text-[11px] text-ink-fade mt-1 block leading-tight">
                  Fator mínimo para compensar FGTS, férias remuneradas e 13º
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. CTA ANCORADO DA MANASSÉS NO TOPO — DESIGN EDITORIAL PREMIUM */}
      <article className="editorial-breakout mb-16 rounded-2xl bg-white border-2 border-money/25 p-7 md:p-10 shadow-[0_12px_40px_-15px_rgba(12,74,62,0.12)] relative overflow-hidden">
        {/* Faixa superior esmeralda */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-money via-[#146b5a] to-money" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
          <div className="max-w-2xl">
            {/* Header / Selo Oficial + Desconto */}
            <div className="flex items-center gap-2.5 mb-3 flex-wrap">
              <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-money font-bold bg-money/10 px-2.5 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-money" />
                Parceria Oficial · Manassés Contabilidade
              </span>
              <span className="inline-flex items-center font-mono text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded shadow-sm">
                🎁 50% OFF na 1ª Mensalidade
              </span>
            </div>

            {/* Título direto, sem itálico excessivo, fácil de ler */}
            <h3 className="font-display text-2xl md:text-3xl font-bold text-ink !mt-0 !mb-2.5 tracking-tight">
              {winner === 'pj' 
                ? 'Vai negociar proposta PJ? Garanta o enquadramento no Anexo III (6%).' 
                : 'Quer checar se vale a pena negociar um valor PJ maior?'}
            </h3>

            <p className="text-sm md:text-base text-ink-muted leading-relaxed font-sans !mt-0 !mb-4">
              A Manassés é especializada em contabilidade consultiva para profissionais de TI e prestadores de serviços. Valide seus números e evite pagar 15,5% de imposto por enquadramento incorreto.
            </p>

            {/* 3 Benefícios escaneáveis com checks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-4 text-xs font-sans text-ink">
              <div className="flex items-center gap-2 bg-paper/60 border border-rule/60 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                <span className="font-medium">Assessoria Fator R</span>
              </div>
              <div className="flex items-center gap-2 bg-paper/60 border border-rule/60 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                <span className="font-medium">Abertura ou Migração</span>
              </div>
              <div className="flex items-center gap-2 bg-paper/60 border border-rule/60 px-3 py-2 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-money flex-shrink-0" />
                <span className="font-medium">Direto no WhatsApp</span>
              </div>
            </div>

            {/* Cupom em formato de Voucher */}
            <div className="inline-flex items-center gap-2.5 bg-paper border border-dashed border-money/40 px-3.5 py-1.5 rounded-lg text-xs font-mono">
              <span className="text-ink-muted">Cupom exclusivo:</span>
              <strong className="text-money font-bold bg-white px-2 py-0.5 rounded border border-money/20 tracking-wider">
                CLTVSPJ50
              </strong>
              <span className="text-[11px] text-ink-fade hidden sm:inline">(Informe no atendimento)</span>
            </div>
          </div>

          {/* Coluna de Ação */}
          <div className="flex flex-col items-stretch sm:items-center lg:items-end gap-2.5 flex-shrink-0 lg:border-l lg:border-rule/60 lg:pl-8">
            <a
              href="/go/manasses"
              rel="sponsored nofollow"
              className="inline-flex items-center justify-center gap-3 bg-money hover:bg-[#0a3d33] text-white px-8 py-4 rounded-xl font-sans font-bold text-base transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl text-center w-full sm:w-auto"
            >
              Falar com Contador
              <ArrowRight className="w-4 h-4" />
            </a>
            <span className="text-[11px] font-sans text-ink-fade text-center">
              Atendimento rápido via WhatsApp · Sem compromisso
            </span>
          </div>
        </div>
      </article>

      <h2>Cenário simulado</h2>
      <p>{richContent?.intro}</p>
      <p>
        Comparamos <strong>CLT de R$ {formatBRLShort(cltGross)} bruto</strong> (com VR, VT, plano de saúde e seguro padrão)
        contra <strong>PJ faturando R$ {formatBRLShort(pjMonthlyGross)}/mês</strong>
        {pjRate ? ` (R$ ${formatBRL(pjRate)}/hora × ${hoursPerMonth}h)` : ''} no Simples Nacional,
        pró-labore mínimo e mensalidade de contador de R$ 350.
      </p>

      <h2>Como calculamos</h2>
      <p>Usamos a mesma engine da <Link href="/">calculadora CLT vs PJ 2026</Link>, com regras fiscais vigentes:</p>
      <ol>
        {richContent?.calculationSteps?.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <h2>Números lado a lado</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>CLT</th>
            <th>PJ</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bruto / faturamento</td>
            <td>R$ {formatBRL(clt.gross)}</td>
            <td>R$ {formatBRL(pj.gross)}</td>
          </tr>
          <tr>
            <td>INSS / previdência</td>
            <td>R$ {formatBRL(clt.inss)}</td>
            <td>R$ {formatBRL(pj.inssProLabore)} (pró-labore)</td>
          </tr>
          <tr>
            <td>IRPF</td>
            <td>R$ {formatBRL(clt.irpf)}</td>
            <td>R$ {formatBRL(pj.irpfProLabore || 0)}</td>
          </tr>
          <tr>
            <td>Líquido mensal</td>
            <td>R$ {formatBRL(clt.net)}</td>
            <td>R$ {formatBRL(pj.net)}</td>
          </tr>
          <tr>
            <td>Pacote total CLT*</td>
            <td>R$ {formatBRL(clt.totalPackage)}</td>
            <td>—</td>
          </tr>
          <tr>
            <td>Impostos PJ ({pj.taxName})</td>
            <td>—</td>
            <td>R$ {formatBRL(pj.totalTaxes)}</td>
          </tr>
          <tr>
            <td>Fator R / Anexo</td>
            <td>—</td>
            <td>{pj.fatorRPercent?.toFixed(1)}% · {pj.taxName}</td>
          </tr>
        </tbody>
      </table>
      <p><em>* Pacote total = líquido + FGTS + 13º + férias (provisões líquidas) + benefícios informados.</em></p>

      <h2>Vantagens da CLT nesta faixa</h2>
      <ul>
        {richContent?.cltAdvantages?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>Vantagens da PJ nesta faixa</h2>
      <ul>
        {richContent?.pjAdvantages?.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>

      <h2>O que isso significa</h2>
      {contextNotes.map((note) => (
        <p key={note}>{note}</p>
      ))}

      <h2>Conclusão</h2>
      <p>{richContent?.conclusion}</p>

      <h2>Perguntas frequentes</h2>
      {richContent?.faq?.map((item) => (
        <div key={item.q}>
          <h3>{item.q}</h3>
          <p>{item.a}</p>
        </div>
      ))}

      <h2>Simule com seus dados</h2>
      <p>
        Os números acima refletem médias de mercado. Dependendo dos seus benefícios individuais (VR, plano de saúde, PLR e dependentes), a vantagem pode mudar de lado.
      </p>

      <CalculatorCallout
        title="Quer comparar uma proposta diferente?"
        description={`Simule na calculadora CLT vs PJ incluindo seu salário exato de R$ ${formatBRLShort(cltGross)}, benefícios da sua empresa e faturamento PJ.`}
        buttonText="Simular Proposta Personalizada"
        href="/"
      />

      {related?.length > 0 && (
        <>
          <h2>Comparativos relacionados</h2>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/blog/comparativo/${item.slug}`}>{item.title}</Link>
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-24">
        <AffiliateCTA
          partner="manasses"
          title="Quer validar esse número com contador?"
          description="A Manassés Contabilidade atende profissionais de TI e Fator R. Ganhe 50% de desconto na primeira mensalidade informando o cupom CLTVSPJ50."
          buttonText="Falar com a Manassés"
        />
      </div>
    </>
  );
}
