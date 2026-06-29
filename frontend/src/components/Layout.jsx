import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Layout.module.css'

const navItems = [
  { to: '/', icon: 'ti-layout-dashboard', label: 'Dashboard', end: true },
  { to: '/transactions', icon: 'ti-arrows-exchange', label: 'Transactions' },
  { to: '/budget', icon: 'ti-target', label: 'Budget' },
  { to: '/analytics', icon: 'ti-chart-bar', label: 'Analytics' },
  { to: '/profile', icon: 'ti-user', label: 'Profile' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U'

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>💰</div>
          <div>
            <div className={styles.logoName}>FinTrack</div>
            <div className={styles.logoSub}>Money Tracker</div>
          </div>
        </div>

        <span className={styles.navLabel}>Main</span>
        <nav>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ''}`
              }
            >
              <i className={`ti ${item.icon}`} aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <span className={styles.navLabel} style={{ marginTop: '8px' }}>Account</span>
        <button className={styles.navItem} onClick={handleLogout}>
          <i className="ti ti-logout" aria-hidden="true" />
          Sign out
        </button>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>{initials}</div>
            <div>
              <div className={styles.userName}>{user?.name?.split(' ')[0]}</div>
              <div className={styles.userEmail}>{user?.email}</div>
            </div>
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <Outlet />
      </div>
    </div>
  )
}
