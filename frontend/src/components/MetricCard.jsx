export default function MetricCard({ label, icon, iconColor, value, valueColor, delta, deltaUp }) {
  return (
    <div style={s.card}>
      <div style={s.label}>
        {icon && <i className={`ti ${icon}`} style={{ color: iconColor, fontSize: 13 }} aria-hidden="true" />}
        {label}
      </div>
      <div style={{ ...s.value, color: valueColor || 'var(--text)' }}>{value}</div>
      {delta && (
        <div style={{ ...s.delta, color: deltaUp ? 'var(--green)' : 'var(--red)' }}>
          <i className={`ti ${deltaUp ? 'ti-trending-up' : 'ti-trending-down'}`} style={{ fontSize: 11 }} aria-hidden="true" />
          {delta}
        </div>
      )}
    </div>
  )
}

const s = {
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' },
  label: { fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 },
  value: { fontSize: 24, fontWeight: 700, letterSpacing: '-1px', lineHeight: 1 },
  delta: { fontSize: 11, marginTop: 6, display: 'flex', alignItems: 'center', gap: 3 },
}
