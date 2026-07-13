import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function OAuthCallback() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setTokenFromOAuth } = useAuth()

  useEffect(() => {
    const token = params.get('token')
    if (token) {
      setTokenFromOAuth(token)
      navigate('/')
    } else {
      navigate('/login')
    }
  }, [])

  return (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#0f0f13',color:'#8b8a9e' }}>
      Signing you in…
    </div>
  )
}