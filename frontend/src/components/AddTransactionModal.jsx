import { useState } from 'react'
import { transactionAPI } from '../services/api'
import { getCategoryColor, getCategoryIcon } from '../utils'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Utilities', 'Health', 'Housing', 'Income', 'Other']

export default function AddTransactionModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '', amount: '', type: 'expense',
    category: 'Food', date: new Date().toISOString().split('T')[0], notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.amount) { setError('Name and amount are required'); return }
    setLoading(true)
    try {
      await transactionAPI.create({
        ...form,
        amount: parseFloat(form.amount),
        icon: getCategoryIcon(form.category),
        color: getCategoryColor(form.category),
      })
      onSave()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={s.modal}>
        <div style={s.header}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Add transaction</span>
          <button onClick={onClose} style={s.close} aria-label="Close modal">×</button>
        </div>

        <div style={s.row2}>
          <div>
            <label style={s.label}>Type</label>
            <select style={s.select} value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label style={s.label}>Amount (₹)</label>
            <input style={s.input} type="number" placeholder="0" value={form.amount} onChange={e => set('amount', e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Description</label>
          <input style={s.input} type="text" placeholder="e.g. Swiggy dinner" value={form.name} onChange={e => set('name', e.target.value)} />
        </div>

        <div style={s.row2}>
          <div>
            <label style={s.label}>Category</label>
            <select style={s.select} value={form.category} onChange={e => set('category', e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Date</label>
            <input style={s.input} type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={s.label}>Notes (optional)</label>
          <input style={s.input} type="text" placeholder="Any additional notes…" value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>

        <div style={s.preview}>
          <span style={{ fontSize: 20 }}>{getCategoryIcon(form.category)}</span>
          <span style={{ color: form.type === 'expense' ? 'var(--red)' : 'var(--green)', fontWeight: 600 }}>
            {form.type === 'expense' ? '-' : '+'}₹{parseInt(form.amount) || 0}
          </span>
          <span style={{ color: 'var(--muted)', fontSize: 12 }}>· {form.category}</span>
        </div>

        {error && <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 12 }}>⚠ {error}</p>}

        <div style={s.footer}>
          <button onClick={onClose} style={s.btnGhost}>Cancel</button>
          <button onClick={handleSubmit} style={s.btnPrimary} disabled={loading}>
            {loading ? 'Saving…' : '+ Add transaction'}
          </button>
        </div>

        <p style={{ fontSize: 10, color: 'var(--sub)', textAlign: 'center', marginTop: 12 }}>POST /api/transactions · JWT secured</p>
      </div>
    </div>
  )
}

const s = {
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 },
  modal: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, width: 400, maxWidth: '95vw' },
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  close: { background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 22, lineHeight: 1 },
  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6 },
  input: { width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit' },
  select: { width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none', fontFamily: 'inherit', appearance: 'none' },
  preview: { display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', background: 'var(--surface)', borderRadius: 8, marginBottom: 12 },
  footer: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  btnPrimary: { padding: '9px 18px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, background: 'var(--accent)', color: '#fff', fontFamily: 'inherit' },
  btnGhost: { padding: '9px 18px', borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', fontSize: 13, background: 'var(--surface)', color: 'var(--muted)', fontFamily: 'inherit' },
}
