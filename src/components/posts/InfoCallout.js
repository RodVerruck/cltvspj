export default function InfoCallout({ type = 'info', children }) {
  const styles = {
    info: { bg: 'var(--blue-light)', border: 'var(--blue-border)', color: 'var(--blue-text)', left: 'var(--blue)' },
    warning: { bg: 'var(--orange-light)', border: 'var(--orange-border)', color: 'var(--orange)', left: 'var(--orange-mid)' },
    success: { bg: 'var(--green-light)', border: 'var(--green-border)', color: 'var(--green)', left: 'var(--green)' },
  };
  const s = styles[type] || styles.info;
  return (
    <div style={{
      background: s.bg, border: `0.5px solid ${s.border}`,
      borderLeft: `3px solid ${s.left}`, borderRadius: '0 10px 10px 0',
      padding: '12px 16px', margin: '16px 0', color: s.color,
      fontSize: 13.5, lineHeight: 1.6, fontFamily: 'var(--sans)',
    }}>
      {children}
    </div>
  );
}
