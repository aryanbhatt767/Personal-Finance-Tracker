import { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'
import { Link } from 'react-router-dom'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler
} from 'chart.js'
import { analyticsAPI, transactionAPI } from '../services/api'
import PageHeader from '../components/PageHeader'
import MetricCard from '../components/MetricCard'
import AddTransactionModal from '../components/AddTransactionModal'
import { fmtDate, getCategoryColor } from '../utils'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const safeArray = (val) => (Array.isArray(val) ? val : [])
const safeNum = (val) => Number(val) || 0

export default function Dashboard() {
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, balance: 0, savingsRate: 0 })
  const [monthly, setMonthly] = useState([])
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [period, setPeriod] = useState('6M')

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const [sumRes, monthRes, txnRes, catRes] = await Promise.all([
        analyticsAPI.getSummary(),
        analyticsAPI.getMonthly(),
        transactionAPI.getAll(),
        analyticsAPI.getCategories(),
      ])
      setSummary(sumRes.data || {})
      setMonthly(safeArray(monthRes.data))
      setTransactions(safeArray(txnRes.data).slice(0, 6))
      setCategories(safeArray(catRes.data))
    } catch (err) {
      console.error('Dashboard load error:', err)
    }
  }

  const displayData = period === '3M' ? monthly.slice(-3) : monthly

  const chartData = {
    labels: displayData.map(m => {
      try {
        const [y, mo] = (m.month || '').split('-')
        return new Date(y, mo - 1).toLocaleDateString('en', { month: 'short' })
      } catch { return '' }
    }),
    datasets: [
      {
        label: 'Income',
        data: displayData.map(m => safeNum(m.income)),
        borderColor: '#22c55e', backgroundColor: 'rgba(34,197,94,0.08)',
        borderWidth: 2.5, pointBackgroundColor: '#22c55e',
        pointRadius: 5, pointHoverRadius: 7, tension: 0.4, fill: true,
      },
      {
        label: 'Expenses',
        data: displayData.map(m => safeNum(m.expense)),
        borderColor: '#6c63ff', backgroundColor: 'rgba(108,99,255,0.08)',
        borderWidth: 2.5, pointBackgroundColor: '#6c63ff',
        pointRadius: 5, pointHoverRadius: 7, tension: 0.4, fill: true,
      }
    ]
  }

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#18181f', borderColor: '#2a2a38', borderWidth: 1,
        padding: 10, titleColor: '#f1f0f5', bodyColor: '#8b8a9e',
        callbacks: { label: ctx => `${ctx.dataset.label}: ₹${safeNum(ctx.raw).toLocaleString('en-IN')}` }
      }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#5a5970', font: { size: 11 } } },
      y: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#5a5970', font: { size: 11 }, callback: v => '₹' + Math.round(v / 1000) + 'K' },
        border: { display: false }
      }
    }
  }

  const fmt = v => `₹${safeNum(v).toLocaleString('en-IN')}`
  const maxCat = Math.max(...categories.map(c => safeNum(c.amount)), 1)

  return (
    <div>
      <PageHeader
        title="Overview"
        sub="Dashboard"
        action={
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <i className="ti ti-plus" /> Add transaction
          </button>
        }
      />

      <div className={styles.content}>
        <div className={styles.metricsRow}>
          <MetricCard label="Total Balance" icon="ti-wallet" iconColor="var(--accent2)"
            value={fmt(summary.balance)}
            valueColor={safeNum(summary.balance) >= 0 ? 'var(--green)' : 'var(--red)'}
            delta="Net savings" deltaUp />
          <MetricCard label="Total Income" icon="ti-arrow-down" iconColor="var(--green)"
            value={fmt(summary.totalIncome)} valueColor="var(--green)"
            delta="Credited" deltaUp />
          <MetricCard label="Total Expenses" icon="ti-arrow-up" iconColor="var(--red)"
            value={fmt(summary.totalExpense)} valueColor="var(--red)"
            delta="Debited" deltaUp={false} />
          <MetricCard label="Savings Rate" icon="ti-piggy-bank" iconColor="var(--amber)"
            value={`${safeNum(summary.savingsRate)}%`} valueColor="var(--amber)"
            delta="This month" deltaUp />
        </div>

        <div className={styles.row2}>
          <div style={s.chartCard}>
            <div style={s.cardHeader}>
              <div>
                <div style={s.cardTitle}>Expense vs Income</div>
                <div style={s.cardSub}>Monthly trend</div>
              </div>
              <div style={s.periodTabs}>
                {['3M', '6M', '1Y'].map(p => (
                  <button key={p}
                    style={{ ...s.ptab, ...(period === p ? s.ptabActive : {}) }}
                    onClick={() => setPeriod(p)}>{p}
                  </button>
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
            <div style={{ position: 'relative', height: 220 }}>
              {displayData.length > 0
                ? <Line data={chartData} options={chartOptions} />
                : <div style={{ color: 'var(--muted)', textAlign: 'center', paddingTop: 80, fontSize: 13 }}>
                    Add transactions to see your chart 📊
                  </div>
              }
            </div>
          </div>

          <div style={s.catsCard}>
            <div style={s.cardHeader}>
              <div>
                <div style={s.cardTitle}>Top categories</div>
                <div style={s.cardSub}>By spending</div>
              </div>
            </div>
            {categories.length === 0
              ? <div style={{ color: 'var(--muted)', fontSize: 13 }}>No data yet</div>
              : categories.map((cat, i) => (
                <div key={`${cat.category}-${i}`} style={s.catItem}>
                  <div style={{ ...s.catDot, background: getCategoryColor(cat.category) }} />
                  <div style={{ flex: 1, fontSize: 13 }}>{cat.category}</div>
                  <div style={s.catBarWrap}>
                    <div style={{
                      ...s.catBar,
                      width: `${Math.round((safeNum(cat.amount) / maxCat) * 100)}%`,
                      background: getCategoryColor(cat.category)
                    }} />
                  </div>
                  <div style={s.catAmount}>₹{safeNum(cat.amount).toLocaleString('en-IN')}</div>
                </div>
              ))
            }
          </div>
        </div>

        <div style={s.txnCard}>
          <div style={s.cardHeader}>
            <div>
              <div style={s.cardTitle}>Recent transactions</div>
              <div style={s.cardSub}>{transactions.length} latest entries</div>
            </div>
            <Link to="/transactions" style={s.viewAll}>
              View all <i className="ti ti-arrow-right" style={{ fontSize: 12 }} />
            </Link>
          </div>
          {transactions.length === 0
            ? <div style={{ color: 'var(--muted)', padding: '20px 0', fontSize: 13 }}>
                No transactions yet — add your first one!
              </div>
            : transactions.map((t, i) => <TxnRow key={t.id || i} txn={t} />)
          }
        </div>
      </div>

      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={() => { setShowModal(false); loadData() }}
        />
      )}
    </div>
  )
}

function TxnRow({ txn }) {
  return (
    <div style={s.txnRow}>
      <div style={{ ...s.txnIcon, background: `${txn.color || '#6c63ff'}22` }}>
        {txn.icon || '💳'}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{txn.name}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{fmtDate(txn.date)}</div>
        <span style={s.cat}>{txn.category}</span>
      </div>
      <div style={{ ...s.txnAmount, color: txn.type === 'expense' ? 'var(--red)' : 'var(--green)' }}>
        {txn.type === 'expense' ? '-' : '+'}₹{safeNum(txn.amount).toLocaleString('en-IN')}
      </div>
    </div>
  )
}

const s = {
  
  
  chartCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 },
  catsCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 },
  txnCard: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 },
  cardHeader: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 600 },
  cardSub: { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  periodTabs: { display: 'flex', gap: 2, background: 'var(--surface)', borderRadius: 6, padding: 2 },
  ptab: { padding: '4px 10px', borderRadius: 4, cursor: 'pointer', fontSize: 11, color: 'var(--muted)', border: 'none', background: 'none' },
  ptabActive: { background: 'var(--card)', color: 'var(--text)', fontWeight: 500 },
  catItem: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  catDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  catBarWrap: { width: 80, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' },
  catBar: { height: '100%', borderRadius: 2, transition: 'width .4s' },
  catAmount: { fontSize: 13, fontWeight: 500, minWidth: 55, textAlign: 'right' },
  txnRow: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8 },
  txnIcon: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  txnAmount: { fontSize: 14, fontWeight: 600, textAlign: 'right' },
  cat: { display: 'inline-block', fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--surface)', color: 'var(--muted)', marginTop: 3 },
  viewAll: { fontSize: 12, color: 'var(--muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, padding: '6px 12px', borderRadius: 8, background: 'var(--surface)', border: '1px solid var(--border)' },
}