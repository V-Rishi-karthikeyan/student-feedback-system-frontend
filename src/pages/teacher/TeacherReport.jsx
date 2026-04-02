import { useEffect, useState } from 'react'
import { getTeacherReportApi } from '../../api/userApi'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import StarRating from '../../components/common/StarRating'
import { BarChart3, BookOpen, MessageSquare, Star, TrendingUp } from 'lucide-react'

export default function TeacherReport() {
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeacherReportApi()
      .then(r => setReport(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center items-center h-64"><Spinner /></div>
  if (!report) return <EmptyState title="Report unavailable" icon={BarChart3} />

  const maxFeedback = Math.max(...(report.courseReports?.map(c => c.totalFeedbacks) || [1]), 1)

  return (
    <div className="animate-slide-up space-y-8">
      <PageHeader
        title="My Performance Report"
        subtitle={`Teaching report for ${report.teacherName}`}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Courses" value={report.totalCourses} icon={BookOpen} color="emerald" />
        <StatCard label="Total Feedbacks" value={report.totalFeedbacks} icon={MessageSquare} color="navy" />
        <StatCard label="Overall Rating" value={`${report.overallAverageRating} / 5`} icon={Star} color="amber" />
      </div>

      {/* Rating bar per course */}
      <div className="card border border-canvas-200">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-canvas-200">
          <TrendingUp size={16} className="text-navy-600" />
          <h2 className="font-semibold text-slate-700">Course Performance</h2>
        </div>

        {!report.courseReports?.length ? (
          <EmptyState title="No course data" icon={BookOpen} />
        ) : (
          <div className="p-6 space-y-5">
            {report.courseReports.map(cr => (
              <div key={cr.courseId}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{cr.courseName}</p>
                    <p className="text-xs text-slate-500">{cr.totalFeedbacks} feedbacks</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StarRating value={Math.round(cr.averageRating)} readOnly size={13} />
                    <span className="text-sm font-bold text-slate-600 min-w-[36px] text-right">
                      {cr.averageRating}
                    </span>
                  </div>
                </div>
                {/* Feedback volume bar */}
                <div className="h-1.5 bg-canvas-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-navy-600 to-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${(cr.totalFeedbacks / maxFeedback) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
