import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getAllCoursesApi } from '../../api/courseApi'
import { submitFeedbackApi } from '../../api/feedbackApi'
import StarRating from '../../components/common/StarRating'
import PageHeader from '../../components/common/PageHeader'
import Spinner from '../../components/common/Spinner'
import Toast from '../../components/common/Toast'
import { Send, BookOpen } from 'lucide-react'

export default function SubmitFeedback() {
  const location = useLocation()
  const navigate = useNavigate()

  const [courses, setCourses] = useState([])
  const [form, setForm] = useState({ courseId: location.state?.courseId || '', rating: 0, comments: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    getAllCoursesApi()
      .then(r => setCourses(r.data))
      .catch(console.error)
      .finally(() => setFetching(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.rating) return setToast({ type: 'error', message: 'Please select a rating' })
    setLoading(true)
    try {
      await submitFeedbackApi({ courseId: Number(form.courseId), rating: form.rating, comments: form.comments })
      setToast({ type: 'success', message: 'Feedback submitted successfully!' })
      setForm({ courseId: '', rating: 0, comments: '' })
      setTimeout(() => navigate('/student/my-feedback'), 1500)
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Submission failed' })
    } finally {
      setLoading(false)
    }
  }

  const selectedCourse = courses.find(c => c.id === Number(form.courseId))

  return (
    <div className="max-w-xl animate-slide-up">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <PageHeader title="Submit Feedback" subtitle="Share your experience with a course" />

      <div className="card p-8 border border-canvas-200">
        {fetching ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Course select */}
            <div>
              <label className="label">Select Course</label>
              <div className="relative">
                <BookOpen size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <select
                  className="input-field pl-10 appearance-none bg-white"
                  value={form.courseId}
                  onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))}
                  required
                >
                  <option value="">— Choose a course —</option>
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.courseName}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="label">Rating</label>
              <div className="flex items-center gap-4">
                <StarRating value={form.rating} onChange={r => setForm(f => ({ ...f, rating: r }))} size={28} />
                {form.rating > 0 && (
                  <span className="text-sm font-semibold text-gold-600">
                    {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][form.rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="label">Comments <span className="text-slate-600 normal-case font-normal">(optional)</span></label>
              <textarea
                className="input-field resize-none"
                rows={5}
                placeholder="Share your thoughts about the course, teaching style, materials..."
                value={form.comments}
                onChange={e => setForm(f => ({ ...f, comments: e.target.value }))}
                maxLength={1000}
              />
              <p className="text-xs text-slate-600 text-right mt-1">{form.comments.length}/1000</p>
            </div>

            {/* Preview strip */}
            {selectedCourse && form.rating > 0 && (
              <div className="rounded-xl bg-navy-50 border border-navy-200 p-4">
                <p className="text-xs font-semibold text-navy-600 uppercase tracking-wider mb-2">Preview</p>
                <p className="text-sm text-slate-600 font-medium">{selectedCourse.courseName}</p>
                <StarRating value={form.rating} readOnly size={14} />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => navigate(-1)} className="btn-secondary">Cancel</button>
              <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center">
                {loading ? <Spinner size="sm" /> : <><Send size={15} /> Submit Feedback</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
