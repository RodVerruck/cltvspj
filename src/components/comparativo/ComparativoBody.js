import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
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

      {/* 2. CTA ANCORADO DA MANASSÉS NO TOPO */}
      <div className="editorial-breakout mb-16 rounded-xl p-6 md:p-8 bg-[#0c4a3e] text-[#f5f1e8] border border-[#0c4a3e]/20 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#f5f1e8 1px, transparent 1px), linear-gradient(90deg, #f5f1e8 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2.5 flex-wrap">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#f5f1e8]/60 font-bold">
                Parceria Oficial · Manassés Contabilidade
              </span>
              <span className="bg-[#f5f1e8] text-[#0c4a3e] text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded shadow-sm">
                50% OFF na 1ª Mensalidade
              </span>
            </div>
            
            <h3 className="font-display text-2xl md:text-3xl font-bold italic tracking-tight text-[#f5f1e8] mb-2">
              {winner === 'pj' 
                ? 'Vai negociar proposta PJ? Garanta enquadramento no Anexo III (6%).' 
                : 'Quer checar se vale a pena negociar um valor PJ maior?'}
            </h3>
            
            <p className="text-sm text-[#f5f1e8]/85 leading-relaxed font-sans">
              A Manassés é especialista em contabilidade consultiva para profissionais de TI e prestadores de serviços no Simples Nacional (Fator R).
              Simule sua migração com segurança e tire dúvidas direto no WhatsApp.
            </p>

            <div className="mt-3.5 flex flex-wrap items-center gap-2 text-xs font-mono text-[#f5f1e8]/80">
              <span className="bg-black/25 px-2.5 py-1 rounded border border-white/10 text-[#f5f1e8] font-bold">
                Cupom: CLTVSPJ50
              </span>
              <span className="text-[11px] text-[#f5f1e8]/70">
                (Informe no WhatsApp para resgatar o desconto)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-stretch sm:items-center lg:items-end gap-2.5 flex-shrink-0">
            <a
              href="/go/manasses"
              rel="sponsored nofollow"
              className="inline-flex items-center justify-center gap-3 bg-[#f5f1e8] text-[#0c4a3e] px-8 py-4 font-display italic text-xl font-black rounded-lg transition-all duration-300 hover:scale-105 shadow-lg border border-[#f5f1e8]/20 hover:bg-white text-center w-full sm:w-auto"
            >
              Falar com Especialista
              <ArrowRight className="w-5 h-5 ml-1" />
            </a>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#f5f1e8]/50 text-center">
              Sem compromisso · Atendimento humanizado
            </span>
          </div>
        </div>
      </div>

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
