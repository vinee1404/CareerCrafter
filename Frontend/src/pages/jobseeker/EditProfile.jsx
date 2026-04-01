import { useEffect, useState } from 'react'
import { getMyProfile, saveProfile, uploadResume } from '../../api/seeker'
import { deleteResume } from '../../api/notifications'
import styles from './Seeker.module.css'

const EMPTY = {
  phone: '', location: '', headline: '',
  summary: '', education: '', experience: '', skills: ''
}

export default function EditProfile() {
  const [form, setForm]                 = useState(EMPTY)
  const [resumeFileName, setResume]     = useState(null)
  const [loading, setLoading]           = useState(true)
  const [saving, setSaving]             = useState(false)
  const [uploading, setUploading]       = useState(false)
  const [deleting, setDeleting]         = useState(false)
  const [saved, setSaved]               = useState(false)
  const [error, setError]               = useState('')

  useEffect(() => {
    getMyProfile()
      .then(res => {
        const d = res.data
        setForm({
          phone:      d.phone      || '',
          location:   d.location   || '',
          headline:   d.headline   || '',
          summary:    d.summary    || '',
          education:  d.education  || '',
          experience: d.experience || '',
          skills:     d.skills     || '',
        })
        setResume(d.resumeFileName || null)
      })
      .catch(() => setError('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true); setSaved(false); setError('')
    try {
      await saveProfile(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Resume must be under 5MB.'); return }
    setUploading(true); setError('')
    try {
      const res = await uploadResume(file)
      setResume(res.data.resumeFileName)
    } catch {
      setError('Failed to upload resume.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteResume = async () => {
    if (!window.confirm('Delete your uploaded resume?')) return
    setDeleting(true)
    try {
      await deleteResume()
      setResume(null)
    } catch {
      setError('Failed to delete resume.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <p className={styles.info}>Loading profile...</p>

  return (
    <div className={styles.page}>
      <h1>My Profile</h1>
      <p className={styles.sub}>Keep your profile updated to stand out to employers</p>

      {error && <div className={styles.errorMsg}>{error}</div>}
      {saved && <div className={styles.successMsg}>Profile saved successfully!</div>}

      <form onSubmit={handleSave} className={styles.form}>

        <div className={styles.section}>
          <h2>Basic Info</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Phone</label>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
            </div>
            <div className={styles.formGroup}>
              <label>Location</label>
              <input name="location" value={form.location} onChange={handleChange} placeholder="Chennai, India" />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Professional Headline</label>
            <input name="headline" value={form.headline} onChange={handleChange}
              placeholder="e.g. Final Year CS Student | Aspiring Full Stack Developer" />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Summary</h2>
          <div className={styles.formGroup}>
            <label>About You</label>
            <textarea name="summary" value={form.summary} onChange={handleChange} rows={4}
              placeholder="A brief paragraph about yourself, your goals, and what you bring to the table..." />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Education</h2>
          <div className={styles.formGroup}>
            <label>Education Details</label>
            <textarea name="education" value={form.education} onChange={handleChange} rows={4}
              placeholder={"B.Tech Computer Science — XYZ College (2022–2026)\nRelevant coursework: DSA, DBMS, OS, Networks"} />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Work Experience</h2>
          <div className={styles.formGroup}>
            <label>Experience</label>
            <textarea name="experience" value={form.experience} onChange={handleChange} rows={5}
              placeholder={"Software Intern — ABC Corp (Jun–Aug 2024)\n- Built REST APIs using Spring Boot\n- Deployed on AWS EC2"} />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Skills</h2>
          <div className={styles.formGroup}>
            <label>Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange}
              placeholder="Java, Spring Boot, React, MySQL, Git" />
          </div>
        </div>

        <div className={styles.section}>
          <h2>Resume</h2>
          <div className={styles.resumeBox}>
            {resumeFileName ? (
              <div className={styles.resumeExisting}>
                <span>📄 Resume uploaded</span>
                <div className={styles.resumeActions}>
                  <a 
  href={`http://localhost:8080/api/profile/resume/download/${resumeFileName}`}
  target="_blank"
  rel="noopener noreferrer"
  className={styles.resumeLink}
>
  View / Download 
</a>
                  <button type="button" onClick={handleDeleteResume}
                    className={styles.deleteResumeBtn} disabled={deleting}>
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ) : (
              <p className={styles.noResume}>No resume uploaded yet</p>
            )}

            <label className={styles.uploadBtn}>
              {uploading ? 'Uploading...' : resumeFileName ? 'Replace Resume' : 'Upload Resume (PDF)'}
              <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload}
                style={{ display: 'none' }} disabled={uploading} />
            </label>
            <p className={styles.uploadHint}>PDF, DOC or DOCX — max 5MB. Attached automatically to all your applications.</p>
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.btnPrimary} disabled={saving}>
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
