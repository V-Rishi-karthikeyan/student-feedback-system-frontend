import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './routes/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

// Auth
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Student
import StudentDashboard from './pages/student/StudentDashboard'
import SubmitFeedback from './pages/student/SubmitFeedback'
import MyFeedback from './pages/student/MyFeedback'

// Teacher
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import CourseFeedback from './pages/teacher/CourseFeedback'
import TeacherReport from './pages/teacher/TeacherReport'

// Admin
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageFeedback from './pages/admin/ManageFeedback'
import ManageUsers from './pages/admin/ManageUsers'
import ManageCourses from './pages/admin/ManageCourses'

// Misc
import Unauthorized from './pages/Unauthorized'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Student */}
          <Route path="/student" element={
            <ProtectedRoute roles={['STUDENT']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"        element={<StudentDashboard />} />
            <Route path="submit-feedback"  element={<SubmitFeedback />} />
            <Route path="my-feedback"      element={<MyFeedback />} />
          </Route>

          {/* Teacher */}
          <Route path="/teacher" element={
            <ProtectedRoute roles={['TEACHER']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard"       element={<TeacherDashboard />} />
            <Route path="course-feedback" element={<CourseFeedback />} />
            <Route path="report"          element={<TeacherReport />} />
          </Route>

          {/* Admin */}
          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="feedback"  element={<ManageFeedback />} />
            <Route path="users"     element={<ManageUsers />} />
            <Route path="courses"   element={<ManageCourses />} />
          </Route>

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
