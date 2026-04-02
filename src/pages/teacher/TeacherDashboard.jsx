import { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getTeacherReportApi } from '../../api/userApi'
import { getMyCourseApi } from '../../api/courseApi'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import StarRating from '../../components/common/StarRating'
import { BookOpen, MessageSquare, Star, TrendingUp, BarChart3 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function TeacherDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [report, setReport] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getTeacherReportApi(), getMyCourseApi()])
      .then(([rRes, cRes]) => { setReport(rRes.data); setCourses(cRes.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>

  return (
    <div className="animate-slide-up space-y-8">
      <PageHeader
        title={`Hello, ${user?.name?.split(' ')[0]} 📚`}
        subtitle="Monitor your course feedback and student engagement"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="My Courses" value={report?.totalCourses ?? courses.length} icon={BookOpen} color="emerald" />
        <StatCard label="Total Feedbacks" value={report?.totalFeedbacks ?? 0} icon={MessageSquare} color="navy" />
        <StatCard label="Overall Avg Rating" value={report?.overallAverageRating ?? '—'} icon={Star} color="amber" />
      </div>

      {/* Course breakdown */}
      <div className="card border border-canvas-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-canvas-200">
          <BarChart3 size={16} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-700">Course Breakdown</h2>
        </div>

        {!report?.courseReports?.length ? (
          <EmptyState title="No feedback received yet" subtitle="Share your course with students to get started" icon={TrendingUp} />
        ) : (
          <div className="divide-y divide-canvas-100">
            {report.courseReports.map(cr => (
              <div key={cr.courseId} className="flex items-center justify-between px-6 py-4 hover:bg-canvas-50 transition-colors group">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{cr.courseName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{cr.totalFeedbacks} feedback{cr.totalFeedbacks !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <StarRating value={Math.round(cr.averageRating)} readOnly size={13} />
                    <p className="text-xs text-slate-500 mt-0.5">{cr.averageRating} avg</p>
                  </div>
                  <button
                    onClick={() => navigate('/teacher/course-feedback', { state: { courseId: cr.courseId } })}
                    className="text-xs text-navy-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-navy-600"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
