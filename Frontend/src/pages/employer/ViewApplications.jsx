import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApplicationsForJob, updateApplicationStatus, getJob } from '../../api/jobs'
import api from '../../api/axios'
import styles from './Employer.module.css'

const STATUS_OPTIONS = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']

const statusColor = (s) => {
  if (s === 'ACCEPTED') return styles.badgeOpen
  if (s === 'REJECTED') return styles.badgeClosed
  if (s === 'REVIEWED') return styles.badgeDraft
  return styles.badgePending
}

export default function ViewApplications() {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [apps, setApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([getJob(jobId), getApplicationsForJob(jobId)])
      .then(([jobRes, appsRes]) => {
        setJob(jobRes.data)
        setApps(appsRes.data)
      })
      .catch(() => setError('Failed to load applications.'))
      .finally(() => setLoading(false))
  }, [jobId])

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await updateApplicationStatus(appId, newStatus)
      setApps(apps.map(a => a.id === appId ? res.data : a))
    } catch {
      alert('Failed to update status.')
    }
  }

  // 🔥 FINAL DOWNLOAD FUNCTION
  const downloadResume = async (fileName) => {
    console.log("Resume URL:", fileName)

    try {
      // ⚠️ IMPORTANT: Adjust this path based on your backend
      const res = await api.get(`/profile/resume/download/${fileName}`, {
        responseType: "blob",
      })

      // Optional: get file name from backend header
      const contentDisposition = res.headers['content-disposition']
      let file = "resume.pdf"

      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?(.+)"?/)
        if (match?.[1]) file = match[1]
      }

      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", file)
      document.body.appendChild(link)
      link.click()

      window.URL.revokeObjectURL(url)

    } catch (err) {
      console.error("Download failed:", err)
      console.log("STATUS:", err.response?.status)
      console.log("DATA:", err.response?.data)
      alert("Failed to download resume")
    }
  }

  if (loading) return <p className={styles.info}>Loading...</p>
  if (error) return <p className={styles.errorMsg}>{error}</p>

  return (
    <div className={styles.page}>
      <Link to="/employer/dashboard" className={styles.backLink}>
        ← Back to Dashboard
      </Link>

      <h1>{job?.title}</h1>

      <p className={styles.sub}>
        {job?.location} · {job?.industry} · {apps.length} application{apps.length !== 1 ? 's' : ''}
      </p>

      {apps.length === 0 && (
        <div className={styles.empty}>
          <p>No applications yet for this listing.</p>
        </div>
      )}

      <div className={styles.appList}>
        {apps.map(app => (
          <div key={app.id} className={styles.appCard}>

            <div className={styles.appTop}>
              <div>
                <h3>{app.applicantName}</h3>
                <p className={styles.jobMeta}>{app.applicantEmail}</p>
                <p className={styles.appliedDate}>
                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>

              <div className={styles.appRight}>
                <span className={`${styles.badge} ${statusColor(app.status)}`}>
                  {app.status}
                </span>

                <select
                  className={styles.statusSelect}
                  value={app.status}
                  onChange={(e) => handleStatusChange(app.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {app.coverLetter && (
              <div className={styles.coverLetter}>
                <p className={styles.coverLabel}>Cover Letter</p>
                <p>{app.coverLetter}</p>
              </div>
            )}

            {/* 🔥 FINAL FIXED DOWNLOAD BUTTON */}
            {app.resumeUrl && (
              <button
                onClick={() => downloadResume(app.resumeUrl)}
                className={styles.resumeLink}
              >
                Download Resume ↗
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  )
}