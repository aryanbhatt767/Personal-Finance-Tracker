// PageHeader.jsx
export default function PageHeader({ title, sub, action }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '16px 24px', borderBottom: '1px solid var(--border)',
      background: 'var(--surface)', position: 'sticky', top: 0, zIndex: 10
    }}>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>{title}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{sub}</div>}
      </div>
      {action && <div>{action}</div>}
      <style>{`
        .btn-primary { padding: 8px 16px; border-radius: 8px; border: none; cursor: pointer; font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; background: var(--accent); color: #fff; font-family: inherit; }
        .btn-primary:hover { background: #7c72ff; }
        .btn-primary i { font-size: 14px; }
      `}</style>
    </div>
  )
}
