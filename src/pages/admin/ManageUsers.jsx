import { useEffect, useState } from 'react'
import { getAllUsersApi, deleteUserApi } from '../../api/userApi'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import Spinner from '../../components/common/Spinner'
import Toast from '../../components/common/Toast'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { Users, Trash2, Search, Shield, GraduationCap, BookOpen } from 'lucide-react'

const ROLE_META = {
  STUDENT: { label: 'Student', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: GraduationCap },
  TEACHER: { label: 'Teacher', color: 'text-gold-600 bg-yellow-50 border-yellow-200', icon: BookOpen },
  ADMIN:   { label: 'Admin',   color: 'text-navy-600 bg-navy-50 border-navy-200', icon: Shield },
}

export default function ManageUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [toast, setToast] = useState(null)
  const [confirm, setConfirm] = useState(null)

  const load = () => {
    setLoading(true)
    getAllUsersApi()
      .then(r => setUsers(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    try {
      await deleteUserApi(id)
      setUsers(u => u.filter(x => x.id !== id))
      setToast({ type: 'success', message: 'User removed successfully' })
    } catch {
      setToast({ type: 'error', message: 'Failed to delete user' })
    } finally {
      setConfirm(null)
    }
  }

  const filtered = users.filter(u => {
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchSearch
  })

  const counts = { ALL: users.length, STUDENT: 0, TEACHER: 0, ADMIN: 0 }
  users.forEach(u => { if (counts[u.role] !== undefined) counts[u.role]++ })

  return (
    <div className="animate-slide-up space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmDialog
          message="Remove this user from the system? This cannot be undone."
          onConfirm={() => handleDelete(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}

      <PageHeader
        title="Manage Users"
        subtitle={`${filtered.length} users shown`}
      />

      {/* Filters */}
      <div className="card p-4 border border-canvas-200 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            className="input-field pl-9 py-2 text-sm"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ALL', 'STUDENT', 'TEACHER', 'ADMIN'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === r
                  ? 'bg-navy-600 text-white'
                  : 'bg-canvas-100 text-slate-400 hover:bg-canvas-200'
              }`}
            >
              {r} ({counts[r]})
            </button>
          ))}
        </div>
      </div>

      <div className="card border border-canvas-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : filtered.length === 0 ? (
          <EmptyState title="No users found" icon={Users} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-canvas-200 bg-canvas-50">
                <tr>
                  <th className="table-header">User</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">ID</th>
                  <th className="table-header">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => {
                  const meta = ROLE_META[u.role] || ROLE_META.STUDENT
                  const initials = u.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                  return (
                    <tr key={u.id} className="table-row">
                      <td className="table-cell">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-navy-100 flex items-center justify-center text-xs font-bold text-navy-600 flex-shrink-0">
                            {initials}
                          </div>
                          <span className="font-semibold text-slate-700">{u.name}</span>
                        </div>
                      </td>
                      <td className="table-cell text-slate-400">{u.email}</td>
                      <td className="table-cell">
                        <span className={`badge border ${meta.color}`}>{meta.label}</span>
                      </td>
                      <td className="table-cell text-canvas-400 font-mono text-xs">#{u.id}</td>
                      <td className="table-cell">
                        <button
                          onClick={() => setConfirm(u.id)}
                          className="btn-danger py-1.5 px-3 text-xs"
                        >
                          <Trash2 size={13} /> Remove
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
