import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import styles from './Home.module.css'

export default function Home() {
  const { user } = useAuth()

  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1>Find Your Next Career Move</h1>
        <p>CareerCrafter connects talented job seekers with great employers. Browse thousands of listings or post your openings today.</p>
        <div className={styles.actions}>
          <Link to="/jobs" className={styles.btnPrimary}>Browse Jobs</Link>
          {!user && <Link to="/register" className={styles.btnOutline}>Get Started</Link>}
          {user?.role === 'EMPLOYER' && <Link to="/employer/post-job" className={styles.btnOutline}>Post a Job</Link>}
          {user?.role === 'JOB_SEEKER' && <Link to="/seeker/dashboard" className={styles.btnOutline}>My Dashboard</Link>}
        </div>
      </div>
    </div>
  )
}
