import Link from 'next/link';
import AffiliateCTA from '../AffiliateCTA';
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
  } = scenario;

  const winnerLabel = winner === 'pj' ? 'PJ' : 'CLT';
  const winnerColor = winner === 'pj' ? 'text-money' : 'text-hot';

  return (
    <>
      <div className="editorial-breakout mb-16 p-8 md:p-12 rounded-lg border border-rule bg-white shadow-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-money mb-4">Resultado da simulação</p>
        <p className={`font-display text-4xl md:text-5xl font-bold mb-2 ${winnerColor}`}>
          {winnerLabel} leva vantagem
        </p>
        <p className="text-ink-muted text-lg mb-6">
          Diferença de <strong className="text-ink">R$ {formatBRL(Math.abs(diffMonthly))}/mês</strong>
          {' '}(R$ {formatBRL(Math.abs(diffAnnual))}/ano) neste cenário padrão.
        </p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          Ajustar na calculadora completa
          <span aria-hidden>→</span>
        </Link>
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
        Abra a{' '}
        <Link href="/" className="text-money font-semibold hover:underline">
          calculadora CLT vs PJ 2026
        </Link>
        {' '}e informe salário CLT de R$ {formatBRLShort(cltGross)}
        {pjRate ? ` e valor/hora PJ de R$ ${formatBRL(pjRate)}` : ''}. Dependentes, PLR, Fator R real e regime MEI/Presumido
        podem alterar o resultado.
      </p>

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
          description="A Manassés Contabilidade atende profissionais de TI e Fator R. 50% de desconto na primeira mensalidade."
          buttonText="Falar com a Manassés"
        />
      </div>
    </>
  );
}
