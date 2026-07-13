import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '' })

  const switchMode = () => {
    setMode(m => (m === 'login' ? 'register' : 'login'))
    setError('')
  }

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

  const handleGoogleLogin = () => {
    // window.location.href = `${import.meta.env.VITE_API_URL}/oauth2/authorization/google`
    console.log('Google login not wired up yet')
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>💰</div>
          <div style={s.title}>FinTrack</div>
          <div style={s.sub}>Your smart money companion</div>
        </div>

        <div style={s.formTitle}>{mode === 'login' ? 'Sign in' : 'Create account'}</div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <Field label="Email address" type="email" value={loginForm.email}
              onChange={e => setLoginForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" />
            <Field label="Password" type="password" value={loginForm.password}
              onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
            {error && <p style={s.err}>⚠ {error}</p>}
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
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
            <button style={s.btn} type="submit" disabled={loading}>{loading ? 'Creating account…' : 'Create account'}</button>
          </form>
        )}

        <p style={s.switchText}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <span style={s.switchLink} onClick={switchMode}>Register here</span>
            </>
          ) : (
            <>Already have an account?{' '}
              <span style={s.switchLink} onClick={switchMode}>Sign in</span>
            </>
          )}
        </p>

        <div style={s.divider}>
          <div style={s.dividerLine} />
          <span style={s.dividerText}>OR CONTINUE WITH</span>
          <div style={s.dividerLine} />
        </div>

        <button style={s.googleBtn} type="button" onClick={handleGoogleLogin}>
          <svg width="16" height="16" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.7-2.4 3.6v3h3.9c2.3-2.1 3.5-5.2 3.5-8.8z"/>
            <path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.1-4 1.1-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1C3.4 21.4 7.4 24 12 24z"/>
            <path fill="#FBBC05" d="M5.4 14.3c-.2-.7-.4-1.4-.4-2.3s.1-1.6.4-2.3V6.6H1.4C.5 8.3 0 10.1 0 12s.5 3.7 1.4 5.4l4-3.1z"/>
            <path fill="#EA4335" d="M12 4.8c1.7 0 3.3.6 4.5 1.7l3.4-3.4C17.9 1.2 15.2 0 12 0 7.4 0 3.4 2.6 1.4 6.6l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"/>
          </svg>
          Sign in with Google
        </button>
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
  logoWrap: { display:'flex', flexDirection:'column', alignItems:'center', marginBottom: 20 },
  logoIcon: { width:52, height:52, background:'linear-gradient(135deg,#6c63ff,#a78bfa)', borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, marginBottom:10 },
  title: { fontSize: 22, fontWeight: 700, letterSpacing: '-.5px' },
  sub: { fontSize: 13, color: 'var(--muted)', marginTop: 4 },
  formTitle: { fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 18 },
  input: { width:'100%', background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, padding:'10px 12px', color:'var(--text)', fontSize:13, outline:'none' },
  btn: { width:'100%', padding:12, background:'var(--accent)', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor:'pointer', marginTop:4 },
  err: { color:'var(--red)', fontSize:12, marginBottom:10 },
  switchText: { textAlign:'center', fontSize:12.5, color:'var(--muted)', marginTop:16 },
  switchLink: { color:'var(--accent)', fontWeight:600, cursor:'pointer' },
  divider: { display:'flex', alignItems:'center', gap:10, margin:'20px 0' },
  dividerLine: { flex:1, height:1, background:'var(--border)' },
  dividerText: { fontSize:10, color:'var(--muted)', letterSpacing:.5 },
  googleBtn: { width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10, padding:11, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:8, color:'var(--text)', fontSize:13, fontWeight:600, cursor:'pointer' },
}