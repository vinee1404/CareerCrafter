import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../../api/auth'
import { useAuth } from '../../context/AuthContext'
import styles from './Auth.module.css'

export default function Register() {
  const navigate = useNavigate()
  const { saveUser } = useAuth()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: 'JOB_SEEKER' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await register(form)
      const { token, ...userData } = res.data
      saveUser(userData, token)
      navigate(userData.role === 'EMPLOYER' ? '/employer/dashboard' : '/seeker/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h1 className={styles.title}>Create an account</h1>
        <p className={styles.subtitle}>Join CareerCrafter today</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Full Name</label>
          <input
            name="fullName"
            type="text"
            placeholder="Jane Doe"
            value={form.fullName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            name="email"
            type="email"
            placeholder="jane@example.com"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            name="password"
            type="password"
            placeholder="Min. 6 characters"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />

          <label>I am a...</label>
          <div className={styles.roleToggle}>
            <button
              type="button"
              className={form.role === 'JOB_SEEKER' ? styles.roleActive : styles.roleBtn}
              onClick={() => setForm({ ...form, role: 'JOB_SEEKER' })}
            >
              Job Seeker
            </button>
            <button
              type="button"
              className={form.role === 'EMPLOYER' ? styles.roleActive : styles.roleBtn}
              onClick={() => setForm({ ...form, role: 'EMPLOYER' })}
            >
              Employer
            </button>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className={styles.switchText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}
