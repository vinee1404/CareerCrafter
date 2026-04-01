import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { searchJobs } from '../api/jobs'
import styles from './Jobs.module.css'

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [filters, setFilters] = useState({ title: '', location: '', industry: '' })
  const [applied, setApplied] = useState({ title: '', location: '', industry: '' })

  const fetchJobs = async (f, p) => {
    setLoading(true)
    try {
      const res = await searchJobs({ ...f, page: p, size: 10 })
      setJobs(res.data.content)
      setTotal(res.data.totalElements)
    } catch {
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs(applied, page) }, [applied, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    setApplied({ ...filters })
  }

  const handleClear = () => {
    const empty = { title: '', location: '', industry: '' }
    setFilters(empty)
    setApplied(empty)
    setPage(0)
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1>Find Your Next Job</h1>
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            placeholder="Job title or keyword"
            value={filters.title}
            onChange={e => setFilters({ ...filters, title: e.target.value })}
          />
          <input
            placeholder="Location"
            value={filters.location}
            onChange={e => setFilters({ ...filters, location: e.target.value })}
          />
          <input
            placeholder="Industry"
            value={filters.industry}
            onChange={e => setFilters({ ...filters, industry: e.target.value })}
          />
          <button type="submit" className={styles.btnSearch}>Search</button>
          <button type="button" className={styles.btnClear} onClick={handleClear}>Clear</button>
        </form>
      </div>

      <div className={styles.results}>
        <p className={styles.resultCount}>{loading ? 'Loading...' : `${total} job${total !== 1 ? 's' : ''} found`}</p>

        {!loading && jobs.length === 0 && (
          <div className={styles.empty}><p>No jobs match your search. Try different keywords.</p></div>
        )}

        <div className={styles.jobGrid}>
          {jobs.map(job => (
            <Link to={`/jobs/${job.id}`} key={job.id} className={styles.jobCard}>
              <div className={styles.cardTop}>
                <h3>{job.title}</h3>
                <span className={styles.jobType}>{job.jobType.replace('_', ' ')}</span>
              </div>
              <p className={styles.company}>{job.employerName}</p>
              <p className={styles.meta}>{job.location} · {job.industry}</p>
              {job.salaryRange && <p className={styles.salary}>{job.salaryRange}</p>}
              <p className={styles.desc}>{job.description.substring(0, 100)}...</p>
              <p className={styles.date}>{new Date(job.createdAt).toLocaleDateString()}</p>
            </Link>
          ))}
        </div>

        {total > 10 && (
          <div className={styles.pagination}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>← Prev</button>
            <span>Page {page + 1} of {Math.ceil(total / 10)}</span>
            <button disabled={(page + 1) * 10 >= total} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>Next →</button>
          </div>
        )}
      </div>
    </div>
  )
}
