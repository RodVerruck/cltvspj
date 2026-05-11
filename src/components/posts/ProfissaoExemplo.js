export default function ProfissaoExemplo({ icon, title, tag, faturamento, aliquota, extra, imposto, isGreen }) {
  return (
    <div style={{
      background: 'var(--white)', border: '0.5px solid var(--rule)',
      borderRadius: 10, padding: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', flex: 1 }}>{title}</span>
        <span style={{
          fontSize: 10.5, fontWeight: 500, padding: '2px 8px', borderRadius: 20,
          background: isGreen ? 'var(--blue-light)' : 'var(--orange-light)',
          color: isGreen ? 'var(--blue-text)' : 'var(--orange)',
        }}>{tag}</span>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[
          { label: 'Faturamento', val: faturamento },
          { label: 'Alíquota', val: aliquota },
          { label: extra.label, val: extra.val },
        ].map(s => (
          <div key={s.label} style={{ flex: 1 }}>
            <span style={{ fontSize: 9.5, color: 'var(--ink4)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>{s.label}</span>
            <span style={{ fontSize: 12.5, color: 'var(--ink)', fontWeight: 400 }}>{s.val}</span>
          </div>
        ))}
      </div>
      <div style={{
        paddingTop: 10, borderTop: isGreen ? '0.5px solid var(--blue-border)' : '0.5px solid var(--orange-border)',
        fontSize: 12, color: isGreen ? 'var(--blue)' : 'var(--orange)',
        fontFamily: 'var(--sans)',
      }}>
        Imposto mensal: <strong>{imposto}</strong>
      </div>
    </div>
  );
}
