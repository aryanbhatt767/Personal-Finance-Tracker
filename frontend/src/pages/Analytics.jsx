import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { analyticsAPI } from '../services/api'
import PageHeader from '../components/PageHeader'

const ENDPOINTS = [
  ['GET', '/api/transactions', 'List all transactions'],
  ['POST', '/api/transactions', 'Add transaction'],
  ['PUT', '/api/transactions/:id', 'Update transaction'],
  ['DELETE', '/api/transactions/:id', 'Delete transaction'],
  ['GET', '/api/analytics/summary', 'Monthly summary'],
  ['GET', '/api/analytics/categories', 'Category breakdown'],
  ['GET', '/api/analytics/monthly', 'Monthly trend'],
  ['GET', '/api/budgets', 'List budgets'],
  ['POST', '/api/budgets', 'Set budget'],
  ['PUT', '/api/budgets/:id', 'Update budget'],
]

const METHOD_COLORS = { GET: '#22c55e', POST: '#a78bfa', PUT: '#f59e0b', DELETE: '#ef4444' }
const METHOD_BG = { GET: 'rgba(34,197,94,.12)', POST: 'rgba(108,99,255,.12)', PUT: 'rgba(245,158,11,.12)', DELETE: 'rgba(239,68,68,.12)' }

export default function Analytics() {
  const [summary, setSummary] = useState(null)
  const [monthly, setMonthly] = useState([])
  const [categories, setCategories] = useState([])
  const [period, setPeriod] = useState('6M')

  useEffect(() => {
    Promise.all([analyticsAPI.getSummary(), analyticsAPI.getMonthly(), analyticsAPI.getCategories()])
      .then(([s, m, c]) => { setSummary(s.data); setMonthly(m.data); setCategories(c.data) })
  }, [])

  const displayData = period === '3M' ? monthly.slice(-3) : monthly

  const chartData = {
    labels: displayData.map(m => {
      const [y, mo] = m.month.split('-')
      return new Date(y, mo - 1).toLocaleDateString('en', { month: 'short' })
    }),
    datasets: [
      { label: 'Income', data: displayData.map(m => m.income), borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)', borderWidth: 2.5, pointBackgroundColor: '#22c55e', pointRadius: 5, tension: 0.4, fill: true },
      { label: 'Expenses', data: displayData.map(m => m.expense), borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.08)', borderWidth: 2.5, pointBackgroundColor: '#6c63ff', pointRadius: 5, tension: 0.4, fill: true },
    ]
  }

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#18181f', borderColor: '#2a2a38', borderWidth: 1, padding: 10, titleColor: '#f1f0f5', bodyColor: '#8b8a9e', callbacks: { label: ctx => `${ctx.dataset.label}: ₹${(ctx.raw||0).toLocaleString('en-IN')}` } }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#5a5970', font: { size: 11 } } },
      y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#5a5970', font: { size: 11 }, callback: v => '₹' + Math.round(v / 1000) + 'K' }, border: { display: false } }
    }
  }

  return (
    <div>
      <PageHeader title="Analytics" sub="Insights and trends" />
      <div style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { label: 'Avg monthly spend', value: '₹30,343', sub: 'Last 6 months' },
            { label: 'Highest spend', value: '₹35,600', color: 'var(--red)', sub: 'April 2025' },
            { label: 'Savings rate', value: `${summary?.savingsRate || 0}%`, color: 'var(--amber)', sub: '↑ 4% vs last month' },
            { label: 'Transactions', value: String(summary?.transactionCount || 0), sub: 'Total recorded' },
          ].map(c => (
            <div key={c.label} style={s.metricCard}>
              <div style={s.label}>{c.label}</div>
              <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-1px', color: c.color || 'var(--text)' }}>{c.value}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{c.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ ...s.card, marginBottom: 14 }}>
          <div style={s.cardHeader}>
            <div>
              <div style={s.cardTitle}>6-month trend</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Income vs expenses — Slice-style view</div>
            </div>
            <div style={s.tabs}>
              {['3M', '6M', '1Y'].map(p => (
                <button key={p} style={{ ...s.tab, ...(period === p ? s.tabActive : {}) }} onClick={() => setPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            {[['Income', '#22c55e'], ['Expenses', '#6c63ff']].map(([l, c]) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--muted)' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
              </span>
            ))}
          </div>
          <div style={{ position: 'relative', height: 260 }}>
            {monthly.length > 0 && <Line data={chartData} options={chartOptions} role="img" aria-label="Monthly income and expense trend chart" />}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={s.card}>
            <div style={s.cardTitle}>Top expense categories</div>
            <div style={{ marginTop: 14 }}>
              {(categories.slice(0, 5)).map(c => (
                <div key={c.category} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#6c63ff', flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: 13 }}>{c.category}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--red)' }}>₹{(c.amount || 0).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={s.card}>
            <div style={s.cardTitle}>REST API endpoints</div>
            <div style={{ marginTop: 14 }}>
              {ENDPOINTS.map(([method, path, desc], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,.03)' }}>
                  <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, fontWeight: 700, background: METHOD_BG[method], color: METHOD_COLORS[method], minWidth: 48, textAlign: 'center' }}>{method}</span>
                  <code style={{ fontSize: 11, color: 'var(--accent2)', flex: 1 }}>{path}</code>
                  <span style={{ fontSize: 10, color: 'var(--sub)' }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  metricCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px 18px' },
  label: { fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6 },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  cardTitle: { fontSize: 14, fontWeight: 600 },
  tabs: { display: 'flex', gap: 2, background: 'var(--surface)', borderRadius: 6, padding: 2 },
  tab: { padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: 'var(--muted)', border: 'none', background: 'none' },
  tabActive: { background: 'var(--card)', color: 'var(--text)', fontWeight: 500 },
}
