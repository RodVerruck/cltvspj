export default function InfoCallout({ type = 'info', children }) {
  const styles = {
    info: { bg: 'var(--money-light)', border: 'var(--rule)', color: 'var(--money)', left: 'var(--money)' },
    success: { bg: 'var(--money-light)', border: 'var(--rule)', color: 'var(--money)', left: 'var(--money)' },
    warning: { bg: 'var(--hot-light)', border: 'var(--rule)', color: 'var(--hot)', left: 'var(--hot)' },
  };
  const s = styles[type] || styles.info;
  return (
    <div style={{
      background: s.bg, border: `0.5px solid ${s.border}`,
      borderLeft: `3px solid ${s.left}`, borderRadius: '0 10px 10px 0',
      padding: '12px 16px', margin: '16px 0', color: s.color,
      fontSize: 13.5, lineHeight: 1.6, fontFamily: 'var(--f-sans)',
    }}>
      {children}
    </div>
  );
}
