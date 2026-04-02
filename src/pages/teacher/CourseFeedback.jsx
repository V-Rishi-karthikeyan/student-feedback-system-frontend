import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { getFeedbackByCourseApi, getTeacherCoursesFeedbackApi } from '../../api/feedbackApi'
import { getMyCourseApi } from '../../api/courseApi'
import StarRating from '../../components/common/StarRating'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import { MessageSquare, Filter, Calendar, User } from 'lucide-react'

export default function CourseFeedback() {
  const location = useLocation()
  const [feedbacks, setFeedbacks] = useState([])
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(location.state?.courseId || '')
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState(0)

  useEffect(() => {
    getMyCourseApi()
      .then(r => setCourses(r.data))
      .catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    const fetch = selectedCourse
      ? getFeedbackByCourseApi(selectedCourse)
      : getTeacherCoursesFeedbackApi()

    fetch.then(r => setFeedbacks(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [selectedCourse])

  const filtered = filterRating ? feedbacks.filter(f => f.rating === filterRating) : feedbacks
  const avg = feedbacks.length
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : null

  return (
    <div className="animate-slide-up space-y-6">
      <PageHeader
        title="Course Feedback"
        subtitle={`${filtered.length} feedback entries ${avg ? `· avg ${avg}★` : ''}`}
      />

      {/* Filters */}
      <div className="card p-4 border border-canvas-200 flex flex-wrap gap-3 items-center">
        <Filter size={15} className="text-slate-500" />

        <select
          className="input-field max-w-xs text-sm py-2"
          value={selectedCourse}
          onChange={e => setSelectedCourse(e.target.value)}
        >
          <option value="">All my courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.courseName}</option>)}
        </select>

        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4, 5].map(r => (
            <button
              key={r}
              onClick={() => setFilterRating(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterRating === r
                  ? 'bg-navy-600 text-white'
                  : 'bg-canvas-100 text-slate-400 hover:bg-canvas-200'
              }`}
            >
              {r === 0 ? 'All' : `${r}★`}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card border border-canvas-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No feedback found" subtitle="Try changing the filters" icon={MessageSquare} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-canvas-200 bg-canvas-50">
                <tr>
                  <th className="table-header"><User size={12} className="inline mr-1" />Student</th>
                  <th className="table-header">Course</th>
                  <th className="table-header">Rating</th>
                  <th className="table-header">Comments</th>
                  <th className="table-header"><Calendar size={12} className="inline mr-1" />Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(fb => (
                  <tr key={fb.id} className="table-row">
                    <td className="table-cell font-medium text-slate-700">{fb.studentName}</td>
                    <td className="table-cell">{fb.courseName}</td>
                    <td className="table-cell">
                      <StarRating value={fb.rating} readOnly size={13} />
                    </td>
                    <td className="table-cell max-w-xs">
                      <p className="truncate text-slate-400">{fb.comments || <span className="italic text-slate-600">—</span>}</p>
                    </td>
                    <td className="table-cell text-slate-500 text-xs whitespace-nowrap">
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
