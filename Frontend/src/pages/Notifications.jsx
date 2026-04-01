import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNotifications, markAllRead, markOneRead } from '../api/notifications'
import styles from './Notifications.module.css'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    getNotifications()
      .then(res => setNotifications(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleMarkAll = async () => {
    await markAllRead()
    setNotifications(ns => ns.map(n => ({ ...n, read: true })))
  }

  const handleClick = async (n) => {
    if (!n.read) {
      await markOneRead(n.id)
      setNotifications(ns => ns.map(x => x.id === n.id ? { ...x, read: true } : x))
    }
    if (n.link) navigate(n.link)
  }

  const timeAgo = (dateStr) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000
    if (diff < 60)    return 'just now'
    if (diff < 3600)  return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    return `${Math.floor(diff / 86400)} days ago`
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Notifications</h1>
          <p className={styles.sub}>{unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} className={styles.btnOutline}>Mark all as read</button>
        )}
      </div>

      {loading && <p className={styles.info}>Loading...</p>}

      {!loading && notifications.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <p>No notifications yet</p>
          <span>You'll see updates about your applications and listings here.</span>
        </div>
      )}

      <div className={styles.list}>
        {notifications.map(n => (
          <div
            key={n.id}
            className={`${styles.item} ${!n.read ? styles.unread : ''}`}
            onClick={() => handleClick(n)}
          >
            <div className={styles.dot}>{!n.read && <span className={styles.unreadDot} />}</div>
            <div className={styles.content}>
              <div className={styles.title}>{n.title}</div>
              <div className={styles.message}>{n.message}</div>
              <div className={styles.time}>{timeAgo(n.createdAt)}</div>
            </div>
            {n.link && <div className={styles.arrow}>→</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
