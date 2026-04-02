import { useEffect, useState } from 'react'
import { getReportSummaryApi } from '../../api/userApi'
import { useAuth } from '../../context/AuthContext'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import StarRating from '../../components/common/StarRating'
import { Users, BookOpen, MessageSquare, Star, TrendingUp, Shield } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function AdminDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReportSummaryApi()
      .then(r => setSummary(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>

  return (
    <div className="animate-slide-up space-y-8">
      <PageHeader
        title={`Admin Panel 🛡️`}
        subtitle={`Signed in as ${user?.name} · Full system access`}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatCard label="Total Users" value={summary?.totalUsers} icon={Users} color="navy" />
        <StatCard label="Students" value={summary?.totalStudents} icon={Users} color="emerald" />
        <StatCard label="Teachers" value={summary?.totalTeachers} icon={Shield} color="amber" />
        <StatCard label="Courses" value={summary?.totalCourses} icon={BookOpen} color="navy" />
        <StatCard label="Feedbacks" value={summary?.totalFeedbacks} icon={MessageSquare} color="emerald" />
        <StatCard label="Avg Rating" value={summary?.overallAverageRating} icon={Star} color="amber" />
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Manage All Feedback', desc: 'View and delete any feedback entry', icon: MessageSquare, to: '/admin/feedback', color: 'violet' },
          { label: 'Manage Users', desc: 'View all students, teachers, admins', icon: Users, to: '/admin/users', color: 'teal' },
          { label: 'Manage Courses', desc: 'Create and remove courses', icon: BookOpen, to: '/admin/courses', color: 'amber' },
        ].map(card => (
          <button
            key={card.to}
            onClick={() => navigate(card.to)}
            className="card p-6 border border-canvas-200 hover:border-canvas-200 text-left group transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center
              ${card.color === 'violet' ? 'bg-navy-50 text-navy-600' :
                card.color === 'teal' ? 'bg-emerald-50 text-emerald-600' :
                'bg-yellow-50 text-gold-600'}`}
            >
              <card.icon size={20} />
            </div>
            <p className="font-semibold text-slate-700 text-sm mb-1">{card.label}</p>
            <p className="text-xs text-slate-500">{card.desc}</p>
            <span className="text-xs text-navy-600 mt-3 block opacity-0 group-hover:opacity-100 transition-opacity">
              Open →
            </span>
          </button>
        ))}
      </div>

      {/* Top rated courses */}
      {summary?.topRatedCourses?.length > 0 && (
        <div className="card border border-canvas-200">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-canvas-200">
            <TrendingUp size={16} className="text-navy-600" />
            <h2 className="font-semibold text-slate-700">Top Rated Courses</h2>
          </div>
          <div className="divide-y divide-canvas-100">
            {summary.topRatedCourses.map((c, i) => (
              <div key={c.courseId} className="flex items-center gap-4 px-6 py-4">
                <span className="text-2xl font-black font-display text-canvas-300 w-6">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700">{c.courseName}</p>
                  <p className="text-xs text-slate-500">{c.feedbackCount} feedbacks</p>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating value={Math.round(c.averageRating)} readOnly size={13} />
                  <span className="text-sm font-bold text-gold-600">{c.averageRating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
