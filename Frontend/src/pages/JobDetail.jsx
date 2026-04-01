import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getJob } from '../api/jobs'
import { useAuth } from '../context/AuthContext'
import styles from './Jobs.module.css'

export default function JobDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getJob(id)
      .then(res => setJob(res.data))
      .catch(() => navigate('/jobs'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p style={{ padding: '2rem' }}>Loading...</p>
  if (!job) return null

  return (
    <div className={styles.detailPage}>
      <Link to="/jobs" className={styles.backLink}>← Back to Jobs</Link>

      <div className={styles.detailCard}>
        <div className={styles.detailHeader}>
          <div>
            <h1>{job.title}</h1>
            <p className={styles.company}>{job.employerName}</p>
            <div className={styles.tags}>
              <span>{job.location}</span>
              <span>{job.industry}</span>
              <span>{job.jobType.replace('_', ' ')}</span>
              {job.salaryRange && <span>{job.salaryRange}</span>}
            </div>
          </div>
          {user?.role === 'JOB_SEEKER' && (
            <Link to={`/seeker/apply/${job.id}`} className={styles.btnApply}>Apply Now</Link>
          )}
          {!user && (
            <Link to="/login" className={styles.btnApply}>Login to Apply</Link>
          )}
        </div>

        <hr className={styles.divider} />

        <section className={styles.section}>
          <h2>About the Role</h2>
          <p>{job.description}</p>
        </section>

        <section className={styles.section}>
          <h2>Qualifications</h2>
          <p>{job.qualifications}</p>
        </section>

        <div className={styles.postedDate}>
          Posted {new Date(job.createdAt).toLocaleDateString()}
          · {job.applicationCount} applicant{job.applicationCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
