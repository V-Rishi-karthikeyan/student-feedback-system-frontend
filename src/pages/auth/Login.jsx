import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  Eye, EyeOff, LogIn, Zap, ChevronRight,
  Star, MessageSquare, BarChart3, Users, BookOpen
} from 'lucide-react'
import Spinner from '../../components/common/Spinner'

const FEATURES = [
  { icon: MessageSquare, title: 'Structured Feedback',   desc: 'Students submit rich, rating-based course reviews' },
  { icon: BarChart3,     title: 'Live Analytics',        desc: 'Teachers see real-time feedback dashboards' },
  { icon: Users,         title: 'Role-Based Access',     desc: 'Student, Teacher and Admin portals — all secured' },
  { icon: BookOpen,      title: 'Course Management',     desc: 'Admins manage courses, users and system reports' },
]

const STATS = [
  { value: '12k+', label: 'Students' },
  { value: '480+', label: 'Courses'  },
  { value: '98%',  label: 'Satisfaction' },
]

const DEMO_CREDS = [
  { role: 'Student', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', email: 'alice@feedback.com',      pw: 'admin123' },
  { role: 'Teacher', color: 'text-gold-600 bg-yellow-50 border-yellow-200',        email: 'john.smith@feedback.com', pw: 'admin123' },
]

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()

  const [form,    setForm]    = useState({ email: '', password: '' })
  const [showPw,  setShowPw]  = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      const map  = { STUDENT: '/student/dashboard', TEACHER: '/teacher/dashboard', ADMIN: '/admin/dashboard' }
      navigate(map[user.role] || '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  const quickFill = (email, pw) => setForm({ email, password: pw })

  return (
    <div className="min-h-screen flex">

      {/* ── LEFT — form panel ── */}
      <div className="w-full lg:w-[46%] flex flex-col justify-center px-8 sm:px-14 py-10 bg-white animate-fade-in">

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 rounded-xl bg-navy-700 flex items-center justify-center shadow-sm">
            <Zap size={17} className="text-white" />
          </div>
          <span className="text-xl font-bold text-navy-900 font-sans tracking-tight">
            Edu<span className="text-navy-500">Pulse</span>
          </span>
        </div>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 font-display leading-tight mb-2">
            Welcome back
          </h1>
          <p className="text-slate-500 text-sm">
            Sign in to access your dashboard and course feedback.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-coral-500/10 border border-coral-500/20 text-coral-600 text-sm animate-slide-up">
            <span className="w-1.5 h-1.5 rounded-full bg-coral-500 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label mb-0">Password</label>
            </div>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                className="input-field pr-11"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
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

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base mt-1">
            {loading ? <Spinner size="sm" /> : <><LogIn size={17} /> Sign In</>}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-slate-500 mt-6">
          New to EduPulse?{' '}
          <Link to="/register" className="font-semibold text-navy-600 hover:text-navy-800 transition-colors">
            Create an account
          </Link>
        </p>

        {/* Demo credentials */}
        <div className="mt-8 pt-6 border-t border-canvas-200">
          <p className="text-xs font-semibold text-canvas-400 uppercase tracking-widest mb-3">
            Quick demo access
          </p>
          <div className="space-y-2">
            {DEMO_CREDS.map(d => (
              <button
                key={d.role}
                type="button"
                onClick={() => quickFill(d.email, d.pw)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-all hover:shadow-sm ${d.color}`}
              >
                <span className="font-semibold">{d.role}</span>
                <span className="font-mono opacity-70">{d.email}</span>
                <ChevronRight size={13} className="opacity-50" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT — brand panel ── */}
      <div className="hidden lg:flex lg:w-[54%] relative auth-left-panel overflow-hidden flex-col justify-between p-12">

        {/* Dot grid overlay */}
        <div className="auth-dot-grid absolute inset-0 pointer-events-none" />

        {/* Decorative rings */}
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full border border-white/5" />
        <div className="absolute -bottom-20 -right-20 w-[360px] h-[360px] rounded-full border border-white/8" />
        <div className="absolute top-20 right-0 w-64 h-64 bg-sapphire-500/10 rounded-full blur-3xl" />

        {/* Top — headline */}
        <div className="relative z-10 animate-slide-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 mb-6">
            <Star size={12} className="text-gold-400 fill-gold-400" />
            <span className="text-white/80 text-xs font-medium">Trusted by 12,000+ students</span>
          </div>
          <h2 className="text-4xl xl:text-5xl font-display font-bold text-white leading-[1.15] mb-5">
            Where student voices <br />
            <em className="not-italic text-sapphire-400">shape better courses.</em>
          </h2>
          <p className="text-white/55 text-base leading-relaxed max-w-md">
            EduPulse connects students, teachers, and administrators through meaningful feedback — turning course data into real improvements.
          </p>
        </div>

        {/* Middle — feature cards */}
        <div className="relative z-10 grid grid-cols-2 gap-3 my-8">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className="bg-white/7 backdrop-blur-sm border border-canvas-200 rounded-2xl p-4 hover:bg-white/10 transition-colors"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                <f.icon size={15} className="text-white/80" />
              </div>
              <p className="text-white text-sm font-semibold mb-1">{f.title}</p>
              <p className="text-white/45 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom — stats */}
        <div className="relative z-10 flex items-center gap-8 pt-6 border-t border-canvas-200">
          {STATS.map(s => (
            <div key={s.label}>
              <p className="text-2xl font-bold text-white font-display">{s.value}</p>
              <p className="text-white/45 text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
          <div className="ml-auto flex -space-x-2">
            {['#4f46e5','#0ea5e9','#10b981','#f59e0b'].map((c,i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-navy-900 flex items-center justify-center text-[9px] font-bold text-white" style={{ backgroundColor: c }}>
                {String.fromCharCode(65+i)}
              </div>
            ))}
            <div className="w-7 h-7 rounded-full border-2 border-navy-900 bg-white/15 flex items-center justify-center text-[9px] font-semibold text-white/80">
              +9k
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
