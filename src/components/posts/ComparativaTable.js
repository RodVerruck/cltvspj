export default function ComparativaTable() {
  const rows = [
    { label: 'Quando usar', iii: 'Fator R ≥ 28%', v: 'Fator R < 28%' },
    { label: 'Alíquota inicial', iii: '6%', v: '15%' },
    { label: 'Alíquota máxima', iii: '33%', v: '30%' },
    { label: 'Perfil típico', iii: 'Dev · Designer · Consultoria', v: 'Médico · Advogado · Arquiteto' },
    { label: 'Impacto anual', iii: 'Até R$ 10.800 a menos', v: 'Referência base' },
  ];

  return (
    <div className="compare-wrap">
      <table className="compare-table">
        <thead>
          <tr>
            <th className="compare-th compare-th--neutral"></th>
            <th className="compare-th compare-th--green">
              Anexo III
              <span className="compare-badge">Recomendado</span>
            </th>
            <th className="compare-th compare-th--neutral">Anexo V</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.label}>
              <td className="compare-td compare-td--label">{r.label}</td>
              <td className="compare-td compare-td--green">{r.iii}</td>
              <td className="compare-td">{r.v}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
