export default function AnexoTable({ rows, headers }) {
  return (
    <div className="compare-wrap" style={{ marginBottom: 20 }}>
      <table className="compare-table">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className={`compare-th ${i === 1 ? 'compare-th--green' : ''}`}>
                {h}
                {i === 1 && <span className="compare-badge">Recomendado</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={`compare-td ${ci === 0 ? 'compare-td--label' : ci === 1 ? 'compare-td--green' : ''}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
