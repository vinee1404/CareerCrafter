import api from './axios'

export const getMyProfile = () => api.get('/profile')
export const saveProfile = (data) => api.put('/profile', data)
export const uploadResume = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/profile/resume', form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export const applyToJob = (jobId, data) => api.post(`/seeker/apply/${jobId}`, data)
export const getMyApplications = () => api.get('/seeker/applications')
export const checkHasApplied = (jobId) => api.get(`/seeker/has-applied/${jobId}`)
