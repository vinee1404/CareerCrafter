import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Unauthorized from './pages/Unauthorized'
import BrowseJobs from './pages/BrowseJobs'
import JobDetail from './pages/JobDetail'
import Notifications from './pages/Notifications'
import EmployerDashboard from './pages/employer/EmployerDashboard'
import PostJob from './pages/employer/PostJob'
import ViewApplications from './pages/employer/ViewApplications'
import SeekerDashboard from './pages/jobseeker/SeekerDashboard'
import EditProfile from './pages/jobseeker/EditProfile'
import ApplyJob from './pages/jobseeker/ApplyJob'
import MyApplications from './pages/jobseeker/MyApplications'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/jobs" element={<BrowseJobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />

          {/* Authenticated — any role */}
          <Route path="/notifications" element={
            <ProtectedRoute allowedRoles={['EMPLOYER', 'JOB_SEEKER']}>
              <Notifications />
            </ProtectedRoute>
          } />

          {/* Employer */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/employer/post-job" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/employer/edit-job/:id" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <PostJob />
            </ProtectedRoute>
          } />
          <Route path="/employer/applications/:jobId" element={
            <ProtectedRoute allowedRoles={['EMPLOYER']}>
              <ViewApplications />
            </ProtectedRoute>
          } />

          {/* Job Seeker */}
          <Route path="/seeker/dashboard" element={
            <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
              <SeekerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/seeker/profile" element={
            <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
              <EditProfile />
            </ProtectedRoute>
          } />
          <Route path="/seeker/apply/:jobId" element={
            <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
              <ApplyJob />
            </ProtectedRoute>
          } />
          <Route path="/seeker/applications" element={
            <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
              <MyApplications />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
