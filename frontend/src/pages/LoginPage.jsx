import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '' })

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(regForm.name, regForm.email, regForm.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>💰</div>
          <div style={s.title}>FinTrack</div>
          <div style={s.sub}>Your smart money companion</div>
          <div style={s.jwtBadge}>🔒 JWT + bcrypt secured</div>
        </div>

        <div style={s.tabs}>
          <button style={{...s.tab, ...(tab==='login' ? s.tabActive : {})}} onClick={() => { setTab('login'); setError('') }}>Sign in</button>
          <button style={{...s.tab, ...(tab==='register' ? s.tabActive : {})}} onClick={() => { setTab('register'); setError('') }}>Create account</button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin}>
            <Field label="Email address" type="email" value={loginForm.email}
              onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
            <Field label="Password" type="password" value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            {error && <p style={s.err}>⚠ {error}</p>}
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
            <p style={s.hint}>Demo: aryan@fintrack.io / aryan123</p>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <Field label="Full name" type="text" value={regForm.name}
              onChange={e => setRegForm(f => ({ ...f, name: e.target.value }))} placeholder="Aryan Sharma" />
            <Field label="Email address" type="email" value={regForm.email}
              onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
            <Field label="Password" type="password" value={regForm.password}
              onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} placeholder="min 6 characters" />
            {error && <p style={s.err}>⚠ {error}</p>}
            {success && <p style={s.ok}>✓ {success}</p>}
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
          </form>
        )}

        <div style={s.apiNote}>
          <strong style={{ color: 'var(--text)' }}>POST /api/auth/{tab === 'login' ? 'login' : 'register'}</strong><br />
          {tab === 'login' ? 'Validates credentials · Issues JWT · Returns user profile' : 'bcrypt hashes password · Stores user · Issues JWT token'}
        </div>
      </div>
    </div>
  )
}

function Field({ label, ...props }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>{label}</label>
      <input required style={s.input} {...props} />
    </div>
  )
}

const s = {
  page: { display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', background:'var(--bg)', padding: 20 },
  card: { background:'var(--card)', border:'1px solid var(--border)', borderRadius: 20, padding: 32, width: 380, maxWidth: '100%' },
  logoWrap: { display:'flex', flexDirection:'column', alignItems:'center', marginBottom: 28 },
  logoIcon: { width:52, height:52, background:'linear-gradient(135deg,#6c63ff,#a78bfa)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:10 },
  title: { fontSize: 22, fontWeight: 700, letterSpacing: '-.5px' },
  sub: { fontSize: 13, color: 'var(--muted)', marginTop: 4 },
  jwtBadge: { marginTop: 8, fontSize: 10, padding: '3px 10px', borderRadius: 20, background: 'rgba(34,197,94,.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,.2)' },
  tabs: { display:'flex', background:'var(--surface)', borderRadius:8, padding:3, marginBottom:24 },
  tab: { flex:1, padding:'8px', borderRadius:6, border:'none', background:'none', color:'var(--muted)', fontSize:13, cursor:'pointer', fontWeight:500 },
  tabActive: { background:'var(--card)', color:'var(--text)' },
  input: { width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', color:'var(--text)', fontSize:13, outline:'none' },
  btn: { width:'100%', padding:12, background:'var(--accent)', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', marginTop:4 },
  err: { color:'var(--red)', fontSize:12, marginBottom:10 },
  ok: { color:'var(--green)', fontSize:12, marginBottom:10 },
  hint: { textAlign:'center', marginTop:12, fontSize:11, color:'var(--sub)' },
  apiNote: { marginTop:16, padding:'10px 12px', background:'var(--surface)', borderRadius:8, fontSize:11, color:'var(--muted)', lineHeight:1.6 },
}
