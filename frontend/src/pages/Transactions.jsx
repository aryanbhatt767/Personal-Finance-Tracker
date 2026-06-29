import { useEffect, useState } from 'react'
import { transactionAPI } from '../services/api'
import PageHeader from '../components/PageHeader'
import AddTransactionModal from '../components/AddTransactionModal'
import { fmt, fmtDate } from '../utils'

export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await transactionAPI.getAll()
      setTransactions(res.data)
    } finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return
    await transactionAPI.delete(id)
    setTransactions(t => t.filter(x => x.id !== id))
  }

  const filtered = transactions
    .filter(t => filter === 'all' || t.type === filter)
    .filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || (t.category || '').toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageHeader
        title="Transactions"
        sub={`${filtered.length} records`}
        action={<button className="btn-primary" onClick={() => setShowModal(true)}>
          <i className="ti ti-plus" /> Add
        </button>}
      />

      <div style={{ padding: 24 }}>
        <div style={s.filterBar}>
          <div style={s.searchWrap}>
            <i className="ti ti-search" style={s.searchIcon} aria-hidden="true" />
            <input style={s.search} placeholder="Search transactions…"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {['all', 'income', 'expense'].map(f => (
            <button key={f} style={{ ...s.tag, ...(filter === f ? s.tagActive : {}) }}
              onClick={() => setFilter(f)}>
              {f === 'all' ? 'All' : f === 'income' ? 'Income' : 'Expenses'}
            </button>
          ))}
        </div>

        <div style={s.card}>
          <div style={s.cardHeader}>
            <div>
              <div style={s.cardTitle}>All transactions</div>
              <div style={s.cardSub}>{filtered.length} records found · <span style={{ color: 'var(--accent2)', fontFamily: 'monospace' }}>GET /api/transactions</span></div>
            </div>
          </div>

          {loading ? (
            <div style={s.empty}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={s.empty}>No transactions found</div>
          ) : (
            filtered.map(t => (
              <div key={t.id} style={s.row}>
                <div style={{ ...s.icon, background: `${t.color || '#6c63ff'}22` }}>{t.icon || '💳'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>{fmtDate(t.date)}</div>
                  <span style={s.catTag}>{t.category}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: t.type === 'expense' ? 'var(--red)' : 'var(--green)' }}>
                    {t.type === 'expense' ? '-' : '+'}₹{(t.amount || 0).toLocaleString('en-IN')}
                  </div>
                  <button onClick={() => handleDelete(t.id)} style={s.del} title="Delete transaction" aria-label="Delete transaction">
                    <i className="ti ti-trash" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && <AddTransactionModal onClose={() => setShowModal(false)} onSave={() => { setShowModal(false); load() }} />}
    </div>
  )
}

const s = {
  filterBar: { display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' },
  searchWrap: { flex: 1, position: 'relative' },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 15 },
  search: { width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '9px 12px 9px 36px', color: 'var(--text)', fontSize: 13, outline: 'none' },
  tag: { padding: '6px 14px', borderRadius: 6, fontSize: 12, cursor: 'pointer', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--muted)' },
  tagActive: { background: 'rgba(108,99,255,.15)', color: 'var(--accent2)', borderColor: 'rgba(108,99,255,.3)' },
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 600 },
  cardSub: { fontSize: 11, color: 'var(--muted)', marginTop: 2 },
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 8px', borderRadius: 8, borderBottom: '1px solid rgba(255,255,255,.03)' },
  icon: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  catTag: { display: 'inline-block', fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--surface)', color: 'var(--muted)', marginTop: 3 },
  del: { background: 'none', border: 'none', color: 'var(--sub)', cursor: 'pointer', fontSize: 14, marginTop: 4 },
  empty: { textAlign: 'center', padding: 40, color: 'var(--muted)' },
}
