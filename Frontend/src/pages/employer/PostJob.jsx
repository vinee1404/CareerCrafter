import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createJob, updateJob, getJob } from '../../api/jobs'
import styles from './Employer.module.css'

const EMPTY = {
  title: '', description: '', qualifications: '',
  location: '', industry: '', jobType: 'FULL_TIME',
  salaryRange: '', status: 'OPEN'
}

export default function PostJob() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    getJob(id)
      .then(res => setForm({
        title: res.data.title,
        description: res.data.description,
        qualifications: res.data.qualifications,
        location: res.data.location,
        industry: res.data.industry,
        jobType: res.data.jobType,
        salaryRange: res.data.salaryRange || '',
        status: res.data.status
      }))
      .catch(() => setError('Failed to load job.'))
      .finally(() => setFetching(false))
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isEdit) {
        await updateJob(id, form)
      } else {
        await createJob(form)
      }
      navigate('/employer/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) return <p className={styles.info}>Loading...</p>

  return (
    <div className={styles.page}>
      <h1>{isEdit ? 'Edit Job Listing' : 'Post a New Job'}</h1>
      <p className={styles.sub}>{isEdit ? 'Update your listing details' : 'Fill in the details below to publish your opening'}</p>

      {error && <div className={styles.errorMsg}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Job Title *</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Frontend Developer" required />
          </div>
          <div className={styles.formGroup}>
            <label>Location *</label>
            <input name="location" value={form.location} onChange={handleChange} placeholder="e.g. Chennai, Remote" required />
          </div>
          <div className={styles.formGroup}>
            <label>Industry *</label>
            <input name="industry" value={form.industry} onChange={handleChange} placeholder="e.g. Technology, Finance" required />
          </div>
          <div className={styles.formGroup}>
            <label>Job Type *</label>
            <select name="jobType" value={form.jobType} onChange={handleChange}>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Salary Range</label>
            <input name="salaryRange" value={form.salaryRange} onChange={handleChange} placeholder="e.g. ₹8–12 LPA" />
          </div>
          <div className={styles.formGroup}>
            <label>Status *</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="OPEN">Open</option>
              <option value="DRAFT">Draft</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>Job Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            placeholder="Describe the role, responsibilities, and what a day looks like..."
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Qualifications *</label>
          <textarea
            name="qualifications"
            value={form.qualifications}
            onChange={handleChange}
            rows={4}
            placeholder="Required skills, education, years of experience..."
            required
          />
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.btnOutline} onClick={() => navigate('/employer/dashboard')}>
            Cancel
          </button>
          <button type="submit" className={styles.btnPrimary} disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Listing' : 'Post Job'}
          </button>
        </div>
      </form>
    </div>
  )
}
