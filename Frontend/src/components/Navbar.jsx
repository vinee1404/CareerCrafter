import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUnreadCount, getNotifications, markAllRead, markOneRead } from '../api/notifications'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unread, setUnread] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const bellRef = useRef(null)

  // Poll unread count every 30s while logged in
  useEffect(() => {
    if (!user) { setUnread(0); return }
    const fetch = () =>
      getUnreadCount()
        .then(res => setUnread(res.data.count))
        .catch(() => {})
    fetch()
    const interval = setInterval(fetch, 30000)
    return () => clearInterval(interval)
  }, [user])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const openBell = async () => {
    if (!open) {
      try {
        const res = await getNotifications()
        setNotifications(res.data)
      } catch {}
    }
    setOpen(o => !o)
  }

  const handleMarkAll = async () => {
    await markAllRead()
    setUnread(0)
    setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  }

  const handleClickNotification = async (n) => {
    if (!n.read) {
      await markOneRead(n.id)
      setUnread(u => Math.max(0, u - 1))
      setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))
    }
    setOpen(false)
    if (n.link) navigate(n.link)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
    if (diff < 60)   return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>CareerCrafter</Link>

      <div className={styles.links}>
        <Link to="/jobs">Browse Jobs</Link>

        {!user && <>
          <Link to="/login">Login</Link>
          <Link to="/register" className={styles.btnPrimary}>Register</Link>
        </>}

        {user?.role === 'EMPLOYER' && <>
          <Link to="/employer/dashboard">Dashboard</Link>
          <Link to="/employer/post-job">Post a Job</Link>
        </>}

        {user?.role === 'JOB_SEEKER' && <>
          <Link to="/seeker/dashboard">Dashboard</Link>
          <Link to="/seeker/applications">Applications</Link>
          <Link to="/seeker/profile">Profile</Link>
        </>}

        {user && (
          <div className={styles.bellWrap} ref={bellRef}>
            <button className={styles.bell} onClick={openBell} aria-label="Notifications">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unread > 0 && (
                <span className={styles.badge}>{unread > 9 ? '9+' : unread}</span>
              )}
            </button>

            {open && (
              <div className={styles.dropdown}>
                <div className={styles.dropHeader}>
                  <span>Notifications</span>
                  {unread > 0 && (
                    <button onClick={handleMarkAll} className={styles.markAll}>Mark all read</button>
                  )}
                </div>

                {notifications.length === 0 && (
                  <p className={styles.empty}>No notifications yet</p>
                )}

                <ul className={styles.notifList}>
                  {notifications.map(n => (
                    <li
                      key={n.id}
                      className={`${styles.notifItem} ${!n.read ? styles.unreadItem : ''}`}
                      onClick={() => handleClickNotification(n)}
                    >
                      <div className={styles.notifTitle}>{n.title}</div>
                      <div className={styles.notifMsg}>{n.message}</div>
                      <div className={styles.notifTime}>{timeAgo(n.createdAt)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {user && <>
          <span className={styles.userName}>Hi, {user.fullName.split(' ')[0]}</span>
          <button onClick={handleLogout} className={styles.btnLogout}>Logout</button>
        </>}
      </div>
    </nav>
  )
}
