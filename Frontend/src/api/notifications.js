import api from './axios'

export const getNotifications    = ()    => api.get('/notifications')
export const getUnreadCount      = ()    => api.get('/notifications/unread-count')
export const markAllRead         = ()    => api.put('/notifications/mark-all-read')
export const markOneRead         = (id)  => api.put(`/notifications/${id}/read`)
export const deleteResume        = ()    => api.delete('/profile/resume')
