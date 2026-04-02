import { useEffect, useState } from 'react'
import { getAllCoursesApi, createCourseApi, deleteCourseApi } from '../../api/courseApi'
import { getUsersByRoleApi } from '../../api/userApi'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { BookOpen, PlusCircle, Trash2, Search, X } from 'lucide-react'

export default function ManageCourses() {
  const [courses, setCourses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ courseName: '', teacherId: '' })
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    Promise.all([getAllCoursesApi(), getUsersByRoleApi('TEACHER')])
      .then(([cRes, tRes]) => { setCourses(cRes.data); setTeachers(tRes.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await createCourseApi({ courseName: form.courseName, teacherId: Number(form.teacherId) })
      setToast({ type: 'success', message: 'Course created successfully' })
      setForm({ courseName: '', teacherId: '' })
      setShowForm(false)
      load()
    } catch {
      setToast({ type: 'error', message: 'Failed to create course' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCourseApi(id)
      setCourses(c => c.filter(x => x.id !== id))
      setToast({ type: 'success', message: 'Course deleted' })
    } catch {
      setToast({ type: 'error', message: 'Failed to delete course' })
    } finally {
      setConfirm(null)
    }
  }

  const filtered = courses.filter(c =>
    c.courseName?.toLowerCase().includes(search.toLowerCase())
  )

  const teacherName = (id) => teachers.find(t => t.id === id)?.name || `Teacher #${id}`

  return (
    <div className="animate-slide-up space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmDialog
          message="Delete this course? All associated feedback will remain but be orphaned."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <PageHeader
        title="Manage Courses"
        subtitle={`${courses.length} courses total`}
        action={
          <button onClick={() => setShowForm(v => !v)} className="btn-primary">
            {showForm ? <><X size={15} /> Cancel</> : <><PlusCircle size={15} /> New Course</>}
          </button>
        }
      />

      {/* Create form */}
      {showForm && (
        <div className="card p-6 border border-navy-200 animate-slide-up">
          <h2 className="font-semibold text-slate-700 mb-4">Create New Course</h2>
          <form onSubmit={handleCreate} className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="label">Course Name</label>
              <input
                className="input-field"
                placeholder="e.g. Introduction to Python"
                value={form.courseName}
                onChange={e => setForm(f => ({ ...f, courseName: e.target.value }))}
                required
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="label">Assign Teacher</label>
              <select
                className="input-field"
                value={form.teacherId}
                onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))}
                required
              >
                <option value="">— Select teacher —</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? <Spinner size="sm" /> : <><PlusCircle size={15} /> Create</>}
            </button>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="card p-3 border border-canvas-200">
        <div className="relative">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input-field pl-9 py-2.5 text-sm"
            placeholder="Search courses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card border border-canvas-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No courses found" icon={BookOpen} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-canvas-200 bg-canvas-50">
                <tr>
                  <th className="table-header">Course Name</th>
                  <th className="table-header">Teacher</th>
                  <th className="table-header">Course ID</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <BookOpen size={14} className="text-emerald-600" />
                        </div>
                        <span className="font-semibold text-slate-700">{c.courseName}</span>
                      </div>
                    </td>
                    <td className="table-cell text-slate-400">{teacherName(c.teacherId)}</td>
                    <td className="table-cell text-canvas-400 font-mono text-xs">#{c.id}</td>
                    <td className="table-cell">
                      <button onClick={() => setConfirm(c.id)} className="btn-danger py-1.5 px-3 text-xs">
                        <Trash2 size={13} /> Delete
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
