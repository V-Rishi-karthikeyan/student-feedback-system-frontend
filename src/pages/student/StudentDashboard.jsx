import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyFeedbackApi } from '../../api/feedbackApi'
import { getAllCoursesApi } from '../../api/courseApi'
import StatCard from '../../components/common/StatCard'
import StarRating from '../../components/common/StarRating'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import { MessageSquare, BookOpen, Star, PlusCircle, TrendingUp } from 'lucide-react'

export default function StudentDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getMyFeedbackApi(), getAllCoursesApi()])
      .then(([fbRes, cRes]) => {
        setFeedbacks(fbRes.data)
        setCourses(cRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : '—'

  const recent = feedbacks.slice(0, 5)

  if (loading) return (
    <div className="flex justify-center items-center h-64"><Spinner /></div>
  )

  return (
    <div className="animate-slide-up space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0]} 👋`}
        subtitle="Track your course feedback and discover new courses"
        action={
          <button onClick={() => navigate('/student/submit-feedback')} className="btn-primary">
            <PlusCircle size={16} /> Submit Feedback
          </button>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Feedbacks Submitted" value={feedbacks.length} icon={MessageSquare} color="navy" />
        <StatCard label="Courses Available" value={courses.length} icon={BookOpen} color="emerald" />
        <StatCard label="Avg Rating Given" value={avgRating} icon={Star} color="amber" />
      </div>

      {/* Recent feedback */}
      <div className="card border border-canvas-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-canvas-200">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-navy-600" />
            <h2 className="font-semibold text-slate-700">Recent Feedback</h2>
          </div>
          <button onClick={() => navigate('/student/my-feedback')} className="text-xs text-navy-600 hover:text-navy-600">
            View all →
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            title="No feedback yet"
            subtitle="Submit your first feedback for a course"
            icon={MessageSquare}
          />
        ) : (
          <div className="divide-y divide-canvas-100">
            {recent.map(fb => (
              <div key={fb.id} className="flex items-start justify-between px-6 py-4 hover:bg-canvas-50 transition-colors">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{fb.courseName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{fb.comments || 'No comment'}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StarRating value={fb.rating} readOnly size={14} />
                  <span className="text-[10px] text-canvas-400">
                    {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Available Courses */}
      <div className="card border border-canvas-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-canvas-200">
          <BookOpen size={16} className="text-emerald-600" />
          <h2 className="font-semibold text-slate-700">Available Courses</h2>
        </div>
        {courses.length === 0 ? (
          <EmptyState title="No courses available" icon={BookOpen} />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.04]">
            {courses.slice(0, 6).map(c => (
              <div key={c.id} className="bg-canvas-50 p-5 hover:bg-canvas-100 transition-colors">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-3">
                  <BookOpen size={16} className="text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-700 text-sm">{c.courseName}</p>
                <p className="text-xs text-slate-500 mt-1">Course ID: {c.id}</p>
                <button
                  onClick={() => navigate('/student/submit-feedback', { state: { courseId: c.id } })}
                  className="mt-3 text-xs text-navy-600 hover:text-navy-600 font-medium"
                >
                  Give feedback →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
