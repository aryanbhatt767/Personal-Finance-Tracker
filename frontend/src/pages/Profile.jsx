import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { transactionAPI, api } from '../services/api'
import PageHeader from '../components/PageHeader'

export default function Profile() {
  const { user, logout } = useAuth()
  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [currency, setCurrency] = useState(localStorage.getItem('currency') || 'INR')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg, setPwdMsg] = useState('')

  const [exporting, setExporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSaveProfile = async e => {
    e.preventDefault()
    setSavingProfile(true)
    setProfileMsg('')
    try {
      await api.put('/users/me', { name, email })
      setProfileMsg('Profile updated')
    } catch (err) {
      setProfileMsg(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleChangePassword = async e => {
  e.preventDefault()
  setPwdMsg('')
  if (pwd.next !== pwd.confirm) {
    setPwdMsg('New passwords do not match')
    return
  }
  setSavingPwd(true)
  try {
    await api.put('/users/me', { password: pwd.next })
    setPwdMsg('Password changed')
    setPwd({ current: '', next: '', confirm: '' })
  } catch (err) {
    setPwdMsg(err.response?.data?.error || 'Failed to change password')
  } finally {
    setSavingPwd(false)
  }
}

  const handleCurrencyChange = value => {
    setCurrency(value)
    localStorage.setItem('currency', value)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await transactionAPI.getAll()
      const rows = res.data || []
      const header = ['Date', 'Name', 'Category', 'Type', 'Amount']
      const csvRows = [
        header.join(','),
        ...rows.map(t => [t.date, `"${t.name}"`, t.category, t.type, t.amount].join(',')),
      ]
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'fintrack-transactions.csv'
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setExporting(false)
    }
  }

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/me')
      logout()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  return (
    <div>
      <PageHeader title="Profile" sub="Account settings" />
      <div style={{ padding: 24, maxWidth: 560 }}>

        {/* Header card */}
        <div style={s.card}>
          <div style={s.userRow}>
            <div style={s.avatar}>{initials}</div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{user?.name}</div>
              <div style={{ color: 'var(--muted)', fontSize: 13 }}>{user?.email}</div>
            </div>
          </div>
          <div style={s.statsRow}>
            <div style={s.stat}>
              <div style={s.statLabel}>Member since</div>
              <div style={s.statValue}>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—'}
              </div>
            </div>
            <div style={s.stat}>
              <div style={s.statLabel}>Account status</div>
              <div style={s.statValue}>Active</div>
            </div>
          </div>
        </div>

        {/* Edit profile */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Edit profile</div>
          <form onSubmit={handleSaveProfile}>
            <label style={s.label}>Full name</label>
            <input style={s.input} value={name} onChange={e => setName(e.target.value)} />
            <label style={s.label}>Email address</label>
            <input style={s.input} type="email" value={email} onChange={e => setEmail(e.target.value)} />
            {profileMsg && <p style={s.msg}>{profileMsg}</p>}
            <button style={s.btn} type="submit" disabled={savingProfile}>
              {savingProfile ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </div>

        {/* Change password */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Change password</div>
          <form onSubmit={handleChangePassword}>
            <label style={s.label}>Current password</label>
            <input style={s.input} type="password" value={pwd.current}
              onChange={e => setPwd(p => ({ ...p, current: e.target.value }))} required />
            <label style={s.label}>New password</label>
            <input style={s.input} type="password" value={pwd.next}
              onChange={e => setPwd(p => ({ ...p, next: e.target.value }))} required minLength={6} />
            <label style={s.label}>Confirm new password</label>
            <input style={s.input} type="password" value={pwd.confirm}
              onChange={e => setPwd(p => ({ ...p, confirm: e.target.value }))} required minLength={6} />
            {pwdMsg && <p style={s.msg}>{pwdMsg}</p>}
            <button style={s.btn} type="submit" disabled={savingPwd}>
              {savingPwd ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>

        {/* Preferences */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Preferences</div>
          <label style={s.label}>Currency</label>
          <select style={s.input} value={currency} onChange={e => handleCurrencyChange(e.target.value)}>
            <option value="INR">₹ INR</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ EUR</option>
            <option value="GBP">£ GBP</option>
          </select>
        </div>

        {/* Export data */}
        <div style={s.card}>
          <div style={s.sectionTitle}>Your data</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
            Download all your transactions as a CSV file.
          </p>
          <button style={s.btnSecondary} onClick={handleExport} disabled={exporting}>
            {exporting ? 'Exporting…' : 'Export as CSV'}
          </button>
        </div>

        {/* Danger zone */}
        <div style={{ ...s.card, border: '1px solid rgba(239,68,68,.3)' }}>
          <div style={{ ...s.sectionTitle, color: '#ef4444' }}>Danger zone</div>
          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14 }}>
            Deleting your account permanently removes all your transactions and budgets. This cannot be undone.
          </p>
          {!showDeleteConfirm ? (
            <button style={s.btnDanger} onClick={() => setShowDeleteConfirm(true)}>
              Delete account
            </button>
          ) : (
            <div>
              <p style={{ fontSize: 13, marginBottom: 10 }}>Are you sure? This is permanent.</p>
              <button style={s.btnDanger} onClick={handleDeleteAccount}>Yes, delete my account</button>
              <button style={{ ...s.btnSecondary, marginLeft: 8 }} onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const s = {
  card: { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 14 },
  userRow: { display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 700 },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 },
  stat: { background: 'var(--surface)', borderRadius: 8, padding: 12, textAlign: 'center' },
  statLabel: { fontSize: 11, color: 'var(--muted)', marginBottom: 4 },
  statValue: { fontSize: 13, fontWeight: 500 },
  sectionTitle: { fontSize: 14, fontWeight: 600, marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6, marginTop: 12 },
  input: { width: '100%', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 12px', color: 'var(--text)', fontSize: 13, outline: 'none' },
  btn: { padding: '10px 18px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', marginTop: 16 },
  btnSecondary: { padding: '10px 18px', background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  btnDanger: { padding: '10px 18px', background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.3)', color: '#ef4444', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' },
  msg: { fontSize: 12, color: 'var(--accent2)', marginTop: 10 },
}