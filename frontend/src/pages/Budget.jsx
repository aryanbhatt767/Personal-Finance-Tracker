// Budget.jsx
import { useEffect, useState } from 'react'
import { budgetAPI, analyticsAPI } from '../services/api'
import PageHeader from '../components/PageHeader'

const DEFAULT_BUDGETS = [
  { category: 'Housing', budget: 20000, spent: 18000, color: '#8b5cf6' },
  { category: 'Food', budget: 3000, spent: 1000, color: '#ef4444' },
  { category: 'Shopping', budget: 5000, spent: 4650, color: '#ec4899' },
  { category: 'Transport', budget: 2000, spent: 605, color: '#3b82f6' },
  { category: 'Entertainment', budget: 1500, spent: 768, color: '#6c63ff' },
  { category: 'Utilities', budget: 2500, spent: 1800, color: '#f59e0b' },
  { category: 'Health', budget: 2000, spent: 1200, color: '#14b8a6' },
]

export default function Budget() {
  const [budgets] = useState(DEFAULT_BUDGETS)
  const totalBudget = budgets.reduce((s, b) => s + b.budget, 0)
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0)

  return (
    <div>
      <PageHeader title="Budget Planner" sub="Track your monthly limits" />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Total Budget', value: `₹${totalBudget.toLocaleString('en-IN')}`, color: 'var(--text)', sub: 'Monthly limit set' },
            { label: 'Amount Spent', value: `₹${totalSpent.toLocaleString('en-IN')}`, color: 'var(--amber)', sub: `${Math.round(totalSpent / totalBudget * 100)}% of budget used` },
            { label: 'Remaining', value: `₹${(totalBudget - totalSpent).toLocaleString('en-IN')}`, color: 'var(--green)', sub: 'Safe to spend' },
          ].map(c => (
            <div key={c.label} style={s.metricCard}>
              <div style={s.metricLabel}>{c.label}</div>
              <div style={{ ...s.metricValue, color: c.color }}>{c.value}</div>
              <div style={s.metricSub}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div style={s.cardTitle}>Budget tracker</div>
            <span style={s.apiBadge}>GET /api/budgets</span>
          </div>
          {budgets.map(b => {
            const pct = Math.round(b.spent / b.budget * 100)
            const barColor = pct > 90 ? 'var(--red)' : pct > 70 ? 'var(--amber)' : b.color
            return (
              <div key={b.category} style={s.budgetRow}>
                <div style={s.budgetLabel}>
                  <div style={{ ...s.dot, background: b.color }} />
                  <span style={{ fontSize: 13 }}>{b.category}</span>
                </div>
                <div style={s.track}>
                  <div style={{ height: '100%', borderRadius: 3, background: barColor, width: `${Math.min(pct, 100)}%`, transition: 'width .4s' }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', minWidth: 110, textAlign: 'right' }}>
                  ₹{b.spent.toLocaleString()} / ₹{b.budget.toLocaleString()}
                </div>
                <div style={{ fontSize: 12, minWidth: 38, textAlign: 'right', color: barColor, fontWeight: 600 }}>{pct}%</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const s = {
  metricCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' },
  metricLabel: { fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 },
  metricValue: { fontSize: 24, fontWeight: 700, letterSpacing: '-1px' },
  metricSub: { fontSize: 11, color: 'var(--muted)', marginTop: 6 },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 },
  cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  cardTitle: { fontSize: 14, fontWeight: 600 },
  apiBadge: { fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(108,99,255,.1)', color: 'var(--accent2)', border: '1px solid rgba(108,99,255,.2)' },
  budgetRow: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  budgetLabel: { display: 'flex', alignItems: 'center', gap: 8, width: 120 },
  dot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  track: { flex: 1, height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' },
}
