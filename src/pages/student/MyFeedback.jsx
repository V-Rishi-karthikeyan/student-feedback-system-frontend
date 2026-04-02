import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyFeedbackApi } from '../../api/feedbackApi'
import StarRating from '../../components/common/StarRating'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import { MessageSquare, PlusCircle, Calendar } from 'lucide-react'

export default function MyFeedback() {
  const navigate = useNavigate()
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyFeedbackApi()
      .then(r => setFeedbacks(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const ratingColor = (r) => {
    if (r >= 4) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
    if (r === 3) return 'text-gold-600 bg-yellow-50 border-yellow-200'
    return 'text-coral-500 bg-coral-50 border-coral-200'
  }

  return (
    <div className="animate-slide-up space-y-6">
      <PageHeader
        title="My Feedback"
        subtitle={`${feedbacks.length} feedback${feedbacks.length !== 1 ? 's' : ''} submitted`}
        action={
          <button onClick={() => navigate('/student/submit-feedback')} className="btn-primary">
            <PlusCircle size={15} /> New Feedback
          </button>
        }
      />

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : feedbacks.length === 0 ? (
        <div className="card p-8 border border-canvas-200">
          <EmptyState
            title="No feedback yet"
            subtitle="Submit your first course feedback to see it here"
            icon={MessageSquare}
          />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {feedbacks.map(fb => (
            <div key={fb.id} className="card p-5 border border-canvas-200 hover:border-canvas-200 transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div className="bg-navy-50 p-2 rounded-xl">
                  <MessageSquare size={16} className="text-navy-600" />
                </div>
                <span className={`badge border ${ratingColor(fb.rating)}`}>
                  ★ {fb.rating}/5
                </span>
              </div>
              <h3 className="font-semibold text-slate-700 text-sm mb-1 line-clamp-1">{fb.courseName}</h3>
              <p className="text-xs text-slate-500 mb-3 line-clamp-3 min-h-[2.5rem]">
                {fb.comments || <span className="italic">No comments added</span>}
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-canvas-100">
                <StarRating value={fb.rating} readOnly size={13} />
                <div className="flex items-center gap-1 text-[10px] text-canvas-400">
                  <Calendar size={10} />
                  {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : '—'}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
