import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Zap, UserPlus, GraduationCap, BookOpen, CheckCircle } from 'lucide-react'
import Spinner from '../../components/common/Spinner'

const ROLES = [
  {
    value: 'STUDENT',
    label: 'Student',
    icon: GraduationCap,
    desc: 'Submit feedback and track your courses',
    color: 'border-emerald-400 bg-emerald-50 text-emerald-700',
    ring: 'ring-2 ring-emerald-400',
    idle: 'border-canvas-300 bg-white text-slate-600 hover:border-emerald-300',
  },
  {
    value: 'TEACHER',
    label: 'Teacher',
    icon: BookOpen,
    desc: 'Monitor and analyse course feedback',
    color: 'border-gold-400 bg-yellow-50 text-yellow-700',
    ring: 'ring-2 ring-gold-400',
    idle: 'border-canvas-300 bg-white text-slate-600 hover:border-gold-300',
  },
]

const PERKS = [
  'Role-based secure access',
  'Real-time feedback dashboards',
  'Detailed analytics & reports',
  'Instant course insights',
]

export default function Register() {
  const { register } = useAuth()
  const navigate      = useNavigate()

  const [form,    setForm]    = useState({ name: '', email: '', password: '', role: 'STUDENT' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await register(form)
      const map  = { STUDENT: '/student/dashboard', TEACHER: '/teacher/dashboard', ADMIN: '/admin/dashboard' }
      navigate(map[user.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT — form panel ── */}
      <div className="w-full lg:w-[50%] flex flex-col justify-center px-8 sm:px-14 py-10 bg-white animate-fade-in overflow-y-auto">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 rounded-xl bg-navy-700 flex items-center justify-center shadow-sm">
            <Zap size={17} className="text-white" />
          </div>
          <span className="text-xl font-bold text-navy-900 font-sans tracking-tight">
            Edu<span className="text-navy-500">Pulse</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-3xl font-bold text-slate-900 font-display leading-tight mb-2">
            Create your account
          </h1>
          <p className="text-slate-500 text-sm">
            Join thousands of students, teachers and admins on EduPulse.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-coral-500/10 border border-coral-500/20 text-coral-600 text-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="Your full name"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="label">Email address</label>
            <input
              type="email"
              className="input-field"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input-field pr-11"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-canvas-400 hover:text-slate-600 transition-colors"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Role selector */}
          <div>
            <label className="label">I am a…</label>
            <div className="grid grid-cols-3 gap-2.5">
              {ROLES.map(r => {
                const selected = form.role === r.value
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, role: r.value }))}
                    className={`relative p-3.5 rounded-xl border-2 text-left transition-all duration-200
                      ${selected ? `${r.color} ${r.ring} shadow-sm` : r.idle}`}
                  >
                    {selected && (
                      <CheckCircle size={13} className="absolute top-2 right-2 opacity-70" />
                    )}
                    <r.icon size={18} className="mb-2 opacity-80" />
                    <p className="text-xs font-bold leading-tight">{r.label}</p>
                    <p className="text-[10px] opacity-60 mt-0.5 leading-tight">{r.desc}</p>
                  </button>
                )
              })}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-1">
            {loading ? <Spinner size="sm" /> : <><UserPlus size={17} /> Create Account</>}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-navy-600 hover:text-navy-800 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* ── RIGHT — brand panel ── */}
      <div className="hidden lg:flex lg:w-[50%] relative auth-left-panel overflow-hidden flex-col justify-between p-12">

        <div className="auth-dot-grid absolute inset-0 pointer-events-none" />
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-navy-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sapphire-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-72 h-72 rounded-full border border-white/5" />

        {/* Top */}
        <div className="relative z-10 animate-slide-up">
          <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-[1.15] mb-4">
            The smarter way <br />
            <em className="not-italic text-sapphire-400">to improve education.</em>
          </h2>
          <p className="text-white/55 text-base leading-relaxed max-w-md">
            EduPulse gives every stakeholder a clear, structured way to give and receive feedback — closing the loop between learners and educators.
          </p>
        </div>

        {/* Perks */}
        <div className="relative z-10 space-y-3 my-8">
          {PERKS.map((p, i) => (
            <div key={p} className="flex items-center gap-3 animate-slide-up" style={{ animationDelay: `${i*80}ms` }}>
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
                <CheckCircle size={12} className="text-emerald-400" />
              </div>
              <span className="text-white/75 text-sm font-medium">{p}</span>
            </div>
          ))}
        </div>

        {/* Testimonial card */}
        <div className="relative z-10 bg-white/8 backdrop-blur-sm border border-white/12 rounded-2xl p-5">
          <div className="flex items-center gap-1 mb-3">
            {[1,2,3,4,5].map(s => <span key={s} className="text-gold-400 text-sm">★</span>)}
          </div>
          <p className="text-white/80 text-sm leading-relaxed italic font-display">
            "EduPulse completely changed how I understand my students' needs. The feedback loop is instant and actionable."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-navy-500 flex items-center justify-center text-xs font-bold text-white">JS</div>
            <div>
              <p className="text-white text-xs font-semibold">Dr. John Smith</p>
              <p className="text-white/40 text-xs">Professor of Computer Science</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
