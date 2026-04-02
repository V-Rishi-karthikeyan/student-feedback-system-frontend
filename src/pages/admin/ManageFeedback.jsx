import { useEffect, useState } from 'react'
import { getAllFeedbackApi, deleteFeedbackApi } from '../../api/feedbackApi'
import StarRating from '../../components/common/StarRating'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { MessageSquare, Trash2, Search } from 'lucide-react'

export default function ManageFeedback() {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const load = () => {
    setLoading(true)
    getAllFeedbackApi()
      .then(r => setFeedbacks(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    setDeleting(id)
    try {
      await deleteFeedbackApi(id)
      setFeedbacks(f => f.filter(fb => fb.id !== id))
      setToast({ type: 'success', message: 'Feedback deleted successfully' })
    } catch {
      setToast({ type: 'error', message: 'Failed to delete feedback' })
    } finally {
      setDeleting(null)
      setConfirm(null)
    }
  }

  const filtered = feedbacks.filter(fb =>
    fb.studentName?.toLowerCase().includes(search.toLowerCase()) ||
    fb.courseName?.toLowerCase().includes(search.toLowerCase()) ||
    fb.comments?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="animate-slide-up space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmDialog
          message="Delete this feedback entry? This action cannot be undone."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <PageHeader
        title="All Feedback"
        subtitle={`${filtered.length} of ${feedbacks.length} entries`}
      />

      {/* Search */}
      <div className="card p-3 border border-canvas-200">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input-field pl-9 py-2.5 text-sm"
            placeholder="Search by student, course, or comment…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card border border-canvas-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No feedback found" subtitle="Try adjusting your search" icon={MessageSquare} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-canvas-200 bg-canvas-50">
                <tr>
                  <th className="table-header">Student</th>
                  <th className="table-header">Course</th>
                  <th className="table-header">Rating</th>
                  <th className="table-header">Comments</th>
                  <th className="table-header">Date</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(fb => (
                  <tr key={fb.id} className="table-row">
                    <td className="table-cell">
                      <span className="font-semibold text-slate-700">{fb.studentName}</span>
                    </td>
                    <td className="table-cell">{fb.courseName}</td>
                    <td className="table-cell">
                      <StarRating value={fb.rating} readOnly size={13} />
                    </td>
                    <td className="table-cell max-w-xs">
                      <p className="truncate text-slate-400 text-xs">{fb.comments || '—'}</p>
                    </td>
                    <td className="table-cell text-xs text-slate-500 whitespace-nowrap">
                      {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="table-cell">
                      <button
                        onClick={() => setConfirm(fb.id)}
                        disabled={deleting === fb.id}
                        className="btn-danger py-1.5 px-3 text-xs"
                      >
                        {deleting === fb.id ? <Spinner size="sm" /> : <><Trash2 size={13} /> Delete</>}
                      </button>
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
