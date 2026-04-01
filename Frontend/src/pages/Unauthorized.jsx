import { Link } from 'react-router-dom'

export default function Unauthorized() {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <h1 style={{ fontSize: '2rem', color: '#111827' }}>Access Denied</h1>
      <p style={{ color: '#6b7280', marginTop: '0.75rem' }}>You don't have permission to view this page.</p>
      <Link to="/" style={{ color: '#4f46e5', fontWeight: 600, marginTop: '1.5rem', display: 'inline-block' }}>
        Go Home
      </Link>
    </div>
  )
}
