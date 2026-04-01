import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyListings, deleteJob } from '../../api/jobs'
import styles from './Employer.module.css'

export default function EmployerDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchJobs = async () => {
    try {
      const res = await getMyListings()
      setJobs(res.data)
    } catch {
      setError('Failed to load your listings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this job listing?')) return
    try {
      await deleteJob(id)
      setJobs(jobs.filter(j => j.id !== id))
    } catch {
      alert('Failed to delete the listing.')
    }
  }

  const total = jobs.length
  const open = jobs.filter(j => j.status === 'OPEN').length
  const totalApps = jobs.reduce((sum, j) => sum + (j.applicationCount || 0), 0)

  const statusColor = (s) =>
    s === 'OPEN' ? styles.badgeOpen : s === 'DRAFT' ? styles.badgeDraft : styles.badgeClosed

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1>Welcome back, {user?.fullName.split(' ')[0]}</h1>
          <p className={styles.sub}>Manage your job listings and applications</p>
        </div>
        <Link to="/employer/post-job" className={styles.btnPrimary}>+ Post a Job</Link>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}><span>{total}</span><p>Total Listings</p></div>
        <div className={styles.stat}><span>{open}</span><p>Open</p></div>
        <div className={styles.stat}><span>{totalApps}</span><p>Total Applications</p></div>
      </div>

      <h2 className={styles.sectionTitle}>Your Job Listings</h2>

      {loading && <p className={styles.info}>Loading...</p>}
      {error && <p className={styles.errorMsg}>{error}</p>}
      {!loading && jobs.length === 0 && (
        <div className={styles.empty}>
          <p>No listings yet. <Link to="/employer/post-job">Post your first job →</Link></p>
        </div>
      )}

      <div className={styles.jobList}>
        {jobs.map(job => (
          <div key={job.id} className={styles.jobCard}>
            <div className={styles.jobTop}>
              <div>
                <h3>{job.title}</h3>
                <p className={styles.jobMeta}>{job.location} · {job.industry} · {job.jobType}</p>
              </div>
              <span className={`${styles.badge} ${statusColor(job.status)}`}>{job.status}</span>
            </div>
            <p className={styles.jobDesc}>{job.description.substring(0, 120)}...</p>
            <div className={styles.jobFooter}>
              <span className={styles.appCount}>
                {job.applicationCount} application{job.applicationCount !== 1 ? 's' : ''}
              </span>
              <div className={styles.actions}>
                <Link to={`/employer/applications/${job.id}`} className={styles.btnSecondary}>
                  View Applications
                </Link>
                <Link to={`/employer/edit-job/${job.id}`} className={styles.btnSecondary}>
                  Edit
                </Link>
                <button onClick={() => handleDelete(job.id)} className={styles.btnDanger}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
