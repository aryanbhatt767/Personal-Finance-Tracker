import { useAuth } from '../context/AuthContext'
import PageHeader from '../components/PageHeader'

export default function Profile() {
  const { user } = useAuth()
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div>
      <PageHeader title="Profile" sub="Account settings" />
      <div style={{ padding: 24, maxWidth: 520 }}>
        <div style={s.card}>
          <div style={s.userRow}>
            <div style={s.avatar}>{initials}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>{user?.email}</div>
              <div style={s.jwtBadge}>🔒 JWT authenticated</div>
            </div>
          </div>
          <div style={s.statsRow}>
            {[
              { label: 'Member since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Jan 2025' },
              { label: 'Account status', value: 'Active ✓' },
              { label: 'Auth method', value: 'JWT + bcrypt' },
            ].map(item => (
              <div key={item.label} style={s.stat}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={s.card}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Spring Boot REST API — all 14 endpoints</div>
          {[
            ['POST', '/api/auth/register', 'Register new user'],
            ['POST', '/api/auth/login', 'Login · returns JWT'],
            ['GET', '/api/users/me', 'Get current user (auth required)'],
            ['PUT', '/api/users/me', 'Update profile'],
            ['DELETE', '/api/users/me', 'Delete account'],
            ['GET', '/api/transactions', 'List transactions'],
            ['GET', '/api/transactions/:id', 'Get single transaction'],
            ['POST', '/api/transactions', 'Create transaction'],
            ['PUT', '/api/transactions/:id', 'Update transaction'],
            ['DELETE', '/api/transactions/:id', 'Delete transaction'],
            ['GET', '/api/analytics/summary', 'Overall summary'],
            ['GET', '/api/analytics/categories', 'Category breakdown'],
            ['GET', '/api/budgets', 'Get budgets'],
            ['POST', '/api/budgets', 'Set budget'],
          ].map(([method, path, desc], i) => (
            <div key={i} style={{ ...s.epRow, background: i % 2 === 0 ? 'rgba(255,255,255,.02)' : 'transparent' }}>
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700, minWidth: 48, textAlign: 'center',
                background: method === 'GET' ? 'rgba(34,197,94,.12)' : method === 'POST' ? 'rgba(108,99,255,.12)' : method === 'PUT' ? 'rgba(245,158,11,.12)' : 'rgba(239,68,68,.12)',
                color: method === 'GET' ? '#22c55e' : method === 'POST' ? '#a78bfa' : method === 'PUT' ? '#f59e0b' : '#ef4444' }}>
                {method}
              </span>
              <code style={{ fontSize: 11, color: 'var(--accent2)', flex: 1 }}>{path}</code>
              <span style={{ fontSize: 11, color: 'var(--sub)' }}>{desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const s = {
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 14 },
  userRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 },
  jwtBadge: { marginTop: 6, display: 'inline-block', fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(34,197,94,.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,.2)' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 },
  stat: { background: 'var(--surface)', borderRadius: 8, padding: 12, textAlign: 'center' },
  epRow: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 6 },
}
