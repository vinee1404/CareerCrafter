import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getMyApplications } from '../../api/seeker'
import styles from './Seeker.module.css'

const STATUS_ORDER = ['ALL', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']

const statusColor = (s) => {
  if (s === 'ACCEPTED') return styles.badgeAccepted
  if (s === 'REJECTED') return styles.badgeRejected
  if (s === 'REVIEWED') return styles.badgeReviewed
  return styles.badgePending
}

export default function MyApplications() {
  const location = useLocation()
  const [apps, setApps] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [successMsg, setSuccessMsg] = useState(location.state?.success ? 'Application submitted successfully!' : '')

  useEffect(() => {
    getMyApplications()
      .then(res => setApps(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
    if (successMsg) setTimeout(() => setSuccessMsg(''), 4000)
  }, [])

  const filtered = filter === 'ALL' ? apps : apps.filter(a => a.status === filter)

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>My Applications</h1>
          <p className={styles.sub}>{apps.length} total application{apps.length !== 1 ? 's' : ''}</p>
        </div>
        <Link to="/jobs" className={styles.btnPrimary}>Browse More Jobs</Link>
      </div>

      {successMsg && <div className={styles.successMsg}>{successMsg}</div>}

      <div className={styles.filterTabs}>
        {STATUS_ORDER.map(s => (
          <button
            key={s}
            className={filter === s ? styles.tabActive : styles.tab}
            onClick={() => setFilter(s)}
          >
            {s} {s === 'ALL' ? `(${apps.length})` : `(${apps.filter(a => a.status === s).length})`}
          </button>
        ))}
      </div>

      {loading && <p className={styles.info}>Loading...</p>}
      {!loading && filtered.length === 0 && (
        <div className={styles.empty}>
          <p>{filter === 'ALL' ? "You haven't applied to any jobs yet." : `No ${filter.toLowerCase()} applications.`}</p>
          {filter === 'ALL' && <Link to="/jobs" className={styles.btnPrimary} style={{ marginTop: '1rem', display: 'inline-block' }}>Find Jobs</Link>}
        </div>
      )}

      <div className={styles.appCards}>
        {filtered.map(app => (
          <div key={app.id} className={styles.appCardFull}>
            <div className={styles.appCardTop}>
              <div>
                <h3>{app.jobTitle}</h3>
                <p className={styles.meta}>Applied on {new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span className={`${styles.badge} ${statusColor(app.status)}`}>{app.status}</span>
            </div>

            {app.coverLetter && (
              <details className={styles.coverDetails}>
                <summary>View cover letter</summary>
                <p className={styles.coverText}>{app.coverLetter}</p>
              </details>
            )}

            <div className={styles.appCardFooter}>
              <Link to={`/jobs/${app.jobId}`} className={styles.viewJobLink}>View Job Posting →</Link>
              {app.resumeUrl && (
                <a 
  href={`http://localhost:8080/api/profile/resume/download/${app.resumeUrl}`}
  target="_blank"
  rel="noopener noreferrer"
  className={styles.viewJobLink}
>
  Resume Sent 
</a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
