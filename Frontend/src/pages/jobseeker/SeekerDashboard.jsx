import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyApplications } from '../../api/seeker'
import styles from './Seeker.module.css'

const statusColor = (s) => {
  if (s === 'ACCEPTED') return styles.badgeAccepted
  if (s === 'REJECTED') return styles.badgeRejected
  if (s === 'REVIEWED') return styles.badgeReviewed
  return styles.badgePending
}

export default function SeekerDashboard() {
  const { user } = useAuth()
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyApplications()
      .then(res => setApps(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const pending  = apps.filter(a => a.status === 'PENDING').length
  const reviewed = apps.filter(a => a.status === 'REVIEWED').length
  const accepted = apps.filter(a => a.status === 'ACCEPTED').length
  const recent   = apps.slice(0, 5)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user?.fullName.split(' ')[0]}</h1>
          <p className={styles.sub}>Track your job search progress</p>
        </div>
        <div className={styles.headerActions}>
          <Link to="/jobs" className={styles.btnPrimary}>Browse Jobs</Link>
          <Link to="/seeker/profile" className={styles.btnOutline}>Edit Profile</Link>
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}><span>{apps.length}</span><p>Total Applied</p></div>
        <div className={styles.stat}><span>{pending}</span><p>Pending</p></div>
        <div className={styles.stat}><span>{reviewed}</span><p>Under Review</p></div>
        <div className={styles.stat}><span>{accepted}</span><p>Accepted</p></div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Recent Applications</h2>
        <Link to="/seeker/applications" className={styles.viewAll}>View all →</Link>
      </div>

      {loading && <p className={styles.info}>Loading...</p>}

      {!loading && apps.length === 0 && (
        <div className={styles.empty}>
          <p>No applications yet.</p>
          <Link to="/jobs" className={styles.btnPrimary} style={{ marginTop: '1rem', display: 'inline-block' }}>
            Find Jobs to Apply
          </Link>
        </div>
      )}

      <div className={styles.appList}>
        {recent.map(app => (
          <div key={app.id} className={styles.appCard}>
            <div className={styles.appLeft}>
              <h3>{app.jobTitle}</h3>
              <p className={styles.meta}>Applied {new Date(app.appliedAt).toLocaleDateString()}</p>
            </div>
            <span className={`${styles.badge} ${statusColor(app.status)}`}>{app.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
