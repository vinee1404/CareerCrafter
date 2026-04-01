import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getJob } from '../../api/jobs'
import { applyToJob, getMyProfile, checkHasApplied } from '../../api/seeker'
import styles from './Seeker.module.css'

export default function ApplyJob() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [profile, setProfile] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [alreadyApplied, setAlreadyApplied] = useState(false)

  useEffect(() => {
    Promise.all([getJob(jobId), getMyProfile(), checkHasApplied(jobId)])
      .then(([jobRes, profileRes, appliedRes]) => {
        setJob(jobRes.data)
        setProfile(profileRes.data)
        setAlreadyApplied(appliedRes.data.applied)
      })
      .catch(() => setError('Failed to load job details.'))
      .finally(() => setLoading(false))
  }, [jobId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await applyToJob(jobId, { coverLetter })
      navigate('/seeker/applications', { state: { success: true } })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className={styles.info}>Loading...</p>

  if (alreadyApplied) return (
    <div className={styles.page}>
      <div className={styles.alreadyApplied}>
        <h2>Already Applied</h2>
        <p>You have already submitted an application for <strong>{job?.title}</strong>.</p>
        <Link to="/seeker/applications" className={styles.btnPrimary}>View My Applications</Link>
      </div>
    </div>
  )

  return (
    <div className={styles.page}>
      <Link to={`/jobs/${jobId}`} className={styles.backLink}>← Back to Job</Link>
      <h1>Apply for {job?.title}</h1>
      <p className={styles.sub}>{job?.employerName} · {job?.location}</p>

      {error && <div className={styles.errorMsg}>{error}</div>}

      {!profile?.resumeFileName && (
        <div className={styles.warningBox}>
          No resume on your profile yet.{' '}
          <Link to="/seeker/profile">Upload one here</Link> before applying — it will be sent to the employer.
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.section}>
          <h2>Your Details</h2>
          <div className={styles.detailsPreview}>
            <div className={styles.previewItem}><span>Name</span><p>{profile?.fullName}</p></div>
            <div className={styles.previewItem}><span>Email</span><p>{profile?.email}</p></div>
            <div className={styles.previewItem}><span>Skills</span><p>{profile?.skills || '—'}</p></div>
            <div className={styles.previewItem}>
              <span>Resume</span>
              <p>{profile?.resumeFileName
                ? <a 
  href={`http://localhost:8080/api/profile/resume/download/${profile.resumeFileName}`} 
  target="_blank" 
  rel="noopener noreferrer"
>
  View resume ↗
</a>
                : 'Not uploaded'
              }</p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Cover Letter <span className={styles.optional}>(optional)</span></h2>
          <div className={styles.formGroup}>
            <textarea
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              rows={7}
              placeholder={`Dear Hiring Team,\n\nI am excited to apply for the ${job?.title} position...`}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.btnOutline} onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className={styles.btnPrimary} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  )
}
