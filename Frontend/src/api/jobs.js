import api from './axios'

// Public
export const searchJobs = (params) => api.get('/jobs', { params })
export const getJob = (id) => api.get(`/jobs/${id}`)

// Employer
export const createJob = (data) => api.post('/jobs', data)
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data)
export const deleteJob = (id) => api.delete(`/jobs/${id}`)
export const getMyListings = () => api.get('/jobs/my-listings')
export const getApplicationsForJob = (jobId) => api.get(`/jobs/${jobId}/applications`)
export const updateApplicationStatus = (appId, status) =>
  api.put(`/jobs/applications/${appId}/status`, { status })
